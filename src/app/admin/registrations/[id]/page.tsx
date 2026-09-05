import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AdminRegistrationDetailClient from './AdminRegistrationDetailClient';

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
  children_count: number;
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
      children_count,
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
    <AdminRegistrationDetailClient
      registration={registration}
      travelers={travelers}
      signatureUrl={signatureUrl}
    />
  );
}
