"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { type Show } from "@/lib/data/shows";
import { cardHover } from "@/lib/animations";
import { useSpotifyShow } from "@/lib/hooks/useSpotifyShow";
import TiltCard from "@/components/ui/TiltCard";

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

const genreLabels = {
  entertainment: "Entertainment",
  football: "Football",
  lifestyle: "Lifestyle",
};

interface ShowCardProps {
  show: Show;
  index?: number;
  featured?: boolean;
}

export default function ShowCard({ show, index = 0, featured = false }: ShowCardProps) {
  const genreStyle = genreStyles[show.genre];
  const genreLabel = genreLabels[show.genre];
  const { show: spotifyShow } = useSpotifyShow(show.spotifyShowId);
  const coverImage = spotifyShow?.images?.[0]?.url;
  const teaser = show.teaser ?? show.tagline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Link href={`/shows/${show.slug}`}>
        <TiltCard
          className={`group relative overflow-hidden rounded-2xl border ${
            featured
              ? "border-accent-orange/50 bg-gradient-to-br from-background-secondary to-background-tertiary"
              : "border-background-tertiary bg-background-secondary/50"
          } backdrop-blur-sm transition-all duration-300 ${
            featured ? "hover:glow-orange" : ""
          }`}
          whileHover={cardHover}
          glowClassName="rounded-2xl mix-blend-screen"
        >
          {/* Thumbnail - Spotify cover art or placeholder */}
          <div className="relative aspect-video w-full overflow-hidden">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={show.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div
                className={`h-full w-full bg-gradient-to-br ${
                  featured
                    ? "from-accent-orange/20 via-accent-purple/20 to-accent-cyan/20"
                    : genreStyle.bg
                }`}
              />
            )}
            
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
                {genreLabel}
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
            <p className="mb-3 font-body text-sm text-text-secondary">
              {show.tagline}
            </p>
            <p className="font-body text-sm text-text-secondary">
              {show.stat}
            </p>
            <div className="mt-4 overflow-hidden">
              <div className="max-h-0 translate-y-2 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="mb-3 font-body text-sm text-text-secondary">
                  {teaser}
                </p>
                <div className="relative h-1.5 w-full overflow-visible rounded-full bg-white/10">
                  <div className="absolute left-0 top-0 h-full w-0 rounded-full bg-gradient-accent transition-all duration-700 group-hover:w-[75%]" />
                  <div className="absolute -top-1 left-0 h-3 w-3 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all duration-700 group-hover:left-[75%]" />
                </div>
              </div>
            </div>
          </div>
        </TiltCard>
      </Link>
    </motion.div>
  );
}
