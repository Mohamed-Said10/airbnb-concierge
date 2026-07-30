-- Run this file in Supabase SQL Editor.
-- Tables are ordered by dependency: profiles/properties first, then registrations/travelers.

-- ─── Profiles (auto-created on signup) ───────────────────────────────────────

create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  full_name  text,
  email      text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Properties ──────────────────────────────────────────────────────────────

create table if not exists public.properties (
  id         uuid default gen_random_uuid() primary key,
  owner_id   uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  address    text,
  slug       text unique not null,
  created_at timestamptz default now()
);

alter table public.properties enable row level security;

create policy "Owners can manage own properties"
  on public.properties for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Anyone can look up property by slug"
  on public.properties for select using (true);

-- ─── Guest Registrations ─────────────────────────────────────────────────────

create table if not exists public.guest_registrations (
  id            uuid default gen_random_uuid() primary key,
  check_in_date date not null,
  check_out_date date not null,
  signature_url text,
  property_ref  text,
  property_id   uuid references public.properties(id) on delete set null,
  created_at    timestamptz default now()
);

alter table public.guest_registrations enable row level security;

create policy "Anyone can insert registrations"
  on public.guest_registrations for insert
  with check (true);

create policy "Owners can view their property registrations"
  on public.guest_registrations for select
  using (
    property_id in (
      select id from public.properties where owner_id = auth.uid()
    )
  );

-- ─── Travelers ────────────────────────────────────────────────────────────────

create table if not exists public.travelers (
  id                  uuid default gen_random_uuid() primary key,
  registration_id     uuid references public.guest_registrations(id) on delete cascade not null,
  first_name          text not null,
  last_name           text not null,
  date_of_birth       date,
  place_of_birth      text,
  nationality         text,
  id_type             text,
  id_number           text,
  id_expiry_date      date,
  address             text,
  id_front_photo_url  text,
  id_back_photo_url   text
);

alter table public.travelers enable row level security;

create policy "Anyone can insert travelers"
  on public.travelers for insert
  with check (true);

create policy "Owners can view travelers on their registrations"
  on public.travelers for select
  using (
    registration_id in (
      select gr.id from public.guest_registrations gr
      join public.properties p on p.id = gr.property_id
      where p.owner_id = auth.uid()
    )
  );

-- ─── Contact Leads ────────────────────────────────────────────────────────────

create table if not exists public.contact_leads (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  email         text not null,
  phone         text,
  property_type text,
  message       text not null,
  status        text default 'new',
  created_at    timestamptz default now()
);

alter table public.contact_leads enable row level security;

create policy "Anyone can insert leads"
  on public.contact_leads for insert
  with check (true);

-- Add property_id to existing guest_registrations table (safe to run multiple times)
alter table public.guest_registrations
  add column if not exists property_id uuid references public.properties(id) on delete set null;

-- Indexes
create index if not exists properties_owner_id_idx on public.properties(owner_id);
create index if not exists properties_slug_idx on public.properties(slug);
create index if not exists registrations_property_id_idx on public.guest_registrations(property_id);
create index if not exists registrations_created_at_idx
  on public.guest_registrations(created_at desc);

-- Private document storage. All uploads and signed URL creation happen through
-- server routes using the service-role key; guest identity documents must never
-- be exposed through a public bucket.
insert into storage.buckets (id, name, public)
values ('guest-id-photos', 'guest-id-photos', false)
on conflict (id) do update set public = false;
