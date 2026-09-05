-- Run once in the Supabase SQL Editor. Adds an optional per-property
-- notification email, so guest-registration notifications for a property can
-- go to a specific inbox (e.g. a co-host or caretaker) instead of always the
-- account owner's login email.

alter table public.properties add column if not exists notification_email text;
