'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseStandardizationOptions } from '@/lib/standardization';
import {
  QUANTITY_OPTIONS,
  SAMPLE_SIZE_OPTIONS,
  effectiveStandardizationMode,
  itemProblem,
  useShortlist,
  wantsQuote,
  wantsSample,
  type RequestKind,
  type ShortlistItem,
  type StandardizationMode,
} from './ShortlistProvider';

const fieldClass =
  'h-9 w-full rounded-md border border-input bg-white px-2.5 text-sm text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#258F67]';

const REQUEST_OPTIONS: { value: RequestKind; label: string }[] = [
  { value: 'quote', label: 'Quote' },
  { value: 'sample', label: 'Sample' },
  { value: 'both', label: 'Quote + Sample' },
];

interface ShortlistItemEditorProps {
  item: ShortlistItem;
  /** Highlight missing choices (after a submit attempt) */
  showErrors?: boolean;
  onNavigate?: () => void;
}

export default function ShortlistItemEditor({ item, showErrors = false, onNavigate }: ShortlistItemEditorProps) {
  const { update, remove } = useShortlist();
  const problem = showErrors ? itemProblem(item) : null;
  const options = parseStandardizationOptions(item.listedStandardization);
  const mode = effectiveStandardizationMode(item);
  const selectValue =
    mode === 'listed' ? `listed:${options.includes(item.listedChoice ?? '') ? item.listedChoice : options[0]}` : mode;

  const onStandardizationChange = (value: string) => {
    if (value.startsWith('listed:')) {
      update(item.id, { standardizationMode: 'listed', listedChoice: value.slice('listed:'.length) });
    } else {
      update(item.id, { standardizationMode: value as StandardizationMode });
    }
  };
  const fieldId = (name: string) => `shortlist-${item.id}-${name}`;

  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-4 shadow-sm',
        problem ? 'border-red-300' : 'border-gray-200',
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          {item.href ? (
            <Link
              href={item.href}
              onClick={onNavigate}
              className="font-semibold text-[#214842] hover:text-[#258F67] leading-snug"
            >
              {item.name}
            </Link>
          ) : (
            <p className="font-semibold text-[#214842] leading-snug">{item.name}</p>
          )}
          {item.category && <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>}
        </div>
        <button
          type="button"
          onClick={() => remove(item.id)}
          className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label={`Remove ${item.name}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* What the buyer wants for this product */}
      <div className="flex flex-wrap gap-1.5 mb-3" role="radiogroup" aria-label={`Request type for ${item.name}`}>
        {REQUEST_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={item.request === option.value}
            onClick={() => update(item.id, { request: option.value })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              item.request === option.value
                ? 'border-[#214842] bg-[#214842] text-white'
                : 'border-gray-300 text-gray-600 hover:border-[#214842] hover:text-[#214842]',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor={fieldId('std')} className="text-xs font-medium text-gray-700">
            Standardization required <span className="text-red-500">*</span>
          </label>
          <select
            id={fieldId('std')}
            value={selectValue}
            onChange={(e) => onStandardizationChange(e.target.value)}
            className={cn(fieldClass, problem && mode === 'unset' && 'border-red-400')}
          >
            {mode === 'unset' && <option value="unset">Select…</option>}
            {options.map((option) => (
              <option key={option} value={`listed:${option}`}>
                {option}
              </option>
            ))}
            <option value="custom">Custom standardization…</option>
            <option value="none">Not required</option>
          </select>
          {item.standardizationMode === 'custom' && (
            <input
              aria-label={`Custom standardization for ${item.name}`}
              value={item.customStandardization}
              onChange={(e) => update(item.id, { customStandardization: e.target.value })}
              placeholder='e.g. "5% Withanolides by HPLC"'
              className={cn(fieldClass, 'mt-1.5')}
            />
          )}
        </div>

        {wantsQuote(item) && (
          <div className="space-y-1">
            <label htmlFor={fieldId('qty')} className="text-xs font-medium text-gray-700">
              Order quantity
            </label>
            <select
              id={fieldId('qty')}
              value={item.quantity}
              onChange={(e) => update(item.id, { quantity: e.target.value })}
              className={fieldClass}
            >
              {QUANTITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="custom">Custom…</option>
            </select>
            {item.quantity === 'custom' && (
              <input
                aria-label={`Custom quantity for ${item.name}`}
                value={item.customQuantity}
                onChange={(e) => update(item.id, { customQuantity: e.target.value })}
                placeholder="e.g. 2,000 kg / month"
                className={cn(fieldClass, 'mt-1.5')}
              />
            )}
          </div>
        )}

        {wantsSample(item) && (
          <div className="space-y-1">
            <label htmlFor={fieldId('sample')} className="text-xs font-medium text-gray-700">
              Sample size
            </label>
            <select
              id={fieldId('sample')}
              value={item.sampleSize}
              onChange={(e) => update(item.id, { sampleSize: e.target.value })}
              className={fieldClass}
            >
              {SAMPLE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {problem && <p className="text-red-500 text-xs mt-2">{problem}</p>}
    </div>
  );
}
