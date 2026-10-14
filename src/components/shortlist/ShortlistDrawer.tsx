'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ShortlistItemEditor from './ShortlistItemEditor';
import RequestSteps from './RequestSteps';
import { itemProblem, requestPagePath, useShortlist } from './ShortlistProvider';

export default function ShortlistDrawer() {
  const { items, isOpen, setOpen, clear } = useShortlist();
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setAttempted(false);
      setConfirmClear(false);
    }
  };
  const close = () => onOpenChange(false);

  const goToRequest = () => {
    // Stop at the first product that still needs a choice instead of failing on the next page
    const unfinished = items.find((item) => itemProblem(item) !== null);
    if (unfinished) {
      setAttempted(true);
      listRef.current
        ?.querySelector(`[data-shortlist-item="${CSS.escape(unfinished.id)}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    close();
    router.push(requestPagePath(items));
  };

  const count = `${items.length} ${items.length === 1 ? 'product' : 'products'}`;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {/* [&>button]:hidden hides the built-in close icon; the header has its own */}
      <SheetContent className="w-full sm:max-w-lg h-full bg-gray-50 flex flex-col p-0 gap-0 [&>button]:hidden">
        <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <SheetHeader className="text-left space-y-0">
              <SheetTitle className="text-xl font-bold text-[#214842]">
                Your shortlist
                {items.length > 0 && <span className="ml-2 text-sm font-medium text-gray-500">{count}</span>}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Choose what you need for each product, then continue to add your contact details.
              </SheetDescription>
            </SheetHeader>
            <button
              onClick={close}
              className="shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#258F67]"
              aria-label="Close shortlist"
            >
              <X size={18} />
            </button>
          </div>
          {items.length > 0 && <RequestSteps current={1} className="mt-3" />}
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
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
            <>
              {items.map((item) => (
                <ShortlistItemEditor key={item.id} item={item} showErrors={attempted} onNavigate={close} />
              ))}
              {/* Kept away from the main actions and confirmed, so one stray tap can't empty the list */}
              <div className="flex justify-end pt-1 text-xs">
                {confirmClear ? (
                  <span className="flex items-center gap-3">
                    <span className="text-gray-600">Remove all {count}?</span>
                    <button
                      type="button"
                      onClick={() => {
                        clear();
                        setConfirmClear(false);
                      }}
                      className="font-semibold text-red-600 hover:underline"
                    >
                      Yes, clear
                    </button>
                    <button type="button" onClick={() => setConfirmClear(false)} className="text-gray-600 hover:underline">
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-gray-500 underline hover:text-red-600"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-4 sm:p-6 space-y-2">
            <Button onClick={goToRequest} className="cta-primary w-full h-12 text-sm font-semibold gap-2">
              Next: your contact details
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <p className="text-center text-xs text-gray-500">Takes about 1 minute · no payment</p>
            <div className="text-center">
              <button type="button" onClick={close} className="text-xs font-medium text-[#214842] hover:underline">
                Continue browsing
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
