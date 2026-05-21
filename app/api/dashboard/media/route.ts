import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { listDashboardAssets } from "@/lib/cms/media";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  const folder = request.nextUrl.searchParams.get("folder") || undefined;
  const query = request.nextUrl.searchParams.get("query") || undefined;
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const parsedLimit = rawLimit ? Number.parseInt(rawLimit, 10) : undefined;

  try {
    const assets = await listDashboardAssets({
      folder,
      query,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
    });
    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load media assets.",
      },
      { status: 500 }
    );
  }
}
