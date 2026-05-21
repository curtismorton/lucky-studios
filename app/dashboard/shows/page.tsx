"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardPanel, ModuleHeader } from "@/components/dashboard/ModuleHeader";
import { JsonEditor } from "@/components/dashboard/JsonEditor";
import { useDashboardApi } from "@/components/dashboard/useDashboardApi";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";
import type { CmsSeoConfig } from "@/lib/cms/types";
import type { Show } from "@/lib/data/shows";

type ShowsEntityResponse = {
  draft: {
    payload: { items: Array<Show & { seo?: CmsSeoConfig }> };
    seo: CmsSeoConfig;
    version: number;
  } | null;
  published: {
    payload: { items: Array<Show & { seo?: CmsSeoConfig }> };
    seo: CmsSeoConfig;
    version: number;
  } | null;
};

export default function DashboardShowsPage() {
  const { requestJson } = useDashboardApi();
  const { profile } = useDashboardAuth();
  const [entity, setEntity] = useState<ShowsEntityResponse | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const canEdit = profile?.role === "editor" || profile?.role === "admin";
  const canPublish = profile?.role === "admin";

  const load = useCallback(async () => {
    const response = await requestJson<ShowsEntityResponse>(
      "/api/dashboard/entities/shows"
    );
    setEntity(response);
  }, [requestJson]);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setStatus("");
      try {
        await load();
      } catch (error) {
        if (!active) return;
        setStatus(error instanceof Error ? error.message : "Failed to load shows.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [load]);

  const shows = useMemo(
    () => entity?.draft?.payload.items || entity?.published?.payload.items || [],
    [entity]
  );

  const savePayload = async (payload: unknown) => {
    const seo = entity?.draft?.seo || entity?.published?.seo || {};
    await requestJson("/api/dashboard/entities/shows/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, seo }),
    });
    await load();
  };

  const publish = async () => {
    setStatus("");
    try {
      await requestJson("/api/dashboard/entities/shows/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: "Published from shows module." }),
      });
      await load();
      setStatus("Shows published.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Publish failed.");
    }
  };

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Shows"
        subtitle="Sortable show table and JSON editor for hosts, platform links, and show-level SEO."
        actions={
          canPublish ? (
            <button
              type="button"
              onClick={() => void publish()}
              className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950"
            >
              Publish Shows
            </button>
          ) : null
        }
      />

      {status ? <DashboardPanel className="text-amber-200">{status}</DashboardPanel> : null}
      {loading ? <DashboardPanel>Loading shows module...</DashboardPanel> : null}

      <div className="grid gap-4 2xl:grid-cols-[1.2fr_1fr]">
        <DashboardPanel>
          <h2 className="text-sm font-semibold text-slate-100">Shows Table</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Slug</th>
                  <th className="px-2 py-2">Genre</th>
                  <th className="px-2 py-2">Featured</th>
                  <th className="px-2 py-2">SEO Title</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr key={show.id} className="border-t border-slate-800">
                    <td className="px-2 py-2 text-slate-100">{show.title}</td>
                    <td className="px-2 py-2 text-slate-300">{show.slug}</td>
                    <td className="px-2 py-2 text-slate-300">{show.genre}</td>
                    <td className="px-2 py-2 text-slate-300">
                      {show.featured ? "Yes" : "No"}
                    </td>
                    <td className="px-2 py-2 text-slate-300">
                      {show.seo?.title || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <JsonEditor
            label="Shows Draft Payload"
            value={entity?.draft?.payload || entity?.published?.payload || { items: [] }}
            onApply={savePayload}
            disabled={!canEdit}
            height={560}
          />
        </DashboardPanel>
      </div>
    </div>
  );
}
