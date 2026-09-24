'use client';

import { LogOut } from 'lucide-react';

import { useSession } from '@/lib/useSession';

export function SignOutButton() {
  const { signOut } = useSession();

  return (
    <button
      type="button"
      onClick={signOut}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
