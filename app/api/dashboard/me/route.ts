import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { getCmsFlags } from "@/lib/cms/flags";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    user: auth.context,
    flags: getCmsFlags(),
  });
}
