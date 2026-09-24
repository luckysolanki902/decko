import { NextRequest, NextResponse } from 'next/server';

import { resolveTarget } from '@/lib/revision/config';
import { isRevisionRoadmapId } from '@/lib/revision/roadmaps';
import { getSession } from '@/lib/auth';
import { getAllContentVersions, getContent, listAttempts } from '@/lib/revision/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Everything the runner needs for one target: its meta + lecture list, the
// authored revision set (or null → this target has not been written yet), and
// the signed-in learner's attempt history. Signed-out visitors can read the
// set but get no attempts.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const roadmapId = searchParams.get('roadmapId');
    const conceptId = searchParams.get('conceptId') ?? '';
    const targetId = searchParams.get('targetId') ?? '';

    if (!isRevisionRoadmapId(roadmapId)) {
      return NextResponse.json({ success: false, error: 'Unsupported roadmapId' }, { status: 400 });
    }

    const target = resolveTarget(roadmapId, conceptId, targetId);
    if (!target) {
      return NextResponse.json({ success: false, error: 'Target not found' }, { status: 404 });
    }

    const session = await getSession();
    const userId = session?.userId ?? null;

    const [content, attempts, allVersions] = await Promise.all([
      getContent(roadmapId, conceptId, targetId),
      listAttempts(userId, roadmapId, conceptId, targetId),
      getAllContentVersions(roadmapId, conceptId, targetId),
    ]);

    const contentsByVersion: Record<number, (typeof allVersions)[number]> = {};
    for (const version of allVersions) {
      contentsByVersion[version.version] = version;
    }

    return NextResponse.json({
      success: true,
      isSignedIn: Boolean(session),
      target: {
        conceptId: target.conceptId,
        conceptTitle: target.conceptTitle,
        targetId: target.targetId,
        kind: target.kind,
        title: target.title,
        lectures: target.lectures.map(lecture => ({ sectionId: lecture.sectionId, title: lecture.title })),
      },
      content,
      attempts,
      contentsByVersion,
    });
  } catch (error) {
    console.error('Error loading revision target:', error);
    return NextResponse.json({ success: false, error: 'Failed to load target' }, { status: 500 });
  }
}
