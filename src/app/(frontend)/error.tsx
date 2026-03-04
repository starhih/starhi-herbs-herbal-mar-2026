'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-600 text-2xl font-bold">!</span>
        </div>
        <h2 className="text-2xl font-semibold text-[#214842] mb-3">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try again or contact us if the problem persists.
        </p>
        <Button onClick={reset} className="cta-primary">
          Try Again
        </Button>
      </div>
    </div>
  );
}
