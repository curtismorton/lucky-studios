import Link from "next/link";
import Reveal from "@/components/cinema/Reveal";
import PageHero from "@/components/marketing/PageHero";
import CtaBand from "@/components/marketing/CtaBand";
import ShowPoster from "@/components/marketing/ShowPoster";
import { getShows } from "@/lib/services/cms/shows";
import { buildPageMetadata } from "@/lib/services/cms/seo";
import { getSiteSettings } from "@/lib/services/cms/siteSettings";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/shows",
    fallbackTitle: "The Network | Lucky Studios Shows",
    fallbackDescription:
      "The Lucky Studios network: creator-led formats with clear identities, repeatable moments and platform-first packaging. Football, entertainment and lifestyle shows built in London.",
    fallbackKeywords: [
      "Lucky Studios shows",
      "creator-led shows",
      "entertainment podcasts",
      "football podcast",
      "lifestyle podcast",
      "podcast network london",
    ],
  });
}

export default async function ShowsPage() {
  const [shows, siteSettings] = await Promise.all([getShows(), getSiteSettings()]);
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);
  const lineup = shows.filter((show) => show.slug !== "coming-soon");

  return (
    <main>
      <PageHero
        scene="THE NETWORK"
        sceneTitle="NOW SHOWING"
        headline={["Shows people", "come back for."]}
        sub="Original formats with clear identities, repeatable moments and packaging built for every platform they live on. All produced through one pipeline in London."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32 lg:px-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lineup.map((show, index) => (
            <Reveal key={show.slug} delay={(index % 3) * 0.08} className="h-full">
              <ShowPoster show={show} />
            </Reveal>
          ))}

          <Reveal delay={(lineup.length % 3) * 0.08} className="h-full">
            <Link
              href="/contact"
              className="group flex aspect-[4/5] flex-col items-start justify-between border border-dashed border-bone/25 p-5 transition-colors duration-300 hover:border-tally"
            >
              <span className="tc-label text-bone/50">Slot open</span>
              <span>
                <span className="type-display block text-2xl leading-none text-bone/80 transition-colors duration-300 group-hover:text-bone">
                  Your show here.
                </span>
                <span className="link-underline tc-label mt-4 inline-block text-tally">
                  Start the conversation →
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand
        headline="Got the next one?"
        sub="Creator, brand or half-formed idea — the network has room and the pipeline is warm."
        primaryLabel="Book a consultation"
        primaryHref={consultationHref}
        secondaryLabel="How we build shows"
        secondaryHref="/work"
      />
    </main>
  );
}
