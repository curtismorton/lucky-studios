import { NextRequest, NextResponse } from "next/server";
import type { CmsRole } from "@/lib/cms/types";
import { requireDashboardRole } from "@/lib/cms/auth";

export async function withDashboardRole(
  request: NextRequest,
  minimumRole: CmsRole
): Promise<
  | { ok: true; context: { userId: string; email: string | null; role: CmsRole } }
  | { ok: false; response: NextResponse<{ error: string }> }
> {
  const auth = await requireDashboardRole(request, minimumRole);
  if (!auth.ok) {
    return { ok: false, response: auth.response };
  }

  return {
    ok: true,
    context: {
      userId: auth.context.userId,
      email: auth.context.email,
      role: auth.context.role,
    },
  };
}

export async function parseJsonBody(request: NextRequest): Promise<unknown> {
  return request.json().catch(() => null);
}
