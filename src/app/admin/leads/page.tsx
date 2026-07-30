import { supabaseAdmin } from '@/lib/supabase';
import LeadsFilter from './LeadsFilter';

export const dynamic = 'force-dynamic';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  property_type: string | null;
  message: string;
  status: string | null;
  created_at: string;
}

async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabaseAdmin()
    .from('contact_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin/leads]', error);
    return [];
  }
  return (data ?? []) as Lead[];
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
        Contact Leads
        <span className="ml-3 text-base font-normal text-gray-400">({leads.length})</span>
      </h1>

      {leads.length === 0 ? (
        <p className="text-gray-500">No leads yet.</p>
      ) : (
        <LeadsFilter leads={leads} />
      )}
    </div>
  );
}
