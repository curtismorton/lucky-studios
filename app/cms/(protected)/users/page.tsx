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

type FactorStatus = {
  enrolled: boolean;
  factorId: string | null;
  friendlyName: string | null;
};

type EnrollData = {
  factorId: string;
  qrCode: string;
  secret: string;
};

function TotpSetup() {
  const [factorStatus, setFactorStatus] = useState<FactorStatus | null>(null);
  const [enrollData, setEnrollData] = useState<EnrollData | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/cms/mfa/enroll", { credentials: "include" });
    if (!res.ok) return;
    const data = (await res.json()) as FactorStatus;
    setFactorStatus(data);
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const startEnroll = async () => {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/cms/mfa/enroll", {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => null)) as (EnrollData & { ok?: boolean; error?: string }) | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to start enrollment.");
      }
      setEnrollData({ factorId: data.factorId, qrCode: data.qrCode, secret: data.secret });
      setStatus("Scan the QR code with your authenticator app, then enter the 6-digit code to confirm.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Enrollment failed.");
    } finally {
      setBusy(false);
    }
  };

  const confirmEnroll = async () => {
    if (!enrollData || !verifyCode.trim()) return;
    setBusy(true);
    setStatus("");
    try {
      // Challenge the new (unverified) factor to get a challengeId.
      const challengeRes = await fetch("/api/cms/mfa/challenge", {
        method: "POST",
        credentials: "include",
      });
      const challengeData = (await challengeRes.json().catch(() => null)) as {
        factorId?: string;
        challengeId?: string;
        error?: string;
      } | null;
      if (!challengeRes.ok) {
        throw new Error(challengeData?.error || "Failed to create challenge.");
      }

      const verifyRes = await fetch("/api/cms/mfa/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factorId: challengeData?.factorId ?? enrollData.factorId,
          challengeId: challengeData?.challengeId,
          code: verifyCode.trim(),
        }),
      });
      const verifyData = (await verifyRes.json().catch(() => null)) as { error?: string } | null;
      if (!verifyRes.ok) {
        throw new Error(verifyData?.error || "Invalid code.");
      }

      setEnrollData(null);
      setVerifyCode("");
      setStatus("Authenticator app enrolled successfully.");
      await loadStatus();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setBusy(false);
    }
  };

  const unenroll = async () => {
    if (!factorStatus?.factorId) return;
    if (!confirm("Remove your TOTP factor? You will not be able to perform admin actions until you re-enroll.")) return;
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/cms/mfa/enroll", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factorId: factorStatus.factorId }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Failed to remove factor.");
      setStatus("TOTP factor removed.");
      await loadStatus();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to remove factor.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          My Authenticator App (TOTP)
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Admin publish and export actions require your session to be verified
          with a TOTP authenticator app each time.
        </p>
      </div>

      {status ? (
        <p className="text-sm text-amber-200">{status}</p>
      ) : null}

      {factorStatus === null ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : factorStatus.enrolled ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-200">
            Authenticator app enrolled
            {factorStatus.friendlyName ? ` (${factorStatus.friendlyName})` : ""}.
          </p>
          <button
            type="button"
            onClick={() => void unenroll()}
            disabled={busy}
            className="rounded-lg border border-rose-800 px-3 py-2 text-sm text-rose-300 disabled:opacity-50"
          >
            Remove TOTP factor
          </button>
        </div>
      ) : enrollData ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Scan this QR code with Google Authenticator, Authy, or 1Password,
            then enter the 6-digit code below to confirm enrollment.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enrollData.qrCode} alt="TOTP QR code" className="rounded-lg border border-slate-700 w-48 h-48" />
          <p className="text-xs text-slate-400 font-mono break-all">
            Manual entry: {enrollData.secret}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="000000"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 w-32"
            />
            <button
              type="button"
              onClick={() => void confirmEnroll()}
              disabled={busy || verifyCode.trim().length < 6}
              className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              {busy ? "Verifying…" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => { setEnrollData(null); setVerifyCode(""); setStatus(""); }}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void startEnroll()}
          disabled={busy}
          className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {busy ? "Starting…" : "Enroll authenticator app"}
        </button>
      )}
    </section>
  );
}

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        code?: string;
      } | null;
      if (!response.ok) {
        if (response.status === 428 || payload?.code === "mfa_required") {
          throw new Error(
            "Admin MFA verification required. Complete TOTP verification from the Advanced page before changing roles."
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
          Assign CMS access roles. Changes require admin TOTP verification.
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

      <TotpSetup />
    </div>
  );
}
