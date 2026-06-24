"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PATHS = [
  {
    id: "talent",
    index: "01",
    kicker: "FOR CREATORS",
    lead: "I'm",
    accent: "talent",
    body: "Launching or leveling up a show. Format, studio, packaging and growth — built around your audience.",
    href: "/creators",
    cta: "Take the talent path",
  },
  {
    id: "brand",
    index: "02",
    kicker: "FOR BRANDS",
    lead: "I'm a",
    accent: "brand",
    body: "Building or sponsoring podcasts. Integrated strategy that compounds — not ad spots people skip.",
    href: "/brands",
    cta: "Take the brand path",
  },
];

export default function PathwaySplit() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The thread draws down through the first ~40% of the scroll.
  const threadScale = useTransform(scrollYProgress, [0, 0.42], [0, 1]);
  const threadOpacity = useTransform(scrollYProgress, [0, 0.06, 0.42], [0, 0.4, 1]);
  // The anticipation prompt rises, holds, then releases as the fork arrives.
  const promptOpacity = useTransform(scrollYProgress, [0.02, 0.12, 0.3, 0.44], [0, 1, 1, 0]);
  const promptY = useTransform(scrollYProgress, [0.02, 0.16], [70, 0]);

  return (
    <section ref={ref} className="relative">
      <div className="relative z-10">
        {/* ── The pathway runway ──────────────────────────────── */}
        <div className="relative flex h-[90vh] flex-col items-center justify-center px-6 text-center md:h-screen">
          {/* Glowing thread that draws as you scroll */}
          <motion.div
            aria-hidden
            style={{
              scaleY: threadScale,
              opacity: threadOpacity,
              filter: "drop-shadow(0 0 7px rgba(255,49,46,0.55))",
            }}
            className="absolute left-1/2 top-0 -ml-px h-full w-[2px] origin-top bg-gradient-to-b from-transparent via-bone/40 to-tally"
          />
          {/* Origin node */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone shadow-[0_0_24px_5px_rgba(236,233,226,0.45)]"
          />

          <motion.div style={{ opacity: promptOpacity, y: promptY }} className="relative max-w-2xl">
            <p className="tc-label mb-6 text-tally">The Lucky Path</p>
            <h2 className="type-serif text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.0] text-bone">
              One studio.
              <br />
              Two ways <em className="italic text-tally">in</em>.
            </h2>
            <p className="mx-auto mt-8 max-w-md font-barlow text-base leading-relaxed text-bone/60">
              What looks like luck is a process — and it starts by knowing which door is yours.
            </p>
          </motion.div>
        </div>

        {/* ── The fork ────────────────────────────────────────── */}
        <div className="relative flex justify-center" aria-hidden>
          <span className="absolute -top-1.5 left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-tally shadow-[0_0_30px_9px_rgba(255,49,46,0.5)]" />
          <svg viewBox="0 0 200 90" preserveAspectRatio="none" fill="none" className="h-20 w-[min(86%,520px)]">
            <defs>
              <linearGradient id="forkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff312e" />
                <stop offset="100%" stopColor="rgba(236,233,226,0.25)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M100 0 C100 52 40 44 22 90"
              stroke="url(#forkGrad)"
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <motion.path
              d="M100 0 C100 52 160 44 178 90"
              stroke="url(#forkGrad)"
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            />
          </svg>
        </div>

        {/* ── The destination: full-screen split ──────────────── */}
        <div id="paths" className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Center divider glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-tally/40 via-bone/10 to-transparent md:block"
          />
          {PATHS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.85, ease: EASE, delay: i * 0.12 }}
              className="flex min-h-[88vh] items-center justify-center p-8 md:min-h-svh md:p-12 lg:p-16"
            >
              <Link
                href={p.href}
                className="liquid-glass-strong group relative flex min-h-[30rem] w-full max-w-md flex-col rounded-[1.75rem] p-9 transition-transform duration-500 ease-out hover:-translate-y-2 md:min-h-[34rem] md:p-11"
              >
                <div className="flex items-center justify-between">
                  <span className="tc-label text-bone/55 transition-colors duration-300 group-hover:text-bone/80">
                    {p.kicker}
                  </span>
                  <span className="type-serif text-2xl italic text-tally">{p.index}</span>
                </div>

                <h3 className="type-serif mt-12 text-[clamp(3rem,5vw,4.75rem)] leading-[0.92] text-bone">
                  {p.lead}{" "}
                  <em className="italic text-tally">{p.accent}</em>
                  <span className="text-tally">.</span>
                </h3>

                <p className="mt-6 max-w-xs font-barlow text-sm leading-relaxed text-bone/75">
                  {p.body}
                </p>

                <span className="mt-auto inline-flex items-center gap-2.5 pt-12 font-barlow text-sm font-medium text-bone/85 transition-colors duration-300 group-hover:text-tally">
                  {p.cta}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
