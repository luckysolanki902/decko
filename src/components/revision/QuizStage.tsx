'use client';

import { useEffect, useMemo, useState } from 'react';
import { RevisionAttempt, RevisionQuizQuestion, QuizStageResult } from '@/types';
import { shuffleOnce, shuffleQuestion } from '@/lib/quizShuffle';
import RevisionQuestionCard from './RevisionQuestionCard';

interface Props {
  attemptId: string;
  questions: RevisionQuizQuestion[];
  existingResult?: QuizStageResult;
  onSubmitted: (attempt: RevisionAttempt) => void;
}

type Mode = 'answer' | 'review';

export default function QuizStage({ attemptId, questions, existingResult, onSubmitted }: Props) {
  const [answers, setAnswers] = useState<Record<string, string[]>>(existingResult?.answers ?? {});
  const [mode, setMode] = useState<Mode>(existingResult ? 'review' : 'answer');
  const [result, setResult] = useState<QuizStageResult | undefined>(existingResult);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Randomise option order per page load, after mount so SSR still matches.
  // Option ids are preserved, so the answers posted for grading stay valid.
  const [shuffled, setShuffled] = useState<RevisionQuizQuestion[] | null>(null);
  useEffect(() => {
    setShuffled(
      shuffleOnce(`revision:${attemptId}`, () => questions.map(question => shuffleQuestion(question)))
    );
  }, [attemptId, questions]);
  const shownQuestions = shuffled ?? questions;

  const correctById = useMemo(() => {
    const map = new Map<string, boolean>();
    result?.perQuestion.forEach(entry => map.set(entry.id, entry.correct));
    return map;
  }, [result]);

  function toggleOption(question: RevisionQuizQuestion, optionId: string) {
    setAnswers(prev => {
      const current = prev[question.id] ?? [];
      if (question.type === 'multiple_correct') {
        const next = current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: [optionId] };
    });
  }

  const answeredCount = shownQuestions.filter(question => (answers[question.id] ?? []).length > 0).length;
  const allAnswered = answeredCount === shownQuestions.length;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/revision/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit', attemptId, answers }),
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.error || 'Failed to submit');
        return;
      }

      setResult({
        answers,
        perQuestion: data.result.perQuestion,
        score: data.result.score,
        total: data.result.total,
        completedAt: new Date().toISOString(),
      });
      setMode('review');
      onSubmitted(data.attempt as RevisionAttempt);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {mode === 'review' && result && (
        <div className="flex items-center justify-between rounded-xl border border-[#E4E0D6] bg-[#F7F6F1] px-5 py-3.5 dark:border-[#26262B] dark:bg-[#0B0B0D]">
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#8A867C]">Your score</span>
          <span className="font-mono text-sm text-[#3F3A33] dark:text-[#D1CBC0]">
            <span className="text-lg font-semibold text-[#2F9E44] dark:text-[#3FB950]">
              {Math.round((result.score / result.total) * 100)}%
            </span>{' '}
            · {result.score}/{result.total} correct
          </span>
        </div>
      )}

      {mode === 'answer' && (
        <div className="flex items-center justify-between px-1 font-mono text-[11px] text-[#8A867C]">
          <span>
            {answeredCount}/{shownQuestions.length} answered
          </span>
          <span>Single & multiple choice</span>
        </div>
      )}

      {shownQuestions.map((question, index) => (
        <RevisionQuestionCard
          key={question.id}
          question={question}
          index={index}
          mode={mode}
          selected={answers[question.id] ?? []}
          onToggleOption={optionId => toggleOption(question, optionId)}
          reviewCorrect={correctById.get(question.id)}
        />
      ))}

      {mode === 'answer' && (
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            disabled={!allAnswered || submitting}
            onClick={handleSubmit}
            className="rounded-xl bg-[#2F9E44] px-6 py-3 font-mono text-sm font-semibold text-white transition-colors hover:bg-[#278239] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#3FB950] dark:text-[#0A0A0B] dark:hover:bg-[#4FC961]"
          >
            {submitting ? 'Submitting…' : 'Submit quiz'}
          </button>
          {!allAnswered && (
            <span className="font-mono text-[11px] text-[#8A867C] dark:text-[#7C7C76]">Answer every question to submit.</span>
          )}
          {error && <span className="font-mono text-[11px] text-red-600 dark:text-red-400">{error}</span>}
        </div>
      )}
    </div>
  );
}
