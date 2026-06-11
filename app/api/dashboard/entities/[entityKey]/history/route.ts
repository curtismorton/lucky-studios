import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { listEntityHistory } from "@/lib/cms/entities";
import { isCmsEntityKey } from "@/lib/cms/entityKeys";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, props: { params: Promise<{ entityKey: string }> }) {
  const params = await props.params;
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  const entityKey = params.entityKey;
  if (!isCmsEntityKey(entityKey)) {
    return NextResponse.json({ error: "Unknown entity key." }, { status: 404 });
  }

  const rawLimit = request.nextUrl.searchParams.get("limit");
  const parsedLimit = rawLimit ? Number.parseInt(rawLimit, 10) : 40;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 100)
    : 40;

  try {
    const history = await listEntityHistory(entityKey, limit);
    return NextResponse.json({ history });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load history.",
      },
      { status: 500 }
    );
  }
}
