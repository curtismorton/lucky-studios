import type { CmsEntityKey } from "@/lib/cms/types";

const ENTITY_KEYS: CmsEntityKey[] = [
  "homepage",
  "marketing-pages",
  "shows",
  "site-settings",
  "nav-footer",
  "seo-defaults",
];

export function isCmsEntityKey(value: string): value is CmsEntityKey {
  return ENTITY_KEYS.includes(value as CmsEntityKey);
}

export function getAllEntityKeys(): CmsEntityKey[] {
  return [...ENTITY_KEYS];
}
