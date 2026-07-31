'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const french = language === 'fr';
  const navItems = [
    { href: '/dashboard', label: french ? "Vue d'ensemble" : 'Overview' },
    { href: '/dashboard/properties', label: french ? 'Propriétés' : 'Properties' },
    { href: '/dashboard/registrations', label: 'Registrations' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex overflow-hidden">
      <aside className="w-56 bg-primary-600 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-primary-700">
          <Link href="/" className="text-lg font-extrabold tracking-tight hover:opacity-80">KoziBnB</Link>
          <p className="text-xs text-primary-300 mt-0.5">{french ? 'Espace propriétaire' : 'Host Dashboard'}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-primary-700 space-y-1">
          <div className="px-3 pb-3">
            <LanguageToggle variant="sidebar" />
          </div>
          <Link href="/dashboard/settings"
            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-700 transition-colors">
            {french ? 'Paramètres' : 'Settings'}
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

