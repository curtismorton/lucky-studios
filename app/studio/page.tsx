import StudioPageClient from "./StudioPageClient";
import { LocalBusinessSchema } from "@/components/seo/StructuredData";
import { getMarketingPagesContent } from "@/lib/services/marketingCms";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/studio",
    fallbackTitle: "The Studio | Lucky Studios",
    fallbackDescription:
      "Rent our professional podcast studio in London Bridge. Equipped with Sony A7 IV cameras, Shure SM7B mics, and full production support.",
    fallbackKeywords: [
      "podcast studio London",
      "studio rental London",
      "London Bridge studio",
      "podcast production studio",
      "video podcast studio",
      "Lucky Studios studio",
    ],
  });
}

export default async function StudioPage() {
  const content = await getMarketingPagesContent();

  return (
    <>
      <StudioPageClient content={content.studio} />
      <LocalBusinessSchema />
    </>
  );
}
