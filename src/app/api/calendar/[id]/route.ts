import { NextRequest, NextResponse } from 'next/server';
import { authenticatedOwner, ownerHasProperty } from '@/lib/calendar-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json() as Record<string, unknown>;
  const propertyId = typeof body.propertyId === 'string' ? body.propertyId : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const startDate = typeof body.startDate === 'string' ? body.startDate : '';
  const endDate = typeof body.endDate === 'string' ? body.endDate : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
  const status = body.status === 'blocked' ? 'blocked' : 'reserved';
  const rawNightPrice = typeof body.nightPrice === 'number' ? body.nightPrice : Number(body.nightPrice);
  const nightPrice = status === 'reserved' && body.nightPrice !== '' && body.nightPrice != null && Number.isFinite(rawNightPrice) && rawNightPrice >= 0 ? rawNightPrice : null;
  if (!propertyId || !title || title.length > 150 || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || endDate <= startDate || notes.length > 1000) {
    return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
  }
  if (!await ownerHasProperty(user.id, propertyId)) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  const nights = Math.round((new Date(`${endDate}T00:00:00Z`).getTime() - new Date(`${startDate}T00:00:00Z`).getTime()) / 86_400_000);
  const amount = nightPrice != null ? Math.round(nightPrice * nights * 100) / 100 : null;
  const db = supabaseAdmin();
  const { data, error } = await db.from('calendar_events').update({
    property_id: propertyId, title, start_date: startDate, end_date: endDate,
    notes: notes || null, status, night_price: nightPrice, amount, updated_at: new Date().toISOString(),
  }).eq('id', id).eq('owner_id', user.id)
    .select('id, property_id, registration_id, title, start_date, end_date, status, source, notes, night_price, amount, properties(name, address)').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = supabaseAdmin();
  const { data: event, error: findError } = await db.from('calendar_events')
    .select('id').eq('id', id).eq('owner_id', user.id).maybeSingle();
  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { error } = await db.from('calendar_events').delete().eq('id', id).eq('owner_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
