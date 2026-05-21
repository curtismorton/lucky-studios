"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const KNOWN_ERROR_CODES = [
  "no_role",
  "email_not_allowed",
  "use_email_link",
  "google_not_enabled",
  "oauth_start_failed",
  "oauth_failed",
  "oauth_access_denied",
  "oauth_redirect_mismatch",
  "invalid_link",
  "missing_token",
  "callback_failed",
];

type LoginResponse =
  | {
      ok?: boolean;
      error?: string;
      message?: string;
      redirectTo?: string;
    }
  | null;

function getPasswordErrorMessage(error: string | undefined): string {
  if (error === "credentials_disabled") {
    return "Username/password sign-in is disabled.";
  }
  if (error === "invalid_credentials") {
    return "Incorrect username or password.";
  }
  if (error === "credentials_failed") {
    return "Could not complete username/password sign-in.";
  }

  return "Could not complete username/password sign-in.";
}

export default function CmsLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
            <h1 className="text-2xl font-semibold">CMS Login</h1>
            <p className="mt-2 text-sm text-slate-400">Loading login form...</p>
          </div>
        </main>
      }
    >
      <CmsLoginContent />
    </Suspense>
  );
}

function CmsLoginContent() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [magicLinkSubmitting, setMagicLinkSubmitting] = useState(false);
  const [magicLinkStatus, setMagicLinkStatus] = useState<string | null>(null);

  const nextPath = useMemo(() => {
    const value = searchParams.get("next");
    if (!value || !value.startsWith("/")) return "/cms/home";
    return value;
  }, [searchParams]);

  const errorCode = searchParams.get("error");

  async function onPasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordSubmitting(true);
    setPasswordStatus(null);

    try {
      const response = await fetch("/api/cms/auth/password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          next: nextPath,
        }),
      });

      const payload = (await response.json().catch(() => null)) as LoginResponse;
      if (!response.ok) {
        setPasswordStatus(getPasswordErrorMessage(payload?.error));
        return;
      }

      window.location.assign(payload?.redirectTo || nextPath);
    } catch {
      setPasswordStatus("Could not complete username/password sign-in.");
    } finally {
      setPasswordSubmitting(false);
    }
  }

  async function onMagicLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMagicLinkSubmitting(true);
    setMagicLinkStatus(null);

    try {
      const response = await fetch("/api/cms/auth/magic-link", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          next: nextPath,
        }),
      });

      const payload = (await response.json().catch(() => null)) as LoginResponse;

      if (!response.ok) {
        setMagicLinkStatus(payload?.error || "Could not send sign-in link.");
        return;
      }

      setMagicLinkStatus(
        payload?.message || "Check your inbox for a one-time sign-in link."
      );
    } catch {
      setMagicLinkStatus("Could not send sign-in link.");
    } finally {
      setMagicLinkSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-2xl font-semibold">CMS Login</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with your CMS email or username and password, or request a
          one-time magic link to your Socially Powerful email.
        </p>

        {errorCode ? (
          <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            {errorCode === "no_role" &&
              "Your company account signed in, but CMS access has not been provisioned correctly."}
            {errorCode === "email_not_allowed" &&
              "Use your @sociallypowerful.com work email to sign in."}
            {errorCode === "use_email_link" &&
              "Google sign-in is disabled. Use the password or email login options below."}
            {errorCode === "google_not_enabled" &&
              "Google OAuth is disabled for the CMS login flow."}
            {errorCode === "oauth_start_failed" &&
              "Could not start sign-in. Try again in a moment."}
            {errorCode === "oauth_failed" &&
              "The legacy OAuth callback failed. Use the password or email login options below."}
            {errorCode === "oauth_access_denied" &&
              "The legacy OAuth sign-in was canceled before completion."}
            {errorCode === "oauth_redirect_mismatch" &&
              "The legacy OAuth redirect URL is not allowed."}
            {(errorCode === "invalid_link" ||
              errorCode === "missing_token" ||
              errorCode === "callback_failed") &&
              "The sign-in link could not be verified. Request a fresh email link and try again."}
            {!KNOWN_ERROR_CODES.includes(errorCode) &&
              `Sign-in failed (${errorCode}). Please try again.`}
          </p>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onPasswordSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="cms-username"
            >
              Username or email
            </label>
            <input
              id="cms-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="curtis.m@sociallypowerful.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="cms-password"
            >
              Password
            </label>
            <input
              id="cms-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={passwordSubmitting}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {passwordSubmitting ? "Signing in..." : "Sign in with password"}
          </button>
        </form>

        {passwordStatus ? (
          <p className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
            {passwordStatus}
          </p>
        ) : null}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Or use email
          </p>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <form className="space-y-4" onSubmit={onMagicLinkSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="cms-email"
            >
              Work email
            </label>
            <input
              id="cms-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@sociallypowerful.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={magicLinkSubmitting}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 disabled:opacity-60"
          >
            {magicLinkSubmitting ? "Sending link..." : "Email me a sign-in link"}
          </button>
        </form>

        {magicLinkStatus ? (
          <p className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
            {magicLinkStatus}
          </p>
        ) : null}
      </div>
    </main>
  );
}
