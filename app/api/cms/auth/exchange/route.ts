import { NextRequest, NextResponse } from "next/server";
import { isAllowedCmsEmail } from "@/lib/cms/access";
import { resolveRoleForUser } from "@/lib/cms/auth";
import { clearMfaCookie } from "@/lib/cms/mfa";
import {
  createCmsSessionToken,
  setCmsSessionCookie,
} from "@/lib/cms/session";
import { createPublicServerClient } from "@/lib/cms/supabase";

export const dynamic = "force-dynamic";

const CMS_LOGIN_NEXT_COOKIE_NAME = "cms_login_next";

function toSafeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/")) return "/cms";
  if (value.startsWith("//")) return "/cms";
  return value;
}

function clearLoginNextCookie(response: NextResponse) {
  response.cookies.set(CMS_LOGIN_NEXT_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const accessToken =
    body &&
    typeof body === "object" &&
    typeof (body as { accessToken?: unknown }).accessToken === "string"
      ? (body as { accessToken: string }).accessToken.trim()
      : "";
  const nextPath = toSafeRedirectPath(
    body &&
      typeof body === "object" &&
      typeof (body as { next?: unknown }).next === "string"
      ? (body as { next: string }).next
      : request.cookies.get(CMS_LOGIN_NEXT_COOKIE_NAME)?.value ?? null
  );

  if (!accessToken) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  try {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data?.user) {
      return NextResponse.json({ error: "invalid_link" }, { status: 401 });
    }

    if (!isAllowedCmsEmail(data.user.email ?? null)) {
      return NextResponse.json({ error: "email_not_allowed" }, { status: 403 });
    }

    const role = await resolveRoleForUser(data.user.id, data.user.email ?? null);
    if (!role) {
      return NextResponse.json({ error: "no_role" }, { status: 403 });
    }

    const sessionToken = createCmsSessionToken({
      userId: data.user.id,
      email: data.user.email ?? null,
      role,
    });

    const response = NextResponse.json({ ok: true, redirectTo: nextPath });
    setCmsSessionCookie(response, sessionToken);
    clearMfaCookie(response);
    clearLoginNextCookie(response);
    return response;
  } catch (error) {
    console.error("CMS auth exchange failed:", error);
    return NextResponse.json({ error: "callback_failed" }, { status: 500 });
  }
}
