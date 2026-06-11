import type { HomeContent } from "@/lib/content/home";
import type { MarketingPages } from "@/lib/content/pages";
import type { Show } from "@/lib/data/shows";

export type CmsRole = "admin" | "editor" | "viewer";
export type CmsWorkspace = "draft" | "published";

export type CmsEntityType = "page" | "collection" | "settings" | "seo";
export type CmsEntityModule =
  | "content"
  | "shows"
  | "settings"
  | "seo"
  | "system";

export type CmsEntityKey =
  | "homepage"
  | "marketing-pages"
  | "shows"
  | "site-settings"
  | "nav-footer"
  | "seo-defaults";

export interface CmsSeoConfig {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noindex?: boolean;
  schemaType?: string;
  keywords?: string[];
}

export interface CmsSeoDefaultsPayload {
  pages: Record<string, CmsSeoConfig>;
  global: CmsSeoConfig;
}

export interface CmsSiteSettingsPayload {
  url: string;
  name: string;
  description: string;
  logo: string;
  ogImage: string;
  email: string;
  phone: string;
  address: {
    streetAddress: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  socials: {
    x: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  calendlyUrl: string;
}

export interface CmsNavFooterPayload {
  primaryLinks: Array<{ name: string; href: string }>;
  footerLinks: Array<{ name: string; href: string }>;
  bookingLabel: string;
  footerBadgePrefix: string;
  footerBadgeHighlight: string;
  copyrightText: string;
}

export type CmsShowsPayload = {
  items: Array<Show & { seo?: CmsSeoConfig }>;
};

export interface CmsEntityPayloadMap {
  homepage: HomeContent;
  "marketing-pages": MarketingPages;
  shows: CmsShowsPayload;
  "site-settings": CmsSiteSettingsPayload;
  "nav-footer": CmsNavFooterPayload;
  "seo-defaults": CmsSeoDefaultsPayload;
}

export type CmsEntityPayload = CmsEntityPayloadMap[CmsEntityKey];

export interface CmsEntityDefinition {
  key: CmsEntityKey;
  entityType: CmsEntityType;
  module: CmsEntityModule;
  title: string;
}

export interface CmsEntityContent<TPayload = unknown> {
  entityId: string;
  entityKey: CmsEntityKey;
  workspace: CmsWorkspace;
  payload: TPayload;
  seo: CmsSeoConfig;
  version: number;
  updatedBy: string | null;
  updatedAt: string;
}

export interface CmsEntityRecord {
  id: string;
  entityKey: CmsEntityKey;
  entityType: CmsEntityType;
  module: CmsEntityModule;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsSnapshot {
  id: string;
  entityId: string;
  entityKey: CmsEntityKey;
  publishedVersion: number;
  draftPayload: unknown;
  publishedPayload: unknown;
  summary: string | null;
  publishedBy: string | null;
  publishedAt: string;
}

export interface CmsAsset {
  id: string;
  path: string;
  url: string;
  folder: string;
  mimeType: string | null;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  durationMs: number | null;
  alt: string | null;
  caption: string | null;
  tags: string[];
  checksum: string | null;
  status: string;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPublishResult {
  ok: boolean;
  entityKey: CmsEntityKey;
  version: number;
  snapshotId: string;
}

export interface DashboardOverview {
  entitiesTotal: number;
  entitiesWithDrafts: number;
  entitiesOutOfSync: number;
  staleDrafts: Array<{
    entityKey: CmsEntityKey;
    title: string;
    draftUpdatedAt: string;
    publishedUpdatedAt: string | null;
  }>;
  mediaAlerts: Array<{
    assetId: string;
    path: string;
    reason: string;
  }>;
  recentAuditEvents: Array<{
    id: string;
    action: string;
    entityKey: CmsEntityKey | null;
    actorUserId: string | null;
    createdAt: string;
    details: Record<string, unknown>;
  }>;
}
