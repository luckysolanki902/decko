import { NextResponse } from 'next/server';

// Evaluated once per serverless cold-start (= once per Vercel deployment).
// VERCEL_GIT_COMMIT_SHA is automatically injected by Vercel for every build.
const BUILD_ID =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.VERCEL_DEPLOYMENT_ID ??
  `local-${Date.now()}`;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function GET() {
  return NextResponse.json(
    { buildId: BUILD_ID },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
