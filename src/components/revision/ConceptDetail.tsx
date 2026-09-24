'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import { ConceptSummary, RevisionRoadmapId, RevisionTargetSummary } from '@/types';
import { VARIANT_THEME, Variant } from '@/components/reader/DeckMarkdown';
import { FreshnessChip, TONE, agoLabel, freshnessOf, isLearned, isUnreached, isWorthRevising } from './status';

const DECK_VARIANT: Record<RevisionRoadmapId, Variant> = { webd: 'webd', ml: 'ml', daml: 'ml' };

// Revisions are a sequence, so they are laid out as one — a numbered path down
// the page.
//
// The rows are deliberately NOT equal. Exactly one is the thing to do now, and
// it gets every affordance: an accent edge, a lifted surface, full-contrast
// type, and a real button. Everything already finished settles back, and
// everything still ahead recedes. A status word in the same grey as the title
// is not a visual clue — the reason the page was confusing is that it had one
// weight for three different meanings.
function TargetRow({
  roadmapId,
  conceptId,
  target,
  index,
  isNext,
}: {
  roadmapId: RevisionRoadmapId;
  conceptId: string;
  target: RevisionTargetSummary;
  index: number | null;
  isNext: boolean;
}) {
  const locked = target.status === 'locked';
  const done = target.status === 'done';
  const freshness = freshnessOf(target.lastCompletedAt);
  // Lectures the learner has not reached yet. Still clickable — revising ahead
  // is allowed — but it should never look like the thing to do next.
  const unreached = isUnreached(target);
  const partly = !unreached && !isLearned(target);
  const upcoming = !locked && !done && !isNext;

  const marker = locked ? (
    <Lock className="h-3.5 w-3.5 text-[#C0BFBA] dark:text-[#3A3936]" />
  ) : done ? (
    <Check className={`h-[18px] w-[18px] ${TONE[freshness?.state ?? 'fresh'].text}`} />
  ) : (
    <span
      className={`font-mono text-[12px] tabular-nums ${
        isNext ? 'font-semibold' : 'text-[#C0BFBA] dark:text-[#3F3E3B]'
      }`}
      style={isNext ? { color: 'var(--deck-accent)' } : undefined}
    >
      {index !== null ? String(index + 1).padStart(2, '0') : '★'}
    </span>
  );

  const titleTone = locked
    ? 'text-[#C0BFBA] dark:text-[#3F3E3B]'
    : upcoming
      ? 'text-[#8A8A86] dark:text-[#6A6966]'
      : 'text-[#1A1A1A] dark:text-[#F5F4F1]';

  const body = (
    <>
      <div className="flex w-9 shrink-0 justify-center pt-1">{marker}</div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className={`font-semibold tracking-tight ${isNext ? 'text-[1.22rem]' : 'text-[1.02rem]'} ${titleTone}`}>
            {target.title}
          </h3>
          <FreshnessChip target={target} />
        </div>
        <p
          className={`mt-1.5 text-[13px] leading-[1.6] ${
            locked || upcoming ? 'text-[#B6B5B1] dark:text-[#4E4D4A]' : 'text-[#8A8A86] dark:text-[#7E7D79]'
          }`}
        >
          {target.lectures.join(' · ')}
        </p>

        {!locked && !done && (unreached || partly) && (
          <p className="mt-2 font-mono text-[11px] text-[#B6B5B1] dark:text-[#5A5955]">
            {unreached
              ? 'Not studied yet'
              : `${target.lecturesLearned} of ${target.lectureCount} lectures studied`}
          </p>
        )}

        {isNext && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-mono text-[13px] font-semibold text-white transition-transform group-hover:translate-x-0.5 dark:text-[#0F0F0D]"
              style={{ background: 'var(--deck-accent)' }}
            >
              {target.attempts > 0 ? 'Continue' : 'Start'} <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="font-mono text-[11.5px] text-[#8A8A86] dark:text-[#6A6966]">
              {target.attempts > 0 ? 'Picked up already — finish it' : '12 concepts · about 20 minutes'}
            </span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center pt-1">
        {done ? (
          <div className="text-right">
            <div className={`font-mono text-[15px] font-semibold tabular-nums ${TONE[freshness?.state ?? 'fresh'].text}`}>
              {target.bestPercent}%
            </div>
            {freshness && (
              <div className="font-mono text-[10.5px] text-[#A8A7A3] dark:text-[#575652]">
                {agoLabel(freshness.days)}
              </div>
            )}
          </div>
        ) : locked ? (
          <span className="font-mono text-[11px] text-[#C0BFBA] dark:text-[#3F3E3B]">Locked</span>
        ) : upcoming ? (
          <ArrowRight className="h-4 w-4 text-transparent transition-colors group-hover:text-[#C0BFBA] dark:group-hover:text-[#4A4946]" />
        ) : null}
      </div>
    </>
  );

  const shared = 'flex items-start gap-3 transition-colors';

  if (locked) {
    return <div className={`${shared} bg-[#FAFAF8] px-5 py-5 dark:bg-[#111110]`}>{body}</div>;
  }

  if (isNext) {
    return (
      <Link
        href={`/${roadmapId}/revision/concept/${conceptId}/${target.targetId}`}
        className={`group relative ${shared} px-5 py-6 pl-6`}
        style={{ background: 'color-mix(in srgb, var(--deck-accent) 8%, transparent)' }}
      >
        <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: 'var(--deck-accent)' }} />
        {body}
      </Link>
    );
  }

  return (
    <Link
      href={`/${roadmapId}/revision/concept/${conceptId}/${target.targetId}`}
      className={`group ${shared} bg-[#FAFAF8] px-5 py-5 hover:bg-white dark:bg-[#111110] dark:hover:bg-[#171715]`}
    >
      {body}
    </Link>
  );
}

export default function ConceptDetail({ roadmapId, conceptId }: { roadmapId: RevisionRoadmapId; conceptId: string }) {
  const [concept, setConcept] = useState<ConceptSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = VARIANT_THEME[DECK_VARIANT[roadmapId]];

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/revision?roadmapId=${roadmapId}`, { cache: 'no-store' });
        const data = await response.json();
        if (data.success) {
          const found = (data.concepts as ConceptSummary[]).find(c => c.conceptId === conceptId) ?? null;
          setConcept(found);
          if (!found) setError('Concept not found');
        } else {
          setError(data.error || 'Failed to load');
        }
      } catch {
        setError('Failed to load');
      }
    })();
  }, [roadmapId, conceptId]);

  // Highlight the first revision actually worth doing — one whose lectures have
  // been studied. Only fall back to raw order when nothing qualifies.
  const worthIndex = concept ? concept.revisions.findIndex(isWorthRevising) : -1;
  const nextIndex =
    worthIndex >= 0 ? worthIndex : concept ? concept.revisions.findIndex(r => r.status !== 'done') : -1;

  return (
    <main
      className="lecture-deck-root min-h-screen bg-[#FAFAF8] dark:bg-[#111110]"
      style={{
        ['--deck-accent-light' as string]: theme.accent,
        ['--deck-accent-dark' as string]: theme.accentLift,
      }}
    >
      <div className="mx-auto w-full max-w-4xl px-5 py-8 lg:px-10 lg:py-12">
        <Link
          href={`/${roadmapId}/revision`}
          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#8A8A86] transition-colors hover:text-[#52524E] dark:text-[#686664] dark:hover:text-[#9E9C98]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All concepts
        </Link>

        {error && <p className="mt-8 font-mono text-sm text-[#C4766A]">{error}</p>}
        {!concept && !error && (
          <p className="mt-8 font-mono text-sm text-[#8A8A86] dark:text-[#686664]">Loading…</p>
        )}

        {concept && (
          <>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <h1 className="text-[2.25rem] font-semibold leading-tight tracking-[-0.02em] text-[#1A1A1A] dark:text-[#F5F4F1]">
                {concept.title}
              </h1>
              <p className="font-mono text-[12px] text-[#8A8A86] dark:text-[#686664]">
                {concept.revisions.filter(r => r.status === 'done').length} of {concept.revisions.length} done
                {concept.conceptPercent !== null && ` · ${concept.conceptPercent}% avg`}
              </p>
            </div>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-[#52524E] dark:text-[#9E9C98]">
              {concept.summary}
            </p>

            <div className="mt-10 divide-y divide-[#E5E4DF] overflow-hidden rounded-2xl border border-[#E5E4DF] dark:divide-[#2C2B28] dark:border-[#2C2B28]">
              {concept.revisions.map((revision, index) => (
                <TargetRow
                  key={revision.targetId}
                  roadmapId={roadmapId}
                  conceptId={conceptId}
                  target={revision}
                  index={index}
                  isNext={index === nextIndex}
                />
              ))}
            </div>

            <h2 className="mt-10 mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8A86] dark:text-[#686664]">
              Final practice
            </h2>
            <div className="overflow-hidden rounded-2xl border border-[#E5E4DF] dark:border-[#2C2B28]">
              <TargetRow
                roadmapId={roadmapId}
                conceptId={conceptId}
                target={concept.final}
                index={null}
                isNext={false}
              />
            </div>
            {concept.final.status === 'locked' && (
              <p className="mt-2.5 font-mono text-[11px] text-[#A8A7A3] dark:text-[#575652]">
                Unlocks once every revision above is done.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
