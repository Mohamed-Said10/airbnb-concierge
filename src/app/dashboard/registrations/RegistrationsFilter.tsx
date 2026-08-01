'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DeleteRegistrationButton from '@/components/DeleteRegistrationButton';

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

export default function RegistrationsFilter({ registrations }: { registrations: Registration[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return registrations;
    return registrations.filter((reg) => {
      const propertyName = reg.properties?.name?.toLowerCase() ?? '';
      const travelerNames = reg.travelers.map((t) => `${t.first_name} ${t.last_name}`.toLowerCase()).join(' ');
      const dates = `${reg.check_in_date} ${reg.check_out_date}`;
      return propertyName.includes(q) || travelerNames.includes(q) || dates.includes(q);
    });
  }, [registrations, query]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by property, guest name, or date…"
          className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
        />
        {query && (
          <p className="text-xs text-gray-400 mt-1">{filtered.length} of {registrations.length} results</p>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">No registrations match your search.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((reg) => (
            <div key={reg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-4">
                {reg.properties && (
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Property</span>
                    <p className="text-sm font-semibold text-primary-600">{reg.properties.name}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Check-in</span>
                  <p className="text-sm text-gray-700">{reg.check_in_date}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Check-out</span>
                  <p className="text-sm text-gray-700">{reg.check_out_date}</p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <span className="text-xs text-gray-400">{new Date(reg.created_at).toLocaleString()}</span>
                  <Link href={`/dashboard/registrations/${reg.id}`}
                    className="text-xs text-primary-600 hover:underline font-medium whitespace-nowrap">
                    View details →
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Date of Birth</th>
                      <th className="px-6 py-3">Nationality</th>
                      <th className="px-6 py-3">Document</th>
                      <th className="px-6 py-3">Number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reg.travelers.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-800">{t.first_name} {t.last_name}</td>
                        <td className="px-6 py-3 text-gray-500">{t.date_of_birth}</td>
                        <td className="px-6 py-3 text-gray-500">{t.nationality}</td>
                        <td className="px-6 py-3">
                          <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded uppercase">
                            {t.id_type}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-gray-500">{t.id_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end border-t border-gray-100 px-6 py-3">
                <DeleteRegistrationButton
                  endpoint={`/api/registrations/${reg.id}`}
                  redirectTo="/dashboard/registrations"
                  label="Remove registration"
                  confirmation="Permanently remove this registration and all its documents?"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
