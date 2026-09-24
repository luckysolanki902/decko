import 'server-only';

import { ObjectId } from 'mongodb';

import { connectToDatabase } from '@/lib/mongodb';
import {
  ConceptSummary,
  QuizStageResult,
  RevisionAttempt,
  RevisionContent,
  RevisionTargetKind,
  RevisionTargetStatus,
  RevisionTargetSummary,
  RevisionRoadmapId,
} from '@/types';
import { FINAL_TARGET_ID, getConceptDefs, resolveConcept } from '@/lib/revision/config';
import { toPercent } from '@/lib/revision/grading';

const PROGRESS_COLLECTION = 'progress';
const CONTENT_COLLECTION = 'revision_content';
const ATTEMPTS_COLLECTION = 'revision_attempts';

// Revision sets are authored course content: one shared copy that every learner
// revises from. Attempts, by contrast, are personal and always carry a userId.
type ContentDocument = Omit<RevisionContent, 'createdAt'> & { createdAt: Date };

type AttemptDocument = Omit<RevisionAttempt, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'> & {
  _id?: ObjectId;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
};

type ProgressDocument = {
  userId: string;
  itemId: string;
  section: string;
  completed: boolean;
  completedAt: Date | null;
};

async function collections() {
  const { db } = await connectToDatabase();
  return {
    content: db.collection<ContentDocument>(CONTENT_COLLECTION),
    attempts: db.collection<AttemptDocument>(ATTEMPTS_COLLECTION),
    progress: db.collection<ProgressDocument>(PROGRESS_COLLECTION),
  };
}

interface CourseProgress {
  /** Completed checklist item ids, newest first. */
  itemIds: string[];
  /** The id completed most recently — used to locate where the learner is. */
  latestItemId: string | null;
}

const EMPTY_PROGRESS: CourseProgress = { itemIds: [], latestItemId: null };

async function getCourseProgress(
  userId: string | null,
  roadmapId: RevisionRoadmapId
): Promise<CourseProgress> {
  if (!userId) {
    return EMPTY_PROGRESS;
  }
  const { progress } = await collections();
  const docs = await progress
    .find(
      { userId, section: roadmapId, completed: true },
      { projection: { itemId: 1, completedAt: 1 } }
    )
    .sort({ completedAt: -1 })
    .toArray();

  return {
    itemIds: docs.map(doc => doc.itemId),
    latestItemId: docs.length > 0 ? docs[0].itemId : null,
  };
}

// Item ids look like `<phaseId>-<sectionId>-<topicId>-<index>`, and topic ids
// contain dashes of their own (`phase4-day33-vite-jsx-2`), so the segments
// cannot be recovered by splitting. Matching the known lecture prefix instead is
// exact and cannot be thrown off by how a topic happens to be named.
function lectureMatcher(progress: CourseProgress) {
  const studied = (lecture: { phaseId: string; sectionId: string }) => {
    const prefix = `${lecture.phaseId}-${lecture.sectionId}-`;
    return progress.itemIds.some(id => id.startsWith(prefix));
  };
  const isLatest = (lecture: { phaseId: string; sectionId: string }) =>
    progress.latestItemId !== null &&
    progress.latestItemId.startsWith(`${lecture.phaseId}-${lecture.sectionId}-`);
  return { studied, isLatest };
}

function serializeContent(doc: ContentDocument): RevisionContent {
  return { ...doc, createdAt: doc.createdAt.toISOString() };
}

function serializeAttempt(doc: AttemptDocument): RevisionAttempt {
  // userId is deliberately dropped: it is a storage concern and never needs to
  // travel to the client, which only ever sees its own attempts.
  const { _id, userId, createdAt, updatedAt, completedAt, ...rest } = doc;
  void userId;
  return {
    id: _id ? _id.toString() : '',
    ...rest,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    completedAt: completedAt ? completedAt.toISOString() : null,
  };
}

// ── Content (shared, read-only) ────────────────────────────────────────────

export async function getContent(
  roadmapId: RevisionRoadmapId,
  conceptId: string,
  targetId: string,
  version?: number
): Promise<RevisionContent | null> {
  const { content } = await collections();
  const query = { roadmapId, conceptId, targetId, ...(version ? { version } : {}) };
  const doc = await content.findOne(query, { sort: { version: -1 } });
  return doc ? serializeContent(doc) : null;
}

// Every stored version for a target, so history can replay attempts against the
// exact question set they were taken on.
export async function getAllContentVersions(
  roadmapId: RevisionRoadmapId,
  conceptId: string,
  targetId: string
): Promise<RevisionContent[]> {
  const { content } = await collections();
  const docs = await content.find({ roadmapId, conceptId, targetId }).sort({ version: 1 }).toArray();
  return docs.map(serializeContent);
}

// ── Attempts (per learner) ───────────────────────────────────────────────

/**
 * Attempts are always looked up by (userId, _id). Passing the id alone would
 * let anyone advance or grade someone else's attempt by guessing an ObjectId,
 * so the owner check is part of every query rather than a separate guard.
 */
export async function getAttemptById(userId: string, id: string): Promise<RevisionAttempt | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const { attempts } = await collections();
  const doc = await attempts.findOne({ _id: new ObjectId(id), userId });
  return doc ? serializeAttempt(doc) : null;
}

export async function listAttempts(
  userId: string | null,
  roadmapId: RevisionRoadmapId,
  conceptId: string,
  targetId: string
): Promise<RevisionAttempt[]> {
  if (!userId) {
    return [];
  }
  const { attempts } = await collections();
  const docs = await attempts
    .find({ userId, roadmapId, conceptId, targetId })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serializeAttempt);
}

// Reuse an unfinished attempt for the target/version if present, else start one.
// `forceNew` skips resuming so a redo always begins completely fresh.
export async function startOrResumeAttempt(input: {
  userId: string;
  roadmapId: RevisionRoadmapId;
  conceptId: string;
  targetId: string;
  kind: RevisionTargetKind;
  contentVersion: number;
  forceNew?: boolean;
}): Promise<RevisionAttempt> {
  const { attempts } = await collections();
  const scope = {
    userId: input.userId,
    roadmapId: input.roadmapId,
    conceptId: input.conceptId,
    targetId: input.targetId,
  };

  if (!input.forceNew) {
    const resumable = await attempts.findOne({
      ...scope,
      contentVersion: input.contentVersion,
      status: 'in_progress',
    });
    if (resumable) {
      return serializeAttempt(resumable);
    }
  }

  const attemptNumber = (await attempts.countDocuments(scope)) + 1;

  const now = new Date();
  const doc: AttemptDocument = {
    ...scope,
    kind: input.kind,
    attemptNumber,
    contentVersion: input.contentVersion,
    stages: {},
    score: 0,
    total: 0,
    percent: 0,
    status: 'in_progress',
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
  const result = await attempts.insertOne(doc);
  return serializeAttempt({ ...doc, _id: result.insertedId });
}

async function persistAttempt(
  userId: string,
  id: string,
  update: Partial<Pick<AttemptDocument, 'stages' | 'score' | 'total' | 'percent' | 'status' | 'completedAt'>>
): Promise<RevisionAttempt | null> {
  const { attempts } = await collections();
  await attempts.updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...update, updatedAt: new Date() } }
  );
  return getAttemptById(userId, id);
}

// Mark a reading/recall stage (recap or concepts) complete on an attempt.
export async function markReadingStage(
  userId: string,
  id: string,
  stage: 'recap' | 'concepts'
): Promise<RevisionAttempt | null> {
  const attempt = await getAttemptById(userId, id);
  if (!attempt) {
    return null;
  }
  const stages = { ...attempt.stages, [stage]: { completedAt: new Date().toISOString() } };
  return persistAttempt(userId, id, { stages });
}

// Record the graded quiz and complete the attempt.
export async function recordQuizStage(
  userId: string,
  id: string,
  result: QuizStageResult
): Promise<RevisionAttempt | null> {
  const attempt = await getAttemptById(userId, id);
  if (!attempt) {
    return null;
  }

  return persistAttempt(userId, id, {
    stages: { ...attempt.stages, quiz: result },
    score: result.score,
    total: result.total,
    percent: toPercent(result.score, result.total),
    status: 'completed',
    completedAt: new Date(),
  });
}

// ── Dashboard aggregation ────────────────────────────────────────────────

function summarizeTarget(
  targetId: string,
  title: string,
  kind: RevisionTargetKind,
  lectures: string[],
  attempts: RevisionAttempt[],
  hasContent: boolean,
  locked: boolean,
  lecturesLearned: number
): RevisionTargetSummary {
  const completed = attempts.filter(attempt => attempt.status === 'completed');
  const bestPercent = completed.length ? Math.max(...completed.map(attempt => attempt.percent)) : null;
  const hasInProgress = attempts.some(attempt => attempt.status === 'in_progress');
  // Most recent completion, so the dashboard can show how long ago this was
  // revised — spaced practice only helps if the learner can see the gap.
  const lastCompletedAt = completed.reduce<string | null>((latest, attempt) => {
    if (!attempt.completedAt) return latest;
    return !latest || attempt.completedAt > latest ? attempt.completedAt : latest;
  }, null);

  let status: RevisionTargetStatus;
  if (locked) {
    status = 'locked';
  } else if (bestPercent !== null) {
    status = 'done';
  } else if (hasInProgress) {
    status = 'in_progress';
  } else {
    status = 'not_started';
  }

  return {
    targetId,
    title,
    kind,
    lectureCount: lectures.length,
    lectures,
    bestPercent,
    attempts: attempts.length,
    hasContent,
    status,
    lastCompletedAt,
    lecturesLearned,
  };
}

export async function getConceptSummaries(
  userId: string | null,
  roadmapId: RevisionRoadmapId
): Promise<ConceptSummary[]> {
  const defs = getConceptDefs(roadmapId);
  if (defs.length === 0) {
    return [];
  }

  const { attempts, content } = await collections();
  const [allAttempts, contentDocs, courseProgress] = await Promise.all([
    userId ? attempts.find({ userId, roadmapId }).toArray() : Promise.resolve([]),
    content.find({ roadmapId }, { projection: { conceptId: 1, targetId: 1 } }).toArray(),
    getCourseProgress(userId, roadmapId),
  ]);

  const { studied, isLatest } = lectureMatcher(courseProgress);
  const learnedCount = (lectures: { phaseId: string; sectionId: string }[]) => lectures.filter(studied).length;

  const attemptsByTarget = new Map<string, RevisionAttempt[]>();
  for (const doc of allAttempts) {
    const key = `${doc.conceptId}/${doc.targetId}`;
    const list = attemptsByTarget.get(key) ?? [];
    list.push(serializeAttempt(doc));
    attemptsByTarget.set(key, list);
  }
  const targetsWithContent = new Set(contentDocs.map(doc => `${doc.conceptId}/${doc.targetId}`));

  const summaries: ConceptSummary[] = [];

  for (const def of defs) {
    const concept = resolveConcept(roadmapId, def.id);
    if (!concept) {
      continue;
    }

    const revisions = concept.revisions.map(revision =>
      summarizeTarget(
        revision.id,
        revision.title,
        'revision',
        revision.lectures.map(lecture => lecture.title),
        attemptsByTarget.get(`${def.id}/${revision.id}`) ?? [],
        targetsWithContent.has(`${def.id}/${revision.id}`),
        false,
        learnedCount(revision.lectures)
      )
    );

    // The concept-wide Final Practice unlocks once every revision is done.
    const allRevisionsDone = revisions.length > 0 && revisions.every(revision => revision.status === 'done');
    const final = summarizeTarget(
      FINAL_TARGET_ID,
      'Final Practice',
      'final',
      concept.finalLectures.map(lecture => lecture.title),
      attemptsByTarget.get(`${def.id}/${FINAL_TARGET_ID}`) ?? [],
      targetsWithContent.has(`${def.id}/${FINAL_TARGET_ID}`),
      !allRevisionsDone,
      learnedCount(concept.finalLectures)
    );

    const doneTargets = [...revisions, final].filter(target => target.bestPercent !== null);
    const conceptPercent = doneTargets.length
      ? Math.round(doneTargets.reduce((sum, target) => sum + (target.bestPercent ?? 0), 0) / doneTargets.length)
      : null;

    const everythingDone = allRevisionsDone && final.status === 'done';
    const anyStarted = [...revisions, final].some(
      target => target.status === 'in_progress' || target.status === 'done'
    );

    // "Current" is wherever the learner last ticked something off in the course,
    // so revision points at what they are actually studying rather than at day 1.
    const isCurrent = concept.finalLectures.some(isLatest);

    summaries.push({
      conceptId: def.id,
      title: concept.title,
      summary: concept.summary,
      isCurrent,
      revisions,
      final,
      conceptPercent,
      status: everythingDone ? 'done' : anyStarted ? 'in_progress' : 'not_started',
    });
  }

  return summaries;
}
