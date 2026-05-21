-- Legacy CMS compatibility table for fallback reads

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_content (key, value)
values
  ('homepage', '{}'::jsonb),
  ('marketing-pages', '{}'::jsonb)
on conflict (key) do nothing;
