import Image from "next/image";
import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import CtaBand from "@/components/marketing/CtaBand";
import PageHero from "@/components/marketing/PageHero";
import { getCmsRuntimePayload } from "@/lib/cms/runtime";
import { buildPageMetadata } from "@/lib/services/cms/seo";
import { getSiteSettings } from "@/lib/services/cms/siteSettings";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/work",
    fallbackTitle: "The Work | Lucky Studios Case Studies",
    fallbackDescription:
      "How Lucky Studios builds shows: the Back Post and Don't Get Me Started case studies — format design, studio production, packaging and distribution, with the numbers to show for it.",
    fallbackKeywords: [
      "podcast case study",
      "branded podcast results",
      "show format development",
      "podcast production case study",
      "Lucky Studios work",
    ],
  });
}

export default async function WorkPage() {
  const [pages, siteSettings] = await Promise.all([
    getCmsRuntimePayload("marketing-pages"),
    getSiteSettings(),
  ]);
  const workPage = pages.work;
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);

  return (
    <main>
      <PageHero {...workPage.hero} />

      {workPage.cases.map((caseStudy, index) => (
        <section
          key={caseStudy.slug}
          className={index % 2 === 0 ? "border-y border-bone/10 bg-carbon" : ""}
        >
          <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
            <Slate
              scene={`CASE ${String(index + 1).padStart(2, "0")}`}
              title={`${caseStudy.title.toUpperCase()} · ${caseStudy.genre}`}
              className="mb-14"
            />

            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Reveal>
                  <h2 className="type-serif text-[clamp(2rem,4.5vw,3.5rem)]">
                    {caseStudy.headline}
                  </h2>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="mt-10">
                    <h3 className="tc-label text-bone/50">The brief</h3>
                    <p className="mt-3 max-w-xl leading-relaxed text-bone/70">
                      {caseStudy.brief}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.15}>
                  <div className="mt-10">
                    <h3 className="tc-label text-bone/50">The system</h3>
                    <ul className="mt-4 space-y-3.5">
                      {caseStudy.system.map((line) => (
                        <li key={line} className="flex items-start gap-3 text-bone/75">
                          <span className="tc-label mt-1 text-tally" aria-hidden>
                            +
                          </span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>

              <div>
                <Reveal amount={0.2}>
                  <div className="relative aspect-[16/10] overflow-hidden border border-bone/10">
                    <Image
                      src={caseStudy.plate}
                      alt={caseStudy.plateAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="film-grade object-cover"
                    />
                  </div>
                </Reveal>

                <div className="mt-5 grid grid-cols-1 gap-px border border-bone/15 bg-bone/15 sm:grid-cols-3">
                  {caseStudy.results.map((result, resultIndex) => (
                    <Reveal
                      key={result.meter}
                      delay={0.1 + resultIndex * 0.08}
                      className="h-full"
                    >
                      <div className={`h-full p-6 ${index % 2 === 0 ? "bg-carbon" : "bg-ink"}`}>
                        <div className="flex items-center gap-2.5">
                          <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
                          <span className="tc-label text-bone/55">{result.meter}</span>
                        </div>
                        <p className="type-serif mt-4 text-xl leading-tight md:text-2xl">
                          {result.value}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-bone/55">
                          {result.note}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <Reveal delay={0.2}>
                  <p className="mt-8 border-l-2 border-tally pl-5 leading-relaxed text-bone/75">
                    <span className="tc-label block text-bone/50">Why it worked</span>
                    <span className="mt-2 block">{caseStudy.why}</span>
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBand
        headline={workPage.cta.headline}
        sub={workPage.cta.sub}
        primaryLabel={workPage.cta.primaryLabel}
        primaryHref={consultationHref}
        secondaryLabel={workPage.cta.secondaryLabel}
        secondaryHref={workPage.cta.secondaryHref}
      />
    </main>
  );
}
