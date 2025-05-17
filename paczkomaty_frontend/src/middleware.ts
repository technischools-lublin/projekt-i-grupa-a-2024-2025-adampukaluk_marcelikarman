import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Ścieżki dostępne bez logowania
const PUBLIC_PATHS = ['/login', '/register', '/'];

export function middleware(request: NextRequest) {
  // // Get token from cookies
  const token = request.cookies.get('authToken')?.value;
  const pathname = request.nextUrl.pathname;

  
  // Jeśli użytkownik jest zalogowany i próbuje wejść na publiczną ścieżkę
  if (token && PUBLIC_PATHS.includes(pathname)) {
    console.log('Logged-in user trying to access public path, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Jeśli użytkownik nie jest zalogowany i próbuje wejść na chronioną ścieżkę
  if (!token && !PUBLIC_PATHS.includes(pathname)) {
    console.log('Non-logged-in user trying to access protected path, redirecting to login');
    
    // Zapobieganie pętli przekierowań
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  console.log('Request passing through middleware normally');
  return NextResponse.next();
}

// Matcher nie przechwytuje statycznych plików i obrazów
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};