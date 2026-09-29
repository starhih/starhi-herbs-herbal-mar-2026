'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { productHref, useShortlist } from './ShortlistProvider';

interface SearchResult {
  id: number | string;
  name: string;
  slug?: string | null;
  standardization?: string | null;
  productType?: string | null;
  category?: { name?: string | null } | number | string | null;
}

function buildSearchUrl(query: string) {
  const params = new URLSearchParams({
    'where[and][0][name][like]': query,
    'where[and][1][_status][equals]': 'published',
    limit: '8',
    depth: '1',
    sort: 'name',
    'select[name]': 'true',
    'select[slug]': 'true',
    'select[standardization]': 'true',
    'select[productType]': 'true',
    'select[category]': 'true',
  });
  return `/api/products?${params.toString()}`;
}

/** Search the catalogue and add products to the shortlist from the request form. */
export default function ProductSearchAdd({ defaultRequest }: { defaultRequest: 'quote' | 'sample' }) {
  const { add } = useShortlist();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    // Ignore responses for queries the user has already typed past. (Aborting the fetch
    // instead surfaces as an AbortError in the Next.js dev overlay.)
    let stale = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(buildSearchUrl(q));
        const json = await res.json();
        if (!stale) setResults(Array.isArray(json?.docs) ? json.docs : []);
      } catch {
        if (!stale) setResults([]);
      } finally {
        if (!stale) setLoading(false);
      }
    }, 250);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const addResult = (result: SearchResult) => {
    const category = typeof result.category === 'object' && result.category ? result.category.name ?? undefined : undefined;
    add(
      {
        id: result.slug || result.name,
        name: result.name,
        href: result.slug ? productHref(result.slug, result.productType) : undefined,
        category,
        standardization: result.standardization ?? undefined,
      },
      defaultRequest,
      { open: false },
    );
    setQuery('');
    setOpen(false);
  };

  const addCustom = () => {
    const name = query.trim();
    if (!name) return;
    add({ name }, defaultRequest, { open: false });
    setQuery('');
    setOpen(false);
  };

  const trimmed = query.trim();

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (results[0]) addResult(results[0]);
                else addCustom();
              }
            }}
            placeholder="Search products to add (e.g. Ashwagandha, Curcumin, Bacopa)…"
            aria-label="Search products to add"
            className="flex h-10 w-full rounded-md border border-input bg-white pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#258F67]"
          />
        </div>
        <button
          type="button"
          onClick={() => (results[0] ? addResult(results[0]) : addCustom())}
          disabled={!trimmed}
          className="inline-flex items-center gap-1 rounded-md border border-[#214842] px-3 text-sm font-medium text-[#214842] hover:bg-[#214842] hover:text-white disabled:opacity-40 disabled:pointer-events-none"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {open && trimmed.length >= 2 && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {loading && results.length === 0 && <p className="px-3 py-2 text-sm text-gray-500">Searching…</p>}
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => addResult(result)}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              <span className="font-medium text-[#214842]">{result.name}</span>
              {result.standardization && (
                <span className="ml-2 text-xs text-gray-500">{result.standardization}</span>
              )}
            </button>
          ))}
          {!loading && (
            <button
              type="button"
              onClick={addCustom}
              className="block w-full border-t border-gray-100 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
            >
              + Add &ldquo;{trimmed}&rdquo; as a product not listed
            </button>
          )}
        </div>
      )}
    </div>
  );
}
