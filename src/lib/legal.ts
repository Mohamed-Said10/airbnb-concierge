// Shared constants for legal/compliance-related code, so the privacy policy
// text and the code that stamps consent/retention values can't drift apart.

// Bump this whenever PrivacyContent.tsx's substance changes; guest consent
// records store the version that was in effect when they consented.
export const PRIVACY_POLICY_VERSION = '2026-06';

// How long guest personal data (name, ID details, ID photos, signature) is
// kept after checkout before the purge cron deletes it, per Law 09-08's
// "no longer than necessary for the purpose" principle. Placeholder default
// of 365 days — confirm the legally-justified number and adjust here only.
export const GUEST_DATA_RETENTION_DAYS = 365;
