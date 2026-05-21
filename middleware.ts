import { NextRequest, NextResponse } from "next/server";

const CMS_SESSION_COOKIE_NAME = "cms_session";
const VALID_ROLES = new Set(["admin", "editor", "viewer"]);

type CmsSessionPayload = {
  sub: string;
  email: string | null;
  role: string;
  exp: number;
};

function getSessionSecret(): string {
  return (
    process.env.CMS_SESSION_SECRET ||
    process.env.CMS_PREVIEW_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "cms-session-secret"
  );
}

function decodeBase64Url(value: string): Uint8Array | null {
  try {
    const base64 = value
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  } catch {
    return null;
  }
}

function toHex(bytes: Uint8Array): string {
  let hex = "";
  for (let index = 0; index < bytes.length; index += 1) {
    hex += bytes[index].toString(16).padStart(2, "0");
  }
  return hex;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

async function signPayload(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return toHex(new Uint8Array(signature));
}

async function hasValidCmsSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(CMS_SESSION_COOKIE_NAME)?.value;
  if (!token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = await signPayload(encodedPayload);
  if (!timingSafeEqualHex(expectedSignature, signature)) return false;

  const payloadBytes = decodeBase64Url(encodedPayload);
  if (!payloadBytes) return false;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(payloadBytes)
    ) as CmsSessionPayload;
    if (!payload || typeof payload !== "object") return false;
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return false;
    if (payload.email !== null && typeof payload.email !== "string") return false;
    if (!VALID_ROLES.has(payload.role)) return false;
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

function isPublicCmsPath(pathname: string): boolean {
  return pathname === "/cms/login";
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/cms/login", request.nextUrl.origin));
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL("/cms", request.nextUrl.origin));
  }

  if (pathname === "/cms" || pathname.startsWith("/cms/")) {
    if (isPublicCmsPath(pathname)) {
      return NextResponse.next();
    }

    const hasValidSession = await hasValidCmsSession(request);
    if (!hasValidSession) {
      const nextUrl = `${pathname}${search || ""}`;
      const loginUrl = new URL("/cms/login", request.nextUrl.origin);
      loginUrl.searchParams.set("next", nextUrl);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/cms/:path*"],
};
