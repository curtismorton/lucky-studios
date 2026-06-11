import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, withDashboardRole } from "@/lib/cms/api";
import { updateDashboardAssetMetadata } from "@/lib/cms/media";
import { isCmsV2WriteEnabled } from "@/lib/cms/flags";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, props: { params: Promise<{ assetId: string }> }) {
  const params = await props.params;
  const auth = await withDashboardRole(request, "editor");
  if (!auth.ok) return auth.response;

  if (!isCmsV2WriteEnabled()) {
    return NextResponse.json(
      { error: "CMS V2 writes are disabled by feature flag." },
      { status: 423 }
    );
  }

  const assetId = params.assetId;
  if (!assetId) {
    return NextResponse.json({ error: "Asset ID is required." }, { status: 400 });
  }

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  try {
    const asset = await updateDashboardAssetMetadata(assetId, {
      alt: (body as { alt?: string | null }).alt,
      caption: (body as { caption?: string | null }).caption,
      folder: (body as { folder?: string | null }).folder,
      status: (body as { status?: string | null }).status,
      tags: (body as { tags?: string[] | null }).tags,
    });

    return NextResponse.json({
      ok: true,
      asset,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update media metadata.",
      },
      { status: 500 }
    );
  }
}
