import 'server-only';

import { ScryptOptions, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

// promisify() resolves to scrypt's 3-argument overload and drops the options
// parameter, so the wrapper is written out by hand to keep `options` typed.
function scrypt(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keylen, options, (error, derivedKey) => {
      if (error) {
        reject(error);
      } else {
        resolve(derivedKey);
      }
    });
  });
}

// scrypt is in the Node standard library, so password hashing adds no
// dependency and no native build step. These are the OWASP-recommended
// minimums: cost 2^15, block size 8, parallelism 1.
const COST = 32768;
const BLOCK_SIZE = 8;
const PARALLELISATION = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

// scrypt's memory use is roughly 128 * COST * BLOCK_SIZE bytes (~32 MB here).
// Node's default maxmem is 32 MB, which this exceeds, so raise it explicitly.
const MAX_MEM = 64 * 1024 * 1024;

/**
 * Hashes are stored self-describing, so the cost parameters can be raised later
 * without invalidating existing accounts:
 *
 *   scrypt$32768$8$1$<salt-base64>$<hash-base64>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELISATION,
    maxmem: MAX_MEM,
  });

  return [
    'scrypt',
    COST,
    BLOCK_SIZE,
    PARALLELISATION,
    salt.toString('base64'),
    derived.toString('base64'),
  ].join('$');
}

/**
 * Verifies a password against a stored hash in constant time.
 *
 * Returns false rather than throwing on a malformed hash, so a corrupted row
 * fails the login instead of returning a 500 that would confirm the account
 * exists.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, costRaw, blockRaw, parallelRaw, saltRaw, hashRaw] = parts;
  const cost = Number(costRaw);
  const blockSize = Number(blockRaw);
  const parallelisation = Number(parallelRaw);

  if (!Number.isInteger(cost) || !Number.isInteger(blockSize) || !Number.isInteger(parallelisation)) {
    return false;
  }

  let expected: Buffer;
  let actual: Buffer;
  try {
    expected = Buffer.from(hashRaw, 'base64');
    actual = await scrypt(password.normalize('NFKC'), Buffer.from(saltRaw, 'base64'), expected.length, {
      N: cost,
      r: blockSize,
      p: parallelisation,
      maxmem: MAX_MEM,
    });
  } catch {
    return false;
  }

  if (expected.length !== actual.length) {
    return false;
  }
  return timingSafeEqual(expected, actual);
}

/**
 * A dummy verification used when no account matches the submitted username.
 *
 * Without it, a missing user would return far faster than a wrong password,
 * letting an attacker enumerate valid usernames by timing alone.
 */
export async function fakeVerify(password: string): Promise<void> {
  await scrypt(password.normalize('NFKC'), randomBytes(SALT_LENGTH), KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELISATION,
    maxmem: MAX_MEM,
  });
}
