import { NextRequest, NextResponse } from 'next/server';

import { requireSession } from '@/lib/auth';
import {
  DEFAULT_TRACKER_COLOR,
  createTracker,
  deleteTracker,
  isValidColor,
  listLogs,
  listTrackers,
  updateTracker,
} from '@/lib/trackers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET — this learner's trackers plus their day entries.
// `?month=YYYY-MM` narrows the entries; omit it to load the whole history.
export async function GET(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const month = request.nextUrl.searchParams.get('month');
    const [trackers, logs] = await Promise.all([
      listTrackers(auth.session.userId),
      listLogs(auth.session.userId, month),
    ]);

    return NextResponse.json({ success: true, trackers, logs });
  } catch (error) {
    console.error('Error loading trackers:', error);
    return NextResponse.json({ success: false, error: 'Failed to load trackers' }, { status: 500 });
  }
}

// POST — create a tracker.
export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const name = typeof body.name === 'string' ? body.name : '';
    const color = isValidColor(body.color) ? body.color : DEFAULT_TRACKER_COLOR;

    const result = await createTracker(auth.session.userId, name, color);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, tracker: result.tracker });
  } catch (error) {
    console.error('Error creating tracker:', error);
    return NextResponse.json({ success: false, error: 'Failed to create the tracker' }, { status: 500 });
  }
}

// PATCH — rename, recolour or reorder a tracker.
export async function PATCH(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const trackerId = typeof body.id === 'string' ? body.id : '';

    if (!trackerId) {
      return NextResponse.json({ success: false, error: 'Missing tracker id' }, { status: 400 });
    }

    const result = await updateTracker(auth.session.userId, trackerId, {
      name: typeof body.name === 'string' ? body.name : undefined,
      color: isValidColor(body.color) ? body.color : undefined,
      order: typeof body.order === 'number' ? body.order : undefined,
    });

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating tracker:', error);
    return NextResponse.json({ success: false, error: 'Failed to update the tracker' }, { status: 500 });
  }
}

// DELETE — remove a tracker and every day entry belonging to it.
export async function DELETE(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const trackerId = request.nextUrl.searchParams.get('id') ?? '';
    if (!trackerId) {
      return NextResponse.json({ success: false, error: 'Missing tracker id' }, { status: 400 });
    }

    const deleted = await deleteTracker(auth.session.userId, trackerId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Tracker not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tracker:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete the tracker' }, { status: 500 });
  }
}
