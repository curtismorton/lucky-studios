import ShowsPageClient from "./ShowsPageClient";
import { getShows } from "@/lib/services/cms/shows";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/shows",
    fallbackTitle: "Lucky Studios Shows | Creator-Led Formats",
    fallbackDescription:
      "Browse Lucky Studios shows: creator-led formats, football conversations, entertainment series, and sponsor-ready media built from one production system.",
    fallbackKeywords: [
      "Lucky Studios shows",
      "creator-led shows",
      "entertainment podcasts",
      "football podcast",
      "lifestyle podcast",
      "brand sponsorship shows",
    ],
  });
}

export default async function ShowsPage() {
  const shows = await getShows();
  return <ShowsPageClient shows={shows} />;
}
