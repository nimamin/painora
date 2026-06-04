// Server-side data access for Painora. Reads through the publishable key;
// RLS allows public select on all three tables.
import { createClient } from '@/lib/supabase/server';
import type { Pain, Proposal, Merge } from '@/lib/pains';

type PainRow = {
  id: string;
  title: string;
  summary: string;
  tags: string[] | null;
  category: Pain['category'];
  status: Pain['status'];
  votes: number;
  spec_title: string | null;
  spec_context: string | null;
  spec_root_cause: string | null;
  spec_who_feels_it: string | null;
  spec_why_persists: string | null;
  proposal_count: number | null;
};

type ProposalRow = {
  id: string;
  author_name: string;
  title: string;
  summary: string;
  votes: number;
};

type MergeRow = {
  id: string;
  pain_id: string;
  title: string;
  description: string;
  core_ip: string[] | null;
  compatibility: string | null;
  total_votes: number;
};

function mapPain(row: PainRow): Pain {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    tags: row.tags ?? [],
    category: row.category,
    status: row.status,
    votes: row.votes,
    proposals: row.proposal_count ?? 0,
    spec: {
      title: row.spec_title ?? '',
      context: row.spec_context ?? '',
      rootCause: row.spec_root_cause ?? '',
      whoFeelsIt: row.spec_who_feels_it ?? '',
      whyItPersists: row.spec_why_persists ?? '',
    },
  };
}

function mapProposal(row: ProposalRow): Proposal {
  return {
    id: row.id,
    author: row.author_name,
    title: row.title,
    summary: row.summary,
    votes: row.votes,
  };
}

export async function getPains(): Promise<Pain[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pains_with_counts')
    .select('*')
    .order('votes', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as PainRow[]).map(mapPain);
}

export async function getPainById(id: string): Promise<Pain | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pains_with_counts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPain(data as PainRow) : null;
}

export async function getProposals(painId: string): Promise<Proposal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('pain_id', painId)
    .order('votes', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as ProposalRow[]).map(mapProposal);
}

export async function getMerge(painId: string): Promise<Merge | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('merges')
    .select('*')
    .eq('pain_id', painId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as MergeRow;
  return {
    id: row.id,
    painId: row.pain_id,
    title: row.title,
    description: row.description,
    coreIp: row.core_ip ?? [],
    compatibility: row.compatibility ?? '',
    totalVotes: row.total_votes,
  };
}
