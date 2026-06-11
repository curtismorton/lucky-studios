"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "5M+",
    label: "Organic views",
    copy: "Generated across studio formats",
  },
  {
    value: "10+",
    label: "Digital shows",
    copy: "Developed, produced or packaged",
  },
  {
    value: "1.1M",
    label: "Unique reach",
    copy: "Across the network",
  },
  {
    value: "4.8★",
    label: "Spotify rating",
    copy: "Across flagship shows",
  },
] as const;

export default function StatsBar() {
  return (
    <section className="relative px-4 py-14 sm:px-6 md:py-20 lg:px-8" aria-label="Network proof">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-5">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            Network proof
          </p>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="relative min-h-[184px] overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(15,15,16,0.8))] p-6"
            >
              <div className="absolute -right-14 -top-16 h-36 w-36 rounded-full bg-accent-orange/12 blur-3xl" />
              <p className="relative mb-3 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">
                {stat.value}
              </p>
              <p className="relative mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-orange">
                {stat.label}
              </p>
              <p className="relative text-sm leading-relaxed text-white/62">
                {stat.copy}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
