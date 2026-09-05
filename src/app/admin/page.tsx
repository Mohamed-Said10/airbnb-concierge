import { supabaseAdmin } from '@/lib/supabase';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

async function getStats() {
  const db = supabaseAdmin();
  const [{ count: regCount }, { count: leadCount }, { data: recentRegs }, { data: recentLeads }] =
    await Promise.all([
      db.from('guest_registrations').select('*', { count: 'exact', head: true }),
      db.from('contact_leads').select('*', { count: 'exact', head: true }),
      db
        .from('guest_registrations')
        .select('id, check_in_date, check_out_date, property_ref, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      db
        .from('contact_leads')
        .select('id, name, email, property_type, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);
  return { regCount: regCount ?? 0, leadCount: leadCount ?? 0, recentRegs: recentRegs ?? [], recentLeads: recentLeads ?? [] };
}

export default async function AdminDashboard() {
  const { regCount, leadCount, recentRegs, recentLeads } = await getStats();

  return (
    <AdminDashboardClient
      regCount={regCount}
      leadCount={leadCount}
      recentRegs={recentRegs}
      recentLeads={recentLeads}
    />
  );
}
