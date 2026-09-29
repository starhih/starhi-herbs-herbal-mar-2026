/**
 * After a successful lead form submit, send the visitor to /thank-you.
 * The one-time sessionStorage flag lets the thank-you page count a conversion only for
 * real submissions (not reloads, direct visits or bots).
 */

export type LeadType =
  | 'quote'
  | 'sample'
  | 'quote-sample'
  | 'contact'
  | 'catalogue'
  | 'meeting';

export const LEAD_FLAG_KEY = 'shh-lead-submitted';
const FLAG_MAX_AGE_MS = 10 * 60 * 1000;

interface LeadFlag {
  type: LeadType;
  id: string;
  ts: number;
}

export function markLeadSubmitted(type: LeadType) {
  const flag: LeadFlag = {
    type,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    ts: Date.now(),
  };
  try {
    sessionStorage.setItem(LEAD_FLAG_KEY, JSON.stringify(flag));
  } catch {
    // Storage blocked: the page still shows, only the conversion is skipped
  }
}

/** Reads and clears the flag. Returns null when there is no fresh submission. */
export function consumeLeadFlag(): LeadFlag | null {
  try {
    const raw = sessionStorage.getItem(LEAD_FLAG_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(LEAD_FLAG_KEY);
    const flag = JSON.parse(raw) as LeadFlag;
    if (!flag?.type || !flag.id || Date.now() - flag.ts > FLAG_MAX_AGE_MS) return null;
    return flag;
  } catch {
    return null;
  }
}

export function thankYouUrl(type: LeadType) {
  return `/thank-you?type=${type}`;
}
