import { NextRequest, NextResponse } from "next/server";
import { getSpotifyShows } from "@/lib/services/spotify";

const MAX_SHOW_IDS = 20;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const idsParam = request.nextUrl.searchParams.get("ids") || "";
    const showIds = Array.from(
      new Set(
        idsParam
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0)
      )
    );

    if (showIds.length === 0) {
      return NextResponse.json(
        { error: "At least one show ID is required via ?ids=id1,id2" },
        { status: 400 }
      );
    }

    if (showIds.length > MAX_SHOW_IDS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_SHOW_IDS} show IDs are allowed per request.` },
        { status: 400 }
      );
    }

    const shows = await getSpotifyShows(showIds);

    return NextResponse.json(shows, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching Spotify shows:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch shows data" },
      { status: 500 }
    );
  }
}
