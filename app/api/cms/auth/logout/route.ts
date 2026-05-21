import { NextRequest, NextResponse } from "next/server";
import { clearMfaChallengeCookie, clearMfaCookie } from "@/lib/cms/mfa";
import { clearCmsSessionCookie } from "@/lib/cms/session";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  clearCmsSessionCookie(response);
  clearMfaCookie(response);
  clearMfaChallengeCookie(response);
  return response;
}
