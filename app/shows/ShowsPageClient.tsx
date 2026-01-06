"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shows, type Show } from "@/lib/data/shows";
import ShowCard from "@/components/shows/ShowCard";

type Category = "all" | "entertainment" | "football" | "lifestyle";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "entertainment", label: "Entertainment" },
  { id: "football", label: "Football" },
  { id: "lifestyle", label: "Lifestyle" },
];

export default function ShowsPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filteredShows =
    selectedCategory === "all"
      ? shows
      : shows.filter((show) => show.genre === selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="mb-4 font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Our <span className="text-gradient-accent">Shows</span>
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-text-secondary">
            Original content reaching millions
          </p>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-20 z-40 mx-auto max-w-7xl border-b border-background-tertiary bg-background/80 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex justify-center overflow-x-auto px-4">
          <div className="flex gap-1">
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="relative px-4 sm:px-6 py-3 sm:py-4 font-body text-sm font-medium text-text-secondary transition-colors hover:text-white touch-manipulation min-h-[44px] flex items-center"
                >
                  {category.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-orange"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shows Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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

