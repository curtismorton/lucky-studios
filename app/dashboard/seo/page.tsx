"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardPanel, ModuleHeader } from "@/components/dashboard/ModuleHeader";
import { JsonEditor } from "@/components/dashboard/JsonEditor";
import { useDashboardApi } from "@/components/dashboard/useDashboardApi";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";
import type { CmsSeoConfig } from "@/lib/cms/types";

type SeoEntityResponse = {
  draft: {
    payload: unknown;
    seo: CmsSeoConfig;
    version: number;
  } | null;
  published: {
    payload: unknown;
    seo: CmsSeoConfig;
    version: number;
  } | null;
};

export default function DashboardSeoPage() {
  const { requestJson } = useDashboardApi();
  const { profile } = useDashboardAuth();
  const [entity, setEntity] = useState<SeoEntityResponse | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const canEdit = profile?.role === "editor" || profile?.role === "admin";
  const canPublish = profile?.role === "admin";

  const load = useCallback(async () => {
    const response = await requestJson<SeoEntityResponse>(
      "/api/dashboard/entities/seo-defaults"
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
        setStatus(error instanceof Error ? error.message : "Failed to load SEO entity.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [load]);

  const savePayload = async (payload: unknown) => {
    const seo = entity?.draft?.seo || entity?.published?.seo || {};
    await requestJson("/api/dashboard/entities/seo-defaults/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, seo }),
    });
    await load();
  };

  const publish = async () => {
    setStatus("");
    try {
      await requestJson("/api/dashboard/entities/seo-defaults/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: "Published SEO defaults." }),
      });
      await load();
      setStatus("SEO defaults published.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Publish failed.");
    }
  };

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="SEO"
        subtitle="Page-level SEO editor for canonical paths, OG image, noindex, and metadata overrides."
        actions={
          canPublish ? (
            <button
              type="button"
              onClick={() => void publish()}
              className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950"
            >
              Publish SEO
            </button>
          ) : null
        }
      />

      {status ? <DashboardPanel className="text-amber-200">{status}</DashboardPanel> : null}
      {loading ? <DashboardPanel>Loading SEO settings...</DashboardPanel> : null}

      <DashboardPanel>
        <JsonEditor
          label="SEO Defaults Payload"
          value={entity?.draft?.payload || entity?.published?.payload || {}}
          onApply={savePayload}
          disabled={!canEdit}
          height={560}
        />
      </DashboardPanel>
    </div>
  );
}
