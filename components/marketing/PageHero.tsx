import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";

type PageHeroProps = {
  scene: string;
  sceneTitle: string;
  headline: string[];
  sub?: string;
  children?: React.ReactNode;
};

/** Inner-page opener: slate, big serif headline with italic-last-word accent, optional sub + extras. */
export default function PageHero({
  scene,
  sceneTitle,
  headline,
  sub,
  children,
}: PageHeroProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44 lg:px-16">
      <Slate scene={scene} title={sceneTitle} className="mb-12" />
      <Reveal>
        <h1 className="type-serif text-[clamp(2.75rem,7vw,6.5rem)]">
          {headline.map((line, index) => {
            const isLast = index === headline.length - 1;
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
        </h1>
      </Reveal>
      {sub && (
        <Reveal delay={0.12}>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone/70">{sub}</p>
        </Reveal>
      )}
      {children}
    </section>
  );
}
