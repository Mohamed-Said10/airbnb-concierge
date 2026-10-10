'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import CookieConsent from '@/components/CookieConsent';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <CookieConsent />
    </LanguageProvider>
  );
}
