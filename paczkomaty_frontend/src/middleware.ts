import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === '/admin') {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    try {
      const res = await fetch('http://localhost:8000/api/checkIsSupperUser/', {
        method: 'GET',
        headers: {
          'Cookie': `authToken=${token}`
        },
        credentials: 'include',
      });
      if (!res.ok) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      const data = await res.json();
      if (data.is_superuser) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (token && PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!token && !PUBLIC_PATHS.includes(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
    '/admin',
  ],
};