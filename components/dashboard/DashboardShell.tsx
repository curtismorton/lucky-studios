"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";

const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/content", label: "Content" },
  { href: "/dashboard/shows", label: "Shows" },
  { href: "/dashboard/media", label: "Media" },
  { href: "/dashboard/seo", label: "SEO" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/history", label: "History" },
  { href: "/dashboard/users", label: "Users" },
];

function matchesPath(currentPath: string, href: string): boolean {
  if (href === "/dashboard") {
    return currentPath === "/dashboard";
  }
  return currentPath.startsWith(href);
}

function LoginPanel() {
  const { login, loading, error } = useDashboardAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("");
    try {
      await login(email, password);
      setStatus("Signed in.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Sign-in failed.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-2xl font-semibold">CMS Dashboard Login</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with your Supabase user and assigned CMS role.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {(status || error) && (
          <p className="mt-4 text-sm text-amber-300">{status || error}</p>
        )}
      </div>
    </main>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, loading, logout, fetchWithAuth } = useDashboardAuth();
  const [previewActive, setPreviewActive] = useState(false);
  const [previewStatus, setPreviewStatus] = useState<string>("");

  const roleLabel = useMemo(() => {
    if (!profile) return "guest";
    return profile.role;
  }, [profile]);

  if (loading && !profile) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          Loading dashboard session...
        </div>
      </main>
    );
  }

  if (!profile) {
    return <LoginPanel />;
  }

  const togglePreview = async () => {
    try {
      setPreviewStatus("");
      const response = await fetchWithAuth(
        previewActive ? "/api/dashboard/preview/stop" : "/api/dashboard/preview/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ maxAgeSeconds: 3600 }),
        }
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error || "Failed to toggle preview.");
      }

      setPreviewActive((previous) => !previous);
      setPreviewStatus(previewActive ? "Preview disabled." : "Preview enabled for 1 hour.");
    } catch (error) {
      setPreviewStatus(error instanceof Error ? error.message : "Preview toggle failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-800 bg-slate-900/80 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-5">
            <h1 className="text-lg font-semibold tracking-tight">CMS V2 Dashboard</h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              Role: {roleLabel}
            </p>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  matchesPath(pathname, item.href)
                    ? "bg-amber-500/20 text-amber-200"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 space-y-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={togglePreview}
              className="w-full rounded-lg border border-amber-400/40 px-3 py-2 text-sm text-amber-200"
            >
              {previewActive ? "Disable Preview" : "Enable Preview"}
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="w-full rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
            >
              Sign out
            </button>
            {previewStatus && (
              <p className="text-xs text-slate-300">{previewStatus}</p>
            )}
          </div>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
