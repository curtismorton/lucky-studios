-- CMS V2 baseline seed
-- Idempotent bootstrap for core entities and workspaces.

begin;

insert into public.cms_entities (entity_key, entity_type, module, title)
values
  ('homepage', 'page', 'content', 'Homepage'),
  ('marketing-pages', 'page', 'content', 'Marketing Pages'),
  ('shows', 'collection', 'shows', 'Shows'),
  ('site-settings', 'settings', 'settings', 'Global Site Settings'),
  ('nav-footer', 'settings', 'settings', 'Navigation & Footer'),
  ('seo-defaults', 'seo', 'seo', 'SEO Defaults')
on conflict (entity_key) do update
set entity_type = excluded.entity_type,
    module = excluded.module,
    title = excluded.title,
    updated_at = now();

insert into public.cms_entity_content (entity_id, workspace, payload, seo, version, updated_by)
select e.id, w.workspace, '{}'::jsonb, '{}'::jsonb, 1, null
from public.cms_entities e
cross join (values ('draft'::text), ('published'::text)) as w(workspace)
on conflict (entity_id, workspace) do nothing;

insert into public.cms_publish_snapshots (
  entity_id,
  published_version,
  draft_payload,
  published_payload,
  summary,
  published_by,
  published_at
)
select
  e.id,
  p.version,
  jsonb_build_object('payload', d.payload, 'seo', d.seo),
  jsonb_build_object('payload', p.payload, 'seo', p.seo),
  'Baseline seed',
  null,
  now()
from public.cms_entities e
join public.cms_entity_content d on d.entity_id = e.id and d.workspace = 'draft'
join public.cms_entity_content p on p.entity_id = e.id and p.workspace = 'published'
where not exists (
  select 1 from public.cms_publish_snapshots s where s.entity_id = e.id
);

insert into public.cms_audit_events (
  actor_user_id,
  action,
  entity_id,
  workspace,
  details,
  created_at
)
select
  null,
  'seed_initialized',
  e.id,
  'published',
  jsonb_build_object('entityKey', e.entity_key, 'source', 'baseline-seed'),
  now()
from public.cms_entities e
where not exists (
  select 1
  from public.cms_audit_events a
  where a.entity_id = e.id and a.action = 'seed_initialized'
);

with published as (
  select
    e.entity_key,
    c.payload,
    c.seo,
    c.version,
    c.updated_at
  from public.cms_entities e
  join public.cms_entity_content c
    on c.entity_id = e.id and c.workspace = 'published'
),
snapshot_data as (
  select jsonb_object_agg(
    entity_key,
    jsonb_build_object(
      'payload', payload,
      'seo', seo,
      'version', version,
      'updatedAt', updated_at
    )
  ) as snapshot
  from published
)
insert into public.cms_runtime_snapshot (id, snapshot, version, updated_by)
select 1, coalesce(snapshot_data.snapshot, '{}'::jsonb), 1, null
from snapshot_data
on conflict (id) do update
set snapshot = excluded.snapshot,
    version = public.cms_runtime_snapshot.version + 1,
    updated_by = excluded.updated_by,
    updated_at = now();

commit;
