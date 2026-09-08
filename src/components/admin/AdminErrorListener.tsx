'use client';

import { useEffect } from 'react';

export function AdminErrorListener() {
  useEffect(() => {
    console.log('[AdminErrorListener] Active on:', window.location.pathname);

    // Intercept fetch to track admin API calls
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || '';
      const method = args[1]?.method || 'GET';

      if (url.includes('/api/')) {
        console.log(`[ADMIN FETCH] ${method} ${url}`);
      }

      try {
        const response = await originalFetch.apply(this, args);
        if (url.includes('/api/')) {
          console.log(`[ADMIN RESPONSE] ${url} -> Status ${response.status}`);
          if (!response.ok) {
            try {
              const clone = response.clone();
              clone.text().then(body => {
                console.error(`[ADMIN ERROR RESPONSE] ${url}:`, body);
              });
            } catch (_e) {}
          }
        }
        return response;
      } catch (err) {
        if (url.includes('/api/')) {
          console.error(`[ADMIN NETWORK ERROR] ${url}:`, err);
        }
        throw err;
      }
    };

    const handleError = (event: ErrorEvent) => {
      console.error('==================================================');
      console.error('[WINDOW UNHANDLED ERROR IN ADMIN]:');
      console.error('Message:', event.message);
      console.error('Filename:', event.filename);
      console.error('Line/Col:', event.lineno, event.colno);
      console.error('Error Object:', event.error);
      console.error('==================================================');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('==================================================');
      console.error('[UNHANDLED PROMISE REJECTION IN ADMIN]:');
      console.error('Reason:', event.reason);
      console.error('==================================================');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
