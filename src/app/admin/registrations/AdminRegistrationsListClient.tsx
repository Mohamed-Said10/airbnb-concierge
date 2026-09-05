'use client';

import Link from 'next/link';
import DeleteRegistrationButton from '@/components/DeleteRegistrationButton';
import { useLanguage } from '@/context/LanguageContext';

interface Traveler {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  id_type: string;
  id_number: string;
  date_of_birth: string;
}

interface Registration {
  id: string;
  check_in_date: string;
  check_out_date: string;
  property_ref: string | null;
  created_at: string;
  travelers: Traveler[];
}

export default function AdminRegistrationsListClient({
  registrations,
  page,
  hasNextPage,
}: {
  registrations: Registration[];
  page: number;
  hasNextPage: boolean;
}) {
  const { language } = useLanguage();
  const french = language === 'fr';

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
        {french ? 'Enregistrements des invités' : 'Guest Registrations'}
        <span className="ml-3 text-base font-normal text-gray-400">{french ? `Page ${page}` : `Page ${page}`}</span>
      </h1>

      {registrations.length === 0 ? (
        <p className="text-gray-500">{french ? 'Aucun enregistrement pour le moment.' : 'No registrations yet.'}</p>
      ) : (
        <div className="space-y-6">
          {registrations.map((reg) => (
            <div key={reg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Link
                href={`/admin/registrations/${reg.id}`}
                className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-4 hover:bg-primary-50 transition-colors group"
              >
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">ID</span>
                  <p className="text-sm font-mono text-gray-700">{reg.id.slice(0, 8)}…</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{french ? 'Arrivée' : 'Check-in'}</span>
                  <p className="text-sm text-gray-700">{reg.check_in_date}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{french ? 'Départ' : 'Check-out'}</span>
                  <p className="text-sm text-gray-700">{reg.check_out_date}</p>
                </div>
                {reg.property_ref && (
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{french ? 'Propriété' : 'Property'}</span>
                    <p className="text-sm text-gray-700">{reg.property_ref}</p>
                  </div>
                )}
                <div className="ml-auto">
                  <span className="text-xs text-gray-400">
                    {new Date(reg.created_at).toLocaleString()}
                  </span>
                  <span className="ml-4 text-sm font-medium text-primary-600 group-hover:underline">
                    {french ? 'Voir les détails' : 'View details'}
                  </span>
                </div>
              </Link>

              {/* Travelers table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                      <th className="px-6 py-3">{french ? 'Nom' : 'Name'}</th>
                      <th className="px-6 py-3">{french ? 'Date de naissance' : 'Date of Birth'}</th>
                      <th className="px-6 py-3">{french ? 'Nationalité' : 'Nationality'}</th>
                      <th className="px-6 py-3">{french ? 'Document' : 'Document'}</th>
                      <th className="px-6 py-3">{french ? 'Numéro' : 'Number'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reg.travelers.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {t.first_name} {t.last_name}
                        </td>
                        <td className="px-6 py-3 text-gray-500">{t.date_of_birth}</td>
                        <td className="px-6 py-3 text-gray-500">{t.nationality}</td>
                        <td className="px-6 py-3">
                          <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded uppercase">
                            {t.id_type}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-gray-500">{t.id_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end border-t border-gray-100 px-6 py-3">
                <DeleteRegistrationButton
                  endpoint={`/api/admin/registrations/${reg.id}`}
                  redirectTo={`/admin/registrations?page=${page}`}
                  label={french ? "Supprimer l'enregistrement" : 'Remove registration'}
                  confirmation={french ? 'Supprimer définitivement cet enregistrement et tous ses documents ?' : 'Permanently remove this registration and all its documents?'}
                />
              </div>
            </div>
          ))}

          <nav className="flex items-center justify-between pt-2" aria-label="Registration pages">
            {page > 1 ? (
              <Link
                href={`/admin/registrations?page=${page - 1}`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {french ? 'Précédent' : 'Previous'}
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm text-gray-500">{french ? `Page ${page}` : `Page ${page}`}</span>
            {hasNextPage ? (
              <Link
                href={`/admin/registrations?page=${page + 1}`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {french ? 'Suivant' : 'Next'}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
