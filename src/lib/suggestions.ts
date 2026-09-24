import 'server-only';

import { ObjectId } from 'mongodb';

import {
  SuggestionKind,
  SuggestionRecord,
  SuggestionStatus,
  VoteRecord,
  getCollection,
} from '@/lib/mongodb';

export const SUGGESTION_KINDS: SuggestionKind[] = ['lecture', 'section', 'course', 'correction'];
export const SUGGESTION_STATUSES: SuggestionStatus[] = [
  'open',
  'planned',
  'in_progress',
  'published',
  'declined',
];

export const MAX_TITLE_LENGTH = 140;
export const MAX_BODY_LENGTH = 2000;

export interface PublicSuggestion {
  id: string;
  kind: SuggestionKind;
  title: string;
  body: string;
  roadmapId: string | null;
  reference: string | null;
  status: SuggestionStatus;
  voteCount: number;
  createdByName: string;
  createdAt: string;
  /** Whether the current viewer has voted. False for signed-out visitors. */
  hasVoted: boolean;
}

function serialize(record: SuggestionRecord, votedIds: Set<string>): PublicSuggestion {
  const id = String(record._id);
  return {
    id,
    kind: record.kind,
    title: record.title,
    body: record.body,
    roadmapId: record.roadmapId,
    reference: record.reference,
    status: record.status,
    voteCount: record.voteCount,
    createdByName: record.createdByName,
    createdAt: record.createdAt.toISOString(),
    hasVoted: votedIds.has(id),
  };
}

/** Which of these suggestions the given user has already voted on. */
async function votedIdsFor(userId: string | null, suggestionIds: string[]): Promise<Set<string>> {
  if (!userId || suggestionIds.length === 0) {
    return new Set();
  }
  const votes = await getCollection<VoteRecord>('votes');
  const rows = await votes.find({ userId, suggestionId: { $in: suggestionIds } }).toArray();
  return new Set(rows.map(row => row.suggestionId));
}

export interface ListOptions {
  userId: string | null;
  roadmapId?: string | null;
  kind?: SuggestionKind | null;
  status?: SuggestionStatus | null;
  limit?: number;
}

export async function listSuggestions(options: ListOptions): Promise<PublicSuggestion[]> {
  const suggestions = await getCollection<SuggestionRecord>('suggestions');

  const filter: Record<string, unknown> = {};
  if (options.roadmapId) filter.roadmapId = options.roadmapId;
  if (options.kind) filter.kind = options.kind;
  if (options.status) filter.status = options.status;

  const rows = await suggestions
    .find(filter)
    // Most-wanted first; ties broken by age so older requests are not buried.
    .sort({ voteCount: -1, createdAt: 1 })
    .limit(Math.min(options.limit ?? 100, 200))
    .toArray();

  const voted = await votedIdsFor(options.userId, rows.map(row => String(row._id)));
  return rows.map(row => serialize(row, voted));
}

export interface CreateSuggestionInput {
  userId: string;
  displayName: string;
  kind: SuggestionKind;
  title: string;
  body: string;
  roadmapId: string | null;
  reference: string | null;
}

export async function createSuggestion(
  input: CreateSuggestionInput
): Promise<{ ok: true; suggestion: PublicSuggestion } | { ok: false; error: string }> {
  const title = input.title.trim();
  const body = input.body.trim();

  if (title.length < 4) {
    return { ok: false, error: 'Give the request a title of at least 4 characters.' };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { ok: false, error: `Keep the title under ${MAX_TITLE_LENGTH} characters.` };
  }
  if (body.length > MAX_BODY_LENGTH) {
    return { ok: false, error: `Keep the details under ${MAX_BODY_LENGTH} characters.` };
  }

  const suggestions = await getCollection<SuggestionRecord>('suggestions');
  const now = new Date();

  const record: SuggestionRecord = {
    kind: input.kind,
    title,
    body,
    roadmapId: input.roadmapId,
    reference: input.reference,
    status: 'open',
    // The author's own vote is implied, so the count starts at one and a
    // matching vote row is written below.
    voteCount: 1,
    createdBy: input.userId,
    createdByName: input.displayName,
    createdAt: now,
    updatedAt: now,
  };

  const result = await suggestions.insertOne(record);
  const id = String(result.insertedId);

  const votes = await getCollection<VoteRecord>('votes');
  await votes.insertOne({ userId: input.userId, suggestionId: id, createdAt: now });

  return { ok: true, suggestion: serialize({ ...record, _id: result.insertedId }, new Set([id])) };
}

/**
 * Finds the suggestion for a given (kind, reference) pair, creating it on first
 * vote. This is what lets a "Vote for this revision set" button work without
 * anyone having filed a request first.
 */
export async function findOrCreateByReference(input: CreateSuggestionInput): Promise<PublicSuggestion> {
  if (input.reference) {
    const suggestions = await getCollection<SuggestionRecord>('suggestions');
    const existing = await suggestions.findOne({ kind: input.kind, reference: input.reference });
    if (existing) {
      const voted = await votedIdsFor(input.userId, [String(existing._id)]);
      return serialize(existing, voted);
    }
  }

  const created = await createSuggestion(input);
  if (!created.ok) {
    throw new Error(created.error);
  }
  return created.suggestion;
}

export interface VoteResult {
  suggestionId: string;
  voteCount: number;
  hasVoted: boolean;
}

/**
 * Toggles one learner's vote.
 *
 * The unique (userId, suggestionId) index is what makes this safe under
 * double-clicks: a duplicate insert throws rather than double-counting, and the
 * denormalised voteCount is only moved when the vote row actually changed.
 */
export async function toggleVote(userId: string, suggestionId: string): Promise<VoteResult | null> {
  if (!ObjectId.isValid(suggestionId)) {
    return null;
  }

  const suggestions = await getCollection<SuggestionRecord>('suggestions');
  const votes = await getCollection<VoteRecord>('votes');
  const objectId = new ObjectId(suggestionId);

  const suggestion = await suggestions.findOne({ _id: objectId });
  if (!suggestion) {
    return null;
  }

  const removed = await votes.deleteOne({ userId, suggestionId });

  if (removed.deletedCount > 0) {
    const updated = await suggestions.findOneAndUpdate(
      { _id: objectId },
      { $inc: { voteCount: -1 }, $set: { updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return {
      suggestionId,
      voteCount: Math.max(0, updated?.voteCount ?? 0),
      hasVoted: false,
    };
  }

  try {
    await votes.insertOne({ userId, suggestionId, createdAt: new Date() });
  } catch (error) {
    // Lost a race with another tab; the vote is already recorded.
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 11000)) {
      throw error;
    }
    return { suggestionId, voteCount: suggestion.voteCount, hasVoted: true };
  }

  const updated = await suggestions.findOneAndUpdate(
    { _id: objectId },
    { $inc: { voteCount: 1 }, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  return { suggestionId, voteCount: updated?.voteCount ?? suggestion.voteCount + 1, hasVoted: true };
}
