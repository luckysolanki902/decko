import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Who am I? Returns `{ user: null }` for signed-out visitors rather than a 401. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: true, user: null });
  }
  return NextResponse.json({
    success: true,
    user: {
      userId: session.userId,
      username: session.username,
      displayName: session.displayName,
    },
  });
}
