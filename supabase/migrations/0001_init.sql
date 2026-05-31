-- Painora core schema
-- Tables: pains, proposals, merges
-- Conventions: snake_case columns; pain.id is a human-readable slug so URLs stay stable.

create type pain_status as enum ('new', 'active', 'merging', 'merged', 'building');
create type pain_category as enum ('social', 'work', 'health', 'dev', 'finance', 'community');

create table public.pains (
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

create index pains_status_idx on public.pains (status);
create index pains_category_idx on public.pains (category);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  pain_id text not null references public.pains(id) on delete cascade,
  author_name text not null,
  title text not null,
  summary text not null,
  votes integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index proposals_pain_id_idx on public.proposals (pain_id);

create table public.merges (
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
create view public.pains_with_counts as
select
  p.*,
  (select count(*)::int from public.proposals where pain_id = p.id) as proposal_count
from public.pains p;

-- Row-level security
alter table public.pains enable row level security;
alter table public.proposals enable row level security;
alter table public.merges enable row level security;

-- Public read everywhere (Painora is an open library).
create policy "pains: public read" on public.pains
  for select using (true);
create policy "proposals: public read" on public.proposals
  for select using (true);
create policy "merges: public read" on public.merges
  for select using (true);

-- Authenticated users can declare pains and submit proposals; they own the row.
create policy "pains: auth insert" on public.pains
  for insert to authenticated
  with check (auth.uid() = created_by);
create policy "proposals: auth insert" on public.proposals
  for insert to authenticated
  with check (auth.uid() = created_by);

-- Owners can update their own rows (e.g., edit a draft, refine a proposal).
create policy "pains: owner update" on public.pains
  for update to authenticated
  using (auth.uid() = created_by);
create policy "proposals: owner update" on public.proposals
  for update to authenticated
  using (auth.uid() = created_by);
