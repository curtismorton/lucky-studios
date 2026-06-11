"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const cases = [
  {
    name: "Back Post",
    href: "/shows/back-post",
    image: "/images/hero/hero-2771-3.jpg",
    title: "Football emotion built for live moments and weekly debate.",
    challenge:
      "Build a football format that could work across full episodes, live watchalongs and short form clips.",
    format:
      "Supporter led debate, live match emotion and weekly football arguments with built in shareability.",
    system:
      "Recurring shows, reactive clips, social first packaging, live moments and platform specific distribution.",
    reason:
      "Chemistry, topical speed, emotional football arguments and repeatable content moments.",
  },
  {
    name: "Don't Get Me Started",
    href: "/shows/abby-boom",
    image: "/images/hero/hero-2104-copy.jpg",
    title: "Personality led conversation designed for reactive clips.",
    challenge:
      "Build a personality led show that could turn strong opinions into repeatable entertainment.",
    format:
      "Guest led chaos, reactive topics and clips designed around conversation spikes.",
    system:
      "Studio production, social first editing, thumbnail packaging and repeatable segment design.",
    reason:
      "Clear talent identity, high energy format and short form friendly moments.",
  },
] as const;

export default function CaseStudies() {
  return (
    <section className="relative px-4 py-16 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-4xl"
        >
          <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            How we build shows
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
            Two formats, two different audiences, one repeatable production and
            packaging system.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          {cases.map((caseStudy, index) => (
            <motion.article
              key={caseStudy.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(12,12,13,0.65))]"
            >
              <div className="relative aspect-[2/1] overflow-hidden">
                <Image
                  src={caseStudy.image}
                  alt={`${caseStudy.name} studio production`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/18 to-transparent" />
                <p className="absolute bottom-5 left-6 text-xs font-semibold uppercase tracking-[0.25em] text-accent-orange sm:left-8">
                  {caseStudy.name}
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="mb-8 font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  {caseStudy.title}
                </h3>
                <dl className="space-y-6">
                <div>
                  <dt className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-orange">
                    The challenge
                  </dt>
                  <dd className="text-sm leading-relaxed text-white/67 sm:text-base">
                    {caseStudy.challenge}
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-orange">
                    The format
                  </dt>
                  <dd className="text-sm leading-relaxed text-white/67 sm:text-base">
                    {caseStudy.format}
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-orange">
                    The system
                  </dt>
                  <dd className="text-sm leading-relaxed text-white/67 sm:text-base">
                    {caseStudy.system}
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-orange">
                    Why it worked
                  </dt>
                  <dd className="text-sm leading-relaxed text-white/67 sm:text-base">
                    {caseStudy.reason}
                  </dd>
                </div>
                </dl>
                <Link
                  href={caseStudy.href}
                  className="mt-8 inline-flex min-h-[44px] items-center border-b border-accent-orange/50 font-heading text-sm font-semibold text-white transition hover:text-accent-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
                >
                  View show
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
