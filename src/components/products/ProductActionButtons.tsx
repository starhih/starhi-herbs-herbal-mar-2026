'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { productHref, shortlistId, useShortlist, wantsQuote, wantsSample } from '@/components/shortlist/ShortlistProvider';
import { analytics } from '@/lib/analytics';

interface ProductActionButtonsProps {
  productName: string;
  productSlug?: string;
  productType?: string | null;
  productCategory?: string;
  productStandardization?: string;
}

/** Adds the product to the shortlist (quote and/or sample) and opens the shortlist drawer. */
export default function ProductActionButtons({
  productName,
  productSlug,
  productType,
  productCategory = 'Standardized Botanical Extracts',
  productStandardization = '',
}: ProductActionButtonsProps) {
  const { items, add, setOpen } = useShortlist();
  const product = {
    id: productSlug,
    name: productName,
    href: productSlug ? productHref(productSlug, productType) : undefined,
    category: productCategory,
    standardization: productStandardization,
  };
  const existing = items.find((item) => item.id === shortlistId(product));
  const quoteAdded = existing ? wantsQuote(existing) : false;
  const sampleAdded = existing ? wantsSample(existing) : false;

  const handle = (type: 'quote' | 'sample') => {
    if ((type === 'quote' && quoteAdded) || (type === 'sample' && sampleAdded)) {
      setOpen(true);
      return;
    }
    add(product, type);
    analytics.trackProductInterest(productName, type === 'quote' ? 'shortlist_add_quote' : 'shortlist_add_sample');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <Button
        onClick={() => handle('quote')}
        className="flex-1 cta-primary flex items-center justify-center h-12 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
      >
        {/* Text sits in keyed spans so browser translation can't break the swap */}
        {quoteAdded ? (
          <span key="quote-added" className="flex items-center">
            <Check size={16} className="mr-2" />
            <span>Added for Quote · View</span>
          </span>
        ) : (
          <span key="quote-add" className="flex items-center">
            <span>Request Quote</span>
            <ArrowRight size={16} className="ml-2 animate-pulse" />
          </span>
        )}
      </Button>
      <Button
        onClick={() => handle('sample')}
        variant="outline"
        className="flex-1 border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white flex items-center justify-center h-12 text-sm font-semibold rounded-lg transition-all"
      >
        {sampleAdded ? (
          <span key="sample-added" className="flex items-center">
            <Check size={16} className="mr-2" />
            <span>Added for Sample · View</span>
          </span>
        ) : (
          <span key="sample-add" className="flex items-center">
            <span>Request Sample</span>
            <ArrowRight size={16} className="ml-2" />
          </span>
        )}
      </Button>
    </div>
  );
}
