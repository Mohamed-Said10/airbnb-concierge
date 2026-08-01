import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/admin/login', request.url));
}
