/**
 * In-memory sliding-window rate limiter for serverless / Node.js API routes.
 */

interface RateLimitRecord {
  timestamps: number[];
}

class RateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private lastCleanup = Date.now();

  constructor(windowMs: number = 60 * 1000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public check(identifier: string): { success: boolean; remaining: number; reset: number } {
    const now = Date.now();

    // Periodically clean up stale records every 5 minutes
    if (now - this.lastCleanup > 5 * 60 * 1000) {
      this.cleanup(now);
    }

    const windowStart = now - this.windowMs;
    const record = this.store.get(identifier) || { timestamps: [] };

    // Filter out timestamps outside the active window
    const validTimestamps = record.timestamps.filter(t => t > windowStart);

    if (validTimestamps.length >= this.maxRequests) {
      const oldestValid = validTimestamps[0];
      const resetTime = oldestValid + this.windowMs;
      return {
        success: false,
        remaining: 0,
        reset: Math.max(0, Math.ceil((resetTime - now) / 1000)),
      };
    }

    validTimestamps.push(now);
    this.store.set(identifier, { timestamps: validTimestamps });

    return {
      success: true,
      remaining: this.maxRequests - validTimestamps.length,
      reset: Math.ceil(this.windowMs / 1000),
    };
  }

  private cleanup(now: number): void {
    this.lastCleanup = now;
    const windowStart = now - this.windowMs;
    for (const [key, record] of this.store.entries()) {
      const valid = record.timestamps.filter(t => t > windowStart);
      if (valid.length === 0) {
        this.store.delete(key);
      } else {
        this.store.set(key, { timestamps: valid });
      }
    }
  }
}

// Pre-configured rate limiters for standard endpoints:
// Email sending: max 6 submissions per minute per IP
export const emailRateLimiter = new RateLimiter(60 * 1000, 6);

// Newsletter subscription: max 6 subscriptions per minute per IP
export const subscribeRateLimiter = new RateLimiter(60 * 1000, 6);
