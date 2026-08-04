import { NextRequest, NextResponse } from 'next/server';
import { authenticatedOwner } from '@/lib/calendar-auth';
import { supabaseAdmin } from '@/lib/supabase';

async function feedUrl(request: NextRequest, rotate = false) {
  const user = await authenticatedOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = supabaseAdmin();
  if (rotate) {
    const { data, error } = await db.from('calendar_feed_tokens')
      .upsert({ owner_id: user.id, token: crypto.randomUUID(), updated_at: new Date().toISOString() })
      .select('token').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ url: `${request.nextUrl.origin}/api/calendar/feed/${data.token}` });
  }
  let { data, error } = await db.from('calendar_feed_tokens').select('token').eq('owner_id', user.id).maybeSingle();
  if (!data && !error) {
    const created = await db.from('calendar_feed_tokens').insert({ owner_id: user.id }).select('token').single();
    data = created.data; error = created.error;
  }
  if (error || !data) return NextResponse.json({ error: error?.message ?? 'Unable to create feed' }, { status: 500 });
  return NextResponse.json({ url: `${request.nextUrl.origin}/api/calendar/feed/${data.token}` });
}

export async function GET(request: NextRequest) { return feedUrl(request); }
export async function DELETE(request: NextRequest) { return feedUrl(request, true); }
