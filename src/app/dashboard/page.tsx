import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import DashboardOverviewClient from './DashboardOverviewClient';

interface RecentReg { id: string; check_in_date: string; check_out_date: string; created_at: string; }
interface PropertyRow { id: string; name: string; slug: string; }

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = supabaseAdmin();

  // Get user's properties
  const { data: properties } = await db
    .from('properties')
    .select('id, name, slug, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  const propertyIds = (properties ?? []).map((p: { id: string }) => p.id);

  // Count registrations across all properties
  const { count: regCount } = propertyIds.length
    ? await db
        .from('guest_registrations')
        .select('*', { count: 'exact', head: true })
        .in('property_id', propertyIds)
    : { count: 0 };

  // Recent registrations
  const { data: recentRegs } = propertyIds.length
    ? await db
        .from('guest_registrations')
        .select('id, check_in_date, check_out_date, created_at, properties(name)')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] };

  return (
    <DashboardOverviewClient
      userEmail={user.email}
      properties={(properties ?? []) as PropertyRow[]}
      regCount={regCount ?? 0}
      recentRegs={(recentRegs ?? []) as unknown as RecentReg[]}
    />
  );
}
