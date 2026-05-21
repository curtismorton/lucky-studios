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
type OtpType = "email" | "recovery" | "invite" | "magiclink" | "email_change";

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

function redirectWithError(request: NextRequest, errorCode: string) {
  const response = NextResponse.redirect(
    new URL(
      `/cms/login?error=${encodeURIComponent(errorCode)}`,
      request.nextUrl.origin
    )
  );
  clearLoginNextCookie(response);
  return response;
}

function parseOtpType(value: string | null): OtpType {
  switch (value) {
    case "email":
    case "recovery":
    case "invite":
    case "magiclink":
    case "email_change":
      return value;
    default:
      return "magiclink";
  }
}

function mapOAuthErrorToLoginCode(request: NextRequest): string {
  const oauthError = request.nextUrl.searchParams.get("error")?.toLowerCase() ?? "";
  const oauthErrorCode =
    request.nextUrl.searchParams.get("error_code")?.toLowerCase() ?? "";
  const oauthDescription =
    request.nextUrl.searchParams.get("error_description")?.toLowerCase() ?? "";

  if (oauthError === "access_denied") {
    return "oauth_access_denied";
  }

  if (
    oauthErrorCode === "provider_disabled" ||
    (oauthDescription.includes("provider") && oauthDescription.includes("enabled"))
  ) {
    return "google_not_enabled";
  }

  if (
    oauthErrorCode === "redirect_url_not_allowed" ||
    (oauthDescription.includes("redirect") &&
      (oauthDescription.includes("allow") ||
        oauthDescription.includes("invalid") ||
        oauthDescription.includes("mismatch")))
  ) {
    return "oauth_redirect_mismatch";
  }

  return "oauth_failed";
}

function renderHashBridgePage(): NextResponse {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>CMS Sign In</title>
  </head>
  <body style="font-family: system-ui, sans-serif; background:#020617; color:#f8fafc; display:grid; place-items:center; min-height:100vh; margin:0;">
    <p>Completing sign in...</p>
    <script>
      (async function() {
        try {
          var hash = window.location.hash && window.location.hash.startsWith("#")
            ? window.location.hash.slice(1)
            : "";
          var params = new URLSearchParams(hash);
          var accessToken = params.get("access_token");
          if (!accessToken) {
            window.location.replace("/cms/login?error=missing_token");
            return;
          }
          var response = await fetch("/api/cms/auth/exchange", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: accessToken })
          });
          var payload = await response.json().catch(function() { return null; });
          if (!response.ok) {
            var code = payload && payload.error ? payload.error : "invalid_link";
            window.location.replace("/cms/login?error=" + encodeURIComponent(code));
            return;
          }
          window.location.replace(
            payload && payload.redirectTo ? payload.redirectTo : "/cms"
          );
        } catch (_) {
          window.location.replace("/cms/login?error=callback_failed");
        }
      })();
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function GET(request: NextRequest) {
  const oauthError =
    request.nextUrl.searchParams.get("error") ??
    request.nextUrl.searchParams.get("error_code");
  if (oauthError) {
    return redirectWithError(request, mapOAuthErrorToLoginCode(request));
  }

  const code = request.nextUrl.searchParams.get("code");
  const tokenHash =
    request.nextUrl.searchParams.get("token_hash") ??
    request.nextUrl.searchParams.get("token");
  const type = parseOtpType(request.nextUrl.searchParams.get("type"));
  const accessToken = request.nextUrl.searchParams.get("access_token");
  const nextPath = toSafeRedirectPath(
    request.nextUrl.searchParams.get("next") ??
      request.cookies.get(CMS_LOGIN_NEXT_COOKIE_NAME)?.value ??
      null
  );

  if (!code && !tokenHash && !accessToken) {
    return renderHashBridgePage();
  }

  try {
    const supabase = createPublicServerClient();
    let user: { id: string; email?: string | null } | null = null;
    let authError: string | null = null;

    if (code) {
      const exchangeResult = await supabase.auth.exchangeCodeForSession(code);
      authError = exchangeResult.error?.message ?? null;
      const exchangeData = exchangeResult.data as
        | {
            user?: { id: string; email?: string | null } | null;
            session?: {
              user?: { id: string; email?: string | null } | null;
            } | null;
          }
        | null;
      const exchangeUser =
        exchangeData?.user ?? exchangeData?.session?.user ?? null;
      user = exchangeUser
        ? {
            id: exchangeUser.id,
            email: exchangeUser.email ?? null,
          }
        : null;
    } else if (accessToken) {
      const { data, error } = await supabase.auth.getUser(accessToken);
      authError = error?.message ?? null;
      user = data?.user
        ? {
            id: data.user.id,
            email: data.user.email ?? null,
          }
        : null;
    } else {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash as string,
        type,
      });
      authError = error?.message ?? null;
      user = data?.user
        ? {
            id: data.user.id,
            email: data.user.email ?? null,
          }
        : null;
    }

    if (authError || !user) {
      return redirectWithError(request, "invalid_link");
    }

    if (!isAllowedCmsEmail(user.email ?? null)) {
      return redirectWithError(request, "email_not_allowed");
    }

    const role = await resolveRoleForUser(user.id, user.email ?? null);
    if (!role) {
      return redirectWithError(request, "no_role");
    }

    const sessionToken = createCmsSessionToken({
      userId: user.id,
      email: user.email ?? null,
      role,
    });

    const response = NextResponse.redirect(
      new URL(nextPath, request.nextUrl.origin)
    );
    setCmsSessionCookie(response, sessionToken);
    clearMfaCookie(response);
    clearLoginNextCookie(response);
    return response;
  } catch (error) {
    console.error("CMS auth callback failed:", error);
    return redirectWithError(request, "callback_failed");
  }
}
