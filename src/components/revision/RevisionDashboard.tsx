'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ConceptSummary, RevisionRoadmapId } from '@/types';
import { VARIANT_THEME, Variant } from '@/components/reader/DeckMarkdown';
import { FreshnessChip, MasteryStrip, isWorthRevising } from './status';

const ROADMAP_LABEL: Record<string, string> = {
  webd: 'Web Development',
  daml: 'Python & Data Analytics',
  ml: 'ML, DL & GenAI',
};

const DECK_VARIANT: Record<RevisionRoadmapId, Variant> = { webd: 'webd', ml: 'ml', daml: 'ml' };

export default function RevisionDashboard({ roadmapId }: { roadmapId: RevisionRoadmapId }) {
  const [concepts, setConcepts] = useState<ConceptSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = VARIANT_THEME[DECK_VARIANT[roadmapId]];

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/revision?roadmapId=${roadmapId}`, { cache: 'no-store' });
        const data = await response.json();
        if (data.success) {
          setConcepts(data.concepts);
        } else {
          setError(data.error || 'Failed to load');
        }
      } catch {
        setError('Failed to load');
      }
    })();
  }, [roadmapId]);

  // The one thing this page should answer: what is worth revising right now.
  // The concept being studied wins — sending someone on day 35 back to day 1
  // is what made the old recommendation useless.
  const candidates = (concepts ?? [])
    .map(concept => {
      const target = concept.revisions.find(isWorthRevising);
      return target ? { concept, target } : null;
    })
    .filter(Boolean) as { concept: ConceptSummary; target: ConceptSummary['revisions'][number] }[];
  const fromCurrent = candidates.find(entry => entry.concept.isCurrent);
  const nextUp = fromCurrent ?? candidates[0];
  // Say why this one was picked. An unexplained recommendation that points at
  // day 1 while you are on day 33 just looks broken.
  const nextUpReason = fromCurrent
    ? 'From the concept you are studying now'
    : 'The oldest thing you have studied but never revised';

  const started = concepts?.filter(concept => concept.status !== 'not_started').length ?? 0;

  return (
    <main
      className="lecture-deck-root min-h-screen bg-[#FAFAF8] dark:bg-[#111110]"
      style={{
        ['--deck-accent-light' as string]: theme.accent,
        ['--deck-accent-dark' as string]: theme.accentLift,
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
        <Link
          href={`/${roadmapId}`}
          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#8A8A86] transition-colors hover:text-[#52524E] dark:text-[#686664] dark:hover:text-[#9E9C98]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {ROADMAP_LABEL[roadmapId]}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h1 className="text-[2.5rem] font-semibold leading-none tracking-[-0.02em] text-[#1A1A1A] dark:text-[#F5F4F1]">
            Revision
          </h1>
          {concepts && (
            <p className="font-mono text-[12px] text-[#8A8A86] dark:text-[#686664]">
              {started} of {concepts.length} concepts started
            </p>
          )}
        </div>
        <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-[#52524E] dark:text-[#9E9C98]">
          Each revision asks you to recall a concept before it shows you anything, then quizzes you on it. Twenty
          minutes a piece.
        </p>

        {error && <p className="mt-8 font-mono text-sm text-[#C4766A]">{error}</p>}
        {!concepts && !error && (
          <p className="mt-8 font-mono text-sm text-[#8A8A86] dark:text-[#686664]">Loading…</p>
        )}

        {/* Next up — the page's one recommendation, so there is never a blank
            "where do I start" moment in front of a grid of equal boxes. */}
        {nextUp && (
          <Link
            href={`/${roadmapId}/revision/concept/${nextUp.concept.conceptId}/${nextUp.target.targetId}`}
            className="group mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-6 transition-colors"
            style={{ borderColor: 'color-mix(in srgb, var(--deck-accent) 35%, transparent)' }}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: 'var(--deck-accent)' }}
                >
                  Next up
                </span>
                <FreshnessChip target={nextUp.target} />
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#1A1A1A] dark:text-[#F5F4F1]">
                {nextUp.concept.title} · {nextUp.target.title}
              </h2>
              <p className="mt-1 truncate text-[13.5px] text-[#8A8A86] dark:text-[#686664]">
                {nextUp.target.lectures.join(' · ')}
              </p>
              <p className="mt-2 font-mono text-[11px] text-[#A8A7A3] dark:text-[#5A5955]">{nextUpReason}</p>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[13px] font-semibold text-white transition-transform group-hover:translate-x-0.5 dark:text-[#0F0F0D]"
              style={{ background: 'var(--deck-accent)' }}
            >
              Start <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        )}

        {concepts && (
          <>
            <h2 className="mt-12 mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8A86] dark:text-[#686664]">
              All concepts
            </h2>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-[#E5E4DF] bg-[#E5E4DF] dark:border-[#2C2B28] dark:bg-[#2C2B28] sm:grid-cols-2 xl:grid-cols-3">
              {concepts.map(concept => {
                const doneRevisions = concept.revisions.filter(r => r.status === 'done').length;
                return (
                  <Link
                    key={concept.conceptId}
                    href={`/${roadmapId}/revision/concept/${concept.conceptId}`}
                    className={`group relative flex flex-col p-5 transition-colors ${
                      concept.isCurrent
                        ? ''
                        : 'bg-[#FAFAF8] hover:bg-white dark:bg-[#111110] dark:hover:bg-[#171715]'
                    }`}
                    style={
                      concept.isCurrent
                        ? { background: 'color-mix(in srgb, var(--deck-accent) 9%, transparent)' }
                        : undefined
                    }
                  >
                    {concept.isCurrent && (
                      <span
                        className="absolute inset-y-0 left-0 w-[3px]"
                        style={{ background: 'var(--deck-accent)' }}
                      />
                    )}
                    {concept.isCurrent && (
                      <span
                        className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                        style={{ color: 'var(--deck-accent)' }}
                      >
                        Studying now
                      </span>
                    )}
                    <h3 className="text-[1.02rem] font-semibold leading-snug tracking-tight text-[#1A1A1A] dark:text-[#F5F4F1]">
                      {concept.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.6] text-[#8A8A86] dark:text-[#686664]">
                      {concept.summary}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <MasteryStrip targets={concept.revisions} />
                      <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#8A8A86] dark:text-[#686664]">
                        {doneRevisions}/{concept.revisions.length}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
