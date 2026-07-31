'use client';

import Link from 'next/link';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const french = language === 'fr';
  const navItems = [
    { href: '/admin', label: french ? 'Tableau de bord' : 'Dashboard' },
    { href: '/admin/registrations', label: 'Registrations' },
    { href: '/admin/leads', label: french ? 'Prospects' : 'Leads' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-primary-600 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-primary-700">
          <span className="text-lg font-extrabold tracking-tight">KoziBnB</span>
          <p className="text-xs text-primary-300 mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-primary-700 space-y-3">
          <div className="px-3">
            <LanguageToggle variant="sidebar" />
          </div>
          <a
            href="/api/admin/logout"
            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-700 transition-colors"
          >
            {french ? 'Déconnexion' : 'Sign out'}
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
