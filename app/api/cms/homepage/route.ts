import { NextRequest, NextResponse } from "next/server";
import {
  getHomepageContent,
  isHomepageCmsConfigured,
} from "@/lib/services/homepageCms";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getHomepageContent();
  return NextResponse.json({
    content,
    configured: isHomepageCmsConfigured(),
  });
}

export async function PUT(request: NextRequest) {
  void request;
  return NextResponse.json(
    {
      error:
        "Legacy token-based writes are deprecated. Use /api/cms/editor/homepage with CMS login.",
    },
    { status: 410 }
  );

  /*
  if (getCmsFlags().legacyAdminReadonly) {
    return NextResponse.json(
      { error: "Legacy /admin writes are disabled (read-only mode)." },
      { status: 423 }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid CMS admin token." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid payload." },
      { status: 400 }
    );
  }

  const input = "content" in body ? body.content : body;
  const normalized: HomepageContent = normalizeHomepageContent(input);
  const saved = await saveHomepageContent(normalized);

  if (!saved.ok) {
    return NextResponse.json(
      { error: saved.error || "Failed to save homepage content." },
      { status: 500 }
    );
  }

  revalidateTag(HOMEPAGE_CMS_CACHE_TAG);

  return NextResponse.json({
    ok: true,
    content: normalized,
  });
  */
}
