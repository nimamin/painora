import './load-env.mjs';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('URL present:', Boolean(url));
console.log('Publishable key present:', Boolean(key));

if (!url || !key) {
  console.error('Missing env vars.');
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error, count } = await supabase
  .from('pains')
  .select('id, title, status', { count: 'exact' })
  .limit(3);

if (error) {
  console.error('\nQuery error:');
  console.error('  code:   ', error.code);
  console.error('  message:', error.message);
  console.error('  hint:   ', error.hint ?? '(none)');
  process.exit(2);
}

console.log('\n✓ Connected. Row count:', count);
console.log('Sample rows:', JSON.stringify(data, null, 2));
