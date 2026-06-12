import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import { setDashboardUserRole } from "@/lib/cms/users";
import { requireActiveMfa } from "@/lib/cms/mfa";
import type { CmsRole } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

function isCmsRole(value: unknown): value is CmsRole {
  return value === "admin" || value === "editor" || value === "viewer";
}

export async function PUT(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;
  const mfa = await requireActiveMfa(request, auth.context.userId);
  if (!mfa.ok) return mfa.response;

  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  const body = await parseJsonBody(request);
  const role = body && typeof body === "object" ? (body as { role?: unknown }).role : null;
  if (!isCmsRole(role)) {
    return NextResponse.json(
      { error: "Role must be one of: admin, editor, viewer." },
      { status: 400 }
    );
  }

  try {
    await setDashboardUserRole(userId, role);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update dashboard user role.",
      },
      { status: 500 }
    );
  }
}
