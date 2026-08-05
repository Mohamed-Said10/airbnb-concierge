import { NextRequest, NextResponse } from 'next/server';
import { authenticatedOwner, ownerHasProperty } from '@/lib/calendar-auth';
import { supabaseAdmin } from '@/lib/supabase';

const CATEGORIES = ['electricity', 'water', 'gas', 'internet', 'maintenance', 'cleaning', 'tax', 'insurance', 'ads', 'other'];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
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
  if (!await ownerHasProperty(user.id, propertyId)) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  const db = supabaseAdmin();
  const { data: existing } = await db.from('bills').select('status, paid_at').eq('id', id).eq('owner_id', user.id).maybeSingle();
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const paidAt = status === 'paid' ? (existing.status === 'paid' ? existing.paid_at : new Date().toISOString()) : null;
  const { data, error } = await db.from('bills').update({
    property_id: propertyId, category, title, amount, due_date: dueDate,
    notes: notes || null, status, paid_at: paidAt, updated_at: new Date().toISOString(),
  }).eq('id', id).eq('owner_id', user.id)
    .select('id, property_id, category, title, amount, currency, due_date, status, paid_at, notes, properties(name, address)').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ bill: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = supabaseAdmin();
  const { data: bill, error: findError } = await db.from('bills')
    .select('id').eq('id', id).eq('owner_id', user.id).maybeSingle();
  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });
  if (!bill) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { error } = await db.from('bills').delete().eq('id', id).eq('owner_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
