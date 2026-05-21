import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import {
  createMfaChallengeToken,
  isMfaCodeConfigured,
  setMfaChallengeCookie,
} from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  if (!isMfaCodeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin MFA is not configured. Set CMS_ADMIN_MFA_CODE in the environment.",
      },
      { status: 503 }
    );
  }

  const challengeToken = createMfaChallengeToken(auth.context.userId);
  const response = NextResponse.json({
    ok: true,
    method: "code",
    expiresInSeconds: 5 * 60,
  });
  setMfaChallengeCookie(response, challengeToken);
  return response;
}
