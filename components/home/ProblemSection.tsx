"use client";

import { motion } from "motion/react";

const problems = [
  {
    title: "No repeatable format",
    copy: "A show needs structure, segments and reasons to return, not just a camera pointed at a sofa.",
  },
  {
    title: "No platform packaging",
    copy: "Great moments get missed when titles, thumbnails, clips and social hooks are treated as afterthoughts.",
  },
  {
    title: "No growth system",
    copy: "Audience behaviour, retention and clip performance need to shape the next recording, not sit in a report no one reads.",
  },
] as const;

export default function ProblemSection() {
  return (
    <section className="relative px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl border-t border-white/10 pt-14 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
              The difference
            </p>
            <h2 className="max-w-3xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Most podcasts are built around the recording. We build around the
              audience.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Most shows fail because they stop at production. No repeatable
              format. No clip strategy. No visual system. No distribution
              rhythm. No reason for people to come back. Lucky Studios builds
              the full content ecosystem from day one.
            </p>
          </motion.div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {problems.map((problem, index) => (
              <motion.article
                key={problem.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="flex gap-5 py-7"
              >
                <span className="pt-1 font-heading text-sm font-semibold text-accent-orange">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="mb-2 font-heading text-xl font-semibold text-white">
                    {problem.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/62 sm:text-base">
                    {problem.copy}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
