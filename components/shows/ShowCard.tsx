"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";
import { type Show } from "@/lib/data/shows";
import { cardHover } from "@/lib/animations";

const genreStyles = {
  entertainment: {
    bg: "bg-accent-orange/10",
    text: "text-accent-orange",
    border: "border-accent-orange/30",
  },
  football: {
    bg: "bg-accent-purple/10",
    text: "text-accent-purple",
    border: "border-accent-purple/30",
  },
  lifestyle: {
    bg: "bg-accent-cyan/10",
    text: "text-accent-cyan",
    border: "border-accent-cyan/30",
  },
};

interface ShowCardProps {
  show: Show;
  index?: number;
  featured?: boolean;
}

export default function ShowCard({ show, index = 0, featured = false }: ShowCardProps) {
  const genreStyle = genreStyles[show.genre];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Link href={`/shows/${show.slug}`}>
        <motion.div
          className={`group relative overflow-hidden rounded-2xl border ${
            featured
              ? "border-accent-orange/50 bg-gradient-to-br from-background-secondary to-background-tertiary"
              : "border-background-tertiary bg-background-secondary/50"
          } backdrop-blur-sm transition-all duration-300 ${
            featured ? "hover:glow-orange" : ""
          }`}
          whileHover={cardHover}
        >
          {/* Thumbnail Placeholder */}
          <div className="relative aspect-video w-full overflow-hidden">
            <div
              className={`h-full w-full bg-gradient-to-br ${
                featured
                  ? "from-accent-orange/20 via-accent-purple/20 to-accent-cyan/20"
                  : genreStyle.bg
              }`}
            />
            
            {/* Play Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play className="h-8 w-8 text-white" fill="white" />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
              >
                {show.tagline}
              </span>
              {featured && (
                <span className="text-xs font-medium text-accent-orange">
                  Featured
                </span>
              )}
            </div>
            <h3 className="mb-2 font-heading text-xl font-semibold text-white md:text-2xl">
              {show.title}
            </h3>
            <p className="font-body text-sm text-text-secondary">
              {show.stat}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

