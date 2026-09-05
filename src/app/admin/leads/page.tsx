import { supabaseAdmin } from '@/lib/supabase';
import LeadsFilter from './LeadsFilter';
import { LeadsTitle, NoLeads } from './LeadsHeader';

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
    <div className="p-4 sm:p-8">
      <LeadsTitle count={leads.length} />

      {leads.length === 0 ? (
        <NoLeads />
      ) : (
        <LeadsFilter leads={leads} />
      )}
    </div>
  );
}
