import 'server-only';

import { NextRequest } from 'next/server';

// A deliberately simple in-process limiter. It resets on cold start and is not
// shared between serverless instances, so it is a speed bump against credential
// stuffing rather than a hard guarantee. Put a WAF or an edge rate limit in
// front of the deployment if you expect real abuse.

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets — surfaced to the client as Retry-After. */
  retryAfter: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    // Opportunistic cleanup: drop expired entries before the map can grow
    // without bound on a long-lived instance.
    if (windows.size > MAX_TRACKED_KEYS) {
      for (const [candidate, window] of windows) {
        if (window.resetAt <= now) {
          windows.delete(candidate);
        }
      }
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

/** Clears a key's window — call after a successful login so one typo is not punished. */
export function resetRateLimit(key: string): void {
  windows.delete(key);
}

/**
 * Best-effort client identifier. Behind Vercel/Cloudflare the first
 * x-forwarded-for entry is the real client; locally it falls back to a
 * constant, which is fine for a dev machine.
 */
export function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'local';
}
