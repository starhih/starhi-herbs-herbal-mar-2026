import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { subscribeRateLimiter } from '@/lib/rate-limit';

// Initialize Resend
// Note: You must set RESEND_API_KEY in your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';

    // 1. IP-based Rate Limiting (6 requests / min / IP)
    const rateLimit = subscribeRateLimiter.check(clientIp);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } },
      );
    }

    const body = await request.json();
    const { email, firstName, turnstileToken, 'cf-turnstile-response': cfToken } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 },
      );
    }

    // 2. Honeypot check: silently drop bot submissions
    const honeypotFields = [body.honeypot, body.company_fax, body.website_hp];
    const isBot = honeypotFields.some(val => val && typeof val === 'string' && val.trim().length > 0);
    if (isBot) {
      return NextResponse.json({ success: true, message: 'Subscribed successfully' });
    }

    // 3. Verify Cloudflare Turnstile token
    const token = turnstileToken || cfToken;
    const verification = await verifyTurnstileToken({
      token,
      ip: clientIp === 'unknown' ? undefined : clientIp,
      expectedAction: ['subscribe', 'inquiry'],
    });

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Security verification failed' },
        { status: 403 },
      );
    }

    // You need to set RESEND_AUDIENCE_ID in your environment variables
    // You can get this from the Resend dashboard under "Audiences"
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!process.env.RESEND_API_KEY) {
      // For local development without Resend configured, pretend it succeeded
      console.warn('RESEND_API_KEY is not set. Mocking successful subscription.');
      return NextResponse.json({ success: true, mocked: true });
    }

    if (!audienceId) {
      // If audience ID is not set, we can implicitly just send them a welcome email
      // instead of adding to Audience (fallback behavior)
      console.warn('RESEND_AUDIENCE_ID is not set. Cannot add to audience list.');
      // Still returning success to not break the UI, but log error
      return NextResponse.json({ 
        success: true, 
        message: 'Subscription successful (Audience ID not configured)' 
      });
    }

    // Add exactly to Resend Audience Contacts List
    const { data, error } = await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      console.error('Resend contacts error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Subscription unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription' },
      { status: 500 },
    );
  }
}
