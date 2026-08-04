import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const escapeIcs = (value: string | null | undefined) => (value ?? '')
  .replaceAll('\\', '\\\\').replaceAll('\r', '').replaceAll('\n', '\\n')
  .replaceAll(',', '\\,').replaceAll(';', '\\;');
const icsDate = (date: string) => date.replaceAll('-', '');

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(token)) return new NextResponse('Not found', { status: 404 });
  const db = supabaseAdmin();
  const { data: feed } = await db.from('calendar_feed_tokens').select('owner_id').eq('token', token).maybeSingle();
  if (!feed) return new NextResponse('Not found', { status: 404 });
  const { data: events, error } = await db.from('calendar_events')
    .select('id, title, start_date, end_date, status, source, notes, properties(name, address)')
    .eq('owner_id', feed.owner_id).order('start_date');
  if (error) return new NextResponse('Unable to load calendar', { status: 500 });

  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const eventLines = (events ?? []).flatMap((event) => {
    const property = event.properties as unknown as { name: string; address: string | null } | null;
    const description = [event.notes, `Property: ${property?.name ?? ''}`, `Status: ${event.status}`, `Source: ${event.source}`].filter(Boolean).join('\n');
    return [
      'BEGIN:VEVENT', `UID:${event.id}@kozibnb.com`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(event.start_date)}`, `DTEND;VALUE=DATE:${icsDate(event.end_date)}`,
      `SUMMARY:${escapeIcs(event.title)}`, `DESCRIPTION:${escapeIcs(description)}`,
      ...(property?.address ? [`LOCATION:${escapeIcs(property.address)}`] : []),
      'TRANSP:OPAQUE', 'END:VEVENT',
    ];
  });
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KoziBnB//Reservation Calendar//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:KoziBnB Reservations',
    'X-WR-TIMEZONE:Africa/Casablanca', ...eventLines, 'END:VCALENDAR', ''].join('\r\n');
  return new NextResponse(calendar, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="kozibnb-reservations.ics"',
      'Cache-Control': 'no-store',
    },
  });
}
