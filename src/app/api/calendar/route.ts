import { NextRequest, NextResponse } from 'next/server';
import { authenticatedOwner, ownerHasProperty } from '@/lib/calendar-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const from = request.nextUrl.searchParams.get('from');
  const to = request.nextUrl.searchParams.get('to');
  const db = supabaseAdmin();
  let query = db
    .from('calendar_events')
    .select('id, property_id, registration_id, title, start_date, end_date, status, source, notes, properties(name, address)')
    .eq('owner_id', user.id)
    .order('start_date');
  if (from) query = query.gte('end_date', from);
  if (to) query = query.lte('start_date', to);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data ?? [] });
}

export async function POST(request: NextRequest) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const propertyId = typeof body.propertyId === 'string' ? body.propertyId : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const startDate = typeof body.startDate === 'string' ? body.startDate : '';
  const endDate = typeof body.endDate === 'string' ? body.endDate : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
  const status = body.status === 'blocked' ? 'blocked' : 'reserved';
  if (!propertyId || !title || title.length > 150 || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || endDate <= startDate || notes.length > 1000) {
    return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
  }
  if (!await ownerHasProperty(user.id, propertyId)) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db.from('calendar_events').insert({
    owner_id: user.id, property_id: propertyId, title, start_date: startDate,
    end_date: endDate, notes: notes || null, status, source: 'manual',
  }).select('id, property_id, registration_id, title, start_date, end_date, status, source, notes, properties(name, address)').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data }, { status: 201 });
}
