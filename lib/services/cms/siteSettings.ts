import "server-only";

import { site as fallbackSite } from "@/lib/data/site";
import { defaultNavFooterPayload } from "@/lib/cms/defaults";
import { getCmsRuntimeEntity, getCmsRuntimePayload } from "@/lib/cms/runtime";
import type {
  CmsNavFooterPayload,
  CmsSeoConfig,
  CmsSeoDefaultsPayload,
  CmsSiteSettingsPayload,
} from "@/lib/cms/types";

export async function getSiteSettings(): Promise<CmsSiteSettingsPayload> {
  const runtime = await getCmsRuntimePayload("site-settings", {
    allowPreview: true,
  });
  return runtime;
}

export async function getNavFooterSettings(): Promise<CmsNavFooterPayload> {
  const runtime = await getCmsRuntimePayload("nav-footer", {
    allowPreview: true,
  });
  return runtime;
}

export async function getSeoDefaults(): Promise<CmsSeoDefaultsPayload> {
  const runtime = await getCmsRuntimePayload("seo-defaults", {
    allowPreview: true,
  });
  return runtime;
}

export async function getSeoForPath(
  path: string,
  fallback: CmsSeoConfig
): Promise<CmsSeoConfig> {
  const seoDefaults = await getSeoDefaults();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pageSeo = seoDefaults.pages?.[normalizedPath];
  return {
    ...fallback,
    ...seoDefaults.global,
    ...(pageSeo || {}),
  };
}

export async function absoluteUrl(path: string): Promise<string> {
  if (/^https?:\/\//i.test(path)) return path;
  const settings = await getSiteSettings();
  const base = settings.url || fallbackSite.url;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/+$/, "")}${normalizedPath}`;
}

export async function getSiteUrl(): Promise<string> {
  const settings = await getSiteSettings();
  return settings.url || fallbackSite.url;
}

export function getFallbackNavFooterSettings(): CmsNavFooterPayload {
  return defaultNavFooterPayload;
}

export async function getSeoForEntity(entityKey: "homepage" | "shows") {
  return getCmsRuntimeEntity(entityKey, { allowPreview: true });
}
