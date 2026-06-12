import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import { enrollTotpFactor, getTotpFactor, unenrollTotpFactor } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

// GET — returns the current user's TOTP factor status.
export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  const factor = await getTotpFactor();
  return NextResponse.json({
    enrolled: Boolean(factor),
    factorId: factor?.id ?? null,
    friendlyName: factor?.friendlyName ?? null,
  });
}

// POST — begin TOTP enrollment; returns QR code and secret for the authenticator app.
export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  const friendlyName = auth.context.email ?? auth.context.userId;
  const result = await enrollTotpFactor(friendlyName);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    factorId: result.factorId,
    qrCode: result.qrCode,
    secret: result.secret,
  });
}

// DELETE — remove a TOTP factor (requires factorId in request body).
export async function DELETE(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  const body = await parseJsonBody(request);
  const factorId =
    body && typeof body === "object" && typeof (body as { factorId?: unknown }).factorId === "string"
      ? (body as { factorId: string }).factorId.trim()
      : "";

  if (!factorId) {
    return NextResponse.json({ error: "factorId is required." }, { status: 400 });
  }

  const result = await unenrollTotpFactor(factorId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
