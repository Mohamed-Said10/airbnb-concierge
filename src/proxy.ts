import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const code = req.nextUrl.searchParams.get('code');
  if (code && !pathname.startsWith('/auth/callback')) {
    const callbackUrl = new URL('/auth/callback', req.url);
    callbackUrl.searchParams.set('code', code);
    callbackUrl.searchParams.set('next', pathname === '/' ? '/dashboard' : pathname);
    return NextResponse.redirect(callbackUrl);
  }

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (pathname.startsWith('/admin')) {
    let isAdmin = false;
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      isAdmin = profile?.role === 'admin';
    }
    if (pathname === '/admin/login') {
      return isAdmin ? NextResponse.redirect(new URL('/admin', req.url)) : res;
    }
    return isAdmin ? res : NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
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
