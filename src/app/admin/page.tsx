import { supabaseAdmin } from '@/lib/supabase';

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
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-10 max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Total Registrations</p>
          <p className="mt-2 text-4xl font-extrabold text-primary-600">{regCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Contact Leads</p>
          <p className="mt-2 text-4xl font-extrabold text-amber-600">{leadCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Registrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Registrations</h2>
            <a href="/admin/registrations" className="text-xs text-primary-600 hover:underline">
              View all
            </a>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentRegs.length === 0 && (
              <li className="px-6 py-4 text-sm text-gray-400">No registrations yet.</li>
            )}
            {recentRegs.map((r: Record<string, string>) => (
              <li key={r.id} className="px-6 py-3">
                <p className="text-sm font-medium text-gray-800">
                  {r.property_ref ?? 'No ref'} — {r.check_in_date} → {r.check_out_date}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Leads</h2>
            <a href="/admin/leads" className="text-xs text-primary-600 hover:underline">
              View all
            </a>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentLeads.length === 0 && (
              <li className="px-6 py-4 text-sm text-gray-400">No leads yet.</li>
            )}
            {recentLeads.map((l: Record<string, string>) => (
              <li key={l.id} className="px-6 py-3">
                <p className="text-sm font-medium text-gray-800">
                  {l.name} — {l.email}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {l.property_type ?? '—'} · {new Date(l.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
