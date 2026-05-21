-- CMS V2 hardening follow-up
-- Addresses linter warnings for mutable function search_path,
-- auth initplan policy optimization, and missing FK helper indexes.

create or replace function public.cms_touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "cms roles self read" on public.cms_user_roles;
create policy "cms roles self read"
on public.cms_user_roles
for select
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists idx_cms_entity_content_updated_by
  on public.cms_entity_content(updated_by);
create index if not exists idx_cms_publish_snapshots_published_by
  on public.cms_publish_snapshots(published_by);
create index if not exists idx_cms_assets_uploaded_by
  on public.cms_assets(uploaded_by);
create index if not exists idx_cms_audit_events_actor_user_id
  on public.cms_audit_events(actor_user_id);
create index if not exists idx_cms_runtime_snapshot_updated_by
  on public.cms_runtime_snapshot(updated_by);
create index if not exists idx_cms_import_jobs_created_by
  on public.cms_import_jobs(created_by);
create index if not exists idx_cms_export_jobs_created_by
  on public.cms_export_jobs(created_by);
