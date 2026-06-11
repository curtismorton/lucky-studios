import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { HomeContent } from "@/lib/content/home";

export default function Thesis({ content: thesis }: { content: HomeContent["thesis"] }) {
  const lines = thesis.lines;

  return (
    <section className="border-y border-bone/10 bg-carbon">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36 lg:px-16">
        <Slate scene={thesis.slate.scene} title={thesis.slate.title} className="mb-16" />

        <div className="max-w-5xl">
          <Reveal>
            <p className="type-display text-[clamp(2.25rem,6vw,4.5rem)]">{lines[0]}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-3xl text-xl leading-relaxed text-bone/65 md:text-2xl">
              {lines[1]}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-4xl text-xl leading-relaxed text-bone/65 md:text-2xl">
              {lines[2]}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="type-display mt-14 text-[clamp(2.25rem,6vw,4.5rem)] text-tally">
              {lines[3]}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
