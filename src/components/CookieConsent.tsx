'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const STORAGE_KEY = 'cookie-consent';
const OPEN_EVENT = 'open-cookie-settings';

export type CookieConsentChoice = 'all' | 'essential';

// Any future non-essential script (analytics, ads) must check this before loading.
export function getCookieConsent(): CookieConsentChoice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'all' || value === 'essential' ? value : null;
  } catch {
    return null;
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function CookieConsent() {
  const { language } = useLanguage();
  const french = language === 'fr';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ask again whenever no choice is stored (first visit, cleared storage, blocked storage).
    setVisible(getCookieConsent() === null);
    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const choose = (choice: CookieConsentChoice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Storage unavailable: the banner will simply ask again next visit.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={french ? 'Consentement aux cookies' : 'Cookie consent'}
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white p-4 shadow-2xl sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-gray-600">
          {french
            ? 'Nous utilisons des cookies essentiels pour vous garder connecté et faire fonctionner le site. Avec votre accord, nous pourrons aussi utiliser des cookies facultatifs pour améliorer votre expérience. '
            : 'We use essential cookies to keep you signed in and make the site work. With your permission, we may also use optional cookies to improve your experience. '}
          <Link href="/legal/privacy" className="font-medium text-primary-600 hover:underline">
            {french ? 'Politique de confidentialité' : 'Privacy Policy'}
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose('essential')}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {french ? 'Essentiels uniquement' : 'Essential only'}
          </button>
          <button
            type="button"
            onClick={() => choose('all')}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {french ? 'Tout accepter' : 'Accept all'}
          </button>
        </div>
      </div>
    </div>
  );
}
