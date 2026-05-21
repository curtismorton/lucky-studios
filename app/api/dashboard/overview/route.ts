import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { getDashboardOverview } from "@/lib/cms/entities";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  try {
    const overview = await getDashboardOverview();
    return NextResponse.json(overview);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load dashboard overview.",
      },
      { status: 500 }
    );
  }
}
