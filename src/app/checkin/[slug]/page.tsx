import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import GuestRegistrationForm from '@/components/GuestRegistrationForm';

export default async function CheckinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = supabaseAdmin();

  const { data: property } = await db
    .from('properties')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (!property) return notFound();

  const { data: photos } = await db
    .from('property_photos')
    .select('url')
    .eq('property_id', property.id)
    .order('sort_order').order('created_at');

  return (
    <GuestRegistrationForm
      propertyId={property.id}
      propertyName={property.name}
      propertyPhotos={(photos ?? []).map((photo) => photo.url)}
    />
  );
}
