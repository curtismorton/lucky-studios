import StudioPageClient from "./StudioPageClient";
import { LocalBusinessSchema } from "@/components/seo/StructuredData";
import { getMarketingPagesContent } from "@/lib/services/marketingCms";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/studio",
    fallbackTitle: "London Podcast and Video Studio | Lucky Studios",
    fallbackDescription:
      "Book a London Bridge production studio built for shows, clips, campaign assets, multi-camera recording, broadcast audio, and full production support.",
    fallbackKeywords: [
      "podcast studio London",
      "video studio London",
      "London Bridge studio",
      "podcast production studio",
      "campaign asset production",
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
