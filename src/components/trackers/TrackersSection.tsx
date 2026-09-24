'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight, Loader2, Plus, Settings2, Trash2, X } from 'lucide-react';

import { useSession } from '@/lib/useSession';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tracker {
  id: string;
  name: string;
  color: ColorKey;
  order: number;
}

interface DayLog {
  done: boolean;
  note: string;
  reason: string;
}

/** Keyed `${trackerId}:${date}` so one flat map serves every tracker. */
type LogsMap = Record<string, DayLog>;

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const MAX_TRACKERS = 10;

const COLOR_KEYS = ['slate', 'blue', 'green', 'amber', 'rose', 'violet', 'teal', 'orange'] as const;
type ColorKey = (typeof COLOR_KEYS)[number];

// Each accent is a plain hex pair so the calendar reads correctly in both
// themes without depending on Tailwind's dynamic class generation.
const COLORS: Record<ColorKey, { light: string; dark: string }> = {
  slate: { light: '#64748B', dark: '#94A3B8' },
  blue: { light: '#6889A6', dark: '#8AAAC4' },
  green: { light: '#5D8E72', dark: '#7AAE8E' },
  amber: { light: '#C08A3E', dark: '#D8AE6A' },
  rose: { light: '#B87D6C', dark: '#D4A090' },
  violet: { light: '#7C6BA8', dark: '#A796CE' },
  teal: { light: '#4E8C8A', dark: '#78B2B0' },
  orange: { light: '#C2703F', dark: '#E0996B' },
};

// ─── Calendar helpers ────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDateStr(value: string): Date {
  // Parsed as a local date; `new Date('2026-01-05')` would be UTC and can land
  // on the previous day for anyone west of Greenwich.
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function friendlyDate(value: string) {
  return parseDateStr(value).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function logKey(trackerId: string, date: string) {
  return `${trackerId}:${date}`;
}

/** Current run of consecutive completed days ending today (or yesterday). */
function currentStreak(trackerId: string, logs: LogsMap): number {
  let streak = 0;
  const cursor = new Date();

  // A day that has not happened yet should not break the run, so if today is
  // unanswered we start counting from yesterday instead.
  const todayKey = logKey(trackerId, toDateStr(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()));
  if (!logs[todayKey]?.done) {
    cursor.setDate(cursor.getDate() - 1);
  }

  for (let guard = 0; guard < 400; guard += 1) {
    const key = logKey(trackerId, toDateStr(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()));
    if (!logs[key]?.done) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TrackersSection() {
  const { user, isLoading: sessionLoading } = useSession();

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [logs, setLogs] = useState<LogsMap>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [calMonth, setCalMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [done, setDone] = useState<boolean | null>(null);
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const [addOpen, setAddOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = useMemo(() => trackers.find(t => t.id === activeId) ?? null, [trackers, activeId]);

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/trackers', { cache: 'no-store' });
      const data = await response.json();
      if (!data.success) return;

      setTrackers(data.trackers);
      const map: LogsMap = {};
      for (const entry of data.logs as (DayLog & { trackerId: string; date: string })[]) {
        map[logKey(entry.trackerId, entry.date)] = {
          done: entry.done,
          note: entry.note,
          reason: entry.reason,
        };
      }
      setLogs(map);
      setActiveId(prev => prev ?? (data.trackers[0]?.id ?? null));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      load();
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [user, sessionLoading, load]);

  // Seed the editor whenever the selected day or tracker changes.
  useEffect(() => {
    if (!activeId) return;
    const entry = logs[logKey(activeId, selectedDate)];
    setDone(entry ? entry.done : null);
    setNote(entry?.note ?? '');
    setReason(entry?.reason ?? '');
    setSaveStatus('idle');
  }, [activeId, selectedDate, logs]);

  useEffect(() => () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  // ── Mutations ─────────────────────────────────────────────────────────────
  async function saveEntry(nextDone: boolean, nextNote: string, nextReason: string) {
    if (!activeId) return;

    setSaveStatus('saving');
    // Optimistic so the calendar cell fills in immediately.
    setLogs(prev => ({
      ...prev,
      [logKey(activeId, selectedDate)]: { done: nextDone, note: nextNote, reason: nextReason },
    }));

    try {
      const response = await fetch('/api/trackers/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackerId: activeId,
          date: selectedDate,
          done: nextDone,
          note: nextNote,
          reason: nextReason,
        }),
      });
      const data = await response.json();

      setSaveStatus(data.success ? 'saved' : 'error');
      if (data.success) {
        savedTimer.current = setTimeout(() => setSaveStatus('idle'), 1800);
      }
    } catch {
      setSaveStatus('error');
    }
  }

  async function addTracker(name: string, color: ColorKey) {
    const response = await fetch('/api/trackers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
    const data = await response.json();
    if (data.success) {
      setTrackers(prev => [...prev, data.tracker]);
      setActiveId(data.tracker.id);
      setAddOpen(false);
      return null;
    }
    return data.error as string;
  }

  async function removeTracker(id: string) {
    await fetch(`/api/trackers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    setTrackers(prev => {
      const next = prev.filter(tracker => tracker.id !== id);
      setActiveId(current => (current === id ? next[0]?.id ?? null : current));
      return next;
    });
    setLogs(prev => {
      const next: LogsMap = {};
      for (const [key, value] of Object.entries(prev)) {
        if (!key.startsWith(`${id}:`)) next[key] = value;
      }
      return next;
    });
  }

  async function renameTracker(id: string, name: string, color: ColorKey) {
    setTrackers(prev => prev.map(t => (t.id === id ? { ...t, name, color } : t)));
    await fetch('/api/trackers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, color }),
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (sessionLoading || loading) {
    return (
      <Section>
        <p className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      </Section>
    );
  }

  if (!user) {
    return (
      <Section>
        <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center">
          <h3 className="text-base font-medium text-[var(--text-primary)]">Track anything, daily</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Keep up to {MAX_TRACKERS} streaks — one per habit you care about. Practice, revision, a side project,
            anything. Showing up beats intensity, and a visible run of days is what keeps people showing up.
          </p>
          <Link
            href="/login?next=/"
            className="mt-5 inline-block rounded-full bg-[var(--text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90"
          >
            Sign in to start
          </Link>
        </div>
      </Section>
    );
  }

  if (trackers.length === 0) {
    return (
      <Section>
        <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center">
          <h3 className="text-base font-medium text-[var(--text-primary)]">No trackers yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Make one for whatever you are building a habit around — daily DSA, Python practice, revision, reading.
            You can keep up to {MAX_TRACKERS}.
          </p>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> New tracker
          </button>
        </div>
        {addOpen && <AddTrackerModal onClose={() => setAddOpen(false)} onAdd={addTracker} />}
      </Section>
    );
  }

  const accent = active ? COLORS[active.color] : COLORS.slate;
  const streak = active ? currentStreak(active.id, logs) : 0;

  // Calendar grid for the visible month.
  const firstWeekday = new Date(calMonth.year, calMonth.month, 1).getDay();
  const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toDateStr(calMonth.year, calMonth.month, i + 1)),
  ];

  function shiftMonth(delta: number) {
    setCalMonth(prev => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  return (
    <Section>
      {/* Tracker switcher */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {trackers.map(tracker => {
          const isActive = tracker.id === activeId;
          const color = COLORS[tracker.color];
          return (
            <button
              key={tracker.id}
              type="button"
              onClick={() => setActiveId(tracker.id)}
              style={isActive ? { borderColor: color.light, color: color.light } : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'font-medium'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              {tracker.name}
            </button>
          );
        })}

        {trackers.length < MAX_TRACKERS && (
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            aria-label="Add a tracker"
            className="rounded-full border border-dashed border-[var(--border)] p-2 text-[var(--text-tertiary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setManageOpen(true)}
          aria-label="Manage trackers"
          className="ml-auto rounded-full border border-[var(--border)] p-2 text-[var(--text-tertiary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
        >
          <Settings2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        {/* Calendar */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {MONTH_NAMES[calMonth.month]} {calMonth.year}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="text-center text-[10px] font-medium uppercase text-[var(--text-muted)]"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, index) => {
              if (!date) return <span key={`pad-${index}`} />;

              const entry = activeId ? logs[logKey(activeId, date)] : undefined;
              const isSelected = date === selectedDate;
              const isToday = date === todayStr;
              const isFuture = date > todayStr;

              return (
                <button
                  key={date}
                  type="button"
                  disabled={isFuture}
                  onClick={() => setSelectedDate(date)}
                  style={
                    entry?.done
                      ? { background: accent.light, color: '#FFFFFF', borderColor: accent.light }
                      : isSelected
                        ? { borderColor: accent.light }
                        : undefined
                  }
                  className={`relative aspect-square rounded-lg border text-xs tabular-nums transition-colors ${
                    entry?.done
                      ? 'font-semibold'
                      : entry && !entry.done
                        ? 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] line-through'
                        : isFuture
                          ? 'cursor-not-allowed border-transparent text-[var(--text-muted)] opacity-40'
                          : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  {parseDateStr(date).getDate()}
                  {isToday && !entry?.done && (
                    <span
                      className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                      style={{ background: accent.light }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-4 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-tertiary)]">
            {streak > 0 ? (
              <>
                <span className="font-semibold text-[var(--text-primary)]">{streak}</span> day
                {streak === 1 ? '' : 's'} in a row
              </>
            ) : (
              'No run going — today is a good day to start one.'
            )}
          </p>
        </div>

        {/* Day editor */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-medium text-[var(--text-primary)]">{friendlyDate(selectedDate)}</h3>
            {saveStatus === 'saving' && <span className="text-xs text-[var(--text-tertiary)]">Saving…</span>}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-xs text-[var(--success)]">
                <Check className="h-3 w-3" /> Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-[var(--accent-rose-text)]">Could not save</span>
            )}
          </div>

          <p className="mb-3 text-sm text-[var(--text-secondary)]">
            Did you do <span className="font-medium text-[var(--text-primary)]">{active?.name}</span>?
          </p>

          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDone(true);
                saveEntry(true, note, '');
              }}
              style={done === true ? { background: accent.light, borderColor: accent.light } : undefined}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                done === true
                  ? 'font-medium text-white'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                setDone(false);
                saveEntry(false, '', reason);
              }}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                done === false
                  ? 'border-[var(--text-primary)] bg-[var(--text-primary)] font-medium text-[var(--bg-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              Not today
            </button>
          </div>

          {done !== null && (
            <div>
              <label
                htmlFor="entry-detail"
                className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
              >
                {done ? 'What did you cover?' : 'What got in the way?'}
              </label>
              <textarea
                id="entry-detail"
                value={done ? note : reason}
                onChange={event => (done ? setNote(event.target.value) : setReason(event.target.value))}
                onBlur={() => saveEntry(done, done ? note : '', done ? '' : reason)}
                rows={3}
                maxLength={500}
                placeholder={done ? 'Two pointers, sliding window…' : 'Travelling, unwell, ran out of time…'}
                className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
              />
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                Saves when you click away. Writing the reason down is what stops one skipped day becoming five.
              </p>
            </div>
          )}
        </div>
      </div>

      {addOpen && <AddTrackerModal onClose={() => setAddOpen(false)} onAdd={addTracker} />}
      {manageOpen && (
        <ManageTrackersModal
          trackers={trackers}
          onClose={() => setManageOpen(false)}
          onRename={renameTracker}
          onDelete={removeTracker}
        />
      )}
    </Section>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="pb-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Your trackers</h2>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            One row per habit. Mark the day, keep the run alive.
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

function ColorPicker({ value, onChange }: { value: ColorKey; onChange: (color: ColorKey) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_KEYS.map(key => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-label={key}
          aria-pressed={value === key}
          style={{ background: COLORS[key].light }}
          className={`h-7 w-7 rounded-full transition-transform ${
            value === key ? 'ring-2 ring-[var(--text-primary)] ring-offset-2 ring-offset-[var(--bg-secondary)]' : ''
          }`}
        />
      ))}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
        onClick={event => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-medium text-[var(--text-primary)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AddTrackerModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string, color: ColorKey) => Promise<string | null>;
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<ColorKey>('blue');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const failure = await onAdd(name, color);
    if (failure) {
      setError(failure);
      setSaving(false);
    }
  }

  return (
    <Modal title="New tracker" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="tracker-name" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Name
          </label>
          <input
            id="tracker-name"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="DSA practice"
            maxLength={32}
            autoFocus
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
          />
        </div>

        <div>
          <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">Colour</span>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        {error && <p className="text-sm text-[var(--accent-rose-text)]">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[var(--text-primary)] py-2.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Creating…' : 'Create tracker'}
        </button>
      </form>
    </Modal>
  );
}

function ManageTrackersModal({
  trackers,
  onClose,
  onRename,
  onDelete,
}: {
  trackers: Tracker[];
  onClose: () => void;
  onRename: (id: string, name: string, color: ColorKey) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <Modal title="Manage trackers" onClose={onClose}>
      <ul className="space-y-3">
        {trackers.map(tracker => (
          <li key={tracker.id} className="rounded-xl border border-[var(--border)] p-3">
            <div className="flex items-center gap-2">
              <input
                value={tracker.name}
                onChange={event => onRename(tracker.id, event.target.value, tracker.color)}
                maxLength={32}
                className="min-w-0 flex-1 rounded-lg bg-transparent px-2 py-1 text-sm text-[var(--text-primary)] focus:bg-[var(--bg-tertiary)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setConfirmId(confirmId === tracker.id ? null : tracker.id)}
                aria-label={`Delete ${tracker.name}`}
                className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent-rose-text)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-2 px-2">
              <ColorPicker value={tracker.color} onChange={color => onRename(tracker.id, tracker.name, color)} />
            </div>

            {confirmId === tracker.id && (
              <div className="mt-3 rounded-lg bg-[var(--accent-rose-soft)] p-3">
                <p className="text-xs text-[var(--accent-rose-text)]">
                  Delete &ldquo;{tracker.name}&rdquo; and every day logged against it? This cannot be undone.
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(tracker.id);
                      setConfirmId(null);
                    }}
                    className="rounded-lg bg-[var(--accent-rose-text)] px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="rounded-lg px-3 py-1.5 text-xs text-[var(--text-secondary)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
