import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import { getEntityPair, publishEntity, saveEntityDraft } from "@/lib/cms/entities";
import { isCmsV2WriteEnabled } from "@/lib/cms/flags";
import { requireActiveMfa } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  try {
    const entity = await getEntityPair("homepage");
    return NextResponse.json({
      entity: entity.entity,
      draft: entity.draft,
      published: entity.published,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load homepage editor payload.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await withDashboardRole(request, "editor");
  if (!auth.ok) return auth.response;

  if (!isCmsV2WriteEnabled()) {
    return NextResponse.json(
      { error: "CMS V2 writes are disabled by feature flag." },
      { status: 423 }
    );
  }

  const body = await parseJsonBody(request);
  const payload =
    body && typeof body === "object" && "payload" in body
      ? (body as { payload: unknown }).payload
      : body;

  try {
    const entity = await getEntityPair("homepage");
    const seo = entity.draft?.seo || entity.published?.seo || {};
    const draft = await saveEntityDraft(
      "homepage",
      payload,
      seo,
      auth.context.userId
    );

    return NextResponse.json({
      ok: true,
      draft,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save homepage draft.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  if (!isCmsV2WriteEnabled()) {
    return NextResponse.json(
      { error: "CMS V2 writes are disabled by feature flag." },
      { status: 423 }
    );
  }

  const mfa = await requireActiveMfa(request, auth.context.userId);
  if (!mfa.ok) return mfa.response;

  const body = await parseJsonBody(request);
  const summary =
    body &&
    typeof body === "object" &&
    typeof (body as { summary?: unknown }).summary === "string"
      ? ((body as { summary: string }).summary || "").trim()
      : "";

  if (!summary) {
    return NextResponse.json(
      { error: "Publish summary is required." },
      { status: 400 }
    );
  }

  try {
    const published = await publishEntity(
      "homepage",
      auth.context.userId,
      summary
    );
    return NextResponse.json({
      ok: true,
      published,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to publish homepage changes.",
      },
      { status: 500 }
    );
  }
}
