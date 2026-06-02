// Applies supabase/migrations/0001_init.sql + supabase/seed.sql to the database.
// Connection resolution order:
//   1. DATABASE_URL env var (full postgres connection string) — used as-is.
//   2. Otherwise: probe Supabase session-pooler across regions using
//      project ref (from NEXT_PUBLIC_SUPABASE_URL) + DB_PASSWORD.
//
// Usage:
//   node scripts/apply-schema.mjs
//   DATABASE_URL='postgresql://...' node scripts/apply-schema.mjs

import { readFile } from 'node:fs/promises';
import './load-env.mjs';
import pg from 'pg';

const { Client } = pg;

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const ref = PROJECT_URL.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
const password = process.env.DB_PASSWORD;

const REGIONS = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-central-2', 'eu-north-1',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1',
  'sa-east-1', 'ca-central-1',
];

function candidates() {
  if (process.env.DATABASE_URL) return [process.env.DATABASE_URL];
  if (!ref || !password) return [];
  const enc = encodeURIComponent(password);
  const urls = [];
  // Session pooler (port 5432) — supports multi-statement DDL.
  // Newer projects live on aws-1-* infra; older ones on aws-0-*. Try both.
  for (const prefix of ['aws-1', 'aws-0']) {
    for (const r of REGIONS) {
      urls.push(`postgresql://postgres.${ref}:${enc}@${prefix}-${r}.pooler.supabase.com:5432/postgres`);
    }
  }
  // Direct connection (IPv6, often unreachable locally) as a last resort.
  urls.push(`postgresql://postgres:${enc}@db.${ref}.supabase.co:5432/postgres`);
  return urls;
}

async function connect() {
  const list = candidates();
  if (list.length === 0) {
    throw new Error('No connection info. Set DATABASE_URL, or NEXT_PUBLIC_SUPABASE_URL + DB_PASSWORD.');
  }
  for (const conn of list) {
    const safe = conn.replace(/:[^:@]+@/, ':****@');
    const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 6000 });
    try {
      await client.connect();
      console.log('✓ Connected via', safe);
      return client;
    } catch (e) {
      console.log('  ✗', safe, '—', e.message);
      try { await client.end(); } catch {}
    }
  }
  throw new Error('Could not connect on any candidate host.');
}

const client = await connect();

try {
  const schema = await readFile(new URL('../supabase/migrations/0001_init.sql', import.meta.url), 'utf8');
  const seed = await readFile(new URL('../supabase/seed.sql', import.meta.url), 'utf8');

  console.log('\nApplying schema…');
  await client.query(schema);
  console.log('✓ Schema applied');

  console.log('Applying seed…');
  await client.query(seed);
  console.log('✓ Seed applied');

  const { rows } = await client.query('select count(*)::int as n from public.pains');
  const { rows: pr } = await client.query('select count(*)::int as n from public.proposals');
  const { rows: mr } = await client.query('select count(*)::int as n from public.merges');
  console.log(`\nRow counts → pains: ${rows[0].n}, proposals: ${pr[0].n}, merges: ${mr[0].n}`);
} finally {
  await client.end();
}
