// Analytics utility functions for Google Analytics and Microsoft Clarity

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics Event Tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track page views (useful for SPA navigation)
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX', {
    page_title: title || document.title,
    page_location: url,
  });
};

// Common event tracking functions
export const analytics = {
  // Track form submissions
  trackFormSubmission: (formName: string) => {
    trackEvent('form_submit', 'engagement', formName);
  },

  // Track button clicks
  trackButtonClick: (buttonName: string, location?: string) => {
    trackEvent('click', 'engagement', `${buttonName}${location ? `_${location}` : ''}`);
  },

  // Track file downloads
  trackDownload: (fileName: string, fileType?: string) => {
    trackEvent('download', 'engagement', fileName, undefined);
    
    // Also track with Clarity if available
    if (typeof window !== 'undefined') {
      try {
        if (typeof window.clarity === 'function') {
          window.clarity('event', 'download');
        }
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
      window.clarity('event', eventName);
    }
  } catch (e) {
    console.error("Clarity event error:", e);
  }
};

// These functions remain for compatibility with CookieConsent.tsx but have no effect on blocking tracking
export const initializeAnalytics = () => {
  // Tracking runs unconditionally now
};

export const updateAnalyticsConsent = (granted: boolean) => {
  // Tracking runs unconditionally now
};
