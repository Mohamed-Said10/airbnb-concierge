import { supabaseAdmin } from '@/lib/supabase';

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

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  converted: 'bg-green-100 text-green-700',
};

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 align-top">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      <a href={`mailto:${lead.email}`} className="hover:underline text-primary-600">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {lead.phone ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap capitalize">
                      {lead.property_type ?? '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                          statusColors[lead.status ?? 'new'] ?? statusColors.new
                        }`}
                      >
                        {lead.status ?? 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs">
                      <p className="line-clamp-2">{lead.message}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
