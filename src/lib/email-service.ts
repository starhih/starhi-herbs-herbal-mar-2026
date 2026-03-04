/**
 * Email service for client-side form submissions
 * This sends form data to the /api/send-email route which uses Resend to deliver emails.
 * 
 * To use this service:
 * 1. Sign up for Resend (https://resend.com/)
 * 2. Create an API key
 * 3. Add RESEND_API_KEY, RESEND_FROM_EMAIL, and RESEND_TO_EMAIL to your .env file
 * 4. Verify your sending domain in Resend (or use onboarding@resend.dev for testing)
 */

const CC_EMAIL = 'najish.n@starhiherbs.com';

// Function to send an email via the server-side API route
export async function sendEmail(
  formType: string,
  data: Record<string, any>,
  options?: { subject?: string; fromEmail?: string; cc?: string | string[] },
) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType,
        data,
        subject: options?.subject,
        fromEmail: options?.fromEmail,
        cc: options?.cc,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, error: result.error || 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Contact form email
export async function sendContactEmail(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return sendEmail('Contact Form', {
    from_name: data.name,
    from_email: data.email,
    company: data.company || 'Not provided',
    phone: data.phone || 'Not provided',
    subject: data.subject,
    message: data.message,
  }, {
    subject: `[Contact] ${data.subject}`,
    fromEmail: 'Star Hi Herbs Contact <contact@starhiherbs.com>',
    cc: CC_EMAIL,
  });
}

// Request quote email
export async function sendQuoteRequestEmail(data: Record<string, any>) {
  return sendEmail('Quote Request', data, {
    fromEmail: 'Star Hi Herbs Quotes <quote@starhiherbs.com>',
    cc: CC_EMAIL,
  });
}

// Request sample email
export async function sendSampleRequestEmail(data: Record<string, any>) {
  return sendEmail('Sample Request', data, {
    fromEmail: 'Star Hi Herbs Samples <sample@starhiherbs.com>',
    cc: CC_EMAIL,
  });
}

// Download catalogue email
export async function sendCatalogueRequestEmail(data: Record<string, any>) {
  return sendEmail('Catalogue Download', data, {
    fromEmail: 'Star Hi Herbs Catalogue <catalogue@starhiherbs.com>',
    cc: CC_EMAIL,
  });
}

// Job application email
export async function sendJobApplicationEmail(data: Record<string, any>) {
  return sendEmail('Job Application', data, {
    fromEmail: 'Star Hi Herbs Careers <careers@starhiherbs.com>',
    cc: CC_EMAIL,
  });
}

// General application email
export async function sendGeneralApplicationEmail(data: Record<string, any>) {
  return sendEmail('General Application', data, {
    fromEmail: 'Star Hi Herbs Careers <careers@starhiherbs.com>',
    cc: CC_EMAIL,
  });
}

// Meeting request email
export async function sendMeetingRequestEmail(data: Record<string, any>) {
  return sendEmail('Meeting Request', data, {
    fromEmail: 'Star Hi Herbs Meetings <meeting@starhiherbs.com>',
    cc: CC_EMAIL,
  });
}

/**
 * Format form data into a readable text format
 * @param data - Form data object
 * @returns Formatted text
 */
export function formatFormData(data: Record<string, any>): string {
  return Object.entries(data)
    .map(([key, value]) => {
      // Format the key with proper capitalization and spacing
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
        .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase words
      
      // Handle boolean values
      if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
      }
      
      return `${formattedKey}: ${value}`;
    })
    .join('\n');
}
