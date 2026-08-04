-- Run this once in the Supabase SQL Editor.
alter table public.profiles
  add column if not exists role text not null default 'owner'
  check (role in ('owner', 'admin'));

-- Users may update their display name, but never their authorization role.
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Replace the email below with the Supabase account that should be administrator.
-- The account must already exist in Authentication > Users.
update public.profiles
set role = 'admin'
where email = 'm.erguibi02@gmail.com';
