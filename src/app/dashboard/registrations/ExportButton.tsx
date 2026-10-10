'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { maskIdNumber } from '@/lib/id-number-display';

interface Traveler {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  id_type: string;
  id_number: string;
}

interface Registration {
  id: string;
  check_in_date: string;
  check_out_date: string;
  children_count?: number;
  created_at: string;
  properties: { name: string } | null;
  travelers: Traveler[];
}

export default function ExportButton({ registrations }: { registrations: Registration[] }) {
  const { language } = useLanguage();
  const french = language === 'fr';
  const [includeFullIdNumbers, setIncludeFullIdNumbers] = useState(false);

  const toggleIncludeFullIdNumbers = () => {
    if (includeFullIdNumbers) {
      setIncludeFullIdNumbers(false);
      return;
    }
    const message = french
      ? 'Ce CSV inclura les numéros de document complets, non masqués. Continuer ?'
      : 'This CSV will include full, unmasked ID numbers. Continue?';
    if (window.confirm(message)) setIncludeFullIdNumbers(true);
  };

  const handleExport = () => {
    const rows: string[][] = [
      ['Registration ID', 'Property', 'Check-in', 'Check-out', 'Children', 'Submitted At',
        'First Name', 'Last Name', 'Date of Birth', 'Nationality', 'ID Type', 'ID Number'],
    ];

    for (const reg of registrations) {
      for (const t of reg.travelers) {
        rows.push([
          reg.id,
          reg.properties?.name ?? '',
          reg.check_in_date,
          reg.check_out_date,
          String(reg.children_count ?? 0),
          new Date(reg.created_at).toISOString(),
          t.first_name,
          t.last_name,
          t.date_of_birth,
          t.nationality,
          t.id_type,
          includeFullIdNumbers ? t.id_number : maskIdNumber(t.id_number),
        ]);
      }
    }

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-1.5 text-xs text-gray-500">
        <input
          type="checkbox"
          checked={includeFullIdNumbers}
          onChange={toggleIncludeFullIdNumbers}
          className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        {french ? 'Inclure les numéros de document complets' : 'Include full ID numbers'}
      </label>
      <button
        onClick={handleExport}
        disabled={registrations.length === 0}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {french ? 'Exporter CSV' : 'Export CSV'}
      </button>
    </div>
  );
}
