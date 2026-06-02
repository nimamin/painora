// Shared domain types + presentational constants.
// Data access lives in lib/data.ts (queries Supabase).

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

export interface Proposal {
  id: string;
  author: string;
  title: string;
  summary: string;
  votes: number;
}

export interface Merge {
  id: string;
  painId: string;
  title: string;
  description: string;
  coreIp: string[];
  compatibility: string;
  totalVotes: number;
}

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
