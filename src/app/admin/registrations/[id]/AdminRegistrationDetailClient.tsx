'use client';

import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import DeleteRegistrationButton from '@/components/DeleteRegistrationButton';
import { useLanguage } from '@/context/LanguageContext';

interface TravelerWithUrls {
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
  frontUrl: string | null;
  backUrl: string | null;
}

interface Registration {
  id: string;
  check_in_date: string;
  check_out_date: string;
  children_count: number;
  property_ref: string | null;
  created_at: string;
  properties: { name: string; address: string | null } | null;
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid gap-1 border-b border-gray-100 py-2.5 last:border-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="break-words text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

function DocumentImage({ label, url }: { label: string; url: string | null }) {
  if (!url) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-gray-500">{label}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={label}
          className="max-h-64 max-w-full rounded-lg border border-gray-200 object-contain hover:opacity-90"
        />
      </a>
    </div>
  );
}

export default function AdminRegistrationDetailClient({
  registration,
  travelers,
  signatureUrl,
}: {
  registration: Registration;
  travelers: TravelerWithUrls[];
  signatureUrl: string | null;
}) {
  const { language } = useLanguage();
  const french = language === 'fr';

  return (
    <div className="print-document mx-auto max-w-5xl p-4 sm:p-8">
      <Link href="/admin/registrations" className="print-hidden text-sm font-medium text-primary-600 hover:underline">
        {french ? '← Retour aux enregistrements' : '← Back to registrations'}
      </Link>

      <div className="mb-8 mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{french ? "Document d'enregistrement invité" : 'Guest check-in document'}</h1>
          <p className="mt-1 break-all font-mono text-xs text-gray-400">{registration.id}</p>
        </div>
        <div className="print-hidden flex flex-wrap gap-3">
          <PrintButton />
          <DeleteRegistrationButton
            endpoint={`/api/admin/registrations/${registration.id}`}
            redirectTo="/admin/registrations"
            label={french ? "Supprimer l'enregistrement" : 'Remove registration'}
            confirmation={french ? 'Supprimer définitivement cet enregistrement et tous ses documents ?' : 'Permanently remove this registration and all its documents?'}
          />
        </div>
      </div>

      <section className="print-card mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-900">{french ? 'Enregistrement' : 'Registration'}</h2>
        <DetailRow label={french ? "ID d'enregistrement" : 'Registration ID'} value={registration.id} />
        <DetailRow label={french ? 'Soumis le' : 'Submitted at'} value={new Date(registration.created_at).toLocaleString()} />
        <DetailRow label={french ? "Date d'arrivée" : 'Check-in date'} value={registration.check_in_date} />
        <DetailRow label={french ? 'Date de départ' : 'Check-out date'} value={registration.check_out_date} />
        {registration.children_count > 0 && (
          <DetailRow label={french ? 'Enfants' : 'Children'} value={String(registration.children_count)} />
        )}
        <DetailRow label={french ? 'Référence propriété' : 'Property reference'} value={registration.property_ref} />
        <DetailRow label={french ? 'Nom de la propriété' : 'Property name'} value={registration.properties?.name ?? null} />
        <DetailRow label={french ? 'Adresse de la propriété' : 'Property address'} value={registration.properties?.address ?? null} />
      </section>

      {travelers.map((traveler, index) => (
        <section key={traveler.id} className="print-card mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-primary-600 px-6 py-3 text-sm font-semibold text-white">
            {french ? `Voyageur ${index + 1}` : `Traveler ${index + 1}`}: {traveler.first_name} {traveler.last_name}
          </div>
          <div className="p-6">
            <DetailRow label={french ? 'Prénom' : 'First name'} value={traveler.first_name} />
            <DetailRow label={french ? 'Nom' : 'Last name'} value={traveler.last_name} />
            <DetailRow label={french ? 'Date de naissance' : 'Date of birth'} value={traveler.date_of_birth} />
            <DetailRow label={french ? 'Lieu de naissance' : 'Place of birth'} value={traveler.place_of_birth} />
            <DetailRow label={french ? 'Nationalité' : 'Nationality'} value={traveler.nationality} />
            <DetailRow label={french ? 'Type de document' : 'Document type'} value={traveler.id_type?.toUpperCase()} />
            <DetailRow label={french ? 'Numéro de document' : 'Document number'} value={traveler.id_number} />
            <DetailRow label={french ? "Expiration du document" : 'Document expiry'} value={traveler.id_expiry_date} />
            <DetailRow label={french ? 'Adresse' : 'Address'} value={traveler.address} />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <DocumentImage label={french ? "Pièce d'identité — recto" : 'ID card — front'} url={traveler.frontUrl} />
              <DocumentImage label={french ? "Pièce d'identité — verso" : 'ID card — back'} url={traveler.backUrl} />
            </div>
          </div>
        </section>
      ))}

      <section className="print-card rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">{french ? 'Signature' : 'Signature'}</h2>
        {signatureUrl ? (
          <DocumentImage label={french ? "Signature de l'invité" : 'Guest signature'} url={signatureUrl} />
        ) : (
          <p className="text-sm text-gray-500">{french ? 'Aucune signature enregistrée pour cet enregistrement.' : 'No signature is stored for this registration.'}</p>
        )}
      </section>
    </div>
  );
}
