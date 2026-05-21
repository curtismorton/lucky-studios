import { NextRequest, NextResponse } from "next/server";
import {
  getMarketingPagesContent,
  isMarketingCmsConfigured,
} from "@/lib/services/marketingCms";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getMarketingPagesContent();
  return NextResponse.json({
    content,
    configured: isMarketingCmsConfigured(),
  });
}

export async function PUT(request: NextRequest) {
  void request;
  return NextResponse.json({
    error:
      "Legacy token-based writes are deprecated. Use CMS V3 authenticated editor endpoints.",
  }, { status: 410 });
}
