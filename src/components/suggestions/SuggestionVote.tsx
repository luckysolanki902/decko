'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, ThumbsUp } from 'lucide-react';

import { SuggestionKind } from '@/lib/mongodb';
import { useSession } from '@/lib/useSession';

interface SuggestionVoteProps {
  kind: SuggestionKind;
  /** Stable key for the thing being voted on, e.g. `webd/phase4/day37`. */
  reference: string;
  /** Used as the request title if this is the first vote. */
  title: string;
  roadmapId?: string | null;
  label?: string;
  /** Vote totals for things that already have a request. */
  initialCount?: number;
  initialVoted?: boolean;
  compact?: boolean;
}

export function SuggestionVote({
  kind,
  reference,
  title,
  roadmapId = null,
  label = 'Vote',
  initialCount = 0,
  initialVoted = false,
  compact = false,
}: SuggestionVoteProps) {
  const { user } = useSession();
  const router = useRouter();

  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function vote() {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setBusy(true);
    setError('');

    // Optimistic, then reconciled with the server's authoritative count.
    const previous = { count, voted };
    setCount(value => value + (voted ? -1 : 1));
    setVoted(value => !value);

    try {
      const response = await fetch('/api/suggestions/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, reference, title, roadmapId }),
      });
      const data = await response.json();

      if (!data.success) {
        setCount(previous.count);
        setVoted(previous.voted);
        setError(data.error || 'Could not record the vote.');
        return;
      }

      setCount(data.voteCount);
      setVoted(data.hasVoted);
    } catch {
      setCount(previous.count);
      setVoted(previous.voted);
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={compact ? 'inline-flex items-center gap-2' : 'flex flex-col items-center gap-2'}>
      <button
        type="button"
        onClick={vote}
        disabled={busy}
        aria-pressed={voted}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          voted
            ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
            : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
        }`}
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : voted ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <ThumbsUp className="h-3.5 w-3.5" />
        )}
        {voted ? 'Voted' : label}
        <span className="tabular-nums opacity-70">{count}</span>
      </button>

      {error && <p className="text-xs text-[var(--accent-rose-text)]">{error}</p>}

      {!compact && !user && (
        <p className="text-xs text-[var(--text-tertiary)]">Sign in to vote.</p>
      )}
    </div>
  );
}
