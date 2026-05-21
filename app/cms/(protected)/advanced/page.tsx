"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCmsAuth } from "@/components/cms/CmsAuthProvider";
import { useCmsApi } from "@/components/cms/useCmsApi";
import type {
  EditorPublishStatus,
  EditorSaveStatus,
} from "@/lib/cms/editorTypes";
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

function getRequestedEntityKey(
  available: EntityListResponse["entities"]
): CmsEntityKey | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("entity");
  if (!raw) return null;
  const match = available.find((entry) => entry.entity.entityKey === raw);
  return match?.entity.entityKey || null;
}

function safeStringify(value: unknown): string {
  return JSON.stringify(value ?? {}, null, 2);
}

function timestampLabel(iso: string | null): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function PublishSummaryModal({
  open,
  summary,
  onSummaryChange,
  onCancel,
  onConfirm,
  pending,
}: {
  open: boolean;
  summary: string;
  onSummaryChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  pending: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold text-slate-100">Publish Entity</h3>
        <p className="mt-2 text-sm text-slate-400">
          Add a short summary so this publish event is clear in history.
        </p>
        <textarea
          value={summary}
          onChange={(event) => onSummaryChange(event.target.value)}
          rows={3}
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          placeholder="Updated copy and media references."
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {pending ? "Publishing..." : "Confirm Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MfaModal({
  open,
  code,
  status,
  pending,
  onCodeChange,
  onCancel,
  onVerify,
}: {
  open: boolean;
  code: string;
  status: string;
  pending: boolean;
  onCodeChange: (value: string) => void;
  onCancel: () => void;
  onVerify: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold text-slate-100">Admin Verification</h3>
        <p className="mt-2 text-sm text-slate-400">
          Enter your admin MFA code to continue.
        </p>
        <input
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          placeholder="MFA code"
        />
        {status ? <p className="mt-3 text-sm text-amber-200">{status}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onVerify}
            disabled={pending}
            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {pending ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CmsAdvancedPage() {
  const { requestJson } = useCmsApi();
  const { session, refreshSession } = useCmsAuth();

  const [entities, setEntities] = useState<EntityListResponse["entities"]>([]);
  const [selectedKey, setSelectedKey] = useState<CmsEntityKey | null>(null);
  const [detail, setDetail] = useState<EntityDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [payloadJson, setPayloadJson] = useState("{}");
  const [seoJson, setSeoJson] = useState("{}");
  const [baselinePayloadJson, setBaselinePayloadJson] = useState("{}");
  const [baselineSeoJson, setBaselineSeoJson] = useState("{}");
  const [error, setError] = useState("");

  const [saveStatus, setSaveStatus] = useState<EditorSaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const [publishStatus, setPublishStatus] = useState<EditorPublishStatus>("idle");
  const [publishMessage, setPublishMessage] = useState("");
  const [publishSummary, setPublishSummary] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);

  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaStatus, setMfaStatus] = useState("");
  const [mfaPending, setMfaPending] = useState(false);

  const [exportStatus, setExportStatus] = useState("");
  const [exportJson, setExportJson] = useState("");

  const canEdit =
    session?.user.role === "editor" || session?.user.role === "admin";
  const canPublish = session?.user.role === "admin";

  const isDirty =
    payloadJson.trim() !== baselinePayloadJson.trim() ||
    seoJson.trim() !== baselineSeoJson.trim();

  useEffect(() => {
    if (!loading && isDirty && saveStatus !== "saving") {
      setSaveStatus("dirty");
      setSaveMessage("Unsaved changes.");
    }
  }, [isDirty, loading, saveStatus]);

  const loadEntities = useCallback(async () => {
    const response = await requestJson<EntityListResponse>(
      "/api/dashboard/entities"
    );
    setEntities(response.entities);
    const requested = getRequestedEntityKey(response.entities);
    setSelectedKey(
      (current) =>
        current || requested || response.entities[0]?.entity.entityKey || null
    );
  }, [requestJson]);

  const loadEntity = useCallback(
    async (entityKey: CmsEntityKey) => {
      const response = await requestJson<EntityDetailResponse>(
        `/api/dashboard/entities/${entityKey}`
      );
      const payload =
        response.draft?.payload ?? response.published?.payload ?? {};
      const seo = response.draft?.seo ?? response.published?.seo ?? {};
      const payloadText = safeStringify(payload);
      const seoText = safeStringify(seo);

      setDetail(response);
      setPayloadJson(payloadText);
      setSeoJson(seoText);
      setBaselinePayloadJson(payloadText);
      setBaselineSeoJson(seoText);
      setLastSavedAt(response.draft?.updatedAt || response.published?.updatedAt || null);
      setSaveStatus("idle");
      setSaveMessage("");
    },
    [requestJson]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    void loadEntities()
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load entities.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadEntities]);

  useEffect(() => {
    if (!selectedKey) return;
    let active = true;
    setError("");

    void loadEntity(selectedKey).catch((err) => {
      if (!active) return;
      setError(err instanceof Error ? err.message : "Failed to load entity.");
    });

    return () => {
      active = false;
    };
  }, [selectedKey, loadEntity]);

  const statusRail = useMemo(() => {
    if (saveStatus === "saving") return "Saving draft...";
    if (publishStatus === "publishing") return "Publishing...";
    if (publishStatus === "published") return "Publish successful.";
    if (publishStatus === "error") return publishMessage || "Publish failed.";
    if (saveStatus === "error") return saveMessage || "Save failed.";
    if (saveStatus === "saved") {
      return `Draft saved at ${timestampLabel(lastSavedAt)}.`;
    }
    if (saveStatus === "dirty") return "Unsaved changes.";
    return "No pending changes.";
  }, [saveStatus, publishStatus, publishMessage, saveMessage, lastSavedAt]);

  const saveDraft = async () => {
    if (!selectedKey || !canEdit) return;

    let parsedPayload: unknown;
    let parsedSeo: unknown;

    try {
      parsedPayload = JSON.parse(payloadJson);
      parsedSeo = JSON.parse(seoJson);
    } catch {
      setSaveStatus("error");
      setSaveMessage("Invalid JSON. Fix formatting before saving.");
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("");
    setPublishStatus("idle");
    setPublishMessage("");

    try {
      await requestJson(`/api/dashboard/entities/${selectedKey}/draft`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: parsedPayload,
          seo: parsedSeo,
        }),
      });
      await loadEntity(selectedKey);
      await loadEntities();
      setSaveStatus("saved");
      setSaveMessage("Draft saved.");
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage(err instanceof Error ? err.message : "Failed to save draft.");
    }
  };

  const requestMfaChallenge = async () => {
    const response = await fetch("/api/cms/mfa/challenge", {
      method: "POST",
      credentials: "include",
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    if (!response.ok) {
      throw new Error(payload?.error || "Failed to start MFA challenge.");
    }
    setShowMfaModal(true);
    setMfaStatus("Challenge started. Enter your admin MFA code.");
  };

  const publish = async () => {
    if (!selectedKey || !canPublish) return;
    if (!publishSummary.trim()) {
      setPublishStatus("error");
      setPublishMessage("Publish summary is required.");
      return;
    }

    setPublishStatus("publishing");
    setPublishMessage("");

    const response = await fetch(`/api/dashboard/entities/${selectedKey}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ summary: publishSummary.trim() }),
    });

    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      code?: string;
    } | null;

    if (!response.ok) {
      if (response.status === 428 || payload?.code === "mfa_required") {
        setPublishStatus("mfa_required");
        setPublishMessage("Admin MFA verification is required.");
        setShowPublishModal(false);
        await requestMfaChallenge();
        return;
      }

      setPublishStatus("error");
      setPublishMessage(payload?.error || "Failed to publish.");
      return;
    }

    await loadEntity(selectedKey);
    await loadEntities();
    setPublishStatus("published");
    setPublishMessage("Entity published successfully.");
    setShowPublishModal(false);
    setPublishSummary("");
  };

  const verifyMfa = async () => {
    setMfaPending(true);
    setMfaStatus("");
    try {
      const response = await fetch("/api/cms/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code: mfaCode.trim() }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "MFA verification failed.");
      }

      await refreshSession();
      setShowMfaModal(false);
      setMfaCode("");
      setMfaStatus("");
      setShowPublishModal(true);
    } catch (err) {
      setMfaStatus(
        err instanceof Error ? err.message : "MFA verification failed."
      );
    } finally {
      setMfaPending(false);
    }
  };

  const exportBundle = async () => {
    setExportStatus("");
    try {
      const response = await fetch("/api/dashboard/export", {
        credentials: "include",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        bundle?: unknown;
      } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to export.");
      }
      setExportJson(JSON.stringify(payload?.bundle || {}, null, 2));
      setExportStatus("Export generated.");
    } catch (error) {
      setExportStatus(
        error instanceof Error ? error.message : "Failed to export."
      );
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Advanced
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Power-user JSON editor for any CMS entity. Use this for emergency fixes
          or fields not yet available in form views.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200">
        <p className="font-medium">Status</p>
        <p className="mt-1">{statusRail}</p>
      </section>

      {error ? (
        <section className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </section>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[260px_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Entities
          </h2>
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
                    <p className="mt-1 text-xs text-amber-300">
                      Draft differs from published
                    </p>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                {detail?.entity.title || "Entity Editor"}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Draft version: {detail?.draft?.version || 0} | Published version:{" "}
                {detail?.published?.version || 0}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void saveDraft()}
                disabled={!selectedKey || !canEdit || saveStatus === "saving"}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => setShowPublishModal(true)}
                disabled={!selectedKey || !canPublish || publishStatus === "publishing"}
                className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
              >
                Publish
              </button>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
                Draft Payload JSON
              </span>
              <textarea
                value={payloadJson}
                onChange={(event) => setPayloadJson(event.target.value)}
                rows={22}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100"
                disabled={!canEdit}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
                Draft SEO JSON
              </span>
              <textarea
                value={seoJson}
                onChange={(event) => setSeoJson(event.target.value)}
                rows={22}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100"
                disabled={!canEdit}
              />
            </label>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Export Bundle
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Admin MFA is required before export succeeds.
        </p>
        <button
          type="button"
          onClick={() => void exportBundle()}
          className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
        >
          Generate Export
        </button>
        {exportStatus ? (
          <p className="mt-3 text-sm text-amber-200">{exportStatus}</p>
        ) : null}
        <textarea
          value={exportJson}
          readOnly
          rows={16}
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200"
          placeholder="Export JSON will appear here."
        />
      </section>

      <PublishSummaryModal
        open={showPublishModal}
        summary={publishSummary}
        onSummaryChange={setPublishSummary}
        onCancel={() => setShowPublishModal(false)}
        onConfirm={() => void publish()}
        pending={publishStatus === "publishing"}
      />

      <MfaModal
        open={showMfaModal}
        code={mfaCode}
        status={mfaStatus}
        pending={mfaPending}
        onCodeChange={setMfaCode}
        onCancel={() => setShowMfaModal(false)}
        onVerify={() => void verifyMfa()}
      />
    </div>
  );
}
