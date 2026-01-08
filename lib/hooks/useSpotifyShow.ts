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
  // Initialize loading to false if no showId, true if showId exists
  const [loading, setLoading] = useState(!!showId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showId) {
      setLoading(false);
      return;
    }

    // Create AbortController for this request
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/spotify/show/${showId}`, {
          signal, // Pass signal to fetch for cancellation
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Spotify data: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Only update state if request wasn't aborted
        if (!signal.aborted) {
          setShow(data.show);
          setEpisodes(data.episodes || []);
        }
      } catch (err) {
        // Don't update state or log error if request was aborted
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Silently ignore aborted requests
        }
        
        // Only update error state if request wasn't aborted
        if (!signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to fetch Spotify data");
          console.error("Error fetching Spotify show:", err);
        }
      } finally {
        // Only update loading state if request wasn't aborted
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // Cleanup: abort the request if showId changes or component unmounts
    return () => {
      abortController.abort();
    };
  }, [showId]);

  return { show, episodes, loading, error };
}

