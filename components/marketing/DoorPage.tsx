import Link from "next/link";
import Cta from "@/components/cinema/Cta";
import Reveal from "@/components/cinema/Reveal";
import CtaBand from "@/components/marketing/CtaBand";
import PageHero from "@/components/marketing/PageHero";

export type DoorPageContent = {
  hero: {
    scene: string;
    sceneTitle: string;
    headline: string[];
    sub: string;
  };
  problem: {
    lede: string;
    points: Array<{ id: string; title: string; copy: string }>;
  };
  offer: {
    headline: string;
    items: Array<{ name: string; copy: string }>;
  };
  fit: {
    headline: string;
    bullets: string[];
  };
  proof: {
    quoteLine: string;
    note: string;
    href: string;
    linkLabel: string;
  };
  cta: {
    headline: string;
    sub: string;
    primaryLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

type DoorPageProps = {
  content: DoorPageContent;
  consultationHref: string;
};

/** Shared layout for the two audience doors (/creators, /brands). */
export default function DoorPage({ content, consultationHref }: DoorPageProps) {
  const external = consultationHref.startsWith("http");

  return (
    <main>
      <PageHero {...content.hero}>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Cta href={consultationHref} external={external}>
              {content.cta.primaryLabel}
            </Cta>
            <Cta href="/work" variant="ghost">
              See the work
            </Cta>
          </div>
        </Reveal>
      </PageHero>

      {/* The problem */}
      <section className="border-y border-bone/10 bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
          <Reveal>
            <h2 className="type-display max-w-4xl text-[clamp(2rem,5vw,3.75rem)]">
              {content.problem.lede}
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-px border border-bone/15 bg-bone/15 md:grid-cols-3">
            {content.problem.points.map((point, index) => (
              <Reveal key={point.id} delay={index * 0.08} className="h-full">
                <div className="h-full bg-carbon p-8 md:p-10">
                  <span className="tc-label text-tally">{point.id}</span>
                  <h3 className="mt-4 text-xl font-bold">{point.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-bone/65">{point.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The offer */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <Reveal>
          <h2 className="type-display text-[clamp(2rem,5vw,3.75rem)] uppercase">
            {content.offer.headline}
          </h2>
        </Reveal>
        <ol className="mt-14">
          {content.offer.items.map((item, index) => (
            <li key={item.name} className="border-t border-bone/15 last:border-b">
              <Reveal amount={0.4}>
                <div className="grid gap-3 py-9 md:py-11 lg:grid-cols-[90px_320px_1fr] lg:gap-8">
                  <span className="tc-label tabular-nums text-tally">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-display text-2xl uppercase md:text-3xl">{item.name}</h3>
                  <p className="max-w-xl leading-relaxed text-bone/65">{item.copy}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Fit + proof */}
      <section className="border-t border-bone/10">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:px-16">
          <Reveal>
            <div>
              <h2 className="type-display text-3xl uppercase md:text-4xl">
                {content.fit.headline}
              </h2>
              <ul className="mt-9 space-y-4">
                {content.fit.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-bone/80">
                    <span className="tc-label mt-1 text-tally" aria-hidden>
                      +
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <figure className="flex h-full flex-col justify-between border-l-2 border-tally bg-carbon p-8 md:p-10">
              <blockquote className="text-2xl font-bold leading-snug md:text-3xl">
                {content.proof.quoteLine}
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-sm text-bone/60">{content.proof.note}</p>
                <Link
                  href={content.proof.href}
                  className="link-underline tc-label mt-4 inline-block text-tally"
                >
                  {content.proof.linkLabel} →
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <CtaBand
        headline={content.cta.headline}
        sub={content.cta.sub}
        primaryLabel={content.cta.primaryLabel}
        primaryHref={consultationHref}
        secondaryLabel={content.cta.secondaryLabel}
        secondaryHref={content.cta.secondaryHref}
      />
    </main>
  );
}
