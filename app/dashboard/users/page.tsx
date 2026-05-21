"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardPanel, ModuleHeader } from "@/components/dashboard/ModuleHeader";
import { useDashboardApi } from "@/components/dashboard/useDashboardApi";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";
import type { CmsRole } from "@/lib/cms/types";

type DashboardUser = {
  userId: string;
  email: string | null;
  role: CmsRole | null;
  createdAt: string | null;
  lastSignInAt: string | null;
};

export default function DashboardUsersPage() {
  const { requestJson } = useDashboardApi();
  const { profile } = useDashboardAuth();
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const canManage = profile?.role === "admin";

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
      await requestJson(`/api/dashboard/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      await load();
      setStatus("Role updated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to update role.");
    }
  };

  if (!canManage) {
    return (
      <div className="space-y-5">
        <ModuleHeader title="Users" subtitle="Role assignment and access governance." />
        <DashboardPanel>
          Admin role required to manage dashboard users.
        </DashboardPanel>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ModuleHeader title="Users" subtitle="Assign CMS roles to authenticated Supabase users." />
      {status ? <DashboardPanel className="text-amber-200">{status}</DashboardPanel> : null}
      {loading ? <DashboardPanel>Loading users...</DashboardPanel> : null}

      <DashboardPanel>
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
      </DashboardPanel>
    </div>
  );
}
