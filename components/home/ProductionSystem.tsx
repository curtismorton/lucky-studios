"use client";

import { motion } from "framer-motion";

const steps = [
  {
    label: "01",
    title: "Shape",
    copy: "Positioning, format, audience, segments, guest strategy and commercial angle.",
  },
  {
    label: "02",
    title: "Record",
    copy: "Studio production, direction, cameras, audio, lighting and guest experience.",
  },
  {
    label: "03",
    title: "Package",
    copy: "Titles, thumbnails, clips, graphics, social hooks and platform native assets.",
  },
  {
    label: "04",
    title: "Distribute",
    copy: "YouTube, TikTok, Instagram, Spotify, Apple Podcasts and paid ready cutdowns.",
  },
  {
    label: "05",
    title: "Grow",
    copy: "Analytics, retention, audience behaviour, clip performance and format optimisation.",
  },
] as const;

interface ProductionSystemProps {
  consultationHref: string;
}

export default function ProductionSystem({
  consultationHref,
}: ProductionSystemProps) {
  const external = /^https?:\/\//i.test(consultationHref);

  return (
    <section className="relative px-4 py-16 sm:px-6 md:py-28 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-1/4 h-96 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.12),transparent_58%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-4xl md:mb-16"
        >
          <h2 className="mb-5 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            The Lucky System
          </h2>
          <p className="max-w-2xl font-heading text-xl font-medium leading-relaxed text-white/78 sm:text-2xl">
            One studio. One pipeline. Every asset a show needs.
          </p>
        </motion.div>

        <div className="relative grid gap-3 md:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-[31px] hidden h-px bg-gradient-to-r from-transparent via-accent-orange/45 to-transparent md:block" />
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: index * 0.06 }}
              className="group relative rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:border-accent-orange/35 md:border-transparent md:bg-transparent md:px-4 md:py-0 md:backdrop-blur-0"
            >
              <div className="relative z-10 mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full border border-accent-orange/35 bg-background text-sm font-semibold text-accent-orange shadow-[0_0_30px_rgba(245,158,11,0.12)]">
                {step.label}
              </div>
              <h3 className="mb-3 font-heading text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/62">
                {step.copy}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-12 md:mt-16"
        >
          <a
            href={consultationHref}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-accent-orange px-8 py-3.5 font-heading text-base font-semibold text-white transition hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
          >
            Book a consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
