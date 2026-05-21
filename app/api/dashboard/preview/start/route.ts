import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import { createPreviewToken, getPreviewCookieName } from "@/lib/cms/preview";
import { requireActiveMfa } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;
  const mfa = requireActiveMfa(request, auth.context.userId);
  if (!mfa.ok) return mfa.response;

  const body = await parseJsonBody(request);
  const maxAgeSeconds =
    body &&
    typeof body === "object" &&
    typeof (body as { maxAgeSeconds?: unknown }).maxAgeSeconds === "number" &&
    Number.isFinite((body as { maxAgeSeconds: number }).maxAgeSeconds)
      ? Math.min(
          Math.max(Math.floor((body as { maxAgeSeconds: number }).maxAgeSeconds), 60),
          6 * 60 * 60
        )
      : 60 * 60;

  const token = createPreviewToken(auth.context.userId, maxAgeSeconds);
  const response = NextResponse.json({
    ok: true,
    previewActive: true,
    expiresInSeconds: maxAgeSeconds,
  });

  response.cookies.set(getPreviewCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });

  return response;
}
