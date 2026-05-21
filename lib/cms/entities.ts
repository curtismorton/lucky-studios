import "server-only";

import { createServiceRoleClient } from "@/lib/cms/supabase";
import {
  defaultCmsEntityDefinitions,
  defaultCmsPayloadMap,
  defaultCmsSeoByEntity,
} from "@/lib/cms/defaults";
import type {
  CmsEntityContent,
  CmsEntityDefinition,
  CmsEntityKey,
  CmsEntityModule,
  CmsEntityPayload,
  CmsEntityPayloadMap,
  CmsEntityRecord,
  CmsPublishResult,
  CmsSeoConfig,
  CmsSnapshot,
  CmsWorkspace,
  DashboardOverview,
} from "@/lib/cms/types";
import {
  normalizeHomepageContent,
  type HomepageContent,
} from "@/lib/data/homepageContent";
import {
  normalizeMarketingPagesContent,
  type MarketingPagesContent,
} from "@/lib/data/marketingContent";
import { type Show } from "@/lib/data/shows";
import { revalidatePublishedEntity } from "@/lib/cms/revalidate";

type EntityRow = {
  id: string;
  entity_key: CmsEntityKey;
  entity_type: string;
  module: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type EntityContentRow = {
  entity_id: string;
  workspace: CmsWorkspace;
  payload: unknown;
  seo: unknown;
  version: number;
  updated_by: string | null;
  updated_at: string;
};

const DEFAULT_MEDIA_BUCKET = process.env.CMS_MEDIA_BUCKET || "site-media";

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithDefaults<T>(defaults: T, input: unknown): T {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(input)) return deepClone(defaults);
    if (defaults.length === 0) return deepClone(input as T);
    return input.map((entry, index) => {
      const template = defaults[Math.min(index, defaults.length - 1)];
      return mergeWithDefaults(template, entry);
    }) as T;
  }

  if (isObject(defaults)) {
    if (!isObject(input)) return deepClone(defaults);
    const merged: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      merged[key] = mergeWithDefaults(
        (defaults as Record<string, unknown>)[key],
        (input as Record<string, unknown>)[key]
      );
    }
    return merged as T;
  }

  if (typeof defaults === "string") {
    return (typeof input === "string" ? input : defaults) as T;
  }

  if (typeof defaults === "number") {
    return (typeof input === "number" && Number.isFinite(input)
      ? input
      : defaults) as T;
  }

  if (typeof defaults === "boolean") {
    return (typeof input === "boolean" ? input : defaults) as T;
  }

  return (input ?? defaults) as T;
}

function normalizeSeo(input: unknown, fallback: CmsSeoConfig): CmsSeoConfig {
  if (!isObject(input)) return deepClone(fallback);

  const value = input as Record<string, unknown>;
  const title =
    typeof value.title === "string" && value.title.trim().length > 0
      ? value.title.trim()
      : fallback.title;
  const description =
    typeof value.description === "string" && value.description.trim().length > 0
      ? value.description.trim()
      : fallback.description;
  const canonicalPath =
    typeof value.canonicalPath === "string" &&
    value.canonicalPath.trim().length > 0
      ? value.canonicalPath.trim()
      : fallback.canonicalPath;
  const ogImage =
    typeof value.ogImage === "string" && value.ogImage.trim().length > 0
      ? value.ogImage.trim()
      : fallback.ogImage;
  const schemaType =
    typeof value.schemaType === "string" && value.schemaType.trim().length > 0
      ? value.schemaType.trim()
      : fallback.schemaType;
  const noindex =
    typeof value.noindex === "boolean" ? value.noindex : fallback.noindex;
  const keywords = Array.isArray(value.keywords)
    ? value.keywords.filter(
        (entry): entry is string => typeof entry === "string" && entry.length > 0
      )
    : fallback.keywords;

  return {
    title,
    description,
    canonicalPath,
    ogImage,
    schemaType,
    noindex,
    keywords,
  };
}

function normalizeShowsPayload(input: unknown): CmsEntityPayloadMap["shows"] {
  const defaults = defaultCmsPayloadMap.shows;
  if (!isObject(input) || !Array.isArray((input as { items?: unknown }).items)) {
    return deepClone(defaults);
  }

  const rawItems = (input as { items: unknown[] }).items;
  const fallbackItems = defaults.items;
  const normalizedItems: Array<Show & { seo?: CmsSeoConfig }> = [];

  rawItems.forEach((entry, index) => {
    if (!isObject(entry)) return;
    const fallback = fallbackItems[index % fallbackItems.length];
    const merged = mergeWithDefaults(fallback, entry) as Show & {
      seo?: CmsSeoConfig;
    };

    normalizedItems.push({
      ...merged,
      seo: normalizeSeo(merged.seo, fallback.seo || {}),
    });
  });

  return {
    items: normalizedItems.length > 0 ? normalizedItems : deepClone(defaults.items),
  };
}

function normalizePayloadForKey<TKey extends CmsEntityKey>(
  entityKey: TKey,
  payload: unknown
): CmsEntityPayloadMap[TKey] {
  const fallback = defaultCmsPayloadMap[entityKey];

  if (entityKey === "homepage") {
    return normalizeHomepageContent(payload) as CmsEntityPayloadMap[TKey];
  }

  if (entityKey === "marketing-pages") {
    return normalizeMarketingPagesContent(
      payload
    ) as CmsEntityPayloadMap[TKey];
  }

  if (entityKey === "shows") {
    return normalizeShowsPayload(payload) as CmsEntityPayloadMap[TKey];
  }

  return mergeWithDefaults(fallback, payload) as CmsEntityPayloadMap[TKey];
}

function mapEntityRow(row: EntityRow): CmsEntityRecord {
  return {
    id: row.id,
    entityKey: row.entity_key,
    entityType: row.entity_type as CmsEntityRecord["entityType"],
    module: row.module as CmsEntityModule,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapContentRow<TPayload>(
  row: EntityContentRow,
  entity: CmsEntityRecord
): CmsEntityContent<TPayload> {
  const fallbackSeo = defaultCmsSeoByEntity[entity.entityKey];
  return {
    entityId: row.entity_id,
    entityKey: entity.entityKey,
    workspace: row.workspace,
    payload: row.payload as TPayload,
    seo: normalizeSeo(row.seo, fallbackSeo),
    version: row.version,
    updatedBy: row.updated_by,
    updatedAt: row.updated_at,
  };
}

function getEntityDefinition(entityKey: CmsEntityKey): CmsEntityDefinition {
  const definition = defaultCmsEntityDefinitions.find((entry) => entry.key === entityKey);
  if (!definition) {
    throw new Error(`Unknown CMS entity key: ${entityKey}`);
  }
  return definition;
}

function extractStoragePath(value: string): string | null {
  const marker = `/storage/v1/object/public/${DEFAULT_MEDIA_BUCKET}/`;
  const markerIndex = value.indexOf(marker);
  if (markerIndex < 0) return null;
  const raw = value.slice(markerIndex + marker.length).split("?")[0];
  if (!raw) return null;
  return decodeURIComponent(raw);
}

function collectAssetUsageCandidates(
  value: unknown,
  currentPath: string,
  output: Array<{ path: string; fieldPath: string }>
) {
  if (typeof value === "string") {
    const storagePath = extractStoragePath(value);
    if (storagePath) {
      output.push({
        path: storagePath,
        fieldPath: currentPath || "$",
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      const nextPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
      collectAssetUsageCandidates(entry, nextPath, output);
    });
    return;
  }

  if (isObject(value)) {
    for (const [key, entry] of Object.entries(value)) {
      const nextPath = currentPath ? `${currentPath}.${key}` : key;
      collectAssetUsageCandidates(entry, nextPath, output);
    }
  }
}

async function writeAuditEvent(input: {
  actorUserId: string | null;
  action: string;
  entityId: string;
  workspace: CmsWorkspace;
  details?: Record<string, unknown>;
}) {
  const client = createServiceRoleClient();
  await client.from("cms_audit_events").insert({
    actor_user_id: input.actorUserId,
    action: input.action,
    entity_id: input.entityId,
    workspace: input.workspace,
    details: input.details || {},
  });
}

async function syncAssetUsages(
  entityId: string,
  workspace: CmsWorkspace,
  payload: unknown
): Promise<void> {
  const client = createServiceRoleClient();

  await client
    .from("cms_asset_usages")
    .delete()
    .eq("entity_id", entityId)
    .eq("workspace", workspace);

  const collected: Array<{ path: string; fieldPath: string }> = [];
  collectAssetUsageCandidates(payload, "", collected);

  if (collected.length === 0) return;

  const uniquePaths = Array.from(new Set(collected.map((entry) => entry.path)));
  const { data: assets } = await client
    .from("cms_assets")
    .select("id,path")
    .in("path", uniquePaths);

  if (!assets || assets.length === 0) return;

  const assetIdByPath = new Map<string, string>();
  assets.forEach((asset) => {
    assetIdByPath.set(asset.path as string, asset.id as string);
  });

  const inserts = collected
    .map((entry) => {
      const assetId = assetIdByPath.get(entry.path);
      if (!assetId) return null;
      return {
        asset_id: assetId,
        entity_id: entityId,
        workspace,
        field_path: entry.fieldPath,
      };
    })
    .filter(
      (
        entry
      ): entry is {
        asset_id: string;
        entity_id: string;
        workspace: CmsWorkspace;
        field_path: string;
      } => Boolean(entry)
    );

  if (inserts.length > 0) {
    await client.from("cms_asset_usages").upsert(inserts, {
      onConflict: "asset_id,entity_id,workspace,field_path",
      ignoreDuplicates: true,
    });
  }
}

export async function ensureEntityRecord(
  entityKey: CmsEntityKey
): Promise<CmsEntityRecord> {
  const client = createServiceRoleClient();

  const { data: existing, error: readError } = await client
    .from("cms_entities")
    .select("*")
    .eq("entity_key", entityKey)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing) {
    return mapEntityRow(existing as EntityRow);
  }

  const definition = getEntityDefinition(entityKey);
  const { data: inserted, error: insertError } = await client
    .from("cms_entities")
    .insert({
      entity_key: definition.key,
      entity_type: definition.entityType,
      module: definition.module,
      title: definition.title,
    })
    .select("*")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message || "Failed to create CMS entity.");
  }

  return mapEntityRow(inserted as EntityRow);
}

export async function getEntityWorkspaceContent<TKey extends CmsEntityKey>(
  entityKey: TKey,
  workspace: CmsWorkspace
): Promise<CmsEntityContent<CmsEntityPayloadMap[TKey]> | null> {
  const entity = await ensureEntityRecord(entityKey);
  const client = createServiceRoleClient();

  const { data, error } = await client
    .from("cms_entity_content")
    .select("*")
    .eq("entity_id", entity.id)
    .eq("workspace", workspace)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const normalizedPayload = normalizePayloadForKey(entityKey, data.payload);
  return {
    ...mapContentRow<CmsEntityPayloadMap[TKey]>(data as EntityContentRow, entity),
    payload: normalizedPayload,
  };
}

export async function getEntityPair<TKey extends CmsEntityKey>(entityKey: TKey): Promise<{
  entity: CmsEntityRecord;
  draft: CmsEntityContent<CmsEntityPayloadMap[TKey]> | null;
  published: CmsEntityContent<CmsEntityPayloadMap[TKey]> | null;
}> {
  const entity = await ensureEntityRecord(entityKey);
  const [draft, published] = await Promise.all([
    getEntityWorkspaceContent(entityKey, "draft"),
    getEntityWorkspaceContent(entityKey, "published"),
  ]);

  return {
    entity,
    draft,
    published,
  };
}

export async function listEntities(module?: CmsEntityModule): Promise<
  Array<{
    entity: CmsEntityRecord;
    draft: CmsEntityContent | null;
    published: CmsEntityContent | null;
    outOfSync: boolean;
  }>
> {
  const client = createServiceRoleClient();

  const query = client.from("cms_entities").select("*").order("module").order("title");
  if (module) {
    query.eq("module", module);
  }

  const { data: rows, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const entities = (rows || []).map((row) => mapEntityRow(row as EntityRow));
  if (entities.length === 0) return [];

  const entityIds = entities.map((entity) => entity.id);
  const { data: contentRows, error: contentError } = await client
    .from("cms_entity_content")
    .select("*")
    .in("entity_id", entityIds);

  if (contentError) {
    throw new Error(contentError.message);
  }

  const byEntityWorkspace = new Map<string, EntityContentRow>();
  (contentRows || []).forEach((row) => {
    const typed = row as EntityContentRow;
    byEntityWorkspace.set(`${typed.entity_id}:${typed.workspace}`, typed);
  });

  return entities.map((entity) => {
    const draftRow = byEntityWorkspace.get(`${entity.id}:draft`);
    const publishedRow = byEntityWorkspace.get(`${entity.id}:published`);
    const draft = draftRow ? mapContentRow(draftRow, entity) : null;
    const published = publishedRow ? mapContentRow(publishedRow, entity) : null;
    let outOfSync = false;
    if (draft) {
      outOfSync =
        !published ||
        draft.updatedAt > published.updatedAt ||
        draft.version !== published.version;
    }

    return {
      entity,
      draft,
      published,
      outOfSync,
    };
  });
}

export async function saveEntityDraft<TKey extends CmsEntityKey>(
  entityKey: TKey,
  payload: unknown,
  seo: unknown,
  userId: string | null
): Promise<CmsEntityContent<CmsEntityPayloadMap[TKey]>> {
  const entity = await ensureEntityRecord(entityKey);
  const client = createServiceRoleClient();

  const normalizedPayload = normalizePayloadForKey(entityKey, payload);
  const fallbackSeo = defaultCmsSeoByEntity[entityKey];
  const normalizedSeo = normalizeSeo(seo, fallbackSeo);

  const { data: existing } = await client
    .from("cms_entity_content")
    .select("version")
    .eq("entity_id", entity.id)
    .eq("workspace", "draft")
    .maybeSingle();

  const nextVersion =
    (existing && typeof existing.version === "number" ? existing.version : 0) + 1;

  const { data, error } = await client
    .from("cms_entity_content")
    .upsert(
      {
        entity_id: entity.id,
        workspace: "draft",
        payload: normalizedPayload,
        seo: normalizedSeo,
        version: nextVersion,
        updated_by: userId,
      },
      {
        onConflict: "entity_id,workspace",
      }
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to save draft.");
  }

  await syncAssetUsages(entity.id, "draft", normalizedPayload);
  await writeAuditEvent({
    actorUserId: userId,
    action: "draft_saved",
    entityId: entity.id,
    workspace: "draft",
    details: {
      entityKey,
      version: nextVersion,
    },
  });

  return {
    ...mapContentRow<CmsEntityPayloadMap[TKey]>(data as EntityContentRow, entity),
    payload: normalizedPayload,
  };
}

function normalizeSnapshotPayload(
  value: unknown,
  entityKey: CmsEntityKey
): { payload: CmsEntityPayload; seo: CmsSeoConfig } {
  const fallbackSeo = defaultCmsSeoByEntity[entityKey];

  if (isObject(value) && "payload" in value) {
    const wrapper = value as { payload?: unknown; seo?: unknown };
    return {
      payload: normalizePayloadForKey(entityKey, wrapper.payload),
      seo: normalizeSeo(wrapper.seo, fallbackSeo),
    };
  }

  return {
    payload: normalizePayloadForKey(entityKey, value),
    seo: fallbackSeo,
  };
}

export async function rebuildRuntimeSnapshot(updatedBy: string | null): Promise<void> {
  const client = createServiceRoleClient();
  const entities = await listEntities();

  const snapshot: Record<
    string,
    {
      payload: unknown;
      seo: CmsSeoConfig;
      version: number;
      updatedAt: string;
    }
  > = {};

  entities.forEach((entry) => {
    if (!entry.published) return;
    snapshot[entry.entity.entityKey] = {
      payload: entry.published.payload,
      seo: entry.published.seo,
      version: entry.published.version,
      updatedAt: entry.published.updatedAt,
    };
  });

  const { data: current } = await client
    .from("cms_runtime_snapshot")
    .select("version")
    .eq("id", 1)
    .maybeSingle();

  const nextVersion =
    (current && typeof current.version === "number" ? current.version : 0) + 1;

  await client.from("cms_runtime_snapshot").upsert(
    {
      id: 1,
      snapshot,
      version: nextVersion,
      updated_by: updatedBy,
    },
    {
      onConflict: "id",
    }
  );
}

export async function publishEntity(
  entityKey: CmsEntityKey,
  userId: string | null,
  summary?: string
): Promise<CmsPublishResult> {
  const entity = await ensureEntityRecord(entityKey);
  const client = createServiceRoleClient();

  const draft = await getEntityWorkspaceContent(entityKey, "draft");
  if (!draft) {
    throw new Error(`No draft exists for ${entityKey}.`);
  }

  const { data: publishedCurrent } = await client
    .from("cms_entity_content")
    .select("version")
    .eq("entity_id", entity.id)
    .eq("workspace", "published")
    .maybeSingle();

  const nextPublishedVersion =
    (publishedCurrent && typeof publishedCurrent.version === "number"
      ? publishedCurrent.version
      : 0) + 1;

  const { data: publishedRow, error: publishError } = await client
    .from("cms_entity_content")
    .upsert(
      {
        entity_id: entity.id,
        workspace: "published",
        payload: draft.payload,
        seo: draft.seo,
        version: nextPublishedVersion,
        updated_by: userId,
      },
      { onConflict: "entity_id,workspace" }
    )
    .select("*")
    .single();

  if (publishError || !publishedRow) {
    throw new Error(publishError?.message || "Failed to publish entity.");
  }

  const snapshotPayload = {
    payload: draft.payload,
    seo: draft.seo,
  };

  const { data: snapshotRow, error: snapshotError } = await client
    .from("cms_publish_snapshots")
    .insert({
      entity_id: entity.id,
      published_version: nextPublishedVersion,
      draft_payload: snapshotPayload,
      published_payload: snapshotPayload,
      summary: summary || null,
      published_by: userId,
    })
    .select("id")
    .single();

  if (snapshotError || !snapshotRow) {
    throw new Error(snapshotError?.message || "Failed to create publish snapshot.");
  }

  await syncAssetUsages(entity.id, "published", draft.payload);
  await writeAuditEvent({
    actorUserId: userId,
    action: "entity_published",
    entityId: entity.id,
    workspace: "published",
    details: {
      entityKey,
      version: nextPublishedVersion,
      summary: summary || null,
      snapshotId: snapshotRow.id,
    },
  });

  await rebuildRuntimeSnapshot(userId);
  revalidatePublishedEntity(entityKey);

  return {
    ok: true,
    entityKey,
    version: nextPublishedVersion,
    snapshotId: snapshotRow.id as string,
  };
}

export async function rollbackEntity(
  entityKey: CmsEntityKey,
  snapshotId: string,
  userId: string | null
): Promise<CmsPublishResult> {
  const entity = await ensureEntityRecord(entityKey);
  const client = createServiceRoleClient();

  const { data: snapshotRow, error: snapshotError } = await client
    .from("cms_publish_snapshots")
    .select("*")
    .eq("id", snapshotId)
    .eq("entity_id", entity.id)
    .maybeSingle();

  if (snapshotError) {
    throw new Error(snapshotError.message);
  }

  if (!snapshotRow) {
    throw new Error("Snapshot not found for this entity.");
  }

  const parsed = normalizeSnapshotPayload(snapshotRow.published_payload, entityKey);
  const { data: publishedCurrent } = await client
    .from("cms_entity_content")
    .select("version")
    .eq("entity_id", entity.id)
    .eq("workspace", "published")
    .maybeSingle();

  const nextPublishedVersion =
    (publishedCurrent && typeof publishedCurrent.version === "number"
      ? publishedCurrent.version
      : 0) + 1;

  const { data: publishedRow, error: rollbackError } = await client
    .from("cms_entity_content")
    .upsert(
      {
        entity_id: entity.id,
        workspace: "published",
        payload: parsed.payload,
        seo: parsed.seo,
        version: nextPublishedVersion,
        updated_by: userId,
      },
      { onConflict: "entity_id,workspace" }
    )
    .select("version")
    .single();

  if (rollbackError || !publishedRow) {
    throw new Error(rollbackError?.message || "Failed to rollback entity.");
  }

  const newSnapshotPayload = {
    payload: parsed.payload,
    seo: parsed.seo,
  };

  const { data: rollbackSnapshot, error: rollbackSnapshotError } = await client
    .from("cms_publish_snapshots")
    .insert({
      entity_id: entity.id,
      published_version: nextPublishedVersion,
      draft_payload: newSnapshotPayload,
      published_payload: newSnapshotPayload,
      summary: `Rollback from snapshot ${snapshotId}`,
      published_by: userId,
    })
    .select("id")
    .single();

  if (rollbackSnapshotError || !rollbackSnapshot) {
    throw new Error(
      rollbackSnapshotError?.message || "Failed to create rollback snapshot."
    );
  }

  await syncAssetUsages(entity.id, "published", parsed.payload);
  await writeAuditEvent({
    actorUserId: userId,
    action: "entity_rolled_back",
    entityId: entity.id,
    workspace: "published",
    details: {
      entityKey,
      snapshotId,
      rollbackSnapshotId: rollbackSnapshot.id,
      version: nextPublishedVersion,
    },
  });

  await rebuildRuntimeSnapshot(userId);
  revalidatePublishedEntity(entityKey);

  return {
    ok: true,
    entityKey,
    version: nextPublishedVersion,
    snapshotId: rollbackSnapshot.id as string,
  };
}

export async function listEntityHistory(
  entityKey: CmsEntityKey,
  limit = 40
): Promise<CmsSnapshot[]> {
  const entity = await ensureEntityRecord(entityKey);
  const client = createServiceRoleClient();

  const { data, error } = await client
    .from("cms_publish_snapshots")
    .select("*")
    .eq("entity_id", entity.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id as string,
    entityId: row.entity_id as string,
    entityKey,
    publishedVersion: row.published_version as number,
    draftPayload: row.draft_payload,
    publishedPayload: row.published_payload,
    summary: (row.summary as string | null) || null,
    publishedBy: (row.published_by as string | null) || null,
    publishedAt: row.published_at as string,
  }));
}

export async function getRuntimeSnapshot(): Promise<{
  version: number;
  snapshot: Record<
    string,
    {
      payload: unknown;
      seo: CmsSeoConfig;
      version: number;
      updatedAt: string;
    }
  >;
} | null> {
  const client = createServiceRoleClient();
  const { data, error } = await client
    .from("cms_runtime_snapshot")
    .select("version,snapshot")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return {
    version: typeof data.version === "number" ? data.version : 0,
    snapshot:
      isObject(data.snapshot) && !Array.isArray(data.snapshot)
        ? (data.snapshot as Record<
            string,
            {
              payload: unknown;
              seo: CmsSeoConfig;
              version: number;
              updatedAt: string;
            }
          >)
        : {},
  };
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const entities = await listEntities();
  const client = createServiceRoleClient();

  const staleDrafts = entities
    .filter((entry) => entry.outOfSync && entry.draft)
    .map((entry) => ({
      entityKey: entry.entity.entityKey,
      title: entry.entity.title,
      draftUpdatedAt: entry.draft!.updatedAt,
      publishedUpdatedAt: entry.published?.updatedAt || null,
    }))
    .sort((a, b) => b.draftUpdatedAt.localeCompare(a.draftUpdatedAt))
    .slice(0, 10);

  const { data: assets } = await client
    .from("cms_assets")
    .select("id,path,alt")
    .order("updated_at", { ascending: false })
    .limit(100);

  const mediaAlerts = (assets || [])
    .filter((asset) => {
      const altValue = typeof asset.alt === "string" ? asset.alt.trim() : "";
      return altValue.length === 0;
    })
    .slice(0, 12)
    .map((asset) => ({
      assetId: asset.id as string,
      path: asset.path as string,
      reason: "Missing alt text",
    }));

  const { data: auditRows } = await client
    .from("cms_audit_events")
    .select("id,action,entity_id,actor_user_id,created_at,details")
    .order("created_at", { ascending: false })
    .limit(20);

  const entityKeyById = new Map<string, CmsEntityKey>();
  entities.forEach((entry) => {
    entityKeyById.set(entry.entity.id, entry.entity.entityKey);
  });

  const recentAuditEvents = (auditRows || []).map((row) => ({
    id: row.id as string,
    action: row.action as string,
    entityKey: entityKeyById.get((row.entity_id as string) || "") || null,
    actorUserId: (row.actor_user_id as string | null) || null,
    createdAt: row.created_at as string,
    details: isObject(row.details)
      ? (row.details as Record<string, unknown>)
      : {},
  }));

  return {
    entitiesTotal: entities.length,
    entitiesWithDrafts: entities.filter((entry) => Boolean(entry.draft)).length,
    entitiesOutOfSync: entities.filter((entry) => entry.outOfSync).length,
    staleDrafts,
    mediaAlerts,
    recentAuditEvents,
  };
}

export async function ensureDefaultEntitySeed(
  entityKey: CmsEntityKey,
  actorUserId: string | null = null
): Promise<void> {
  const entity = await ensureEntityRecord(entityKey);
  const client = createServiceRoleClient();

  const payload = defaultCmsPayloadMap[entityKey];
  const seo = defaultCmsSeoByEntity[entityKey];

  for (const workspace of ["draft", "published"] as CmsWorkspace[]) {
    const { data: existing } = await client
      .from("cms_entity_content")
      .select("entity_id")
      .eq("entity_id", entity.id)
      .eq("workspace", workspace)
      .maybeSingle();

    if (existing) continue;

    await client.from("cms_entity_content").insert({
      entity_id: entity.id,
      workspace,
      payload,
      seo,
      version: 1,
      updated_by: actorUserId,
    });
  }

  await syncAssetUsages(entity.id, "draft", payload);
  await syncAssetUsages(entity.id, "published", payload);
}

export async function seedAllDefaultEntities(actorUserId: string | null = null) {
  for (const definition of defaultCmsEntityDefinitions) {
    await ensureDefaultEntitySeed(definition.key, actorUserId);
  }
  await rebuildRuntimeSnapshot(actorUserId);
}
