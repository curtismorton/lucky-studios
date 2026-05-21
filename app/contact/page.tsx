import ContactPageClient from "./ContactPageClient";
import { getMarketingPagesContent } from "@/lib/services/marketingCms";
import { buildPageMetadata } from "@/lib/services/cms/seo";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/contact",
    fallbackTitle: "Contact Us | Lucky Studios",
    fallbackDescription:
      "Get in touch with Lucky Studios. Contact us about joining as a creator, brand partnerships, studio rental, or general inquiries.",
    fallbackKeywords: [
      "contact Lucky Studios",
      "podcast network contact",
      "studio rental inquiry",
      "creator application",
      "brand partnership inquiry",
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
