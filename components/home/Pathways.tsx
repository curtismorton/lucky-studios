"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const pathways = [
  {
    title: "For Creators",
    headline: "You bring the audience. We build the show around it.",
    href: "/contact?intent=creator",
    cta: "Build my show",
    items: [
      "Creators ready to move beyond short form.",
      "Talent with strong opinions, chemistry or a loyal community.",
      "Creators who want production, structure and growth support.",
      "Personalities who need a format brands can buy into.",
    ],
  },
  {
    title: "For Brands",
    headline: "You bring the objective. We build the content property.",
    href: "/contact?intent=brand",
    cta: "Create a branded show",
    items: [
      "Brands that want recurring content, not one off campaigns.",
      "Agencies building creator led content formats.",
      "Rights holders and publishers launching original shows.",
      "Brands that want entertainment, not adverts in disguise.",
    ],
  },
  {
    title: "For Agencies and Platforms",
    headline: "You bring the brief. We build the format that travels.",
    href: "/contact?intent=agency",
    cta: "Partner with Lucky",
    items: [
      "Campaign extensions.",
      "Talent led content series.",
      "Social first show formats.",
      "Sponsored editorial formats.",
    ],
  },
] as const;

export default function Pathways() {
  return (
    <section className="relative px-4 py-16 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Who we work with
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
            Different starting points. One studio system built to turn ideas
            into shows people remember.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pathways.map((pathway, index) => (
            <motion.article
              key={pathway.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-accent-orange/35 sm:p-8"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent-orange">
                {pathway.title}
              </p>
              <h3 className="mb-8 font-heading text-2xl font-semibold leading-tight text-white">
                {pathway.headline}
              </h3>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Best for
              </p>
              <ul className="mb-9 space-y-3 text-sm leading-relaxed text-white/65">
                {pathway.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-orange" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={pathway.href}
                className="group mt-auto inline-flex min-h-[48px] items-center gap-2 font-heading text-sm font-semibold text-white transition hover:text-accent-orange focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
              >
                {pathway.cta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
