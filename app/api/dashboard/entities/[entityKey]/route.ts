import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { getEntityPair } from "@/lib/cms/entities";
import { isCmsEntityKey } from "@/lib/cms/entityKeys";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { entityKey: string } }
) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  const entityKey = params.entityKey;
  if (!isCmsEntityKey(entityKey)) {
    return NextResponse.json({ error: "Unknown entity key." }, { status: 404 });
  }

  try {
    const pair = await getEntityPair(entityKey);
    return NextResponse.json(pair);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load entity.",
      },
      { status: 500 }
    );
  }
}
