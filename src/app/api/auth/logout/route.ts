import { NextResponse } from 'next/server';

import { COOKIE_NAME } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Overwrite with an expired cookie as well as deleting it: some proxies drop
  // bare Set-Cookie deletions, and a stale session cookie means a stuck login.
  response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return response;
}
