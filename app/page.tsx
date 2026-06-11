import ColdOpen from "@/components/marketing/home/ColdOpen";
import ProofReel from "@/components/marketing/home/ProofReel";
import Thesis from "@/components/marketing/home/Thesis";
import SystemPipeline from "@/components/marketing/home/SystemPipeline";
import Network from "@/components/marketing/home/Network";
import Receipts from "@/components/marketing/home/Receipts";
import TwoDoors from "@/components/marketing/home/TwoDoors";
import TheRoom from "@/components/marketing/home/TheRoom";
import HomeFaq from "@/components/marketing/home/HomeFaq";
import FinalCta from "@/components/marketing/home/FinalCta";
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
    <main>
      <ColdOpen consultationHref={consultationHref} content={home.coldOpen} />
      <ProofReel content={home.proofReel} />
      <Thesis content={home.thesis} />
      <SystemPipeline content={home.system} />
      <Network shows={shows} content={home.network} />
      <Receipts content={home.receipts} />
      <TwoDoors content={home.twoDoors} />
      <TheRoom content={home.theRoom} />
      <HomeFaq content={home.faq} />
      <FinalCta consultationHref={consultationHref} content={home.finalCta} />
    </main>
  );
}
