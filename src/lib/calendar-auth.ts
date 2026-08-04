import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

export async function authenticatedOwner() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function ownerPropertyIds(ownerId: string) {
  const { data, error } = await supabaseAdmin()
    .from('properties').select('id').eq('owner_id', ownerId);
  if (error) throw error;
  return (data ?? []).map((property) => property.id as string);
}

export async function ownerHasProperty(ownerId: string, propertyId: string) {
  const { data, error } = await supabaseAdmin()
    .from('properties').select('id').eq('id', propertyId).eq('owner_id', ownerId).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}
