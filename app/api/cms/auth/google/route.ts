import { NextRequest, NextResponse } from "next/server";
import { resolveCmsAuthOrigin } from "@/lib/cms/auth-origin";
import { createPublicServerClient } from "@/lib/cms/supabase";

export const dynamic = "force-dynamic";

const CMS_LOGIN_NEXT_COOKIE_NAME = "cms_login_next";

function toSafeCmsPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

function redirectToLogin(request: NextRequest, errorCode: string): NextResponse {
  return NextResponse.redirect(
    new URL(`/cms/login?error=${encodeURIComponent(errorCode)}`, request.nextUrl.origin)
  );
}

function isGoogleOauthEnabledByConfig(): boolean {
  return process.env.CMS_ENABLE_GOOGLE_OAUTH?.trim().toLowerCase() === "true";
}

async function isGoogleProviderEnabled(): Promise<boolean | null> {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;

  try {
    const response = await fetch(`${url.replace(/\/+$/, "")}/auth/v1/settings`, {
      headers: {
        apikey: anonKey,
      },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const payload = (await response.json().catch(() => null)) as
      | { external?: { google?: boolean } }
      | null;
    if (!payload?.external || typeof payload.external.google !== "boolean") {
      return null;
    }

    return payload.external.google;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const safeNext = toSafeCmsPath(
    request.nextUrl.searchParams.get("next"),
    "/cms/home"
  );

  if (!isGoogleOauthEnabledByConfig()) {
    return redirectToLogin(request, "use_email_link");
  }

  try {
    const googleEnabled = await isGoogleProviderEnabled();
    if (googleEnabled === false) {
      return redirectToLogin(request, "google_not_enabled");
    }

    const supabase = createPublicServerClient();
    // Supabase redirect allow-lists are exact URL matches, so keep `next`
    // in a cookie instead of the callback query string.
    const redirectTo = new URL("/api/cms/auth/callback", resolveCmsAuthOrigin(request));

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
        skipBrowserRedirect: true,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error || !data?.url) {
      const message = (error?.message || "").toLowerCase();
      const code = message.includes("provider") && message.includes("enabled")
        ? "google_not_enabled"
        : "oauth_start_failed";
      return redirectToLogin(request, code);
    }

    const response = NextResponse.redirect(data.url);
    response.cookies.set(CMS_LOGIN_NEXT_COOKIE_NAME, safeNext, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
    });
    return response;
  } catch {
    return redirectToLogin(request, "oauth_start_failed");
  }
}
