import { NextRequest, NextResponse } from "next/server";
import { createCmsRouteClient } from "@/lib/cms/supabase-ssr";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  const supabase = await createCmsRouteClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
