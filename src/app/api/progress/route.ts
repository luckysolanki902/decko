import { NextRequest, NextResponse } from 'next/server';

import { ProgressRecord, getCollection } from '@/lib/mongodb';
import { getSession, requireSession } from '@/lib/auth';
import { ROADMAP_SECTIONS } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET — every completed item for the signed-in learner.
// Signed-out visitors get an empty list rather than a 401, so course pages can
// render their checkboxes in an unchecked state without special-casing.
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: true, completedItems: [], totalCount: 0 });
    }

    const progress = await getCollection<ProgressRecord>('progress');
    const rows = await progress.find({ userId: session.userId, completed: true }).toArray();

    return NextResponse.json({
      success: true,
      completedItems: rows.map(row => ({
        itemId: row.itemId,
        section: row.section,
        completedAt: row.completedAt,
      })),
      totalCount: rows.length,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST — toggle one checklist item for the signed-in learner.
export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const itemId = typeof body.itemId === 'string' ? body.itemId : '';
    const section = body.section;
    const completed = Boolean(body.completed);

    if (!itemId) {
      return NextResponse.json({ success: false, error: 'Missing itemId' }, { status: 400 });
    }
    if (typeof section !== 'string' || !ROADMAP_SECTIONS.includes(section as never)) {
      return NextResponse.json({ success: false, error: 'Invalid section' }, { status: 400 });
    }

    const progress = await getCollection<ProgressRecord>('progress');
    const now = new Date();

    await progress.updateOne(
      { userId: auth.session.userId, itemId, section: section as ProgressRecord['section'] },
      {
        $set: { completed, completedAt: completed ? now : null, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, itemId, completed });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ success: false, error: 'Failed to update progress' }, { status: 500 });
  }
}
