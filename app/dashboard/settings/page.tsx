"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardPanel, ModuleHeader } from "@/components/dashboard/ModuleHeader";
import { JsonEditor } from "@/components/dashboard/JsonEditor";
import { useDashboardApi } from "@/components/dashboard/useDashboardApi";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";
import type { CmsSeoConfig } from "@/lib/cms/types";

type GenericEntityResponse = {
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

export default function DashboardSettingsPage() {
  const { requestJson } = useDashboardApi();
  const { profile } = useDashboardAuth();
  const [siteSettings, setSiteSettings] = useState<GenericEntityResponse | null>(null);
  const [navFooter, setNavFooter] = useState<GenericEntityResponse | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const canEdit = profile?.role === "editor" || profile?.role === "admin";
  const canPublish = profile?.role === "admin";

  const load = useCallback(async () => {
    const [siteResponse, navResponse] = await Promise.all([
      requestJson<GenericEntityResponse>("/api/dashboard/entities/site-settings"),
      requestJson<GenericEntityResponse>("/api/dashboard/entities/nav-footer"),
    ]);

    setSiteSettings(siteResponse);
    setNavFooter(navResponse);
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
        setStatus(error instanceof Error ? error.message : "Failed to load settings.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [load]);

  const saveDraft = async (entityKey: "site-settings" | "nav-footer", payload: unknown) => {
    const current = entityKey === "site-settings" ? siteSettings : navFooter;
    const seo = current?.draft?.seo || current?.published?.seo || {};
    await requestJson(`/api/dashboard/entities/${entityKey}/draft`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, seo }),
    });
    await load();
  };

  const publish = async (entityKey: "site-settings" | "nav-footer") => {
    setStatus("");
    try {
      await requestJson(`/api/dashboard/entities/${entityKey}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: `Published ${entityKey} from settings module.` }),
      });
      await load();
      setStatus(`Published ${entityKey}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Publish failed.");
    }
  };

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Settings"
        subtitle="Global site profile, nav/footer links, contact, social URLs, and booking settings."
      />

      {status ? <DashboardPanel className="text-amber-200">{status}</DashboardPanel> : null}
      {loading ? <DashboardPanel>Loading settings...</DashboardPanel> : null}

      <div className="grid gap-4 2xl:grid-cols-2">
        <DashboardPanel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">Site Settings</h2>
            {canPublish ? (
              <button
                type="button"
                onClick={() => void publish("site-settings")}
                className="rounded-lg border border-amber-400/40 px-3 py-1.5 text-xs text-amber-200"
              >
                Publish
              </button>
            ) : null}
          </div>
          <JsonEditor
            label="Site Settings Draft"
            value={siteSettings?.draft?.payload || siteSettings?.published?.payload || {}}
            onApply={(payload) => saveDraft("site-settings", payload)}
            disabled={!canEdit}
            height={520}
          />
        </DashboardPanel>

        <DashboardPanel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">Navigation & Footer</h2>
            {canPublish ? (
              <button
                type="button"
                onClick={() => void publish("nav-footer")}
                className="rounded-lg border border-amber-400/40 px-3 py-1.5 text-xs text-amber-200"
              >
                Publish
              </button>
            ) : null}
          </div>
          <JsonEditor
            label="Navigation/Footer Draft"
            value={navFooter?.draft?.payload || navFooter?.published?.payload || {}}
            onApply={(payload) => saveDraft("nav-footer", payload)}
            disabled={!canEdit}
            height={520}
          />
        </DashboardPanel>
      </div>
    </div>
  );
}
