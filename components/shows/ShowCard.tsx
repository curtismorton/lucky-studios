"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { type Show } from "@/lib/data/shows";
import { cardHover } from "@/lib/animations";
import { useSpotifyShow } from "@/lib/hooks/useSpotifyShow";
import TiltCard from "@/components/ui/TiltCard";
import { type SpotifyShow } from "@/lib/services/spotify";

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
  spotifyShow?: SpotifyShow | null;
  className?: string;
}

export default function ShowCard({
  show,
  index = 0,
  featured = false,
  spotifyShow: preloadedSpotifyShow,
  className = "",
}: ShowCardProps) {
  const genreStyle = genreStyles[show.genre];
  const genreLabel = genreLabels[show.genre];
  const shouldFetchSpotify = !preloadedSpotifyShow && Boolean(show.spotifyShowId);
  const { show: spotifyShow } = useSpotifyShow(
    shouldFetchSpotify ? show.spotifyShowId : undefined
  );
  const resolvedSpotifyShow = preloadedSpotifyShow || spotifyShow;
  const coverImage = resolvedSpotifyShow?.images?.[0]?.url;
  const teaser = show.teaser ?? show.tagline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className={className}
    >
      <Link href={`/shows/${show.slug}`}>
        <TiltCard
          className={`group relative overflow-hidden rounded-xl border ${
            featured
              ? "border-accent-orange/60 bg-[linear-gradient(145deg,rgba(245,158,11,0.16),rgba(24,24,27,0.96)_42%,rgba(6,182,212,0.1))]"
              : "border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(24,24,27,0.9)_48%,rgba(255,255,255,0.03))]"
          } shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xs transition-all duration-300 ${
            featured ? "hover:glow-orange" : ""
          }`}
          whileHover={cardHover}
          glowClassName="rounded-xl mix-blend-screen"
        >
          {/* Thumbnail - Spotify cover art or placeholder */}
          <div className="relative aspect-square w-full overflow-hidden bg-black/30 p-3">
            {coverImage ? (
              <>
                <Image
                  src={coverImage}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="scale-110 object-cover opacity-25 blur-xl saturate-150"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/20 to-black/60" />
                <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl">
                  <Image
                    src={coverImage}
                    alt={show.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 88vw, (max-width: 1200px) 42vw, 24vw"
                  />
                </div>
              </>
            ) : (
              <div
                className={`h-full w-full rounded-lg border border-white/10 bg-linear-to-br ${
                  featured
                    ? "from-accent-orange/20 via-accent-purple/20 to-accent-cyan/20"
                    : genreStyle.bg
                }`}
              />
            )}
            
            {/* Play Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-[0_0_40px_rgba(255,255,255,0.22)] backdrop-blur-xs"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play className="h-8 w-8 text-white" fill="white" />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
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
            <h3 className="mb-2 font-heading text-xl font-semibold leading-tight text-white md:text-2xl">
              {show.title}
            </h3>
            <p className="mb-3 font-body text-sm text-text-secondary">
              {show.tagline}
            </p>
            <p className="font-body text-sm font-medium text-white/80">
              {show.stat}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 font-body text-sm font-semibold text-accent-orange">
              View Show
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                -&gt;
              </span>
            </div>
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
