import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

import { RoadmapVariant } from '@/types';

// Same accent families the phase decks and progress bars use, so the card reads
// as part of the course rather than a generic promo block.
const ACCENT: Record<RoadmapVariant, { text: string; border: string; bg: string; icon: string }> = {
  blue: {
    text: 'text-[#507290] dark:text-[#8AAAC4]',
    border: 'border-[#6889A6]/35 dark:border-[#8AAAC4]/30 hover:border-[#6889A6]/70 dark:hover:border-[#8AAAC4]/55',
    bg: 'bg-[#E2EBF0]/50 dark:bg-[#182228]/60',
    icon: 'text-[#6889A6] dark:text-[#8AAAC4]',
  },
  rose: {
    text: 'text-[#9A6452] dark:text-[#D4A090]',
    border: 'border-[#B87D6C]/35 dark:border-[#D4A090]/30 hover:border-[#B87D6C]/70 dark:hover:border-[#D4A090]/55',
    bg: 'bg-[#F0E5E0]/50 dark:bg-[#2A2018]/60',
    icon: 'text-[#B87D6C] dark:text-[#D4A090]',
  },
  emerald: {
    text: 'text-[#446B55] dark:text-[#7AAE8E]',
    border: 'border-[#5D8E72]/35 dark:border-[#7AAE8E]/30 hover:border-[#5D8E72]/70 dark:hover:border-[#7AAE8E]/55',
    bg: 'bg-[#E2EDE6]/50 dark:bg-[#1C2820]/60',
    icon: 'text-[#5D8E72] dark:text-[#7AAE8E]',
  },
};

interface NotesCtaProps {
  /** Course base path, e.g. `/webd`. */
  basePath: string;
  /** Phase id used as the deep-link anchor on the notes page, e.g. `phase1`. */
  phaseId: string;
  /** How many lectures exist for this phase; omitted when none are written yet. */
  lectureCount?: number;
  variant?: RoadmapVariant;
}

/**
 * The primary call to action on a phase page.
 *
 * The checklist below it tracks what a learner has done, but the lectures are
 * the thing they actually came for — so this sits directly under the phase goal
 * and is styled as a CTA rather than as one of three equal-weight links.
 */
export function NotesCta({ basePath, phaseId, lectureCount, variant = 'blue' }: NotesCtaProps) {
  const accent = ACCENT[variant];
  const hasLectures = typeof lectureCount === 'number' && lectureCount > 0;

  return (
    <Link
      href={`${basePath}/notes#${phaseId}`}
      className={`group mb-6 flex items-center gap-4 rounded-xl border p-5 transition-colors ${accent.border} ${accent.bg}`}
    >
      <BookOpen className={`h-5 w-5 shrink-0 ${accent.icon}`} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h2 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">
            Read the lectures for this phase
          </h2>
          {hasLectures && (
            <span className={`text-[11px] font-medium ${accent.text}`}>
              {lectureCount} {lectureCount === 1 ? 'lecture' : 'lectures'}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-[#52524E] dark:text-[#9E9C98]">
          {hasLectures
            ? 'The full written lessons behind this checklist — worked examples, the traps, and quizzes at the end.'
            : 'Lectures for this phase are still being written. See what is published so far.'}
        </p>
      </div>

      <ArrowRight
        className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${accent.icon}`}
      />
    </Link>
  );
}
