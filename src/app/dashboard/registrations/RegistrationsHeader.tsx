'use client';

import { useLanguage } from '@/context/LanguageContext';
import ExportButton from './ExportButton';

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

export default function RegistrationsHeader({ count, registrations }: { count: number; registrations: Registration[] }) {
  const { language } = useLanguage();
  const french = language === 'fr';

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-extrabold text-gray-900">
        {french ? 'Enregistrements' : 'Registrations'}
        <span className="ml-3 text-base font-normal text-gray-400">({count})</span>
      </h1>
      <ExportButton registrations={registrations} />
    </div>
  );
}
