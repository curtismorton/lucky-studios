"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCmsAuth } from "@/components/cms/CmsAuthProvider";
import { useCmsApi } from "@/components/cms/useCmsApi";
import type { HomePageEditorPayload } from "@/lib/cms/editorTypes";
import { defaultHomepageContent } from "@/lib/data/homepageContent";

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

function formatBytes(sizeBytes: number | null): string {
  if (!sizeBytes || sizeBytes <= 0) return "-";
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function targetLabel(value: string): string {
  if (value.startsWith("transformation.")) {
    const match = value.match(/^transformation\.(\d+)\.(raw|polished)$/);
    if (match) {
      const cardIndex = Number(match[1]) + 1;
      return `Slider Card ${cardIndex} ${match[2] === "raw" ? "Before" : "After"} Image`;
    }
  }
  if (value === "hero.mainBackground") return "Hero Main Image";
  if (value === "hero.accentImage") return "Hero Accent Image";
  return value;
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
    searchParams.get("target") || "transformation.0.raw"
  );

  const [sliderCards, setSliderCards] = useState<
    Array<{ index: number; showName: string }>
  >([]);
  const [pairIndex, setPairIndex] = useState(0);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [pairUploading, setPairUploading] = useState(false);

  const loadAssets = useCallback(async () => {
    const response = await requestJson<{ assets: Asset[] }>("/api/dashboard/media");
    setAssets(response.assets || []);
  }, [requestJson]);

  const loadHomepageTargets = useCallback(async () => {
    const response = await requestJson<HomepageEditorResponse>(
      "/api/cms/editor/homepage"
    );
    const payload =
      response.draft?.payload ||
      response.published?.payload ||
      defaultHomepageContent;
    const cards = payload.transformation.items.map((item, index) => ({
      index,
      showName: item.showName || `Card ${index + 1}`,
    }));
    setSliderCards(cards);
    if (cards.length > 0 && pairIndex >= cards.length) {
      setPairIndex(0);
    }
  }, [requestJson, pairIndex]);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setStatus("");
      try {
        await Promise.all([loadAssets(), loadHomepageTargets()]);
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
  }, [loadAssets, loadHomepageTargets]);

  const updateHomepageTarget = async (target: string, url: string) => {
    const response = await requestJson<HomepageEditorResponse>(
      "/api/cms/editor/homepage"
    );
    const payload =
      response.draft?.payload ||
      response.published?.payload ||
      defaultHomepageContent;

    const nextPayload: HomePageEditorPayload = JSON.parse(JSON.stringify(payload));

    if (target === "hero.mainBackground") {
      nextPayload.hero.mainBackground.src = url;
    } else if (target === "hero.accentImage") {
      nextPayload.hero.accentImage.src = url;
    } else {
      const match = target.match(/^transformation\.(\d+)\.(raw|polished)$/);
      if (!match) {
        throw new Error(`Unknown target: ${target}`);
      }
      const index = Number(match[1]);
      const key = match[2] === "raw" ? "rawImage" : "polishedImage";
      if (!nextPayload.transformation.items[index]) {
        throw new Error("Selected slider card does not exist.");
      }
      nextPayload.transformation.items[index][key] = url;
    }

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
      await Promise.all([loadAssets(), loadHomepageTargets()]);
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
      await loadHomepageTargets();
      setStatus(`Assigned to ${targetLabel(target)}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to assign image.");
    }
  };

  const uploadPair = async () => {
    if (!canEdit) return;
    if (!beforeFile || !afterFile) {
      setStatus("Choose both before and after files.");
      return;
    }

    setPairUploading(true);
    setStatus("Uploading before/after pair...");
    try {
      const uploadOne = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", uploadFolder || "homepage");
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
          throw new Error(payload?.error || `Upload failed for ${file.name}.`);
        }
        return payload.asset.url;
      };

      const [beforeUrl, afterUrl] = await Promise.all([
        uploadOne(beforeFile),
        uploadOne(afterFile),
      ]);

      await updateHomepageTarget(`transformation.${pairIndex}.raw`, beforeUrl);
      await updateHomepageTarget(
        `transformation.${pairIndex}.polished`,
        afterUrl
      );

      await Promise.all([loadAssets(), loadHomepageTargets()]);
      setBeforeFile(null);
      setAfterFile(null);
      setStatus(`Pair uploaded and assigned to Slider Card ${pairIndex + 1}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Paired upload failed.");
    } finally {
      setPairUploading(false);
    }
  };

  const targetOptions = useMemo(() => {
    const base = [
      { value: "hero.mainBackground", label: "Hero Main Image" },
      { value: "hero.accentImage", label: "Hero Accent Image" },
    ];
    const cardOptions = sliderCards.flatMap((card) => [
      {
        value: `transformation.${card.index}.raw`,
        label: `${card.showName} Before Image`,
      },
      {
        value: `transformation.${card.index}.polished`,
        label: `${card.showName} After Image`,
      },
    ]);
    return [...base, ...cardOptions];
  }, [sliderCards]);

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
          Upload files and assign them directly to homepage fields with one click.
        </p>
      </header>

      {status ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-amber-200">
          {status}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Single Upload + Assign
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
            {targetOptions.map((option) => (
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
          Paired Slider Upload
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Upload both before and after images in one action and map them to one slider card.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <select
            value={pairIndex}
            onChange={(event) => setPairIndex(Number(event.target.value))}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            disabled={!canEdit}
          >
            {sliderCards.map((card) => (
              <option key={card.index} value={card.index}>
                Slider Card {card.index + 1}: {card.showName}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(event) => setBeforeFile(event.target.files?.[0] || null)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            disabled={!canEdit}
          />
          <input
            type="file"
            onChange={(event) => setAfterFile(event.target.files?.[0] || null)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            disabled={!canEdit}
          />
        </div>
        <button
          type="button"
          onClick={() => void uploadPair()}
          disabled={!canEdit || pairUploading}
          className="mt-3 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {pairUploading ? "Uploading Pair..." : "Upload Pair + Assign"}
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
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      void assignExistingAsset(
                        `transformation.${pairIndex}.raw`,
                        asset.url
                      )
                    }
                    disabled={!canEdit}
                    className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                  >
                    Set Before
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void assignExistingAsset(
                        `transformation.${pairIndex}.polished`,
                        asset.url
                      )
                    }
                    disabled={!canEdit}
                    className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                  >
                    Set After
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
