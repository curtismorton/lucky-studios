"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { type Episode } from "@/lib/data/shows";

interface ShowEpisodesProps {
  episodes: Episode[];
}

export default function ShowEpisodes({ episodes }: ShowEpisodesProps) {
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
              key={episode.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex items-center gap-4 rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 transition-all duration-300 hover:border-accent-orange/50 hover:bg-background-tertiary"
            >
              {/* Play Button */}
              <motion.button
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent-orange/10 text-accent-orange transition-all duration-300 group-hover:bg-accent-orange group-hover:text-white group-hover:glow-orange"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play className="h-5 w-5" fill="currentColor" />
              </motion.button>

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

