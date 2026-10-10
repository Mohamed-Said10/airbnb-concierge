import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteRegistration } from '@/lib/delete-registration';

export const dynamic = 'force-dynamic';

// Enforces Law 09-08's "no longer than necessary" retention principle by
// deleting guest_registrations (and their travelers + storage files, via the
// shared deleteRegistration() helper) once retention_until has passed.
// Triggered daily by the Vercel Cron entry in vercel.json. Vercel
// automatically sends `Authorization: Bearer ${CRON_SECRET}` on cron
// invocations when that env var is set — verified below so this route can't
// be triggered by an arbitrary request.
const BATCH_SIZE = 200;

export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected || req.headers.get('authorization') !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);

  const { data: expiredRegistrations, error } = await db
    .from('guest_registrations')
    .select('id')
    .lte('retention_until', today)
    .limit(BATCH_SIZE);

  if (error) {
    console.error('[cron/purge-expired-registrations]', error);
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }

  let deleted = 0;
  let failed = 0;
  for (const registration of expiredRegistrations ?? []) {
    try {
      const ok = await deleteRegistration(registration.id);
      if (ok) deleted += 1;
    } catch (deleteError) {
      failed += 1;
      console.error('[cron/purge-expired-registrations] failed to delete', registration.id, deleteError);
    }
  }

  return NextResponse.json({ checked: expiredRegistrations?.length ?? 0, deleted, failed });
}
