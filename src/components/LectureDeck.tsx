'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, Lightbulb, Lock, X } from 'lucide-react';
import LectureFinalQuiz from '@/components/LectureFinalQuiz';
import { DeckMarkdown, VARIANT_THEME, Variant } from '@/components/reader/DeckMarkdown';
import { OptionButton, QUIZ_ACCENT, optionStateAfter, verdictFor, verdictMeta } from '@/components/quiz/QuizOption';
import { QuizMarkdown, QuizOptionMarkdown } from '@/components/revision/markdown';
import { shuffleChoices, shuffleOnce } from '@/lib/quizShuffle';
import { RevisionQuizQuestion } from '@/types';


type QuizChoice = { text: string; correct: boolean; explanation?: string };
type EmbeddedQuiz = {
  kind: 'quiz';
  prompt: string;
  multiple?: boolean;
  options: QuizChoice[];
  explanation?: string;
};

// End-of-lecture quiz is multiple-choice (single or multiple correct), matching
// the revision quiz shape so grading/rendering can be shared.
type FinalQuizQuestion = RevisionQuizQuestion;

type FinalQuiz = {
  kind: 'final';
  title: string;
  questions: FinalQuizQuestion[];
};

type Screen =
  | { kind: 'md'; markdown: string; title: string }
  | EmbeddedQuiz
  | FinalQuiz;


const VARIANT_BACK: Record<Variant, string> = { webd: '/webd/notes', daml: '/daml/notes', ml: '/ml/notes', go: '/go/notes', reactnative: '/react-native/notes', dsa: '/dsa/notes' };

// ────────────────────────────────────────────────────────────────────────────
// Parsing
// ────────────────────────────────────────────────────────────────────────────

function stripCodeFences(source: string) {
  // Pull out fenced quiz/finalquiz blocks before splitting screens.
  type Token = { mark: string; raw: string };
  const tokens: Token[] = [];
  //
  // Scanned line-by-line rather than with one regex: quiz payloads embed fenced
  // code inside their JSON strings (```go …```), and a non-greedy regex closes
  // the block at that first inner fence — truncating the JSON so it fails to
  // parse and spilling the rest of the payload onto a screen as raw text.
  const lines = source.split('\n');
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^```(quiz|finalquiz)\s*$/);
    if (!open) {
      out.push(lines[i]);
      continue;
    }
    // The block ends at the first bare ``` on its own line. Inner fences always
    // carry a language tag (```go), so a bare fence is unambiguous as the close.
    let close = -1;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^```\s*$/.test(lines[j])) {
        close = j;
        break;
      }
    }
    if (close === -1) {
      out.push(lines[i]);
      continue;
    }
    const kind = open[1];
    const mark = `\u0000QUIZ_${tokens.length}_${kind.toUpperCase()}\u0000`;
    tokens.push({ mark, raw: lines.slice(i + 1, close).join('\n').trim() });
    out.push('', mark, '');
    i = close;
  }

  return { replaced: out.join('\n'), tokens };
}

function parseQuizPayload(raw: string): EmbeddedQuiz | null {
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    if (typeof data.prompt !== 'string' || !Array.isArray(data.options)) return null;
    return {
      kind: 'quiz',
      prompt: data.prompt,
      multiple: Boolean(data.multiple),
      options: data.options
        .filter((opt: unknown) => opt && typeof opt === 'object')
        .map((opt: { text?: unknown; correct?: unknown; explanation?: unknown }) => ({
          text: String(opt.text ?? ''),
          correct: Boolean(opt.correct),
          explanation: typeof opt.explanation === 'string' ? opt.explanation : undefined,
        })),
      explanation: typeof data.explanation === 'string' ? data.explanation : undefined,
    };
  } catch {
    return null;
  }
}

function parseFinalPayload(raw: string): FinalQuiz | null {
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    const list = Array.isArray(data.questions) ? data.questions : Array.isArray(data) ? data : null;
    if (!list) return null;
    const questions = list
      .filter((q: unknown) => q && typeof q === 'object')
      .map((q: Record<string, unknown>, index: number) => {
        const options = Array.isArray(q.options)
          ? q.options
              .filter((o: unknown) => o && typeof o === 'object')
              .map((o: Record<string, unknown>, optIndex: number) => ({
                id: typeof o.id === 'string' ? o.id : String.fromCharCode(97 + optIndex),
                text: String(o.text ?? ''),
              }))
          : [];
        return {
          id: typeof q.id === 'string' ? q.id : `q${index + 1}`,
          type: q.type === 'multiple_correct' ? 'multiple_correct' : 'single_correct',
          prompt: String(q.prompt ?? ''),
          codeSnippet: typeof q.codeSnippet === 'string' ? q.codeSnippet : null,
          options,
          correctOptionIds: Array.isArray(q.correctOptionIds) ? q.correctOptionIds.map((id: unknown) => String(id)) : [],
          explanation: typeof q.explanation === 'string' ? q.explanation : '',
          example: typeof q.example === 'string' ? q.example : '',
          sourceTopics: [],
        } as FinalQuizQuestion;
      })
      // Drop malformed questions so one bad entry can't blank the quiz screen.
      .filter((q: FinalQuizQuestion) => q.prompt && q.options.length >= 2 && q.correctOptionIds.length > 0);
    if (questions.length === 0) return null;
    return {
      kind: 'final',
      title: typeof data.title === 'string' ? data.title : 'Quiz',
      questions,
    };
  } catch {
    return null;
  }
}

function extractTitle(markdown: string, fallback: string) {
  const h2 = markdown.match(/^##\s+(.+)$/m);
  if (h2) return h2[1].trim();
  const h3 = markdown.match(/^###\s+(.+)$/m);
  if (h3) return h3[1].trim();
  return fallback;
}

function buildScreens(content: string): Screen[] {
  // Strip the top H1 (rendered in header), strip duration line, then split.
  let body = content
    .replace(/^#\s+.+\n?/, '')
    .replace(/^\*\*Duration:[^\n]*\n?/m, '')
    .replace(/^---\s*\n/, '');
  const { replaced, tokens } = stripCodeFences(body);
  body = replaced;

  // Screen boundaries: --- on its own line.
  const chunks = body.split(/\n\s*---\s*\n/).map(chunk => chunk.trim()).filter(Boolean);

  const screens: Screen[] = [];
  let screenIndex = 0;

  for (const chunk of chunks) {
    // A chunk may contain a single quiz token (split it into pre-md + quiz screen).
    const markerRegex = /\u0000QUIZ_(\d+)_(QUIZ|FINALQUIZ)\u0000/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = markerRegex.exec(chunk))) {
      const before = chunk.slice(lastIndex, match.index).trim();
      if (before) {
        screens.push({
          kind: 'md',
          markdown: before,
          title: extractTitle(before, `Screen ${++screenIndex}`),
        });
      }
      const token = tokens[Number(match[1])];
      if (token) {
        if (match[2] === 'QUIZ') {
          const quiz = parseQuizPayload(token.raw);
          if (quiz) screens.push(quiz);
        } else {
          const final = parseFinalPayload(token.raw);
          if (final) screens.push(final);
        }
      }
      lastIndex = match.index + match[0].length;
    }
    const tail = chunk.slice(lastIndex).trim();
    if (tail) {
      screens.push({
        kind: 'md',
        markdown: tail,
        title: extractTitle(tail, `Screen ${++screenIndex}`),
      });
    }
  }

  return screens.length > 0 ? screens : [{ kind: 'md', markdown: content, title: 'Lecture' }];
}

// ────────────────────────────────────────────────────────────────────────────
// Chapters
// ────────────────────────────────────────────────────────────────────────────
//
// A 19-screen deck reads as a wall until the learner can see that the teaching
// actually ends at screen 13 and the rest is practice and reference. Screens are
// grouped into at most four contiguous chapters so the progress rail, the
// counter, and the boundary card can all speak in "3 of 5 in Practice" terms
// instead of one intimidating running total.
//
// Grouping is inferred from the section headings lectures already use, so no
// existing markdown has to be touched.

type ChapterId = 'lecture' | 'practice' | 'review' | 'wrap' | 'quiz';
type Chapter = { id: ChapterId; label: string; start: number; count: number };

const CHAPTER_LABEL: Record<ChapterId, string> = {
  lecture: 'Lecture',
  practice: 'Practice',
  review: 'Review',
  wrap: 'Wrap-up',
  quiz: 'Quiz',
};

// Headings carry decoration the matchers shouldn't have to know about: emoji
// ("## 💪 Practice Exercises"), and ordinals ("## 9. Hands-on build: …").
// Both are stripped before any heading is matched.
function headingKey(title: string) {
  return title
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^\d+[.)]\s*/, '')
    .trim();
}

// "Now you do it" openers. Unambiguous wherever they land — a practice day can
// start handing out tasks on screen two — so these are matched at any position.
const PRACTICE_HEADING = /^(hands[-\s]?on|your turn|practice|task\s*\d|problem\s*\d|app\s*\d|exercises?\b|challenge|mini[-\s]?project|workshop|drill|do it yourself|build it yourself|let'?s build)/i;
// "Now consolidate it" openers. A lecture with no build section still turns here
// from teaching to applying, so this is the fallback boundary. Only trusted in
// the back half: a mid-lecture "Common mistakes with the event object" is still
// teaching, and cutting there would move the boundary far too early.
const REVIEW_HEADING = /^(common mistakes|mistakes\b|gotchas|pitfalls|debugging|debug map|troubleshooting|interview|check your understanding|self[-\s]?check|review your work|test yourself)/i;
// Reference tail — only counted as a chapter when it runs unbroken to the end.
const WRAP_HEADING = /^(cheat\s?sheet|(quick|command|api|full)\s+reference|recap|summary|day\s*\d+\s+summary|key takeaways?|what'?s next|what comes next|what you should now (understand|know)|what you now know|tomorrow|wrap[-\s]?up|next up|further reading|additional resources|resources|going further|where to go|quiz answers)/i;

function buildChapters(screens: Screen[]): Chapter[] {
  const total = screens.length;

  // The final quiz is a screen kind, not a heading, so this boundary is exact.
  const finalIndex = screens.findIndex(s => s.kind === 'final');
  const quizStart = finalIndex === -1 ? total : finalIndex;

  // Where the teaching stops. Whichever of the two families comes first wins,
  // and the winning family names the chapter: a lecture that ends in a build
  // reads "Practice", one that ends in mistakes-and-reps reads "Review".
  let applyStart = -1;
  let applyId: ChapterId = 'practice';
  for (let i = 0; i < quizStart; i++) {
    const s = screens[i];
    if (s.kind !== 'md') continue;
    const key = headingKey(s.title);
    if (PRACTICE_HEADING.test(key)) {
      applyStart = i;
      applyId = 'practice';
      break;
    }
    if (REVIEW_HEADING.test(key) && i >= total * 0.5) {
      applyStart = i;
      applyId = 'review';
      break;
    }
  }

  // Walk back from the quiz while headings keep looking like reference material.
  // Stopping at the first non-match keeps a "Cheat sheet" that sits mid-lecture
  // out of the tail, and the guard leaves the apply chapter at least one screen.
  let wrapStart = quizStart;
  for (let i = quizStart - 1; i > Math.max(applyStart, 0); i--) {
    const s = screens[i];
    if (s.kind === 'md' && WRAP_HEADING.test(headingKey(s.title))) wrapStart = i;
    else break;
  }

  // Later writes win, so a deck that opens straight into tasks is Practice from
  // screen one rather than carrying an empty Lecture chapter.
  const marks = new Map<number, ChapterId>();
  marks.set(0, 'lecture');
  if (applyStart >= 0) marks.set(applyStart, applyId);
  if (wrapStart < quizStart) marks.set(wrapStart, 'wrap');
  if (quizStart < total) marks.set(quizStart, 'quiz');

  const starts = [...marks.keys()].sort((a, b) => a - b);
  return starts.map((start, i) => {
    const id = marks.get(start)!;
    return { id, label: CHAPTER_LABEL[id], start, count: (starts[i + 1] ?? total) - start };
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Interactive containers (:::hints / :::solution) inside md screens
// ────────────────────────────────────────────────────────────────────────────

type Segment = { type: 'md' | 'hints' | 'solution'; content: string };

function splitSegments(markdown: string): Segment[] {
  const lines = markdown.split('\n');
  const segments: Segment[] = [];
  let buffer: string[] = [];
  let mode: Segment['type'] = 'md';
  let inFence = false;

  const flush = (type: Segment['type']) => {
    const content = buffer.join('\n');
    if (content.trim()) segments.push({ type, content });
    buffer = [];
  };

  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const trimmed = line.trim();
    if (!inFence && mode === 'md' && (trimmed === ':::hints' || trimmed === ':::solution')) {
      flush('md');
      mode = trimmed === ':::hints' ? 'hints' : 'solution';
      continue;
    }
    if (!inFence && mode !== 'md' && trimmed === ':::') {
      flush(mode);
      mode = 'md';
      continue;
    }
    buffer.push(line);
  }
  flush(mode);
  return segments;
}

// ────────────────────────────────────────────────────────────────────────────
// Code block (markdown)
// ────────────────────────────────────────────────────────────────────────────

function HintsBlock({ content, variant }: { content: string; variant: Variant }) {
  const accent = VARIANT_THEME[variant];
  const [open, setOpen] = useState(false);
  return (
    <div className="my-6 rounded-2xl border border-[#E5E4DF] dark:border-[#2C2B28] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[#F8F7F5] dark:hover:bg-[#1A1A18]"
        style={{ background: open ? accent.accentSoft : undefined }}
      >
        <span className="inline-flex items-center gap-2.5 text-[14.5px] font-semibold" style={{ color: accent.accentDeep }}>
          <Lightbulb className="w-4 h-4" style={{ color: accent.accent }} />
          {open ? 'Hints' : 'Stuck? Show hints'}
        </span>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform text-[#8A8A86]"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>
      {open && (
        <div className="px-5 pt-4 pb-2 border-t border-[#E5E4DF] dark:border-[#2C2B28] animate-in fade-in slide-in-from-top-1 duration-200">
          <DeckMarkdown source={content} variant={variant} />
        </div>
      )}
    </div>
  );
}

const SOLUTION_PHRASE = 'i want to see solution';

function SolutionBlock({ content, variant }: { content: string; variant: Variant }) {
  const accent = VARIANT_THEME[variant];
  const [unlocked, setUnlocked] = useState(false);
  const [attempt, setAttempt] = useState('');
  const matches = attempt.trim().toLowerCase().replace(/\s+/g, ' ') === SOLUTION_PHRASE;

  if (unlocked) {
    return (
      <div className="my-6 rounded-2xl border border-[#E5E4DF] dark:border-[#2C2B28] overflow-hidden">
        <div
          className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[#E5E4DF] dark:border-[#2C2B28]"
          style={{ background: accent.accentSoft }}
        >
          <span className="inline-flex items-center gap-2.5 text-[14.5px] font-semibold" style={{ color: accent.accentDeep }}>
            <Check className="w-4 h-4" style={{ color: accent.accent }} />
            Solution
          </span>
          <button
            type="button"
            onClick={() => { setUnlocked(false); setAttempt(''); }}
            className="text-[12px] underline text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98]"
          >
            Hide
          </button>
        </div>
        <div className="px-5 pt-4 pb-2">
          <DeckMarkdown source={content} variant={variant} />
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-2xl border border-dashed border-[#D5D4CF] dark:border-[#3C3B38] px-5 py-5 bg-[#FAFAF8] dark:bg-[#161614]">
      <div className="inline-flex items-center gap-2.5 text-[14.5px] font-semibold text-[#52524E] dark:text-[#C4C2BE] mb-2">
        <Lock className="w-4 h-4 text-[#8A8A86]" />
        Solution — locked
      </div>
      <p className="text-[13.5px] leading-relaxed text-[#8A8A86] dark:text-[#9E9C98] mb-4">
        Peeking before a real attempt wastes the rep. If you&apos;ve genuinely tried, type{' '}
        <em className="font-semibold not-italic text-[#52524E] dark:text-[#C4C2BE]">&ldquo;I want to see solution&rdquo;</em> to unlock the full code.
      </p>
      <form
        className="flex flex-col sm:flex-row gap-2.5"
        onSubmit={e => {
          e.preventDefault();
          if (matches) setUnlocked(true);
        }}
      >
        <input
          type="text"
          value={attempt}
          onChange={e => setAttempt(e.target.value)}
          placeholder="I want to see solution"
          className="flex-1 rounded-full border border-[#E5E4DF] dark:border-[#2C2B28] bg-white dark:bg-[#1A1A18] px-4 py-2.5 text-[14px] text-[#1A1A1A] dark:text-[#F5F4F1] placeholder:text-[#B5B4AF] dark:placeholder:text-[#52514E] focus:outline-none focus:ring-2"
          style={{ ['--tw-ring-color' as string]: accent.ring }}
        />
        <button
          type="submit"
          disabled={!matches}
          className="px-6 py-2.5 rounded-full text-[13.5px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
          style={{ background: accent.accent, color: '#fff' }}
        >
          Unlock
        </button>
      </form>
    </div>
  );
}

function ScreenBody({ source, variant }: { source: string; variant: Variant }) {
  const segments = useMemo(() => splitSegments(source), [source]);
  return (
    <>
      {segments.map((segment, i) =>
        segment.type === 'md' ? (
          <DeckMarkdown key={i} source={segment.content} variant={variant} />
        ) : segment.type === 'hints' ? (
          <HintsBlock key={i} content={segment.content} variant={variant} />
        ) : (
          <SolutionBlock key={i} content={segment.content} variant={variant} />
        )
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Embedded quiz screen
// ────────────────────────────────────────────────────────────────────────────

function QuickCheckScreen({ quiz, variant, onNext }: { quiz: EmbeddedQuiz; variant: Variant; onNext: () => void }) {
  const accent = QUIZ_ACCENT[variant];
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const hasSelection = selected.size > 0;

  // Randomise option order per page load, after mount so SSR still matches.
  // Cached by prompt, so paging back to this screen shows the same order.
  const [mixed, setMixed] = useState<{ choices: QuizChoice[]; explanation?: string } | null>(null);
  useEffect(() => {
    setMixed(shuffleOnce(`quick:${quiz.prompt}`, () => shuffleChoices(quiz.options, quiz.explanation)));
    setSelected(new Set());
    setChecked(false);
  }, [quiz]);
  const options = mixed?.choices ?? quiz.options;
  const explanation = mixed ? mixed.explanation : quiz.explanation;

  const correctIds = options.map((opt, i) => (opt.correct ? String(i) : '')).filter(Boolean);
  const selectedIds = [...selected].map(String);
  const verdict = verdictFor(correctIds, selectedIds);
  const meta = verdictMeta(verdict);

  function toggle(index: number) {
    if (checked) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (quiz.multiple) {
        if (next.has(index)) next.delete(index);
        else next.add(index);
      } else {
        next.clear();
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase mb-5 px-3 py-1.5 rounded-full"
        style={{ background: accent.soft, color: accent.deep }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent.accent }} />
        Quick check
      </div>
      {/* The prompt is a headline, but any code inside it must stay readable —
          so the fence drops back to normal body weight and near-prose size. */}
      <div className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] dark:text-[#F5F4F1] mb-8 leading-tight tracking-tight [&_code]:text-[0.85em] [&_pre]:mt-5 [&_pre]:px-5 [&_pre]:py-4 [&_pre]:text-[14px] [&_pre]:font-normal [&_pre]:tracking-normal">
        <QuizMarkdown text={quiz.prompt} />
      </div>
      <div className="space-y-2.5 mb-6">
        {options.map((opt, i) => {
          const isSelected = selected.has(i);
          const state = checked ? optionStateAfter(opt.correct, isSelected) : isSelected ? 'selected' : 'idle';
          return (
            <OptionButton
              key={i}
              index={i}
              state={state}
              accent={accent}
              multiple={quiz.multiple}
              disabled={checked}
              onClick={() => toggle(i)}
            >
              <QuizOptionMarkdown text={opt.text} />
            </OptionButton>
          );
        })}
      </div>
      {!checked && quiz.multiple && (
        <p className="mb-6 -mt-2 text-[12px] text-[#8A8A86] dark:text-[#686664]">Select all that apply.</p>
      )}
      {!checked ? (
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => setChecked(true)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[15px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              background: `linear-gradient(to right, ${accent.accent}, ${accent.deep})`,
              color: '#fff',
              boxShadow: `0 4px 14px ${accent.ring}`,
            }}
          >
            Check answer
          </button>
          {!hasSelection && (
            <span className="text-[13px] text-[#8A8A86] dark:text-[#686664]">Select an option to enable</span>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div
            className="rounded-2xl p-6 text-[15.5px] leading-relaxed border animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ background: meta.tone.bg, borderColor: meta.tone.border, color: meta.tone.text }}
          >
            <div className="font-bold mb-2 text-[16px] uppercase tracking-wider">{meta.label}</div>
            {explanation && (
              <div className="text-[15px] leading-relaxed opacity-95">
                <QuizMarkdown text={explanation} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[15px] font-semibold transition-all hover:brightness-110"
            style={{
              background: `linear-gradient(to right, ${accent.accent}, ${accent.deep})`,
              color: '#fff',
              boxShadow: `0 4px 14px ${accent.ring}`,
            }}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}


// ────────────────────────────────────────────────────────────────────────────
// Chapter chrome
// ────────────────────────────────────────────────────────────────────────────

// Segmented progress: one track per chapter, sized by how many screens it holds,
// so the shape of the deck is visible before the learner walks it. Each track is
// a jump target.
function ChapterRail({
  chapters,
  activeChapter,
  index,
  onJump,
}: {
  chapters: Chapter[];
  activeChapter: number;
  index: number;
  onJump: (screen: number) => void;
}) {
  return (
    <div className="shrink-0 px-5 md:px-8 pt-2 pb-1.5 border-b border-[#F2F1EE] dark:border-[#2C2B28]">
      <div className="flex items-start gap-2">
        {chapters.map((chapter, i) => {
          const done = Math.min(Math.max(index - chapter.start + 1, 0), chapter.count);
          const isCurrent = i === activeChapter;
          const isPast = i < activeChapter;
          return (
            <button
              key={`${chapter.id}-${chapter.start}`}
              type="button"
              onClick={() => onJump(chapter.start)}
              title={`${chapter.label} · ${chapter.count} screen${chapter.count === 1 ? '' : 's'}`}
              aria-label={`Jump to ${chapter.label}`}
              aria-current={isCurrent ? 'step' : undefined}
              className="min-w-0 text-left cursor-pointer group"
              style={{ flexGrow: chapter.count, flexShrink: 1, flexBasis: 0 }}
            >
              <div className="h-1 rounded-full overflow-hidden bg-[#F2F1EE] dark:bg-[#232321] transition-colors group-hover:bg-[#E5E4DF] dark:group-hover:bg-[#2C2B28]">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${(done / chapter.count) * 100}%`,
                    background: isPast
                      ? 'color-mix(in srgb, var(--deck-accent) 42%, transparent)'
                      : 'var(--deck-accent)',
                  }}
                />
              </div>
              <div
                className={`hidden md:block mt-1.5 text-[10px] tracking-[0.14em] uppercase truncate transition-colors ${
                  isCurrent
                    ? 'font-semibold'
                    : isPast
                      ? 'font-medium text-[#8A8A86] dark:text-[#686664]'
                      : 'font-medium text-[#C0BFBA] dark:text-[#4A4946]'
                }`}
                style={isCurrent ? { color: 'var(--deck-accent)' } : undefined}
              >
                {chapter.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const CHAPTER_INTRO: Partial<Record<ChapterId, { title: string; body: string }>> = {
  practice: {
    title: 'That was the lecture — practice starts here',
    body: 'No new concepts from this point on. What follows applies what you just read: try it yourself first, then compare. Take these screens at your own pace.',
  },
  review: {
    title: 'That was the lecture — review starts here',
    body: 'The teaching ends here. What follows tightens it up: the mistakes to avoid, the answers to give, and reps to prove you can produce it, not just recognise it.',
  },
  wrap: {
    title: 'Wrap-up',
    body: 'Reference material — skim it now, come back to it later.',
  },
};

// Shown once, on the first screen of a chapter, so the moment the teaching ends
// is impossible to miss.
function ChapterIntro({ chapter, doneCount }: { chapter: Chapter; doneCount: number }) {
  const intro = CHAPTER_INTRO[chapter.id];
  if (!intro) return null;
  return (
    <div
      className="mb-10 rounded-2xl border px-5 py-4 md:px-6 md:py-5 animate-in fade-in slide-in-from-bottom-1 duration-300"
      style={{
        borderColor: 'color-mix(in srgb, var(--deck-accent) 30%, transparent)',
        background: 'color-mix(in srgb, var(--deck-accent) 8%, transparent)',
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full"
          style={{ background: 'color-mix(in srgb, var(--deck-accent) 18%, transparent)' }}
        >
          <Check className="w-3.5 h-3.5" style={{ color: 'var(--deck-accent)' }} />
        </span>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold mb-1" style={{ color: 'var(--deck-accent)' }}>
            {intro.title}
          </div>
          <p className="text-[13.5px] leading-relaxed text-[#52524E] dark:text-[#9E9C98]">{intro.body}</p>
          <p className="mt-2 text-[11.5px] font-mono text-[#8A8A86] dark:text-[#686664]">
            {doneCount} screen{doneCount === 1 ? '' : 's'} behind you · {chapter.count} in {chapter.label.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Top-level deck
// ────────────────────────────────────────────────────────────────────────────

type Note = { id: string; title: string; phase: string; day: string; duration: string; file: string };

export default function LectureDeck({
  note,
  content,
  variant,
}: {
  note: Note;
  content: string;
  variant: Variant;
}) {
  const router = useRouter();
  const accent = VARIANT_THEME[variant];
  const screens = useMemo(() => buildScreens(content), [content]);
  const chapters = useMemo(() => buildChapters(screens), [screens]);
  const [index, setIndex] = useState(0);
  const [escHint, setEscHint] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const escRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const escTimer = useRef<number | null>(null);
  const screen = screens[index];

  const exit = useCallback(() => router.push(VARIANT_BACK[variant]), [router, variant]);

  const next = useCallback(() => {
    setIndex(i => Math.min(i + 1, screens.length - 1));
  }, [screens.length]);
  const prev = useCallback(() => {
    setIndex(i => Math.max(i - 1, 0));
  }, []);

  // Auto-focus container so keyboard works immediately, without clicking.
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Reset scroll and refocus on screen change.
  useEffect(() => {
    screenRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    containerRef.current?.focus();
  }, [index]);

  // Keyboard navigation.
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (target?.isContentEditable ?? false) ||
        target?.closest('.cm-editor') !== null;

      // Esc-to-exit works everywhere, including on the quiz screen.
      if (event.key === 'Escape') {
        event.preventDefault();
        escRef.current += 1;
        setEscHint(true);
        if (escTimer.current) window.clearTimeout(escTimer.current);
        if (escRef.current >= 2) {
          exit();
          return;
        }
        escTimer.current = window.setTimeout(() => {
          escRef.current = 0;
          setEscHint(false);
        }, 1400);
        return;
      }

      if (isTyping) return;

      // On the quiz screen, Space is left alone: it activates the focused option
      // button, so stealing it for "next screen" would jump away mid-answer.
      // Arrows still navigate — they are never used to pick an option.
      if (quizMode && event.key === ' ') return;

      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        next();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        prev();
      } else if (event.key === 'Home') {
        event.preventDefault();
        setIndex(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        setIndex(screens.length - 1);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [exit, next, prev, screens.length, quizMode]);

  const progress = ((index + 1) / screens.length) * 100;

  const chaptered = chapters.length > 1;
  let activeChapter = 0;
  for (let i = 0; i < chapters.length; i++) {
    if (index >= chapters[i].start) activeChapter = i;
  }
  const chapter = chapters[activeChapter];
  const atChapterStart = chaptered && activeChapter > 0 && index === chapter.start;

  return (
    <main
      ref={containerRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-white dark:bg-[#0F0F0D] outline-none flex flex-col lecture-deck-root"
      style={{
        // Inputs only — globals.css picks which one becomes --deck-accent per theme.
        ['--deck-accent-light' as string]: accent.accent,
        ['--deck-accent-dark' as string]: accent.accentLift,
      }}
    >
      {/* The --lecture-* variables consumed by OptionButton live in globals.css
          under .lecture-deck-root. They are deliberately not set here: an inline
          custom property outranks every selector, so defining the light values
          on this element left the dark overrides dead and pinned quiz option
          cards to their light surface in dark mode. */}
      {/* Top bar — minimal */}
      <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-3 border-b border-[#F2F1EE] dark:border-[#2C2B28] shrink-0">
        <button
          onClick={exit}
          className="inline-flex items-center gap-1.5 text-[12px] text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98]"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Notes
        </button>
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A8A86] dark:text-[#686664]">
          <span>{note.day}</span>
          <span className="opacity-40">·</span>
          <span className="truncate max-w-50 md:max-w-80">{note.title}</span>
        </div>
        {/* Counting inside the chapter, not across the whole deck: "Practice 1/3"
            is a promise the learner can finish; "14 / 19" is a wall. */}
        <div className="text-[11px] font-mono text-[#8A8A86] dark:text-[#686664] whitespace-nowrap">
          {chaptered ? (
            <>
              <span className="font-sans font-semibold tracking-wide" style={{ color: 'var(--deck-accent)' }}>
                {chapter.label}
              </span>
              <span className="mx-1.5 opacity-40">·</span>
              {index - chapter.start + 1} / {chapter.count}
            </>
          ) : (
            <>
              {index + 1} / {screens.length}
            </>
          )}
        </div>
      </div>

      {/* Progress */}
      {chaptered ? (
        <ChapterRail chapters={chapters} activeChapter={activeChapter} index={index} onJump={setIndex} />
      ) : (
        <div className="h-0.5 bg-[#F2F1EE] dark:bg-[#232321] shrink-0">
          <div
            className="h-full transition-all duration-200"
            style={{ width: `${progress}%`, background: 'var(--deck-accent)' }}
          />
        </div>
      )}

      {/* Stage */}
      <div ref={screenRef} className="flex-1 overflow-y-auto">
        <div className="min-h-full px-6 md:px-12 py-12 md:py-16 flex">
          <div className="m-auto w-full">
            {screen.kind === 'md' && (
              <div className="mx-auto w-full max-w-3xl">
                {atChapterStart && <ChapterIntro key={`intro-${index}`} chapter={chapter} doneCount={chapter.start} />}
                <ScreenBody key={index} source={screen.markdown} variant={variant} />
              </div>
            )}
            {screen.kind === 'quiz' && (
              <QuickCheckScreen quiz={screen} variant={variant} onNext={next} />
            )}
            {screen.kind === 'final' && (
              <LectureFinalQuiz
                questions={screen.questions}
                title={screen.title}
                variant={variant}
                onQuizModeChange={setQuizMode}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-5 md:px-8 py-2 border-t border-[#F2F1EE] dark:border-[#2C2B28] shrink-0 flex items-center justify-between text-[11px] text-[#8A8A86] dark:text-[#686664]">
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            disabled={index === 0}
            className="inline-flex items-center gap-1 hover:text-[#52524E] dark:hover:text-[#9E9C98] disabled:opacity-30"
          >
            <ArrowLeft className="w-3 h-3" /> Prev
          </button>
          <button
            onClick={next}
            disabled={index === screens.length - 1}
            className="inline-flex items-center gap-1 hover:text-[#52524E] dark:hover:text-[#9E9C98] disabled:opacity-30"
          >
            Next <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-3 font-mono">
          {chaptered && (
            <>
              <span className="opacity-70">
                {index + 1} of {screens.length} total
              </span>
              <span className="opacity-30">|</span>
            </>
          )}
          <span>←/→ navigate</span>
          <span>Esc esc to exit</span>
        </div>
        <div className="md:hidden">
          <button onClick={exit} className="inline-flex items-center gap-1">
            <X className="w-3 h-3" /> Close
          </button>
        </div>
      </div>

      {escHint && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/80 text-white text-[11px] font-mono z-60">
          Press Esc again to exit
        </div>
      )}
    </main>
  );
}
