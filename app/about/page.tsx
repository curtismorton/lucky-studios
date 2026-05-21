import AboutPageClient from "./AboutPageClient";
import { getMarketingPagesContent } from "@/lib/services/marketingCms";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/about",
    fallbackTitle: "About Lucky Studios | Creator Media Studio",
    fallbackDescription:
      "Lucky Studios is a London production studio and creator media network backed by Socially Powerful, building repeatable shows for creators and brands.",
    fallbackKeywords: [
      "Lucky Studios",
      "creator media studio",
      "podcast production London",
      "Socially Powerful",
      "creator show production",
      "about Lucky Studios",
    ],
  });
}

export default async function AboutPage() {
  const content = await getMarketingPagesContent();
  return <AboutPageClient content={content.about} />;
}
