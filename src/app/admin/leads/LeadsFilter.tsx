'use client';

import { useState, useMemo } from 'react';
import LeadStatusSelect from './LeadStatusSelect';
import { useLanguage } from '@/context/LanguageContext';

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

export default function LeadsFilter({ leads }: { leads: Lead[] }) {
  const { language } = useLanguage();
  const french = language === 'fr';
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesQuery = !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.phone ?? '').toLowerCase().includes(q) ||
        lead.message.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || (lead.status ?? 'new') === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [leads, query, statusFilter]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={french ? 'Rechercher par nom, e-mail ou message…' : 'Search by name, email, or message…'}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 w-full sm:w-72"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">{french ? 'Tous les statuts' : 'All statuses'}</option>
          <option value="new">{french ? 'Nouveau' : 'New'}</option>
          <option value="contacted">{french ? 'Contacté' : 'Contacted'}</option>
          <option value="converted">{french ? 'Converti' : 'Converted'}</option>
        </select>
        {(query || statusFilter !== 'all') && (
          <span className="self-center text-xs text-gray-400">
            {french ? `${filtered.length} sur ${leads.length}` : `${filtered.length} of ${leads.length}`}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">{french ? 'Aucun prospect ne correspond à votre recherche.' : 'No leads match your search.'}</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3">{french ? 'Nom' : 'Name'}</th>
                  <th className="px-6 py-3">{french ? 'E-mail' : 'Email'}</th>
                  <th className="px-6 py-3">{french ? 'Téléphone' : 'Phone'}</th>
                  <th className="px-6 py-3">{french ? 'Propriété' : 'Property'}</th>
                  <th className="px-6 py-3">{french ? 'Statut' : 'Status'}</th>
                  <th className="px-6 py-3">{french ? 'Date' : 'Date'}</th>
                  <th className="px-6 py-3">{french ? 'Message' : 'Message'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 align-top">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{lead.name}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      <a href={`mailto:${lead.email}`} className="hover:underline text-primary-600">{lead.email}</a>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{lead.phone ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap capitalize">{lead.property_type ?? '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LeadStatusSelect leadId={lead.id} initial={lead.status ?? 'new'} />
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
