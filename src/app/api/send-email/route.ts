import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getPayloadClient } from '@/lib/payload';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { emailRateLimiter } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';

    // 1. IP-based Rate Limiting (6 requests / min / IP)
    const rateLimit = emailRateLimiter.check(clientIp);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } },
      );
    }

    const body = await request.json();
    const { formType, subject, data, fromEmail: customFrom, cc, turnstileToken, 'cf-turnstile-response': cfToken } = body;

    if (!formType || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // 2. Honeypot check: If bot fills hidden honeypot fields, silently drop
    const honeypotFields = [body.honeypot, body.company_fax, body.website_hp, data.honeypot, data.company_fax, data.website_hp];
    const isBot = honeypotFields.some(val => val && typeof val === 'string' && val.trim().length > 0);
    if (isBot) {
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    }

    // 3. Verify Cloudflare Turnstile token
    const token = turnstileToken || cfToken || data.turnstileToken;
    const verification = await verifyTurnstileToken({
      token,
      ip: clientIp === 'unknown' ? undefined : clientIp,
      expectedAction: ['inquiry', 'contact', 'quote', 'sample', 'catalogue', 'meeting', 'job_application', 'general_application'],
    });

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Security verification failed' },
        { status: 403 },
      );
    }

    let recipientEmail = process.env.RESEND_TO_EMAIL || 'starhi@starhiherbs.com';
    const fromEmail = customFrom || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    let ccList = cc ? (Array.isArray(cc) ? cc : [cc]) : [];

    if (formType === 'Job Application' || formType === 'General Application') {
      recipientEmail = 'hr@starhiherbs.com';
      ccList = ['najish.n@starhiherbs.com'];
    }

    // 4. Secure resume upload with size & mime whitelisting
    if (data.resumeFileBase64) {
      try {
        const allowedMimeTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        const mimeType = data.resumeFileType || 'application/pdf';

        if (!allowedMimeTypes.includes(mimeType)) {
          throw new Error('Invalid resume file type.');
        }

        const base64Data = data.resumeFileBase64.split(';base64,').pop();
        if (base64Data) {
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Max file size: 5MB
          if (buffer.length > 5 * 1024 * 1024) {
            throw new Error('File exceeds maximum size of 5MB.');
          }

          const payload = await getPayloadClient();
          const mediaDoc = await payload.create({
            collection: 'media',
            data: { alt: `Resume - ${data.firstName || data.name || 'Applicant'} - ${formType}` },
            file: {
              data: buffer,
              mimetype: mimeType,
              name: `${Date.now()}-${(data.resumeFileName || 'resume.pdf').replace(/[^a-zA-Z0-9.-]/g, '-')}`,
              size: buffer.length,
            },
          });

          // Ensure the resume download link is absolute
          const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://starhiherbs.com';
          data.resumeDownloadLink = mediaDoc.url?.startsWith('http') 
            ? mediaDoc.url 
            : `${baseUrl}${mediaDoc.url}`;
            
          delete data.resumeFileBase64;
          delete data.resumeFileSize;
          delete data.resumeFileType;
        }
      } catch (uploadError: any) {
        console.error('Error uploading resume to Spaces:', uploadError);
        data.resumeUploadError = uploadError.message || 'Failed to upload resume to cloud storage.';
      }
    }

    // Build a clean HTML email body from the form data
    const htmlContent = buildEmailHtml(formType, data);
    const textContent = buildEmailText(formType, data);

    const emailSubject = subject || `[${formType}] New submission from ${data.from_name || data.name || 'Website'}`;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      ...(ccList.length > 0 ? { cc: ccList } : {}),
      subject: emailSubject,
      replyTo: data.from_email || data.email || undefined,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 },
    );
  }
}

function buildEmailHtml(formType: string, data: Record<string, any>): string {
  const rows = Object.entries(data)
    .map(([key, value]) => {
      const label = key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();

      if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
      }

      return `<tr><td style="padding:8px 12px;font-weight:600;color:#214842;border-bottom:1px solid #e5e7eb;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${String(value ?? '').replace(/\n/g, '<br>')}</td></tr>`;
    })
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#214842;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;font-size:20px;">${formType}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e5e7eb;">
        ${rows}
      </table>
      <div style="padding:16px 24px;background:#f9fafb;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
        <p style="margin:0;font-size:12px;color:#6b7280;">This email was sent from the Star Hi Herbs website.</p>
      </div>
    </div>
  `;
}

function buildEmailText(formType: string, data: Record<string, any>): string {
  const lines = Object.entries(data)
    .map(([key, value]) => {
      const label = key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();

      if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
      }

      return `${label}: ${value}`;
    })
    .join('\n');

  return `${formType}\n${'='.repeat(40)}\n\n${lines}\n\n---\nSent from the Star Hi Herbs website.`;
}
