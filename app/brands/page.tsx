import BrandsPageClient from "./BrandsPageClient";
import { getMarketingPagesContent } from "@/lib/services/marketingCms";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/brands",
    fallbackTitle: "For Brands | Lucky Studios",
    fallbackDescription:
      "Partner with Lucky Studios to reach engaged podcast audiences. Sponsor shows or create branded podcasts. 1.1M+ monthly listeners.",
    fallbackKeywords: [
      "podcast sponsorship",
      "branded podcast",
      "podcast advertising",
      "podcast marketing",
      "podcast partnership",
    ],
  });
}

export default async function BrandsPage() {
  const content = await getMarketingPagesContent();
  return <BrandsPageClient content={content.brands} />;
}
