import Cta from "@/components/cinema/Cta";
import Reveal from "@/components/cinema/Reveal";

type CtaBandProps = {
  headline: string;
  sub?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

/** Closing band for inner pages — one decision, framed in red. */
export default function CtaBand({
  headline,
  sub,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaBandProps) {
  return (
    <section className="border-t border-bone/10 bg-carbon">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <Reveal>
          <p className="tc-label flex items-center gap-4 text-bone/50">
            <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
            NEXT SCENE
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="type-display mt-8 max-w-4xl text-[clamp(2.25rem,5.5vw,4.5rem)] uppercase">
            {headline}
          </h2>
        </Reveal>
        {sub && (
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/65">{sub}</p>
          </Reveal>
        )}
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Cta href={primaryHref} external={primaryHref.startsWith("http")}>
              {primaryLabel}
            </Cta>
            {secondaryLabel && secondaryHref && (
              <Cta href={secondaryHref} variant="ghost">
                {secondaryLabel}
              </Cta>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
