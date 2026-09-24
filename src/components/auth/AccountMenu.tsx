'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';

import { useSession } from '@/lib/useSession';

export function AccountMenu() {
  const { user, isLoading, signOut } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  // Reserve the space while loading so the header does not jump.
  if (isLoading) {
    return <div className="h-9 w-24" aria-hidden />;
  }

  if (!user) {
    // One entry point: /login handles both signing in and creating an account.
    return (
      <Link
        href="/login"
        className="rounded-full bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] py-1.5 pl-2 pr-3 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-xs font-semibold uppercase">
          {user.displayName.slice(0, 1)}
        </span>
        <span className="max-w-[10ch] truncate">{user.displayName}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1.5 shadow-md"
        >
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            <User className="h-3.5 w-3.5" />
            Your account
          </Link>
          <Link
            href="/account#password"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            <Settings className="h-3.5 w-3.5" />
            Change password
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
