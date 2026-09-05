'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LeadsTitle({ count }: { count: number }) {
  const { language } = useLanguage();
  const french = language === 'fr';
  return (
    <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
      {french ? 'Prospects contact' : 'Contact Leads'}
      <span className="ml-3 text-base font-normal text-gray-400">({count})</span>
    </h1>
  );
}

export function NoLeads() {
  const { language } = useLanguage();
  const french = language === 'fr';
  return <p className="text-gray-500">{french ? 'Aucun prospect pour le moment.' : 'No leads yet.'}</p>;
}
