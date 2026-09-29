'use client';

import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analytics } from '@/lib/analytics';
import {
  productHref,
  shortlistId,
  useShortlist,
  wantsQuote,
  wantsSample,
  type ShortlistProductInput,
} from './ShortlistProvider';

interface ShortlistCardButtonsProps {
  name: string;
  slug?: string;
  productType?: string | null;
  category?: string;
  standardization?: string;
}

/** Compact "+ Quote" / "+ Sample" buttons for product cards in listings. */
export default function ShortlistCardButtons({ name, slug, productType, category, standardization }: ShortlistCardButtonsProps) {
  const { items, hydrated, add, setOpen } = useShortlist();
  const product: ShortlistProductInput = {
    id: slug,
    name,
    href: slug ? productHref(slug, productType) : undefined,
    category,
    standardization,
  };
  const existing = hydrated ? items.find((item) => item.id === shortlistId(product)) : undefined;

  const buttons = [
    { type: 'quote' as const, label: 'Quote', added: existing ? wantsQuote(existing) : false },
    { type: 'sample' as const, label: 'Sample', added: existing ? wantsSample(existing) : false },
  ];

  return (
    <div className="flex gap-2">
      {buttons.map(({ type, label, added }) => (
        <button
          key={type}
          type="button"
          onClick={() => {
            if (added) {
              setOpen(true);
              return;
            }
            // Stay on the listing so buyers can keep adding; the header badge and bottom bar update
            add(product, type, { open: false });
            analytics.trackProductInterest(name, type === 'quote' ? 'shortlist_add_quote' : 'shortlist_add_sample');
          }}
          aria-label={added ? `${name} added for ${label.toLowerCase()}, open shortlist` : `Add ${name} to shortlist for ${label.toLowerCase()}`}
          className={cn(
            'flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
            added
              ? 'border-[#214842] bg-[#214842] text-white'
              : type === 'quote'
                ? 'border-[#EFC368] bg-[#EFC368] text-[#214842] hover:bg-[#214842] hover:border-[#214842] hover:text-white'
                : 'border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white',
          )}
        >
          {added ? <Check size={14} /> : <Plus size={14} />}
          {added ? `${label} added` : label}
        </button>
      ))}
    </div>
  );
}
