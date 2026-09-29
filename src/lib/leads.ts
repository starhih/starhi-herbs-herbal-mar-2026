import { getPayloadClient } from '@/lib/payload';

// HR submissions are routed to hr@ and are not sales leads
const NOT_LEADS = new Set(['Job Application', 'General Application']);

const PLACEHOLDERS = new Set(['not provided', 'unknown company', 'unknown country']);

function pick(data: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim() && !PLACEHOLDERS.has(value.trim().toLowerCase())) {
      return value.trim();
    }
  }
  return undefined;
}

/**
 * Stores a website submission in the Leads collection. Never throws: a storage
 * failure must not block the email/CRM delivery of the same lead.
 */
export async function saveLead(
  formType: string,
  data: Record<string, unknown>,
  sourcePage?: string | null,
): Promise<void> {
  if (NOT_LEADS.has(formType)) return;

  try {
    const firstLast = [pick(data, 'firstName'), pick(data, 'lastName')].filter(Boolean).join(' ');
    const payload = await getPayloadClient();
    await payload.create({
      collection: 'leads',
      data: {
        formType,
        status: 'new',
        sourcePage: sourcePage || undefined,
        name: pick(data, 'fullName', 'from_name', 'name') || firstLast || undefined,
        email: pick(data, 'email', 'from_email'),
        phone: pick(data, 'phone'),
        company: pick(data, 'company', 'companyName'),
        country: pick(data, 'country', 'countryRegion'),
        products: pick(data, 'products', 'productDetails', 'productName'),
        message: pick(data, 'message', 'additionalInfo', 'comments', 'otherProducts'),
        data,
      },
    });
  } catch (error) {
    console.error(`[Leads] Failed to store ${formType} lead:`, error);
  }
}
