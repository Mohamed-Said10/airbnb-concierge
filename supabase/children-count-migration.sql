-- Run once in the Supabase SQL Editor. Adds a children count to guest
-- registrations — collected as a headcount only (no individual ID info),
-- since minors don't fill their own traveler forms.

alter table public.guest_registrations add column if not exists children_count integer not null default 0;
alter table public.guest_registrations drop constraint if exists guest_registrations_children_count_check;
alter table public.guest_registrations add constraint guest_registrations_children_count_check check (children_count >= 0);
