-- Run once in the Supabase SQL Editor. Adds a 3-month free trial window for
-- new property-owner signups. Informational only — nothing is gated on this
-- yet, it's just tracked and shown in the dashboard.

alter table public.profiles add column if not exists trial_ends_at timestamptz;

-- New signups get a trial window starting now. Existing accounts are left
-- with trial_ends_at = null on purpose — they're already-established users,
-- not new trial signups, and the dashboard only shows the banner when this
-- column is set.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, trial_ends_at)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email, now() + interval '3 months');
  return new;
end;
$$;
