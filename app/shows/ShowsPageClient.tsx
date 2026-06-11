"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-4 top-24 h-72 rounded-[48px] bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.3),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.2),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] opacity-80 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
                Lucky Studios Network
              </p>
              <h1 className="max-w-4xl font-heading text-4xl font-bold leading-none text-white sm:text-5xl md:text-6xl lg:text-7xl">
                The shows we are turning into repeatable media.
              </h1>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
              <p className="font-body text-base leading-relaxed text-text-secondary sm:text-lg">
                Original formats, polished covers, sponsor-ready positioning,
                and creator-led series built to generate episodes, clips, and
                campaign assets from one production pipeline.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <p className="font-heading text-xl font-bold text-white">3</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wider text-text-muted">
                    Live Formats
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <p className="font-heading text-xl font-bold text-white">10M+</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wider text-text-muted">
                    Season Views
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <p className="font-heading text-xl font-bold text-white">1</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wider text-text-muted">
                    Studio System
                  </p>
                </div>
              </div>
            </div>
          </div>
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
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredShows.map((show, index) => (
              <ShowCard
                key={show.id}
                show={show}
                index={index}
                featured={show.featured}
                spotifyShow={show.spotifyShowId ? showsById[show.spotifyShowId] : null}
                className={show.featured ? "lg:col-span-2" : ""}
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
