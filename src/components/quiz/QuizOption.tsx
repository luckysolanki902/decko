'use client';

import { ReactNode } from 'react';
import { Check, X } from 'lucide-react';

// Shared MCQ presentation for both the mid-lecture "Quick check" and the
// end-of-lecture quiz, so the two are visually identical and improve together.

export type QuizVariant = 'webd' | 'daml' | 'ml' | 'go' | 'reactnative' | 'dsa';

export const QUIZ_ACCENT: Record<QuizVariant, { accent: string; soft: string; deep: string; ring: string }> = {
  webd: { accent: '#3E5C77', soft: '#F6F9FB', deep: '#23384A', ring: 'rgba(62,92,119,0.26)' },
  daml: { accent: '#9A6452', soft: '#F7F0ED', deep: '#5E382C', ring: 'rgba(154,100,82,0.26)' },
  ml: { accent: '#3C664F', soft: '#EEF5F1', deep: '#1E3A2A', ring: 'rgba(60,102,79,0.26)' },
  go: { accent: '#0891B2', soft: '#EFFBFE', deep: '#075A72', ring: 'rgba(8,145,178,0.26)' },
  reactnative: { accent: '#2B93B6', soft: '#F1FBFE', deep: '#146078', ring: 'rgba(43,147,182,0.26)' },
  dsa: { accent: '#6366F1', soft: '#F1F1FE', deep: '#312E81', ring: 'rgba(99,102,241,0.26)' },
};

export type Tone = { border: string; bg: string; badge: string; text: string };

export const CORRECT_TONE: Tone = { border: '#528A6A', bg: 'rgba(82,138,106,0.12)', badge: '#528A6A', text: '#1F4A31' };
export const WRONG_TONE: Tone = { border: '#C06D5E', bg: 'rgba(192,109,94,0.12)', badge: '#C06D5E', text: '#6E2F29' };
// Partial = selected only correct options but missed at least one (multi-select). Amber.
export const PARTIAL_TONE: Tone = { border: '#C79A3B', bg: 'rgba(199,154,59,0.15)', badge: '#C79A3B', text: '#6B5217' };

export type Verdict = 'correct' | 'partial' | 'wrong';
export type OptionState = 'idle' | 'selected' | 'correct' | 'missed' | 'wrong' | 'muted';

export const optionLabel = (index: number) => String.fromCharCode(65 + index);

// Three-way outcome from the picked set vs the correct set.
export function verdictFor(correctIds: string[], selectedIds: string[] = []): Verdict {
  if (selectedIds.length === 0) return 'wrong';
  const correct = new Set(correctIds);
  if (selectedIds.some(id => !correct.has(id))) return 'wrong';
  return correctIds.some(id => !selectedIds.includes(id)) ? 'partial' : 'correct';
}

// Per-option colour after the answer is revealed.
export function optionStateAfter(isCorrectOption: boolean, isSelected: boolean): OptionState {
  if (isCorrectOption && isSelected) return 'correct';
  if (isCorrectOption && !isSelected) return 'missed';
  if (!isCorrectOption && isSelected) return 'wrong';
  return 'muted';
}

export function verdictMeta(verdict: Verdict): { tone: Tone; label: string } {
  if (verdict === 'correct') return { tone: CORRECT_TONE, label: 'Correct' };
  if (verdict === 'partial') return { tone: PARTIAL_TONE, label: 'Almost — you missed one' };
  return { tone: WRONG_TONE, label: 'Not quite' };
}

function toneFor(state: OptionState): Tone | null {
  if (state === 'correct') return CORRECT_TONE;
  if (state === 'wrong') return WRONG_TONE;
  if (state === 'missed') return PARTIAL_TONE;
  return null;
}

export function OptionButton({
  index,
  state,
  accent,
  multiple,
  disabled,
  onClick,
  children,
}: {
  index: number;
  state: OptionState;
  accent: (typeof QUIZ_ACCENT)[QuizVariant];
  multiple?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  const tone = toneFor(state);
  const selected = state === 'selected';
  const muted = state === 'muted';

  const borderColor = tone ? tone.border : selected ? accent.accent : 'var(--lecture-border)';
  const background = tone ? tone.bg : selected ? accent.soft : 'var(--lecture-card)';
  const badgeBg = tone ? tone.badge : selected ? accent.accent : 'transparent';
  const badgeSolid = Boolean(tone) || selected;

  const badgeContent =
    state === 'correct' || state === 'missed' ? (
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    ) : state === 'wrong' ? (
      <X className="h-3.5 w-3.5" strokeWidth={3} />
    ) : (
      optionLabel(index)
    );

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group flex w-full items-start gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-150 md:px-5 ${
        disabled ? 'cursor-default' : 'cursor-pointer hover:-translate-y-0.5'
      } ${muted ? 'opacity-55' : ''}`}
      style={{
        borderColor,
        background,
        boxShadow: badgeSolid ? `0 4px 16px ${accent.ring}` : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <span
        className={`mt-px flex h-7 w-7 shrink-0 items-center justify-center text-[12.5px] font-bold ${
          multiple ? 'rounded-md' : 'rounded-full'
        }`}
        style={{
          background: badgeBg,
          border: badgeSolid ? 'none' : '1.5px solid var(--lecture-border)',
          color: badgeSolid ? '#fff' : 'var(--lecture-muted)',
        }}
      >
        {badgeContent}
      </span>
      <span
        className="flex-1 pt-0.5 text-[15px] leading-7"
        style={{ color: tone ? tone.text : 'var(--lecture-text)' }}
      >
        {children}
      </span>
    </button>
  );
}
