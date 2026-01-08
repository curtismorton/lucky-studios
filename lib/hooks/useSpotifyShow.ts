"use client";

import { useEffect, useState } from "react";
import type { SpotifyShow, SpotifyEpisode } from "@/lib/services/spotify";

interface UseSpotifyShowResult {
  show: SpotifyShow | null;
  episodes: SpotifyEpisode[];
  loading: boolean;
  error: string | null;
}

export function useSpotifyShow(showId: string | undefined): UseSpotifyShowResult {
  const [show, setShow] = useState<SpotifyShow | null>(null);
  const [episodes, setEpisodes] = useState<SpotifyEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/spotify/show/${showId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Spotify data: ${response.statusText}`);
        }

        const data = await response.json();
        setShow(data.show);
        setEpisodes(data.episodes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch Spotify data");
        console.error("Error fetching Spotify show:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [showId]);

  return { show, episodes, loading, error };
}

