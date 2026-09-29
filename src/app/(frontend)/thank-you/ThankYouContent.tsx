'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackLeadConversion } from '@/lib/analytics';
import { consumeLeadFlag, type LeadType } from '@/lib/lead-success';

const MESSAGES: Record<LeadType, { title: string; body: string }> = {
  quote: {
    title: 'Your quote request is in',
    body: 'Our sales team will send pricing, MOQ, lead time and specifications for the products you requested, usually within 24 hours.',
  },
  sample: {
    title: 'Your sample request is in',
    body: 'Our team will review your request and confirm shipping details with you, usually within 1-2 business days.',
  },
  'quote-sample': {
    title: 'Your quote and sample request is in',
    body: 'Our team will send pricing for the products you requested and confirm sample shipping details, usually within 24 hours.',
  },
  contact: {
    title: 'Thanks for getting in touch',
    body: 'Your message has reached our team. We will get back to you shortly.',
  },
  catalogue: {
    title: 'Thanks for your interest',
    body: 'Our team will email you the Star Hi Herbs product catalogue shortly.',
  },
  meeting: {
    title: 'Your meeting request is in',
    body: 'Our team will contact you to confirm a time that works for you.',
  },
};

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const param = searchParams.get('type') as LeadType | null;
  const type: LeadType = param && param in MESSAGES ? param : 'contact';
  const message = MESSAGES[type];

  useEffect(() => {
    // Only a fresh submission counts as a conversion; reloads and direct visits do not.
    const flag = consumeLeadFlag();
    if (flag) trackLeadConversion(flag.type, flag.id);
  }, []);

  return (
    <section className="min-h-[70vh] bg-gray-50 flex items-center pt-32 pb-16">
      <div className="container-custom">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-[#258F67] mx-auto mb-5" />
          <h1 className="text-[#214842] text-3xl mb-3">{message.title}</h1>
          <p className="text-gray-600 mb-8">{message.body}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#214842] hover:bg-[#1a3a35] text-white">
              <Link href="/products">Continue browsing products</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
