import { NextRequest, NextResponse } from "next/server";
import {
  getAllowedCmsEmailHint,
  isAllowedCmsEmail,
} from "@/lib/cms/access";
import { resolveCmsAuthOrigin } from "@/lib/cms/auth-origin";
import { createPublicServerClient } from "@/lib/cms/supabase";

export const dynamic = "force-dynamic";
const CMS_LOGIN_NEXT_COOKIE_NAME = "cms_login_next";

function toSafeCmsPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email =
    body && typeof body === "object" && typeof (body as { email?: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : "";
  const next =
    body && typeof body === "object" && typeof (body as { next?: unknown }).next === "string"
      ? (body as { next: string }).next
      : "/cms/home";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  if (!isAllowedCmsEmail(email)) {
    return NextResponse.json(
      { error: `Use your ${getAllowedCmsEmailHint()} work email to sign in.` },
      { status: 403 }
    );
  }

  try {
    const supabase = createPublicServerClient();
    const safeNext = toSafeCmsPath(next, "/cms/home");
    // Supabase redirect allow-lists are exact URL matches, so keep `next`
    // in a cookie instead of the callback query string.
    const redirectTo = new URL("/api/cms/auth/callback", resolveCmsAuthOrigin(request));
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo.toString(),
        shouldCreateUser: true,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to send magic link." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      message: "Magic link sent. Check your inbox.",
    });
    response.cookies.set(CMS_LOGIN_NEXT_COOKIE_NAME, safeNext, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send magic link.",
      },
      { status: 500 }
    );
  }
}
