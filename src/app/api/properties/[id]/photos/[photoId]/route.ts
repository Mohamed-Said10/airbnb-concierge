import { NextRequest, NextResponse } from 'next/server';
import { authenticatedOwner, ownerHasProperty } from '@/lib/calendar-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: propertyId, photoId } = await params;
  if (!await ownerHasProperty(user.id, propertyId)) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const db = supabaseAdmin();
  const { data: photo } = await db.from('property_photos')
    .select('id, url').eq('id', photoId).eq('property_id', propertyId).maybeSingle();
  if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const marker = '/storage/v1/object/public/property-photos/';
  const markerIndex = photo.url.indexOf(marker);
  if (markerIndex !== -1) {
    await db.storage.from('property-photos').remove([photo.url.slice(markerIndex + marker.length)]);
  }

  const { error } = await db.from('property_photos').delete().eq('id', photoId).eq('property_id', propertyId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
