-- Run once in the Supabase SQL Editor. Adds owner-managed property photos,
-- shown to guests on the registration page. Unlike guest ID photos, this
-- bucket is public — the photos are meant to be seen by anyone with the
-- guest registration link.

create table if not exists public.property_photos (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now() not null
);

create index if not exists property_photos_property_idx on public.property_photos(property_id, sort_order);

alter table public.property_photos enable row level security;

drop policy if exists "Owners can manage own property photos" on public.property_photos;
create policy "Owners can manage own property photos"
  on public.property_photos for all
  using (property_id in (select id from public.properties where owner_id = auth.uid()))
  with check (property_id in (select id from public.properties where owner_id = auth.uid()));

drop policy if exists "Anyone can view property photos" on public.property_photos;
create policy "Anyone can view property photos"
  on public.property_photos for select using (true);

insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do update set public = true;
