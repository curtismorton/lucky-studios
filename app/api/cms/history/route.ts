import { NextRequest, NextResponse } from "next/server";
import { withDashboardRole } from "@/lib/cms/api";
import { createServiceRoleClient } from "@/lib/cms/supabase";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  draft_saved: "draft updated",
  entity_published: "published",
  entity_rolled_back: "rolled back",
};

export async function GET(request: NextRequest) {
  const auth = await withDashboardRole(request, "viewer");
  if (!auth.ok) return auth.response;

  const limitRaw = request.nextUrl.searchParams.get("limit");
  const limit = Math.min(
    Math.max(limitRaw ? Number(limitRaw) : 60, 1),
    200
  );

  try {
    const client = createServiceRoleClient();
    const [{ data: events, error: eventsError }, { data: entities }] =
      await Promise.all([
        client
          .from("cms_audit_events")
          .select("id,action,entity_id,actor_user_id,details,created_at")
          .order("created_at", { ascending: false })
          .limit(limit),
        client.from("cms_entities").select("id,entity_key,title"),
      ]);

    if (eventsError) {
      throw new Error(eventsError.message);
    }

    const entityById = new Map<
      string,
      { key: string; title: string }
    >();
    (entities || []).forEach((entity) => {
      entityById.set(entity.id as string, {
        key: (entity.entity_key as string) || "unknown",
        title: (entity.title as string) || "Unknown",
      });
    });

    const actorIds = Array.from(
      new Set(
        (events || [])
          .map((event) => event.actor_user_id)
          .filter((entry): entry is string => typeof entry === "string")
      )
    );

    const actorEmailById = new Map<string, string>();
    if (actorIds.length > 0) {
      const usersResponse = await client.auth.admin.listUsers();
      if (!usersResponse.error && usersResponse.data?.users) {
        usersResponse.data.users.forEach((user) => {
          if (actorIds.includes(user.id)) {
            actorEmailById.set(user.id, user.email || user.id);
          }
        });
      }
    }

    const items = (events || []).map((event) => {
      const entityRef = entityById.get((event.entity_id as string) || "");
      const entityTitle = entityRef?.title || "Unknown entity";
      const action = (event.action as string) || "updated";
      const actionLabel = ACTION_LABELS[action] || action.replace(/_/g, " ");
      const actorId = (event.actor_user_id as string | null) || null;
      const actorLabel = actorId
        ? actorEmailById.get(actorId) || actorId
        : "system";

      return {
        id: event.id as string,
        createdAt: event.created_at as string,
        action,
        entityKey: entityRef?.key || null,
        entityTitle,
        actorId,
        actorLabel,
        details:
          event.details && typeof event.details === "object"
            ? (event.details as Record<string, unknown>)
            : {},
        message: `${entityTitle} ${actionLabel} by ${actorLabel}`,
      };
    });

    return NextResponse.json({
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load CMS history.",
      },
      { status: 500 }
    );
  }
}
