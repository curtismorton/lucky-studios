import ShowsPageClient from "./ShowsPageClient";
import { getShows } from "@/lib/services/cms/shows";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/shows",
    fallbackTitle: "Our Shows | Lucky Studios",
    fallbackDescription:
      "Browse all shows in the Lucky Studios network. From entertainment to football to lifestyle - discover hit podcasts reaching millions of viewers.",
    fallbackKeywords: [
      "podcast shows",
      "podcast network",
      "entertainment podcasts",
      "football podcasts",
      "lifestyle podcasts",
      "Lucky Studios shows",
    ],
  });
}

export default async function ShowsPage() {
  const shows = await getShows();
  return <ShowsPageClient shows={shows} />;
}
