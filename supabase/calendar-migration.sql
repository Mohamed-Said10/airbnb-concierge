-- Run once in the Supabase SQL Editor before deploying the calendar feature.

create table if not exists public.calendar_events (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  registration_id uuid references public.guest_registrations(id) on delete cascade,
  title text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'reserved' check (status in ('reserved', 'blocked')),
  source text not null default 'manual' check (source in ('manual', 'registration')),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint calendar_event_dates_valid check (end_date > start_date)
);

create unique index if not exists calendar_events_registration_unique
  on public.calendar_events(registration_id) where registration_id is not null;
create index if not exists calendar_events_owner_dates_idx
  on public.calendar_events(owner_id, start_date, end_date);
create index if not exists calendar_events_property_idx
  on public.calendar_events(property_id);

alter table public.calendar_events enable row level security;
drop policy if exists "Owners can manage own calendar events" on public.calendar_events;
create policy "Owners can manage own calendar events"
  on public.calendar_events for all
  using (auth.uid() = owner_id)
  with check (
    auth.uid() = owner_id
    and property_id in (select id from public.properties where owner_id = auth.uid())
  );

create table if not exists public.calendar_feed_tokens (
  owner_id uuid references auth.users(id) on delete cascade primary key,
  token uuid not null default gen_random_uuid() unique,
  connected_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.calendar_feed_tokens enable row level security;
-- Feed tokens are server-only. No browser-facing RLS policy is intentionally created.

create or replace function public.sync_registration_calendar_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  property_owner uuid;
  property_name text;
begin
  if new.property_id is null then return new; end if;
  -- Do not let malformed legacy stays break registration writes or calendar setup.
  -- New guest submissions are validated by the application before insertion.
  if new.check_in_date is null or new.check_out_date is null
     or new.check_out_date <= new.check_in_date then
    return new;
  end if;
  select owner_id, name into property_owner, property_name
  from public.properties where id = new.property_id;

  if property_owner is null then return new; end if;
  insert into public.calendar_events (
    owner_id, property_id, registration_id, title, start_date, end_date, status, source
  ) values (
    property_owner, new.property_id, new.id,
    'Guest reservation · ' || coalesce(property_name, 'Property'),
    new.check_in_date, new.check_out_date, 'reserved', 'registration'
  )
  on conflict (registration_id) where registration_id is not null do update
    set property_id = excluded.property_id,
        owner_id = excluded.owner_id,
        start_date = excluded.start_date,
        end_date = excluded.end_date,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists registration_calendar_event_sync on public.guest_registrations;
create trigger registration_calendar_event_sync
  after insert or update of check_in_date, check_out_date, property_id
  on public.guest_registrations
  for each row execute function public.sync_registration_calendar_event();

-- Backfill registrations that already existed before this migration.
insert into public.calendar_events (
  owner_id, property_id, registration_id, title, start_date, end_date, status, source
)
select p.owner_id, r.property_id, r.id,
       'Guest reservation · ' || p.name,
       r.check_in_date, r.check_out_date, 'reserved', 'registration'
from public.guest_registrations r
join public.properties p on p.id = r.property_id
where r.check_in_date is not null
  and r.check_out_date is not null
  and r.check_out_date > r.check_in_date
on conflict (registration_id) where registration_id is not null do nothing;
