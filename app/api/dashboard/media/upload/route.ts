import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { uploadDashboardAsset } from "@/lib/cms/media";
import { isCmsV2WriteEnabled } from "@/lib/cms/flags";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "editor");
  if (!auth.ok) return auth.response;

  if (!isCmsV2WriteEnabled()) {
    return NextResponse.json(
      { error: "CMS V2 writes are disabled by feature flag." },
      { status: 423 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Upload requires a file field." },
      { status: 400 }
    );
  }

  const folder =
    typeof formData?.get("folder") === "string"
      ? (formData?.get("folder") as string)
      : undefined;
  const alt =
    typeof formData?.get("alt") === "string"
      ? (formData?.get("alt") as string)
      : undefined;
  const caption =
    typeof formData?.get("caption") === "string"
      ? (formData?.get("caption") as string)
      : undefined;
  const tags =
    typeof formData?.get("tags") === "string"
      ? (formData?.get("tags") as string)
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : undefined;

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large. Max size is 20MB." },
      { status: 413 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const asset = await uploadDashboardAsset({
      fileName: file.name,
      fileType: file.type,
      bytes,
      folder,
      alt,
      caption,
      tags,
      uploadedBy: auth.context.userId,
    });

    return NextResponse.json({ ok: true, asset });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload media asset.",
      },
      { status: 500 }
    );
  }
}
