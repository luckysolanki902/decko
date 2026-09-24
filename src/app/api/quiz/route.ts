import { NextRequest, NextResponse } from 'next/server';

import { getCollection } from '@/lib/mongodb';
import { getSession, requireSession } from '@/lib/auth';
import { ROADMAP_SECTIONS, RoadmapSection } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface QuizResultRecord {
  userId: string;
  section: RoadmapSection;
  phaseId: string;
  answers: Record<string, unknown>;
  score: number;
  total: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function parseSection(value: unknown): RoadmapSection | null {
  return typeof value === 'string' && ROADMAP_SECTIONS.includes(value as never)
    ? (value as RoadmapSection)
    : null;
}

// GET — this learner's quiz results, optionally filtered by section/phase.
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: true, results: [] });
    }

    const { searchParams } = new URL(request.url);
    const section = parseSection(searchParams.get('section'));
    const phaseId = searchParams.get('phaseId');

    const collection = await getCollection<QuizResultRecord>('quiz_results');
    const filter: Record<string, unknown> = { userId: session.userId };
    if (section) filter.section = section;
    if (phaseId) filter.phaseId = phaseId;

    const results = await collection.find(filter).toArray();

    return NextResponse.json({
      success: true,
      results: results.map(row => ({
        section: row.section,
        phaseId: row.phaseId,
        answers: row.answers || {},
        score: row.score,
        total: row.total,
        completedAt: row.completedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch quiz results' }, { status: 500 });
  }
}

// POST — save or update this learner's result for one phase quiz.
export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const section = parseSection(body.section);
    const phaseId = typeof body.phaseId === 'string' ? body.phaseId : '';
    const { answers, score, total } = body;

    if (!section || !phaseId || answers === undefined || score === undefined || total === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const collection = await getCollection<QuizResultRecord>('quiz_results');
    const now = new Date();

    await collection.updateOne(
      { userId: auth.session.userId, section, phaseId },
      {
        $set: {
          answers: answers as Record<string, unknown>,
          score: Number(score),
          total: Number(total),
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now, completedAt: null },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, section, phaseId, score, total });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json({ success: false, error: 'Failed to save quiz result' }, { status: 500 });
  }
}

// PATCH — stamp the quiz as finished.
export async function PATCH(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const section = parseSection(body.section);
    const phaseId = typeof body.phaseId === 'string' ? body.phaseId : '';

    if (!section || !phaseId) {
      return NextResponse.json({ success: false, error: 'Missing section or phaseId' }, { status: 400 });
    }

    const collection = await getCollection<QuizResultRecord>('quiz_results');
    await collection.updateOne(
      { userId: auth.session.userId, section, phaseId },
      { $set: { completedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking quiz complete:', error);
    return NextResponse.json({ success: false, error: 'Failed to mark quiz complete' }, { status: 500 });
  }
}

// DELETE — reset this learner's attempt so they can retake the quiz.
export async function DELETE(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const section = parseSection(searchParams.get('section'));
    const phaseId = searchParams.get('phaseId');

    if (!section || !phaseId) {
      return NextResponse.json({ success: false, error: 'Missing section or phaseId' }, { status: 400 });
    }

    const collection = await getCollection<QuizResultRecord>('quiz_results');
    await collection.deleteOne({ userId: auth.session.userId, section, phaseId });

    return NextResponse.json({ success: true, section, phaseId });
  } catch (error) {
    console.error('Error clearing quiz progress:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear quiz progress' }, { status: 500 });
  }
}
