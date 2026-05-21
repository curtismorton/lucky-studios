"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { shows } from "@/lib/data/shows";
import { useSpotifyShows } from "@/lib/hooks/useSpotifyShows";

export default function FeaturedShowCard() {
  // Get Back Post as featured show
  const featuredShow = shows.find((show) => show.slug === "back-post");
  const { showsById } = useSpotifyShows(
    featuredShow?.spotifyShowId ? [featuredShow.spotifyShowId] : []
  );
  const spotifyShow = featuredShow?.spotifyShowId
    ? showsById[featuredShow.spotifyShowId]
    : null;
  const fallbackCoverImage = "/images/hero/hero-2171-copy.jpg";
  const spotifyCoverImage = spotifyShow?.images?.[0]?.url;
  const [coverImage, setCoverImage] = useState(
    spotifyCoverImage || fallbackCoverImage
  );

  useEffect(() => {
    setCoverImage(spotifyCoverImage || fallbackCoverImage);
  }, [spotifyCoverImage]);

  if (!featuredShow) return null;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative"
    >
      <div className="absolute -inset-1 rounded-[1.8rem] bg-gradient-to-r from-accent-amber/30 via-accent-gold/15 to-accent-amber/10 blur-md" />
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background-secondary/86 p-6 shadow-2xl backdrop-blur-xl md:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.15)_0%,transparent_45%)]" />
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-accent-amber to-accent-gold" />

        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-amber/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-amber">
          <Star className="h-3 w-3 fill-current" />
          Featured Show
        </div>

        <div className="mb-6 flex gap-5">
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-xl md:h-36 md:w-36">
            <Image
              src={coverImage}
              alt={featuredShow.title}
              fill
              className="object-cover"
              sizes="144px"
              onError={() => setCoverImage(fallbackCoverImage)}
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <h3 className="mb-2 truncate font-heading text-2xl font-bold">
              <Link
                href={`/shows/${featuredShow.slug}`}
                className="transition-colors hover:text-accent-amber"
              >
                {featuredShow.title}
              </Link>
            </h3>
            <p className="line-clamp-4 font-body text-sm leading-relaxed text-text-secondary">
              {featuredShow.description || featuredShow.tagline}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          <div className="text-center">
            <div className="mb-1 font-heading text-2xl font-bold text-accent-amber">
              #10
            </div>
            <div className="text-xs uppercase tracking-wider text-text-muted">
              Spotify Football
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 font-heading text-2xl font-bold text-accent-amber">
              2.78M
            </div>
            <div className="text-xs uppercase tracking-wider text-text-muted">
              TikTok Views
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 font-heading text-2xl font-bold text-accent-amber">
              8
            </div>
            <div className="text-xs uppercase tracking-wider text-text-muted">
              Weeks Live
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
