import 'server-only';

import { ObjectId } from 'mongodb';

import { TrackerLogRecord, TrackerRecord, getCollection } from '@/lib/mongodb';

/**
 * Ten is a deliberate ceiling, not a technical one. Habit tracking stops
 * working when the board is too big to read at a glance, and an unbounded list
 * would also make the homepage query unbounded.
 */
export const MAX_TRACKERS = 10;

export const MAX_TRACKER_NAME_LENGTH = 32;

// Colour keys rather than raw CSS, so the palette can be restyled (or made
// theme-aware) without rewriting stored rows.
export const TRACKER_COLORS = [
  'slate',
  'blue',
  'green',
  'amber',
  'rose',
  'violet',
  'teal',
  'orange',
] as const;

export type TrackerColor = (typeof TRACKER_COLORS)[number];

export const DEFAULT_TRACKER_COLOR: TrackerColor = 'slate';

export interface PublicTracker {
  id: string;
  name: string;
  color: TrackerColor;
  order: number;
  createdAt: string;
}

export interface PublicTrackerLog {
  trackerId: string;
  date: string;
  done: boolean;
  note: string;
  reason: string;
}

function serialize(record: TrackerRecord): PublicTracker {
  return {
    id: String(record._id),
    name: record.name,
    color: (TRACKER_COLORS as readonly string[]).includes(record.color)
      ? (record.color as TrackerColor)
      : DEFAULT_TRACKER_COLOR,
    order: record.order,
    createdAt: record.createdAt.toISOString(),
  };
}

export function isValidColor(value: unknown): value is TrackerColor {
  return typeof value === 'string' && (TRACKER_COLORS as readonly string[]).includes(value);
}

/** Local calendar day, YYYY-MM-DD. */
export function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function listTrackers(userId: string): Promise<PublicTracker[]> {
  const trackers = await getCollection<TrackerRecord>('trackers');
  const rows = await trackers.find({ userId }).sort({ order: 1, createdAt: 1 }).toArray();
  return rows.map(serialize);
}

export async function createTracker(
  userId: string,
  name: string,
  color: TrackerColor
): Promise<{ ok: true; tracker: PublicTracker } | { ok: false; error: string }> {
  const trimmed = name.trim();
  if (trimmed.length < 1) {
    return { ok: false, error: 'Give the tracker a name.' };
  }
  if (trimmed.length > MAX_TRACKER_NAME_LENGTH) {
    return { ok: false, error: `Keep the name under ${MAX_TRACKER_NAME_LENGTH} characters.` };
  }

  const trackers = await getCollection<TrackerRecord>('trackers');
  const existing = await trackers.countDocuments({ userId });
  if (existing >= MAX_TRACKERS) {
    return { ok: false, error: `You can have at most ${MAX_TRACKERS} trackers. Delete one to add another.` };
  }

  const now = new Date();
  const record: TrackerRecord = {
    userId,
    name: trimmed,
    color,
    order: existing,
    createdAt: now,
    updatedAt: now,
  };

  const result = await trackers.insertOne(record);
  return { ok: true, tracker: serialize({ ...record, _id: result.insertedId }) };
}

export async function updateTracker(
  userId: string,
  trackerId: string,
  changes: { name?: string; color?: TrackerColor; order?: number }
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(trackerId)) {
    return { ok: false, error: 'Tracker not found.' };
  }

  const update: Partial<TrackerRecord> = { updatedAt: new Date() };

  if (changes.name !== undefined) {
    const trimmed = changes.name.trim();
    if (trimmed.length < 1) {
      return { ok: false, error: 'Give the tracker a name.' };
    }
    if (trimmed.length > MAX_TRACKER_NAME_LENGTH) {
      return { ok: false, error: `Keep the name under ${MAX_TRACKER_NAME_LENGTH} characters.` };
    }
    update.name = trimmed;
  }
  if (changes.color !== undefined) update.color = changes.color;
  if (changes.order !== undefined) update.order = changes.order;

  const trackers = await getCollection<TrackerRecord>('trackers');
  // Scoped by userId so one account cannot rename another's tracker.
  const result = await trackers.updateOne({ _id: new ObjectId(trackerId), userId }, { $set: update });

  return result.matchedCount === 0 ? { ok: false, error: 'Tracker not found.' } : { ok: true };
}

export async function deleteTracker(userId: string, trackerId: string): Promise<boolean> {
  if (!ObjectId.isValid(trackerId)) {
    return false;
  }

  const trackers = await getCollection<TrackerRecord>('trackers');
  const result = await trackers.deleteOne({ _id: new ObjectId(trackerId), userId });
  if (result.deletedCount === 0) {
    return false;
  }

  // Leaving the day entries behind would silently re-populate a future tracker
  // that happened to reuse the id, so they go with it.
  const logs = await getCollection<TrackerLogRecord>('tracker_logs');
  await logs.deleteMany({ userId, trackerId });

  return true;
}

/** Day entries for this learner, optionally limited to one `YYYY-MM` month. */
export async function listLogs(userId: string, month?: string | null): Promise<PublicTrackerLog[]> {
  const logs = await getCollection<TrackerLogRecord>('tracker_logs');

  const filter: Record<string, unknown> = { userId };
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    filter.date = { $regex: `^${month}` };
  }

  const rows = await logs.find(filter).sort({ date: -1 }).toArray();
  return rows.map(row => ({
    trackerId: row.trackerId,
    date: row.date,
    done: row.done,
    note: row.note ?? '',
    reason: row.reason ?? '',
  }));
}

export async function saveLog(
  userId: string,
  input: { trackerId: string; date: string; done: boolean; note: string; reason: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(input.trackerId)) {
    return { ok: false, error: 'Tracker not found.' };
  }

  // Confirm the tracker belongs to this learner before writing a log against it.
  const trackers = await getCollection<TrackerRecord>('trackers');
  const owned = await trackers.findOne({ _id: new ObjectId(input.trackerId), userId });
  if (!owned) {
    return { ok: false, error: 'Tracker not found.' };
  }

  const logs = await getCollection<TrackerLogRecord>('tracker_logs');
  const now = new Date();

  await logs.updateOne(
    { userId, trackerId: input.trackerId, date: input.date },
    {
      $set: {
        // Only the branch that applies is stored, so switching a day from
        // "done" to "missed" cannot leave a stale note behind.
        done: input.done,
        note: input.done ? input.note.slice(0, 500) : '',
        reason: input.done ? '' : input.reason.slice(0, 500),
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  return { ok: true };
}

export async function deleteLog(userId: string, trackerId: string, date: string): Promise<void> {
  const logs = await getCollection<TrackerLogRecord>('tracker_logs');
  await logs.deleteOne({ userId, trackerId, date });
}
