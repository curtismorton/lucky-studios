import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { listDashboardUsers } from "@/lib/cms/users";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;

  try {
    const users = await listDashboardUsers();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to list dashboard users.",
      },
      { status: 500 }
    );
  }
}
