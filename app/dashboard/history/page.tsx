"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardPanel, ModuleHeader } from "@/components/dashboard/ModuleHeader";
import { useDashboardApi } from "@/components/dashboard/useDashboardApi";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";
import type { CmsEntityKey, CmsEntityRecord, CmsSnapshot } from "@/lib/cms/types";

type EntityListResponse = {
  entities: Array<{
    entity: CmsEntityRecord;
  }>;
};

type HistoryResponse = {
  history: CmsSnapshot[];
};

export default function DashboardHistoryPage() {
  const { requestJson } = useDashboardApi();
  const { profile } = useDashboardAuth();
  const [entities, setEntities] = useState<EntityListResponse["entities"]>([]);
  const [selectedKey, setSelectedKey] = useState<CmsEntityKey | null>(null);
  const [history, setHistory] = useState<CmsSnapshot[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const canRollback = profile?.role === "admin";

  const loadEntities = useCallback(async () => {
    const response = await requestJson<EntityListResponse>("/api/dashboard/entities");
    setEntities(response.entities);
    setSelectedKey((current) => current || response.entities[0]?.entity.entityKey || null);
  }, [requestJson]);

  const loadHistory = useCallback(
    async (entityKey: CmsEntityKey) => {
      const response = await requestJson<HistoryResponse>(
        `/api/dashboard/entities/${entityKey}/history?limit=80`
      );
      setHistory(response.history || []);
    },
    [requestJson]
  );

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setStatus("");
      try {
        await loadEntities();
      } catch (error) {
        if (!active) return;
        setStatus(error instanceof Error ? error.message : "Failed to load entities.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadEntities]);

  useEffect(() => {
    if (!selectedKey) return;
    void (async () => {
      try {
        await loadHistory(selectedKey);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Failed to load history.");
      }
    })();
  }, [selectedKey, loadHistory]);

  const rollback = async (snapshotId: string) => {
    if (!selectedKey) return;
    setStatus("");
    try {
      await requestJson(
        `/api/dashboard/entities/${selectedKey}/rollback/${snapshotId}`,
        {
          method: "POST",
        }
      );
      await loadHistory(selectedKey);
      setStatus(`Rolled back ${selectedKey} to snapshot ${snapshotId}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Rollback failed.");
    }
  };

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="History"
        subtitle="Snapshot timeline and rollback controls for published content versions."
      />

      {status ? <DashboardPanel className="text-amber-200">{status}</DashboardPanel> : null}
      {loading ? <DashboardPanel>Loading history module...</DashboardPanel> : null}

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <DashboardPanel>
          <h2 className="text-sm font-semibold text-slate-100">Entities</h2>
          <div className="mt-3 space-y-2">
            {entities.map((entry) => (
              <button
                key={entry.entity.id}
                type="button"
                onClick={() => setSelectedKey(entry.entity.entityKey)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  selectedKey === entry.entity.entityKey
                    ? "border-amber-400/50 bg-amber-500/10 text-amber-200"
                    : "border-slate-700 bg-slate-950/40 text-slate-200"
                }`}
              >
                {entry.entity.title}
              </button>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <h2 className="text-sm font-semibold text-slate-100">Snapshots</h2>
          <div className="mt-3 space-y-2">
            {history.length === 0 ? (
              <p className="text-sm text-slate-400">No snapshots yet.</p>
            ) : (
              history.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-100">
                        Version {snapshot.publishedVersion}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(snapshot.publishedAt).toLocaleString()}
                      </p>
                      {snapshot.summary ? (
                        <p className="mt-1 text-xs text-slate-300">{snapshot.summary}</p>
                      ) : null}
                    </div>
                    {canRollback ? (
                      <button
                        type="button"
                        onClick={() => void rollback(snapshot.id)}
                        className="rounded-lg border border-amber-400/50 px-3 py-1.5 text-xs text-amber-200"
                      >
                        Rollback
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
}
