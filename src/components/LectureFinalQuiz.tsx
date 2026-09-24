'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { RevisionQuizQuestion } from '@/types';
import { shuffleOnce, shuffleQuestion } from '@/lib/quizShuffle';
import { QuizMarkdown, QuizOptionMarkdown } from '@/components/revision/markdown';
import {
  OptionButton,
  QUIZ_ACCENT,
  QuizVariant,
  optionStateAfter,
  verdictFor,
  verdictMeta,
} from '@/components/quiz/QuizOption';

interface Props {
  questions: RevisionQuizQuestion[];
  title: string;
  variant: QuizVariant;
  onQuizModeChange: (active: boolean) => void;
}

// One end-of-lecture MCQ. Answered inline, then revealed green/amber/red with a
// walkthrough — identical in look to the mid-lecture Quick check.
function QuestionCard({
  question,
  index,
  accent,
  selected,
  submitted,
  onToggle,
}: {
  question: RevisionQuizQuestion;
  index: number;
  accent: (typeof QUIZ_ACCENT)[QuizVariant];
  selected: string[];
  submitted: boolean;
  onToggle: (optionId: string) => void;
}) {
  const isMultiple = question.type === 'multiple_correct';
  const verdict = submitted ? verdictFor(question.correctOptionIds, selected) : null;
  const meta = verdict ? verdictMeta(verdict) : null;

  return (
    <section className="rounded-2xl border border-[#E5E4DF] bg-white dark:border-[#2C2B28] dark:bg-[#161513]">
      <div className="flex items-center justify-between gap-2 border-b border-[#EFEEE9] px-5 py-3 dark:border-[#232220]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8A86] dark:text-[#686664]">
          Question {index + 1}
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#E5E4DF] bg-[#F8F7F5] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-[#8A8A86] dark:border-[#2C2B28] dark:bg-[#1A1A18] dark:text-[#686664]">
            {isMultiple ? 'Select all' : 'Single'}
          </span>
          {meta && (
            <span
              className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: meta.tone.badge }}
            >
              {meta.label}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-4 md:px-6">
        <div className="text-[15.5px] leading-7 text-[#1A1A1A] dark:text-[#F5F4F1]">
          <QuizMarkdown text={question.prompt} />
        </div>
        {question.codeSnippet && (
          <pre className="mt-4 overflow-x-auto rounded-xl border border-[#E5E4DF] bg-[#F8F7F5] px-5 py-4 font-mono text-[13.5px] leading-7 text-[#24292E] dark:border-[#2C2B28] dark:bg-[#0F0F0E] dark:text-[#E6E6E3]">
            <code>{question.codeSnippet}</code>
          </pre>
        )}

        <div className="mt-4 space-y-2.5">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected.includes(option.id);
            const isCorrectOption = question.correctOptionIds.includes(option.id);
            const state = submitted
              ? optionStateAfter(isCorrectOption, isSelected)
              : isSelected
                ? 'selected'
                : 'idle';
            return (
              <OptionButton
                key={option.id}
                index={optionIndex}
                state={state}
                accent={accent}
                multiple={isMultiple}
                disabled={submitted}
                onClick={() => onToggle(option.id)}
              >
                <QuizOptionMarkdown text={option.text} />
              </OptionButton>
            );
          })}
        </div>
        {!submitted && isMultiple && (
          <p className="mt-2.5 text-[12px] text-[#8A8A86] dark:text-[#686664]">Select all that apply.</p>
        )}

        {submitted && meta && (
          <div
            className="mt-4 rounded-xl border-l-2 px-4 py-3"
            style={{ borderColor: meta.tone.border, background: meta.tone.bg }}
          >
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: meta.tone.text }}>
              Walkthrough
            </div>
            <div className="text-[14px] leading-6 text-[#3A3A38] dark:text-[#D4D2CE]">
              <QuizMarkdown text={question.explanation} />
            </div>
            {question.example && (
              <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8A86]">Example</div>
                <div className="text-[14px] leading-6 text-[#3A3A38] dark:text-[#D4D2CE]">
                  <QuizMarkdown text={question.example} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function LectureFinalQuiz({ questions, title, variant, onQuizModeChange }: Props) {
  const accent = QUIZ_ACCENT[variant];
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  // Options are randomised per page load so the correct answer isn't always in
  // the same slot. Done after mount, never during render: shuffling on the
  // server would not match the client and would break hydration.
  const [shuffled, setShuffled] = useState<RevisionQuizQuestion[] | null>(null);
  useEffect(() => {
    setShuffled(
      shuffleOnce(`final:${title}`, () => questions.map(question => shuffleQuestion(question)))
    );
  }, [questions, title]);
  const shownQuestions = shuffled ?? questions;

  // Own the keyboard so the deck's ←/→ don't skip away while answering.
  useEffect(() => {
    onQuizModeChange(true);
    return () => onQuizModeChange(false);
  }, [onQuizModeChange]);

  const answeredCount = shownQuestions.filter(q => (answers[q.id] ?? []).length > 0).length;
  const allAnswered = answeredCount === shownQuestions.length;

  const correctCount = useMemo(() => {
    if (!submitted) return 0;
    return shownQuestions.filter(q => verdictFor(q.correctOptionIds, answers[q.id] ?? []) === 'correct').length;
  }, [submitted, shownQuestions, answers]);

  function toggle(question: RevisionQuizQuestion, optionId: string) {
    if (submitted) return;
    setAnswers(prev => {
      const current = prev[question.id] ?? [];
      if (question.type === 'multiple_correct') {
        const next = current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: [optionId] };
    });
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  const cleanTitle = title.replace(/final/gi, '').trim() || 'Quiz';

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-5">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ background: accent.soft, color: accent.deep }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent.accent }} />
          End-of-lecture quiz
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-snug text-[#1A1A1A] dark:text-[#F5F4F1]">{cleanTitle}</h2>
        <p className="mt-1.5 text-[13px] text-[#8A8A86] dark:text-[#686664]">
          {submitted ? (
            <>
              You got <span className="font-semibold" style={{ color: accent.deep }}>{correctCount}</span> of {shownQuestions.length} right — read each walkthrough below.
            </>
          ) : (
            <>{answeredCount}/{shownQuestions.length} answered · single &amp; select-all questions.</>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {shownQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            accent={accent}
            selected={answers[question.id] ?? []}
            submitted={submitted}
            onToggle={optionId => toggle(question, optionId)}
          />
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <>
            <button
              type="button"
              disabled={!allAnswered}
              onClick={() => setSubmitted(true)}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: `linear-gradient(to right, ${accent.accent}, ${accent.deep})`, boxShadow: `0 4px 14px ${accent.ring}` }}
            >
              <Check className="h-4 w-4" /> Check answers
            </button>
            {!allAnswered && (
              <span className="text-[12px] text-[#8A8A86] dark:text-[#686664]">Answer every question to check.</span>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E4DF] px-6 py-3 text-[13.5px] font-semibold text-[#52524E] transition-colors hover:bg-black/[0.03] dark:border-[#2C2B28] dark:text-[#9E9C98] dark:hover:bg-white/[0.04]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Do again
          </button>
        )}
      </div>
    </div>
  );
}
