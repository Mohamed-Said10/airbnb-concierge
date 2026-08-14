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
  property_id: string | null;
  check_in_date: string;
  check_out_date: string;
  created_at: string;
  properties: { name: string } | null;
  travelers: Traveler[];
}

interface Property { id: string; name: string; }

type StayStatus = '' | 'upcoming' | 'current' | 'past';

const iso = (date: Date) => date.toISOString().slice(0, 10);

const stayStatus = (reg: Registration, today: string): Exclude<StayStatus, ''> => {
  if (reg.check_in_date > today) return 'upcoming';
  if (reg.check_out_date < today) return 'past';
  return 'current';
};

export default function RegistrationsFilter({ registrations, properties }: {
  registrations: Registration[]; properties: Property[];
}) {
  const [query, setQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StayStatus>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const today = useMemo(() => iso(new Date()), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return registrations.filter((reg) => {
      if (propertyFilter && reg.property_id !== propertyFilter) return false;
      if (statusFilter && stayStatus(reg, today) !== statusFilter) return false;
      if (fromDate && reg.check_out_date < fromDate) return false;
      if (toDate && reg.check_in_date > toDate) return false;
      if (!q) return true;
      const propertyName = reg.properties?.name?.toLowerCase() ?? '';
      const travelerNames = reg.travelers.map((t) => `${t.first_name} ${t.last_name}`.toLowerCase()).join(' ');
      const dates = `${reg.check_in_date} ${reg.check_out_date}`;
      return propertyName.includes(q) || travelerNames.includes(q) || dates.includes(q);
    });
  }, [registrations, query, propertyFilter, statusFilter, fromDate, toDate, today]);

  const hasActiveFilters = query || propertyFilter || statusFilter || fromDate || toDate;
  const resetFilters = () => { setQuery(''); setPropertyFilter(''); setStatusFilter(''); setFromDate(''); setToDate(''); };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="min-w-0 flex-1 basis-64">
          <label className="mb-1 block text-xs font-medium text-gray-500">Search</label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Property, guest name, or date…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        {properties.length > 1 && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Property</label>
            <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:ring-primary-500 focus:border-primary-500">
              <option value="">All properties</option>
              {properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Stay</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StayStatus)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:ring-primary-500 focus:border-primary-500">
            <option value="">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="current">Current</option>
            <option value="past">Past</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:ring-primary-500 focus:border-primary-500" />
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={resetFilters}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">
            Clear filters
          </button>
        )}
        {hasActiveFilters && (
          <p className="w-full text-xs text-gray-400">{filtered.length} of {registrations.length} results</p>
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
