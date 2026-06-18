import Image from "next/image";
import Reveal from "@/components/cinema/Reveal";
import { LocalBusinessSchema } from "@/components/seo/StructuredData";
import CtaBand from "@/components/marketing/CtaBand";
import PageHero from "@/components/marketing/PageHero";
import { getCmsRuntimePayload } from "@/lib/cms/runtime";
import { buildPageMetadata } from "@/lib/services/cms/seo";
import { getSiteSettings } from "@/lib/services/cms/siteSettings";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/studio",
    fallbackTitle: "London Podcast and Video Studio | Lucky Studios",
    fallbackDescription:
      "A purpose-built recording room in London with a live control room: 8 cameras, broadcast audio, live vision mix. Leave with an episode and its clips in motion.",
    fallbackKeywords: [
      "podcast studio London",
      "video studio London",
      "podcast production studio",
      "multi-camera studio",
      "video podcast studio",
      "Lucky Studios studio",
    ],
  });
}

export default async function StudioPage() {
  const [pages, siteSettings] = await Promise.all([
    getCmsRuntimePayload("marketing-pages"),
    getSiteSettings(),
  ]);
  const studioPage = pages.studio;
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);

  return (
    <main>
      <PageHero {...studioPage.hero} />

      {/* Spec meters */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-px border border-bone/15 bg-bone/15 sm:grid-cols-2 lg:grid-cols-4">
          {studioPage.specs.map((spec, index) => (
            <Reveal key={spec.meter} delay={index * 0.08} className="h-full">
              <div className="h-full bg-ink p-8">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
                  <span className="tc-label text-bone/55">{spec.meter}</span>
                </div>
                <p className="type-serif mt-4 text-3xl leading-tight md:text-4xl">
                  {spec.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-bone/55">{spec.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="border-y border-bone/10 bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
          <div className="grid gap-5 md:grid-cols-3">
            {studioPage.gallery.map((shot, index) => (
              <Reveal key={shot.plate} delay={index * 0.08} className="h-full">
                <figure className="group relative aspect-[4/5] overflow-hidden border border-bone/10">
                  <Image
                    src={shot.plate}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="film-grade object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <figcaption className="tc-label absolute left-4 top-4 bg-ink/70 px-2.5 py-1.5 text-bone/80 backdrop-blur-sm">
                    {shot.label}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* A session, start to finish */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <Reveal>
          <h2 className="type-serif text-[clamp(2rem,5vw,3.75rem)]">
            {studioPage.day.headline}
          </h2>
        </Reveal>
        <ol className="mt-14">
          {studioPage.day.steps.map((step) => (
            <li key={step.id} className="border-t border-bone/15 last:border-b">
              <Reveal amount={0.4}>
                <div className="grid gap-3 py-9 md:py-11 lg:grid-cols-[90px_360px_1fr] lg:gap-8">
                  <span className="tc-label tabular-nums text-tally">ST {step.id}</span>
                  <h3 className="type-serif text-2xl md:text-3xl">{step.name}</h3>
                  <p className="max-w-xl leading-relaxed text-bone/65">{step.copy}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand
        headline={studioPage.cta.headline}
        sub={studioPage.cta.sub}
        primaryLabel={studioPage.cta.primaryLabel}
        primaryHref={consultationHref}
        secondaryLabel={studioPage.cta.secondaryLabel}
        secondaryHref={studioPage.cta.secondaryHref}
      />
      <LocalBusinessSchema />
    </main>
  );
}
