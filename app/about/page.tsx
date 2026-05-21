import AboutPageClient from "./AboutPageClient";
import { getMarketingPagesContent } from "@/lib/services/marketingCms";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/about",
    fallbackTitle: "About Us | Lucky Studios",
    fallbackDescription:
      "Learn about Lucky Studios - London's creator-first podcast network. Part of Socially Powerful, building the UK's most creator-friendly podcast network.",
    fallbackKeywords: [
      "Lucky Studios",
      "podcast network London",
      "creator-first podcast",
      "Socially Powerful",
      "podcast production company",
      "about Lucky Studios",
    ],
  });
}

export default async function AboutPage() {
  const content = await getMarketingPagesContent();
  return <AboutPageClient content={content.about} />;
}
