import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import CtaBand from "@/components/marketing/CtaBand";
import PageHero from "@/components/marketing/PageHero";
import { aboutPage } from "@/lib/content/about";
import { buildPageMetadata } from "@/lib/services/cms/seo";
import { getSiteSettings } from "@/lib/services/cms/siteSettings";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/about",
    fallbackTitle: "About Lucky Studios | We Engineer Luck",
    fallbackDescription:
      "Lucky Studios is a London production studio and creator media network backed by Socially Powerful. We build the system behind shows that look like luck.",
    fallbackKeywords: [
      "Lucky Studios",
      "creator media studio",
      "podcast production London",
      "Socially Powerful",
      "about Lucky Studios",
    ],
  });
}

export default async function AboutPage() {
  const siteSettings = await getSiteSettings();
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);

  return (
    <main>
      <PageHero {...aboutPage.hero} />

      {/* Manifesto */}
      <section className="border-y border-bone/10 bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
          <Slate scene="SCENE 01" title="THE STORY" className="mb-14" />
          <div className="max-w-3xl space-y-8">
            {aboutPage.manifesto.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.05}>
                <p
                  className={
                    index === 0
                      ? "text-2xl font-bold leading-snug md:text-3xl"
                      : "text-lg leading-relaxed text-bone/70"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <Slate scene="SCENE 02" title="THE NUMBERS" className="mb-14" />
        <div className="grid grid-cols-1 gap-px border border-bone/15 bg-bone/15 sm:grid-cols-3">
          {aboutPage.numbers.map((stat, index) => (
            <Reveal key={stat.meter} delay={index * 0.08} className="h-full">
              <div className="h-full bg-ink p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
                  <span className="tc-label text-bone/55">{stat.meter}</span>
                </div>
                <p className="type-display mt-5 text-5xl tabular-nums md:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-bone/55">{stat.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Backing */}
      <section className="border-t border-bone/10">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
          <Slate scene="SCENE 03" title="THE NETWORK BEHIND US" className="mb-14" />
          <Reveal>
            <h2 className="type-display max-w-3xl text-[clamp(2rem,5vw,3.75rem)]">
              {aboutPage.backing.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone/70">
              {aboutPage.backing.copy}
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        headline={aboutPage.cta.headline}
        sub={aboutPage.cta.sub}
        primaryLabel={aboutPage.cta.primaryLabel}
        primaryHref={consultationHref}
        secondaryLabel={aboutPage.cta.secondaryLabel}
        secondaryHref={aboutPage.cta.secondaryHref}
      />
    </main>
  );
}
