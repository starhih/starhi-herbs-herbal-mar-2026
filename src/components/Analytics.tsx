"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface AnalyticsProps {
  googleAnalyticsId?: string;
  microsoftClarityId?: string;
}

export default function Analytics({
  googleAnalyticsId,
  microsoftClarityId
}: AnalyticsProps) {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    // Check consent status on mount and when it changes
    const checkConsent = () => {
      const consentStatus = localStorage.getItem('cookie-consent');
      setConsent(consentStatus);
    };

    checkConsent();

    // Listen for storage changes (when consent is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent') {
        checkConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom consent events
    const handleConsentChange = () => checkConsent();
    window.addEventListener('consent-updated', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('consent-updated', handleConsentChange);
    };
  }, []);

  // Update analytics consent when consent changes
  useEffect(() => {
    if (consent === 'accepted') {
      // Enable analytics
      if (googleAnalyticsId && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
      
      // Update Clarity consent
      if (typeof window !== 'undefined' && window.clarity) {
        try {
          window.clarity('consent');
        } catch (e) {
          console.error("Failed to update Clarity consent", e);
        }
      }
    } else if (consent === 'declined') {
      // Disable analytics
      if (googleAnalyticsId && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
      
      // Note: Microsoft Clarity does not have a native 'revoke consent' function once initiated,
      // it only waits for window.clarity('consent') to start collecting if 'Require consent' is ON.
    }
  }, [consent, googleAnalyticsId]);

  return (
    <>
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
              
              // Apply consent if already granted on load
              if (localStorage.getItem('cookie-consent') === 'accepted') {
                window.clarity('consent');
              }
            `
          }}
        />
      )}

      {/* Google Analytics */}
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
                gtag('js', new Date());

                // Set default consent based on current status
                const currentConsent = localStorage.getItem('cookie-consent');
                gtag('consent', 'default', {
                  'analytics_storage': currentConsent === 'accepted' ? 'granted' : 'denied'
                });

                gtag('config', '${googleAnalyticsId}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `
            }}
          />
        </>
      )}
    </>
  );
}
