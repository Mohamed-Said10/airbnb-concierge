'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface RecentReg { id: string; check_in_date: string; check_out_date: string; created_at: string; }
interface PropertyRow { id: string; name: string; slug: string; }

export default function DashboardOverviewClient({
  userEmail,
  properties,
  regCount,
  recentRegs,
}: {
  userEmail: string | null | undefined;
  properties: PropertyRow[];
  regCount: number;
  recentRegs: RecentReg[];
}) {
  const { language } = useLanguage();
  const french = language === 'fr';

  if (properties.length === 0) {
    return (
      <div className="p-4 sm:p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{french ? 'Bienvenue sur KoziBnB' : 'Welcome to KoziBnB'}</h2>
        <p className="text-gray-500 text-sm max-w-sm mb-6">
          {french
            ? "Ajoutez votre première propriété pour commencer. Vous obtiendrez un lien d'enregistrement unique à partager avec vos invités."
            : "Add your first property to get started. You'll get a unique guest registration link to share with arriving guests."}
        </p>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-sm w-full text-left space-y-3 mb-6">
          {(french
            ? [
                'Ajoutez votre propriété avec un nom et une adresse',
                "Partagez le lien d'enregistrement avant l'arrivée",
                'Les invités renseignent leurs informations et signent',
                'Vous recevez un e-mail et pouvez tout consulter ici',
              ]
            : [
                'Add your property with a name and address',
                'Share the guest registration link before check-in',
                'Guests fill in their info and sign digitally',
                'You receive an email and can view all registrations here',
              ]
          ).map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>
        <a href="/dashboard/properties"
          className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
          {french ? 'Ajouter votre première propriété →' : 'Add your first property →'}
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{french ? "Vue d'ensemble" : 'Overview'}</h1>
      <p className="text-sm text-gray-500 mb-8">{userEmail}</p>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mb-10 max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">{french ? 'Propriétés' : 'Properties'}</p>
          <p className="mt-2 text-4xl font-extrabold text-primary-600">{properties.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">{french ? 'Enregistrements' : 'Registrations'}</p>
          <p className="mt-2 text-4xl font-extrabold text-amber-600">{regCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">{french ? 'Vos propriétés' : 'Your Properties'}</h2>
            <Link href="/dashboard/properties" className="text-xs text-primary-600 hover:underline">{french ? 'Gérer' : 'Manage'}</Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {properties.length === 0 ? (
              <li className="px-6 py-6 text-center">
                <p className="text-sm text-gray-400 mb-3">{french ? 'Aucune propriété pour le moment.' : 'No properties yet.'}</p>
                <Link href="/dashboard/properties"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                  {french ? 'Ajouter votre première propriété' : 'Add your first property'}
                </Link>
              </li>
            ) : properties.map((p) => (
              <li key={p.id} className="px-6 py-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                <a href={`/checkin/${p.slug}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline">
                  {french ? "Lien invité ↗" : 'Guest link ↗'}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">{french ? 'Enregistrements récents' : 'Recent Registrations'}</h2>
            <Link href="/dashboard/registrations" className="text-xs text-primary-600 hover:underline">{french ? 'Tout voir' : 'View all'}</Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentRegs.length === 0 ? (
              <li className="px-6 py-4 text-sm text-gray-400">{french ? 'Aucun enregistrement pour le moment.' : 'No registrations yet.'}</li>
            ) : recentRegs.map((reg) => (
              <li key={reg.id} className="px-6 py-3">
                <p className="text-sm font-medium text-gray-800">{reg.check_in_date} → {reg.check_out_date}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(reg.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
