-- Run once in the Supabase SQL Editor. Adds a per-reservation night price and
-- a computed total (amount) so the bills dashboard can chart income against
-- expenses. The owner enters the night price; the app computes amount as
-- night_price × nights on every save.

alter table public.calendar_events add column if not exists night_price numeric(10, 2);
alter table public.calendar_events add column if not exists amount numeric(10, 2);
alter table public.calendar_events drop constraint if exists calendar_events_night_price_check;
alter table public.calendar_events add constraint calendar_events_night_price_check check (night_price is null or night_price >= 0);
alter table public.calendar_events drop constraint if exists calendar_events_amount_check;
alter table public.calendar_events add constraint calendar_events_amount_check check (amount is null or amount >= 0);
