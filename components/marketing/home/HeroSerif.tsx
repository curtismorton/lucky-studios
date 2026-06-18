"use client";

import { motion } from "motion/react";
import Cta from "@/components/cinema/Cta";
import RecBadge from "@/components/cinema/RecBadge";
import Timecode from "@/components/cinema/Timecode";
import FadingVideo from "@/components/cinema/FadingVideo";
import type { HomeContent } from "@/lib/content/home";

// Placeholder footage — replace with Lucky Studios studio footage
const VIDEO_HERO = "https://assets.mixkit.co/videos/2948/2948-1080.mp4";

const PLATFORMS = ["Spotify", "Apple Podcasts", "YouTube", "TikTok", "Instagram"];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type HeroSerifProps = {
  consultationHref: string;
  content: HomeContent["coldOpen"];
};

export default function HeroSerif({ consultationHref, content }: HeroSerifProps) {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-black">
      {/* Video plate */}
      <FadingVideo
        src={VIDEO_HERO}
        poster={content.plate}
        className="absolute left-1/2 top-1/2 z-0 max-w-none -translate-x-1/2 -translate-y-1/2 object-cover film-grade-deep"
        style={{ width: "120%", height: "120%" }}
      />
      <div className="scrim-b absolute inset-0 z-[1]" />
      <div className="vignette absolute inset-0 z-[1]" />

      {/* Letterbox bars */}
      <div className="absolute inset-x-0 top-0 z-10 h-5 bg-ink md:h-8" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 z-10 h-5 bg-ink md:h-8" aria-hidden />

      {/* Cinema telemetry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="absolute inset-x-0 top-5 z-10 md:top-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-20 md:px-10 lg:px-16">
          <span className="tc-label hidden text-bone/50 md:block">{content.slate}</span>
          <span className="flex items-center gap-6">
            <RecBadge />
            <Timecode className="hidden sm:block" />
          </span>
        </div>
      </motion.div>

      {/* Main content — centred */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-44 text-center md:px-10">
        {/* Glass "Now Booking" badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
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
                  ) : (
                    line
                  )}
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
          className="mt-6 max-w-xl font-barlow text-base leading-relaxed text-bone/65 md:text-lg"
        >
          {content.sub}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Cta href={consultationHref} external={consultationHref.startsWith("http")}>
            {content.primaryCta}
          </Cta>
          <Cta href="/shows" variant="ghost">
            {content.secondaryCta}
          </Cta>
        </motion.div>
      </div>

      {/* Glass platform strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="relative z-10 flex justify-center pb-12 md:pb-16"
      >
        <div className="liquid-glass flex items-center gap-3 rounded-full px-4 py-2">
          <span className="font-barlow text-[11px] uppercase tracking-wider text-bone/45">
            On
          </span>
          <span className="h-3 w-px bg-bone/20" aria-hidden />
          <span className="font-barlow text-sm italic text-bone/70">
            {PLATFORMS.join(" · ")}
          </span>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-hidden
      >
        <span className="tc-label text-bone/40">SCROLL</span>
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
