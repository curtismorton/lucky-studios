import "server-only";

export interface ShowAnalytics {
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
}

type EpisodeRow = {
  title: string;
  views: number;
  releaseDate: string | null;
};

const EMPTY_ANALYTICS: ShowAnalytics = {
  totalViews: 0,
  totalEpisodes: 0,
  averageViewsPerEpisode: 0,
  latestEpisodeViews: 0,
  growthRate: 0,
  topEpisodes: [],
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

function headers(serviceRoleKey: string): HeadersInit {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

function sanitizeRows(input: unknown): EpisodeRow[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const candidate = entry as Record<string, unknown>;

      const title =
        typeof candidate.title === "string" && candidate.title.trim().length > 0
          ? candidate.title.trim()
          : "Untitled Episode";

      const rawViews = candidate.views;
      const numericViews =
        typeof rawViews === "number"
          ? rawViews
          : typeof rawViews === "string"
            ? Number(rawViews)
            : 0;

      const releaseDate =
        typeof candidate.release_date === "string" &&
        candidate.release_date.trim().length > 0
          ? candidate.release_date
          : null;

      return {
        title,
        views: Number.isFinite(numericViews) ? Math.max(0, Math.round(numericViews)) : 0,
        releaseDate,
      } satisfies EpisodeRow;
    })
    .filter((entry): entry is EpisodeRow => entry !== null);
}

function sortByDateDesc(rows: EpisodeRow[]): EpisodeRow[] {
  return [...rows].sort((a, b) => {
    const aTime = a.releaseDate ? Date.parse(a.releaseDate) : Number.NEGATIVE_INFINITY;
    const bTime = b.releaseDate ? Date.parse(b.releaseDate) : Number.NEGATIVE_INFINITY;
    return bTime - aTime;
  });
}

function formatTopEpisodes(rows: EpisodeRow[]): ShowAnalytics["topEpisodes"] {
  const fallbackDate = new Date().toISOString().slice(0, 10);
  return [...rows]
    .sort((a, b) => {
      if (b.views !== a.views) return b.views - a.views;
      const aTime = a.releaseDate ? Date.parse(a.releaseDate) : Number.NEGATIVE_INFINITY;
      const bTime = b.releaseDate ? Date.parse(b.releaseDate) : Number.NEGATIVE_INFINITY;
      return bTime - aTime;
    })
    .slice(0, 5)
    .map((row) => ({
      title: row.title,
      views: row.views,
      date: row.releaseDate || fallbackDate,
    }));
}

function computeGrowthRate(rows: EpisodeRow[]): number {
  if (rows.length < 4) return 0;

  const chronological = [...rows].sort((a, b) => {
    const aTime = a.releaseDate ? Date.parse(a.releaseDate) : Number.NEGATIVE_INFINITY;
    const bTime = b.releaseDate ? Date.parse(b.releaseDate) : Number.NEGATIVE_INFINITY;
    return aTime - bTime;
  });

  const midpoint = Math.floor(chronological.length / 2);
  const firstHalf = chronological.slice(0, midpoint);
  const secondHalf = chronological.slice(midpoint);
  if (firstHalf.length === 0 || secondHalf.length === 0) return 0;

  const firstAverage =
    firstHalf.reduce((sum, row) => sum + row.views, 0) / firstHalf.length;
  const secondAverage =
    secondHalf.reduce((sum, row) => sum + row.views, 0) / secondHalf.length;

  if (firstAverage <= 0) return 0;
  const growth = ((secondAverage - firstAverage) / firstAverage) * 100;
  return Number.isFinite(growth) ? Number(growth.toFixed(1)) : 0;
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(getSupabaseConfig());
}

export async function getShowAnalytics(showId: string): Promise<ShowAnalytics> {
  const config = getSupabaseConfig();
  if (!config) return EMPTY_ANALYTICS;

  try {
    const endpoint = new URL(`${config.url}/rest/v1/episodes`);
    endpoint.searchParams.set("show_id", `eq.${showId}`);
    endpoint.searchParams.set("select", "title,views,release_date,duration_ms");
    endpoint.searchParams.set("order", "release_date.desc.nullslast");
    endpoint.searchParams.set("limit", "500");

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: headers(config.serviceRoleKey),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Analytics query failed:",
        response.status,
        response.statusText
      );
      return EMPTY_ANALYTICS;
    }

    const rows = sanitizeRows(await response.json());
    if (rows.length === 0) return EMPTY_ANALYTICS;

    const totalEpisodes = rows.length;
    const totalViews = rows.reduce((sum, row) => sum + row.views, 0);
    const averageViewsPerEpisode = Math.round(totalViews / totalEpisodes);

    const latestByDate = sortByDateDesc(rows).find((row) => Boolean(row.releaseDate));
    const latestEpisodeViews = latestByDate?.views ?? rows[0]?.views ?? 0;

    return {
      totalViews,
      totalEpisodes,
      averageViewsPerEpisode,
      latestEpisodeViews,
      growthRate: computeGrowthRate(rows),
      topEpisodes: formatTopEpisodes(rows),
    };
  } catch (error) {
    console.error("Analytics query error:", error);
    return EMPTY_ANALYTICS;
  }
}
