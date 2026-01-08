import { NextRequest, NextResponse } from "next/server";
import { getSpotifyShowData } from "@/lib/services/spotify";

export async function GET(
  request: NextRequest,
  { params }: { params: { showId: string } }
) {
  try {
    const { showId } = params;

    if (!showId) {
      return NextResponse.json(
        { error: "Show ID is required" },
        { status: 400 }
      );
    }

    const data = await getSpotifyShowData(showId, 10);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching Spotify show:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch show data" },
      { status: 500 }
    );
  }
}

