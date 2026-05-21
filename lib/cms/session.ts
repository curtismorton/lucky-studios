import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextResponse } from "next/server";
import type { CmsRole } from "@/lib/cms/types";

export type CmsSessionPayload = {
  sub: string;
  email: string | null;
  role: CmsRole;
  exp: number;
};

const CMS_SESSION_COOKIE_NAME = "cms_session";
const DEFAULT_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function encodeBase64Url(input: Buffer | string): string {
  const raw = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return raw
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string): Buffer {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64");
}

function getSessionSecret(): string {
  return (
    process.env.CMS_SESSION_SECRET ||
    process.env.CMS_PREVIEW_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "cms-session-secret"
  );
}

function signPayload(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function getCmsSessionCookieName(): string {
  return CMS_SESSION_COOKIE_NAME;
}

export function createCmsSessionToken(
  input: {
    userId: string;
    email: string | null;
    role: CmsRole;
  },
  maxAgeSeconds = DEFAULT_SESSION_MAX_AGE_SECONDS
): string {
  const payload: CmsSessionPayload = {
    sub: input.userId,
    email: input.email,
    role: input.role,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyCmsSessionToken(token: string): CmsSessionPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length) return null;
  if (!timingSafeEqual(expectedBuffer, signatureBuffer)) return null;

  try {
    const payload = JSON.parse(
      decodeBase64Url(encodedPayload).toString("utf8")
    ) as CmsSessionPayload;

    if (!payload || typeof payload !== "object") return null;
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null;
    if (payload.email !== null && typeof payload.email !== "string") return null;
    if (
      payload.role !== "admin" &&
      payload.role !== "editor" &&
      payload.role !== "viewer"
    ) {
      return null;
    }
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function setCmsSessionCookie(
  response: NextResponse,
  token: string,
  maxAgeSeconds = DEFAULT_SESSION_MAX_AGE_SECONDS
) {
  response.cookies.set(CMS_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export function clearCmsSessionCookie(response: NextResponse) {
  response.cookies.set(CMS_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
