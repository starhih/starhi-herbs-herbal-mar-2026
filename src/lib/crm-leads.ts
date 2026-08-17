
const CRM_TIMEOUT_MS = 8000;

const PLACEHOLDER_VALUES = new Set(['not provided', 'n/a', 'na', 'none']);

function asTrimmedString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    const next = asTrimmedString(value);
    if (next) return next;
  }
  return undefined;
}

function optionalString(...values: unknown[]): string | null {
  const next = firstString(...values);
  if (!next) return null;
  if (PLACEHOLDER_VALUES.has(next.toLowerCase())) return null;
  return next;
}

type QuoteCrmPayload = {
  full_name: string;
  email: string;
  phone: string;
  job_title: string | null;
  company_type: string;
  company: string;
  country: string;
  product_category: string;
  estimated_quantity: string;
  product_details: string;
  standardization: string;
  timeframe: string;
  intended_use: string | null;
  additional_information: string | null;
  agreed_terms: true;
};

type ContactCrmPayload = {
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
};

function mapQuotePayload(data: Record<string, unknown>): QuoteCrmPayload | null {
  // Drawer quote omits termsAccepted after client-side validation; skip only if explicitly false.
  if (data.termsAccepted === false || data.agreed_terms === false) return null;

  const full_name = firstString(data.fullName, data.full_name, data.from_name, data.name);
  const email = firstString(data.email, data.from_email);
  const phone = firstString(data.phone);
  const company_type = firstString(data.companyType, data.company_type);
  const company = firstString(data.company, data.companyName);
  const country = firstString(data.country, data.countryRegion);
  const product_category = firstString(data.productCategory, data.product_category);
  const estimated_quantity = firstString(data.quantity, data.estimated_quantity);
  const product_details = firstString(data.productDetails, data.product_details);
  const standardization = firstString(data.standardization);
  const timeframe = firstString(data.timeframe);

  if (
    !full_name ||
    !email ||
    !phone ||
    !company_type ||
    !company ||
    !country ||
    !product_category ||
    !estimated_quantity ||
    !product_details ||
    !standardization ||
    !timeframe
  ) {
    return null;
  }

  return {
    full_name,
    email,
    phone,
    job_title: optionalString(data.jobTitle, data.job_title),
    company_type,
    company,
    country,
    product_category,
    estimated_quantity,
    product_details,
    standardization,
    timeframe,
    intended_use: optionalString(data.intendedUse, data.intended_use),
    additional_information: optionalString(data.additionalInfo, data.additional_information),
    agreed_terms: true,
  };
}

function mapContactPayload(data: Record<string, unknown>): ContactCrmPayload | null {
  const full_name = firstString(data.from_name, data.name, data.fullName, data.full_name);
  const email = firstString(data.from_email, data.email);
  const subject = firstString(data.subject);
  const message = firstString(data.message);

  if (!full_name || !email || !subject || !message) return null;

  return {
    full_name,
    company_name: optionalString(data.company, data.companyName, data.company_name),
    email,
    phone: optionalString(data.phone),
    subject,
    message,
  };
}

export async function forwardToCrm(formType: string, data: Record<string, unknown>): Promise<void> {
  const endpoint = formType === 'Quote Request' ? 'quote' : formType === 'Contact Form' ? 'contact' : null;
  if (!endpoint) return;

  const baseUrl = process.env.CRM_API_URL?.replace(/\/$/, '');
  const secret = process.env.WEBSITE_FORM_SECRET;

  if (!baseUrl || !secret) {
    console.error('CRM lead capture skipped: CRM_API_URL or WEBSITE_FORM_SECRET is not set');
    return;
  }

  const payload = endpoint === 'quote' ? mapQuotePayload(data) : mapContactPayload(data);
  if (!payload) {
    console.error(`CRM lead capture skipped: missing required fields for ${formType}`);
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/website-forms/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Website-Key': secret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(`CRM lead capture failed (${response.status}): ${body}`);
    }
  } catch (error) {
    console.error('CRM lead capture error:', error);
  }
}
