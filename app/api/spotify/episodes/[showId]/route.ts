import { NextRequest, NextResponse } from "next/server";
import { getSpotifyEpisodes } from "@/lib/services/spotify";

export async function GET(
  request: NextRequest,
  { params }: { params: { showId: string } }
) {
  try {
    const { showId } = params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!showId) {
      return NextResponse.json(
        { error: "Show ID is required" },
        { status: 400 }
      );
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

