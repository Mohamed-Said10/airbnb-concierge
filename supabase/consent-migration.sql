-- Run once in the Supabase SQL Editor. Records the guest's consent to the
-- collection of their personal data (Law 09-08 requires consent to be
-- specific and evidenced, not just implied). Stored on the registration row
-- itself, not a separate table, so it is deleted together with the guest's
-- personal data when the registration is deleted — no orphaned consent
-- record survives an erasure.

alter table public.guest_registrations add column if not exists consent_given_at timestamptz;
alter table public.guest_registrations add column if not exists consent_ip text;
alter table public.guest_registrations add column if not exists consent_policy_version text;
