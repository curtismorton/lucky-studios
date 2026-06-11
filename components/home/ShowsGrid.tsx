"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Show } from "@/lib/data/shows";

const showCopy: Record<
  string,
  { category: string; description: string; role: string; image: string }
> = {
  "behind-the-screens": {
    category: "Creator culture",
    description:
      "Unfiltered creator conversations built around personality, chaos and stories they never post.",
    role: "Format development, studio production, packaging and social distribution.",
    image: "/images/hero/hero-1980.jpg",
  },
  "back-post": {
    category: "Football",
    description:
      "Fan led football debate, live reactions and weekly moments built for clips.",
    role: "Show development, production workflow, live content and platform packaging.",
    image: "/images/hero/hero-2771-3.jpg",
  },
  "abby-boom": {
    category: "Entertainment",
    description:
      "Personality led conversation built around strong opinions, viral moments and reactive clips.",
    role: "Production, guest packaging, social cutdowns and format support.",
    image: "/images/hero/hero-2104-copy.jpg",
  },
};

const showOrder = ["behind-the-screens", "back-post", "abby-boom"];

export default function ShowsGrid({ shows }: { shows: Show[] }) {
  const featuredShows = showOrder
    .map((slug) => shows.find((show) => show.slug === slug))
    .filter((show): show is Show => Boolean(show));

  return (
    <section className="relative px-4 py-16 sm:px-6 md:py-28 lg:px-8" id="network">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-4xl md:mb-14"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            The network
          </p>
          <h2 className="mb-5 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            Shows built for repeat viewing
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Original formats with clear identities, repeatable moments and
            platform first packaging.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredShows.map((show, index) => {
            const content = showCopy[show.slug];

            return (
              <motion.article
                key={show.slug}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"
              >
                <Link
                  href={`/shows/${show.slug}`}
                  className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
                >
                  <div className="relative aspect-[1.08] overflow-hidden bg-black">
                    <Image
                      src={content.image}
                      alt={`${show.title} cover`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full border border-accent-orange/30 bg-black/50 px-3 py-1.5 text-xs font-medium text-accent-orange backdrop-blur-sm">
                      {content.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 font-heading text-2xl font-semibold text-white">
                      {show.title}
                    </h3>
                    <p className="mb-6 min-h-[72px] text-sm leading-relaxed text-white/65 sm:text-base">
                      {content.description}
                    </p>
                    <div className="mb-6 border-t border-white/10 pt-5">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-orange">
                        Lucky role
                      </p>
                      <p className="text-sm leading-relaxed text-white/62">
                        {content.role}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-white transition-colors group-hover:text-accent-orange">
                      View show
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/shows"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/15 px-7 py-3 font-heading text-sm font-semibold text-white transition hover:border-accent-orange/45 hover:text-accent-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
          >
            See the network
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
