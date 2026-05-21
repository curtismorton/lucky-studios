/**
 * Spotify API Service
 * Fetches podcast show data from Spotify Web API
 */

export interface SpotifyShow {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  publisher: string;
  total_episodes: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  release_date: string;
  duration_ms: number;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
  episode_number?: number;
}

export interface SpotifyShowResponse {
  show: SpotifyShow;
  episodes: SpotifyEpisode[];
}

export type SpotifyShowsMap = Record<string, SpotifyShow | null>;

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;
let inflightTokenRequest: Promise<string> | null = null;

function getSpotifyMarket(): string {
  const market = process.env.SPOTIFY_MARKET;
  return market && market.trim().length > 0 ? market.trim().toUpperCase() : "GB";
}

export function isSpotifyConfigured(): boolean {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET
  );
}

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.accessToken;
  }

  if (inflightTokenRequest) {
    return inflightTokenRequest;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured");
  }

  inflightTokenRequest = (async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify access token: ${response.statusText}`);
    }

    const data = await response.json();
    const accessToken = data.access_token as string;
    const expiresIn = Number(data.expires_in || 3600);

    tokenCache = {
      accessToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    return accessToken;
  })();

  try {
    return await inflightTokenRequest;
  } finally {
    inflightTokenRequest = null;
  }
}

/**
 * Fetch Spotify show data by show ID
 */
export async function getSpotifyShow(showId: string): Promise<SpotifyShow> {
  const accessToken = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/shows/${showId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Spotify show not found: ${showId}`);
    }
    throw new Error(`Failed to fetch Spotify show: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch multiple Spotify shows and return a map keyed by show ID.
 * Failed IDs are returned as null to keep the response stable.
 */
export async function getSpotifyShows(showIds: string[]): Promise<SpotifyShowsMap> {
  const uniqueIds = Array.from(
    new Set(
      showIds
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
    )
  );

  if (uniqueIds.length === 0) {
    return {};
  }

  const results = await Promise.all(
    uniqueIds.map(async (showId) => {
      try {
        const show = await getSpotifyShow(showId);
        return [showId, show] as const;
      } catch {
        return [showId, null] as const;
      }
    })
  );

  return Object.fromEntries(results);
}

/**
 * Fetch latest episodes for a Spotify show
 */
export async function getSpotifyEpisodes(
  showId: string,
  limit: number = 10
): Promise<SpotifyEpisode[]> {
  const accessToken = await getAccessToken();
  const market = getSpotifyMarket();

  const response = await fetch(
    `https://api.spotify.com/v1/shows/${showId}/episodes?limit=${limit}&market=${market}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Spotify episodes: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Get complete show data including episodes
 */
export async function getSpotifyShowData(
  showId: string,
  episodeLimit: number = 10
): Promise<SpotifyShowResponse> {
  const [show, episodes] = await Promise.all([
    getSpotifyShow(showId),
    getSpotifyEpisodes(showId, episodeLimit),
  ]);

  return {
    show,
    episodes,
  };
}

// formatDuration has been moved to lib/utils/duration.ts to avoid bundling server-only code in client components
