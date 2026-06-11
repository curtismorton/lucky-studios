import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { replaceDashboardAsset } from "@/lib/cms/media";
import { isCmsV2WriteEnabled } from "@/lib/cms/flags";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, props: { params: Promise<{ assetId: string }> }) {
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

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Replacement requires a file field." },
      { status: 400 }
    );
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large. Max size is 20MB." },
      { status: 413 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const asset = await replaceDashboardAsset({
      assetId,
      fileName: file.name,
      fileType: file.type,
      bytes,
      uploadedBy: auth.context.userId,
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
            : "Failed to replace media asset.",
      },
      { status: 500 }
    );
  }
}
