import "server-only";

import { isCmsV2ReadEnabled } from "@/lib/cms/flags";
import { isCmsPreviewActive } from "@/lib/cms/preview";
import {
  getEntityWorkspaceContent,
  getRuntimeSnapshot,
  ensureDefaultEntitySeed,
} from "@/lib/cms/entities";
import { defaultCmsPayloadMap, defaultCmsSeoByEntity } from "@/lib/cms/defaults";
import type {
  CmsEntityKey,
  CmsEntityPayloadMap,
  CmsSeoConfig,
  CmsWorkspace,
} from "@/lib/cms/types";

export interface CmsRuntimeValue<TPayload> {
  payload: TPayload;
  seo: CmsSeoConfig;
  workspace: CmsWorkspace;
  source: "cms" | "snapshot" | "fallback";
}

function normalizeSnapshotEntry<TKey extends CmsEntityKey>(
  entityKey: TKey,
  value: unknown
): CmsRuntimeValue<CmsEntityPayloadMap[TKey]> | null {
  if (!value || typeof value !== "object") return null;
  const entry = value as {
    payload?: unknown;
    seo?: unknown;
    version?: unknown;
    updatedAt?: unknown;
  };

  const payload = entry.payload as CmsEntityPayloadMap[TKey];
  const fallbackPayload = defaultCmsPayloadMap[entityKey];
  const fallbackSeo = defaultCmsSeoByEntity[entityKey];

  return {
    payload: payload || fallbackPayload,
    seo:
      entry.seo && typeof entry.seo === "object"
        ? (entry.seo as CmsSeoConfig)
        : fallbackSeo,
    workspace: "published",
    source: "snapshot",
  };
}

export async function getCmsRuntimeEntity<TKey extends CmsEntityKey>(
  entityKey: TKey,
  options?: {
    allowPreview?: boolean;
  }
): Promise<CmsRuntimeValue<CmsEntityPayloadMap[TKey]>> {
  const fallbackPayload = defaultCmsPayloadMap[entityKey];
  const fallbackSeo = defaultCmsSeoByEntity[entityKey];

  if (!isCmsV2ReadEnabled()) {
    return {
      payload: fallbackPayload,
      seo: fallbackSeo,
      workspace: "published",
      source: "fallback",
    };
  }

  const allowPreview = options?.allowPreview !== false;
  const previewActive = allowPreview && (await isCmsPreviewActive());
  const preferredWorkspace: CmsWorkspace = previewActive ? "draft" : "published";

  try {
    await ensureDefaultEntitySeed(entityKey);

    const preferred = await getEntityWorkspaceContent(entityKey, preferredWorkspace);
    if (preferred) {
      return {
        payload: preferred.payload,
        seo: preferred.seo,
        workspace: preferredWorkspace,
        source: "cms",
      };
    }

    if (preferredWorkspace === "draft") {
      const published = await getEntityWorkspaceContent(entityKey, "published");
      if (published) {
        return {
          payload: published.payload,
          seo: published.seo,
          workspace: "published",
          source: "cms",
        };
      }
    }
  } catch (error) {
    console.error(`CMS runtime fetch failed for ${entityKey}:`, error);
  }

  try {
    const snapshot = await getRuntimeSnapshot();
    if (snapshot?.snapshot?.[entityKey]) {
      const normalized = normalizeSnapshotEntry(
        entityKey,
        snapshot.snapshot[entityKey]
      );
      if (normalized) {
        return normalized;
      }
    }
  } catch (error) {
    console.error(`CMS runtime snapshot fallback failed for ${entityKey}:`, error);
  }

  return {
    payload: fallbackPayload,
    seo: fallbackSeo,
    workspace: "published",
    source: "fallback",
  };
}

export async function getCmsRuntimePayload<TKey extends CmsEntityKey>(
  entityKey: TKey,
  options?: {
    allowPreview?: boolean;
  }
): Promise<CmsEntityPayloadMap[TKey]> {
  const runtimeValue = await getCmsRuntimeEntity(entityKey, options);
  return runtimeValue.payload;
}
