-- Painora core schema
-- Tables: pains, proposals, merges
-- Conventions: snake_case columns; pain.id is a human-readable slug so URLs stay stable.
-- Idempotent: safe to re-run (guards on types, tables, indexes, policies).

do $$ begin
  create type pain_status as enum ('new', 'active', 'merging', 'merged', 'building');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type pain_category as enum ('social', 'work', 'health', 'dev', 'finance', 'community');
exception when duplicate_object then null;
end $$;

create table if not exists public.pains (
  id text primary key,
  title text not null,
  summary text not null,
  tags text[] not null default '{}',
  category pain_category not null,
  status pain_status not null default 'new',
  votes integer not null default 0,
  spec_title text,
  spec_context text,
  spec_root_cause text,
  spec_who_feels_it text,
  spec_why_persists text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists pains_status_idx on public.pains (status);
create index if not exists pains_category_idx on public.pains (category);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  pain_id text not null references public.pains(id) on delete cascade,
  author_name text not null,
  title text not null,
  summary text not null,
  votes integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists proposals_pain_id_idx on public.proposals (pain_id);

-- One proposal per (pain, title) so seed re-runs are idempotent.
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'proposals_pain_title_key'
  ) then
    alter table public.proposals add constraint proposals_pain_title_key unique (pain_id, title);
  end if;
end $$;

create table if not exists public.merges (
  id uuid primary key default gen_random_uuid(),
  pain_id text not null references public.pains(id) on delete cascade,
  title text not null,
  description text not null,
  core_ip text[] not null default '{}',
  compatibility text,
  total_votes integer not null default 0,
  created_at timestamptz not null default now(),
  unique (pain_id)
);

-- Convenience view: pains with live proposal counts so the index page is a single query.
create or replace view public.pains_with_counts as
select
  p.*,
  (select count(*)::int from public.proposals where pain_id = p.id) as proposal_count
from public.pains p;

-- Row-level security
alter table public.pains enable row level security;
alter table public.proposals enable row level security;
alter table public.merges enable row level security;

-- Public read everywhere (Painora is an open library).
drop policy if exists "pains: public read" on public.pains;
create policy "pains: public read" on public.pains
  for select using (true);

drop policy if exists "proposals: public read" on public.proposals;
create policy "proposals: public read" on public.proposals
  for select using (true);

drop policy if exists "merges: public read" on public.merges;
create policy "merges: public read" on public.merges
  for select using (true);

-- Authenticated users can declare pains and submit proposals; they own the row.
drop policy if exists "pains: auth insert" on public.pains;
create policy "pains: auth insert" on public.pains
  for insert to authenticated
  with check (auth.uid() = created_by);

-- Preview phase: allow anonymous declarations from the AI intake flow.
-- Anonymous rows have no owner. Remove this once real auth lands.
drop policy if exists "pains: anon insert (preview)" on public.pains;
create policy "pains: anon insert (preview)" on public.pains
  for insert to anon
  with check (created_by is null);

drop policy if exists "proposals: auth insert" on public.proposals;
create policy "proposals: auth insert" on public.proposals
  for insert to authenticated
  with check (auth.uid() = created_by);

-- Owners can update their own rows (e.g., edit a draft, refine a proposal).
drop policy if exists "pains: owner update" on public.pains;
create policy "pains: owner update" on public.pains
  for update to authenticated
  using (auth.uid() = created_by);

drop policy if exists "proposals: owner update" on public.proposals;
create policy "proposals: owner update" on public.proposals
  for update to authenticated
  using (auth.uid() = created_by);
