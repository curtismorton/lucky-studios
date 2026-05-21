import { NextRequest, NextResponse } from "next/server";
import {
  isMediaLibraryConfigured,
  listMediaAssets,
} from "@/lib/services/mediaLibrary";
import { syncLegacyMediaAssetsFromStorage } from "@/lib/cms/media";

function isAuthorized(request: NextRequest): boolean {
  const adminToken = process.env.CMS_ADMIN_TOKEN;
  if (!adminToken) return false;
  const providedToken = request.headers.get("x-cms-token");
  return Boolean(providedToken && providedToken === adminToken);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid CMS admin token." },
      { status: 401 }
    );
  }

  const folder = request.nextUrl.searchParams.get("folder") || undefined;
  await syncLegacyMediaAssetsFromStorage(folder).catch(() => null);
  const result = await listMediaAssets(folder);

  if (!result.ok) {
    return NextResponse.json(
      {
        configured: isMediaLibraryConfigured(),
        error: result.error || "Failed to load media assets.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    configured: isMediaLibraryConfigured(),
    assets: result.assets || [],
  });
}

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    {
      error:
        "Legacy token-based media writes are deprecated. Use /api/dashboard/media/upload with CMS login.",
    },
    { status: 410 }
  );
}
