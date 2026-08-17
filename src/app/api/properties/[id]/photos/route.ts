import { NextRequest, NextResponse } from 'next/server';
import { authenticatedOwner, ownerHasProperty } from '@/lib/calendar-auth';
import { supabaseAdmin } from '@/lib/supabase';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PHOTOS_PER_PROPERTY = 20;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: propertyId } = await params;
  if (!await ownerHasProperty(user.id, propertyId)) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const db = supabaseAdmin();
  const { data: existingRows, error: existingError } = await db.from('property_photos')
    .select('sort_order').eq('property_id', propertyId);
  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  const existingCount = existingRows.length;
  // Base the next sort_order on the highest one in use, not the row count — photos
  // can be deleted, which would otherwise make count() collide with an existing
  // sort_order and put new uploads out of order relative to older ones.
  const nextSortOrder = existingRows.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1;

  const formData = await request.formData();
  const files = formData.getAll('photos').filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: 'No photos provided' }, { status: 400 });
  if (existingCount + files.length > MAX_PHOTOS_PER_PROPERTY) {
    return NextResponse.json({ error: `A property can have at most ${MAX_PHOTOS_PER_PROPERTY} photos` }, { status: 400 });
  }
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Use JPG, PNG, or WebP images up to 5 MB.' }, { status: 400 });
    }
  }

  const inserted = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${propertyId}/${Date.now()}-${i}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await db.storage
      .from('property-photos')
      .upload(path, buffer, { contentType: file.type, upsert: false });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = db.storage.from('property-photos').getPublicUrl(path);
    const { data: row, error: insertError } = await db.from('property_photos')
      .insert({ property_id: propertyId, url: urlData.publicUrl, sort_order: nextSortOrder + i })
      .select('id, url, sort_order').single();
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    inserted.push(row);
  }

  return NextResponse.json({ photos: inserted }, { status: 201 });
}
