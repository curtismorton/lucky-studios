import "server-only";

import type { CmsRole } from "@/lib/cms/types";
import { createServiceRoleClient } from "@/lib/cms/supabase";

export async function listDashboardUsers(): Promise<
  Array<{
    userId: string;
    email: string | null;
    role: CmsRole | null;
    createdAt: string | null;
    lastSignInAt: string | null;
  }>
> {
  const client = createServiceRoleClient();

  const [{ data: authUsers, error: authError }, { data: roleRows, error: roleError }] =
    await Promise.all([
      client.auth.admin.listUsers(),
      client.from("cms_user_roles").select("user_id,role"),
    ]);

  if (authError) {
    throw new Error(authError.message);
  }
  if (roleError) {
    throw new Error(roleError.message);
  }

  const roleByUserId = new Map<string, CmsRole>();
  (roleRows || []).forEach((row) => {
    const role = row.role as string;
    if (role === "admin" || role === "editor" || role === "viewer") {
      roleByUserId.set(row.user_id as string, role);
    }
  });

  return (authUsers?.users || []).map((user) => ({
    userId: user.id,
    email: user.email || null,
    role: roleByUserId.get(user.id) || null,
    createdAt: user.created_at || null,
    lastSignInAt: user.last_sign_in_at || null,
  }));
}

export async function setDashboardUserRole(
  userId: string,
  role: CmsRole
): Promise<void> {
  const client = createServiceRoleClient();
  const { error } = await client.from("cms_user_roles").upsert(
    {
      user_id: userId,
      role,
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    throw new Error(error.message);
  }
}
