'use client';

import Link from 'next/link';
import DeleteRegistrationButton from '@/components/DeleteRegistrationButton';
import { useLanguage } from '@/context/LanguageContext';

interface TravelerWithSigned {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  id_type: string;
  id_number: string;
  id_expiry_date: string;
  address: string;
  frontSigned: string | null;
  backSigned: string | null;
}

interface Registration {
  id: string;
  check_in_date: string;
  check_out_date: string;
  children_count: number;
  created_at: string;
  properties: { name: string; address: string | null } | null;
}

export default function RegistrationDetailClient({
  registration,
  travelers,
  signatureSignedUrl,
}: {
  registration: Registration;
  travelers: TravelerWithSigned[];
  signatureSignedUrl: string | null;
}) {
  const { language } = useLanguage();
  const french = language === 'fr';

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="w-40 shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-800">{value || '—'}</span>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/dashboard/registrations" className="text-sm text-primary-600 hover:underline">
          {french ? '← Retour aux enregistrements' : '← Back to registrations'}
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{french ? 'Enregistrement' : 'Registration'}</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">{registration.id}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="text-xs text-gray-400">{new Date(registration.created_at).toLocaleString()}</span>
          <DeleteRegistrationButton
            endpoint={`/api/registrations/${registration.id}`}
            redirectTo="/dashboard/registrations"
            label={french ? "Supprimer l'enregistrement" : 'Remove registration'}
            confirmation={french ? 'Supprimer définitivement cet enregistrement et tous ses documents ?' : 'Permanently remove this registration and all its documents?'}
          />
        </div>
      </div>

      {/* Stay details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">{french ? 'Détails du séjour' : 'Stay details'}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{french ? 'Propriété' : 'Property'}</p>
            <p className="mt-1 text-sm font-semibold text-gray-800">{registration.properties?.name ?? '—'}</p>
            {registration.properties?.address && (
              <p className="text-xs text-gray-400 mt-0.5">{registration.properties.address}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{french ? 'Dates' : 'Dates'}</p>
            <p className="mt-1 text-sm text-gray-800">{registration.check_in_date} → {registration.check_out_date}</p>
          </div>
          {registration.children_count > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{french ? 'Enfants' : 'Children'}</p>
              <p className="mt-1 text-sm text-gray-800">{registration.children_count}</p>
            </div>
          )}
        </div>
      </div>

      {/* Travelers */}
      {travelers.map((t, idx) => (
        <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className={`px-6 py-3 ${idx === 0 ? 'bg-primary-600' : 'bg-gray-700'}`}>
            <span className="text-sm font-semibold text-white">
              {idx === 0 ? (french ? 'Voyageur principal' : 'Main Traveler') : (french ? `Voyageur ${idx + 1}` : `Traveler ${idx + 1}`)} — {t.first_name} {t.last_name}
            </span>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <Row label={french ? 'Prénom' : 'First name'} value={t.first_name} />
              <Row label={french ? 'Nom' : 'Last name'} value={t.last_name} />
              <Row label={french ? 'Date de naissance' : 'Date of birth'} value={t.date_of_birth} />
              <Row label={french ? 'Lieu de naissance' : 'Place of birth'} value={t.place_of_birth} />
              <Row label={french ? 'Nationalité' : 'Nationality'} value={t.nationality} />
              <Row label={french ? 'Type de document' : 'Document type'} value={t.id_type?.toUpperCase()} />
              <Row label={french ? 'Numéro de document' : 'Document number'} value={t.id_number} />
              <Row label={french ? "Date d'expiration" : 'Expiry date'} value={t.id_expiry_date} />
              <Row label={french ? 'Adresse' : 'Address'} value={t.address} />
            </div>
            {(t.frontSigned || t.backSigned) && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-3">{french ? "Photos d'identité" : 'ID Photos'}</p>
                <div className="flex gap-4 flex-wrap">
                  {t.frontSigned && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">{french ? 'Recto' : 'Front'}</p>
                      <a href={t.frontSigned} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.frontSigned} alt="ID front" width={200}
                          className="rounded-lg border border-gray-200 object-cover hover:opacity-90 transition-opacity max-h-32" />
                      </a>
                    </div>
                  )}
                  {t.backSigned && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">{french ? 'Verso' : 'Back'}</p>
                      <a href={t.backSigned} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.backSigned} alt="ID back" width={200}
                          className="rounded-lg border border-gray-200 object-cover hover:opacity-90 transition-opacity max-h-32" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Signature */}
      {signatureSignedUrl && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">{french ? 'Signature' : 'Signature'}</h2>
          <div className="bg-gray-50 rounded-lg p-4 inline-block border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={signatureSignedUrl} alt="Guest signature" width={300}
              className="object-contain max-h-28" />
          </div>
        </div>
      )}
    </div>
  );
}
