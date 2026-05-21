import { NextRequest, NextResponse } from "next/server";
import { clearMfaCookie } from "@/lib/cms/mfa";
import {
  createCmsSessionToken,
  setCmsSessionCookie,
} from "@/lib/cms/session";
import {
  findCmsCredentialUser,
  isCmsPasswordLoginEnabled,
  provisionCmsCredentialUser,
  verifyCmsCredentialPassword,
} from "@/lib/cms/credentials";

export const dynamic = "force-dynamic";

const CMS_LOGIN_NEXT_COOKIE_NAME = "cms_login_next";

function toSafeRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) return "/cms/home";
  if (value.startsWith("//")) return "/cms/home";
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
  if (!isCmsPasswordLoginEnabled()) {
    return NextResponse.json({ error: "credentials_disabled" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const username =
    body &&
    typeof body === "object" &&
    typeof (body as { username?: unknown }).username === "string"
      ? (body as { username: string }).username.trim()
      : "";
  const password =
    body &&
    typeof body === "object" &&
    typeof (body as { password?: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";
  const nextPath = toSafeRedirectPath(
    body &&
      typeof body === "object" &&
      typeof (body as { next?: unknown }).next === "string"
      ? (body as { next: string }).next
      : request.cookies.get(CMS_LOGIN_NEXT_COOKIE_NAME)?.value ?? "/cms/home"
  );

  if (!username || !password) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 400 });
  }

  try {
    const user = findCmsCredentialUser(username);
    if (!user || !verifyCmsCredentialPassword(user, password)) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const provisionedUser = await provisionCmsCredentialUser(user);
    const sessionToken = createCmsSessionToken({
      userId: provisionedUser.userId,
      email: provisionedUser.email,
      role: provisionedUser.role,
    });

    const response = NextResponse.json({ ok: true, redirectTo: nextPath });
    setCmsSessionCookie(response, sessionToken);
    clearMfaCookie(response);
    clearLoginNextCookie(response);
    return response;
  } catch (error) {
    console.error("CMS password auth failed:", error);
    return NextResponse.json({ error: "credentials_failed" }, { status: 500 });
  }
}
