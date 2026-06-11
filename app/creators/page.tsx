import DoorPage from "@/components/marketing/DoorPage";
import { creatorsPage } from "@/lib/content/creators";
import { buildPageMetadata } from "@/lib/services/cms/seo";
import { getSiteSettings } from "@/lib/services/cms/siteSettings";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/creators",
    fallbackTitle: "For Creators | Lucky Studios",
    fallbackDescription:
      "Your moment is perishable. Lucky Studios builds the show around your voice — format, production, packaging and growth — so a viral run becomes appointment viewing.",
    fallbackKeywords: [
      "podcast network",
      "creator show production",
      "podcast creator",
      "podcast production london",
      "creator format development",
    ],
  });
}

export default async function CreatorsPage() {
  const siteSettings = await getSiteSettings();
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);
  return <DoorPage content={creatorsPage} consultationHref={consultationHref} />;
}
