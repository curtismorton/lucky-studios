-- CMS V2 dashboard schema for Lucky Studios
-- Phase 1 + Phase 2 foundation tables

create table if not exists public.cms_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_entities (
  id uuid primary key default gen_random_uuid(),
  entity_key text not null unique,
  entity_type text not null,
  module text not null,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_entity_content (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.cms_entities(id) on delete cascade,
  workspace text not null check (workspace in ('draft', 'published')),
  payload jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version >= 1),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (entity_id, workspace)
);

create table if not exists public.cms_publish_snapshots (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.cms_entities(id) on delete cascade,
  published_version integer not null check (published_version >= 1),
  draft_payload jsonb not null default '{}'::jsonb,
  published_payload jsonb not null default '{}'::jsonb,
  summary text,
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now()
);

create table if not exists public.cms_assets (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  url text not null,
  folder text not null default 'root',
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  duration_ms integer,
  alt text,
  caption text,
  tags text[] not null default '{}'::text[],
  checksum text,
  status text not null default 'active',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_asset_usages (
  asset_id uuid not null references public.cms_assets(id) on delete cascade,
  entity_id uuid not null references public.cms_entities(id) on delete cascade,
  workspace text not null check (workspace in ('draft', 'published')),
  field_path text not null,
  updated_at timestamptz not null default now(),
  primary key (asset_id, entity_id, workspace, field_path)
);

create table if not exists public.cms_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_id uuid references public.cms_entities(id) on delete set null,
  workspace text check (workspace in ('draft', 'published')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cms_runtime_snapshot (
  id integer primary key check (id = 1),
  snapshot jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version >= 1),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_import_jobs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  status text not null default 'processing',
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.cms_export_jobs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  storage_path text,
  status text not null default 'processing',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_cms_entities_module on public.cms_entities(module);
create index if not exists idx_cms_entity_content_entity_workspace on public.cms_entity_content(entity_id, workspace);
create index if not exists idx_cms_publish_snapshots_entity on public.cms_publish_snapshots(entity_id, published_at desc);
create index if not exists idx_cms_assets_folder on public.cms_assets(folder);
create index if not exists idx_cms_assets_updated_at on public.cms_assets(updated_at desc);
create index if not exists idx_cms_audit_events_created_at on public.cms_audit_events(created_at desc);
create index if not exists idx_cms_audit_events_entity on public.cms_audit_events(entity_id);
create index if not exists idx_cms_asset_usages_entity on public.cms_asset_usages(entity_id, workspace);

create or replace function public.cms_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_cms_user_roles_touch on public.cms_user_roles;
create trigger trg_cms_user_roles_touch
before update on public.cms_user_roles
for each row
execute function public.cms_touch_updated_at();

drop trigger if exists trg_cms_entities_touch on public.cms_entities;
create trigger trg_cms_entities_touch
before update on public.cms_entities
for each row
execute function public.cms_touch_updated_at();

drop trigger if exists trg_cms_entity_content_touch on public.cms_entity_content;
create trigger trg_cms_entity_content_touch
before update on public.cms_entity_content
for each row
execute function public.cms_touch_updated_at();

drop trigger if exists trg_cms_assets_touch on public.cms_assets;
create trigger trg_cms_assets_touch
before update on public.cms_assets
for each row
execute function public.cms_touch_updated_at();

drop trigger if exists trg_cms_runtime_snapshot_touch on public.cms_runtime_snapshot;
create trigger trg_cms_runtime_snapshot_touch
before update on public.cms_runtime_snapshot
for each row
execute function public.cms_touch_updated_at();

alter table public.cms_user_roles enable row level security;
alter table public.cms_entities enable row level security;
alter table public.cms_entity_content enable row level security;
alter table public.cms_publish_snapshots enable row level security;
alter table public.cms_assets enable row level security;
alter table public.cms_asset_usages enable row level security;
alter table public.cms_audit_events enable row level security;
alter table public.cms_runtime_snapshot enable row level security;
alter table public.cms_import_jobs enable row level security;
alter table public.cms_export_jobs enable row level security;

drop policy if exists "cms roles self read" on public.cms_user_roles;
create policy "cms roles self read"
on public.cms_user_roles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "cms entities read" on public.cms_entities;
create policy "cms entities read"
on public.cms_entities
for select
to authenticated
using (true);

drop policy if exists "cms content read" on public.cms_entity_content;
create policy "cms content read"
on public.cms_entity_content
for select
to authenticated
using (true);

drop policy if exists "cms snapshots read" on public.cms_publish_snapshots;
create policy "cms snapshots read"
on public.cms_publish_snapshots
for select
to authenticated
using (true);

drop policy if exists "cms assets read" on public.cms_assets;
create policy "cms assets read"
on public.cms_assets
for select
to authenticated
using (true);

drop policy if exists "cms asset usages read" on public.cms_asset_usages;
create policy "cms asset usages read"
on public.cms_asset_usages
for select
to authenticated
using (true);

drop policy if exists "cms audit read" on public.cms_audit_events;
create policy "cms audit read"
on public.cms_audit_events
for select
to authenticated
using (true);

drop policy if exists "cms runtime snapshot read" on public.cms_runtime_snapshot;
create policy "cms runtime snapshot read"
on public.cms_runtime_snapshot
for select
to authenticated
using (true);

drop policy if exists "cms import jobs read" on public.cms_import_jobs;
create policy "cms import jobs read"
on public.cms_import_jobs
for select
to authenticated
using (true);

drop policy if exists "cms export jobs read" on public.cms_export_jobs;
create policy "cms export jobs read"
on public.cms_export_jobs
for select
to authenticated
using (true);
