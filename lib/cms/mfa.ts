import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { createCmsRouteClient } from "@/lib/cms/supabase-ssr";

export type MfaChallengeResult = {
  factorId: string;
  challengeId: string;
};

// Returns true when the current Supabase session is at AAL2 (TOTP verified).
export async function isMfaActive(): Promise<boolean> {
  const supabase = await createCmsRouteClient();
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || !data) return false;
  return data.currentLevel === "aal2";
}

// Returns the first enrolled TOTP factor for the current session user, or null.
export async function getTotpFactor(): Promise<{ id: string; friendlyName: string | null } | null> {
  const supabase = await createCmsRouteClient();
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error || !data) return null;
  const factor = data.totp[0] ?? null;
  if (!factor) return null;
  return { id: factor.id, friendlyName: factor.friendly_name ?? null };
}

// Issues a TOTP challenge and returns factorId + challengeId for the client.
export async function startMfaChallenge(): Promise<
  | { ok: true; factorId: string; challengeId: string }
  | { ok: false; error: string; code?: "no_factor" }
> {
  const factor = await getTotpFactor();
  if (!factor) {
    return { ok: false, error: "No TOTP factor enrolled.", code: "no_factor" };
  }

  const supabase = await createCmsRouteClient();
  const { data, error } = await supabase.auth.mfa.challenge({
    factorId: factor.id,
  });

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Failed to start MFA challenge." };
  }

  return { ok: true, factorId: factor.id, challengeId: data.id };
}

// Verifies a TOTP code against an active challenge, upgrading the session to AAL2.
export async function verifyMfaChallenge(
  factorId: string,
  challengeId: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createCmsRouteClient();
  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId,
    code: code.trim(),
  });

  if (error) {
    return { ok: false, error: error.message ?? "Invalid TOTP code." };
  }

  return { ok: true };
}

// Enrolls a new TOTP factor. Returns a QR code URI and the factor ID.
export async function enrollTotpFactor(friendlyName: string): Promise<
  | { ok: true; factorId: string; qrCode: string; secret: string }
  | { ok: false; error: string }
> {
  const supabase = await createCmsRouteClient();
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName,
    issuer: "Lucky Studios CMS",
  });

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Failed to enroll TOTP factor." };
  }

  return {
    ok: true,
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

// Unenrolls a TOTP factor by ID.
export async function unenrollTotpFactor(
  factorId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createCmsRouteClient();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) {
    return { ok: false, error: error.message ?? "Failed to remove TOTP factor." };
  }
  return { ok: true };
}

export function buildMfaRequiredResponse(): NextResponse<{
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

// Used by route handlers that require an AAL2 session before proceeding.
// The request and userId params are kept for backward-compatible call sites.
export async function requireActiveMfa(
  _request: NextRequest,
  _userId: string
): Promise<
  | { ok: true }
  | { ok: false; response: NextResponse<{ error: string; code: string }> }
> {
  const active = await isMfaActive();
  if (active) return { ok: true };
  return { ok: false, response: buildMfaRequiredResponse() };
}
