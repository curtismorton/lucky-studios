import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { buildCmsExportBundle } from "@/lib/cms/importExport";
import { requireActiveMfa } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "admin");
  if (!auth.ok) return auth.response;
  const mfa = await requireActiveMfa(request, auth.context.userId);
  if (!mfa.ok) return mfa.response;

  try {
    const bundle = await buildCmsExportBundle(auth.context.userId);
    return NextResponse.json({
      ok: true,
      bundle,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate CMS export bundle.",
      },
      { status: 500 }
    );
  }
}
