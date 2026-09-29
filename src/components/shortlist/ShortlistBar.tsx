'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ClipboardList } from 'lucide-react';
import { requestPagePath, useShortlist } from './ShortlistProvider';

// Pages that already show the shortlist in full
const HIDDEN_ON = ['/request-quote', '/request-sample', '/thank-you'];

/** Floating reminder at the bottom of the page while products are shortlisted. */
export default function ShortlistBar() {
  const { items, hydrated, isOpen, setOpen } = useShortlist();
  const pathname = usePathname();
  const router = useRouter();

  if (!hydrated || items.length === 0 || isOpen || HIDDEN_ON.includes(pathname ?? '')) return null;

  const names = items.map((item) => item.name).join(' · ');

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-2xl animate-fade-in">
      <div className="flex items-center gap-3 rounded-xl bg-[#214842] px-4 py-3 text-white shadow-2xl border border-[#EFC368]/40">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-label="Review shortlist"
        >
          <ClipboardList size={20} className="shrink-0 text-[#EFC368]" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold">
              {items.length} {items.length === 1 ? 'product' : 'products'} shortlisted · Click to review
            </span>
            <span className="block truncate text-xs text-white/70">{names}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => router.push(requestPagePath(items))}
          className="shrink-0 rounded-lg bg-[#EFC368] px-4 py-2 text-sm font-semibold text-[#214842] hover:bg-white transition-colors"
        >
          Request
        </button>
      </div>
    </div>
  );
}
