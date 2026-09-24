import 'server-only';

import { ObjectId } from 'mongodb';

import { UserRecord, getCollection } from '@/lib/mongodb';
import { hashPassword, verifyPassword, fakeVerify } from '@/lib/password';
import { normaliseUsername } from '@/lib/auth';

export interface PublicUser {
  userId: string;
  username: string;
  displayName: string;
  createdAt: string;
}

function toPublicUser(record: UserRecord): PublicUser {
  return {
    userId: String(record._id),
    username: record.username,
    displayName: record.displayName,
    createdAt: record.createdAt.toISOString(),
  };
}

export type CreateUserResult =
  | { ok: true; user: PublicUser }
  | { ok: false; error: string };

export async function createUser(rawUsername: string, password: string): Promise<CreateUserResult> {
  const username = normaliseUsername(rawUsername);
  const users = await getCollection<UserRecord>('users');

  // Check first for a friendly message, but treat the unique index as the real
  // guard — two simultaneous signups would both pass this check.
  if (await users.findOne({ username })) {
    return { ok: false, error: 'That username is taken.' };
  }

  const now = new Date();
  const record: UserRecord = {
    username,
    displayName: rawUsername.trim(),
    passwordHash: await hashPassword(password),
    createdAt: now,
    lastLoginAt: null,
  };

  try {
    const result = await users.insertOne(record);
    return { ok: true, user: toPublicUser({ ...record, _id: result.insertedId }) };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return { ok: false, error: 'That username is taken.' };
    }
    throw error;
  }
}

/**
 * The three ways a sign-in attempt can end.
 *
 * `no_account` is reported separately so one entry point can serve both signing
 * in and signing up: the form offers to create the account instead of failing.
 */
export type AuthResult =
  | { outcome: 'ok'; user: PublicUser }
  | { outcome: 'wrong_password' }
  | { outcome: 'no_account' };

export async function authenticate(rawUsername: string, password: string): Promise<AuthResult> {
  const username = normaliseUsername(rawUsername);
  const users = await getCollection<UserRecord>('users');
  const record = await users.findOne({ username });

  if (!record) {
    // Still derive a hash before answering. The unified flow means the response
    // already discloses whether the account exists, but keeping the timing flat
    // stops the endpoint leaking anything *beyond* that — in particular it does
    // not become a fast oracle for bulk-testing username lists.
    await fakeVerify(password);
    return { outcome: 'no_account' };
  }

  if (!(await verifyPassword(password, record.passwordHash))) {
    return { outcome: 'wrong_password' };
  }

  await users.updateOne({ _id: record._id }, { $set: { lastLoginAt: new Date() } });
  return { outcome: 'ok', user: toPublicUser(record) };
}

export async function findUserById(userId: string): Promise<PublicUser | null> {
  if (!ObjectId.isValid(userId)) {
    return null;
  }
  const users = await getCollection<UserRecord>('users');
  const record = await users.findOne({ _id: new ObjectId(userId) });
  return record ? toPublicUser(record) : null;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  nextPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(userId)) {
    return { ok: false, error: 'Account not found.' };
  }
  const users = await getCollection<UserRecord>('users');
  const record = await users.findOne({ _id: new ObjectId(userId) });
  if (!record) {
    return { ok: false, error: 'Account not found.' };
  }
  if (!(await verifyPassword(currentPassword, record.passwordHash))) {
    return { ok: false, error: 'Your current password is incorrect.' };
  }
  await users.updateOne(
    { _id: record._id },
    { $set: { passwordHash: await hashPassword(nextPassword) } }
  );
  return { ok: true };
}
