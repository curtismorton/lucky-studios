"use client";

import { motion } from "framer-motion";
import { TrendingUp, Eye, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { Show } from "@/lib/data/shows";

interface ShowAnalytics {
  totalViews: number;
  totalEpisodes: number;
  averageViewsPerEpisode: number;
  latestEpisodeViews: number;
  growthRate: number;
  topEpisodes: Array<{
    title: string;
    views: number;
    date: string;
  }>;
  demographics?: {
    ageGroups: Record<string, number>;
    countries: Record<string, number>;
  };
}

interface ShowAnalyticsProps {
  show: Show;
}

export default function ShowAnalytics({ show }: ShowAnalyticsProps) {
  const [analytics, setAnalytics] = useState<ShowAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/analytics/show/${show.slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch analytics: ${response.statusText}`);
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch analytics");
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [show.slug]);

  if (loading) {
    return (
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center text-text-secondary">Loading analytics...</div>
      </section>
    );
  }

  if (error || !analytics) {
    return null; // Don't show analytics section if there's an error or no data
  }

  // Don't show if all values are zero (mock data)
  if (
    analytics.totalViews === 0 &&
    analytics.totalEpisodes === 0 &&
    analytics.topEpisodes.length === 0
  ) {
    return null;
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-12 font-heading text-3xl font-bold md:text-4xl">
          Analytics
        </h2>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6"
          >
            <div className="mb-2 flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent-orange" />
              <span className="font-body text-sm text-text-secondary">Total Views</span>
            </div>
            <p className="font-heading text-2xl font-bold text-white">
              {formatNumber(analytics.totalViews)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6"
          >
            <div className="mb-2 flex items-center gap-2">
              <Play className="h-5 w-5 text-accent-purple" />
              <span className="font-body text-sm text-text-secondary">Episodes</span>
            </div>
            <p className="font-heading text-2xl font-bold text-white">
              {analytics.totalEpisodes}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6"
          >
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent-cyan" />
              <span className="font-body text-sm text-text-secondary">Avg. Views</span>
            </div>
            <p className="font-heading text-2xl font-bold text-white">
              {formatNumber(analytics.averageViewsPerEpisode)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6"
          >
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent-orange" />
              <span className="font-body text-sm text-text-secondary">Growth</span>
            </div>
            <p className="font-heading text-2xl font-bold text-white">
              {analytics.growthRate > 0 ? "+" : ""}
              {analytics.growthRate.toFixed(1)}%
            </p>
          </motion.div>
        </div>

        {/* Top Episodes */}
        {analytics.topEpisodes.length > 0 && (
          <div>
            <h3 className="mb-6 font-heading text-2xl font-semibold">
              Top Episodes
            </h3>
            <div className="space-y-4">
              {analytics.topEpisodes.map((episode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6"
                >
                  <div className="flex-1">
                    <h4 className="mb-1 font-heading text-lg font-semibold text-white">
                      {episode.title}
                    </h4>
                    <p className="font-body text-sm text-text-secondary">
                      {new Date(episode.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-heading text-xl font-bold text-accent-orange">
                      {formatNumber(episode.views)}
                    </p>
                    <p className="font-body text-xs text-text-secondary">views</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}

