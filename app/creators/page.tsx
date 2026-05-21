import CreatorsPageClient from "./CreatorsPageClient";
import { getMarketingPagesContent } from "@/lib/services/marketingCms";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/creators",
    fallbackTitle: "For Creators | Lucky Studios",
    fallbackDescription:
      "Join Lucky Studios podcast network. Grow your audience with production support, cross-promotion to 1.1M+ viewers, and revenue sharing.",
    fallbackKeywords: [
      "podcast network",
      "join podcast network",
      "podcast creator",
      "podcast production",
      "podcast partnership",
    ],
  });
}

export default async function CreatorsPage() {
  const content = await getMarketingPagesContent();
  return <CreatorsPageClient content={content.creators} />;
}
