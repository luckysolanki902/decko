import { SignJWT, jwtVerify } from 'jose';

// Kept free of `next/headers` and `node:crypto` so it can be imported from
// middleware (edge runtime) as well as from route handlers (node runtime).

export const COOKIE_NAME = 'decko_session';
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
const TOKEN_EXPIRY = '30d';

export interface SessionPayload {
  userId: string;
  username: string;
  displayName: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret());
}

/** Returns the session payload, or null when the token is absent/invalid/expired. */
export async function readSessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const { userId, username, displayName } = payload as Record<string, unknown>;
    if (typeof userId !== 'string' || typeof username !== 'string') {
      return null;
    }
    return {
      userId,
      username,
      displayName: typeof displayName === 'string' ? displayName : username,
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_MAX_AGE_SECONDS,
  path: '/',
} as const;
