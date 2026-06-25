import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { HomeContent } from "@/lib/content/home";

/**
 * The system — five stations as an editorial track list (number · name · copy).
 * Reads like a shot list, scales cleanly past three items.
 */
export default function Stations({ content }: { content: HomeContent["system"] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <Slate scene={content.slate.scene} title={content.slate.title} className="mb-14" />

      <div className="max-w-3xl">
        <Reveal>
          <h2 className="type-serif text-[clamp(2.25rem,5.5vw,4.5rem)]">{content.headline}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-lg text-bone/65">{content.sub}</p>
        </Reveal>
      </div>

      <div className="mt-16 border-t border-bone/12">
        {content.stations.map((station, index) => (
          <Reveal key={station.id} delay={index * 0.05}>
            <div className="group grid grid-cols-1 gap-3 border-b border-bone/12 py-8 transition-colors duration-300 hover:bg-carbon/40 md:grid-cols-[5rem_1fr_2fr] md:items-baseline md:gap-10 md:px-4">
              <span className="type-serif text-4xl italic text-tally md:text-5xl">{station.id}</span>
              <h3 className="type-serif text-3xl leading-none md:text-4xl">{station.name}</h3>
              <p className="max-w-2xl leading-relaxed text-bone/65">{station.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
