"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { shows } from "@/lib/data/shows";
import { useSpotifyShow } from "@/lib/hooks/useSpotifyShow";

export default function FeaturedShowCard() {
  // Get Back Post as featured show
  const featuredShow = shows.find((show) => show.slug === "back-post");
  const { show: spotifyShow } = useSpotifyShow(featuredShow?.spotifyShowId);

  if (!featuredShow) return null;

  const coverImage = spotifyShow?.images?.[0]?.url || "/images/COVER-ART__1_.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-3xl border border-background-tertiary/50 bg-background-secondary/90 backdrop-blur-xl p-6 shadow-2xl">
        {/* Gold top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-amber to-accent-gold" />
        
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-amber/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-amber">
          <Star className="h-3 w-3 fill-current" />
          Featured Show
        </div>

        {/* Show Info */}
        <div className="mb-6 flex gap-6">
          <div className="relative h-36 w-36 flex-shrink-0 overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={coverImage}
              alt={featuredShow.title}
              fill
              className="object-cover"
              sizes="144px"
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="mb-2 font-heading text-2xl font-bold">
              {featuredShow.title}
            </h3>
            <p className="font-body text-sm leading-relaxed text-text-secondary">
              {featuredShow.description || featuredShow.tagline}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 border-t border-background-tertiary/50 pt-6">
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

