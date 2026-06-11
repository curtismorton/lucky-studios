"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCmsAuth } from "@/components/cms/CmsAuthProvider";
import { useCmsApi } from "@/components/cms/useCmsApi";
import type { HomePageEditorPayload } from "@/lib/cms/editorTypes";
import { homeContent } from "@/lib/content/home";

type Asset = {
  id: string;
  path: string;
  url: string;
  folder: string;
  mimeType: string | null;
  sizeBytes: number | null;
  alt: string | null;
  status: string;
};

type HomepageEditorResponse = {
  draft: {
    payload: HomePageEditorPayload;
  } | null;
  published: {
    payload: HomePageEditorPayload;
  } | null;
};

const HOMEPAGE_TARGETS = [
  { value: "coldOpen.plate", label: "Homepage — Cold open plate" },
  { value: "theRoom.plate", label: "Homepage — The Room plate" },
  { value: "receipts.cases.0.plate", label: "Homepage — Case 01 plate" },
  { value: "receipts.cases.1.plate", label: "Homepage — Case 02 plate" },
];

function formatBytes(sizeBytes: number | null): string {
  if (!sizeBytes || sizeBytes <= 0) return "-";
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function targetLabel(value: string): string {
  return HOMEPAGE_TARGETS.find((target) => target.value === value)?.label || value;
}

/** Assign `url` at a dot path ("receipts.cases.0.plate") inside the payload. */
function setPayloadPath(payload: unknown, path: string, url: string): void {
  const segments = path.split(".");
  let cursor = payload as Record<string, unknown>;
  for (const segment of segments.slice(0, -1)) {
    const next = Array.isArray(cursor)
      ? (cursor as unknown[])[Number(segment)]
      : cursor[segment];
    if (typeof next !== "object" || next === null) {
      throw new Error(`Unknown target: ${path}`);
    }
    cursor = next as Record<string, unknown>;
  }
  const last = segments[segments.length - 1];
  if (typeof cursor[last] !== "string") {
    throw new Error(`Target is not an image field: ${path}`);
  }
  cursor[last] = url;
}

export default function CmsMediaPage() {
  const searchParams = useSearchParams();
  const { requestJson } = useCmsApi();
  const { session } = useCmsAuth();

  const canEdit =
    session?.user.role === "editor" || session?.user.role === "admin";

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadFolder, setUploadFolder] = useState("homepage");
  const [selectedTarget, setSelectedTarget] = useState(
    searchParams.get("target") || HOMEPAGE_TARGETS[0].value
  );

  const loadAssets = useCallback(async () => {
    const response = await requestJson<{ assets: Asset[] }>("/api/dashboard/media");
    setAssets(response.assets || []);
  }, [requestJson]);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setStatus("");
      try {
        await loadAssets();
      } catch (error) {
        if (!active) return;
        setStatus(
          error instanceof Error ? error.message : "Failed to load media library."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadAssets]);

  const updateHomepageTarget = async (target: string, url: string) => {
    const response = await requestJson<HomepageEditorResponse>(
      "/api/cms/editor/homepage"
    );
    const payload =
      response.draft?.payload || response.published?.payload || homeContent;

    const nextPayload: HomePageEditorPayload = JSON.parse(JSON.stringify(payload));
    setPayloadPath(nextPayload, target, url);

    await requestJson("/api/cms/editor/homepage", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: nextPayload }),
    });
  };

  const uploadSingle = async () => {
    if (!canEdit) return;
    if (!uploadFile) {
      setStatus("Choose a file to upload.");
      return;
    }

    setStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("folder", uploadFolder || "homepage");
      if (uploadAlt.trim()) {
        formData.append("alt", uploadAlt.trim());
      }

      const response = await fetch("/api/dashboard/media/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        asset?: Asset;
      } | null;

      if (!response.ok || !payload?.asset?.url) {
        throw new Error(payload?.error || "Failed to upload media.");
      }

      await updateHomepageTarget(selectedTarget, payload.asset.url);
      setUploadFile(null);
      setUploadAlt("");
      await loadAssets();
      setStatus(`Uploaded and assigned to ${targetLabel(selectedTarget)}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    }
  };

  const assignExistingAsset = async (target: string, url: string) => {
    if (!canEdit) return;
    setStatus("Assigning image...");
    try {
      await updateHomepageTarget(target, url);
      setStatus(`Assigned to ${targetLabel(target)}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to assign image.");
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        Loading media library...
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Media</h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload files and assign them directly to homepage plates with one click.
          Saved changes land in the homepage draft — publish from the editor.
        </p>
      </header>

      {status ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-amber-200">
          {status}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Upload + Assign
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            type="file"
            onChange={(event) => setUploadFile(event.target.files?.[0] || null)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            disabled={!canEdit}
          />
          <input
            value={uploadAlt}
            onChange={(event) => setUploadAlt(event.target.value)}
            placeholder="Alt text (optional)"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            disabled={!canEdit}
          />
          <input
            value={uploadFolder}
            onChange={(event) => setUploadFolder(event.target.value)}
            placeholder="Folder"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            disabled={!canEdit}
          />
          <select
            value={selectedTarget}
            onChange={(event) => setSelectedTarget(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            disabled={!canEdit}
          >
            {HOMEPAGE_TARGETS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => void uploadSingle()}
          disabled={!canEdit}
          className="mt-3 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          Upload + Assign
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Library
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={asset.alt || asset.path}
                className="h-36 w-full object-cover"
              />
              <div className="space-y-2 p-3">
                <p className="truncate text-xs text-slate-400">{asset.path}</p>
                <p className="text-xs text-slate-500">
                  {asset.mimeType || "unknown"} · {formatBytes(asset.sizeBytes)}
                </p>
                <button
                  type="button"
                  onClick={() => void assignExistingAsset(selectedTarget, asset.url)}
                  disabled={!canEdit}
                  className="w-full rounded-lg border border-amber-400/40 px-3 py-1.5 text-xs text-amber-200 disabled:opacity-50"
                >
                  Use for {targetLabel(selectedTarget)}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
