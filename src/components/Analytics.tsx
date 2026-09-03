"use client";

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

interface AnalyticsProps {
  googleAnalyticsId?: string;
  microsoftClarityId?: string;
}

function PageViewTracker({
  googleAnalyticsId,
}: {
  googleAnalyticsId?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || typeof window === 'undefined') return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // 1. Google Analytics SPA Page View Tracking
    if (googleAnalyticsId) {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag === 'function') {
        window.gtag('config', googleAnalyticsId, {
          page_path: url,
          page_location: window.location.href,
          page_title: document.title,
        });
        window.gtag('event', 'page_view', {
          page_path: url,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }

    // 2. Microsoft Clarity SPA Page Tracking
    if (typeof window.clarity === 'function') {
      try {
        window.clarity('set', 'page', url);
      } catch (e) {
        console.error('Clarity page error:', e);
      }
    }
  }, [pathname, searchParams, googleAnalyticsId]);

  return null;
}

export default function Analytics({
  googleAnalyticsId,
  microsoftClarityId
}: AnalyticsProps) {
  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker googleAnalyticsId={googleAnalyticsId} />
      </Suspense>

      {/* Ahrefs Analytics */}
      <Script 
        src="https://analytics.ahrefs.com/analytics.js" 
        data-key="fJ5uoYkEvvPkQ+BgDzWUyg" 
        strategy="afterInteractive" 
      />

      {/* Microsoft Clarity */}
      {microsoftClarityId && (
        <Script 
          id="microsoft-clarity" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${microsoftClarityId}");
            `
          }}
        />
      )}

      {/* Google Analytics 4 */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script 
            id="google-analytics" 
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  'analytics_storage': 'granted',
                  'ad_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'granted'
                });
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  page_path: window.location.pathname,
                  page_location: window.location.href,
                  page_title: document.title,
                  send_page_view: true
                });
              `
            }}
          />
        </>
      )}
    </>
  );
}

