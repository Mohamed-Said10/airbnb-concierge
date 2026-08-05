import { NextRequest, NextResponse } from 'next/server';
import { authenticatedOwner, ownerHasProperty } from '@/lib/calendar-auth';
import { supabaseAdmin } from '@/lib/supabase';

const CATEGORIES = ['electricity', 'water', 'gas', 'internet', 'maintenance', 'cleaning', 'tax', 'insurance', 'ads', 'other'];

export async function GET(request: NextRequest) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const propertyId = request.nextUrl.searchParams.get('propertyId');
  const status = request.nextUrl.searchParams.get('status');
  const db = supabaseAdmin();
  let query = db
    .from('bills')
    .select('id, property_id, category, title, amount, currency, due_date, status, paid_at, notes, properties(name, address)')
    .eq('owner_id', user.id)
    .order('due_date');
  if (propertyId) query = query.eq('property_id', propertyId);
  if (status === 'paid' || status === 'unpaid') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bills: data ?? [] });
}

export async function POST(request: NextRequest) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const propertyId = typeof body.propertyId === 'string' ? body.propertyId : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const category = typeof body.category === 'string' && CATEGORIES.includes(body.category) ? body.category : 'other';
  const amount = typeof body.amount === 'number' ? body.amount : Number(body.amount);
  const dueDate = typeof body.dueDate === 'string' ? body.dueDate : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
  const status = body.status === 'paid' ? 'paid' : 'unpaid';
  if (!propertyId || !title || title.length > 150 || !Number.isFinite(amount) || amount <= 0
    || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || notes.length > 1000) {
    return NextResponse.json({ error: 'Invalid bill data' }, { status: 400 });
  }
  if (!await ownerHasProperty(user.id, propertyId)) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }
  const db = supabaseAdmin();
  const { data, error } = await db.from('bills').insert({
    owner_id: user.id, property_id: propertyId, category, title, amount,
    due_date: dueDate, notes: notes || null, status, paid_at: status === 'paid' ? new Date().toISOString() : null,
  }).select('id, property_id, category, title, amount, currency, due_date, status, paid_at, notes, properties(name, address)').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bill: data }, { status: 201 });
}
