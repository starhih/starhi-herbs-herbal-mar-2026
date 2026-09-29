'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { parseStandardizationOptions } from '@/lib/standardization';

export type RequestKind = 'quote' | 'sample' | 'both';
export type StandardizationMode = 'unset' | 'listed' | 'custom' | 'none';

export interface ShortlistItem {
  id: string;
  name: string;
  href?: string;
  category?: string;
  /** Standardization shown on the product page, if any */
  listedStandardization?: string;
  /** The grade picked when standardizationMode is 'listed' */
  listedChoice?: string;
  standardizationMode: StandardizationMode;
  customStandardization: string;
  request: RequestKind;
  /** One of QUANTITY_OPTIONS, or 'custom' */
  quantity: string;
  customQuantity: string;
  sampleSize: string;
}

export interface ShortlistProductInput {
  id?: string;
  name: string;
  href?: string;
  category?: string;
  standardization?: string;
}

export const QUANTITY_OPTIONS = ['25 kg (Trial)', '50 kg', '100 kg', '250 kg', '500 kg', '1,000 kg+'];
export const SAMPLE_SIZE_OPTIONS = ['25 g', '50 g', '100 g', '250 g'];

const STORAGE_KEY = 'shh-shortlist-v1';

export function productHref(slug: string, productType?: string | null) {
  if (productType === 'branded') return `/branded-ingredients/${slug}`;
  if (productType === 'vitamin-mineral') return `/vitamins-minerals/${slug}`;
  return `/products/${slug}`;
}

export function shortlistId(product: ShortlistProductInput) {
  return (product.id || product.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function wantsQuote(item: Pick<ShortlistItem, 'request'>) {
  return item.request === 'quote' || item.request === 'both';
}

export function wantsSample(item: Pick<ShortlistItem, 'request'>) {
  return item.request === 'sample' || item.request === 'both';
}

/**
 * The standardization mode actually in effect. A 'listed' choice that is no longer one of the
 * product's parsed grades (e.g. saved before the grade list changed) counts as not chosen.
 */
export function effectiveStandardizationMode(item: ShortlistItem): StandardizationMode {
  if (item.standardizationMode !== 'listed') return item.standardizationMode;
  const options = parseStandardizationOptions(item.listedStandardization);
  if (item.listedChoice && options.includes(item.listedChoice)) return 'listed';
  return options.length === 1 ? 'listed' : 'unset';
}

export function describeStandardization(item: ShortlistItem) {
  switch (effectiveStandardizationMode(item)) {
    case 'listed':
      return item.listedChoice || parseStandardizationOptions(item.listedStandardization)[0] || 'As listed';
    case 'custom':
      return item.customStandardization.trim();
    case 'none':
      return 'Not required';
    default:
      return '';
  }
}

export function describeQuantity(item: ShortlistItem) {
  return item.quantity === 'custom' ? item.customQuantity.trim() : item.quantity;
}

/** Returns a user-facing problem with this item, or null when it is ready to submit. */
export function itemProblem(item: ShortlistItem): string | null {
  if (effectiveStandardizationMode(item) === 'unset') return 'Choose the standardization you need';
  if (item.standardizationMode === 'custom' && !item.customStandardization.trim()) {
    return 'Enter the standardization you need';
  }
  if (wantsQuote(item) && item.quantity === 'custom' && !item.customQuantity.trim()) {
    return 'Enter the quantity you need';
  }
  return null;
}

function mergeRequest(current: RequestKind, added: RequestKind): RequestKind {
  return current === added ? current : 'both';
}

function isShortlistItem(value: unknown): value is ShortlistItem {
  const v = value as ShortlistItem;
  return Boolean(v && typeof v.id === 'string' && typeof v.name === 'string' && typeof v.request === 'string');
}

interface ShortlistContextValue {
  items: ShortlistItem[];
  hydrated: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: ShortlistProductInput, request: 'quote' | 'sample', options?: { open?: boolean }) => void;
  update: (id: string, patch: Partial<ShortlistItem>) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (product: ShortlistProductInput) => boolean;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);

  // Load after mount so server and client render the same markup
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        setItems(Array.isArray(parsed) ? parsed.filter(isShortlistItem) : []);
      } catch {
        setItems([]);
      }
    };
    load();
    setHydrated(true);

    // Keep several open tabs in sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage blocked: the shortlist still works for this page view
    }
  }, [items, hydrated]);

  const add = useCallback<ShortlistContextValue['add']>((product, request, options) => {
    const id = shortlistId(product);
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, request: mergeRequest(item.request, request) } : item,
        );
      }
      const listed = product.standardization?.trim() || undefined;
      const options = parseStandardizationOptions(listed);
      return [
        ...prev,
        {
          id,
          name: product.name,
          href: product.href,
          category: product.category,
          listedStandardization: listed,
          // A single grade is preselected; with several the buyer must pick one
          listedChoice: options.length === 1 ? options[0] : undefined,
          standardizationMode: options.length === 1 ? 'listed' : 'unset',
          customStandardization: '',
          request,
          quantity: QUANTITY_OPTIONS[0],
          customQuantity: '',
          sampleSize: SAMPLE_SIZE_OPTIONS[1],
        },
      ];
    });
    if (options?.open !== false) setOpen(true);
  }, []);

  const update = useCallback((id: string, patch: Partial<ShortlistItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (product: ShortlistProductInput) => items.some((item) => item.id === shortlistId(product)),
    [items],
  );

  const value = useMemo(
    () => ({ items, hydrated, isOpen, setOpen, add, update, remove, clear, has }),
    [items, hydrated, isOpen, add, update, remove, clear, has],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (!context) throw new Error('useShortlist must be used inside ShortlistProvider');
  return context;
}

/** Where the "request" button in the drawer/bar should go for the current items. */
export function requestPagePath(items: ShortlistItem[]) {
  return items.length > 0 && items.every((item) => item.request === 'sample')
    ? '/request-sample'
    : '/request-quote';
}
