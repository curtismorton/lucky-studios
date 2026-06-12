import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import { verifyMfaChallenge } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request);
  const obj = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const factorId = typeof obj.factorId === "string" ? obj.factorId.trim() : "";
  const challengeId = typeof obj.challengeId === "string" ? obj.challengeId.trim() : "";
  const code = typeof obj.code === "string" ? obj.code.trim() : "";

  if (!factorId || !challengeId || !code) {
    return NextResponse.json(
      { error: "factorId, challengeId, and code are required." },
      { status: 400 }
    );
  }

  const result = await verifyMfaChallenge(factorId, challengeId, code);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    mfa: { active: true, expiresInSeconds: 900 },
  });
}
