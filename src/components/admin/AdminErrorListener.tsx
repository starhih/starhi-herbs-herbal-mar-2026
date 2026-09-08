'use client';

import { useEffect } from 'react';

export function AdminErrorListener() {
  useEffect(() => {
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
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
