import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Env-credential password login has been removed.
// Sign in via magic link (/api/cms/auth/magic-link) or Google OAuth.
export function POST() {
  return NextResponse.json({ error: "credentials_disabled" }, { status: 404 });
}
