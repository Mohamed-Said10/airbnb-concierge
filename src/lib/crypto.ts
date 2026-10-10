// Application-level encryption for the one field Law 09-08's CNDP treats as
// "sensitive data" requiring an extra safeguard: the guest's national ID /
// passport number (travelers.id_number). Uses Node's built-in crypto
// (no new dependency) with AES-256-GCM.
//
// Requires a 32-byte key, base64-encoded, in ID_NUMBER_ENCRYPTION_KEY.
// Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';
const IV_BYTES = 12;

function getKey(): Buffer {
  const raw = process.env.ID_NUMBER_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('ID_NUMBER_ENCRYPTION_KEY is not set');
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error('ID_NUMBER_ENCRYPTION_KEY must decode to exactly 32 bytes');
  }
  return key;
}

/** Encrypts a plaintext ID number into a versioned "v1:iv:tag:data" string (all base64 parts). */
export function encryptIdNumber(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join(':');
}

/**
 * Decrypts a value produced by encryptIdNumber. Values that don't match the
 * versioned format are returned unchanged, so legacy plaintext rows (from
 * before this field was encrypted) still render correctly until the one-off
 * backfill script (scripts/encrypt-existing-id-numbers.mjs) has run.
 */
export function decryptIdNumber(stored: string): string {
  const parts = stored.split(':');
  if (parts.length !== 4 || parts[0] !== VERSION) return stored;
  const [, ivB64, tagB64, dataB64] = parts;
  try {
    const key = getKey();
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, 'base64'));
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataB64, 'base64')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('[crypto] failed to decrypt id_number', error);
    return stored;
  }
}
