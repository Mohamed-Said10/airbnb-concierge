'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle({
  variant = 'light',
  className = '',
}: {
  variant?: 'light' | 'sidebar';
  className?: string;
}) {
  const { language, setLanguage } = useLanguage();
  const inactiveClass = variant === 'sidebar'
    ? 'text-primary-200 hover:bg-primary-700 hover:text-white'
    : 'text-gray-500 hover:text-primary-600';

  return (
    <div
      className={`print-hidden inline-flex items-center overflow-hidden rounded-md border text-sm font-medium ${
        variant === 'sidebar' ? 'border-primary-400' : 'border-gray-200'
      } ${className}`}
      aria-label="Language"
    >
      {(['fr', 'en'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`px-3 py-1.5 transition-colors ${
            language === lang ? 'bg-white text-primary-700' : inactiveClass
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
