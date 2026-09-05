'use client';

import { useLanguage } from '@/context/LanguageContext';

export function SettingsTitle() {
  const { language } = useLanguage();
  const french = language === 'fr';
  return <h1 className="text-2xl font-extrabold text-gray-900 mb-8">{french ? 'Paramètres' : 'Settings'}</h1>;
}

export function AccountLabel() {
  const { language } = useLanguage();
  const french = language === 'fr';
  return <h2 className="text-sm font-semibold text-gray-900 mb-1">{french ? 'Compte' : 'Account'}</h2>;
}

export function ChangePasswordLabel() {
  const { language } = useLanguage();
  const french = language === 'fr';
  return <h2 className="text-sm font-semibold text-gray-900 mb-5">{french ? 'Changer le mot de passe' : 'Change password'}</h2>;
}
