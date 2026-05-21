"use client";

import { useEffect, useMemo, useState } from "react";
import type { SpotifyShow, SpotifyShowsMap } from "@/lib/services/spotify";

interface UseSpotifyShowsResult {
  showsById: Record<string, SpotifyShow | null>;
  loading: boolean;
  error: string | null;
}

export function useSpotifyShows(showIds: string[]): UseSpotifyShowsResult {
  const idsKey = useMemo(
    () =>
      Array.from(
        new Set(
          showIds
            .map((id) => id.trim())
            .filter((id) => id.length > 0)
        )
      ).join(","),
    [showIds]
  );
  const normalizedIds = useMemo(
    () => (idsKey.length > 0 ? idsKey.split(",") : []),
    [idsKey]
  );

  const [showsById, setShowsById] = useState<Record<string, SpotifyShow | null>>({});
  const [loading, setLoading] = useState(normalizedIds.length > 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (normalizedIds.length === 0) {
      setShowsById({});
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          ids: normalizedIds.join(","),
        });

        const response = await fetch(`/api/spotify/shows?${params.toString()}`, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Spotify shows: ${response.statusText}`);
        }

        const data = (await response.json()) as SpotifyShowsMap;
        if (!signal.aborted) {
          setShowsById(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        if (!signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to fetch Spotify shows");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [idsKey, normalizedIds]);

  return { showsById, loading, error };
}
