import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin protection (cookie-based, no Supabase) ──────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token');
    const expected = process.env.ADMIN_PASSWORD;
    if (!token || !expected || token.value !== expected) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // ── Auth code exchange: forward ?code= to /auth/callback from any URL ──────
  const code = req.nextUrl.searchParams.get('code');
  if (code && !pathname.startsWith('/auth/callback')) {
    const callbackUrl = new URL('/auth/callback', req.url);
    callbackUrl.searchParams.set('code', code);
    callbackUrl.searchParams.set('next', pathname === '/' ? '/dashboard' : pathname);
    return NextResponse.redirect(callbackUrl);
  }

  // ── Supabase session refresh (keeps auth cookies current) ─────────────────
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  // ── Dashboard protection ──────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ── Redirect authenticated users away from auth pages ────────────────────
  if ((pathname === '/login' || pathname === '/signup') && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/((?!_next/static|_next/image|favicon\\.ico|api/).*)',
  ],
};
