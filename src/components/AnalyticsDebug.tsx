"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analytics } from '@/lib/analytics';

export default function AnalyticsDebug() {
  const [consent, setConsent] = useState<string | null>(null);
  const [gaLoaded, setGaLoaded] = useState(false);
  const [clarityLoaded, setClarityLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkStatus = () => {
      const consentStatus = localStorage.getItem('cookie-consent');
      setConsent(consentStatus);
      
      // Check if Google Analytics is loaded
      const gaStatus = typeof window !== 'undefined' && typeof window.gtag === 'function';
      setGaLoaded(!!gaStatus);
      
      // Check if Clarity is loaded
      const clarityStatus = typeof window !== 'undefined' && typeof window.clarity === 'function';
      setClarityLoaded(clarityStatus);
      
      // Get debug info
      setDebugInfo({
        gaId: process.env.NEXT_PUBLIC_GA_ID,
        clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
        dataLayer: typeof window !== 'undefined' ? (window as any).dataLayer?.length || 0 : 0,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A'
      });
    };

    checkStatus();
    
    // Check every 2 seconds
    const interval = setInterval(checkStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const testGoogleAnalytics = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'test_event', {
        event_category: 'debug',
        event_label: 'manual_test',
        value: 1
      });
      alert('Google Analytics test event sent! Check your GA4 real-time reports.');
    } else {
      alert('Google Analytics not loaded yet!');
    }
  };

  const testClarity = () => {
    if (typeof window.clarity === 'function') {
      window.clarity('event', 'debug_test');
      alert('Microsoft Clarity test event sent!');
    } else {
      alert('Microsoft Clarity not loaded yet!');
    }
  };

  const testAnalyticsHelper = () => {
    analytics.trackButtonClick('debug_test_button', 'analytics_debug');
    alert('Analytics helper test event sent!');
  };

  const clearConsent = () => {
    localStorage.removeItem('cookie-consent');
    window.location.reload();
  };

  const acceptConsent = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    window.dispatchEvent(new CustomEvent('consent-updated'));
    window.location.reload();
  };

  return (
    <Card className="max-w-2xl mx-auto m-4">
      <CardHeader>
        <CardTitle>Analytics Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Status</h4>
            <div className="space-y-1 text-sm">
              <div>Consent: <span className={consent === 'accepted' ? 'text-green-600' : 'text-red-600'}>{consent || 'None'}</span></div>
              <div>Google Analytics: <span className={gaLoaded ? 'text-green-600' : 'text-red-600'}>{gaLoaded ? 'Loaded' : 'Not Loaded'}</span></div>
              <div>Microsoft Clarity: <span className={clarityLoaded ? 'text-green-600' : 'text-red-600'}>{clarityLoaded ? 'Loaded' : 'Not Loaded'}</span></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Configuration</h4>
            <div className="space-y-1 text-sm">
              <div>GA ID: {debugInfo.gaId || 'Not Set'}</div>
              <div>Clarity ID: {debugInfo.clarityId || 'Not Set'}</div>
              <div>DataLayer Events: {debugInfo.dataLayer}</div>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <h4 className="font-semibold">Test Analytics</h4>
          <div className="flex flex-wrap gap-2">
            <Button onClick={testGoogleAnalytics} disabled={!gaLoaded} size="sm">
              Test Google Analytics
            </Button>
            <Button onClick={testClarity} disabled={!clarityLoaded} size="sm">
              Test Microsoft Clarity
            </Button>
            <Button onClick={testAnalyticsHelper} size="sm">
              Test Analytics Helper
            </Button>
          </div>
        </div>

        {/* Consent Controls */}
        <div className="space-y-2">
          <h4 className="font-semibold">Consent Controls</h4>
          <div className="flex gap-2">
            <Button onClick={acceptConsent} variant="outline" size="sm">
              Accept Consent
            </Button>
            <Button onClick={clearConsent} variant="outline" size="sm">
              Clear Consent
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 p-3 rounded text-sm">
          <h4 className="font-semibold mb-1">Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Make sure you have set your GA4 and Clarity IDs in .env.local</li>
            <li>Accept cookies using the consent banner or button above</li>
            <li>Wait a few seconds for scripts to load</li>
            <li>Test the analytics using the buttons above</li>
            <li>Check your GA4 Real-time reports and Clarity dashboard</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
