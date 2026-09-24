import { NextRequest, NextResponse } from 'next/server';

import {
  COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  createSessionToken,
  requireSession,
  validatePassword,
} from '@/lib/auth';
import { changePassword } from '@/lib/users';
import { clientKey, rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  const limit = rateLimit(`password:${clientKey(request)}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please wait a while.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ success: false, error: passwordError }, { status: 400 });
    }

    const result = await changePassword(auth.session.userId, currentPassword, newPassword);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Re-issue the cookie so the session clock restarts after a password change.
    const token = await createSessionToken(auth.session);
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('Password change failed:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
