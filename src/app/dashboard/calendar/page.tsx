import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import CalendarManager from './CalendarManager';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const db = supabaseAdmin();
  const [{ data: properties }, { data: events }] = await Promise.all([
    db.from('properties').select('id, name, address').eq('owner_id', user.id).order('name'),
    db.from('calendar_events')
      .select('id, property_id, registration_id, title, start_date, end_date, status, source, notes, night_price, amount, properties(name, address)')
      .eq('owner_id', user.id).order('start_date'),
  ]);
  return (
    <CalendarManager
      initialEvents={(events ?? []) as unknown as Parameters<typeof CalendarManager>[0]['initialEvents']}
      properties={properties ?? []}
    />
  );
}
