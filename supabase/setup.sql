-- Painora full setup: schema + seed.
-- Paste this entire file into Supabase dashboard -> SQL Editor -> New query -> Run.
-- Idempotent: safe to re-run.

-- ============================================================
-- 1. SCHEMA
-- ============================================================

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

-- ============================================================
-- 2. SEED DATA
-- ============================================================

-- Seed the pain library + the demo Merge Festival used by /merge.
-- Idempotent: safe to re-run during local development.

insert into public.pains (id, title, summary, tags, category, status, votes,
  spec_title, spec_context, spec_root_cause, spec_who_feels_it, spec_why_persists)
values
  (
    'birthday-blindspot',
    'I always forget my friends'' birthdays until the day of',
    'I find out someone''s birthday is today only because social media tells me. By then it''s too late to do anything meaningful.',
    array['relationships','personal','memory'],
    'social', 'merging', 1842,
    'Proactive birthday awareness for close relationships',
    'Happens throughout the year, mostly noticed on the day of a birthday when a notification from social media is the only signal.',
    'Birthdays are stored in scattered apps (contacts, Facebook, calendars) with no unified early-warning system tied to relationship closeness.',
    'Adults with 50+ contacts who want to maintain meaningful relationships but lack a system for doing so.',
    'Existing calendar apps treat all events equally; no tool weights reminders by how much you care about a person.'
  ),
  (
    'team-knowledge-loss',
    'Critical knowledge disappears when teammates leave',
    'Every time someone leaves the team, months of context — decisions, tradeoffs, why things are the way they are — walks out with them.',
    array['knowledge management','remote work','teams'],
    'work', 'active', 3210,
    'Institutional memory preservation for distributed teams',
    'Surfaces whenever a senior employee departs or a new hire joins a project mid-way through.',
    'Tacit knowledge lives in people''s heads, Slack threads, and meeting recordings that are never indexed or surfaced.',
    'Engineering and product teams at fast-growing companies with high turnover or frequent context switches.',
    'Documentation is effortful and feels unrewarding; no tool makes capturing knowledge as easy as the conversation that created it.'
  ),
  (
    'insurance-doctor-maze',
    'I can''t find a doctor who takes my insurance and is actually available',
    'Insurance directories are outdated. Half the doctors listed are not accepting new patients. Finding someone takes hours.',
    array['healthcare','access','insurance'],
    'health', 'active', 5540,
    'Real-time in-network provider availability finder',
    'Experienced any time someone needs a new specialist or primary care physician and must navigate the insurer''s provider directory.',
    'Insurance directories are updated quarterly at best; actual acceptance status and availability is not surfaced anywhere.',
    'Anyone with employer or marketplace insurance, especially people new to a city or switching plans.',
    'Insurers have no financial incentive to maintain accurate directories; doctors have no easy way to broadcast real-time availability.'
  ),
  (
    'oss-abandonment',
    'Open source tools I depend on get abandoned without warning',
    'I build on open source libraries only to wake up one day to a deprecation notice, a broken dependency, or a repository gone dark.',
    array['developer','open source','tooling'],
    'dev', 'new', 2100,
    'Open source dependency health and succession monitoring',
    'Affects developers during dependency updates, security audits, or when a critical bug needs a fix from an unmaintained library.',
    'OSS maintainers burn out silently; there''s no standard signal for "this project is at risk" before it''s already abandoned.',
    'Software engineers and teams whose production systems depend on community-maintained packages.',
    'GitHub and npm surface popularity metrics but not maintainer health signals or succession plans.'
  ),
  (
    'expense-receipt-chaos',
    'Tracking receipts for expense reports costs me hours every month',
    'I spend a Friday afternoon each month hunting through emails, wallets, and photos for receipts I should have saved three weeks ago.',
    array['finance','productivity','admin'],
    'finance', 'active', 4120,
    'Passive receipt capture and categorization at point of spend',
    'Happens at month-end when submitting expenses, but the root friction occurs at every purchase throughout the month.',
    'Receipts are created at purchase but expense reports are compiled weeks later — the two moments are never connected in real time.',
    'Employees who travel or spend on behalf of companies, especially those without corporate cards.',
    'Current solutions require deliberate manual action at the moment of purchase, which breaks down under cognitive load.'
  ),
  (
    'elderly-tech-support',
    'My parents call me for tech support every week',
    'I love my parents. I do not love explaining how to update an app, reconnect to wifi, or find a photo they accidentally deleted — for the fourth time.',
    array['family','tech support','accessibility'],
    'community', 'new', 6890,
    'Guided self-recovery system for non-technical device users',
    'Occurs daily for elderly users when routine device behavior changes unexpectedly — updates, UI shifts, accidental setting changes.',
    'Consumer device UX assumes familiarity that elderly users often lack; help systems require the same literacy they''re trying to support.',
    'Adults 65+ and the adult children who become their default IT support.',
    'Device manufacturers optimise for tech-savvy early adopters; accessibility features exist but are buried and reactive rather than proactive.'
  ),
  (
    'freelancer-trust-gap',
    'I can''t tell if a freelancer is genuinely good before I hire them',
    'Portfolios are curated, reviews are gamed, and the only real signal is a $3,000 mistake.',
    array['hiring','freelance','trust'],
    'work', 'active', 2980,
    'Verified skill demonstration layer for freelancer hiring',
    'Experienced at the moment of hiring — reviewing profiles, comparing bids, and trying to predict quality from indirect signals.',
    'Current platforms optimise for transaction volume; verified, structured proof of work is absent or easily faked.',
    'Small business owners and product teams hiring for short-term specialised work.',
    'Skill verification is expensive and slow; platforms earn from volume, not match quality.'
  ),
  (
    'local-event-scatter',
    'Local events are scattered across a dozen apps and nobody knows what''s on',
    'There''s always something happening in my city, but finding it means checking Eventbrite, Facebook, Meetup, Instagram, and the neighbourhood WhatsApp group.',
    array['community','local','discovery'],
    'community', 'new', 1560,
    'Unified local event discovery with community signal ranking',
    'Happens on weekends or whenever someone wants to do something social without a specific plan in mind.',
    'Event creation is fragmented across platforms for social/algorithmic reasons; no neutral aggregation layer exists with community trust signals.',
    'Urban residents who want spontaneous local connection but lack the time to monitor multiple platforms.',
    'Each platform is incentivised to keep users inside its own walls; aggregators have been tried but die without community buy-in.'
  )
on conflict (id) do nothing;

-- Demo proposals for the Merge Festival pain.
insert into public.proposals (pain_id, author_name, title, summary, votes) values
  (
    'birthday-blindspot',
    'M. Reyes',
    'A relationship graph with weighted reminder cadences',
    'Map contacts by closeness tier. Surface reminders 7, 3, and 1 day before — only for people who matter most.',
    214
  ),
  (
    'birthday-blindspot',
    'S. Nakamura',
    'Native OS calendar + gift-suggestion AI layer',
    'Sync across all contact sources. One day before, surface a curated shortlist of meaningful gifts based on past interactions.',
    189
  ),
  (
    'birthday-blindspot',
    'K. Osei',
    'Community-shared birthday rituals',
    'Let mutual friends coordinate on a shared gift or message. One platform entry, zero coordination overhead.',
    143
  )
on conflict (pain_id, title) do nothing;

-- Additional proposals across the rest of the library so every pain has content.
insert into public.proposals (pain_id, author_name, title, summary, votes) values
  ('team-knowledge-loss', 'D. Okafor', 'Auto-generated decision logs from existing tools', 'Passively index Slack threads, PR reviews, and meeting transcripts into a searchable "why" tied to each decision.', 198),
  ('team-knowledge-loss', 'L. Chen', 'AI exit interviews that become onboarding docs', 'When someone gives notice, a structured AI interview captures their context and hands it to their successor.', 156),
  ('insurance-doctor-maze', 'P. Alvarez', 'Crowdsourced real-time availability', 'Patients report acceptance status after each call; fresh data outranks stale insurer listings.', 241),
  ('insurance-doctor-maze', 'R. Banerjee', 'Nightly automated verification calls', 'Bots confirm each provider''s acceptance and next opening, replacing quarterly directory dumps.', 203),
  ('oss-abandonment', 'T. Muller', 'Maintainer health scoring', 'Score dependencies on commit cadence, bus factor, and responsiveness; warn before a project goes dark.', 167),
  ('oss-abandonment', 'J. Park', 'Escrowed succession plans', 'Maintainers name successors and fund a handover bounty so critical libraries never orphan silently.', 132),
  ('expense-receipt-chaos', 'M. Rossi', 'Card-linked auto-capture', 'Link a card; each charge drafts an expense and asks for a photo in the moment, not at month-end.', 188),
  ('expense-receipt-chaos', 'A. Haddad', 'Forward-to-inbox receipt parser', 'Forward any receipt to one address; AI extracts vendor, amount, and category into a ready report.', 149),
  ('elderly-tech-support', 'C. Nwosu', 'One-tap guided recovery', 'A persistent help button walks through the exact fix in large, jargon-free steps, with remote assist as fallback.', 276),
  ('elderly-tech-support', 'S. Petrova', 'Change-aware companion mode', 'Detect when an update moved the UI and show "here''s what changed" before confusion starts.', 214),
  ('freelancer-trust-gap', 'F. Costa', 'Paid micro-trial tasks', 'Standardized small paid tasks let buyers see real quality before committing to a full contract.', 172),
  ('freelancer-trust-gap', 'N. Adeyemi', 'Verified outcome ledger', 'Signed records of completed work and client sign-off that can''t be gamed or faked.', 141),
  ('local-event-scatter', 'G. Russo', 'Neutral aggregation + community ranking', 'Pull every platform''s public feed and rank by neighbor signals instead of paid promotion.', 128),
  ('local-event-scatter', 'H. Kim', 'Friend-graph event surfacing', 'Show what people you trust are actually attending, not what algorithms push.', 97)
on conflict (pain_id, title) do nothing;

-- The merged result rendered on /merge.
insert into public.merges (pain_id, title, description, core_ip, compatibility, total_votes) values
  (
    'birthday-blindspot',
    'Relationship-aware birthday OS with gift intelligence',
    'A unified system that maps contact closeness, syncs across all calendar sources, and surfaces proactive reminders with curated gift ideas — weighted by how much you care about each person.',
    array['M. Reyes','S. Nakamura'],
    '98% overlap',
    403
  )
on conflict (pain_id) do nothing;
