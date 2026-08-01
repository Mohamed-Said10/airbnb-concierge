import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DeleteRegistrationButton from '@/components/DeleteRegistrationButton';

interface Traveler {
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
  id_front_photo_url: string | null;
  id_back_photo_url: string | null;
}

interface Registration {
  id: string;
  check_in_date: string;
  check_out_date: string;
  signature_url: string | null;
  created_at: string;
  properties: { name: string; address: string | null } | null;
  travelers: Traveler[];
}

const BUCKET = 'guest-id-photos';
const SIGNED_URL_TTL = 60 * 60; // 1 hour

function extractPath(publicUrl: string): string {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  return idx !== -1 ? publicUrl.slice(idx + marker.length) : publicUrl;
}

async function signedUrl(db: ReturnType<typeof supabaseAdmin>, url: string | null): Promise<string | null> {
  if (!url) return null;
  const path = extractPath(url);
  const { data } = await db.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
  return data?.signedUrl ?? null;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
    <span className="w-40 shrink-0 text-xs font-medium text-gray-500">{label}</span>
    <span className="text-sm text-gray-800">{value || '—'}</span>
  </div>
);

export default async function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = supabaseAdmin();

  const { data: properties } = await db
    .from('properties')
    .select('id')
    .eq('owner_id', user.id);
  const propertyIds = (properties ?? []).map((p: { id: string }) => p.id);

  const { data: reg } = await db
    .from('guest_registrations')
    .select('id, check_in_date, check_out_date, signature_url, created_at, properties(name, address), travelers(*)')
    .eq('id', id)
    .in('property_id', propertyIds.length ? propertyIds : [''])
    .single();

  if (!reg) notFound();

  const registration = reg as unknown as Registration;

  // Generate signed URLs for all photos server-side (bucket is private)
  const signatureSignedUrl = await signedUrl(db, registration.signature_url);
  const travelersWithSignedUrls = await Promise.all(
    registration.travelers.map(async (t) => ({
      ...t,
      frontSigned: await signedUrl(db, t.id_front_photo_url),
      backSigned: await signedUrl(db, t.id_back_photo_url),
    }))
  );

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/dashboard/registrations" className="text-sm text-primary-600 hover:underline">
          ← Back to registrations
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Registration</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">{registration.id}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="text-xs text-gray-400">{new Date(registration.created_at).toLocaleString()}</span>
          <DeleteRegistrationButton
            endpoint={`/api/registrations/${registration.id}`}
            redirectTo="/dashboard/registrations"
          />
        </div>
      </div>

      {/* Stay details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Stay details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Property</p>
            <p className="mt-1 text-sm font-semibold text-gray-800">{registration.properties?.name ?? '—'}</p>
            {registration.properties?.address && (
              <p className="text-xs text-gray-400 mt-0.5">{registration.properties.address}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Dates</p>
            <p className="mt-1 text-sm text-gray-800">{registration.check_in_date} → {registration.check_out_date}</p>
          </div>
        </div>
      </div>

      {/* Travelers */}
      {travelersWithSignedUrls.map((t, idx) => (
        <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className={`px-6 py-3 ${idx === 0 ? 'bg-primary-600' : 'bg-gray-700'}`}>
            <span className="text-sm font-semibold text-white">
              {idx === 0 ? 'Main Traveler' : `Traveler ${idx + 1}`} — {t.first_name} {t.last_name}
            </span>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <Row label="First name" value={t.first_name} />
              <Row label="Last name" value={t.last_name} />
              <Row label="Date of birth" value={t.date_of_birth} />
              <Row label="Place of birth" value={t.place_of_birth} />
              <Row label="Nationality" value={t.nationality} />
              <Row label="Document type" value={t.id_type?.toUpperCase()} />
              <Row label="Document number" value={t.id_number} />
              <Row label="Expiry date" value={t.id_expiry_date} />
              <Row label="Address" value={t.address} />
            </div>
            {(t.frontSigned || t.backSigned) && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-3">ID Photos</p>
                <div className="flex gap-4 flex-wrap">
                  {t.frontSigned && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Front</p>
                      <a href={t.frontSigned} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.frontSigned} alt="ID front" width={200}
                          className="rounded-lg border border-gray-200 object-cover hover:opacity-90 transition-opacity max-h-32" />
                      </a>
                    </div>
                  )}
                  {t.backSigned && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Back</p>
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
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Signature</h2>
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
