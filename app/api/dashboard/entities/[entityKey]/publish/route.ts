import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import { publishEntity } from "@/lib/cms/entities";
import { isCmsEntityKey } from "@/lib/cms/entityKeys";
import { isCmsV2WriteEnabled } from "@/lib/cms/flags";
import { requireActiveMfa } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { entityKey: string } }
) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;
  const mfa = requireActiveMfa(request, auth.context.userId);
  if (!mfa.ok) return mfa.response;

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
  const summary =
    body &&
    typeof body === "object" &&
    typeof (body as { summary?: unknown }).summary === "string"
      ? ((body as { summary: string }).summary || "").trim()
      : undefined;

  try {
    const published = await publishEntity(entityKey, auth.context.userId, summary);
    return NextResponse.json(published);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to publish entity.",
      },
      { status: 500 }
    );
  }
}
