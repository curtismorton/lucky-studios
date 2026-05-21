"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCmsAuth } from "@/components/cms/CmsAuthProvider";

const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: "/cms/home", label: "Home" },
  { href: "/cms/about", label: "About" },
  { href: "/cms/shows", label: "Shows" },
  { href: "/cms/contact", label: "Contact" },
  { href: "/cms/brand-settings", label: "Brand Settings" },
  { href: "/cms/media", label: "Media" },
  { href: "/cms/history", label: "History" },
  { href: "/cms/users", label: "Users" },
  { href: "/cms/advanced", label: "Advanced" },
];

function isActivePath(current: string, href: string): boolean {
  return current === href || current.startsWith(`${href}/`);
}

export function CmsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, loading, error, logout } = useCmsAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          Loading CMS session...
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          {error || "Your CMS session is unavailable. Please sign in again."}
          <div className="mt-4">
            <Link
              href="/cms/login"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-100"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-800 bg-slate-900/80 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-5">
            <h1 className="text-lg font-semibold tracking-tight">CMS V3</h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              Role: {session.user.role}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {session.user.email || session.user.userId}
            </p>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  isActivePath(pathname, item.href)
                    ? "bg-amber-500/20 text-amber-200"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => void logout()}
              className="w-full rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
            >
              Sign out
            </button>
          </div>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
