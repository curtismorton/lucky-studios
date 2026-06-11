"use client";

import { motion } from "motion/react";
import { Music, Youtube } from "lucide-react";
import Image from "next/image";
import { type Show } from "@/lib/data/shows";
import { useSpotifyShow } from "@/lib/hooks/useSpotifyShow";
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

interface ShowHeroProps {
  show: Show;
  spotifyShow?: SpotifyShow;
}

export default function ShowHero({ show, spotifyShow: preloadedSpotifyShow }: ShowHeroProps) {
  const genreStyle = genreStyles[show.genre];
  const genreLabel = genreLabels[show.genre];
  const shouldFetchSpotify = !preloadedSpotifyShow && Boolean(show.spotifyShowId);
  const { show: spotifyShow } = useSpotifyShow(
    shouldFetchSpotify ? show.spotifyShowId : undefined
  );
  const resolvedSpotifyShow = preloadedSpotifyShow || spotifyShow;
  const coverImage = resolvedSpotifyShow?.images?.[0]?.url;
  const primaryPlatformHref =
    show.platforms?.spotify || show.platforms?.youtube || show.platforms?.apple;

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Artwork - Spotify cover art or placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-square w-full overflow-hidden rounded-3xl"
        >
          {coverImage ? (
            <>
              <Image
                src={coverImage}
                alt=""
                fill
                aria-hidden="true"
                className="scale-110 object-cover opacity-30 blur-2xl saturate-150"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
              <div className="absolute inset-5 overflow-hidden rounded-2xl border border-white/10 bg-black/45 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:inset-8">
                <Image
                  src={coverImage}
                  alt={show.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) calc(100vw - 64px), 44vw"
                  priority
                />
              </div>
            </>
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${
                show.featured
                  ? "from-accent-orange/30 via-accent-purple/30 to-accent-cyan/30"
                  : genreStyle.bg
              }`}
            />
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          {/* Genre Badge */}
          <div className="mb-4">
            <span
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
            >
              {genreLabel}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl lg:text-6xl">
            {show.title}
          </h1>

          {/* Stat */}
          <p className="mb-4 font-body text-lg text-text-secondary">
            {show.tagline}
          </p>
          <p className="mb-8 font-body text-lg text-text-secondary">
            {show.stat}
          </p>

          {/* Platform Buttons */}
          {show.platforms && (
            <div className="mb-8 flex flex-wrap gap-4">
              {show.platforms.spotify && (
                <motion.a
                  href={show.platforms.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-background-tertiary bg-background-secondary/50 px-6 py-3 font-body text-sm font-medium text-white transition-all duration-300 hover:border-accent-orange/50 hover:bg-accent-orange/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Music className="h-5 w-5" />
                  Spotify
                </motion.a>
              )}
              {show.platforms.apple && (
                <motion.a
                  href={show.platforms.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-background-tertiary bg-background-secondary/50 px-6 py-3 font-body text-sm font-medium text-white transition-all duration-300 hover:border-accent-orange/50 hover:bg-accent-orange/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Music className="h-5 w-5" />
                  Apple Podcasts
                </motion.a>
              )}
              {show.platforms.youtube && (
                <motion.a
                  href={show.platforms.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-background-tertiary bg-background-secondary/50 px-6 py-3 font-body text-sm font-medium text-white transition-all duration-300 hover:border-accent-orange/50 hover:bg-accent-orange/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Youtube className="h-5 w-5" />
                  YouTube
                </motion.a>
              )}
            </div>
          )}

          {/* Subscribe CTA */}
          <motion.a
            href={primaryPlatformHref || "/contact"}
            target={primaryPlatformHref ? "_blank" : undefined}
            rel={primaryPlatformHref ? "noopener noreferrer" : undefined}
            className="inline-flex w-fit rounded-full bg-accent-orange px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-orange"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {primaryPlatformHref ? "Listen to the Show" : "Ask About This Show"}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
