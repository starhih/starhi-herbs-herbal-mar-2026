/**
 * Ad attribution for lead forms. UTM tags and the Google click ID from the landing URL are
 * kept for 90 days (Google Ads' click window), so a buyer who lands on a product page and
 * enquires later still carries the campaign and keyword into the enquiry email and stored lead.
 */

export const ATTRIBUTION_PARAMS = ['utm_source', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>>;

const ATTRIBUTION_KEY = 'shh-attribution';
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_VALUE_LENGTH = 200;

/** Saves tracking params from the current URL. A new ad click replaces the previous one. */
export function captureAttribution(params: URLSearchParams | null) {
  if (!params) return;
  const found: Attribution = {};
  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key)?.trim();
    if (value) found[key] = value.slice(0, MAX_VALUE_LENGTH);
  }
  if (Object.keys(found).length === 0) return;
  try {
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({ ...found, ts: Date.now() }));
  } catch {
    // Storage blocked: the lead is still sent, only without campaign details
  }
}

/** Tracking fields to send with a lead form. Empty when the visitor did not arrive from a tagged link. */
export function getAttribution(): Attribution {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    const stored = JSON.parse(raw);
    if (typeof stored?.ts !== 'number' || Date.now() - stored.ts > MAX_AGE_MS) return {};
    const result: Attribution = {};
    for (const key of ATTRIBUTION_PARAMS) {
      if (typeof stored[key] === 'string') result[key] = stored[key];
    }
    return result;
  } catch {
    return {};
  }
}
