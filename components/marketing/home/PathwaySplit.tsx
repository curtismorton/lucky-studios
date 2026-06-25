"use client";

import Link from "next/link";
import { motion } from "motion/react";

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
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-6 py-24 md:px-10">
      {/* Heading — reveals once on scroll, then stays above the options */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative max-w-2xl text-center"
      >
        {/* Soft scrim so the heading reads over the busy plate */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[170%] w-[160%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,10,11,0.7) 0%, rgba(10,10,11,0.35) 48%, transparent 74%)",
          }}
        />
        <div className="relative">
          <p className="tc-label mb-5 text-tally">The Lucky Path</p>
          <h2 className="type-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-bone">
            One studio. Two ways <em className="italic text-tally">in</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-md font-barlow text-base leading-relaxed text-bone/70">
            What looks like luck is a process. Pick the door that&apos;s yours.
          </p>
        </div>
      </motion.div>

      {/* Two floating "pick one" boxes */}
      <div
        id="paths"
        className="relative mt-12 grid w-full max-w-4xl grid-cols-1 gap-5 md:mt-14 md:grid-cols-2"
      >
        {/* "or" — signals these are two alternative options, pick one */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <span className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full font-barlow text-xs uppercase tracking-[0.15em] text-bone/80">
            or
          </span>
        </div>
        {PATHS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 + i * 0.12 }}
          >
            <Link
              href={p.href}
              className="liquid-glass-strong group relative flex h-full flex-col rounded-[1.5rem] p-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out hover:-translate-y-2 md:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="tc-label text-tally">{p.kicker}</span>
                <span className="type-serif text-xl italic text-tally">{p.index}</span>
              </div>

              <h3 className="type-serif mt-8 text-[clamp(2.25rem,4vw,3.25rem)] leading-[0.95] text-bone">
                {p.lead}{" "}
                <em className="italic text-tally">{p.accent}</em>
                <span className="text-tally">.</span>
              </h3>

              <p className="mt-4 max-w-xs font-barlow text-sm leading-relaxed text-bone/75">
                {p.body}
              </p>

              <span className="mt-8 inline-flex items-center gap-2.5 font-barlow text-sm font-medium text-bone/85 transition-colors duration-300 group-hover:text-tally">
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
    </section>
  );
}
