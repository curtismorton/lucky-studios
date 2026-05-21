import {
  defaultHomepageContent,
  type HomepageContent,
} from "@/lib/data/homepageContent";
import {
  defaultMarketingPagesContent,
  type MarketingPagesContent,
} from "@/lib/data/marketingContent";
import { shows, type Show } from "@/lib/data/shows";
import { site } from "@/lib/data/site";
import type {
  CmsEntityDefinition,
  CmsEntityKey,
  CmsEntityPayloadMap,
  CmsNavFooterPayload,
  CmsSeoConfig,
  CmsSeoDefaultsPayload,
  CmsSiteSettingsPayload,
  CmsShowsPayload,
} from "@/lib/cms/types";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const homepageSeo: CmsSeoConfig = {
  title: "Lucky Studios | London's Creator-First Podcast Network",
  description: site.description,
  canonicalPath: "/",
  ogImage: site.ogImage,
  keywords: [
    "podcast network",
    "podcast production",
    "podcast studio London",
    "creator network",
  ],
};

const marketingSeoPages: CmsSeoDefaultsPayload["pages"] = {
  "/about": {
    title: "About Us | Lucky Studios",
    description:
      "London's creator-first podcast network. Learn about our mission, team, and values.",
    canonicalPath: "/about",
    ogImage: site.ogImage,
  },
  "/brands": {
    title: "For Brands | Lucky Studios",
    description:
      "Reach engaged audiences through podcast partnerships. Sponsor shows or create branded content.",
    canonicalPath: "/brands",
    ogImage: site.ogImage,
  },
  "/creators": {
    title: "For Creators | Lucky Studios",
    description:
      "Join London's fastest-growing podcast network. Production support, cross-promotion, and revenue sharing.",
    canonicalPath: "/creators",
    ogImage: site.ogImage,
  },
  "/studio": {
    title: "The Studio | Lucky Studios",
    description:
      "Professional podcast studio in the heart of London. Book a tour or get a quote.",
    canonicalPath: "/studio",
    ogImage: site.ogImage,
  },
  "/contact": {
    title: "Contact Us | Lucky Studios",
    description:
      "Have a question? We'd love to hear from you. Contact Lucky Studios for creator applications, brand partnerships, or studio rental.",
    canonicalPath: "/contact",
    ogImage: site.ogImage,
  },
  "/shows": {
    title: "Our Shows | Lucky Studios",
    description:
      "Browse all shows in the Lucky Studios network. Hit podcasts reaching millions of viewers.",
    canonicalPath: "/shows",
    ogImage: site.ogImage,
  },
};

export const defaultCmsEntityDefinitions: CmsEntityDefinition[] = [
  {
    key: "homepage",
    entityType: "page",
    module: "content",
    title: "Homepage",
  },
  {
    key: "marketing-pages",
    entityType: "page",
    module: "content",
    title: "Marketing Pages",
  },
  {
    key: "shows",
    entityType: "collection",
    module: "shows",
    title: "Shows",
  },
  {
    key: "site-settings",
    entityType: "settings",
    module: "settings",
    title: "Global Site Settings",
  },
  {
    key: "nav-footer",
    entityType: "settings",
    module: "settings",
    title: "Navigation & Footer",
  },
  {
    key: "seo-defaults",
    entityType: "seo",
    module: "seo",
    title: "SEO Defaults",
  },
];

export const defaultNavFooterPayload: CmsNavFooterPayload = {
  primaryLinks: [
    { name: "Our Shows", href: "/shows" },
    { name: "For Creators", href: "/creators" },
    { name: "For Brands", href: "/brands" },
    { name: "The Studio", href: "/studio" },
    { name: "About", href: "/about" },
  ],
  footerLinks: [
    { name: "Our Shows", href: "/shows" },
    { name: "For Creators", href: "/creators" },
    { name: "For Brands", href: "/brands" },
    { name: "The Studio", href: "/studio" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  bookingLabel: "Book a Call",
  footerBadgePrefix: "Part of",
  footerBadgeHighlight: "Socially Powerful",
  copyrightText: "© 2026 Lucky Studios. All rights reserved.",
};

export const defaultSiteSettingsPayload: CmsSiteSettingsPayload = {
  url: site.url,
  name: site.name,
  description: site.description,
  logo: site.logo,
  ogImage: site.ogImage,
  email: site.email,
  phone: site.phone,
  address: { ...site.address },
  socials: { ...site.socials },
  calendlyUrl: site.calendlyUrl,
};

export const defaultShowsPayload: CmsShowsPayload = {
  items: clone(shows).map((show: Show) => ({
    ...show,
    seo: {
      title: `${show.title} | ${site.name}`,
      description:
        show.description ||
        `${show.title} - ${show.tagline}. Part of ${site.name} podcast network.`,
      canonicalPath: `/shows/${show.slug}`,
      ogImage: show.ogImage || site.ogImage,
    },
  })),
};

export const defaultSeoDefaultsPayload: CmsSeoDefaultsPayload = {
  global: homepageSeo,
  pages: marketingSeoPages,
};

export const defaultCmsPayloadMap: CmsEntityPayloadMap = {
  homepage: clone(defaultHomepageContent) as HomepageContent,
  "marketing-pages": clone(defaultMarketingPagesContent) as MarketingPagesContent,
  shows: clone(defaultShowsPayload),
  "site-settings": clone(defaultSiteSettingsPayload),
  "nav-footer": clone(defaultNavFooterPayload),
  "seo-defaults": clone(defaultSeoDefaultsPayload),
};

export const defaultCmsSeoByEntity: Record<CmsEntityKey, CmsSeoConfig> = {
  homepage: clone(homepageSeo),
  "marketing-pages": {
    title: "Marketing Pages",
    description:
      "All marketing pages including About, Brands, Creators, Studio, and Contact.",
    canonicalPath: "/",
    ogImage: site.ogImage,
  },
  shows: {
    title: "Shows | Lucky Studios",
    description:
      "Manage all show detail pages, platform links, and editorial metadata.",
    canonicalPath: "/shows",
    ogImage: site.ogImage,
  },
  "site-settings": {
    title: "Global Site Settings",
    description: "Manage global brand and contact metadata.",
    canonicalPath: "/",
    ogImage: site.ogImage,
  },
  "nav-footer": {
    title: "Navigation and Footer",
    description: "Manage navigation and footer links and labels.",
    canonicalPath: "/",
    ogImage: site.ogImage,
  },
  "seo-defaults": {
    title: "SEO Defaults",
    description: "Page-level SEO configuration.",
    canonicalPath: "/",
    ogImage: site.ogImage,
  },
};
