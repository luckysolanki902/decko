'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, History, Lock, RotateCcw, ThumbsUp, X } from 'lucide-react';
import { RevisionAttempt, RevisionContent, RevisionQuizStageId, RevisionRoadmapId } from '@/types';
import { MarkdownBlock } from './markdown';
import RecapDeck from './RecapDeck';
import RecallSession, { SessionCard } from './RecallSession';
import { VARIANT_THEME, Variant } from '@/components/reader/DeckMarkdown';
import QuizStage from './QuizStage';
import RevisionHistory from './RevisionHistory';
import { SuggestionVote } from '@/components/suggestions/SuggestionVote';

interface TargetMeta {
  conceptId: string;
  conceptTitle: string;
  targetId: string;
  kind: 'revision' | 'final';
  title: string;
  lectures: { sectionId: string; title: string }[];
}

const REVISION_STAGES: { id: RevisionQuizStageId | 'recap' | 'concepts'; label: string }[] = [
  { id: 'recap', label: 'Orient' },
  { id: 'concepts', label: 'Recall' },
  { id: 'quiz', label: 'Check' },
];
const FINAL_STAGES: { id: RevisionQuizStageId | 'recap'; label: string }[] = [
  { id: 'recap', label: 'Quick concepts' },
  { id: 'quiz', label: 'Final quiz' },
];

type StageId = RevisionQuizStageId | 'recap' | 'concepts';

// The revision reader wears the same accent as that roadmap's lecture deck.
// DAML has no deck variant of its own, so it borrows ML's green.
const DECK_VARIANT: Record<RevisionRoadmapId, Variant> = { webd: 'webd', ml: 'ml', daml: 'ml' };

function isStageDone(attempt: RevisionAttempt | null, stage: StageId): boolean {
  return Boolean(attempt?.stages?.[stage]);
}

export default function RevisionRunner({
  roadmapId,
  conceptId,
  targetId,
}: {
  roadmapId: RevisionRoadmapId;
  conceptId: string;
  targetId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<TargetMeta | null>(null);
  const [content, setContent] = useState<RevisionContent | null>(null);
  const [attempts, setAttempts] = useState<RevisionAttempt[]>([]);
  const [contentsByVersion, setContentsByVersion] = useState<Record<number, RevisionContent>>({});
  const [attempt, setAttempt] = useState<RevisionAttempt | null>(null);
  const [activeStage, setActiveStage] = useState<StageId | null>(null);
  const [busy, setBusy] = useState<null | string>(null);
  const [redoOpen, setRedoOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Revision sets are authored content, so a target either has one or it does
  // not. Attempts need an account; browsing the set does not.
  const [isSignedIn, setIsSignedIn] = useState(false);
  // The recap opens as a full-screen reader; closing it returns to this hub.
  const [readerOpen, setReaderOpen] = useState(false);

  const stages = useMemo(() => (meta?.kind === 'final' ? FINAL_STAGES : REVISION_STAGES), [meta?.kind]);
  const backHref = `/${roadmapId}/revision/concept/${conceptId}`;
  const deckVariant = DECK_VARIANT[roadmapId];

  // Cards carry their lecture/topic labels; older generated sets do not, so fall
  // back to the target's own lectures rather than showing blanks.
  const sessionCards = useMemo<SessionCard[]>(
    () =>
      (content?.concepts ?? []).map((card, index) => ({
        ...card,
        id: `c${index + 1}`,
        lectureTitle: card.lectureTitle ?? meta?.lectures[0]?.title ?? 'This revision',
        topicLabel: card.topicTitle ?? `Concept ${index + 1}`,
      })),
    [content?.concepts, meta?.lectures]
  );

  const load = useCallback(async () => {
    const response = await fetch(
      `/api/revision/target?roadmapId=${roadmapId}&conceptId=${conceptId}&targetId=${targetId}`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    if (!data.success) {
      setError(data.error || 'Failed to load');
      setLoading(false);
      return;
    }
    setMeta(data.target);
    setContent(data.content);
    setAttempts(data.attempts);
    setContentsByVersion(data.contentsByVersion ?? {});
    setIsSignedIn(Boolean(data.isSignedIn));
    // Resume an in-progress attempt on the current version, but never clobber an
    // attempt we're actively running mid-quiz (e.g. a poll landing during play).
    const resumable: RevisionAttempt | undefined = (data.attempts as RevisionAttempt[]).find(
      candidate => candidate.status === 'in_progress' && data.content && candidate.contentVersion === data.content.version
    );
    setAttempt(prev =>
      prev && prev.status === 'in_progress' && data.content && prev.contentVersion === data.content.version
        ? prev
        : resumable ?? null
    );
    setLoading(false);
  }, [roadmapId, conceptId, targetId]);

  useEffect(() => {
    load();
  }, [load]);

  const stageUnlocked = useCallback(
    (stage: StageId): boolean => {
      if (!attempt) {
        return false;
      }
      const order = stages.map(s => s.id);
      const index = order.indexOf(stage);
      if (index <= 0) {
        return true;
      }
      const prev = order[index - 1];
      return isStageDone(attempt, prev as StageId);
    },
    [attempt, stages]
  );

  const firstIncomplete = useMemo<StageId>(() => {
    for (const stage of stages) {
      if (!isStageDone(attempt, stage.id)) {
        return stage.id;
      }
    }
    return stages[stages.length - 1].id;
  }, [attempt, stages]);

  useEffect(() => {
    if (attempt && activeStage === null) {
      setActiveStage(firstIncomplete);
      setReaderOpen(firstIncomplete === 'concepts');
    }
  }, [attempt, activeStage, firstIncomplete]);

  const startAttempt = useCallback(
    async (version: number, forceNew = false) => {
      const response = await fetch('/api/revision/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', roadmapId, conceptId, targetId, contentVersion: version, forceNew }),
      });
      const data = await response.json();
      if (data.success) {
        setAttempt(data.attempt);
        setActiveStage(stages[0].id);
      } else {
        setError(data.error || 'Could not start this revision.');
      }
    },
    [roadmapId, conceptId, targetId, stages]
  );

  async function begin() {
    if (!content) {
      return;
    }
    setBusy('Starting…');
    try {
      await startAttempt(content.version);
    } finally {
      setBusy(null);
    }
  }

  async function completeReading(stage: 'recap' | 'concepts') {
    if (!attempt) {
      return;
    }
    setBusy('Saving…');
    try {
      const response = await fetch('/api/revision/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reading', attemptId: attempt.id, stage }),
      });
      const data = await response.json();
      if (data.success) {
        setAttempt(data.attempt);
        const order = stages.map(s => s.id);
        const next = order[order.indexOf(stage) + 1];
        if (next) {
          setActiveStage(next as StageId);
          // Orient → Recall is a continuation, not a new decision. Landing on a
          // hub whose only content is "Start the session" is a dead screen.
          setReaderOpen(next === 'concepts');
        }
      }
    } finally {
      setBusy(null);
    }
  }

  function onStageSubmitted(updated: RevisionAttempt) {
    setAttempt(updated);
    setAttempts(prev => {
      const others = prev.filter(a => a.id !== updated.id);
      return [updated, ...others];
    });
  }

  async function redo() {
    setRedoOpen(false);
    if (!content) {
      return;
    }
    setAttempt(null);
    setActiveStage(null);
    setBusy('Starting…');
    try {
      // Always a brand-new attempt — no old answers, score, or selection.
      await startAttempt(content.version, true);
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return <Shell backHref={backHref} variant={deckVariant}><p className="font-mono text-sm text-[#8A867C]">Loading…</p></Shell>;
  }

  if (!meta) {
    return <Shell backHref={backHref} variant={deckVariant}><p className="font-mono text-sm text-red-600">{error || 'Not found'}</p></Shell>;
  }

  // This target has not been authored yet. Rather than generating one on the
  // spot, learners vote — the most-wanted sets get written next.
  if (!content) {
    return (
      <Shell backHref={backHref} variant={deckVariant}>
        <Header meta={meta} onRedo={() => {}} showRedo={false} onHistory={() => {}} />
        <div className="mt-10 rounded-2xl border border-[#E4E0D6] bg-white px-6 py-10 text-center dark:border-[#26262B] dark:bg-[#0E0E10]">
          <ThumbsUp className="mx-auto h-6 w-6" style={{ color: 'var(--deck-accent)' }} />
          <h2 className="mt-3 text-lg font-medium text-[#171614] dark:text-[#F4F1EA]">
            This revision set hasn&apos;t been written yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5A5147] dark:text-[#A8A399]">
            Revision sets are written and reviewed before they ship, never generated while you wait — so the
            questions you practise against have actually been checked. Vote for this one and it moves up the
            queue.
          </p>
          <div className="mt-6">
            <SuggestionVote
              kind="section"
              roadmapId={roadmapId}
              reference={`${roadmapId}/${conceptId}/${targetId}`}
              title={`Revision set: ${meta.conceptTitle} — ${meta.title}`}
              label="Vote for this revision set"
            />
          </div>
          {error && <p className="mt-3 font-mono text-[11px] text-red-600">{error}</p>}
        </div>
      </Shell>
    );
  }

  // The set exists but attempts are personal, so they need an account.
  if (!isSignedIn) {
    return (
      <Shell backHref={backHref} variant={deckVariant}>
        <Header meta={meta} onRedo={() => {}} showRedo={false} onHistory={() => {}} />
        <div className="mt-10 rounded-2xl border border-[#E4E0D6] bg-white px-6 py-10 text-center dark:border-[#26262B] dark:bg-[#0E0E10]">
          <Lock className="mx-auto h-6 w-6" style={{ color: 'var(--deck-accent)' }} />
          <h2 className="mt-3 text-lg font-medium text-[#171614] dark:text-[#F4F1EA]">Sign in to revise</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5A5147] dark:text-[#A8A399]">
            Revision only works if the gaps are remembered between sessions. An account keeps your scores and
            history so the spacing means something.
          </p>
          <Link
            href={`/login?next=/${roadmapId}/revision/concept/${conceptId}/${targetId}`}
            className="mt-6 inline-block rounded-full px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:brightness-110 dark:text-[#0F0F0D]"
            style={{ background: 'var(--deck-accent)' }}
          >
            Sign in
          </Link>
        </div>
      </Shell>
    );
  }

  // Content exists but no attempt started → intro / begin.
  if (!attempt) {
    return (
      <Shell backHref={backHref} variant={deckVariant}>
        <Header meta={meta} onRedo={() => setRedoOpen(true)} showRedo={attempts.length > 0} onHistory={() => setHistoryOpen(true)} />
        <div className="mt-8 rounded-2xl border border-[#E4E0D6] bg-white px-6 py-8 dark:border-[#26262B] dark:bg-[#0E0E10]">
          <p className="text-sm leading-7 text-[#3F3A33] dark:text-[#D1CBC0]">
            {meta.kind === 'final'
              ? 'Work through Easy, then Medium, then Hard. Each tier unlocks the next.'
              : 'Revise first — read the Concept overview and flip through the Cards — then the graded Quiz unlocks. No skipping straight to the quiz.'}
          </p>
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={begin}
            className="mt-5 rounded-full px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 dark:text-[#0F0F0D]"
            style={{ background: 'var(--deck-accent)' }}
          >
            {busy || (meta.kind === 'final' ? 'Start Final Practice' : 'Start revising')}
          </button>
        </div>
        {redoOpen && <RedoModal onClose={() => setRedoOpen(false)} onConfirm={redo} />}
        {historyOpen && (
          <HistoryModal onClose={() => setHistoryOpen(false)} attempts={attempts} contentsByVersion={contentsByVersion} />
        )}
      </Shell>
    );
  }

  const allDone = stages.every(stage => isStageDone(attempt, stage.id));
  const order = stages.map(s => s.id);
  const nextStage = activeStage ? order[order.indexOf(activeStage) + 1] : undefined;
  const canContinue = activeStage ? isStageDone(attempt, activeStage) && nextStage && stageUnlocked(nextStage as StageId) : false;
  if (activeStage === 'concepts' && readerOpen && sessionCards.length > 0) {
    return (
      <RecallSession
        cards={sessionCards}
        variant={deckVariant}
        title={meta.title}
        eyebrow="Recall"
        finishing={Boolean(busy)}
        finishLabel={busy || undefined}
        onExit={() => setReaderOpen(false)}
        onFinish={
          isStageDone(attempt, 'concepts')
            ? undefined
            : async () => {
                await completeReading('concepts');
                setReaderOpen(false);
              }
        }
      />
    );
  }

  if (activeStage === 'recap' && readerOpen && meta.kind === 'final') {
    return (
      <RecapDeck
        markdown={content.recap}
        variant={deckVariant}
        eyebrow={meta.kind === 'final' ? 'Quick concepts' : 'Concept'}
        title={meta.title}
        finishing={Boolean(busy)}
        finishLabel={busy || undefined}
        onExit={() => setReaderOpen(false)}
        onFinish={
          isStageDone(attempt, 'recap')
            ? undefined
            : async () => {
                await completeReading('recap');
                setReaderOpen(false);
              }
        }
      />
    );
  }

  return (
    <Shell backHref={backHref} variant={deckVariant}>
      <Header
        meta={meta}
        onRedo={() => setRedoOpen(true)}
        showRedo
        onHistory={() => setHistoryOpen(true)}
      />

      {/* Stage progress chips */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {stages.map(stage => {
          const done = isStageDone(attempt, stage.id);
          const unlocked = stageUnlocked(stage.id);
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              disabled={!unlocked}
              onClick={() => {
                if (!unlocked) return;
                setActiveStage(stage.id);
                setReaderOpen(stage.id === 'concepts' || (stage.id === 'recap' && meta.kind === 'final'));
              }}
              style={
                isActive
                  ? {
                      borderColor: 'var(--deck-accent)',
                      background: 'color-mix(in srgb, var(--deck-accent) 12%, transparent)',
                    }
                  : undefined
              }
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-[#1A1A1A] dark:text-[#F5F4F1]'
                  : done
                    ? 'border-[#5D8E72]/45 text-[#446B55] dark:border-[#7AAE8E]/35 dark:text-[#7AAE8E]'
                    : unlocked
                      ? 'border-[#E5E4DF] text-[#8A8A86] hover:border-[#D0CEC8] dark:border-[#2C2B28] dark:text-[#8A8A86] dark:hover:border-[#3A3936]'
                      : 'border-[#EFEEEA] text-[#C0BFBA] dark:border-[#232321] dark:text-[#4A4946]'
              }`}
            >
              {done ? <Check className="h-3 w-3" /> : !unlocked ? <Lock className="h-3 w-3" /> : null}
              {stage.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeStage === 'recap' && meta.kind === 'final' && (
          <StagePanel
            title="Quick concepts"
            subtitle="A fast refresher across the whole concept before the final quiz."
          >
            <p className="text-sm leading-7 text-[#52524E] dark:text-[#9E9C98]">
              {isStageDone(attempt, 'recap')
                ? 'You have read this sheet. Open it again any time.'
                : 'Opens full screen, one idea per screen. Use ←/→ to move, Esc to close.'}
            </p>
            <ContinueButton
              label={isStageDone(attempt, 'recap') ? 'Reopen the sheet' : 'Open the sheet'}
              onClick={() => setReaderOpen(true)}
            />
          </StagePanel>
        )}

        {activeStage === 'recap' && meta.kind !== 'final' && (
          <StagePanel title="Orient" subtitle="Thirty seconds of context, then you start recalling.">
            <MarkdownBlock text={content.recap} />
            <div className="mt-7 rounded-xl border border-[#E5E4DF] bg-[#F8F7F5] px-5 py-4 dark:border-[#2C2B28] dark:bg-[#151513]">
              <p className="text-[13.5px] leading-relaxed text-[#52524E] dark:text-[#9E9C98]">
                <strong className="font-semibold text-[#1A1A1A] dark:text-[#F5F4F1]">How this works.</strong>{' '}
                {sessionCards.length} concepts, about 20 minutes. Each one asks you a question before it shows you
                anything. Trying to answer and getting it wrong beats re-reading — it feels worse and works better,
                which is why most people avoid it. Grade yourself honestly; whatever you miss comes back.
              </p>
            </div>
            {!isStageDone(attempt, 'recap') && (
              <ContinueButton
                label={busy || 'Start recalling'}
                disabled={Boolean(busy)}
                onClick={() => completeReading('recap')}
              />
            )}
          </StagePanel>
        )}

        {activeStage === 'concepts' && (
          <StagePanel
            title="Recall"
            subtitle="Answer from memory first — the attempt is what makes it stick."
          >
            <p className="text-sm leading-7 text-[#52524E] dark:text-[#9E9C98]">
              {isStageDone(attempt, 'concepts')
                ? 'You have worked through these. Run them again any time — spacing the repeats out is what builds long-term memory.'
                : `${sessionCards.length} concepts, about 20 minutes. Opens full screen; anything you miss comes back before the session ends.`}
            </p>
            <ContinueButton
              label={isStageDone(attempt, 'concepts') ? 'Run the session again' : 'Start the session'}
              onClick={() => setReaderOpen(true)}
            />
          </StagePanel>
        )}

        {activeStage === 'quiz' && (
          <StagePanel title={stages.find(s => s.id === activeStage)?.label ?? 'Quiz'}>
            <QuizStage
              key={`${attempt.id}-quiz`}
              attemptId={attempt.id}
              questions={content.quiz}
              existingResult={attempt.stages.quiz}
              onSubmitted={onStageSubmitted}
            />
          </StagePanel>
        )}

        {canContinue && nextStage && (
          <div className="mt-5">
            <ContinueButton label={`Continue to ${stages.find(s => s.id === nextStage)?.label}`} onClick={() => setActiveStage(nextStage as StageId)} />
          </div>
        )}

        {allDone && (
          <div className="mt-6 rounded-xl border border-[#5D8E72]/40 border-l-2 border-l-[#5D8E72] bg-[#F1F7F3] px-5 py-4 dark:border-[#7AAE8E]/30 dark:border-l-[#7AAE8E] dark:bg-[#121A15]">
            <p className="font-mono text-sm text-[#446B55] dark:text-[#7AAE8E]">
              {meta.kind === 'final' ? 'Final Practice complete' : 'Revision complete'} — scored {attempt.percent}%. Do it again any time to reinforce it.
            </p>
          </div>
        )}
      </div>

      {redoOpen && <RedoModal onClose={() => setRedoOpen(false)} onConfirm={redo} />}
      {historyOpen && (
        <HistoryModal onClose={() => setHistoryOpen(false)} attempts={attempts} contentsByVersion={contentsByVersion} />
      )}
    </Shell>
  );
}

// Full-bleed page on the app's warm neutral, so the reading deck inside it sits
// on the same surface family as the lecture reader rather than a colder one.
function Shell({ backHref, children, variant }: { backHref: string; children: React.ReactNode; variant: Variant }) {
  const theme = VARIANT_THEME[variant];
  return (
    <main
      className="lecture-deck-root min-h-screen bg-[#FAFAF8] dark:bg-[#111110]"
      style={{
        ['--deck-accent-light' as string]: theme.accent,
        ['--deck-accent-dark' as string]: theme.accentLift,
      }}
    >
      <div className="sticky top-0 z-30 border-b border-[#E5E4DF]/80 bg-[#FAFAF8]/85 backdrop-blur-md dark:border-[#2C2B28] dark:bg-[#111110]/85">
        <div className="mx-auto flex w-full max-w-[1600px] items-center px-5 py-3.5 lg:px-10">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#8A8A86] transition-colors hover:text-[#52524E] dark:text-[#686664] dark:hover:text-[#9E9C98]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-5 pb-24 pt-8 lg:px-10">{children}</div>
    </main>
  );
}

function Header({
  meta,
  onRedo,
  showRedo,
  onHistory,
  compact = false,
}: {
  meta: TargetMeta;
  onRedo: () => void;
  showRedo: boolean;
  onHistory: () => void;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
      <div className="min-w-0">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A867C] dark:text-[#686664]">{meta.conceptTitle}</div>
        <h1 className="mt-2 text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[#171614] dark:text-[#F5F4F1] md:text-[2.4rem]">
          {meta.title}
        </h1>
        {!compact && (
        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {meta.lectures.map(lecture => (
            <li key={lecture.sectionId} className="flex items-center gap-2 text-[0.9rem] leading-6 text-[#52524E] dark:text-[#9E9C98]">
              <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#C0BFBA] dark:bg-[#4A4946]" />
              <span>{lecture.title}</span>
            </li>
          ))}
        </ul>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onHistory}
          className="flex items-center gap-1.5 rounded-lg border border-[#E5E4DF] px-3 py-2 font-mono text-[12px] text-[#52524E] transition-colors hover:bg-[#F2F1EE] dark:border-[#2C2B28] dark:text-[#9E9C98] dark:hover:border-[#3A3936] dark:hover:bg-[#1A1A18]"
        >
          <History className="h-3.5 w-3.5" /> History
        </button>
        {showRedo && (
          <button
            type="button"
            onClick={onRedo}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E4DF] px-3 py-2 font-mono text-[12px] text-[#52524E] transition-colors hover:bg-[#F2F1EE] dark:border-[#2C2B28] dark:text-[#9E9C98] dark:hover:border-[#3A3936] dark:hover:bg-[#1A1A18]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Do again
          </button>
        )}
      </div>
    </div>
  );
}

// `bare` drops the card frame for the long read. Ten thousand words inside a
// bordered box reads as cramped no matter how wide the box is; on the page
// itself, with the rail carrying the structure, it reads as a document.
function StagePanel({
  title,
  subtitle,
  children,
  bare = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  bare?: boolean;
}) {
  return (
    <section
      className={
        bare
          ? ''
          : 'rounded-2xl border border-[#E5E4DF] bg-white px-5 py-6 dark:border-[#2C2B28] dark:bg-[#0F0F0D] md:px-7 md:py-7'
      }
    >
      <div className={`mb-6 border-b border-[#F2F1EE] pb-4 dark:border-[#2C2B28] ${bare ? 'mb-8' : ''}`}>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--deck-accent)' }}>{title}</div>
        {subtitle && <p className="mt-1.5 text-[12.5px] text-[#8A8A86] dark:text-[#686664]">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function ContinueButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-6 rounded-full px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 dark:text-[#0F0F0D]"
      style={{ background: 'var(--deck-accent)' }}
    >
      {label}
    </button>
  );
}

function HistoryModal({
  onClose,
  attempts,
  contentsByVersion,
}: {
  onClose: () => void;
  attempts: RevisionAttempt[];
  contentsByVersion: Record<number, RevisionContent>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#08080A]/50 px-4 py-10 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-[#E4E0D6] bg-[#F7F6F1] shadow-xl dark:border-[#26262B] dark:bg-[#0B0B0D]"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E4E0D6] px-5 py-3.5 dark:border-[#1E1E22]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A867C]">History</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#8A867C] transition-colors hover:bg-[#EDEAE2] hover:text-[#1A1A1A] dark:hover:bg-[#151518] dark:hover:text-[#E6E6E3]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          <RevisionHistory attempts={attempts} contentsByVersion={contentsByVersion} />
        </div>
      </div>
    </div>
  );
}

function RedoModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080A]/50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-[#E4E0D6] bg-white p-6 dark:border-[#26262B] dark:bg-[#0E0E10]"
        onClick={event => event.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-[#171614] dark:text-[#F4F1EA]">Do this again</h3>
        <p className="mt-1 text-sm leading-6 text-[#5A5147] dark:text-[#A8A399]">
          Starts a clean attempt on the same set. Your previous attempts stay in your history — repeating a set
          after a gap is what moves it into long-term memory.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl px-4 py-3 text-left font-mono text-sm font-semibold text-white transition-all hover:brightness-110 dark:text-[#0F0F0D]"
            style={{ background: 'var(--deck-accent)' }}
          >
            Start a fresh attempt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E4E0D6] px-4 py-3 text-left font-mono text-sm text-[#3F3A33] transition-colors hover:bg-[#F1EFE8] dark:border-[#33333A] dark:text-[#C7C7C1] dark:hover:bg-[#151518]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
