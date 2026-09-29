import { Suspense } from 'react';
import type { Metadata } from 'next';
import ThankYouContent from './ThankYouContent';

export const metadata: Metadata = {
  title: 'Thank You | Star Hi Herbs',
  description: 'Your request has been received by the Star Hi Herbs team.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={<section className="min-h-[70vh] bg-gray-50" />}>
      <ThankYouContent />
    </Suspense>
  );
}
