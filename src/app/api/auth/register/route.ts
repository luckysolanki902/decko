import { NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE_OPTIONS, COOKIE_NAME, createSessionToken, validatePassword, validateUsername } from '@/lib/auth';
import { createUser } from '@/lib/users';
import { clientKey, rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Signup is expensive (one scrypt derivation) and is the obvious spam target.
  const limit = rateLimit(`register:${clientKey(request)}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many accounts created from here. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';

    const usernameError = validateUsername(username);
    if (usernameError) {
      return NextResponse.json({ success: false, error: usernameError }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ success: false, error: passwordError }, { status: 400 });
    }

    const result = await createUser(username, password);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 409 });
    }

    const token = await createSessionToken({
      userId: result.user.userId,
      username: result.user.username,
      displayName: result.user.displayName,
    });

    const response = NextResponse.json({ success: true, user: result.user });
    response.cookies.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { success: false, error: 'Could not create the account. Please try again.' },
      { status: 500 }
    );
  }
}
