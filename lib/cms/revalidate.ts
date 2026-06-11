import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import type { CmsEntityKey } from "@/lib/cms/types";

const HOMEPAGE_CACHE_TAG = "cms:homepage";
const MARKETING_CACHE_TAG = "cms:marketing-pages";

const MARKETING_PAGE_PATHS = [
  "/about",
  "/brands",
  "/contact",
  "/creators",
  "/studio",
] as const;

const PUBLIC_SITE_PATHS = ["/", ...MARKETING_PAGE_PATHS, "/shows"] as const;

function revalidateMarketingPages() {
  MARKETING_PAGE_PATHS.forEach((path) => {
    revalidatePath(path);
  });
  revalidateTag(MARKETING_CACHE_TAG, "max");
}

function revalidatePublicSiteShell() {
  PUBLIC_SITE_PATHS.forEach((path) => {
    revalidatePath(path);
  });
  revalidatePath("/shows/[slug]", "page");
}

export function revalidatePublishedEntity(entityKey: CmsEntityKey) {
  switch (entityKey) {
    case "homepage":
      revalidatePath("/");
      revalidateTag(HOMEPAGE_CACHE_TAG, "max");
      break;
    case "marketing-pages":
      revalidateMarketingPages();
      break;
    case "shows":
      revalidatePath("/shows");
      revalidatePath("/shows/[slug]", "page");
      break;
    case "site-settings":
    case "nav-footer":
    case "seo-defaults":
      revalidatePublicSiteShell();
      break;
    default: {
      const exhaustiveCheck: never = entityKey;
      return exhaustiveCheck;
    }
  }
}
