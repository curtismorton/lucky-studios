import Cta from "@/components/cinema/Cta";
import Reveal from "@/components/cinema/Reveal";
import type { HomeContent } from "@/lib/content/home";

type FinalCtaProps = {
  consultationHref: string;
  content: HomeContent["finalCta"];
};

export default function FinalCta({ consultationHref, content: finalCta }: FinalCtaProps) {
  return (
    <section className="border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6 py-28 text-center md:px-10 md:py-40 lg:px-16">
        <Reveal>
          <p className="tc-label flex items-center justify-center gap-4 text-bone/50">
            <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
            {finalCta.slate}
            <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="type-display mt-10 text-[clamp(3rem,10vw,8.5rem)] uppercase leading-none">
            {finalCta.headline[0]}
            <br />
            <span className="text-tally">{finalCta.headline[1]}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-bone/65">
            {finalCta.sub}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Cta href={consultationHref} external={consultationHref.startsWith("http")}>
              {finalCta.primaryCta}
            </Cta>
            <Cta href={finalCta.secondaryHref} variant="ghost">
              {finalCta.secondaryCta}
            </Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
