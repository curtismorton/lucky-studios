"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Show } from "@/lib/data/shows";
import ShowCard from "@/components/shows/ShowCard";
import { useSpotifyShows } from "@/lib/hooks/useSpotifyShows";

type Category = "all" | "entertainment" | "football" | "lifestyle";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "entertainment", label: "Entertainment" },
  { id: "football", label: "Football" },
  { id: "lifestyle", label: "Lifestyle" },
];

export default function ShowsPageClient({ shows }: { shows: Show[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const spotifyIds = shows
    .map((show) => show.spotifyShowId)
    .filter((id): id is string => Boolean(id));
  const { showsById } = useSpotifyShows(spotifyIds);

  const filteredShows =
    selectedCategory === "all"
      ? shows
      : shows.filter((show) => show.genre === selectedCategory);

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-4 top-24 h-64 rounded-[48px] bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.26),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] opacity-80 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            Lucky Studios Network
          </p>
          <h1 className="mx-auto mb-5 max-w-4xl font-heading text-4xl font-bold leading-none text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Shows that look as sharp as they sound
          </h1>
          <p className="mx-auto max-w-2xl font-body text-base text-text-secondary sm:text-lg md:text-xl">
            Original formats, polished covers, and creator-led series built for repeat listening.
          </p>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-20 z-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-full border border-white/10 bg-black/35 backdrop-blur-md">
          <div className="flex justify-center overflow-x-auto px-4">
            <div className="flex gap-1">
              {categories.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative flex min-h-[44px] touch-manipulation items-center rounded-full px-4 py-3 font-body text-sm font-medium transition-colors sm:px-6 ${
                      isActive ? "text-background" : "text-text-secondary hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-1 rounded-full bg-accent-orange"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Shows Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredShows.map((show, index) => (
              <ShowCard
                key={show.id}
                show={show}
                index={index}
                featured={show.featured}
                spotifyShow={show.spotifyShowId ? showsById[show.spotifyShowId] : null}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredShows.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <p className="font-body text-lg text-text-secondary">
              No shows found in this category.
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
