'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const french = language === 'fr';
  const navItems = [
    { href: '/dashboard', label: french ? "Vue d'ensemble" : 'Overview' },
    { href: '/dashboard/properties', label: french ? 'Propriétés' : 'Properties' },
    { href: '/dashboard/registrations', label: 'Registrations' },
    { href: '/dashboard/calendar', label: french ? 'Calendrier' : 'Calendar' },
    { href: '/dashboard/bills', label: french ? 'Factures' : 'Bills' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex overflow-hidden">
      <div className="md:hidden fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-primary-600 px-4 text-white shadow">
        <Link href="/" className="text-lg font-extrabold">KoziBnB</Link>
        <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle dashboard menu" aria-expanded={menuOpen}
          className="rounded-md p-2 hover:bg-primary-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? 'M6 18 18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
      {menuOpen && <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="md:hidden fixed inset-0 z-20 bg-black/40" />}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-shrink-0 flex-col bg-primary-600 text-white transition-transform md:static md:w-56 md:translate-x-0 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-6 py-5 border-b border-primary-700">
          <Link href="/" className="text-lg font-extrabold tracking-tight hover:opacity-80">KoziBnB</Link>
          <p className="text-xs text-primary-300 mt-0.5">{french ? 'Espace propriétaire' : 'Host Dashboard'}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
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
      <main className="flex-1 overflow-auto pt-16 md:pt-0">{children}</main>
    </div>
  );
}

