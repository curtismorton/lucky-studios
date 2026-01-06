"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { shows } from "@/lib/data/shows";
import ShowCard from "@/components/shows/ShowCard";

export default function ShowsGrid() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 md:py-32">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
          Our <span className="text-gradient-accent">Network</span>
        </h2>
        <p className="font-body text-base sm:text-lg text-text-secondary">
          Hit shows reaching millions
        </p>
      </motion.div>

      {/* Shows Grid */}
      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {shows.map((show, index) => (
          <div key={show.id} className={show.featured ? "sm:col-span-2 md:col-span-2" : ""}>
            <ShowCard show={show} index={index} featured={show.featured} />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <Link href="/shows">
          <motion.button
            className="rounded-full border-2 border-accent-orange bg-transparent px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-orange/10 hover:glow-orange touch-manipulation min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Shows
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}

