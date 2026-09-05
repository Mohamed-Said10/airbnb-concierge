'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface RecentReg { id: string; property_ref: string | null; check_in_date: string; check_out_date: string; created_at: string; }
interface RecentLead { id: string; name: string; email: string; property_type: string | null; created_at: string; status: string; }

export default function AdminDashboardClient({
  regCount,
  leadCount,
  recentRegs,
  recentLeads,
}: {
  regCount: number;
  leadCount: number;
  recentRegs: RecentReg[];
  recentLeads: RecentLead[];
}) {
  const { language } = useLanguage();
  const french = language === 'fr';

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">{french ? 'Tableau de bord' : 'Dashboard'}</h1>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mb-10 max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">{french ? 'Enregistrements totaux' : 'Total Registrations'}</p>
          <p className="mt-2 text-4xl font-extrabold text-primary-600">{regCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">{french ? 'Prospects contact' : 'Contact Leads'}</p>
          <p className="mt-2 text-4xl font-extrabold text-amber-600">{leadCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">{french ? 'Enregistrements récents' : 'Recent Registrations'}</h2>
            <Link href="/admin/registrations" className="text-xs text-primary-600 hover:underline">
              {french ? 'Tout voir' : 'View all'}
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentRegs.length === 0 && (
              <li className="px-6 py-4 text-sm text-gray-400">{french ? 'Aucun enregistrement pour le moment.' : 'No registrations yet.'}</li>
            )}
            {recentRegs.map((r) => (
              <li key={r.id} className="px-6 py-3">
                <p className="text-sm font-medium text-gray-800">
                  {r.property_ref ?? (french ? 'Aucune réf.' : 'No ref')} — {r.check_in_date} → {r.check_out_date}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">{french ? 'Prospects récents' : 'Recent Leads'}</h2>
            <Link href="/admin/leads" className="text-xs text-primary-600 hover:underline">
              {french ? 'Tout voir' : 'View all'}
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentLeads.length === 0 && (
              <li className="px-6 py-4 text-sm text-gray-400">{french ? 'Aucun prospect pour le moment.' : 'No leads yet.'}</li>
            )}
            {recentLeads.map((l) => (
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
