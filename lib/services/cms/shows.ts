import "server-only";

import { shows as fallbackShows, type Show } from "@/lib/data/shows";
import { getCmsRuntimePayload } from "@/lib/cms/runtime";

export async function getShows(): Promise<Show[]> {
  const payload = await getCmsRuntimePayload("shows", { allowPreview: true });
  if (!payload.items || payload.items.length === 0) {
    return fallbackShows;
  }
  return payload.items;
}

export async function getShowBySlug(slug: string): Promise<Show | undefined> {
  const allShows = await getShows();
  return allShows.find((show) => show.slug === slug);
}

export async function getShowSlugs(): Promise<string[]> {
  const allShows = await getShows();
  return allShows.map((show) => show.slug);
}
