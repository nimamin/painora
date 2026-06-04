'use server';

import { createClient } from '@/lib/supabase/server';

export type PublishSpec = {
  title: string;
  context: string;
  rootCause: string;
  whoFeelsIt: string;
  whyItPersists: string;
};

export type PublishResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return base || 'pain';
}

export async function publishPain(spec: PublishSpec): Promise<PublishResult> {
  const title = spec.title?.trim();
  if (!title) return { ok: false, error: 'Pain title is required.' };

  const supabase = await createClient();
  const baseSlug = slugify(title);

  // Ensure a unique slug: baseSlug, baseSlug-2, baseSlug-3, …
  let id = baseSlug;
  for (let attempt = 0; attempt < 25; attempt++) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const { data: existing, error: lookupError } = await supabase
      .from('pains')
      .select('id')
      .eq('id', candidate)
      .maybeSingle();
    if (lookupError) return { ok: false, error: lookupError.message };
    if (!existing) {
      id = candidate;
      break;
    }
  }

  const { error } = await supabase.from('pains').insert({
    id,
    title,
    // Use the AI's context as the public summary fallback.
    summary: spec.context?.trim() || title,
    tags: [],
    category: 'social',
    status: 'new',
    votes: 0,
    spec_title: spec.title?.trim() || null,
    spec_context: spec.context?.trim() || null,
    spec_root_cause: spec.rootCause?.trim() || null,
    spec_who_feels_it: spec.whoFeelsIt?.trim() || null,
    spec_why_persists: spec.whyItPersists?.trim() || null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, id };
}
