import { NextRequest, NextResponse } from 'next/server';
import { COUNTRY_CODES } from '@/data/countries';

export const dynamic = 'force-dynamic';

export function GET(req: NextRequest) {
  // Only trust real IP-based geolocation here. The Accept-Language region subtag
  // (e.g. "fr-FR") describes a language variant, not a location — a Moroccan or
  // Canadian guest browsing in French would incorrectly resolve to France.
  // Fall back to Morocco (most guests) when no geolocation header is present,
  // e.g. local development or hosting without IP geolocation.
  const vercelCountry = req.headers.get('x-vercel-ip-country')?.toUpperCase();
  const countryCode = vercelCountry && COUNTRY_CODES.includes(vercelCountry) ? vercelCountry : 'MA';

  return NextResponse.json(
    { countryCode },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
}
