'use server';

import { createClient } from '@/lib/supabase/server';

export type VoteResult =
  | { ok: true; votes: number }
  | { ok: false; error: string };

export async function votePain(id: string): Promise<VoteResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('increment_pain_votes', { p_id: id });
  if (error) return { ok: false, error: error.message };
  return { ok: true, votes: data as number };
}

export async function voteProposal(id: string): Promise<VoteResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('increment_proposal_votes', { p_id: id });
  if (error) return { ok: false, error: error.message };
  return { ok: true, votes: data as number };
}
