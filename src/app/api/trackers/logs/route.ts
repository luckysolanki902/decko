import { NextRequest, NextResponse } from 'next/server';

import { requireSession } from '@/lib/auth';
import { deleteLog, isValidDate, saveLog } from '@/lib/trackers';

export const dynamic = 'force-dynamic';

// POST — record one day for one tracker.
export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const trackerId = typeof body.trackerId === 'string' ? body.trackerId : '';
    const date = body.date;

    if (!trackerId || !isValidDate(date)) {
      return NextResponse.json(
        { success: false, error: 'Missing trackerId or a valid YYYY-MM-DD date' },
        { status: 400 }
      );
    }
    if (typeof body.done !== 'boolean') {
      return NextResponse.json({ success: false, error: 'done must be true or false' }, { status: 400 });
    }

    const result = await saveLog(auth.session.userId, {
      trackerId,
      date,
      done: body.done,
      note: typeof body.note === 'string' ? body.note : '',
      reason: typeof body.reason === 'string' ? body.reason : '',
    });

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving tracker log:', error);
    return NextResponse.json({ success: false, error: 'Failed to save the entry' }, { status: 500 });
  }
}

// DELETE — clear one day, returning it to the unanswered state.
export async function DELETE(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const { searchParams } = request.nextUrl;
    const trackerId = searchParams.get('trackerId') ?? '';
    const date = searchParams.get('date');

    if (!trackerId || !isValidDate(date)) {
      return NextResponse.json({ success: false, error: 'Missing trackerId or date' }, { status: 400 });
    }

    await deleteLog(auth.session.userId, trackerId, date);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tracker log:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear the entry' }, { status: 500 });
  }
}
