import { NextRequest, NextResponse } from 'next/server';

import { COOKIE_NAME, readSessionToken } from '@/lib/session';

// Course content is public on purpose: lectures, roadmaps and notes should be
// readable — and indexable — without an account. Signing in is what adds the
// personal layer: progress, streaks, trackers, revision history and voting.
//
// Only genuinely personal pages are gated here. API routes are absent by
// design; each mutating handler calls requireSession() itself, which keeps the
// check beside the data it protects instead of in a list that silently drifts.
const PROTECTED_PREFIXES = ['/account'];

// A single entry point handles both signing in and creating an account, so
// there is one page here. Signed-in learners have no reason to see it.
const AUTH_PAGES = ['/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSessionToken(request.cookies.get(COOKIE_NAME)?.value);

  if (AUTH_PAGES.includes(pathname)) {
    return session ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    // Round-trip the learner back to where they were headed.
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, the API surface and anything with a file extension.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
