import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { requireActiveMfa } from "@/lib/cms/mfa";
import { getPreviewCookieName } from "@/lib/cms/preview";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;
  const mfa = await requireActiveMfa(request, auth.context.userId);
  if (!mfa.ok) return mfa.response;

  const response = NextResponse.json({
    ok: true,
    previewActive: false,
  });

  response.cookies.set(getPreviewCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
