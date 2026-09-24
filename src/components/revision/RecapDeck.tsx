'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, X } from 'lucide-react';

import { DeckMarkdown, VARIANT_THEME, Variant } from '@/components/reader/DeckMarkdown';

// The recap is read the way a lecture is read: one idea per screen, with the
// lectures as chapters. A revision that condenses three four-hour lectures is
// about an hour of material — as one scroll it reads as a wall, and the learner
// never knows how much is left.

interface RecapScreen {
  /** Index into `chapters`. */
  chapter: number;
  title: string;
  markdown: string;
}

interface RecapChapter {
  label: string;
  start: number;
  count: number;
}

interface ParsedRecap {
  screens: RecapScreen[];
  chapters: RecapChapter[];
}

// Split on the headings the generator writes: `##` per lecture, `###` per topic.
// Fenced code can contain `#` lines, so fences are tracked and skipped.
export function parseRecap(markdown: string): ParsedRecap {
  const lines = markdown.split('\n');
  const screens: RecapScreen[] = [];
  const chapters: RecapChapter[] = [];
  let buffer: string[] = [];
  let inFence = false;

  const flush = () => {
    const body = buffer.join('\n').trim();
    buffer = [];
    if (!body || chapters.length === 0) return;
    const heading = /^###\s+(.*\S)\s*$/m.exec(body);
    screens.push({
      chapter: chapters.length - 1,
      title: heading ? heading[1].replace(/[*`_]/g, '').trim() : chapters[chapters.length - 1].label,
      markdown: body,
    });
  };

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      buffer.push(line);
      continue;
    }
    if (!inFence) {
      const lecture = /^##\s+(?!#)(.*\S)\s*$/.exec(line);
      if (lecture) {
        flush();
        chapters.push({ label: lecture[1].replace(/[*`_]/g, '').trim(), start: screens.length, count: 0 });
        continue;
      }
      if (/^###\s+/.test(line)) {
        flush();
      }
    }
    buffer.push(line);
  }
  flush();

  chapters.forEach((chapter, index) => {
    const next = index + 1 < chapters.length ? chapters[index + 1].start : screens.length;
    chapter.count = Math.max(next - chapter.start, 0);
  });

  // Anything that doesn't use the expected heading shape still has to be
  // readable, so fall back to a single screen rather than rendering nothing.
  if (screens.length === 0) {
    return {
      screens: [{ chapter: 0, title: 'Recap', markdown }],
      chapters: [{ label: 'Recap', start: 0, count: 1 }],
    };
  }
  return { screens, chapters: chapters.filter(chapter => chapter.count > 0) };
}

export default function RecapDeck({
  markdown,
  variant,
  eyebrow,
  onFinish,
  onExit,
  finishLabel,
  finishing,
  title,
}: {
  markdown: string;
  variant: Variant;
  eyebrow: string;
  /** Shown in the top bar so the reader stands on its own, full screen. */
  title: string;
  /** Omitted once the stage is already complete. */
  onFinish?: () => void;
  onExit: () => void;
  finishLabel?: string;
  finishing?: boolean;
}) {
  const { screens, chapters } = useMemo(() => parseRecap(markdown), [markdown]);
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const atEnd = index === screens.length - 1;
  const next = useCallback(() => setIndex(i => Math.min(i + 1, screens.length - 1)), [screens.length]);
  const prev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), []);

  // A new screen starts at the top; carrying the old scroll position over is
  // disorienting when sections differ in length.
  useEffect(() => {
    stageRef.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onExit();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, onExit]);

  const screen = screens[index];
  const activeChapter = chapters[screen.chapter] ?? chapters[0];
  const withinChapter = index - (activeChapter?.start ?? 0) + 1;

  const theme = VARIANT_THEME[variant];

  return (
    // `lecture-deck-root` carries the light/dark switch for --deck-accent; only
    // the two inputs are set inline (see the note in globals.css).
    <main
      className="lecture-deck-root fixed inset-0 z-50 flex flex-col bg-white outline-none dark:bg-[#0F0F0D]"
      style={{
        ['--deck-accent-light' as string]: theme.accent,
        ['--deck-accent-dark' as string]: theme.accentLift,
      }}
    >
      {/* Top bar — where you are, in the lecture's own terms */}
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
        <span className="whitespace-nowrap font-mono text-[11px] text-[#8A8A86] dark:text-[#686664]">
          {activeChapter && chapters.length > 1 ? (
            <>
              <span className="font-sans font-semibold tracking-wide" style={{ color: 'var(--deck-accent)' }}>
                {activeChapter.label.replace(/:.*$/, '')}
              </span>
              <span className="mx-1.5 opacity-40">·</span>
              {withinChapter} / {activeChapter.count}
            </>
          ) : (
            <>
              {index + 1} / {screens.length}
            </>
          )}
        </span>
      </div>

      {/* Chapter rail — one segment per lecture, width proportional to its length */}
      <div className="shrink-0 border-b border-[#F2F1EE] px-5 pb-1.5 pt-2 dark:border-[#2C2B28] md:px-8">
        <div className="flex items-start gap-2">
          {chapters.map((chapter, i) => {
            const done = Math.min(Math.max(index - chapter.start + 1, 0), chapter.count);
            const isCurrent = i === screen.chapter;
            const isPast = i < screen.chapter;
            return (
              <button
                key={`${chapter.label}-${chapter.start}`}
                type="button"
                onClick={() => setIndex(chapter.start)}
                title={`${chapter.label} · ${chapter.count} screen${chapter.count === 1 ? '' : 's'}`}
                aria-label={`Jump to ${chapter.label}`}
                aria-current={isCurrent ? 'step' : undefined}
                className="group min-w-0 cursor-pointer text-left"
                style={{ flexGrow: chapter.count, flexShrink: 1, flexBasis: 0 }}
              >
                <div className="h-1 overflow-hidden rounded-full bg-[#F2F1EE] transition-colors group-hover:bg-[#E5E4DF] dark:bg-[#232321] dark:group-hover:bg-[#2C2B28]">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${chapter.count ? (done / chapter.count) * 100 : 0}%`,
                      background: isPast ? 'color-mix(in srgb, var(--deck-accent) 42%, transparent)' : 'var(--deck-accent)',
                    }}
                  />
                </div>
                <div
                  className={`mt-1.5 hidden truncate text-[10px] uppercase tracking-[0.14em] transition-colors md:block ${
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

      {/* Stage */}
      <div ref={stageRef} className="flex-1 overflow-y-auto">
        <div className="px-6 py-12 md:px-12 md:py-16">
          <div className="mx-auto w-full max-w-4xl">
            <DeckMarkdown key={index} source={screen.markdown} variant={variant} />

            {atEnd && onFinish && (
              <div className="mt-12 border-t border-[#F2F1EE] pt-8 dark:border-[#2C2B28]">
                <button
                  type="button"
                  disabled={finishing}
                  onClick={onFinish}
                  // The dark-mode accent is the lifted (light) hue, so the label
                  // has to flip with it or it sits white-on-pale.
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 dark:text-[#0F0F0D]"
                  style={{ background: 'var(--deck-accent)' }}
                >
                  <Check className="h-4 w-4" /> {finishLabel ?? "I've read it — continue"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer — movement and the keyboard contract */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#F2F1EE] px-5 py-2 text-[11px] text-[#8A8A86] dark:border-[#2C2B28] dark:text-[#686664] md:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            className="inline-flex items-center gap-1 hover:text-[#52524E] disabled:opacity-30 dark:hover:text-[#9E9C98]"
          >
            <ArrowLeft className="h-3 w-3" /> Prev
          </button>
          <button
            type="button"
            onClick={next}
            disabled={atEnd}
            className="inline-flex items-center gap-1 hover:text-[#52524E] disabled:opacity-30 dark:hover:text-[#9E9C98]"
          >
            Next <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="hidden items-center gap-3 font-mono md:flex">
          <span className="opacity-70">
            {index + 1} of {screens.length} total
          </span>
          <span className="opacity-30">|</span>
          <span>←/→ navigate</span>
          <span>Esc close</span>
        </div>
        <div className="md:hidden">
          <button type="button" onClick={onExit} className="inline-flex items-center gap-1">
            <X className="h-3 w-3" /> Close
          </button>
        </div>
      </div>
    </main>
  );
}
