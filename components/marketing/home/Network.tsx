import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { Show } from "@/lib/data/shows";
import { network } from "@/lib/content/home";

const FALLBACK_PLATE = "/images/hero/hero-main-our-pic.jpg";

export default function Network({ shows }: { shows: Show[] }) {
  const lineup = shows.filter((show) => show.slug !== "coming-soon").slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <Slate scene={network.slate.scene} title={network.slate.title} className="mb-14" />

      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <h2 className="type-display max-w-3xl text-[clamp(2.25rem,5.5vw,4.5rem)]">
            {network.headline}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link href="/shows" className="link-underline tc-label !text-xs text-bone/70">
            {network.cta} →
          </Link>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-2xl text-lg text-bone/65">{network.sub}</p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lineup.map((show, index) => (
          <Reveal key={show.slug} delay={index * 0.08} className="h-full">
            <Link
              href={`/shows/${show.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden border border-bone/10 bg-carbon"
            >
              <Image
                src={show.ogImage || FALLBACK_PLATE}
                alt={show.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="film-grade object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="scrim-b absolute inset-0" />
              <span className="tc-label absolute left-4 top-4 bg-ink/70 px-2.5 py-1.5 text-bone/80 backdrop-blur-sm">
                {show.genre}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="type-display text-2xl leading-none">{show.title}</h3>
                <p className="tc-label mt-3 text-bone/60">{show.stat}</p>
              </div>
              <span
                className="absolute right-4 top-4 h-2 w-2 rounded-full bg-tally opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </Reveal>
        ))}

        {/* The open slot */}
        <Reveal delay={lineup.length * 0.08} className="h-full">
          <Link
            href="/contact"
            className="group flex aspect-[4/5] flex-col items-start justify-between border border-dashed border-bone/25 p-5 transition-colors duration-300 hover:border-tally"
          >
            <span className="tc-label text-bone/50">Slot open</span>
            <span>
              <span className="type-display block text-2xl leading-none text-bone/80 transition-colors duration-300 group-hover:text-bone">
                Your show here.
              </span>
              <span className="link-underline tc-label mt-4 inline-block text-tally">
                Start the conversation →
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
