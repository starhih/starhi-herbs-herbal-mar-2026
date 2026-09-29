"use client";

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

interface AnalyticsProps {
  googleAnalyticsId?: string;
  googleAdsId?: string;
  microsoftClarityId?: string;
}

function PageViewTracker({
  googleAnalyticsId,
}: {
  googleAnalyticsId?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!pathname || typeof window === 'undefined') return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // 1. Google Analytics SPA Page View Tracking.
    // The initial load is already counted by gtag('config') in the loader script, and a
    // 'config' call here would send a second page_view, so only client-side navigations
    // send one explicit event.
    const firstLoad = isFirstLoad.current;
    isFirstLoad.current = false;
    if (googleAnalyticsId && !firstLoad) {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag === 'function') {
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
  googleAdsId,
  microsoftClarityId
}: AnalyticsProps) {
  // One gtag.js load serves both GA4 and Google Ads
  const gtagLoaderId = googleAnalyticsId || googleAdsId;

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

      {/* Google Analytics 4 + Google Ads */}
      {gtagLoaderId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagLoaderId}`}
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
                ${googleAnalyticsId ? `gtag('config', '${googleAnalyticsId}', {
                  page_path: window.location.pathname,
                  page_location: window.location.href,
                  page_title: document.title,
                  send_page_view: true
                });` : ''}
                ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ''}
              `
            }}
          />
        </>
      )}
    </>
  );
}

