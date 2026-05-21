import "server-only";

import { createHash } from "node:crypto";
import { createServiceRoleClient, getSupabaseServiceConfig } from "@/lib/cms/supabase";
import type { CmsAsset } from "@/lib/cms/types";
import { uploadMediaAsset, listMediaAssets } from "@/lib/services/mediaLibrary";

export type CmsMediaListFilters = {
  folder?: string;
  query?: string;
  limit?: number;
};

export type CmsAssetRecord = CmsAsset;

const DEFAULT_BUCKET = process.env.CMS_MEDIA_BUCKET || "site-media";

function inferFolder(path: string): string {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  const idx = normalized.lastIndexOf("/");
  return idx > 0 ? normalized.slice(0, idx) : "root";
}

function mapAssetRow(row: Record<string, unknown>): CmsAssetRecord {
  return {
    id: row.id as string,
    path: row.path as string,
    url: row.url as string,
    folder: row.folder as string,
    mimeType: (row.mime_type as string | null) || null,
    sizeBytes:
      typeof row.size_bytes === "number" ? (row.size_bytes as number) : null,
    width: typeof row.width === "number" ? (row.width as number) : null,
    height: typeof row.height === "number" ? (row.height as number) : null,
    durationMs:
      typeof row.duration_ms === "number" ? (row.duration_ms as number) : null,
    alt: (row.alt as string | null) || null,
    caption: (row.caption as string | null) || null,
    tags: Array.isArray(row.tags)
      ? row.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    checksum: (row.checksum as string | null) || null,
    status: (row.status as string) || "active",
    uploadedBy: (row.uploaded_by as string | null) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function bytesToChecksum(bytes: ArrayBuffer): string {
  return createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}

export async function listDashboardAssets(
  filters: CmsMediaListFilters = {}
): Promise<CmsAssetRecord[]> {
  const client = createServiceRoleClient();
  const limit = Math.min(Math.max(filters.limit ?? 80, 1), 300);

  let query = client
    .from("cms_assets")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (filters.folder && filters.folder.trim().length > 0) {
    query = query.eq("folder", filters.folder.trim());
  }

  if (filters.query && filters.query.trim().length > 0) {
    const q = `%${filters.query.trim()}%`;
    query = query.or(`path.ilike.${q},alt.ilike.${q},caption.ilike.${q}`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => mapAssetRow(row as Record<string, unknown>));
}

export async function uploadDashboardAsset(input: {
  fileName: string;
  fileType: string;
  bytes: ArrayBuffer;
  folder?: string;
  alt?: string;
  caption?: string;
  tags?: string[];
  uploadedBy: string;
}): Promise<CmsAssetRecord> {
  const uploaded = await uploadMediaAsset({
    fileName: input.fileName,
    fileType: input.fileType,
    bytes: input.bytes,
    folder: input.folder,
  });

  if (!uploaded.ok || !uploaded.asset) {
    throw new Error(uploaded.error || "Failed to upload media file.");
  }

  const client = createServiceRoleClient();
  const checksum = bytesToChecksum(input.bytes);
  const tags = Array.isArray(input.tags)
    ? Array.from(new Set(input.tags.map((tag) => tag.trim()).filter(Boolean)))
    : [];
  const folder = input.folder?.trim() || inferFolder(uploaded.asset.path);

  const { data, error } = await client
    .from("cms_assets")
    .upsert(
      {
        path: uploaded.asset.path,
        url: uploaded.asset.url,
        folder,
        mime_type: uploaded.asset.mimeType || input.fileType || null,
        size_bytes: uploaded.asset.size || input.bytes.byteLength,
        alt: input.alt?.trim() || null,
        caption: input.caption?.trim() || null,
        tags,
        checksum,
        status: "active",
        uploaded_by: input.uploadedBy,
      },
      {
        onConflict: "path",
      }
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to persist asset metadata.");
  }

  return mapAssetRow(data as Record<string, unknown>);
}

async function uploadToExistingPath(input: {
  path: string;
  bytes: ArrayBuffer;
  fileType: string;
}): Promise<void> {
  const config = getSupabaseServiceConfig();
  if (!config) {
    throw new Error(
      "Supabase service role config missing for media replacement upload."
    );
  }

  const path = input.path.replace(/^\/+/, "");
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const endpoint = `${config.url}/storage/v1/object/${DEFAULT_BUCKET}/${encodedPath}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": input.fileType || "application/octet-stream",
      "x-upsert": "true",
    },
    body: Buffer.from(input.bytes),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `${response.status} ${response.statusText}`);
  }
}

export async function replaceDashboardAsset(input: {
  assetId: string;
  fileName: string;
  fileType: string;
  bytes: ArrayBuffer;
  uploadedBy: string;
}): Promise<CmsAssetRecord> {
  const client = createServiceRoleClient();
  const { data: existing, error: existingError } = await client
    .from("cms_assets")
    .select("*")
    .eq("id", input.assetId)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existing) {
    throw new Error("Asset not found.");
  }

  await uploadToExistingPath({
    path: existing.path as string,
    bytes: input.bytes,
    fileType: input.fileType,
  });

  const checksum = bytesToChecksum(input.bytes);
  const { data, error } = await client
    .from("cms_assets")
    .update({
      mime_type: input.fileType || (existing.mime_type as string | null),
      size_bytes: input.bytes.byteLength,
      checksum,
      uploaded_by: input.uploadedBy,
      status: "active",
    })
    .eq("id", input.assetId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update replaced asset.");
  }

  return mapAssetRow(data as Record<string, unknown>);
}

export async function updateDashboardAssetMetadata(
  assetId: string,
  patch: {
    alt?: string | null;
    caption?: string | null;
    folder?: string | null;
    status?: string | null;
    tags?: string[] | null;
  }
): Promise<CmsAssetRecord> {
  const client = createServiceRoleClient();

  const updates: Record<string, unknown> = {};
  if (patch.alt !== undefined) {
    updates.alt = patch.alt?.trim() || null;
  }
  if (patch.caption !== undefined) {
    updates.caption = patch.caption?.trim() || null;
  }
  if (patch.folder !== undefined) {
    updates.folder = patch.folder?.trim() || "root";
  }
  if (patch.status !== undefined) {
    updates.status = patch.status?.trim() || "active";
  }
  if (patch.tags !== undefined) {
    updates.tags = Array.isArray(patch.tags)
      ? Array.from(
          new Set(patch.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0))
        )
      : [];
  }

  const { data, error } = await client
    .from("cms_assets")
    .update(updates)
    .eq("id", assetId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update asset metadata.");
  }

  return mapAssetRow(data as Record<string, unknown>);
}

export async function getDashboardAssetUsage(assetId: string): Promise<
  Array<{
    entityId: string;
    entityKey: string;
    workspace: string;
    fieldPath: string;
    updatedAt: string;
  }>
> {
  const client = createServiceRoleClient();

  const { data: usages, error } = await client
    .from("cms_asset_usages")
    .select("entity_id,workspace,field_path,updated_at")
    .eq("asset_id", assetId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!usages || usages.length === 0) return [];

  const entityIds = Array.from(
    new Set(
      usages
        .map((usage) => usage.entity_id)
        .filter((entry): entry is string => typeof entry === "string")
    )
  );

  const { data: entities } = await client
    .from("cms_entities")
    .select("id,entity_key")
    .in("id", entityIds);

  const keyByEntityId = new Map<string, string>();
  (entities || []).forEach((entity) => {
    keyByEntityId.set(entity.id as string, entity.entity_key as string);
  });

  return usages.map((usage) => ({
    entityId: usage.entity_id as string,
    entityKey: keyByEntityId.get(usage.entity_id as string) || "unknown",
    workspace: usage.workspace as string,
    fieldPath: usage.field_path as string,
    updatedAt: usage.updated_at as string,
  }));
}

export async function syncLegacyMediaAssetsFromStorage(folder?: string) {
  const listed = await listMediaAssets(folder);
  if (!listed.ok || !listed.assets || listed.assets.length === 0) return;

  const client = createServiceRoleClient();

  const upserts = listed.assets.map((asset) => ({
    path: asset.path,
    url: asset.url,
    folder: inferFolder(asset.path),
    mime_type: asset.mimeType || null,
    size_bytes: asset.size || null,
    status: "active",
  }));

  await client.from("cms_assets").upsert(upserts, {
    onConflict: "path",
  });
}
