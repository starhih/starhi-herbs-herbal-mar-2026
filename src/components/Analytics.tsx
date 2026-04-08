"use client";

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import Clarity from '@microsoft/clarity';

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
  const clarityInitialized = useRef(false);

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
    if (!scriptsLoaded && !clarityInitialized.current) return;

    if (consent === 'accepted') {
      // Enable analytics
      if (googleAnalyticsId && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
      
      // Update Clarity consent
      if (typeof window !== 'undefined' && clarityInitialized.current) {
        try {
          Clarity.consent();
        } catch (e) {
          console.error("Failed to update Clarity consent", e);
        }
      }
    } else if (consent === 'declined') {
      // Disable analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
      
      // Update Clarity consent
      if (typeof window !== 'undefined' && clarityInitialized.current) {
        try {
          Clarity.consent(false);
        } catch (e) {
          console.error("Failed to update Clarity consent", e);
        }
      }
    }
  }, [consent, scriptsLoaded, googleAnalyticsId]);

  // Initialize Microsoft Clarity using NPM package
  useEffect(() => {
    if (microsoftClarityId && typeof window !== 'undefined') {
      try {
        if (!clarityInitialized.current) {
          Clarity.init(microsoftClarityId);
          clarityInitialized.current = true;
          console.log(`Microsoft Clarity initialized with ID: ${microsoftClarityId}`);
          
          // Set initial consent if already defined
          if (consent === 'accepted') {
            Clarity.consent();
          } else if (consent === 'declined') {
            Clarity.consent(false);
          }
        }
      } catch (error) {
        console.error('Failed to initialize Microsoft Clarity:', error);
      }
    }
  }, [microsoftClarityId, consent]);

  // Don't render anything if no Google Analytics ID provided since Clarity handles its own loading
  if (!googleAnalyticsId) {
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
    </>
  );
}
