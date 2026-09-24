'use client';

import { useCallback, useEffect, useState } from 'react';

export interface SessionUser {
  userId: string;
  username: string;
  displayName: string;
}

// One in-flight request and one cached answer shared by every component on the
// page, so a header, a checkbox and a vote button do not each hit the endpoint.
let cachedUser: SessionUser | null | undefined;
let inFlight: Promise<SessionUser | null> | null = null;

const listeners = new Set<(user: SessionUser | null) => void>();

async function loadSession(): Promise<SessionUser | null> {
  try {
    const response = await fetch('/api/auth/session', { cache: 'no-store' });
    const data = await response.json();
    return (data.user as SessionUser | null) ?? null;
  } catch {
    return null;
  }
}

function fetchSession(): Promise<SessionUser | null> {
  if (cachedUser !== undefined) {
    return Promise.resolve(cachedUser);
  }
  inFlight ??= loadSession().then(user => {
    cachedUser = user;
    inFlight = null;
    listeners.forEach(listener => listener(user));
    return user;
  });
  return inFlight;
}

/** Drops the cache so the next read re-checks the cookie (after login/logout). */
export function invalidateSession(): void {
  cachedUser = undefined;
  inFlight = null;
}

export function useSession(): { user: SessionUser | null; isLoading: boolean; signOut: () => Promise<void> } {
  const [user, setUser] = useState<SessionUser | null>(cachedUser ?? null);
  const [isLoading, setIsLoading] = useState(cachedUser === undefined);

  useEffect(() => {
    let active = true;
    listeners.add(setUser);

    fetchSession().then(result => {
      if (active) {
        setUser(result);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
      listeners.delete(setUser);
    };
  }, []);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    invalidateSession();
    cachedUser = null;
    listeners.forEach(listener => listener(null));
    window.location.href = '/';
  }, []);

  return { user, isLoading, signOut };
}
