import { NextRequest, NextResponse } from 'next/server';
import { COUNTRY_CODES } from '@/data/countries';

export const dynamic = 'force-dynamic';

export function GET(req: NextRequest) {
  const vercelCountry = req.headers.get('x-vercel-ip-country')?.toUpperCase();
  const languageRegion = req.headers
    .get('accept-language')
    ?.match(/[-_]([A-Za-z]{2})(?:,|;|-|_|$)/)?.[1]
    ?.toUpperCase();
  const countryCode = [vercelCountry, languageRegion].find(
    (code): code is string => !!code && COUNTRY_CODES.includes(code)
  );

  return NextResponse.json(
    { countryCode: countryCode ?? null },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
}
