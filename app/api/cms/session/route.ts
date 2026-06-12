import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { isMfaActive } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  const mfaActive = await isMfaActive();

  return NextResponse.json({
    user: auth.context,
    mfa: { active: mfaActive },
  });
}
