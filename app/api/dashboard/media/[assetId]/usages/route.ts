import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { getDashboardAssetUsage } from "@/lib/cms/media";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { assetId: string } }
) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  const assetId = params.assetId;
  if (!assetId) {
    return NextResponse.json({ error: "Asset ID is required." }, { status: 400 });
  }

  try {
    const usages = await getDashboardAssetUsage(assetId);
    return NextResponse.json({ usages });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load media usage graph.",
      },
      { status: 500 }
    );
  }
}
