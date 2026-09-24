'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, Eye, RotateCcw, X } from 'lucide-react';

import { ConceptCard } from '@/types';
import { DeckMarkdown, VARIANT_THEME, Variant } from '@/components/reader/DeckMarkdown';

// A revision session, shaped by the evidence rather than by the lecture reader.
//
// Practice testing is one of only two techniques rated HIGH utility in Dunlosky
// et al. (2013); rereading is rated LOW. So the learner never reads a wall of
// prose: they get a cue, try to answer it from memory, and only then see the
// explanation. Grading their own attempt drives what comes back — the cards they
// missed repeat, the ones they secured do not.

export type CardState = 'untested' | 'missed' | 'shaky' | 'secure';

export interface SessionCard extends ConceptCard {
  id: string;
  /** Always resolved by the caller, unlike the optional field on ConceptCard. */
  lectureTitle: string;
  topicLabel: string;
}

const STATE_DOT: Record<CardState, string> = {
  untested: 'border-[#C0BFBA] dark:border-[#3A3936]',
  missed: 'border-[#C4766A] bg-[#C4766A] dark:border-[#D4948A] dark:bg-[#D4948A]',
  shaky: 'border-[#C4A06A] bg-[#C4A06A] dark:border-[#D8BC8A] dark:bg-[#D8BC8A]',
  secure: 'border-[#5D8E72] bg-[#5D8E72] dark:border-[#7AAE8E] dark:bg-[#7AAE8E]',
};

// Later rounds interleave rather than replay in lecture order: mixing topics is
// what forces the learner to work out *which* idea applies, not just recall it.
function interleave(cards: SessionCard[]): SessionCard[] {
  const byLecture = new Map<string, SessionCard[]>();
  for (const card of cards) {
    const list = byLecture.get(card.lectureTitle) ?? [];
    list.push(card);
    byLecture.set(card.lectureTitle, list);
  }
  const queues = [...byLecture.values()];
  const out: SessionCard[] = [];
  let moved = true;
  while (moved) {
    moved = false;
    for (const queue of queues) {
      const next = queue.shift();
      if (next) {
        out.push(next);
        moved = true;
      }
    }
  }
  return out;
}

export default function RecallSession({
  cards,
  variant,
  title,
  eyebrow,
  onExit,
  onFinish,
  finishLabel,
  finishing,
}: {
  cards: SessionCard[];
  variant: Variant;
  title: string;
  eyebrow: string;
  onExit: () => void;
  /** Omitted once the stage is already complete. */
  onFinish?: () => void;
  finishLabel?: string;
  finishing?: boolean;
}) {
  const theme = VARIANT_THEME[variant];

  const [states, setStates] = useState<Record<string, CardState>>(() =>
    Object.fromEntries(cards.map(card => [card.id, 'untested' as CardState]))
  );
  // The working queue for this round, in the order the learner will see it.
  const [queue, setQueue] = useState<SessionCard[]>(cards);
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [round, setRound] = useState(1);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const current: SessionCard | undefined = queue[position];
  const counts = useMemo(() => {
    const tally = { secure: 0, shaky: 0, missed: 0, untested: 0 };
    for (const card of cards) tally[states[card.id] ?? 'untested'] += 1;
    return tally;
  }, [cards, states]);

  const done = counts.secure === cards.length;

  // Grading advances; anything not secured is collected for the next round.
  const grade = useCallback(
    (state: CardState) => {
      if (!current) return;
      setStates(prev => ({ ...prev, [current.id]: state }));
      setRevealed(false);
      setPosition(prev => {
        const next = prev + 1;
        if (next < queue.length) return next;
        // Round finished — requeue everything still not secure, interleaved.
        const stillWeak = queue.filter(card => {
          const resolved = card.id === current.id ? state : states[card.id];
          return resolved !== 'secure';
        });
        if (stillWeak.length > 0) {
          setQueue(interleave(stillWeak));
          setRound(r => r + 1);
          return 0;
        }
        setQueue([]);
        return 0;
      });
    },
    [current, queue, states]
  );

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [position, revealed, round]);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onExit();
        return;
      }
      if (!current) return;
      if (!revealed && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed) {
        if (event.key === '1') grade('missed');
        else if (event.key === '2') grade('shaky');
        else if (event.key === '3') grade('secure');
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, revealed, grade, onExit]);

  const jumpTo = (card: SessionCard) => {
    const index = queue.findIndex(entry => entry.id === card.id);
    if (index >= 0) {
      setPosition(index);
      setRevealed(false);
    }
  };

  return (
    <main
      className="lecture-deck-root fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0F0F0D]"
      style={{
        ['--deck-accent-light' as string]: theme.accent,
        ['--deck-accent-dark' as string]: theme.accentLift,
      }}
    >
      {/* Top bar. The status readout is a mastery tally, not a position bar:
          in revision what matters is how many ideas are secure, not how far
          through a document you have scrolled. */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#F2F1EE] px-5 py-3 dark:border-[#2C2B28] md:px-8">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-[12px] text-[#8A8A86] hover:text-[#52524E] dark:text-[#686664] dark:hover:text-[#9E9C98]"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Close
        </button>
        <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-[#8A8A86] dark:text-[#686664]">
          <span className="uppercase tracking-[0.16em]">{eyebrow}</span>
          <span className="opacity-40">·</span>
          <span className="max-w-50 truncate md:max-w-80">{title}</span>
        </div>
        <MasteryTally counts={counts} total={cards.length} round={round} />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Stage */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto">
          <div className="px-6 py-12 md:px-12 md:py-16">
            <div className="mx-auto w-full max-w-3xl">
              {current ? (
                <>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8A86] dark:text-[#686664]">
                    {current.lectureTitle}
                  </div>

                  <div className="mt-5">
                    <DeckMarkdown key={`${current.id}-front`} source={current.front} variant={variant} />
                  </div>

                  {!revealed ? (
                    <div className="mt-10 border-t border-[#F2F1EE] pt-8 dark:border-[#2C2B28]">
                      <p className="mb-5 max-w-xl text-[14px] leading-relaxed text-[#8A8A86] dark:text-[#686664]">
                        Answer it in your head first — out loud or on paper is better. Getting it wrong before you
                        read the answer is what makes the answer stick.
                      </p>
                      <button
                        type="button"
                        onClick={() => setRevealed(true)}
                        className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:brightness-110 dark:text-[#0F0F0D]"
                        style={{ background: 'var(--deck-accent)' }}
                      >
                        <Eye className="h-4 w-4" /> Show answer
                        <span className="ml-1 font-normal opacity-60">space</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mt-8 border-t border-[#F2F1EE] pt-8 dark:border-[#2C2B28]">
                        <DeckMarkdown key={`${current.id}-back`} source={current.back} variant={variant} />
                      </div>
                      <div className="mt-10 border-t border-[#F2F1EE] pt-8 dark:border-[#2C2B28]">
                        <p className="mb-4 text-[13px] text-[#8A8A86] dark:text-[#686664]">
                          How did that go? Be honest — anything short of solid comes back before the session ends.
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          <GradeButton label="Missed it" hint="1" tone="missed" onClick={() => grade('missed')} />
                          <GradeButton label="Shaky" hint="2" tone="shaky" onClick={() => grade('shaky')} />
                          <GradeButton label="Got it" hint="3" tone="secure" onClick={() => grade('secure')} />
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <SessionComplete
                  counts={counts}
                  total={cards.length}
                  done={done}
                  finishing={finishing}
                  finishLabel={finishLabel}
                  onFinish={onFinish}
                  onAgain={() => {
                    setStates(Object.fromEntries(cards.map(card => [card.id, 'untested' as CardState])));
                    setQueue(interleave(cards));
                    setPosition(0);
                    setRevealed(false);
                    setRound(1);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Concept rail — the metacognitive map: which ideas are secure, which
            are shaky, which have not been tried yet. */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-l border-[#F2F1EE] px-4 py-6 dark:border-[#2C2B28] lg:block xl:w-72">
          <div className="px-2 pb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8A86] dark:text-[#686664]">
            Concepts
          </div>
          <ConceptRail cards={cards} states={states} currentId={current?.id} onJump={jumpTo} />
        </aside>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#F2F1EE] px-5 py-2 text-[11px] text-[#8A8A86] dark:border-[#2C2B28] dark:text-[#686664] md:px-8">
        <span className="font-mono">
          {current ? `Round ${round} · ${position + 1} of ${queue.length}` : 'Session complete'}
        </span>
        <div className="hidden items-center gap-3 font-mono md:flex">
          <span>space reveal</span>
          <span className="opacity-30">|</span>
          <span>1 / 2 / 3 grade</span>
          <span className="opacity-30">|</span>
          <span>Esc close</span>
        </div>
        <button type="button" onClick={onExit} className="inline-flex items-center gap-1 md:hidden">
          <X className="h-3 w-3" /> Close
        </button>
      </div>
    </main>
  );
}

function MasteryTally({
  counts,
  total,
  round,
}: {
  counts: { secure: number; shaky: number; missed: number; untested: number };
  total: number;
  round: number;
}) {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap font-mono text-[11px] text-[#8A8A86] dark:text-[#686664]">
      <span className="flex items-center gap-1.5" title="Secure">
        <span className={`h-2 w-2 rounded-full border ${STATE_DOT.secure}`} />
        {counts.secure}
      </span>
      <span className="flex items-center gap-1.5" title="Shaky">
        <span className={`h-2 w-2 rounded-full border ${STATE_DOT.shaky}`} />
        {counts.shaky}
      </span>
      <span className="flex items-center gap-1.5" title="Missed">
        <span className={`h-2 w-2 rounded-full border ${STATE_DOT.missed}`} />
        {counts.missed}
      </span>
      <span className="opacity-40">·</span>
      <span>
        {counts.secure}/{total} secure
      </span>
      {round > 1 && <span className="opacity-60">· round {round}</span>}
    </div>
  );
}

function ConceptRail({
  cards,
  states,
  currentId,
  onJump,
}: {
  cards: SessionCard[];
  states: Record<string, CardState>;
  currentId?: string;
  onJump: (card: SessionCard) => void;
}) {
  const groups: { lecture: string; cards: SessionCard[] }[] = [];
  for (const card of cards) {
    const last = groups[groups.length - 1];
    if (last && last.lecture === card.lectureTitle) last.cards.push(card);
    else groups.push({ lecture: card.lectureTitle, cards: [card] });
  }

  return (
    <div className="space-y-4">
      {groups.map(group => (
        <div key={group.lecture}>
          <div className="px-2 pb-1 text-[11px] font-medium text-[#8A8A86] dark:text-[#686664]">{group.lecture}</div>
          <ul className="space-y-0.5">
            {group.cards.map(card => {
              const state = states[card.id] ?? 'untested';
              const isCurrent = card.id === currentId;
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => onJump(card)}
                    className={`flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left text-[12.5px] leading-snug transition-colors ${
                      isCurrent
                        ? 'bg-[#F2F1EE] text-[#1A1A1A] dark:bg-[#1A1A18] dark:text-[#F5F4F1]'
                        : 'text-[#8A8A86] hover:bg-[#F8F7F5] hover:text-[#52524E] dark:text-[#686664] dark:hover:bg-[#181816] dark:hover:text-[#9E9C98]'
                    }`}
                  >
                    <span className={`mt-[5px] h-2 w-2 shrink-0 rounded-full border ${STATE_DOT[state]}`} />
                    <span className="min-w-0">{card.topicLabel}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function GradeButton({
  label,
  hint,
  tone,
  onClick,
}: {
  label: string;
  hint: string;
  tone: CardState;
  onClick: () => void;
}) {
  const tones: Record<string, string> = {
    missed:
      'border-[#C4766A]/45 text-[#A3564A] hover:bg-[#C4766A]/10 dark:border-[#D4948A]/35 dark:text-[#D4948A] dark:hover:bg-[#D4948A]/10',
    shaky:
      'border-[#C4A06A]/45 text-[#94733E] hover:bg-[#C4A06A]/10 dark:border-[#D8BC8A]/35 dark:text-[#D8BC8A] dark:hover:bg-[#D8BC8A]/10',
    secure:
      'border-[#5D8E72]/45 text-[#446B55] hover:bg-[#5D8E72]/10 dark:border-[#7AAE8E]/35 dark:text-[#7AAE8E] dark:hover:bg-[#7AAE8E]/10',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[13px] font-semibold transition-colors ${tones[tone]}`}
    >
      {label}
      <span className="font-normal opacity-50">{hint}</span>
    </button>
  );
}

function SessionComplete({
  counts,
  total,
  done,
  onFinish,
  onAgain,
  finishLabel,
  finishing,
}: {
  counts: { secure: number; shaky: number; missed: number; untested: number };
  total: number;
  done: boolean;
  onFinish?: () => void;
  onAgain: () => void;
  finishLabel?: string;
  finishing?: boolean;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-[#1A1A1A] dark:text-[#F5F4F1]">
        {done ? 'Every concept secure' : 'Session complete'}
      </h2>
      <p className="mt-3 max-w-xl text-[16px] leading-[1.75] text-[#3A3A38] dark:text-[#C4C2BE]">
        You secured {counts.secure} of {total} concepts.{' '}
        {done
          ? 'Come back to this revision in a few days — the gap is what turns it into long-term memory.'
          : 'The ones you did not secure are the ones worth another pass.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {onFinish && (
          <button
            type="button"
            disabled={finishing}
            onClick={onFinish}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 dark:text-[#0F0F0D]"
            style={{ background: 'var(--deck-accent)' }}
          >
            <Check className="h-4 w-4" /> {finishLabel ?? 'Continue to the quiz'}
          </button>
        )}
        <button
          type="button"
          onClick={onAgain}
          className="inline-flex items-center gap-2 rounded-full border border-[#E5E4DF] px-6 py-3 font-mono text-sm text-[#52524E] transition-colors hover:bg-[#F2F1EE] dark:border-[#2C2B28] dark:text-[#9E9C98] dark:hover:bg-[#1A1A18]"
        >
          <RotateCcw className="h-4 w-4" /> Run it again
        </button>
      </div>
    </div>
  );
}
