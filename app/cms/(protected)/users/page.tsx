"use client";

import { useCallback, useEffect, useState } from "react";
import { useCmsAuth } from "@/components/cms/CmsAuthProvider";
import { useCmsApi } from "@/components/cms/useCmsApi";
import type { CmsRole } from "@/lib/cms/types";

type DashboardUser = {
  userId: string;
  email: string | null;
  role: CmsRole | null;
  createdAt: string | null;
  lastSignInAt: string | null;
};

export default function CmsUsersPage() {
  const { requestJson } = useCmsApi();
  const { session } = useCmsAuth();
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const canManage = session?.user.role === "admin";

  const load = useCallback(async () => {
    const response = await requestJson<{ users: DashboardUser[] }>(
      "/api/dashboard/users"
    );
    setUsers(response.users || []);
  }, [requestJson]);

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!canManage) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setStatus("");
      try {
        await load();
      } catch (error) {
        if (!active) return;
        setStatus(error instanceof Error ? error.message : "Failed to load users.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [load, canManage]);

  const updateRole = async (userId: string, role: CmsRole) => {
    setStatus("");
    try {
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        code?: string;
      } | null;
      if (!response.ok) {
        if (response.status === 428 || payload?.code === "mfa_required") {
          throw new Error(
            "Admin verification required. Verify MFA from Home before changing roles."
          );
        }
        throw new Error(payload?.error || "Failed to update role.");
      }
      await load();
      setStatus("Role updated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to update role.");
    }
  };

  if (!canManage) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-300">
        Admin role required to manage CMS users.
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Users</h1>
        <p className="mt-1 text-sm text-slate-400">
          Assign CMS access roles. Changes require admin MFA verification.
        </p>
      </header>

      {status ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-amber-200">
          {status}
        </section>
      ) : null}
      {loading ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          Loading users...
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">User ID</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Created</th>
                <th className="px-2 py-2">Last Sign In</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="border-t border-slate-800">
                  <td className="px-2 py-2 text-slate-100">{user.email || "-"}</td>
                  <td className="px-2 py-2 text-xs text-slate-400">{user.userId}</td>
                  <td className="px-2 py-2">
                    <select
                      value={user.role || "viewer"}
                      onChange={(event) =>
                        void updateRole(user.userId, event.target.value as CmsRole)
                      }
                      className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                    >
                      <option value="viewer">viewer</option>
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-2 py-2 text-slate-300">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-2 py-2 text-slate-300">
                    {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
