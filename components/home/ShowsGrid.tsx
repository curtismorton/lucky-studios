"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShowCard from "@/components/shows/ShowCard";
import { type Show } from "@/lib/data/shows";
import { buttonHover, buttonTap } from "@/lib/animations";
import { useSpotifyShows } from "@/lib/hooks/useSpotifyShows";

export default function ShowsGrid({ shows }: { shows: Show[] }) {
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
  const spotifyIds = shows
    .map((show) => show.spotifyShowId)
    .filter((id): id is string => Boolean(id));
  const { showsById } = useSpotifyShows(spotifyIds);
  const featuredShows = shows.filter(
    (show) =>
      show.slug === "behind-the-screens" ||
      show.slug === "back-post" ||
      show.slug === "abby-boom"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center sm:mb-16"
          >
            <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
              The Network
            </p>
            <h2 className="mx-auto max-w-4xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
              Shows with faces, formats, and reasons to keep watching.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl font-body text-lg leading-relaxed text-text-secondary">
              Full covers, clear positions, and personalities that can travel
              from long-form episodes to short-form clips.
            </p>
          </motion.div>

          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {featuredShows.map((show, index) => (
              <ShowCard
                key={show.id}
                show={show}
                index={index}
                featured={show.featured}
                spotifyShow={show.spotifyShowId ? showsById[show.spotifyShowId] : null}
              />
            ))}
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
                See the Network
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
