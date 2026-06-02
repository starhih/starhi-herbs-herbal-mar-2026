import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://*.youtube.com https://analytics.ahrefs.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https: https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://*.google.com https://*.clarity.ms https://*.bing.com;
    font-src 'self' https://fonts.gstatic.com data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' https://clarity.microsoft.com https://*.clarity.ms;
    frame-src 'self' https://www.youtube.com https://*.youtube.com https://maps.google.com https://www.google.com;
    connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://*.clarity.ms wss://*.clarity.ms https://*.bing.com https://analytics.ahrefs.com;
  `.replace(/\s{2,}/g, ' ').trim();

  // Security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Commented out X-Frame-Options because frame-ancestors is used instead.
  // Microsoft Clarity requires the site to be framable within clarity.microsoft.com for heatmaps and playbacks.
  // response.headers.set('X-Frame-Options', 'SAMEORIGIN');
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
