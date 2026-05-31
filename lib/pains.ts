export interface Pain {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  category: 'social' | 'work' | 'health' | 'dev' | 'finance' | 'community';
  status: 'new' | 'active' | 'merging';
  votes: number;
  proposals: number;
  spec: {
    title: string;
    context: string;
    rootCause: string;
    whoFeelsIt: string;
    whyItPersists: string;
  };
}

export const PAINS: Pain[] = [
  {
    id: 'birthday-blindspot',
    title: "I always forget my friends' birthdays until the day of",
    summary:
      "I find out someone's birthday is today only because social media tells me. By then it's too late to do anything meaningful.",
    tags: ['relationships', 'personal', 'memory'],
    category: 'social',
    status: 'merging',
    votes: 1842,
    proposals: 7,
    spec: {
      title: 'Proactive birthday awareness for close relationships',
      context:
        'Happens throughout the year, mostly noticed on the day of a birthday when a notification from social media is the only signal.',
      rootCause:
        'Birthdays are stored in scattered apps (contacts, Facebook, calendars) with no unified early-warning system tied to relationship closeness.',
      whoFeelsIt:
        'Adults with 50+ contacts who want to maintain meaningful relationships but lack a system for doing so.',
      whyItPersists:
        'Existing calendar apps treat all events equally; no tool weights reminders by how much you care about a person.',
    },
  },
  {
    id: 'team-knowledge-loss',
    title: 'Critical knowledge disappears when teammates leave',
    summary:
      'Every time someone leaves the team, months of context — decisions, tradeoffs, why things are the way they are — walks out with them.',
    tags: ['knowledge management', 'remote work', 'teams'],
    category: 'work',
    status: 'active',
    votes: 3210,
    proposals: 12,
    spec: {
      title: 'Institutional memory preservation for distributed teams',
      context:
        'Surfaces whenever a senior employee departs or a new hire joins a project mid-way through.',
      rootCause:
        "Tacit knowledge lives in people's heads, Slack threads, and meeting recordings that are never indexed or surfaced.",
      whoFeelsIt:
        'Engineering and product teams at fast-growing companies with high turnover or frequent context switches.',
      whyItPersists:
        'Documentation is effortful and feels unrewarding; no tool makes capturing knowledge as easy as the conversation that created it.',
    },
  },
  {
    id: 'insurance-doctor-maze',
    title: "I can't find a doctor who takes my insurance and is actually available",
    summary:
      'Insurance directories are outdated. Half the doctors listed are not accepting new patients. Finding someone takes hours.',
    tags: ['healthcare', 'access', 'insurance'],
    category: 'health',
    status: 'active',
    votes: 5540,
    proposals: 9,
    spec: {
      title: 'Real-time in-network provider availability finder',
      context:
        "Experienced any time someone needs a new specialist or primary care physician and must navigate the insurer's provider directory.",
      rootCause:
        'Insurance directories are updated quarterly at best; actual acceptance status and availability is not surfaced anywhere.',
      whoFeelsIt:
        'Anyone with employer or marketplace insurance, especially people new to a city or switching plans.',
      whyItPersists:
        'Insurers have no financial incentive to maintain accurate directories; doctors have no easy way to broadcast real-time availability.',
    },
  },
  {
    id: 'oss-abandonment',
    title: 'Open source tools I depend on get abandoned without warning',
    summary:
      'I build on open source libraries only to wake up one day to a deprecation notice, a broken dependency, or a repository gone dark.',
    tags: ['developer', 'open source', 'tooling'],
    category: 'dev',
    status: 'new',
    votes: 2100,
    proposals: 4,
    spec: {
      title: 'Open source dependency health and succession monitoring',
      context:
        'Affects developers during dependency updates, security audits, or when a critical bug needs a fix from an unmaintained library.',
      rootCause:
        'OSS maintainers burn out silently; there\'s no standard signal for "this project is at risk" before it\'s already abandoned.',
      whoFeelsIt:
        'Software engineers and teams whose production systems depend on community-maintained packages.',
      whyItPersists:
        'GitHub and npm surface popularity metrics but not maintainer health signals or succession plans.',
    },
  },
  {
    id: 'expense-receipt-chaos',
    title: 'Tracking receipts for expense reports costs me hours every month',
    summary:
      'I spend a Friday afternoon each month hunting through emails, wallets, and photos for receipts I should have saved three weeks ago.',
    tags: ['finance', 'productivity', 'admin'],
    category: 'finance',
    status: 'active',
    votes: 4120,
    proposals: 6,
    spec: {
      title: 'Passive receipt capture and categorization at point of spend',
      context:
        'Happens at month-end when submitting expenses, but the root friction occurs at every purchase throughout the month.',
      rootCause:
        'Receipts are created at purchase but expense reports are compiled weeks later — the two moments are never connected in real time.',
      whoFeelsIt:
        'Employees who travel or spend on behalf of companies, especially those without corporate cards.',
      whyItPersists:
        'Current solutions require deliberate manual action at the moment of purchase, which breaks down under cognitive load.',
    },
  },
  {
    id: 'elderly-tech-support',
    title: 'My parents call me for tech support every week',
    summary:
      'I love my parents. I do not love explaining how to update an app, reconnect to wifi, or find a photo they accidentally deleted — for the fourth time.',
    tags: ['family', 'tech support', 'accessibility'],
    category: 'community',
    status: 'new',
    votes: 6890,
    proposals: 11,
    spec: {
      title: 'Guided self-recovery system for non-technical device users',
      context:
        'Occurs daily for elderly users when routine device behavior changes unexpectedly — updates, UI shifts, accidental setting changes.',
      rootCause:
        "Consumer device UX assumes familiarity that elderly users often lack; help systems require the same literacy they're trying to support.",
      whoFeelsIt:
        'Adults 65+ and the adult children who become their default IT support.',
      whyItPersists:
        'Device manufacturers optimise for tech-savvy early adopters; accessibility features exist but are buried and reactive rather than proactive.',
    },
  },
  {
    id: 'freelancer-trust-gap',
    title: "I can't tell if a freelancer is genuinely good before I hire them",
    summary:
      'Portfolios are curated, reviews are gamed, and the only real signal is a $3,000 mistake.',
    tags: ['hiring', 'freelance', 'trust'],
    category: 'work',
    status: 'active',
    votes: 2980,
    proposals: 8,
    spec: {
      title: 'Verified skill demonstration layer for freelancer hiring',
      context:
        'Experienced at the moment of hiring — reviewing profiles, comparing bids, and trying to predict quality from indirect signals.',
      rootCause:
        'Current platforms optimise for transaction volume; verified, structured proof of work is absent or easily faked.',
      whoFeelsIt:
        'Small business owners and product teams hiring for short-term specialised work.',
      whyItPersists:
        'Skill verification is expensive and slow; platforms earn from volume, not match quality.',
    },
  },
  {
    id: 'local-event-scatter',
    title: "Local events are scattered across a dozen apps and nobody knows what's on",
    summary:
      "There's always something happening in my city, but finding it means checking Eventbrite, Facebook, Meetup, Instagram, and the neighbourhood WhatsApp group.",
    tags: ['community', 'local', 'discovery'],
    category: 'community',
    status: 'new',
    votes: 1560,
    proposals: 5,
    spec: {
      title: 'Unified local event discovery with community signal ranking',
      context:
        'Happens on weekends or whenever someone wants to do something social without a specific plan in mind.',
      rootCause:
        'Event creation is fragmented across platforms for social/algorithmic reasons; no neutral aggregation layer exists with community trust signals.',
      whoFeelsIt:
        'Urban residents who want spontaneous local connection but lack the time to monitor multiple platforms.',
      whyItPersists:
        'Each platform is incentivised to keep users inside its own walls; aggregators have been tried but die without community buy-in.',
    },
  },
];

export const CATEGORY_COLOR: Record<Pain['category'], string> = {
  social: '#f3a35c',
  work: '#68c7d1',
  health: '#e87ea1',
  dev: '#9b8aff',
  finance: '#f5d76e',
  community: '#7ec99b',
};

export const STATUS_LABEL: Record<Pain['status'], string> = {
  new: 'New',
  active: 'Active',
  merging: 'Merging',
};

export function getPain(id: string): Pain | undefined {
  return PAINS.find((p) => p.id === id);
}
