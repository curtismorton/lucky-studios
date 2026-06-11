import type { DoorPageContent } from "@/components/marketing/DoorPage";
import { aboutPage } from "@/lib/content/about";
import { brandsPage } from "@/lib/content/brands";
import { contactContent } from "@/lib/content/contact";
import { creatorsPage } from "@/lib/content/creators";
import { studioPage } from "@/lib/content/studio";
import { workPage } from "@/lib/content/work";

/**
 * Canonical marketing-pages payload — the shape the CMS stores and the
 * inner pages render. One key per route.
 */
export const marketingPages = {
  creators: creatorsPage as DoorPageContent,
  brands: brandsPage as DoorPageContent,
  studio: studioPage,
  about: aboutPage,
  work: workPage,
  contact: contactContent,
};

export type MarketingPages = typeof marketingPages;
