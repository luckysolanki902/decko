'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Loader2, Plus, ThumbsUp } from 'lucide-react';

import { SuggestionKind, SuggestionStatus } from '@/lib/mongodb';
import { useSession } from '@/lib/useSession';

interface Suggestion {
  id: string;
  kind: SuggestionKind;
  title: string;
  body: string;
  roadmapId: string | null;
  status: SuggestionStatus;
  voteCount: number;
  createdByName: string;
  createdAt: string;
  hasVoted: boolean;
}

const KIND_LABELS: Record<SuggestionKind, string> = {
  lecture: 'Lecture',
  section: 'Section',
  course: 'Course',
  correction: 'Correction',
};

const STATUS_LABELS: Record<SuggestionStatus, string> = {
  open: 'Open',
  planned: 'Planned',
  in_progress: 'Being written',
  published: 'Published',
  declined: 'Not planned',
};

const STATUS_STYLES: Record<SuggestionStatus, string> = {
  open: 'border-[var(--border)] text-[var(--text-tertiary)]',
  planned: 'border-[var(--accent-blue)] text-[var(--accent-blue-text)]',
  in_progress: 'border-[var(--accent-rose)] text-[var(--accent-rose-text)]',
  published: 'border-[var(--success)] text-[var(--success)]',
  declined: 'border-[var(--border)] text-[var(--text-muted)]',
};

const ROADMAPS = [
  { id: '', label: 'Any course' },
  { id: 'webd', label: 'Web Development' },
  { id: 'daml', label: 'Python & Data Analytics' },
  { id: 'ml', label: 'ML & GenAI' },
  { id: 'dsa', label: 'DSA with C++' },
  { id: 'go', label: 'Go Engineering' },
  { id: 'reactnative', label: 'React Native' },
];

export function RequestsBoard() {
  const { user } = useSession();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SuggestionKind | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/suggestions', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (filter === 'all' ? suggestions : suggestions.filter(item => item.kind === filter)),
    [suggestions, filter]
  );

  async function toggleVote(suggestion: Suggestion) {
    if (!user) {
      window.location.href = '/login?next=/requests';
      return;
    }

    // Optimistic; reconciled from the response.
    setSuggestions(prev =>
      prev.map(item =>
        item.id === suggestion.id
          ? { ...item, hasVoted: !item.hasVoted, voteCount: item.voteCount + (item.hasVoted ? -1 : 1) }
          : item
      )
    );

    const response = await fetch('/api/suggestions/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestionId: suggestion.id }),
    });
    const data = await response.json();

    setSuggestions(prev =>
      prev.map(item =>
        item.id === suggestion.id
          ? data.success
            ? { ...item, hasVoted: data.hasVoted, voteCount: data.voteCount }
            : suggestion
          : item
      )
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'lecture', 'section', 'course', 'correction'] as const).map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === value
                  ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              {value === 'all' ? 'Everything' : KIND_LABELS[value]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setFormOpen(value => !value)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          Request something
        </button>
      </div>

      {formOpen && (
        <NewRequestForm
          onClose={() => setFormOpen(false)}
          onCreated={suggestion => {
            setSuggestions(prev => [suggestion, ...prev]);
            setFormOpen(false);
          }}
        />
      )}

      {loading ? (
        <p className="flex items-center gap-2 py-12 text-sm text-[var(--text-tertiary)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading requests…
        </p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-14 text-center">
          <p className="text-sm text-[var(--text-secondary)]">Nothing here yet.</p>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Be the first to say what should be written next.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map(suggestion => (
            <li
              key={suggestion.id}
              className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
            >
              <button
                type="button"
                onClick={() => toggleVote(suggestion)}
                aria-pressed={suggestion.hasVoted}
                aria-label={suggestion.hasVoted ? 'Remove your vote' : 'Vote for this'}
                className={`flex h-14 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors ${
                  suggestion.hasVoted
                    ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                {suggestion.hasVoted ? <Check className="h-3.5 w-3.5" /> : <ThumbsUp className="h-3.5 w-3.5" />}
                <span className="text-sm font-semibold tabular-nums">{suggestion.voteCount}</span>
              </button>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
                    {KIND_LABELS[suggestion.kind]}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                      STATUS_STYLES[suggestion.status]
                    }`}
                  >
                    {STATUS_LABELS[suggestion.status]}
                  </span>
                  {suggestion.roadmapId && (
                    <span className="text-[11px] text-[var(--text-tertiary)]">
                      {ROADMAPS.find(item => item.id === suggestion.roadmapId)?.label ?? suggestion.roadmapId}
                    </span>
                  )}
                </div>

                <h3 className="text-[15px] font-medium leading-snug text-[var(--text-primary)]">
                  {suggestion.title}
                </h3>

                {suggestion.body && (
                  <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
                    {suggestion.body}
                  </p>
                )}

                <p className="mt-2.5 text-[11px] text-[var(--text-muted)]">
                  {suggestion.createdByName} · {new Date(suggestion.createdAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!user && !loading && (
        <p className="mt-8 text-center text-sm text-[var(--text-tertiary)]">
          <Link href="/login?next=/requests" className="underline underline-offset-4">
            Sign in
          </Link>{' '}
          to vote or add a request.
        </p>
      )}
    </div>
  );
}

function NewRequestForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (suggestion: Suggestion) => void;
}) {
  const { user } = useSession();
  const [kind, setKind] = useState<SuggestionKind>('lecture');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [roadmapId, setRoadmapId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      window.location.href = '/login?next=/requests';
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, title, body, roadmapId: roadmapId || null }),
      });
      const data = await response.json();

      if (data.success) {
        onCreated(data.suggestion);
      } else {
        setError(data.error || 'Could not save that.');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setSaving(false);
    }
  }

  const fieldClass =
    'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3.5 py-2.5 text-sm ' +
    'text-[var(--text-primary)] transition-colors focus:border-transparent focus:outline-none ' +
    'focus:ring-2 focus:ring-[var(--accent-blue)]';

  return (
    <form
      onSubmit={submit}
      className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kind" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            What is this about?
          </label>
          <select
            id="kind"
            value={kind}
            onChange={event => setKind(event.target.value as SuggestionKind)}
            className={fieldClass}
          >
            <option value="lecture">A lecture I want written</option>
            <option value="section">A section or revision set</option>
            <option value="course">A whole new course</option>
            <option value="correction">A correction or note</option>
          </select>
        </div>

        <div>
          <label htmlFor="roadmapId" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Course
          </label>
          <select
            id="roadmapId"
            value={roadmapId}
            onChange={event => setRoadmapId(event.target.value)}
            className={fieldClass}
          >
            {ROADMAPS.map(roadmap => (
              <option key={roadmap.id} value={roadmap.id}>
                {roadmap.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="e.g. A lecture on WebSockets, from scratch"
          maxLength={140}
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="body" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
          Details <span className="font-normal text-[var(--text-tertiary)]">(optional)</span>
        </label>
        <textarea
          id="body"
          value={body}
          onChange={event => setBody(event.target.value)}
          placeholder="What should it cover? What tripped you up? If this is a correction, which lecture and what is wrong?"
          rows={4}
          maxLength={2000}
          className={`${fieldClass} resize-y`}
        />
      </div>

      {error && <p className="text-sm text-[var(--accent-rose-text)]">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? 'Saving…' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
