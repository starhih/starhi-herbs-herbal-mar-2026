"use client";

import Script from 'next/script';

interface AnalyticsProps {
  googleAnalyticsId?: string;
  microsoftClarityId?: string;
}

export default function Analytics({
  googleAnalyticsId,
  microsoftClarityId
}: AnalyticsProps) {
  // Tracking runs immediately and unconditionally for all users
  return (
    <>
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

                // Execute right away
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
