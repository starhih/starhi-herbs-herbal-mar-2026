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
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

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
    if (!scriptsLoaded) return;

    if (consent === 'accepted') {
      // Enable analytics
      if (googleAnalyticsId && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else if (consent === 'declined') {
      // Disable analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }
  }, [consent, scriptsLoaded, googleAnalyticsId]);

  // Don't render anything if no IDs provided
  if (!googleAnalyticsId && !microsoftClarityId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
            onLoad={() => setScriptsLoaded(true)}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
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

              console.log('Google Analytics initialized with ID: ${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Microsoft Clarity */}
      {microsoftClarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${microsoftClarityId}");

            console.log('Microsoft Clarity initialized with ID: ${microsoftClarityId}');
          `}
        </Script>
      )}
    </>
  );
}
