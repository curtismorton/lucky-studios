"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShowCard from "@/components/shows/ShowCard";
import { shows } from "@/lib/data/shows";
import { buttonHover, buttonTap } from "@/lib/animations";

// Filter shows to display on homepage
const featuredShows = shows.filter(
  (show) =>
    show.slug === "behind-the-screens" ||
    show.slug === "back-post" ||
    show.slug === "dont-get-me-started"
);

// Add Coming Soon placeholder
const comingSoonShow = shows.find((show) => show.slug === "coming-soon");

export default function ShowsGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center font-heading text-3xl sm:text-4xl font-bold md:text-5xl"
        >
          Our{" "}
          <span className="text-gradient-accent">Shows</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {featuredShows.map((show, index) => (
            <ShowCard
              key={show.id}
              show={show}
              index={index}
              featured={show.featured}
            />
          ))}
          {comingSoonShow && (
            <ShowCard
              show={comingSoonShow}
              index={featuredShows.length}
            />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Link href="/shows">
            <motion.button
              className="group flex items-center gap-2 rounded-full border-2 border-accent-orange bg-transparent px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-orange/10 hover:glow-orange"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              View All Shows
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
