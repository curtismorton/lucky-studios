import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { startMfaChallenge } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  const result = await startMfaChallenge();

  if (!result.ok) {
    const status = result.code === "no_factor" ? 404 : 503;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({
    ok: true,
    factorId: result.factorId,
    challengeId: result.challengeId,
    expiresInSeconds: 300,
  });
}
