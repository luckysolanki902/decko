import { NextRequest, NextResponse } from 'next/server';

import { resolveTarget } from '@/lib/revision/config';
import { isRevisionRoadmapId } from '@/lib/revision/roadmaps';
import { gradeQuiz } from '@/lib/revision/grading';
import { requireSession } from '@/lib/auth';
import {
  getAttemptById,
  getContent,
  markReadingStage,
  recordQuizStage,
  startOrResumeAttempt,
} from '@/lib/revision/store';
import { RevisionAttempt } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Hard gate: you cannot reach the graded quiz without actually revising first.
// Revisions require the Concept + Cards; the concept-final requires Quick concepts.
function gateViolation(attempt: RevisionAttempt): string | null {
  const stages = attempt.stages;
  if (attempt.kind === 'revision' && !(stages.recap && stages.concepts)) {
    return 'Read the Concept and Cards first';
  }
  if (attempt.kind === 'final' && !stages.recap) {
    return 'Read the Quick concepts first';
  }
  return null;
}

export async function POST(request: NextRequest) {
  // Every action below writes to the learner's own revision history.
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }
  const { userId } = auth.session;

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const action = body.action;

    if (action === 'start') {
      const roadmapId = body.roadmapId;
      const conceptId = typeof body.conceptId === 'string' ? body.conceptId : '';
      const targetId = typeof body.targetId === 'string' ? body.targetId : '';
      const contentVersion = Number(body.contentVersion);

      if (!isRevisionRoadmapId(roadmapId) || !Number.isFinite(contentVersion) || contentVersion < 1) {
        return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
      }
      const target = resolveTarget(roadmapId, conceptId, targetId);
      if (!target) {
        return NextResponse.json({ success: false, error: 'Target not found' }, { status: 404 });
      }

      const attempt = await startOrResumeAttempt({
        userId,
        roadmapId,
        conceptId,
        targetId,
        kind: target.kind,
        contentVersion,
        forceNew: body.forceNew === true,
      });
      return NextResponse.json({ success: true, attempt });
    }

    if (action === 'reading') {
      const attemptId = typeof body.attemptId === 'string' ? body.attemptId : '';
      const stage = body.stage === 'concepts' ? 'concepts' : body.stage === 'recap' ? 'recap' : null;
      if (!attemptId || !stage) {
        return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
      }
      const attempt = await markReadingStage(userId, attemptId, stage);
      if (!attempt) {
        return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, attempt });
    }

    if (action === 'submit') {
      const attemptId = typeof body.attemptId === 'string' ? body.attemptId : '';
      const answers = (body.answers ?? {}) as Record<string, string[]>;

      if (!attemptId) {
        return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
      }

      // Scoped to this learner, so one account cannot grade another's attempt.
      const attempt = await getAttemptById(userId, attemptId);
      if (!attempt) {
        return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
      }

      const violation = gateViolation(attempt);
      if (violation) {
        return NextResponse.json({ success: false, error: violation }, { status: 409 });
      }

      const content = await getContent(
        attempt.roadmapId,
        attempt.conceptId,
        attempt.targetId,
        attempt.contentVersion
      );
      if (!content || content.quiz.length === 0) {
        return NextResponse.json({ success: false, error: 'Quiz not found for attempt' }, { status: 404 });
      }

      const graded = gradeQuiz(content.quiz, answers);
      const updated = await recordQuizStage(userId, attemptId, {
        answers,
        perQuestion: graded.perQuestion,
        score: graded.score,
        total: graded.total,
        completedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, attempt: updated, result: graded });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating revision attempt:', error);
    return NextResponse.json({ success: false, error: 'Failed to update attempt' }, { status: 500 });
  }
}
