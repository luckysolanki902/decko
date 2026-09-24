#!/usr/bin/env node
/**
 * Copies authored revision sets from an earlier single-user database into the
 * public one, on the same connection string.
 *
 * Revision sets are course content, not personal data, so they are the only
 * thing worth carrying over — progress, attempts, quiz results and day logs all
 * belonged to one person and are deliberately left behind.
 *
 * Usage:
 *   MONGODB_URI=... node scripts/migrate-revision-content.mjs [--from learning_journey] [--to decko] [--dry-run]
 *
 * Safe to re-run: documents are matched on
 * (roadmapId, conceptId, targetId, version) and skipped if already present.
 */

import { MongoClient } from 'mongodb';

const args = process.argv.slice(2);

function flag(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback;
}

const URI = process.env.MONGODB_URI;
const FROM_DB = flag('from', 'learning_journey');
const TO_DB = flag('to', process.env.MONGODB_DB || 'decko');
const DRY_RUN = args.includes('--dry-run');

if (!URI) {
  console.error('MONGODB_URI is not set.');
  process.exit(1);
}

if (FROM_DB === TO_DB) {
  console.error(`Source and target database are both "${FROM_DB}". Nothing to do.`);
  process.exit(1);
}

const client = new MongoClient(URI);

try {
  await client.connect();

  const source = client.db(FROM_DB).collection('revision_content');
  const target = client.db(TO_DB).collection('revision_content');

  const docs = await source.find({}).toArray();
  console.log(`Found ${docs.length} revision set(s) in "${FROM_DB}".`);

  if (docs.length === 0) {
    console.log('Nothing to migrate.');
    process.exit(0);
  }

  await target.createIndex({ roadmapId: 1, conceptId: 1, targetId: 1, version: -1 });

  let copied = 0;
  let skipped = 0;

  for (const doc of docs) {
    const key = {
      roadmapId: doc.roadmapId,
      conceptId: doc.conceptId,
      targetId: doc.targetId,
      version: doc.version,
    };
    const label = `${key.roadmapId}/${key.conceptId}/${key.targetId} v${key.version}`;

    if (await target.findOne(key)) {
      skipped += 1;
      console.log(`  skip   ${label} (already present)`);
      continue;
    }

    if (DRY_RUN) {
      copied += 1;
      console.log(`  would copy ${label}`);
      continue;
    }

    // Drop _id so the target generates its own and a re-run can never collide
    // with an id that already exists there for unrelated content.
    const { _id, ...rest } = doc;
    void _id;
    await target.insertOne(rest);
    copied += 1;
    console.log(`  copy   ${label}`);
  }

  console.log(
    `\n${DRY_RUN ? 'Dry run — ' : ''}${copied} copied, ${skipped} already present. Target: "${TO_DB}".`
  );
} catch (error) {
  console.error('Migration failed:', error);
  process.exitCode = 1;
} finally {
  await client.close();
}
