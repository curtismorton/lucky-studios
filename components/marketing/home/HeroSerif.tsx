"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import LuckyDoodles from "@/components/marketing/home/LuckyDoodles";
import type { HomeContent } from "@/lib/content/home";

const PLATFORMS = ["Spotify", "Apple Podcasts", "YouTube", "Amazon Music", "TikTok"];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MicIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-bone">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-bone">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" />
  </svg>
);

type Stat = { value: string; note: string };

type HeroSerifProps = {
  consultationHref: string;
  content: HomeContent["coldOpen"];
  stats?: [Stat, Stat];
};

export default function HeroSerif({ consultationHref, content, stats }: HeroSerifProps) {
  const isExternal = consultationHref.startsWith("http");

  // Badge + CTAs hold back until the first scroll, so the landing opens bare.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex min-h-svh flex-col">
      <LuckyDoodles />

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-40 text-center md:px-10">
        {/* Glass "Now Booking" badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : 12 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="liquid-glass mb-8 flex items-center rounded-full"
        >
          <span className="m-1.5 rounded-full bg-bone px-3 py-1.5 font-barlow text-[11px] font-semibold uppercase tracking-wider text-ink">
            Now Booking
          </span>
          <span className="pr-4 font-barlow text-sm text-bone/70">
            Studio sessions open
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="type-serif text-[clamp(3rem,9vw,8rem)]">
          {content.headline.map((line, index) => {
            const isLast = index === content.headline.length - 1;
            const stripped = line.replace(/\.$/, "");
            const words = stripped.split(" ");
            const lastWord = words.pop() ?? "";
            const head = words.join(" ");

            return (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.35 + index * 0.16 }}
                >
                  {isLast ? (
                    <>
                      {head ? `${head} ` : ""}
                      <em className="italic text-tally">{lastWord}</em>
                      {line.endsWith(".") && <span className="text-tally">.</span>}
                    </>
                  ) : line}
                </motion.span>
              </span>
            );
          })}
        </h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
          className="mt-6 max-w-xl font-barlow text-sm font-light leading-relaxed text-bone/70 md:text-base"
        >
          {content.sub}
        </motion.p>

        {/* CTAs — glass primary, plain secondary */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : 18 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          <Link
            href={consultationHref}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 font-barlow text-sm font-medium text-bone"
          >
            {content.primaryCta}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M7 17L17 7" /><path d="M7 7h10v10" />
            </svg>
          </Link>
          <Link
            href="/shows"
            className="inline-flex items-center gap-2 font-barlow text-sm font-medium text-bone/70 transition-colors hover:text-bone"
          >
            {content.secondaryCta}
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </Link>
        </motion.div>

      </div>

      {/* Platform strip — glass pill label + spread serif italic names */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="relative z-10 flex flex-col items-center gap-5 pb-12 md:pb-16"
      >
        <span className="liquid-glass rounded-full px-3.5 py-1.5 font-barlow text-xs text-bone/75">
          Distributed everywhere your audience already listens
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {PLATFORMS.map((name) => (
            <span key={name} className="type-serif text-xl italic tracking-tight text-bone/75 md:text-2xl">
              {name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Scroll hint — invites the bare landing downward */}
      <motion.div
        aria-hidden
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center md:bottom-8"
      >
        <motion.svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-bone/55"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
