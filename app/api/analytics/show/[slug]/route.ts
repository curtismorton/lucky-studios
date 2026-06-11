import { NextRequest, NextResponse } from "next/server";
import { getShowBySlug } from "@/lib/services/cms/shows";
import { getShowAnalytics } from "@/lib/services/analytics";

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Show slug is required" },
        { status: 400 }
      );
    }

    const show = await getShowBySlug(slug);

    if (!show) {
      return NextResponse.json(
        { error: "Show not found" },
        { status: 404 }
      );
    }

    const analytics = await getShowAnalytics(show.id);

    return NextResponse.json(analytics, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
