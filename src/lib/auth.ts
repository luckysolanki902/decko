import 'server-only';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { COOKIE_NAME, SessionPayload, readSessionToken } from '@/lib/session';

export type { SessionPayload };
export { COOKIE_NAME, SESSION_MAX_AGE_SECONDS, SESSION_COOKIE_OPTIONS, createSessionToken } from '@/lib/session';

/** The signed-in learner, or null. Safe to call from any server component. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return readSessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

/**
 * Route-handler guard. Returns either the session or a ready-to-return 401, so
 * handlers read as:
 *
 *   const auth = await requireSession();
 *   if (!auth.session) return auth.response;
 */
export async function requireSession(): Promise<
  { session: SessionPayload; response?: never } | { session?: never; response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      response: NextResponse.json(
        { success: false, error: 'You need to be signed in to do that.' },
        { status: 401 }
      ),
    };
  }
  return { session };
}

// ── Credential rules ──────────────────────────────────────────────────────

export const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 200;

export function normaliseUsername(input: string): string {
  return input.trim().toLowerCase();
}

/** Returns an error message, or null when the username is acceptable. */
export function validateUsername(input: string): string | null {
  const username = normaliseUsername(input);
  if (username.length < 3) {
    return 'Username must be at least 3 characters.';
  }
  if (username.length > 24) {
    return 'Username must be 24 characters or fewer.';
  }
  if (!USERNAME_PATTERN.test(username)) {
    return 'Username can only contain lowercase letters, numbers and underscores.';
  }
  return null;
}

/** Returns an error message, or null when the password is acceptable. */
export function validatePassword(password: string): string | null {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  }
  // A length floor alone lets "12345678" through, which is the single most
  // guessed password shape. Require at least two character classes.
  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter(pattern => pattern.test(password)).length;
  if (classes < 2) {
    return 'Password must mix at least two of: lowercase, uppercase, numbers, symbols.';
  }
  return null;
}
