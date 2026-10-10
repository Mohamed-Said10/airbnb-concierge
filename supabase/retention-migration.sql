-- Run once in the Supabase SQL Editor. Adds an enforced retention window for
-- guest personal data (Law 09-08: data must not be kept longer than the
-- purpose requires). New registrations get retention_until set at insert
-- time (see GUEST_DATA_RETENTION_DAYS in src/app/api/guest-identity/route.ts);
-- existing rows are backfilled here to the same default so the purge cron
-- (src/app/api/cron/purge-expired-registrations/route.ts) has something
-- sane to work from until the owner confirms/adjusts the retention period.

alter table public.guest_registrations add column if not exists retention_until date;

update public.guest_registrations
  set retention_until = (check_out_date + interval '365 days')::date
  where retention_until is null;

create index if not exists guest_registrations_retention_until_idx
  on public.guest_registrations (retention_until);
