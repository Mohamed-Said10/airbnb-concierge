import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Public endpoint (the guest registration form is unauthenticated). Only ever
// returns booking date ranges or a boolean — never guest/reservation details —
// so it's safe to expose without auth.
export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get('propertyId') ?? '';
  const from = request.nextUrl.searchParams.get('from') ?? '';
  const to = request.nextUrl.searchParams.get('to') ?? '';
  if (!propertyId) return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });

  const db = supabaseAdmin();

  // Boolean check for a specific range (used to authoritatively re-verify at submit time).
  if (from || to) {
    if (!ISO_DATE.test(from) || !ISO_DATE.test(to) || to <= from) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }
    const { data, error } = await db
      .from('calendar_events')
      .select('id')
      .eq('property_id', propertyId)
      .in('status', ['reserved', 'blocked'])
      .lt('start_date', to)
      .gt('end_date', from)
      .limit(1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(
      { available: (data ?? []).length === 0 },
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  // Otherwise: the full list of upcoming booked date ranges, so the guest-facing
  // calendar can show them (Airbnb-style struck-through days) before a date is even picked.
  const todayIso = new Date().toISOString().slice(0, 10);
  const { data, error } = await db
    .from('calendar_events')
    .select('start_date, end_date')
    .eq('property_id', propertyId)
    .in('status', ['reserved', 'blocked'])
    .gte('end_date', todayIso)
    .order('start_date');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { bookedRanges: (data ?? []).map((row) => ({ start: row.start_date, end: row.end_date })) },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
}
