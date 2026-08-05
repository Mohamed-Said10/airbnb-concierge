-- Run once in the Supabase SQL Editor before deploying the bills feature.

create table if not exists public.bills (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  category text not null default 'other'
    check (category in ('electricity', 'water', 'gas', 'internet', 'maintenance', 'cleaning', 'tax', 'insurance', 'ads', 'other')),
  title text not null,
  amount numeric(10, 2) not null check (amount > 0),
  currency text not null default 'MAD',
  due_date date not null,
  status text not null default 'unpaid' check (status in ('unpaid', 'paid')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists bills_owner_due_idx on public.bills(owner_id, due_date);
create index if not exists bills_property_idx on public.bills(property_id);
create index if not exists bills_owner_status_idx on public.bills(owner_id, status);

-- Widen the category check constraint to include 'ads' for deployments that
-- already created this table before the category was added.
alter table public.bills drop constraint if exists bills_category_check;
alter table public.bills add constraint bills_category_check
  check (category in ('electricity', 'water', 'gas', 'internet', 'maintenance', 'cleaning', 'tax', 'insurance', 'ads', 'other'));

alter table public.bills enable row level security;
drop policy if exists "Owners can manage own bills" on public.bills;
create policy "Owners can manage own bills"
  on public.bills for all
  using (auth.uid() = owner_id)
  with check (
    auth.uid() = owner_id
    and property_id in (select id from public.properties where owner_id = auth.uid())
  );
