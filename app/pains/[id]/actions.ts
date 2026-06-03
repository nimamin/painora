'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type SubmitProposalInput = {
  painId: string;
  author: string;
  title: string;
  summary: string;
};

export type SubmitProposalResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitProposal(
  input: SubmitProposalInput,
): Promise<SubmitProposalResult> {
  const painId = input.painId?.trim();
  const author = input.author?.trim();
  const title = input.title?.trim();
  const summary = input.summary?.trim();

  if (!painId) return { ok: false, error: 'Missing pain.' };
  if (!author) return { ok: false, error: 'Please add your name.' };
  if (!title) return { ok: false, error: 'A title is required.' };
  if (!summary) return { ok: false, error: 'Describe your approach.' };

  const supabase = await createClient();

  // Confirm the pain exists (clearer error than a FK violation).
  const { data: pain, error: lookupError } = await supabase
    .from('pains')
    .select('id')
    .eq('id', painId)
    .maybeSingle();
  if (lookupError) return { ok: false, error: lookupError.message };
  if (!pain) return { ok: false, error: 'That pain no longer exists.' };

  const { error } = await supabase.from('proposals').insert({
    pain_id: painId,
    author_name: author,
    title,
    summary,
    votes: 0,
  });

  if (error) {
    // Unique (pain_id, title) collision → friendlier message.
    if (error.code === '23505') {
      return { ok: false, error: 'A proposal with that title already exists for this pain.' };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/pains/${painId}`);
  return { ok: true };
}
