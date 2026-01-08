"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { type Episode } from "@/lib/data/shows";
import { type Show } from "@/lib/data/shows";
import { useSpotifyShow } from "@/lib/hooks/useSpotifyShow";
import { formatDuration } from "@/lib/services/spotify";

interface ShowEpisodesProps {
  episodes?: Episode[]; // Fallback episodes from static data
  show: Show; // Show object to get Spotify ID
}

export default function ShowEpisodes({ episodes: fallbackEpisodes, show }: ShowEpisodesProps) {
  const { episodes: spotifyEpisodes, loading } = useSpotifyShow(show.spotifyShowId);
  
  // Use Spotify episodes if available, otherwise fall back to static episodes
  const episodes = spotifyEpisodes.length > 0 
    ? spotifyEpisodes.map((ep, index) => ({
        number: ep.episode_number ?? index + 1,
        title: ep.name,
        duration: formatDuration(ep.duration_ms),
        date: ep.release_date,
        spotifyUrl: ep.external_urls.spotify,
      }))
    : fallbackEpisodes || [];

  if (loading && !fallbackEpisodes?.length) {
    return (
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center text-text-secondary">Loading episodes...</div>
      </section>
    );
  }

  if (episodes.length === 0) {
    return null;
  }

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-12 font-heading text-3xl font-bold md:text-4xl">
          Latest Episodes
        </h2>
        <div className="space-y-4">
          {episodes.map((episode, index) => (
            <motion.div
              key={episode.number ?? index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex items-center gap-4 rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 transition-all duration-300 hover:border-accent-orange/50 hover:bg-background-tertiary"
            >
              {/* Play Button */}
              <motion.a
                href={(episode as any).spotifyUrl || show.platforms?.spotify || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent-orange/10 text-accent-orange transition-all duration-300 group-hover:bg-accent-orange group-hover:text-white group-hover:glow-orange"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play className="h-5 w-5" fill="currentColor" />
              </motion.a>

              {/* Episode Info */}
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <span className="font-body text-xs font-medium text-text-muted">
                    Episode {episode.number}
                  </span>
                  <span className="font-body text-xs text-text-muted">
                    {episode.duration}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">
                  {episode.title}
                </h3>
                <p className="font-body text-sm text-text-secondary">
                  {new Date(episode.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

