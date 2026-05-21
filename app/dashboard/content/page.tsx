"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardPanel, ModuleHeader } from "@/components/dashboard/ModuleHeader";
import { JsonEditor } from "@/components/dashboard/JsonEditor";
import { useDashboardApi } from "@/components/dashboard/useDashboardApi";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";
import type { CmsEntityKey, CmsEntityRecord, CmsSeoConfig } from "@/lib/cms/types";

type EntityListResponse = {
  entities: Array<{
    entity: CmsEntityRecord;
    outOfSync: boolean;
  }>;
};

type EntityDetailResponse = {
  entity: CmsEntityRecord;
  draft: {
    payload: unknown;
    seo: CmsSeoConfig;
    version: number;
    updatedAt: string;
  } | null;
  published: {
    payload: unknown;
    seo: CmsSeoConfig;
    version: number;
    updatedAt: string;
  } | null;
};

const PREVIEW_PATH_BY_ENTITY: Record<CmsEntityKey, string> = {
  homepage: "/",
  "marketing-pages": "/about",
  shows: "/shows",
  "site-settings": "/",
  "nav-footer": "/",
  "seo-defaults": "/",
};

export default function DashboardContentPage() {
  const { requestJson } = useDashboardApi();
  const { profile } = useDashboardAuth();
  const [entities, setEntities] = useState<EntityListResponse["entities"]>([]);
  const [selectedKey, setSelectedKey] = useState<CmsEntityKey | null>(null);
  const [detail, setDetail] = useState<EntityDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [previewPath, setPreviewPath] = useState("/");

  const canEdit = profile?.role === "editor" || profile?.role === "admin";
  const canPublish = profile?.role === "admin";

  const loadEntities = useCallback(async () => {
    const response = await requestJson<EntityListResponse>(
      "/api/dashboard/entities?module=content"
    );
    setEntities(response.entities);
    setSelectedKey((current) => current || response.entities[0]?.entity.entityKey || null);
  }, [requestJson]);

  const loadEntity = useCallback(
    async (entityKey: CmsEntityKey) => {
      const response = await requestJson<EntityDetailResponse>(
        `/api/dashboard/entities/${entityKey}`
      );
      setDetail(response);
      setPreviewPath(PREVIEW_PATH_BY_ENTITY[entityKey] || "/");
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
    let active = true;
    void (async () => {
      setStatus("");
      try {
        await loadEntity(selectedKey);
      } catch (error) {
        if (!active) return;
        setStatus(error instanceof Error ? error.message : "Failed to load entity details.");
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedKey, loadEntity]);

  const saveDraftPayload = async (payload: unknown) => {
    if (!selectedKey) return;
    const currentSeo = detail?.draft?.seo || detail?.published?.seo || {};
    await requestJson(`/api/dashboard/entities/${selectedKey}/draft`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, seo: currentSeo }),
    });
    await loadEntity(selectedKey);
    await loadEntities();
  };

  const saveDraftSeo = async (seo: unknown) => {
    if (!selectedKey) return;
    const currentPayload = detail?.draft?.payload || detail?.published?.payload || {};
    await requestJson(`/api/dashboard/entities/${selectedKey}/draft`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: currentPayload, seo }),
    });
    await loadEntity(selectedKey);
    await loadEntities();
  };

  const publishSelected = async () => {
    if (!selectedKey) return;
    setStatus("");
    try {
      await requestJson(`/api/dashboard/entities/${selectedKey}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: "Published from dashboard content module." }),
      });
      await loadEntity(selectedKey);
      await loadEntities();
      setStatus("Published successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Publish failed.");
    }
  };

  const selectedMeta = useMemo(() => {
    if (!selectedKey) return null;
    return entities.find((entry) => entry.entity.entityKey === selectedKey) || null;
  }, [entities, selectedKey]);

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Content"
        subtitle="Entity tree with draft/published split, JSON editors, and in-dashboard route preview."
        actions={
          <>
            {canPublish ? (
              <button
                type="button"
                onClick={() => void publishSelected()}
                className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950"
                disabled={!selectedKey}
              >
                Publish Selected
              </button>
            ) : null}
          </>
        }
      />

      {status ? <DashboardPanel className="text-amber-200">{status}</DashboardPanel> : null}

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <DashboardPanel>
          <h2 className="text-sm font-semibold text-slate-100">Content Entities</h2>
          <div className="mt-3 space-y-2">
            {loading ? (
              <p className="text-sm text-slate-400">Loading entities...</p>
            ) : (
              entities.map((entry) => (
                <button
                  key={entry.entity.id}
                  type="button"
                  onClick={() => setSelectedKey(entry.entity.entityKey)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                    selectedKey === entry.entity.entityKey
                      ? "border-amber-400/60 bg-amber-500/10 text-amber-200"
                      : "border-slate-700 bg-slate-950/40 text-slate-200"
                  }`}
                >
                  <p>{entry.entity.title}</p>
                  {entry.outOfSync ? (
                    <p className="mt-1 text-xs text-amber-300">Draft differs from published</p>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  {selectedMeta?.entity.title || "Entity"}
                </h2>
                <p className="text-xs text-slate-400">
                  Draft version: {detail?.draft?.version || 0} | Published version:{" "}
                  {detail?.published?.version || 0}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Preview path</label>
                <input
                  value={previewPath}
                  onChange={(event) => setPreviewPath(event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                />
              </div>
            </div>
          </DashboardPanel>

          <div className="grid gap-4 2xl:grid-cols-2">
            <DashboardPanel>
              <JsonEditor
                label="Draft Payload"
                value={detail?.draft?.payload || detail?.published?.payload || {}}
                onApply={saveDraftPayload}
                disabled={!canEdit}
                height={420}
              />
            </DashboardPanel>

            <DashboardPanel>
              <JsonEditor
                label="Draft SEO"
                value={detail?.draft?.seo || detail?.published?.seo || {}}
                onApply={saveDraftSeo}
                disabled={!canEdit}
                height={240}
              />
              <div className="mt-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                  Published Snapshot
                </p>
                <pre className="max-h-[180px] overflow-auto rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-slate-300">
                  {JSON.stringify(
                    {
                      version: detail?.published?.version || 0,
                      updatedAt: detail?.published?.updatedAt || null,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </DashboardPanel>
          </div>

          <DashboardPanel>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
              Real Route Preview (draft mode cookie aware)
            </p>
            <div className="h-[560px] overflow-hidden rounded-xl border border-slate-700">
              <iframe
                title="CMS route preview"
                src={previewPath || "/"}
                className="h-full w-full bg-white"
              />
            </div>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
