import "server-only";

import type { Metadata } from "next";
import type { CmsSeoConfig } from "@/lib/cms/types";
import { getSeoForPath, getSiteSettings, absoluteUrl } from "@/lib/services/cms/siteSettings";

function compact<T>(values: Array<T | undefined | null | false>): T[] {
  return values.filter(Boolean) as T[];
}

/**
 * The root layout applies the "%s | Lucky Studios" template, so titles that
 * already carry the suffix (legacy CMS rows, older fallbacks) would render
 * "… | Lucky Studios | Lucky Studios". Strip one trailing suffix here.
 */
function stripTitleSuffix(title: string): string {
  return title.replace(/\s*\|\s*Lucky Studios\s*$/i, "").trim();
}

export async function buildPageMetadata(input: {
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackKeywords?: string[];
}): Promise<Metadata> {
  const site = await getSiteSettings();
  const seo = await getSeoForPath(input.path, {
    title: input.fallbackTitle,
    description: input.fallbackDescription,
    canonicalPath: input.path,
    ogImage: site.ogImage,
    keywords: input.fallbackKeywords || [],
  });

  const canonicalPath = seo.canonicalPath || input.path;
  const canonicalUrl = await absoluteUrl(canonicalPath);
  const ogImage = seo.ogImage || site.ogImage;

  const title = stripTitleSuffix(seo.title || input.fallbackTitle);

  return {
    title,
    description: seo.description || input.fallbackDescription,
    keywords:
      seo.keywords && seo.keywords.length > 0
        ? seo.keywords
        : input.fallbackKeywords || [],
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: seo.description || input.fallbackDescription,
      type: "website",
      url: canonicalUrl,
      images: compact([
        ogImage
          ? {
              url: await absoluteUrl(ogImage),
              width: 1200,
              height: 630,
              alt: seo.title || site.name,
            }
          : undefined,
      ]),
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function mergeSeoFallback(
  primary: CmsSeoConfig | undefined,
  fallback: CmsSeoConfig
): CmsSeoConfig {
  return {
    ...fallback,
    ...(primary || {}),
  };
}
