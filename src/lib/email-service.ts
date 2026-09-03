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
  options?: { subject?: string; fromEmail?: string; cc?: string | string[]; turnstileToken?: string },
) {
  try {
    const { turnstileToken, ...cleanData } = data;
    const finalToken = options?.turnstileToken || turnstileToken;

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType,
        data: cleanData,
        subject: options?.subject,
        fromEmail: options?.fromEmail,
        cc: options?.cc,
        turnstileToken: finalToken,
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
  turnstileToken?: string;
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
    turnstileToken: data.turnstileToken,
  });
}

// Request quote email
export async function sendQuoteRequestEmail(data: Record<string, any>) {
  const companyName = data.company || data.companyName || 'Unknown Company';
  const country = data.country || data.countryRegion || 'Unknown Country';
  const { turnstileToken, ...formData } = data;
  
  return sendEmail('Quote Request', formData, {
    subject: `💰 [Quote Request from Website] - ${companyName} - ${country}`,
    fromEmail: 'Star Hi Herbs Quotes <quote@starhiherbs.com>',
    cc: CC_EMAIL,
    turnstileToken,
  });
}

// Request sample email
export async function sendSampleRequestEmail(data: Record<string, any>) {
  const companyName = data.companyName || data.company || 'Unknown Company';
  const country = data.country || data.countryRegion || 'Unknown Country';
  const { turnstileToken, ...formData } = data;
  
  return sendEmail('Sample Request', formData, {
    subject: `📦 [Sample Request from Website] - ${companyName} - ${country}`,
    fromEmail: 'Star Hi Herbs Samples <sample@starhiherbs.com>',
    cc: CC_EMAIL,
    turnstileToken,
  });
}

// Download catalogue email
export async function sendCatalogueRequestEmail(data: Record<string, any>) {
  const name = data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : (data.name || 'Visitor');
  const company = data.companyName || data.company || 'Unknown Company';
  const { turnstileToken, ...formData } = data;
  
  return sendEmail('Catalogue Download', formData, {
    subject: `📚 [Catalogue] ${name} - ${company}`,
    fromEmail: 'Star Hi Herbs Catalogue <catalogue@starhiherbs.com>',
    cc: CC_EMAIL,
    turnstileToken,
  });
}

// Job application email
export async function sendJobApplicationEmail(data: Record<string, any>) {
  const applicantName = data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : (data.name || 'Applicant');
  const position = data.jobTitle || data.position || 'General Position';
  const { turnstileToken, ...formData } = data;
  
  return sendEmail('Job Application', formData, {
    subject: `💼 [Job App] ${applicantName} - ${position}`,
    fromEmail: 'Star Hi Herbs Careers <careers@starhiherbs.com>',
    cc: CC_EMAIL,
    turnstileToken,
  });
}

// General application email
export async function sendGeneralApplicationEmail(data: Record<string, any>) {
  const applicantName = data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : (data.name || 'Applicant');
  const department = data.department || data.jobTitle || data.position || 'General Application';
  const { turnstileToken, ...formData } = data;
  
  return sendEmail('General Application', formData, {
    subject: `📁 [General App] ${applicantName} - ${department}`,
    fromEmail: 'Star Hi Herbs Careers <careers@starhiherbs.com>',
    cc: CC_EMAIL,
    turnstileToken,
  });
}

// Meeting request email
export async function sendMeetingRequestEmail(data: Record<string, any>) {
  const name = data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : (data.name || 'Visitor');
  const eventName = data.eventName || data.event || data.meetingType || 'Meeting / Event';
  const company = data.companyName || data.company || 'Unknown Company';
  const { turnstileToken, ...formData } = data;
  
  return sendEmail('Meeting Request', formData, {
    subject: `🤝 [Meeting] ${name} - ${eventName} - ${company}`,
    fromEmail: 'Star Hi Herbs Meetings <meeting@starhiherbs.com>',
    cc: CC_EMAIL,
    turnstileToken,
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
