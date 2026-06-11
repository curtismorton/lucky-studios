import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const PREVIEW_COOKIE_NAME = "cms_preview_token";
const PREVIEW_DEFAULT_MAX_AGE_SECONDS = 60 * 60;

type PreviewPayload = {
  sub: string;
  exp: number;
};

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

function getPreviewSecret(): string {
  return (
    process.env.CMS_PREVIEW_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.CMS_ADMIN_TOKEN ||
    "cms-preview-secret"
  );
}

function signPayload(value: string): string {
  return createHmac("sha256", getPreviewSecret()).update(value).digest("hex");
}

export function createPreviewToken(
  userId: string,
  maxAgeSeconds = PREVIEW_DEFAULT_MAX_AGE_SECONDS
): string {
  const payload: PreviewPayload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifyPreviewToken(token: string): PreviewPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = signPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length) return null;
  if (!timingSafeEqual(expectedBuffer, signatureBuffer)) return null;

  try {
    const payload = JSON.parse(
      decodeBase64Url(encodedPayload).toString("utf8")
    ) as PreviewPayload;
    if (!payload || typeof payload !== "object") return null;
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null;
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getPreviewCookieName(): string {
  return PREVIEW_COOKIE_NAME;
}

export async function isCmsPreviewActive(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(PREVIEW_COOKIE_NAME)?.value;
    if (!token) return false;
    return Boolean(verifyPreviewToken(token));
  } catch {
    return false;
  }
}
