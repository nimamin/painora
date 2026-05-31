# Supabase

Schema and seed data for Painora. The Next.js app reads these tables via `@supabase/ssr`.

## One-time setup

1. Create a Supabase project at https://supabase.com/dashboard.
2. Copy the project URL and anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. Install the CLI: `brew install supabase/tap/supabase`.
4. From the repo root: `supabase link --project-ref <ref>`.
5. Apply the schema and seed: `supabase db push && psql "$DATABASE_URL" < supabase/seed.sql`
   (or paste both SQL files into the Supabase dashboard SQL editor).

## What's here

- `migrations/0001_init.sql` — tables, enums, indexes, RLS policies, and a `pains_with_counts` view.
- `seed.sql` — the 8 demo pains, 3 proposals on `birthday-blindspot`, and the merged result rendered on `/merge`. Re-runnable (uses `on conflict do nothing`).

## Schema

- `pains` — slug PK, title/summary/tags/category/status/votes, plus the 5 spec fields inline.
- `proposals` — solutions submitted against a pain.
- `merges` — the merged blueprint produced from overlapping proposals (one per pain).

RLS is public-read everywhere; writes require an authenticated user who owns the row.
