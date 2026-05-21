import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { isMfaActiveForUser } from "@/lib/cms/mfa";
import {
  createCmsSessionToken,
  setCmsSessionCookie,
} from "@/lib/cms/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  const response = NextResponse.json({
    user: auth.context,
    mfa: {
      active: isMfaActiveForUser(request, auth.context.userId),
    },
  });

  // Refresh the HttpOnly CMS session cookie on each session check.
  const sessionToken = createCmsSessionToken({
    userId: auth.context.userId,
    email: auth.context.email,
    role: auth.context.role,
  });
  setCmsSessionCookie(response, sessionToken);
  return response;
}
