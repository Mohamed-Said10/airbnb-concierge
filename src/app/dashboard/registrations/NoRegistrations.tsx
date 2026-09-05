'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function NoRegistrations() {
  const { language } = useLanguage();
  const french = language === 'fr';
  return <p className="text-gray-500">{french ? 'Aucun enregistrement pour le moment.' : 'No guest registrations yet.'}</p>;
}
