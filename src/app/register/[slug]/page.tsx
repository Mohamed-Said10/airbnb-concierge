import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import GuestRegistrationForm from '@/components/GuestRegistrationForm';

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: property } = await supabaseAdmin()
    .from('properties')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (!property) return notFound();

  return <GuestRegistrationForm propertyId={property.id} propertyName={property.name} />;
}
