import HeroSerif from "@/components/marketing/home/HeroSerif";
import Ticker from "@/components/marketing/home/Ticker";
import CountUpStats from "@/components/marketing/home/CountUpStats";
import Stations from "@/components/marketing/home/Stations";
import NetworkSerif from "@/components/marketing/home/NetworkSerif";
import FinalCtaSerif from "@/components/marketing/home/FinalCtaSerif";
import { getCmsRuntimePayload } from "@/lib/cms/runtime";
import { getShows } from "@/lib/services/cms/shows";
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
  const [home, shows, siteSettings] = await Promise.all([
    getCmsRuntimePayload("homepage"),
    getShows(),
    getSiteSettings(),
  ]);
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);

  return (
    <main className="font-barlow">
      <HeroSerif consultationHref={consultationHref} content={home.coldOpen} />
      <Ticker />
      <CountUpStats content={home.proofReel} />
      <Stations content={home.system} />
      <NetworkSerif shows={shows} content={home.network} />
      <FinalCtaSerif consultationHref={consultationHref} content={home.finalCta} />
    </main>
  );
}
