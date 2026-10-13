"use client";

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { captureAttribution } from '@/lib/attribution';

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

    captureAttribution(searchParams);

    // 1. Google Analytics SPA Page View Tracking.
    // The initial load is already counted by gtag('config') in the loader script, and a
    // 'config' call here would send a second page_view, so only client-side navigations
    // send one explicit event. No page_path: GA4 appends page_location's query string to it,
    // which recorded /thank-you?type=quote as /thank-you?type=quote?type=quote.
    const firstLoad = isFirstLoad.current;
    isFirstLoad.current = false;
    if (googleAnalyticsId && !firstLoad) {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
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
                // A refresh or back/forward reload of /thank-you is not a new lead; skipping its
                // page_view keeps GA4's lead_thank_you to one per submission.
                var shhNav = window.performance && performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
                var shhThankYouRevisit = window.location.pathname === '/thank-you' && !!shhNav &&
                  (shhNav.type === 'reload' || shhNav.type === 'back_forward');
                ${googleAnalyticsId ? `gtag('config', '${googleAnalyticsId}', {
                  page_location: window.location.href,
                  page_title: document.title,
                  send_page_view: !shhThankYouRevisit
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

