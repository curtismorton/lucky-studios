"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Cta from "@/components/cinema/Cta";
import RecBadge from "@/components/cinema/RecBadge";
import Timecode from "@/components/cinema/Timecode";
import type { HomeContent } from "@/lib/content/home";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type ColdOpenProps = {
  consultationHref: string;
  content: HomeContent["coldOpen"];
};

export default function ColdOpen({ consultationHref, content: coldOpen }: ColdOpenProps) {
  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      {/* Plate */}
      <div className="absolute inset-0">
        <Image
          src={coldOpen.plate}
          alt={coldOpen.plateAlt}
          fill
          priority
          sizes="100vw"
          className="film-grade-deep object-cover"
        />
        <div className="scrim-b absolute inset-0" />
        <div className="vignette absolute inset-0" />
      </div>

      {/* Letterbox bars */}
      <div className="absolute inset-x-0 top-0 z-10 h-5 bg-ink md:h-8" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 z-10 h-5 bg-ink md:h-8" aria-hidden />

      {/* Frame telemetry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="absolute inset-x-0 top-5 z-10 md:top-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-20 md:px-10 lg:px-16">
          <span className="tc-label hidden text-bone/50 md:block">{coldOpen.slate}</span>
          <span className="flex items-center gap-6">
            <RecBadge />
            <Timecode className="hidden sm:block" />
          </span>
        </div>
      </motion.div>

      {/* Title block */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10 md:pb-28 lg:px-16">
        <h1 className="type-display text-[clamp(2.75rem,8vw,7.5rem)] uppercase">
          {coldOpen.headline.map((line, index) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block whitespace-nowrap"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 + index * 0.16 }}
              >
                {line.replace(/\.$/, "")}
                {line.endsWith(".") && <span className="text-tally">.</span>}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
          className="mt-7 max-w-2xl text-base leading-relaxed text-bone/75 md:text-lg"
        >
          {coldOpen.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Cta href={consultationHref} external={consultationHref.startsWith("http")}>
            {coldOpen.primaryCta}
          </Cta>
          <Cta href="/shows" variant="ghost">
            {coldOpen.secondaryCta}
          </Cta>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-hidden
      >
        <span className="tc-label text-bone/40">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-bone/15">
          <motion.span
            className="absolute left-0 top-0 h-1/2 w-px bg-tally"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
