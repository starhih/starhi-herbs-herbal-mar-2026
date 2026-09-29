'use client';

import { ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useShortlist } from './ShortlistProvider';

export default function ShortlistNavButton({ className }: { className?: string }) {
  const { items, hydrated, setOpen } = useShortlist();
  const count = hydrated ? items.length : 0;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn('relative inline-flex items-center gap-1.5 p-2 font-medium', className)}
      aria-label={`Open shortlist (${count} ${count === 1 ? 'product' : 'products'})`}
    >
      <ClipboardList size={20} />
      <span className="hidden xl:inline text-sm">Shortlist</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#EFC368] px-1 text-[11px] font-bold leading-[18px] text-[#214842] text-center">
          {count}
        </span>
      )}
    </button>
  );
}
