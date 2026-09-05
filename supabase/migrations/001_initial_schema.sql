-- ============================================================
-- Portfolio Website — Initial Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
create table if not exists public.projects (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  description     text not null,
  short_description text not null default '',
  cover_image_url text not null default '',
  gallery_urls    jsonb not null default '[]'::jsonb,
  tech_stack      jsonb not null default '[]'::jsonb,
  category        text not null default 'Other',
  live_url        text,
  github_url      text,
  featured        boolean not null default false,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- TESTIMONIALS TABLE
-- ============================================================
create table if not exists public.testimonials (
  id            uuid primary key default uuid_generate_v4(),
  client_name   text not null,
  client_role   text not null default '',
  company       text not null default '',
  quote         text not null,
  avatar_url    text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- MESSAGES TABLE
-- ============================================================
create type if not exists public.message_status as enum ('unread', 'read', 'replied');

create table if not exists public.messages (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  project_type text not null default '',
  budget_range text not null default '',
  message      text not null,
  status       public.message_status not null default 'unread',
  created_at   timestamptz not null default now()
);

-- ============================================================
-- SITE SETTINGS TABLE
-- ============================================================
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_projects_display_order on public.projects(display_order);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_testimonials_display_order on public.testimonials(display_order);
create index if not exists idx_messages_status on public.messages(status);
create index if not exists idx_messages_created_at on public.messages(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.messages enable row level security;
alter table public.site_settings enable row level security;

-- PROJECTS: public can read, authenticated can do anything
create policy "projects_public_read"
  on public.projects for select
  to anon, authenticated
  using (true);

create policy "projects_auth_insert"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "projects_auth_update"
  on public.projects for update
  to authenticated
  using (true) with check (true);

create policy "projects_auth_delete"
  on public.projects for delete
  to authenticated
  using (true);

-- TESTIMONIALS: public can read, authenticated can do anything
create policy "testimonials_public_read"
  on public.testimonials for select
  to anon, authenticated
  using (true);

create policy "testimonials_auth_insert"
  on public.testimonials for insert
  to authenticated
  with check (true);

create policy "testimonials_auth_update"
  on public.testimonials for update
  to authenticated
  using (true) with check (true);

create policy "testimonials_auth_delete"
  on public.testimonials for delete
  to authenticated
  using (true);

-- MESSAGES: anyone can insert, only authenticated can read/update
create policy "messages_public_insert"
  on public.messages for insert
  to anon, authenticated
  with check (true);

create policy "messages_auth_select"
  on public.messages for select
  to authenticated
  using (true);

create policy "messages_auth_update"
  on public.messages for update
  to authenticated
  using (true) with check (true);

-- SITE_SETTINGS: public can read, authenticated can write
create policy "site_settings_public_read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings_auth_insert"
  on public.site_settings for insert
  to authenticated
  with check (true);

create policy "site_settings_auth_update"
  on public.site_settings for update
  to authenticated
  using (true) with check (true);
