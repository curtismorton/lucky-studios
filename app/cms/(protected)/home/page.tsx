"use client";

import { useEffect, useMemo, useState } from "react";
import { useCmsAuth } from "@/components/cms/CmsAuthProvider";
import { useCmsApi } from "@/components/cms/useCmsApi";
import type {
  EditorPublishStatus,
  EditorSaveStatus,
  HomePageEditorPayload,
} from "@/lib/cms/editorTypes";
import { defaultHomepageContent } from "@/lib/data/homepageContent";

type HomepageEditorResponse = {
  draft: {
    payload: HomePageEditorPayload;
    updatedAt: string;
    version: number;
  } | null;
  published: {
    payload: HomePageEditorPayload;
    updatedAt: string;
    version: number;
  } | null;
};

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
        <h3 className="text-lg font-semibold text-slate-100">Publish Home Page</h3>
        <p className="mt-2 text-sm text-slate-400">
          Add a short note describing what changed. This will appear in history.
        </p>
        <textarea
          value={summary}
          onChange={(event) => onSummaryChange(event.target.value)}
          rows={3}
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          placeholder="Updated hero copy and replaced before/after slider images."
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
          Enter your admin MFA code to continue with this sensitive action.
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

export default function CmsHomeEditorPage() {
  const { requestJson } = useCmsApi();
  const { session, refreshSession } = useCmsAuth();

  const [payload, setPayload] = useState<HomePageEditorPayload>(
    defaultHomepageContent
  );
  const [baselinePayloadJson, setBaselinePayloadJson] = useState(
    JSON.stringify(defaultHomepageContent)
  );
  const [loading, setLoading] = useState(true);
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

  const canEdit =
    session?.user.role === "editor" || session?.user.role === "admin";
  const canPublish = session?.user.role === "admin";
  const isDirty = JSON.stringify(payload) !== baselinePayloadJson;

  useEffect(() => {
    if (!loading && isDirty && saveStatus !== "saving") {
      setSaveStatus("dirty");
      setSaveMessage("Unsaved changes.");
    }
  }, [isDirty, loading, saveStatus]);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const response = await requestJson<HomepageEditorResponse>(
          "/api/cms/editor/homepage"
        );
        if (!active) return;
        const nextPayload =
          response.draft?.payload ||
          response.published?.payload ||
          defaultHomepageContent;
        const serialized = JSON.stringify(nextPayload);
        setPayload(nextPayload);
        setBaselinePayloadJson(serialized);
        setLastSavedAt(response.draft?.updatedAt || response.published?.updatedAt || null);
        setSaveStatus("idle");
        setSaveMessage("");
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load home page content."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [requestJson]);

  const statusRail = useMemo(() => {
    if (saveStatus === "saving") return "Saving draft...";
    if (publishStatus === "publishing") return "Publishing...";
    if (publishStatus === "published") return "Publish successful.";
    if (publishStatus === "mfa_required") {
      return (
        publishMessage ||
        "Admin verification is required. Complete MFA and publish will continue."
      );
    }
    if (publishStatus === "error") return publishMessage || "Publish failed.";
    if (saveStatus === "error") return saveMessage || "Save failed.";
    if (saveStatus === "saved") {
      return `Draft saved at ${timestampLabel(lastSavedAt)}.`;
    }
    if (saveStatus === "dirty") return "Unsaved changes.";
    return "No pending changes.";
  }, [saveStatus, publishStatus, publishMessage, saveMessage, lastSavedAt]);

  const updateProofStat = (index: number, field: "value" | "label", value: string) => {
    setPayload((current) => ({
      ...current,
      hero: {
        ...current.hero,
        proofStats: current.hero.proofStats.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, [field]: value } : entry
        ),
      },
    }));
  };

  const updateSliderCard = (
    index: number,
    field: "showName" | "title" | "rawImage" | "polishedImage" | "description",
    value: string
  ) => {
    setPayload((current) => ({
      ...current,
      transformation: {
        ...current.transformation,
        items: current.transformation.items.map((item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                ...(field === "description"
                  ? {
                      description: value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter((line) => line.length > 0),
                    }
                  : { [field]: value }),
              }
            : item
        ),
      },
    }));
  };

  const saveDraft = async () => {
    if (!canEdit) return;
    setSaveStatus("saving");
    setSaveMessage("");
    setPublishStatus("idle");
    setPublishMessage("");
    try {
      const response = await requestJson<{
        draft: { payload: HomePageEditorPayload; updatedAt: string };
      }>("/api/cms/editor/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });

      const serialized = JSON.stringify(response.draft.payload);
      setPayload(response.draft.payload);
      setBaselinePayloadJson(serialized);
      setLastSavedAt(response.draft.updatedAt);
      setSaveStatus("saved");
      setSaveMessage("Draft saved.");
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage(
        err instanceof Error ? err.message : "Failed to save draft."
      );
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

  const submitPublish = async (
    summary: string,
    options?: { requestMfaOnChallenge?: boolean }
  ): Promise<boolean> => {
    if (!canPublish) return false;
    if (!summary.trim()) {
      setPublishStatus("error");
      setPublishMessage("Publish summary is required.");
      return false;
    }

    setPublishStatus("publishing");
    setPublishMessage("");
    const response = await fetch("/api/cms/editor/homepage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ summary }),
    });

    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      code?: string;
    } | null;

    if (!response.ok) {
      if (
        options?.requestMfaOnChallenge !== false &&
        (response.status === 428 || payload?.code === "mfa_required")
      ) {
        setPublishStatus("mfa_required");
        setPublishMessage(
          "Admin MFA verification is required. Complete verification and publish will continue automatically."
        );
        setShowPublishModal(false);
        await requestMfaChallenge();
        return false;
      }

      setPublishStatus("error");
      setPublishMessage(payload?.error || "Failed to publish.");
      return false;
    }

    setPublishStatus("published");
    setPublishMessage("Home page published successfully.");
    setShowPublishModal(false);
    setPublishSummary("");
    return true;
  };

  const publish = async () => {
    const summary = publishSummary.trim();
    await submitPublish(summary);
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
      const summary = publishSummary.trim();
      if (!summary) {
        setShowPublishModal(true);
        setPublishStatus("error");
        setPublishMessage("Publish summary is required.");
        return;
      }

      const published = await submitPublish(summary, {
        requestMfaOnChallenge: false,
      });

      if (!published) {
        setShowPublishModal(true);
      }
    } catch (err) {
      setMfaStatus(
        err instanceof Error ? err.message : "MFA verification failed."
      );
    } finally {
      setMfaPending(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        Loading home page editor...
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Home
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Edit homepage content in plain language. Save as draft, then publish when ready.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void saveDraft()}
            disabled={!canEdit || saveStatus === "saving"}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 disabled:opacity-60"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => setShowPublishModal(true)}
            disabled={!canPublish || publishStatus === "publishing"}
            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            Publish
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-sm text-amber-200">{statusRail}</p>
        {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Hero
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-xs text-slate-400">Main Image URL</span>
            <input
              value={payload.hero.mainBackground.src}
              onChange={(event) =>
                setPayload((current) => ({
                  ...current,
                  hero: {
                    ...current.hero,
                    mainBackground: {
                      ...current.hero.mainBackground,
                      src: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs text-slate-400">Main Image Alt Text</span>
            <input
              value={payload.hero.mainBackground.alt}
              onChange={(event) =>
                setPayload((current) => ({
                  ...current,
                  hero: {
                    ...current.hero,
                    mainBackground: {
                      ...current.hero.mainBackground,
                      alt: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Proof Numbers
        </h2>
        <div className="mt-3 space-y-3">
          {payload.hero.proofStats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="grid gap-2 sm:grid-cols-2">
              <input
                value={stat.value}
                onChange={(event) =>
                  updateProofStat(index, "value", event.target.value)
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                placeholder="Value"
              />
              <input
                value={stat.label}
                onChange={(event) =>
                  updateProofStat(index, "label", event.target.value)
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                placeholder="Label"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Before &amp; After Slider Cards
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          These cards appear lower on the homepage. Add the original image in
          <strong className="text-slate-200"> Before Image</strong> and the final designed image in
          <strong className="text-slate-200"> After Image</strong>.
        </p>
        <div className="mt-4 space-y-5">
          {payload.transformation.items.map((item, index) => (
            <div
              key={`${item.show}-${index}`}
              className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-100">
                  Slider Card #{index + 1}
                </p>
                <a
                  href={`/cms/media?target=transformation.${index}.raw`}
                  className="text-xs text-amber-200 underline"
                >
                  Open media picker
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={item.showName}
                  onChange={(event) =>
                    updateSliderCard(index, "showName", event.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Show Name"
                />
                <input
                  value={item.title}
                  onChange={(event) =>
                    updateSliderCard(index, "title", event.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Headline"
                />
                <input
                  value={item.rawImage}
                  onChange={(event) =>
                    updateSliderCard(index, "rawImage", event.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="Before Image URL"
                />
                <input
                  value={item.polishedImage}
                  onChange={(event) =>
                    updateSliderCard(index, "polishedImage", event.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="After Image URL"
                />
              </div>
              <textarea
                value={item.description.join("\n")}
                onChange={(event) =>
                  updateSliderCard(index, "description", event.target.value)
                }
                rows={4}
                className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                placeholder="Description (one paragraph per line)"
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">
                    Before preview
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.rawImage}
                    alt={`${item.showName} before`}
                    className="h-28 w-full rounded object-cover"
                  />
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">
                    After preview
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.polishedImage}
                    alt={`${item.showName} after`}
                    className="h-28 w-full rounded object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Call To Action
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          This is the final homepage section with your conversion button.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={payload.cta.titleLead}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                cta: {
                  ...current.cta,
                  titleLead: event.target.value,
                },
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Title Lead"
          />
          <input
            value={payload.cta.titleAccent}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                cta: {
                  ...current.cta,
                  titleAccent: event.target.value,
                },
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Title Accent"
          />
          <input
            value={payload.cta.buttonLabel}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                cta: {
                  ...current.cta,
                  buttonLabel: event.target.value,
                },
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Button Label"
          />
          <input
            value={payload.cta.buttonHref}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                cta: {
                  ...current.cta,
                  buttonHref: event.target.value,
                },
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Button Link (e.g. /contact)"
          />
        </div>
        <textarea
          value={payload.cta.subtitle}
          onChange={(event) =>
            setPayload((current) => ({
              ...current,
              cta: {
                ...current.cta,
                subtitle: event.target.value,
              },
            }))
          }
          rows={3}
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          placeholder="CTA subtitle"
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
