import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import {
  clearMfaChallengeCookie,
  setMfaCookie,
  verifyMfaChallenge,
  verifyMfaCode,
} from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  if (!verifyMfaChallenge(request, auth.context.userId)) {
    return NextResponse.json(
      { error: "MFA challenge expired. Start a new challenge." },
      { status: 428 }
    );
  }

  const body = await parseJsonBody(request);
  const code =
    body && typeof body === "object" && typeof (body as { code?: unknown }).code === "string"
      ? (body as { code: string }).code
      : "";

  if (!verifyMfaCode(code)) {
    return NextResponse.json({ error: "Invalid MFA code." }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    mfa: {
      active: true,
      expiresInSeconds: 15 * 60,
    },
  });
  clearMfaChallengeCookie(response);
  setMfaCookie(response, auth.context.userId);
  return response;
}
