// Pure string masking, no crypto — kept separate from src/lib/crypto.ts so
// it can be imported from client components (e.g. ExportButton.tsx) without
// pulling Node's `crypto` module into the browser bundle.

/** Masks an ID number for display where the full value isn't needed (e.g. "••••1234"). */
export function maskIdNumber(plaintext: string): string {
  const visible = plaintext.slice(-4);
  return plaintext.length <= 4 ? plaintext : `${'•'.repeat(plaintext.length - 4)}${visible}`;
}
