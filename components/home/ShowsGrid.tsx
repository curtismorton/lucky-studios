"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
    show.slug === "abby-boom"
);

// Add Coming Soon placeholder
const comingSoonShow = shows.find((show) => show.slug === "coming-soon");

export default function ShowsGrid() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scanlineY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const clipTop = useTransform(scrollYProgress, [0, 0.2], ["100%", "0%"]);
  const clipBottom = useTransform(scrollYProgress, [0.8, 1], ["0%", "100%"]);
  const clipPath = useTransform(
    [clipTop, clipBottom],
    ([top, bottom]) => `inset(${top} 0% ${bottom} 0%)`
  );

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-24 md:py-32">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-tech-grid opacity-15"
        style={{ y: gridY }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-scanlines opacity-10"
        style={{ y: scanlineY }}
      />
      <motion.div style={{ clipPath }} className="relative">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center font-heading text-3xl font-bold sm:mb-16 sm:text-4xl md:text-5xl"
          >
            Our{" "}
            <span className="text-gradient-accent">Shows</span>
          </motion.h2>

          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
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
      </motion.div>
    </section>
  );
}
