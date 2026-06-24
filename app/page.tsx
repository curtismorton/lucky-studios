import HeroSerif from "@/components/marketing/home/HeroSerif";
import PathwaySplit from "@/components/marketing/home/PathwaySplit";
import { getCmsRuntimePayload } from "@/lib/cms/runtime";
import { buildPageMetadata } from "@/lib/services/cms/seo";
import { getSiteSettings } from "@/lib/services/cms/siteSettings";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

export const revalidate = 86400;

export async function generateMetadata() {
  const title = "Lucky Studios | Hit Shows Aren't Luck — Podcast Studio & Network, London";
  const description =
    "Lucky Studios builds creator-led shows for talent, brands and broadcasters. Format, studio production, packaging, distribution and growth — one pipeline that makes what looks like luck repeatable.";
  const metadata = await buildPageMetadata({
    path: "/",
    fallbackTitle: title,
    fallbackDescription: description,
    fallbackKeywords: [
      "podcast production london",
      "creator led podcast studio",
      "branded podcast production",
      "podcast network",
      "podcast growth",
    ],
  });

  return {
    ...metadata,
    title,
    description,
    openGraph: {
      ...metadata.openGraph,
      title,
      description,
    },
  };
}

export default async function Home() {
  const [home, siteSettings] = await Promise.all([
    getCmsRuntimePayload("homepage"),
    getSiteSettings(),
  ]);
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);

  return (
    <main className="font-barlow">
      <HeroSerif consultationHref={consultationHref} content={home.coldOpen} />
      <PathwaySplit />
    </main>
  );
}
