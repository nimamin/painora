// Minimal .env loader that ALWAYS lets the file win over the shell environment.
// Node's built-in --env-file does the opposite (shell env takes precedence), which
// silently shadowed our values. Import this for side effects before reading env.
import { readFileSync } from 'node:fs';

export function loadEnv(path = '.env') {
  let raw;
  try {
    raw = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    // Strip surrounding quotes if present.
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val; // file wins
  }
}

loadEnv();
