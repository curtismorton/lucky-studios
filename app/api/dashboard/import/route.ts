import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole, parseJsonBody } from "@/lib/cms/api";
import {
  importCmsBundle,
  type CmsExportBundle,
  buildLegacyMergeBundle,
} from "@/lib/cms/importExport";
import { isCmsV2WriteEnabled } from "@/lib/cms/flags";
import { requireActiveMfa } from "@/lib/cms/mfa";

export const dynamic = "force-dynamic";

function isValidBundle(input: unknown): input is CmsExportBundle {
  if (!input || typeof input !== "object") return false;
  const value = input as { generatedAt?: unknown; entities?: unknown };
  return (
    typeof value.generatedAt === "string" &&
    value.entities !== null &&
    typeof value.entities === "object"
  );
}

export async function POST(request: NextRequest) {
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

  const body = await parseJsonBody(request);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const dryRun =
    typeof (body as { dryRun?: unknown }).dryRun === "boolean"
      ? ((body as { dryRun: boolean }).dryRun as boolean)
      : true;
  const requestedBundle = (body as { bundle?: unknown }).bundle;
  const mode =
    typeof (body as { mode?: unknown }).mode === "string"
      ? ((body as { mode: string }).mode as string)
      : "merge-live-defaults";

  let bundle: CmsExportBundle;
  if (isValidBundle(requestedBundle)) {
    bundle = requestedBundle;
  } else if (mode === "merge-live-defaults") {
    bundle = await buildLegacyMergeBundle(auth.context.userId);
  } else {
    return NextResponse.json(
      { error: "Invalid import bundle payload." },
      { status: 400 }
    );
  }

  try {
    const result = await importCmsBundle(bundle, auth.context.userId, dryRun);
    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to import CMS bundle.",
      },
      { status: 500 }
    );
  }
}
