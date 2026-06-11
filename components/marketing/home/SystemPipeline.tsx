"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { HomeContent } from "@/lib/content/home";

export default function SystemPipeline({ content: system }: { content: HomeContent["system"] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.75", "end 0.45"],
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <Slate scene={system.slate.scene} title={system.slate.title} className="mb-14" />

      <div className="max-w-4xl">
        <Reveal>
          <h2 className="type-display text-[clamp(2.5rem,6vw,5rem)] uppercase">
            {system.headline}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-bone/65">{system.sub}</p>
        </Reveal>
      </div>

      {/* Pipeline rail */}
      <div ref={railRef} className="relative mt-20 lg:pl-12">
        <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-bone/15 lg:block" aria-hidden>
          <motion.div
            className="h-full w-px origin-top bg-tally"
            style={{ scaleY: scrollYProgress }}
          />
        </div>

        <ol>
          {system.stations.map((station, index) => (
            <li key={station.id} className="border-t border-bone/15 last:border-b">
              <Reveal amount={0.4}>
                <div className="grid gap-4 py-10 md:py-12 lg:grid-cols-[90px_280px_1fr] lg:gap-8">
                  <span className="tc-label tabular-nums text-tally">
                    ST {station.id}
                  </span>
                  <h3 className="type-display text-3xl uppercase md:text-4xl">
                    {station.name}
                  </h3>
                  <p className="max-w-xl text-base leading-relaxed text-bone/65 md:text-lg">
                    {station.copy}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
