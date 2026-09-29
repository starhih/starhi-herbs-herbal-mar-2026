'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClipboardList, X } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ShortlistItemEditor from './ShortlistItemEditor';
import { requestPagePath, useShortlist, wantsQuote, wantsSample } from './ShortlistProvider';

export function requestButtonLabel(items: { request: 'quote' | 'sample' | 'both' }[]) {
  const quote = items.some(wantsQuote);
  const sample = items.some(wantsSample);
  const noun = quote && sample ? 'Quote & Samples' : sample ? 'Samples' : 'Combined Quote';
  return `Request ${noun} (${items.length} ${items.length === 1 ? 'product' : 'products'})`;
}

export default function ShortlistDrawer() {
  const { items, isOpen, setOpen, clear } = useShortlist();
  const router = useRouter();
  const close = () => setOpen(false);

  const goToRequest = () => {
    close();
    router.push(requestPagePath(items));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {/* [&>button]:hidden hides the built-in close icon; the header has its own */}
      <SheetContent className="w-full sm:max-w-lg h-full bg-gray-50 flex flex-col p-0 gap-0 [&>button]:hidden">
        <div className="p-6 bg-[#214842] text-white border-b-4 border-[#EFC368] relative">
          <button
            onClick={close}
            className="absolute right-4 top-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close shortlist"
          >
            <X size={18} />
          </button>
          <SheetHeader className="text-left text-white pr-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <ClipboardList size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                Quote &amp; sample list
              </span>
            </div>
            <SheetTitle className="text-xl md:text-2xl font-bold text-white">Your Shortlist</SheetTitle>
            <SheetDescription className="text-white/80 text-xs mt-1">
              {items.length === 0
                ? 'No products selected yet'
                : `${items.length} ${items.length === 1 ? 'product' : 'products'} selected. Set what you need for each, then send one request.`}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Add products from any product page to request a combined quote or samples.
              </p>
              <Button asChild variant="outline" className="border-[#214842] text-[#214842]">
                <Link href="/products" onClick={close}>
                  Browse products
                </Link>
              </Button>
            </div>
          ) : (
            items.map((item) => <ShortlistItemEditor key={item.id} item={item} onNavigate={close} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-4 sm:p-6 space-y-3">
            <Button onClick={goToRequest} className="cta-primary w-full h-12 text-sm font-semibold">
              {requestButtonLabel(items)}
            </Button>
            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={clear} className="text-gray-500 underline hover:text-red-600">
                Clear all items
              </button>
              <button type="button" onClick={close} className="text-[#214842] font-medium hover:underline">
                Continue browsing
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
