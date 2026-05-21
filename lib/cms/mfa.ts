import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest, NextResponse as NextResponseType } from "next/server";

type CmsMfaPayload = {
  sub: string;
  exp: number;
};

type CmsMfaChallengePayload = {
  sub: string;
  nonce: string;
  exp: number;
};

const CMS_MFA_COOKIE_NAME = "cms_mfa";
const CMS_MFA_CHALLENGE_COOKIE_NAME = "cms_mfa_challenge";
const MFA_MAX_AGE_SECONDS = 15 * 60;
const MFA_CHALLENGE_MAX_AGE_SECONDS = 5 * 60;

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

function getMfaSecret(): string {
  return (
    process.env.CMS_MFA_SECRET ||
    process.env.CMS_PREVIEW_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "cms-mfa-secret"
  );
}

function signPayload(value: string): string {
  return createHmac("sha256", getMfaSecret()).update(value).digest("hex");
}

function createSignedToken(payload: CmsMfaPayload | CmsMfaChallengePayload): string {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifySignedToken<TPayload>(token: string): TPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length) return null;
  if (!timingSafeEqual(expectedBuffer, signatureBuffer)) return null;

  try {
    const parsed = JSON.parse(decodeBase64Url(encodedPayload).toString("utf8"));
    return parsed as TPayload;
  } catch {
    return null;
  }
}

function getAdminMfaCode(): string | null {
  const code = process.env.CMS_ADMIN_MFA_CODE?.trim();
  if (!code) return null;
  return code;
}

export function isMfaCodeConfigured(): boolean {
  return Boolean(getAdminMfaCode());
}

export function getCmsMfaCookieName(): string {
  return CMS_MFA_COOKIE_NAME;
}

export function getCmsMfaChallengeCookieName(): string {
  return CMS_MFA_CHALLENGE_COOKIE_NAME;
}

export function createMfaChallengeToken(userId: string): string {
  return createSignedToken({
    sub: userId,
    nonce: randomUUID(),
    exp: Math.floor(Date.now() / 1000) + MFA_CHALLENGE_MAX_AGE_SECONDS,
  });
}

export function setMfaChallengeCookie(response: NextResponse, token: string) {
  response.cookies.set(CMS_MFA_CHALLENGE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MFA_CHALLENGE_MAX_AGE_SECONDS,
  });
}

export function clearMfaChallengeCookie(response: NextResponse) {
  response.cookies.set(CMS_MFA_CHALLENGE_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function verifyMfaChallenge(request: NextRequest, userId: string): boolean {
  const token = request.cookies.get(CMS_MFA_CHALLENGE_COOKIE_NAME)?.value;
  if (!token) return false;

  const payload = verifySignedToken<CmsMfaChallengePayload>(token);
  if (!payload) return false;
  if (payload.sub !== userId) return false;
  if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
    return false;
  }
  return typeof payload.nonce === "string" && payload.nonce.length > 0;
}

export function setMfaCookie(response: NextResponse, userId: string) {
  const token = createSignedToken({
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + MFA_MAX_AGE_SECONDS,
  });

  response.cookies.set(CMS_MFA_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MFA_MAX_AGE_SECONDS,
  });
}

export function clearMfaCookie(response: NextResponse) {
  response.cookies.set(CMS_MFA_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function isMfaActiveForUser(request: NextRequest, userId: string): boolean {
  const token = request.cookies.get(CMS_MFA_COOKIE_NAME)?.value;
  if (!token) return false;

  const payload = verifySignedToken<CmsMfaPayload>(token);
  if (!payload) return false;
  if (payload.sub !== userId) return false;
  return typeof payload.exp === "number" && payload.exp >= Math.floor(Date.now() / 1000);
}

export function verifyMfaCode(code: string): boolean {
  const configuredCode = getAdminMfaCode();
  if (!configuredCode) return false;

  const candidate = code.trim();
  const expected = Buffer.from(configuredCode, "utf8");
  const actual = Buffer.from(candidate, "utf8");

  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export function buildMfaRequiredResponse(): NextResponseType<{
  error: string;
  code: string;
}> {
  return NextResponse.json(
    {
      error: "Admin MFA verification is required for this action.",
      code: "mfa_required",
    },
    { status: 428 }
  );
}

export function requireActiveMfa(
  request: NextRequest,
  userId: string
): { ok: true } | { ok: false; response: NextResponseType<{ error: string; code: string }> } {
  if (isMfaActiveForUser(request, userId)) {
    return { ok: true };
  }

  return {
    ok: false,
    response: buildMfaRequiredResponse(),
  };
}
