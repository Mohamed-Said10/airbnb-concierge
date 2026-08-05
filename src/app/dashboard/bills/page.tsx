import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import BillsManager from './BillsManager';

export const dynamic = 'force-dynamic';

export default async function BillsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const db = supabaseAdmin();
  const [{ data: properties }, { data: bills }, { data: income }] = await Promise.all([
    db.from('properties').select('id, name, address').eq('owner_id', user.id).order('name'),
    db.from('bills')
      .select('id, property_id, category, title, amount, currency, due_date, status, paid_at, notes, properties(name, address)')
      .eq('owner_id', user.id).order('due_date'),
    db.from('calendar_events')
      .select('id, property_id, start_date, amount')
      .eq('owner_id', user.id).eq('status', 'reserved').not('amount', 'is', null),
  ]);
  return (
    <BillsManager
      initialBills={(bills ?? []) as unknown as Parameters<typeof BillsManager>[0]['initialBills']}
      initialIncome={income ?? []}
      properties={properties ?? []}
    />
  );
}
