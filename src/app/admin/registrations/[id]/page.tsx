import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  property_ref: string | null;
  created_at: string;
  properties: { name: string; address: string | null } | null;
  travelers: Traveler[];
}

const BUCKET = 'guest-id-photos';
const SIGNED_URL_TTL = 60 * 60;

function extractStoragePath(value: string): string {
  const publicMarker = `/storage/v1/object/public/${BUCKET}/`;
  const signedMarker = `/storage/v1/object/sign/${BUCKET}/`;
  for (const marker of [publicMarker, signedMarker]) {
    const index = value.indexOf(marker);
    if (index !== -1) return value.slice(index + marker.length).split('?')[0];
  }
  return value;
}

async function createSignedUrl(
  db: ReturnType<typeof supabaseAdmin>,
  value: string | null
): Promise<string | null> {
  if (!value) return null;
  const { data, error } = await db.storage
    .from(BUCKET)
    .createSignedUrl(extractStoragePath(value), SIGNED_URL_TTL);
  if (error) console.error('[admin/registration/file]', error);
  return data?.signedUrl ?? null;
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] gap-4 border-b border-gray-100 py-2.5 last:border-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="break-words text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

function DocumentImage({
  label,
  url,
}: {
  label: string;
  url: string | null;
}) {
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

export default async function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('guest_registrations')
    .select(`
      id,
      check_in_date,
      check_out_date,
      signature_url,
      property_ref,
      created_at,
      properties(name, address),
      travelers(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) notFound();
  const registration = data as unknown as Registration;
  const signatureUrl = await createSignedUrl(db, registration.signature_url);
  const travelers = await Promise.all(
    registration.travelers.map(async (traveler) => ({
      ...traveler,
      frontUrl: await createSignedUrl(db, traveler.id_front_photo_url),
      backUrl: await createSignedUrl(db, traveler.id_back_photo_url),
    }))
  );

  return (
    <div className="mx-auto max-w-5xl p-8">
      <Link href="/admin/registrations" className="text-sm font-medium text-primary-600 hover:underline">
        ← Back to registrations
      </Link>

      <div className="mb-8 mt-5">
        <h1 className="text-2xl font-extrabold text-gray-900">Registration details</h1>
        <p className="mt-1 break-all font-mono text-xs text-gray-400">{registration.id}</p>
      </div>

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-900">Registration</h2>
        <DetailRow label="Registration ID" value={registration.id} />
        <DetailRow label="Submitted at" value={new Date(registration.created_at).toLocaleString()} />
        <DetailRow label="Check-in date" value={registration.check_in_date} />
        <DetailRow label="Check-out date" value={registration.check_out_date} />
        <DetailRow label="Property reference" value={registration.property_ref} />
        <DetailRow label="Property name" value={registration.properties?.name ?? null} />
        <DetailRow label="Property address" value={registration.properties?.address ?? null} />
      </section>

      {travelers.map((traveler, index) => (
        <section key={traveler.id} className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-primary-600 px-6 py-3 text-sm font-semibold text-white">
            Traveler {index + 1}: {traveler.first_name} {traveler.last_name}
          </div>
          <div className="p-6">
            <DetailRow label="First name" value={traveler.first_name} />
            <DetailRow label="Last name" value={traveler.last_name} />
            <DetailRow label="Date of birth" value={traveler.date_of_birth} />
            <DetailRow label="Place of birth" value={traveler.place_of_birth} />
            <DetailRow label="Nationality" value={traveler.nationality} />
            <DetailRow label="Document type" value={traveler.id_type?.toUpperCase()} />
            <DetailRow label="Document number" value={traveler.id_number} />
            <DetailRow label="Document expiry" value={traveler.id_expiry_date} />
            <DetailRow label="Address" value={traveler.address} />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <DocumentImage label="ID card — front" url={traveler.frontUrl} />
              <DocumentImage label="ID card — back" url={traveler.backUrl} />
            </div>
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Signature</h2>
        {signatureUrl ? (
          <DocumentImage label="Guest signature" url={signatureUrl} />
        ) : (
          <p className="text-sm text-gray-500">No signature is stored for this registration.</p>
        )}
      </section>
    </div>
  );
}
