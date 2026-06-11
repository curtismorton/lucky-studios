import Image from "next/image";
import Cta from "@/components/cinema/Cta";
import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { HomeContent } from "@/lib/content/home";

export default function TheRoom({ content: theRoom }: { content: HomeContent["theRoom"] }) {
  return (
    <section className="border-y border-bone/10 bg-carbon">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <Slate scene={theRoom.slate.scene} title={theRoom.slate.title} className="mb-14" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="type-display text-[clamp(2.25rem,5.5vw,4.25rem)]">
                {theRoom.headline}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-bone/65">
                {theRoom.copy}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="tc-label mt-9 !leading-loose text-bone/50">
                8 cameras · broadcast audio · live vision mix · Central London
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10">
                <Cta href={theRoom.href}>{theRoom.cta}</Cta>
              </div>
            </Reveal>
          </div>

          <Reveal amount={0.2}>
            <div className="relative aspect-[3/4] overflow-hidden border border-bone/10">
              <Image
                src={theRoom.plate}
                alt={theRoom.plateAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="film-grade object-cover"
              />
              <span className="tc-label absolute left-4 top-4 bg-ink/70 px-2.5 py-1.5 text-bone/80 backdrop-blur-sm">
                STUDIO FLOOR · READY
              </span>
              <span
                className="absolute right-4 top-4 h-2 w-2 rounded-full bg-tally animate-rec-blink motion-reduce:animate-none"
                aria-hidden
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
