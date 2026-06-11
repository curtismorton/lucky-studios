import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { rollbackEntity } from "@/lib/cms/entities";
import { isCmsEntityKey } from "@/lib/cms/entityKeys";
import { isCmsV2WriteEnabled } from "@/lib/cms/flags";
import { requireActiveMfa } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ entityKey: string; snapshotId: string }> }
) {
  const params = await props.params;
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

  const snapshotId = params.snapshotId;
  if (!snapshotId) {
    return NextResponse.json(
      { error: "Snapshot ID is required." },
      { status: 400 }
    );
  }

  try {
    const result = await rollbackEntity(entityKey, snapshotId, auth.context.userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to rollback entity.",
      },
      { status: 500 }
    );
  }
}
