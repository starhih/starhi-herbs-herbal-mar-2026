// Analytics utility functions for Google Analytics and Microsoft Clarity

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Ensure gtag exists on window with dataLayer buffering
const getGtag = (): ((...args: any[]) => void) | null => {
  if (typeof window === 'undefined') return null;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function (...args: any[]) {
      window.dataLayer?.push(args);
    };
  }
  return window.gtag;
};

// Google Analytics Event Tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  params?: Record<string, any>
) => {
  const gtag = getGtag();
  if (!gtag) return;

  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    ...params,
  });
};

// Track page views (useful for SPA navigation)
export const trackPageView = (url: string, title?: string) => {
  const gtag = getGtag();
  if (!gtag) return;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (gaId) {
    gtag('config', gaId, {
      page_title: title || (typeof document !== 'undefined' ? document.title : ''),
      page_location: typeof window !== 'undefined' ? window.location.href : url,
      page_path: url,
    });
  }

  gtag('event', 'page_view', {
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
    page_location: typeof window !== 'undefined' ? window.location.href : url,
    page_path: url,
  });
};

// Common event tracking functions
export const analytics = {
  // Track form submissions
  trackFormSubmission: (formName: string) => {
    trackEvent('form_submit', 'engagement', formName);
  },

  trackQuoteSubmit: () => {
    trackEvent('request_quote_submit', 'lead', 'Request Quote Form');
  },

  trackSampleSubmit: () => {
    trackEvent('request_sample_submit', 'lead', 'Request Sample Form');
  },

  trackContactSubmit: () => {
    trackEvent('contact_form_submit', 'lead', 'Contact Form');
  },

  trackMeetingSubmit: () => {
    trackEvent('request_meeting_submit', 'lead', 'Request Meeting Form');
  },

  trackCatalogueSubmit: () => {
    trackEvent('catalogue_download_submit', 'lead_magnet', 'Catalogue Download');
  },

  trackJobApplicationSubmit: (jobTitle?: string) => {
    trackEvent('job_application_submit', 'recruitment', jobTitle || 'Job Application');
  },

  trackGeneralApplicationSubmit: () => {
    trackEvent('general_application_submit', 'recruitment', 'General Application');
  },

  trackNewsletterSubscribe: () => {
    trackEvent('newsletter_subscribe', 'engagement', 'Newsletter Subscription');
  },

  // Track button clicks
  trackButtonClick: (buttonName: string, location?: string) => {
    trackEvent('click', 'engagement', `${buttonName}${location ? `_${location}` : ''}`);
  },

  // Track file downloads
  trackDownload: (fileName: string, _fileType?: string) => {
    trackEvent('download', 'engagement', fileName, undefined);
    
    // Also track with Clarity if available
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
      try {
        window.clarity('event', 'download');
      } catch (e) {
        console.error("Clarity event error:", e);
      }
    }
  },

  // Track contact interactions
  trackContact: (method: string) => {
    trackEvent('contact', 'engagement', method);
  },

  // Track product/service interest
  trackProductInterest: (productName: string, action: string) => {
    trackEvent(action, 'product_interest', productName);
  },

  // Track search
  trackSearch: (searchTerm: string) => {
    trackEvent('search', 'engagement', searchTerm);
  },

  // Track video interactions
  trackVideo: (action: 'play' | 'pause' | 'complete', videoName: string) => {
    trackEvent(`video_${action}`, 'engagement', videoName);
  },

  // Track scroll depth
  trackScrollDepth: (percentage: number) => {
    trackEvent('scroll', 'engagement', `${percentage}%`, percentage);
  },
};

// Microsoft Clarity specific tracking
export const clarityTrack = (eventName: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName, data);
    }
  } catch (e) {
    console.error("Clarity event error:", e);
  }
};

// These functions remain for compatibility with CookieConsent.tsx but have no effect on blocking tracking
export const initializeAnalytics = () => {
  // Tracking runs unconditionally
};

export const updateAnalyticsConsent = (_granted: boolean) => {
  // Tracking runs unconditionally
};
