import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://*.youtube.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    frame-src 'self' https://www.youtube.com https://*.youtube.com;
    connect-src 'self' https://www.google-analytics.com https://*.clarity.ms wss://*.clarity.ms;
  `.replace(/\s{2,}/g, ' ').trim();

  // Security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // changed from DENY to allow rendering in same-origin iframes
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    // Apply to all frontend routes, skip API/admin/static files
    '/((?!api|_next/static|_next/image|admin|favicon.ico|images|robots.txt|sitemap.xml).*)',
  ],
};
