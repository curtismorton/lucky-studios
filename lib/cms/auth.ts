import "server-only";

import { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import {
  getProvisionedRoleForCmsEmail,
  normalizeCmsEmail,
} from "@/lib/cms/access";
import { getCmsFlags } from "@/lib/cms/flags";
import { createServiceRoleClient } from "@/lib/cms/supabase";
import { createCmsRouteClient } from "@/lib/cms/supabase-ssr";
import type { CmsRole } from "@/lib/cms/types";

export type DashboardAuthContext = {
  userId: string;
  email: string | null;
  role: CmsRole;
};

const ROLE_ORDER: Record<CmsRole, number> = {
  viewer: 1,
  editor: 2,
  admin: 3,
};

function parseBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim() || null;
}

function isAllowedRole(role: CmsRole, minimumRole: CmsRole): boolean {
  return ROLE_ORDER[role] >= ROLE_ORDER[minimumRole];
}

async function resolveUserFromToken(token: string): Promise<User | null> {
  const client = createServiceRoleClient();
  const { data, error } = await client.auth.getUser(token);
  if (error) return null;
  return data.user ?? null;
}

export async function resolveRoleForUser(
  userId: string,
  email?: string | null
): Promise<CmsRole | null> {
  const client = createServiceRoleClient();
  const { data } = await client
    .from("cms_user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.role === "admin" || data?.role === "editor" || data?.role === "viewer") {
    return data.role;
  }

  const normalizedEmail = normalizeCmsEmail(email);
  if (!normalizedEmail) return null;

  const { count, error: countError } = await client
    .from("cms_user_roles")
    .select("user_id", { count: "exact", head: true });
  if (countError) return null;

  const provisionedRole = getProvisionedRoleForCmsEmail(
    normalizedEmail,
    !count || count === 0
  );
  if (!provisionedRole) return null;

  const { error: upsertError } = await client.from("cms_user_roles").upsert(
    { user_id: userId, role: provisionedRole },
    { onConflict: "user_id" }
  );
  if (upsertError) return null;

  return provisionedRole;
}

export async function getDashboardAuthContext(
  request: NextRequest
): Promise<DashboardAuthContext | null> {
  const flags = getCmsFlags();

  if (flags.devBypassAuth) {
    return {
      userId: "dev-bypass-user",
      email: "dev-bypass@local",
      role: "admin",
    };
  }

  // Bearer token path — used by programmatic API clients.
  const token = parseBearerToken(request);
  if (token) {
    const user = await resolveUserFromToken(token);
    if (!user) return null;

    const role = await resolveRoleForUser(user.id, user.email ?? null);
    if (!role) return null;

    return { userId: user.id, email: user.email ?? null, role };
  }

  // Cookie path — browser sessions managed by @supabase/ssr.
  const supabase = await createCmsRouteClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const role = await resolveRoleForUser(user.id, user.email ?? null);
  if (!role) return null;

  return { userId: user.id, email: user.email ?? null, role };
}

export async function requireDashboardRole(
  request: NextRequest,
  minimumRole: CmsRole
): Promise<
  | { ok: true; context: DashboardAuthContext }
  | { ok: false; response: NextResponse<{ error: string }> }
> {
  const context = await getDashboardAuthContext(request);
  if (!context) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized. Sign in with a CMS dashboard account." },
        { status: 401 }
      ),
    };
  }

  if (!isAllowedRole(context.role, minimumRole)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Forbidden. Insufficient role for this action." },
        { status: 403 }
      ),
    };
  }

  return { ok: true, context };
}
