import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { RoadmapSection } from '@/types';

const MONGODB_URI = process.env.MONGODB_URI || '';

// The public platform uses its own database, separate from any earlier
// single-user deployment that may share the same cluster. Override with
// MONGODB_DB when running a staging copy against the same connection string.
const MONGODB_DB = process.env.MONGODB_DB || 'decko';

if (!MONGODB_URI) {
  console.warn('Warning: MONGODB_URI environment variable is not set');
}

// Cached across lambda invocations so we do not open a new pool per request.
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let indexesReady: Promise<void> | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  // Fire-and-forget: indexes are created once per cold start. Failures are
  // logged rather than thrown so a missing index never takes the site down.
  indexesReady ??= ensureIndexes(db).catch(error => {
    console.error('Failed to ensure indexes:', error);
  });

  return { client, db };
}

// Every per-user collection is queried by (userId, ...) so each index leads
// with userId. Unique indexes double as the concurrency guard for upserts.
async function ensureIndexes(db: Db): Promise<void> {
  await Promise.all([
    db.collection('users').createIndex({ username: 1 }, { unique: true }),
    db.collection('progress').createIndex({ userId: 1, section: 1, itemId: 1 }, { unique: true }),
    db.collection('progress').createIndex({ userId: 1, completed: 1 }),
    db.collection('project_status').createIndex({ userId: 1, section: 1, projectId: 1 }, { unique: true }),
    db.collection('quiz_results').createIndex({ userId: 1, section: 1, phaseId: 1 }, { unique: true }),
    db.collection('trackers').createIndex({ userId: 1, order: 1 }),
    db.collection('tracker_logs').createIndex({ userId: 1, trackerId: 1, date: 1 }, { unique: true }),
    db.collection('revision_attempts').createIndex({ userId: 1, roadmapId: 1, conceptId: 1, targetId: 1 }),
    db.collection('revision_content').createIndex({ roadmapId: 1, conceptId: 1, targetId: 1, version: -1 }),
    db.collection('suggestions').createIndex({ status: 1, voteCount: -1 }),
    db.collection('suggestions').createIndex({ roadmapId: 1, status: 1 }),
    db.collection('votes').createIndex({ userId: 1, suggestionId: 1 }, { unique: true }),
    db.collection('votes').createIndex({ suggestionId: 1 }),
  ]);
}

export async function getCollection<T extends object>(name: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(name);
}

// ── Stored document shapes ────────────────────────────────────────────────

export interface UserRecord {
  _id?: ObjectId;
  /** Lowercased, used for lookup and uniqueness. */
  username: string;
  /** Exactly as the learner typed it, for display. */
  displayName: string;
  /** Self-describing hash string; see lib/password.ts. Never leaves the server. */
  passwordHash: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface ProgressRecord {
  userId: string;
  itemId: string;
  section: RoadmapSection;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'active' | 'completed' | 'ignored';

export interface ProjectStatusRecord {
  userId: string;
  projectId: string;
  section: RoadmapSection;
  status: ProjectStatus;
  completedAt: Date | null;
  ignoredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** One learner-defined habit tracker. Capped at MAX_TRACKERS per account. */
export interface TrackerRecord {
  _id?: ObjectId;
  userId: string;
  name: string;
  /** Accent key from TRACKER_COLORS, not a raw CSS value. */
  color: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/** One day's entry for one tracker. `done: null` means "not answered yet". */
export interface TrackerLogRecord {
  userId: string;
  trackerId: string;
  /** Local calendar day, YYYY-MM-DD. */
  date: string;
  done: boolean;
  /** What was studied, when done. */
  note: string;
  /** Why it was missed, when not done. */
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SuggestionKind = 'lecture' | 'section' | 'course' | 'correction';
export type SuggestionStatus = 'open' | 'planned' | 'in_progress' | 'published' | 'declined';

/** A learner request that the community votes on. Replaces on-demand generation. */
export interface SuggestionRecord {
  _id?: ObjectId;
  kind: SuggestionKind;
  title: string;
  body: string;
  /** Optional roadmap this relates to, e.g. 'webd'. Null for new-course ideas. */
  roadmapId: string | null;
  /** Optional deep link, e.g. a lecture slug the correction applies to. */
  reference: string | null;
  status: SuggestionStatus;
  /** Denormalised count of votes, kept in step with the votes collection. */
  voteCount: number;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteRecord {
  userId: string;
  suggestionId: string;
  createdAt: Date;
}
