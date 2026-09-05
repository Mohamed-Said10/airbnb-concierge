import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import RegistrationDetailClient from './RegistrationDetailClient';

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
    .select('id, check_in_date, check_out_date, children_count, signature_url, created_at, properties(name, address), travelers(*)')
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
    <RegistrationDetailClient
      registration={registration}
      travelers={travelersWithSignedUrls}
      signatureSignedUrl={signatureSignedUrl}
    />
  );
}
