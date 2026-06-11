import DoorPage from "@/components/marketing/DoorPage";
import { getCmsRuntimePayload } from "@/lib/cms/runtime";
import { buildPageMetadata } from "@/lib/services/cms/seo";
import { getSiteSettings } from "@/lib/services/cms/siteSettings";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/brands",
    fallbackTitle: "For Brands | Lucky Studios",
    fallbackDescription:
      "Stop renting attention. Lucky Studios builds branded entertainment people choose to watch — original shows, sponsorships and format extensions with real audiences.",
    fallbackKeywords: [
      "branded podcast",
      "podcast sponsorship",
      "branded entertainment",
      "podcast advertising",
      "branded content production",
    ],
  });
}

export default async function BrandsPage() {
  const [pages, siteSettings] = await Promise.all([
    getCmsRuntimePayload("marketing-pages"),
    getSiteSettings(),
  ]);
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);
  return <DoorPage content={pages.brands} consultationHref={consultationHref} />;
}
