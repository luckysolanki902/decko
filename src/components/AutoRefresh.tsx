'use client';

import { useEffect, useRef } from 'react';

const POLL_INTERVAL_MS = 45_000; // 45 seconds

function isUserTyping(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    (el as HTMLElement).isContentEditable
  );
}

export default function AutoRefresh() {
  const initialBuildId = useRef<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    async function fetchBuildId(): Promise<string | null> {
      try {
        const res = await fetch('/api/version', { cache: 'no-store' });
        if (!res.ok) return null;
        const { buildId } = await res.json();
        return buildId as string;
      } catch {
        return null;
      }
    }

    async function init() {
      const id = await fetchBuildId();
      if (!id) return;
      initialBuildId.current = id;

      timer = setInterval(async () => {
        const latest = await fetchBuildId();
        if (!latest || !initialBuildId.current) return;
        if (latest !== initialBuildId.current) {
          // New deployment is live. Wait for a safe moment to reload.
          const reload = () => {
            if (!isUserTyping()) {
              window.location.reload();
            } else {
              // Retry in 10 s if the user is still typing
              setTimeout(reload, 10_000);
            }
          };
          reload();
        }
      }, POLL_INTERVAL_MS);
    }

    init();
    return () => clearInterval(timer);
  }, []);

  return null;
}
