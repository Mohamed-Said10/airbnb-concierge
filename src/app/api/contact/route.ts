import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, propertyType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from('contact_leads')
      .insert({ name, email, phone: phone || null, property_type: propertyType || null, message });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[contact] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
