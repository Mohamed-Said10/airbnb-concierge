'use client';

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
  created_at: string;
  properties: { name: string } | null;
  travelers: Traveler[];
}

export default function ExportButton({ registrations }: { registrations: Registration[] }) {
  const handleExport = () => {
    const rows: string[][] = [
      ['Registration ID', 'Property', 'Check-in', 'Check-out', 'Submitted At',
        'First Name', 'Last Name', 'Date of Birth', 'Nationality', 'ID Type', 'ID Number'],
    ];

    for (const reg of registrations) {
      for (const t of reg.travelers) {
        rows.push([
          reg.id,
          reg.properties?.name ?? '',
          reg.check_in_date,
          reg.check_out_date,
          new Date(reg.created_at).toISOString(),
          t.first_name,
          t.last_name,
          t.date_of_birth,
          t.nationality,
          t.id_type,
          t.id_number,
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
    <button
      onClick={handleExport}
      disabled={registrations.length === 0}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export CSV
    </button>
  );
}
