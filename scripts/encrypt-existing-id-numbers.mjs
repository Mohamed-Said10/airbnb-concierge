// One-off script — NOT part of the app's request path. Encrypts any
// travelers.id_number values that are still plaintext (i.e. don't already
// match the "v1:iv:tag:data" format written by src/lib/crypto.ts), so
// existing rows get the same at-rest safeguard newly submitted ones do.
//
// Run once, after applying the encryption code change and before/after
// deploying it (safe either way — decryptIdNumber() falls back to returning
// unrecognized values unchanged, so plaintext rows still render correctly
// until this has run):
//
//   node --env-file=.env scripts/encrypt-existing-id-numbers.mjs
//
// Requires NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and
// ID_NUMBER_ENCRYPTION_KEY to be set (same values the app uses).

import { createClient } from '@supabase/supabase-js';
import { createCipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';
const IV_BYTES = 12;
const ALREADY_ENCRYPTED = /^v1:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/;

function getKey() {
  const raw = process.env.ID_NUMBER_ENCRYPTION_KEY;
  if (!raw) throw new Error('ID_NUMBER_ENCRYPTION_KEY is not set');
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) throw new Error('ID_NUMBER_ENCRYPTION_KEY must decode to exactly 32 bytes');
  return key;
}

function encryptIdNumber(plaintext) {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join(':');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

const db = createClient(supabaseUrl, serviceRoleKey);

const { data: travelers, error } = await db.from('travelers').select('id, id_number');
if (error) throw error;

let updated = 0;
let skipped = 0;
for (const traveler of travelers ?? []) {
  if (ALREADY_ENCRYPTED.test(traveler.id_number)) {
    skipped += 1;
    continue;
  }
  const { error: updateError } = await db
    .from('travelers')
    .update({ id_number: encryptIdNumber(traveler.id_number) })
    .eq('id', traveler.id);
  if (updateError) {
    console.error(`Failed to update traveler ${traveler.id}:`, updateError);
    continue;
  }
  updated += 1;
}

console.log(`Done. Encrypted ${updated} row(s), skipped ${skipped} already-encrypted row(s).`);
