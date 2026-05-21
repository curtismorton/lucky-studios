import "server-only";

import { createServiceRoleClient } from "@/lib/cms/supabase";
import {
  getEntityPair,
  publishEntity,
  saveEntityDraft,
  rebuildRuntimeSnapshot,
} from "@/lib/cms/entities";
import {
  defaultCmsEntityDefinitions,
  defaultCmsPayloadMap,
  defaultCmsSeoByEntity,
} from "@/lib/cms/defaults";
import type {
  CmsEntityKey,
  CmsEntityPayload,
  CmsSeoConfig,
} from "@/lib/cms/types";
import { normalizeHomepageContent } from "@/lib/data/homepageContent";
import { normalizeMarketingPagesContent } from "@/lib/data/marketingContent";
import { getSupabaseServiceConfig } from "@/lib/cms/supabase";

export type CmsExportBundle = {
  generatedAt: string;
  generatedBy: string;
  entities: Record<
    CmsEntityKey,
    {
      draft: {
        payload: CmsEntityPayload;
        seo: CmsSeoConfig;
        version: number;
      } | null;
      published: {
        payload: CmsEntityPayload;
        seo: CmsSeoConfig;
        version: number;
      } | null;
    }
  >;
};

function stableStringify(value: unknown): string {
  return JSON.stringify(value);
}

async function readLegacyContentRow(key: string): Promise<unknown | null> {
  const config = getSupabaseServiceConfig();
  if (!config) return null;

  const table = process.env.CMS_CONTENT_TABLE || "site_content";
  const endpoint = `${config.url}/rest/v1/${table}?key=eq.${encodeURIComponent(
    key
  )}&select=value&limit=1`;

  const response = await fetch(endpoint, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  const data = await response.json();
  const row = Array.isArray(data) ? data[0] : null;
  return row?.value ?? null;
}

export async function buildLegacyMergeBundle(
  actorUserId: string
): Promise<CmsExportBundle> {
  const [legacyHomepage, legacyMarketing] = await Promise.all([
    readLegacyContentRow("homepage"),
    readLegacyContentRow("marketing-pages"),
  ]);

  const bundle = await buildCmsExportBundle(actorUserId);
  const merged = {
    ...bundle.entities,
  };

  const homepagePayload = normalizeHomepageContent(
    legacyHomepage || defaultCmsPayloadMap.homepage
  );
  const marketingPayload = normalizeMarketingPagesContent(
    legacyMarketing || defaultCmsPayloadMap["marketing-pages"]
  );

  merged.homepage = {
    draft: {
      payload: homepagePayload,
      seo: bundle.entities.homepage.draft?.seo || bundle.entities.homepage.published?.seo || {},
      version: 1,
    },
    published: {
      payload: homepagePayload,
      seo:
        bundle.entities.homepage.published?.seo ||
        bundle.entities.homepage.draft?.seo ||
        {},
      version: 1,
    },
  };

  merged["marketing-pages"] = {
    draft: {
      payload: marketingPayload,
      seo:
        bundle.entities["marketing-pages"].draft?.seo ||
        bundle.entities["marketing-pages"].published?.seo ||
        {},
      version: 1,
    },
    published: {
      payload: marketingPayload,
      seo:
        bundle.entities["marketing-pages"].published?.seo ||
        bundle.entities["marketing-pages"].draft?.seo ||
        {},
      version: 1,
    },
  };

  for (const definition of defaultCmsEntityDefinitions) {
    const current = merged[definition.key];
    if (current?.published && current?.draft) continue;

    const fallbackPayload = defaultCmsPayloadMap[definition.key];
    const fallbackSeo = defaultCmsSeoByEntity[definition.key];
    merged[definition.key] = {
      draft:
        current?.draft ||
        ({
          payload: fallbackPayload,
          seo: fallbackSeo,
          version: 1,
        } as CmsExportBundle["entities"][CmsEntityKey]["draft"]),
      published:
        current?.published ||
        ({
          payload: fallbackPayload,
          seo: fallbackSeo,
          version: 1,
        } as CmsExportBundle["entities"][CmsEntityKey]["published"]),
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    generatedBy: actorUserId,
    entities: merged,
  };
}

export async function buildCmsExportBundle(
  actorUserId: string
): Promise<CmsExportBundle> {
  const entities = {} as CmsExportBundle["entities"];

  for (const definition of defaultCmsEntityDefinitions) {
    const pair = await getEntityPair(definition.key);
    entities[definition.key] = {
      draft: pair.draft
        ? {
            payload: pair.draft.payload as CmsEntityPayload,
            seo: pair.draft.seo,
            version: pair.draft.version,
          }
        : null,
      published: pair.published
        ? {
            payload: pair.published.payload as CmsEntityPayload,
            seo: pair.published.seo,
            version: pair.published.version,
          }
        : null,
    };
  }

  const bundle: CmsExportBundle = {
    generatedAt: new Date().toISOString(),
    generatedBy: actorUserId,
    entities,
  };

  const client = createServiceRoleClient();
  await client.from("cms_export_jobs").insert({
    created_by: actorUserId,
    storage_path: "inline://response",
    status: "completed",
  });

  return bundle;
}

export async function importCmsBundle(
  bundle: CmsExportBundle,
  actorUserId: string,
  dryRun = true
): Promise<{
  dryRun: boolean;
  touched: number;
  changed: number;
  details: Array<{
    entityKey: CmsEntityKey;
    changed: boolean;
    reason: string;
  }>;
}> {
  const details: Array<{
    entityKey: CmsEntityKey;
    changed: boolean;
    reason: string;
  }> = [];

  let touched = 0;
  let changed = 0;

  for (const definition of defaultCmsEntityDefinitions) {
    const incoming = bundle.entities[definition.key];
    if (!incoming) {
      details.push({
        entityKey: definition.key,
        changed: false,
        reason: "Not present in import bundle.",
      });
      continue;
    }

    touched += 1;
    const existing = await getEntityPair(definition.key);
    const incomingPublished = incoming.published || incoming.draft;

    if (!incomingPublished) {
      details.push({
        entityKey: definition.key,
        changed: false,
        reason: "No payload provided for draft or published workspace.",
      });
      continue;
    }

    const existingPublishedPayload = existing.published?.payload;
    const incomingPayload = incomingPublished.payload;

    const hasChanged =
      stableStringify(existingPublishedPayload || {}) !==
      stableStringify(incomingPayload || {});

    if (hasChanged) {
      changed += 1;
    }

    details.push({
      entityKey: definition.key,
      changed: hasChanged,
      reason: hasChanged
        ? "Published payload differs from existing content."
        : "Published payload matches existing content.",
    });

    if (!dryRun && hasChanged) {
      await saveEntityDraft(
        definition.key,
        incomingPublished.payload,
        incomingPublished.seo,
        actorUserId
      );
      await publishEntity(definition.key, actorUserId, "Imported from bundle");
    }
  }

  const client = createServiceRoleClient();
  const status = dryRun ? "dry_run" : "completed";
  await client.from("cms_import_jobs").insert({
    created_by: actorUserId,
    status,
    summary: {
      touched,
      changed,
      dryRun,
    },
    completed_at: new Date().toISOString(),
  });

  if (!dryRun) {
    await rebuildRuntimeSnapshot(actorUserId);
  }

  return {
    dryRun,
    touched,
    changed,
    details,
  };
}
