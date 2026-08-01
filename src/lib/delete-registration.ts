import { supabaseAdmin } from '@/lib/supabase';

const BUCKET = 'guest-id-photos';

function storagePath(value: string | null): string | null {
  if (!value) return null;
  const markers = [
    `/storage/v1/object/public/${BUCKET}/`,
    `/storage/v1/object/sign/${BUCKET}/`,
  ];
  for (const marker of markers) {
    const index = value.indexOf(marker);
    if (index !== -1) return decodeURIComponent(value.slice(index + marker.length).split('?')[0]);
  }
  return value.startsWith('http') ? null : value.split('?')[0];
}

export async function deleteRegistration(id: string, ownerId?: string) {
  const db = supabaseAdmin();

  let allowedPropertyIds: string[] | undefined;
  if (ownerId) {
    const { data: properties, error } = await db
      .from('properties')
      .select('id')
      .eq('owner_id', ownerId);
    if (error) throw error;
    allowedPropertyIds = (properties ?? []).map((property) => property.id);
    if (allowedPropertyIds.length === 0) return false;
  }

  let query = db
    .from('guest_registrations')
    .select('id, signature_url, travelers(id_front_photo_url, id_back_photo_url)')
    .eq('id', id);
  if (allowedPropertyIds) query = query.in('property_id', allowedPropertyIds);

  const { data: registration, error: findError } = await query.maybeSingle();
  if (findError) throw findError;
  if (!registration) return false;

  const { error: deleteError } = await db.from('guest_registrations').delete().eq('id', id);
  if (deleteError) throw deleteError;

  const travelers = (registration.travelers ?? []) as Array<{
    id_front_photo_url: string | null;
    id_back_photo_url: string | null;
  }>;
  const paths = [
    storagePath(registration.signature_url),
    ...travelers.flatMap((traveler) => [
      storagePath(traveler.id_front_photo_url),
      storagePath(traveler.id_back_photo_url),
    ]),
  ].filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    const { error: storageError } = await db.storage.from(BUCKET).remove([...new Set(paths)]);
    if (storageError) console.error('[registration/delete/storage]', storageError);
  }

  return true;
}
