/**
 * Cloudflare Turnstile server-side verification helper
 */

interface VerifyTurnstileOptions {
  token?: string;
  ip?: string;
  expectedAction?: string | string[];
}

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export async function verifyTurnstileToken({
  token,
  ip,
  expectedAction,
}: VerifyTurnstileOptions): Promise<{ success: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET;

  // In development without secret configured, warn and bypass to not block devs
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Turnstile] TURNSTILE_SECRET not configured, bypassing verification in development');
      return { success: true };
    }
    return { success: false, error: 'Turnstile secret not configured on server' };
  }

  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { success: false, error: 'Missing or invalid Turnstile token' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: AbortSignal.timeout(10_000),
      body: formData,
    });

    if (!res.ok) {
      return { success: false, error: `Turnstile verification failed with status ${res.status}` };
    }

    const data: TurnstileVerifyResponse = await res.json();

    if (!data.success) {
      const errorCodes = data['error-codes']?.join(', ') || 'Verification failed';
      return { success: false, error: `Turnstile verification rejected: ${errorCodes}` };
    }

    // Validate expected action if specified
    if (expectedAction && data.action) {
      const allowedActions = Array.isArray(expectedAction) ? expectedAction : [expectedAction];
      if (!allowedActions.includes(data.action)) {
        return { success: false, error: `Turnstile action mismatch (expected ${allowedActions.join('/')}, got ${data.action})` };
      }
    }

    // Validate hostname if configured via TURNSTILE_HOSTNAMES
    if (process.env.TURNSTILE_HOSTNAMES && data.hostname) {
      const expectedHostnames = new Set(
        process.env.TURNSTILE_HOSTNAMES.split(',').map((h) => h.trim().toLowerCase()).filter(Boolean)
      );
      if (expectedHostnames.size > 0 && !expectedHostnames.has(data.hostname.toLowerCase())) {
        return { success: false, error: `Turnstile hostname mismatch: ${data.hostname}` };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Turnstile] Verification error:', err);
    return { success: false, error: 'Turnstile verification service error' };
  }
}
