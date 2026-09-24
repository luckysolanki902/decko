'use client';

import React from 'react';

import { RevisionTargetSummary } from '@/types';

// Shared status vocabulary for the revision pages.
//
// Colour carries exactly one meaning here: how well you know something. The
// roadmap accent is reserved for actions and navigation. That split is the whole
// reason the pages read at a glance — before it, everything was the same grey
// box with the same green, and nothing told you where to go next.

export type Freshness = 'fresh' | 'fading' | 'due';

export const TONE = {
  fresh: {
    dot: 'bg-[#5D8E72] dark:bg-[#7AAE8E]',
    text: 'text-[#446B55] dark:text-[#7AAE8E]',
    chip: 'border-[#5D8E72]/35 text-[#446B55] dark:border-[#7AAE8E]/30 dark:text-[#7AAE8E]',
  },
  fading: {
    dot: 'bg-[#C4A06A] dark:bg-[#D8BC8A]',
    text: 'text-[#8A6A31] dark:text-[#D8BC8A]',
    chip: 'border-[#C4A06A]/40 text-[#8A6A31] dark:border-[#D8BC8A]/30 dark:text-[#D8BC8A]',
  },
  due: {
    dot: 'bg-[#C4766A] dark:bg-[#D4948A]',
    text: 'text-[#A3564A] dark:text-[#D4948A]',
    chip: 'border-[#C4766A]/40 text-[#A3564A] dark:border-[#D4948A]/30 dark:text-[#D4948A]',
  },
} as const;

const DAY_MS = 24 * 60 * 60 * 1000;

// Memory decays, so a revision done three weeks ago is not "done" in any useful
// sense. Ageing the completed state is how the spacing effect becomes something
// the learner can act on instead of a fact buried in the research.
export function freshnessOf(lastCompletedAt: string | null): { state: Freshness; days: number } | null {
  if (!lastCompletedAt) return null;
  const then = Date.parse(lastCompletedAt);
  if (Number.isNaN(then)) return null;
  const days = Math.max(0, Math.floor((Date.now() - then) / DAY_MS));
  if (days >= 14) return { state: 'due', days };
  if (days >= 4) return { state: 'fading', days };
  return { state: 'fresh', days };
}

export function agoLabel(days: number): string {
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

// A revision is "worth doing now" if it has never been done, or if what you knew
// has had time to fade. Material you have not studied yet is excluded: revising
// lectures you have not reached is not revision.
export function isWorthRevising(target: RevisionTargetSummary): boolean {
  if (target.status === 'locked') return false;
  if (!isLearned(target)) return false;
  if (target.status !== 'done') return true;
  const freshness = freshnessOf(target.lastCompletedAt);
  return freshness ? freshness.state !== 'fresh' : true;
}

/** Every lecture in this target has been studied, so it can be revised. */
export function isLearned(target: RevisionTargetSummary): boolean {
  return target.lectureCount > 0 && target.lecturesLearned >= target.lectureCount;
}

/** Nothing in it has been studied yet — it is ahead of the learner. */
export function isUnreached(target: RevisionTargetSummary): boolean {
  return target.lecturesLearned === 0;
}

export function FreshnessChip({ target }: { target: RevisionTargetSummary }) {
  const freshness = freshnessOf(target.lastCompletedAt);
  if (!freshness) return null;
  const label =
    freshness.state === 'due' ? 'Due again' : freshness.state === 'fading' ? 'Fading' : 'Fresh';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${TONE[freshness.state].chip}`}
      title={`Last revised ${agoLabel(freshness.days)}`}
    >
      {label}
    </span>
  );
}

// One pip per revision, so a concept's state is legible without reading a
// fraction. Filled pips age with the revision they represent.
export function MasteryStrip({ targets }: { targets: RevisionTargetSummary[] }) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {targets.map(target => {
        if (target.status !== 'done') {
          return (
            <span
              key={target.targetId}
              className="h-1.5 w-5 rounded-full bg-[#E5E4DF] dark:bg-[#232321]"
            />
          );
        }
        const freshness = freshnessOf(target.lastCompletedAt);
        const tone = TONE[freshness?.state ?? 'fresh'];
        return <span key={target.targetId} className={`h-1.5 w-5 rounded-full ${tone.dot}`} />;
      })}
    </div>
  );
}
