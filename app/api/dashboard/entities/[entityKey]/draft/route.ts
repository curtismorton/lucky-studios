import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import { saveEntityDraft } from "@/lib/cms/entities";
import { isCmsEntityKey } from "@/lib/cms/entityKeys";
import { isCmsV2WriteEnabled } from "@/lib/cms/flags";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { entityKey: string } }
) {
  const auth = await withDashboardRole(request, "editor");
  if (!auth.ok) return auth.response;

  if (!isCmsV2WriteEnabled()) {
    return NextResponse.json(
      { error: "CMS V2 writes are disabled by feature flag." },
      { status: 423 }
    );
  }

  const entityKey = params.entityKey;
  if (!isCmsEntityKey(entityKey)) {
    return NextResponse.json({ error: "Unknown entity key." }, { status: 404 });
  }

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const payload = (body as { payload?: unknown }).payload;
  const seo = (body as { seo?: unknown }).seo;

  try {
    const saved = await saveEntityDraft(entityKey, payload, seo, auth.context.userId);
    return NextResponse.json({
      ok: true,
      draft: saved,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save draft for entity.",
      },
      { status: 500 }
    );
  }
}
