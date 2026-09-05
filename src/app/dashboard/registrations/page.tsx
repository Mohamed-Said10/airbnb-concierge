import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import RegistrationsHeader from './RegistrationsHeader';
import RegistrationsFilter from './RegistrationsFilter';
import NoRegistrations from './NoRegistrations';

interface Traveler {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  id_type: string;
  id_number: string;
  date_of_birth: string;
}

interface Registration {
  id: string;
  property_id: string | null;
  check_in_date: string;
  check_out_date: string;
  children_count: number;
  created_at: string;
  properties: { name: string } | null;
  travelers: Traveler[];
}

export default async function DashboardRegistrationsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = supabaseAdmin();

  const { data: properties } = await db
    .from('properties')
    .select('id, name')
    .eq('owner_id', user.id)
    .order('name');

  const propertyIds = (properties ?? []).map((p: { id: string }) => p.id);

  const { data: registrations } = propertyIds.length
    ? await db
        .from('guest_registrations')
        .select('id, property_id, check_in_date, check_out_date, children_count, created_at, properties(name), travelers(*)')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })
    : { data: [] };

  const rows = (registrations ?? []) as unknown as Registration[];

  return (
    <div className="p-4 sm:p-8">
      <RegistrationsHeader count={rows.length} registrations={rows} />

      {rows.length === 0 ? (
        <NoRegistrations />
      ) : (
        <RegistrationsFilter registrations={rows} properties={properties ?? []} />
      )}
    </div>
  );
}
