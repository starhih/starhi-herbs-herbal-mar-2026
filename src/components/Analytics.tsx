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
  // Last address counted; null until the first load. Repeats of the same address (React's
  // dev double-run, re-renders) must not send another page_view.
  const lastUrl = useRef<string | null>(null);
  // Title of the last page counted, to tell when the new page's title has arrived
  const lastTitle = useRef('');

  useEffect(() => {
    if (!pathname || typeof window === 'undefined') return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    captureAttribution(searchParams);

    if (lastUrl.current === url) return;
    const firstLoad = lastUrl.current === null;
    lastUrl.current = url;

    // 1. Google Analytics SPA Page View Tracking.
    // The initial load is already counted by gtag('config') in the loader script, and a
    // 'config' call here would send a second page_view, so only client-side navigations
    // send one explicit event. No page_path: GA4 appends page_location's query string to it,
    // which recorded /thank-you?type=quote as /thank-you?type=quote?type=quote.
    //
    // Next.js sets the new title 100-300 ms after the URL changes, so the event waits for it
    // (up to 2 s). Sent straight away it carried the previous page's title or none, which
    // filed /thank-you views under "Request a Quote" in GA4.
    // GA4's own "page changes based on browser history events" (Enhanced measurement) must
    // stay off, or every client-side navigation, including /thank-you, counts twice.
    let titleTimer: ReturnType<typeof setTimeout> | undefined;
    if (firstLoad) {
      lastTitle.current = document.title;
    } else if (googleAnalyticsId) {
      const previousTitle = lastTitle.current;
      const pageLocation = window.location.href;
      const startedAt = Date.now();
      const sendWhenTitled = () => {
        const title = document.title;
        if ((!title || title === previousTitle) && Date.now() - startedAt < 2000) {
          titleTimer = setTimeout(sendWhenTitled, 50);
          return;
        }
        lastTitle.current = title;
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'page_view', {
            page_location: pageLocation,
            page_title: title,
          });
        }
      };
      sendWhenTitled();
    }

    // 2. Microsoft Clarity SPA Page Tracking
    if (typeof window.clarity === 'function') {
      try {
        window.clarity('set', 'page', url);
      } catch (e) {
        console.error('Clarity page error:', e);
      }
    }

    return () => clearTimeout(titleTimer);
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

