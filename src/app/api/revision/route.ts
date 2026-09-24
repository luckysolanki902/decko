import { NextRequest, NextResponse } from 'next/server';

import { getConceptSummaries } from '@/lib/revision/store';
import { isRevisionRoadmapId } from '@/lib/revision/roadmaps';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dashboard summary for one roadmap: every concept with its revision/final
// statuses and best scores. Content availability is public; scores and progress
// come from the signed-in learner's own attempts.
export async function GET(request: NextRequest) {
  try {
    const roadmapId = request.nextUrl.searchParams.get('roadmapId');

    if (!isRevisionRoadmapId(roadmapId)) {
      return NextResponse.json({ success: false, error: 'Unsupported roadmapId' }, { status: 400 });
    }

    const session = await getSession();
    const concepts = await getConceptSummaries(session?.userId ?? null, roadmapId);

    return NextResponse.json({ success: true, roadmapId, concepts, isSignedIn: Boolean(session) });
  } catch (error) {
    console.error('Error building revision dashboard:', error);
    return NextResponse.json({ success: false, error: 'Failed to load revision dashboard' }, { status: 500 });
  }
}
