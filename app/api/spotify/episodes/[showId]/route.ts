import { NextRequest, NextResponse } from "next/server";
import { getSpotifyEpisodes } from "@/lib/services/spotify";

export async function GET(
  request: NextRequest,
  { params }: { params: { showId: string } }
) {
  try {
    const { showId } = params;
    const searchParams = request.nextUrl.searchParams;
    
    if (!showId) {
      return NextResponse.json(
        { error: "Show ID is required" },
        { status: 400 }
      );
    }

    // Validate and parse limit parameter
    const limitParam = searchParams.get("limit");
    let limit = 10; // Default value
    
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      // Validate: must be a positive integer between 1 and 50 (Spotify API limit)
      if (isNaN(parsed) || parsed < 1 || parsed > 50) {
        return NextResponse.json(
          { error: "Limit must be a positive integer between 1 and 50" },
          { status: 400 }
        );
      }
      limit = parsed;
    }

    const episodes = await getSpotifyEpisodes(showId, limit);

    return NextResponse.json(episodes, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching Spotify episodes:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch episodes" },
      { status: 500 }
    );
  }
}

