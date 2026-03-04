import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, subject, data, fromEmail: customFrom, cc } = body;

    if (!formType || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const recipientEmail = process.env.RESEND_TO_EMAIL || 'starhi@starhiherbs.com';
    const fromEmail = customFrom || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Build a clean HTML email body from the form data
    const htmlContent = buildEmailHtml(formType, data);
    const textContent = buildEmailText(formType, data);

    const emailSubject = subject || `[${formType}] New submission from ${data.from_name || data.name || 'Website'}`;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      ...(cc ? { cc: Array.isArray(cc) ? cc : [cc] } : {}),
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
