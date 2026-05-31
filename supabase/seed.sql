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
on conflict do nothing;

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
