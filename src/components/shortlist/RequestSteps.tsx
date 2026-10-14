import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Kept short so all three fit on one line on a phone
const STEPS = ['Products', 'Your details', 'Reply in 24h'];

/** Where the buyer is in the request: shortlist panel is step 1, the request form is step 2. */
export default function RequestSteps({ current, className }: { current: 1 | 2; className?: string }) {
  return (
    <ol className={cn('flex items-center gap-1.5 text-xs', className)} aria-label="Request steps">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex min-w-0 items-center gap-1.5" aria-current={active ? 'step' : undefined}>
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                done ? 'bg-[#258F67] text-white' : active ? 'bg-[#214842] text-white' : 'bg-gray-200 text-gray-500',
              )}
            >
              {done ? <Check size={12} strokeWidth={3} /> : step}
            </span>
            <span className={cn('truncate whitespace-nowrap', active ? 'font-semibold text-[#214842]' : 'text-gray-500')}>{label}</span>
            {step < STEPS.length && <ChevronRight size={12} className="shrink-0 text-gray-300" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
