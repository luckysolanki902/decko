import { NextRequest, NextResponse } from 'next/server';

import {
  COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  createSessionToken,
  normaliseUsername,
  validateUsername,
} from '@/lib/auth';
import { authenticate } from '@/lib/users';
import { clientKey, rateLimit, resetRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * The single entry point for signing in.
 *
 * When no account matches the username, this answers with `needsSignup` rather
 * than an error, and the form offers to create one. That is what lets a single
 * "Sign in" button serve both new and returning learners.
 *
 * Creating the account is a separate, explicit call to /api/auth/register. We
 * deliberately do not auto-create here: a mistyped username would silently
 * produce an empty second account, and the learner would think they had lost
 * all of their progress.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Enter a username and password.' },
        { status: 400 }
      );
    }

    // Two limits: one per source address (stops spraying many usernames from
    // one host) and one per account (stops distributed guessing of one account).
    const ipKey = `login:ip:${clientKey(request)}`;
    const userKey = `login:user:${normaliseUsername(username)}`;
    const ipLimit = rateLimit(ipKey, 20, 15 * 60 * 1000);
    const userLimit = rateLimit(userKey, 10, 15 * 60 * 1000);

    if (!ipLimit.allowed || !userLimit.allowed) {
      const retryAfter = Math.max(ipLimit.retryAfter, userLimit.retryAfter);
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please wait a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const result = await authenticate(username, password);

    if (result.outcome === 'no_account') {
      // Reject usernames that could never exist before offering to create one,
      // so the signup prompt never appears for input that registration would
      // immediately refuse.
      const usernameError = validateUsername(username);
      if (usernameError) {
        return NextResponse.json({ success: false, error: usernameError }, { status: 400 });
      }
      return NextResponse.json(
        { success: false, needsSignup: true, username: normaliseUsername(username) },
        { status: 404 }
      );
    }

    if (result.outcome === 'wrong_password') {
      return NextResponse.json({ success: false, error: 'Incorrect password.' }, { status: 401 });
    }

    resetRateLimit(ipKey);
    resetRateLimit(userKey);

    const token = await createSessionToken({
      userId: result.user.userId,
      username: result.user.username,
      displayName: result.user.displayName,
    });

    const response = NextResponse.json({ success: true, user: result.user });
    response.cookies.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
