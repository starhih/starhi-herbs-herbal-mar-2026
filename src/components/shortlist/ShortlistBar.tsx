'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { requestPagePath, useShortlist, wantsQuote, wantsSample } from './ShortlistProvider';

// Pages that already show the shortlist in full
const HIDDEN_ON = ['/request-quote', '/request-sample', '/thank-you'];

/** Floating reminder at the bottom of the page while products are shortlisted. */
export default function ShortlistBar() {
  const { items, hydrated, isOpen, setOpen } = useShortlist();
  const pathname = usePathname();
  const router = useRouter();

  if (!hydrated || items.length === 0 || isOpen || HIDDEN_ON.includes(pathname ?? '')) return null;

  const quote = items.some(wantsQuote);
  const sample = items.some(wantsSample);
  const names = items.map((item) => item.name).join(', ');

  const viewList = () => {
    analytics.trackShortlistBar('view_list');
    setOpen(true);
  };
  const request = () => {
    analytics.trackShortlistBar('request');
    router.push(requestPagePath(items));
  };

  return (
    // Sits above the cookie notice while it is showing (CookieConsent sets the offset)
    <div className="fixed inset-x-3 bottom-[calc(1rem+var(--cookie-notice-offset,0px))] z-40 mx-auto max-w-2xl animate-fade-in transition-[bottom] duration-200">
      <div className="flex items-center gap-1.5 sm:gap-3 rounded-xl bg-[#214842] p-2.5 sm:px-4 sm:py-3 text-white shadow-2xl border border-[#EFC368]/40">
        {/* Desktop: count, headline and product names, then a separate View list button */}
        <span
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFC368] text-sm font-bold text-[#214842] sm:flex"
          aria-hidden="true"
        >
          {items.length}
        </span>
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="truncate text-sm font-semibold">Your shortlist</p>
          <p className="truncate text-xs text-white/70">{names}</p>
        </div>
        {/* Phones: the count sits inside the View button so nothing gets squeezed out */}
        <button
          type="button"
          onClick={viewList}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/50 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors sm:flex-none sm:px-3 sm:py-2"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFC368] text-xs font-bold text-[#214842] sm:hidden" aria-hidden="true">
            {items.length}
          </span>
          <span className="truncate">View list</span>
          <span className="sr-only">({items.length} {items.length === 1 ? 'product' : 'products'})</span>
        </button>
        <button
          type="button"
          onClick={request}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#EFC368] px-3 sm:px-4 py-2 text-sm font-semibold text-[#214842] hover:bg-white transition-colors"
        >
          {quote && sample ? (
            <>
              <span className="hidden sm:inline">Get quote &amp; samples</span>
              <span className="sm:hidden">Quote &amp; samples</span>
            </>
          ) : sample ? (
            'Get samples'
          ) : (
            'Get quote'
          )}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
