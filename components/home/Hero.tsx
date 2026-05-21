"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonHover, buttonTap } from "@/lib/animations";
import HeroUnicornBackground from "@/components/home/HeroUnicornBackground";
import { site } from "@/lib/data/site";
import {
  defaultHomepageContent,
  type HeroContent,
} from "@/lib/data/homepageContent";

interface HeroProps {
  content?: HeroContent;
}

const rotatingProofLines = [
  "15 million social views after launch.",
  "Understanding the nuance of every platform after years of experience.",
  "Sustained episode-to-episode growth.",
];

export default function Hero({ content }: HeroProps) {
  const heroContent = content || defaultHomepageContent.hero;
  const proofStats =
    heroContent.proofStats.length > 0
      ? heroContent.proofStats
      : defaultHomepageContent.hero.proofStats;
  const bookingHref = site.calendlyUrl || "/contact";
  const bookingTarget = site.calendlyUrl ? "_blank" : undefined;
  const bookingRel = site.calendlyUrl ? "noopener noreferrer" : undefined;
  const shouldReduceMotion = useReducedMotion();
  const [proofIndex, setProofIndex] = useState(0);
  const tapeItems = [
    "Spotify Charting Shows",
    "TikTok-First Growth",
    "8-Camera Studio",
    "London Bridge HQ",
    "End-to-End Production",
  ];

  useEffect(() => {
    if (shouldReduceMotion || rotatingProofLines.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setProofIndex((current) => (current + 1) % rotatingProofLines.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  const primaryCtaContent = (
    <motion.span
      className="group relative flex min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full bg-accent-amber px-8 py-4 font-heading text-base font-semibold text-white shadow-[0_4px_24px_rgba(245,158,11,0.28)] transition-all duration-300 hover:glow-amber touch-manipulation"
      whileHover={buttonHover}
      whileTap={buttonTap}
    >
      <Phone className="h-5 w-5" />
      <span>Book a Call</span>
    </motion.span>
  );

  const primaryCta = site.calendlyUrl ? (
    <a
      href={bookingHref}
      target={bookingTarget}
      rel={bookingRel}
      className="inline-block"
    >
      {primaryCtaContent}
    </a>
  ) : (
    <Link href={bookingHref} className="inline-block">
      {primaryCtaContent}
    </Link>
  );

  return (
    <header className="relative min-h-screen overflow-hidden px-4 pb-28 pt-28 md:px-8 md:pt-32">
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <HeroUnicornBackground />
        <div className="absolute inset-0 bg-black/36" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/16 via-transparent to-fuchsia-500/12" />
        <div className="absolute -left-28 top-1/2 h-[440px] w-[440px] -translate-y-1/2 rounded-full bg-violet-500/26 blur-[140px]" />
        <div className="absolute -right-28 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-fuchsia-500/22 blur-[130px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/46 via-black/30 to-background/82" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col px-4 md:px-8">
        <div className="mx-auto w-full max-w-5xl text-center">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
              Bermondsey, London <span className="text-white/60">•</span>{" "}
              Podcast Production <span className="text-white/60">•</span>{" "}
              Growth
            </span>
          </motion.div>

          <div className="mb-5 flex min-h-[2.6rem] items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={proofIndex}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="max-w-3xl text-sm font-semibold uppercase tracking-[0.12em] text-accent-amber md:text-base"
              >
                {rotatingProofLines[proofIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-3xl font-body text-lg leading-relaxed text-white/88"
          >
            Understanding the nuance of every platform after years of
            experience is what turns momentum into outcomes.
          </motion.p>
        </div>

        <div className="mx-auto mt-auto w-full max-w-5xl pb-6 text-center">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mb-8 flex flex-col flex-wrap items-stretch justify-center gap-4 sm:flex-row sm:items-center"
          >
            {primaryCta}
            <Link href="/shows" className="inline-block">
              <motion.span
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/22 bg-black/46 px-8 py-4 font-heading text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/38 hover:bg-black/58 touch-manipulation"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Play className="h-5 w-5" />
                <span>Explore Shows</span>
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease: "easeOut" }}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {proofStats.slice(0, 3).map((stat) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className="rounded-2xl border border-white/22 bg-black/48 px-4 py-3 text-left backdrop-blur-md"
              >
                <p className="font-heading text-xl font-bold text-accent-amber">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wide text-white/80">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-y border-white/15 bg-black/52 backdrop-blur-md">
        <motion.div
          className="flex w-max gap-8 py-3 pl-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/72"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...tapeItems, ...tapeItems, ...tapeItems].map((item, index) => (
            <span key={`${item}-${index}`} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
