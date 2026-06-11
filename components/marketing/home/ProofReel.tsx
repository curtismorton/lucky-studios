import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import { proofReel } from "@/lib/content/home";

export default function ProofReel() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <Slate scene={proofReel.slate.scene} title={proofReel.slate.title} className="mb-14" />

      <Reveal>
        <p className="type-display max-w-4xl text-[clamp(2rem,5vw,3.75rem)]">
          {proofReel.lede}
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-px border border-bone/15 bg-bone/15 sm:grid-cols-2 lg:grid-cols-4">
        {proofReel.stats.map((stat, index) => (
          <div key={stat.meter} className="bg-ink p-8 md:p-10">
            <Reveal delay={index * 0.08}>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
                <span className="tc-label text-bone/55">{stat.meter}</span>
              </div>
              <p className="type-display mt-5 text-5xl tabular-nums md:text-6xl">
                {stat.value}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-bone/55">{stat.note}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
