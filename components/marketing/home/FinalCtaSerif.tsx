import Cta from "@/components/cinema/Cta";
import RecBadge from "@/components/cinema/RecBadge";
import Reveal from "@/components/cinema/Reveal";
import type { HomeContent } from "@/lib/content/home";

type FinalCtaSerifProps = {
  consultationHref: string;
  content: HomeContent["finalCta"];
};

/** Final scene — serif sign-off with a tally glow and the two site CTAs. */
export default function FinalCtaSerif({ consultationHref, content }: FinalCtaSerifProps) {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-40">
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tally/12 blur-[120px]"
        aria-hidden
      />

      <div className="liquid-glass-strong mx-auto max-w-3xl rounded-3xl px-8 py-14 text-center md:px-16 md:py-20">
        <Reveal>
          <div className="mb-8 flex justify-center">
            <RecBadge label={content.slate} />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="type-serif text-[clamp(2.75rem,8vw,6rem)]">
            {content.headline.map((line, index) => {
              const isLast = index === content.headline.length - 1;
              if (!isLast) {
                return (
                  <span key={line} className="block">
                    {line}
                  </span>
                );
              }
              const stripped = line.replace(/\.$/, "");
              const words = stripped.split(" ");
              const lastWord = words.pop() ?? "";
              const head = words.join(" ");
              return (
                <span key={line} className="block">
                  {head ? `${head} ` : ""}
                  <em className="italic text-tally">{lastWord}</em>
                  {line.endsWith(".") && <span className="text-tally">.</span>}
                </span>
              );
            })}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-7 max-w-xl text-lg text-bone/70">{content.sub}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Cta href={consultationHref} external={consultationHref.startsWith("http")}>
              {content.primaryCta}
            </Cta>
            <Cta href={content.secondaryHref} variant="ghost">
              {content.secondaryCta}
            </Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
