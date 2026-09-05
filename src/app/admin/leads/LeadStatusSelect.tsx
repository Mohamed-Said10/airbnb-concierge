'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const STATUS_OPTIONS = ['new', 'contacted', 'converted'] as const;
type Status = typeof STATUS_OPTIONS[number];

const statusColors: Record<Status, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  converted: 'bg-green-100 text-green-700',
};

const statusLabels: Record<'en' | 'fr', Record<Status, string>> = {
  en: { new: 'New', contacted: 'Contacted', converted: 'Converted' },
  fr: { new: 'Nouveau', contacted: 'Contacté', converted: 'Converti' },
};

export default function LeadStatusSelect({ leadId, initial }: { leadId: string; initial: string }) {
  const { language } = useLanguage();
  const [status, setStatus] = useState<Status>((initial as Status) ?? 'new');
  const [saving, setSaving] = useState(false);

  const handleChange = async (next: Status) => {
    setSaving(true);
    const prev = status;
    setStatus(next);
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) setStatus(prev);
    setSaving(false);
  };

  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as Status)}
        disabled={saving}
        className={`text-xs font-semibold px-2 py-0.5 rounded border-0 cursor-pointer appearance-none pr-6 ${statusColors[status]} disabled:opacity-60`}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} className="bg-white text-gray-800 font-normal">
            {statusLabels[language][s]}
          </option>
        ))}
      </select>
      {saving && (
        <svg className="absolute right-1 top-1 animate-spin w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
    </div>
  );
}
