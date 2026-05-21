"use client";

import { motion } from "framer-motion";

const steps = [
  {
    label: "01",
    title: "Record",
    copy: "Multi-camera studio sessions built around personality, pace, and usable moments.",
  },
  {
    label: "02",
    title: "Edit",
    copy: "Long-form episodes, short-form cutdowns, hooks, captions, and platform-specific versions.",
  },
  {
    label: "03",
    title: "Package",
    copy: "Cover art, thumbnails, titles, show notes, and a visual identity people recognise.",
  },
  {
    label: "04",
    title: "Distribute",
    copy: "Spotify, YouTube, TikTok, socials, partners, and publishing rhythms handled together.",
  },
  {
    label: "05",
    title: "Grow",
    copy: "Analytics, audience feedback, sponsor readiness, and the next format decision.",
  },
];

export default function ProductionSystem() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(245,158,11,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end"
        >
          <div>
            <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
              The Lucky System
            </p>
            <h2 className="font-heading text-4xl font-bold leading-tight text-white md:text-6xl">
              One studio. One pipeline. Every asset a show needs.
            </h2>
          </div>
          <p className="font-body text-lg leading-relaxed text-text-secondary">
            The site should make the offer obvious: Lucky is not just a room
            with microphones. It is the production, packaging, publishing, and
            growth engine around the show.
          </p>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(18,18,20,0.92))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.28)] transition-colors hover:border-accent-orange/45"
            >
              <div className="mb-12 flex items-center justify-between">
                <span className="font-heading text-sm font-semibold text-accent-orange">
                  {step.label}
                </span>
                <span className="h-px w-10 bg-white/20 transition-colors group-hover:bg-accent-orange/70" />
              </div>
              <h3 className="mb-3 font-heading text-2xl font-bold text-white">
                {step.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-text-secondary">
                {step.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
