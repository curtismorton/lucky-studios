import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { listEntities } from "@/lib/cms/entities";
import type { CmsEntityModule } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

const ALLOWED_MODULES: CmsEntityModule[] = [
  "content",
  "shows",
  "settings",
  "seo",
  "system",
];

function parseModule(value: string | null): CmsEntityModule | undefined {
  if (!value) return undefined;
  if (ALLOWED_MODULES.includes(value as CmsEntityModule)) {
    return value as CmsEntityModule;
  }
  return undefined;
}

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  try {
    const moduleFilter = parseModule(request.nextUrl.searchParams.get("module"));
    const entities = await listEntities(moduleFilter);
    return NextResponse.json({
      entities,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to list entities.",
      },
      { status: 500 }
    );
  }
}
