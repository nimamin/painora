import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client (Client Components).
// Uses the publishable key — safe to ship to the browser; RLS enforces access.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
