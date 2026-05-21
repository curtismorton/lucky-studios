import ContactPageClient from "./ContactPageClient";
import { getMarketingPagesContent } from "@/lib/services/marketingCms";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/contact",
    fallbackTitle: "Contact Lucky Studios | Build a Show or Book the Studio",
    fallbackDescription:
      "Contact Lucky Studios about creator shows, brand partnerships, sponsorships, studio sessions, campaign assets, and production support.",
    fallbackKeywords: [
      "contact Lucky Studios",
      "creator show inquiry",
      "studio rental inquiry",
      "brand partnership inquiry",
      "campaign asset production",
    ],
  });
}

export default async function ContactPage() {
  const content = await getMarketingPagesContent();
  const formEndpoint = process.env.CONTACT_FORM_ENDPOINT || "";

  return (
    <ContactPageClient
      content={content.contact}
      formEndpoint={formEndpoint}
    />
  );
}
