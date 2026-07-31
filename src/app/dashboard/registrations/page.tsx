import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import ExportButton from './ExportButton';
import RegistrationsFilter from './RegistrationsFilter';

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
  check_in_date: string;
  check_out_date: string;
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
    .select('id')
    .eq('owner_id', user.id);

  const propertyIds = (properties ?? []).map((p: { id: string }) => p.id);

  const { data: registrations } = propertyIds.length
    ? await db
        .from('guest_registrations')
        .select('id, check_in_date, check_out_date, created_at, properties(name), travelers(*)')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })
    : { data: [] };

  const rows = (registrations ?? []) as unknown as Registration[];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Registrations
          <span className="ml-3 text-base font-normal text-gray-400">({rows.length})</span>
        </h1>
        <ExportButton registrations={rows} />
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500">No guest registrations yet.</p>
      ) : (
        <RegistrationsFilter registrations={rows} />
      )}
    </div>
  );
}
