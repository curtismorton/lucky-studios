"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardPanel, ModuleHeader } from "@/components/dashboard/ModuleHeader";
import { useDashboardApi } from "@/components/dashboard/useDashboardApi";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";

type Asset = {
  id: string;
  path: string;
  url: string;
  folder: string;
  mimeType: string | null;
  sizeBytes: number | null;
  alt: string | null;
  caption: string | null;
  tags: string[];
  status: string;
};

type UsageEntry = {
  entityId: string;
  entityKey: string;
  workspace: string;
  fieldPath: string;
  updatedAt: string;
};

export default function DashboardMediaPage() {
  const { requestJson } = useDashboardApi();
  const { profile, fetchWithAuth } = useDashboardAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [usages, setUsages] = useState<UsageEntry[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadFolder, setUploadFolder] = useState("homepage");

  const canEdit = profile?.role === "editor" || profile?.role === "admin";

  const loadAssets = useCallback(async () => {
    const search = query.trim() ? `?query=${encodeURIComponent(query.trim())}` : "";
    const response = await requestJson<{ assets: Asset[] }>(
      `/api/dashboard/media${search}`
    );
    setAssets(response.assets || []);
    setSelectedAssetId((current) => current || response.assets?.[0]?.id || "");
  }, [query, requestJson]);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setStatus("");
      try {
        await loadAssets();
      } catch (error) {
        if (!active) return;
        setStatus(error instanceof Error ? error.message : "Failed to load media assets.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadAssets]);

  useEffect(() => {
    if (!selectedAssetId) {
      setUsages([]);
      return;
    }
    void (async () => {
      try {
        const response = await requestJson<{ usages: UsageEntry[] }>(
          `/api/dashboard/media/${selectedAssetId}/usages`
        );
        setUsages(response.usages || []);
      } catch {
        setUsages([]);
      }
    })();
  }, [selectedAssetId, requestJson]);

  const upload = async () => {
    if (!uploadFile) {
      setStatus("Choose a file to upload.");
      return;
    }

    setStatus("");
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("folder", uploadFolder || "homepage");
      if (uploadAlt.trim()) formData.append("alt", uploadAlt.trim());

      const response = await fetchWithAuth("/api/dashboard/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error || "Upload failed.");
      }

      setUploadFile(null);
      setUploadAlt("");
      await loadAssets();
      setStatus("Asset uploaded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    }
  };

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) || null;

  const updateMetadata = async (patch: {
    alt?: string | null;
    caption?: string | null;
    tags?: string[] | null;
  }) => {
    if (!selectedAssetId) return;
    await requestJson(`/api/dashboard/media/${selectedAssetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await loadAssets();
  };

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Media"
        subtitle="Managed library with folder/search, metadata editing, and usage references."
        actions={
          <button
            type="button"
            onClick={() => void loadAssets()}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200"
          >
            Refresh
          </button>
        }
      />

      {status ? <DashboardPanel className="text-amber-200">{status}</DashboardPanel> : null}
      {loading ? <DashboardPanel>Loading media library...</DashboardPanel> : null}

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardPanel>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search path / alt / caption"
              className="min-w-[240px] flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => void loadAssets()}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200"
            >
              Search
            </button>
          </div>

          <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-2 py-2">Path</th>
                  <th className="px-2 py-2">Folder</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Alt</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={`cursor-pointer border-t border-slate-800 ${
                      selectedAssetId === asset.id ? "bg-amber-500/10" : ""
                    }`}
                    onClick={() => setSelectedAssetId(asset.id)}
                  >
                    <td className="max-w-[380px] truncate px-2 py-2 text-slate-100">
                      {asset.path}
                    </td>
                    <td className="px-2 py-2 text-slate-300">{asset.folder}</td>
                    <td className="px-2 py-2 text-slate-300">{asset.status}</td>
                    <td className="px-2 py-2 text-slate-300">
                      {asset.alt?.trim() ? "set" : "missing"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel>
            <h2 className="text-sm font-semibold text-slate-100">Upload</h2>
            <div className="mt-3 space-y-3">
              <input
                type="file"
                onChange={(event) => setUploadFile(event.target.files?.[0] || null)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                disabled={!canEdit}
              />
              <input
                value={uploadFolder}
                onChange={(event) => setUploadFolder(event.target.value)}
                placeholder="Folder"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                disabled={!canEdit}
              />
              <input
                value={uploadAlt}
                onChange={(event) => setUploadAlt(event.target.value)}
                placeholder="Alt text"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                disabled={!canEdit}
              />
              <button
                type="button"
                onClick={() => void upload()}
                disabled={!canEdit}
                className="w-full rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
              >
                Upload Asset
              </button>
            </div>
          </DashboardPanel>

          <DashboardPanel>
            <h2 className="text-sm font-semibold text-slate-100">Selected Asset</h2>
            {!selectedAsset ? (
              <p className="mt-2 text-sm text-slate-400">Select an asset from the table.</p>
            ) : (
              <div className="mt-3 space-y-3">
                <p className="truncate text-xs text-slate-400">{selectedAsset.path}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.alt || selectedAsset.path}
                  className="h-40 w-full rounded-lg border border-slate-700 object-cover"
                />
                <input
                  defaultValue={selectedAsset.alt || ""}
                  onBlur={(event) =>
                    void updateMetadata({ alt: event.target.value || null })
                  }
                  placeholder="Alt text"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  disabled={!canEdit}
                />
                <textarea
                  defaultValue={selectedAsset.caption || ""}
                  onBlur={(event) =>
                    void updateMetadata({ caption: event.target.value || null })
                  }
                  rows={3}
                  placeholder="Caption"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  disabled={!canEdit}
                />
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel>
            <h2 className="text-sm font-semibold text-slate-100">Usage References</h2>
            <div className="mt-3 space-y-2">
              {usages.length === 0 ? (
                <p className="text-sm text-slate-400">No usage records found.</p>
              ) : (
                usages.map((usage) => (
                  <div
                    key={`${usage.entityId}-${usage.fieldPath}-${usage.workspace}`}
                    className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2"
                  >
                    <p className="text-sm text-slate-100">
                      {usage.entityKey} ({usage.workspace})
                    </p>
                    <p className="text-xs text-slate-400">{usage.fieldPath}</p>
                  </div>
                ))
              )}
            </div>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
