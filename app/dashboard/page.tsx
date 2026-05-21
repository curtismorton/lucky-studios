"use client";

import { useEffect, useState } from "react";
import { DashboardPanel, ModuleHeader } from "@/components/dashboard/ModuleHeader";
import { useDashboardApi } from "@/components/dashboard/useDashboardApi";
import type { DashboardOverview } from "@/lib/cms/types";

export default function DashboardOverviewPage() {
  const { requestJson } = useDashboardApi();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await requestJson<DashboardOverview>("/api/dashboard/overview");
        if (mounted) setOverview(data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard overview.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [requestJson]);

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Overview"
        subtitle="Publishing health, stale drafts, media quality alerts, and recent audit activity."
      />

      {loading ? (
        <DashboardPanel>Loading overview...</DashboardPanel>
      ) : null}
      {error ? <DashboardPanel className="text-red-300">{error}</DashboardPanel> : null}

      {overview ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardPanel>
              <p className="text-xs uppercase tracking-wide text-slate-400">Entities</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {overview.entitiesTotal}
              </p>
            </DashboardPanel>
            <DashboardPanel>
              <p className="text-xs uppercase tracking-wide text-slate-400">With Drafts</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {overview.entitiesWithDrafts}
              </p>
            </DashboardPanel>
            <DashboardPanel>
              <p className="text-xs uppercase tracking-wide text-slate-400">Out of Sync</p>
              <p className="mt-2 text-2xl font-semibold text-amber-200">
                {overview.entitiesOutOfSync}
              </p>
            </DashboardPanel>
            <DashboardPanel>
              <p className="text-xs uppercase tracking-wide text-slate-400">Media Alerts</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {overview.mediaAlerts.length}
              </p>
            </DashboardPanel>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <DashboardPanel>
              <h2 className="text-sm font-semibold text-slate-100">Stale Drafts</h2>
              <div className="mt-3 space-y-2">
                {overview.staleDrafts.length === 0 ? (
                  <p className="text-sm text-slate-400">No stale drafts.</p>
                ) : (
                  overview.staleDrafts.map((entry) => (
                    <div
                      key={`${entry.entityKey}-${entry.draftUpdatedAt}`}
                      className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
                    >
                      <p className="text-sm text-slate-100">{entry.title}</p>
                      <p className="text-xs text-slate-400">
                        Draft updated: {new Date(entry.draftUpdatedAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </DashboardPanel>

            <DashboardPanel>
              <h2 className="text-sm font-semibold text-slate-100">Media Quality Alerts</h2>
              <div className="mt-3 space-y-2">
                {overview.mediaAlerts.length === 0 ? (
                  <p className="text-sm text-slate-400">No media alerts.</p>
                ) : (
                  overview.mediaAlerts.map((alert) => (
                    <div
                      key={alert.assetId}
                      className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
                    >
                      <p className="truncate text-sm text-slate-100">{alert.path}</p>
                      <p className="text-xs text-amber-200">{alert.reason}</p>
                    </div>
                  ))
                )}
              </div>
            </DashboardPanel>
          </div>

          <DashboardPanel>
            <h2 className="text-sm font-semibold text-slate-100">Recent Audit Events</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-2 py-2">Time</th>
                    <th className="px-2 py-2">Action</th>
                    <th className="px-2 py-2">Entity</th>
                    <th className="px-2 py-2">Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentAuditEvents.map((event) => (
                    <tr key={event.id} className="border-t border-slate-800">
                      <td className="px-2 py-2 text-slate-300">
                        {new Date(event.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-slate-100">{event.action}</td>
                      <td className="px-2 py-2 text-slate-300">
                        {event.entityKey || "-"}
                      </td>
                      <td className="px-2 py-2 text-slate-300">
                        {event.actorUserId || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardPanel>
        </>
      ) : null}
    </div>
  );
}
