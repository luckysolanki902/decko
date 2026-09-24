'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { QuizStageResult, RevisionAttempt, RevisionContent } from '@/types';
import RevisionQuestionCard from './RevisionQuestionCard';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StageReview({ content, result }: { content: RevisionContent; result: QuizStageResult }) {
  const correctById = new Map(result.perQuestion.map(entry => [entry.id, entry.correct]));

  return (
    <div className="space-y-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A867C] dark:text-[#7C7C76]">
        Quiz · {Math.round((result.score / result.total) * 100)}% ({result.score}/{result.total})
      </div>
      {content.quiz.map((question, index) => (
        <RevisionQuestionCard
          key={question.id}
          question={question}
          index={index}
          mode="review"
          selected={result.answers?.[question.id] ?? []}
          reviewCorrect={correctById.get(question.id)}
        />
      ))}
    </div>
  );
}

export default function RevisionHistory({
  attempts,
  contentsByVersion,
}: {
  attempts: RevisionAttempt[];
  contentsByVersion: Record<number, RevisionContent>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const done = attempts.filter(attempt => attempt.status === 'completed');

  if (done.length === 0) {
    return (
      <p className="font-mono text-[12px] text-[#8A867C] dark:text-[#7C7C76]">
        No completed attempts yet — finish a quiz and it will show up here with a timestamp.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {done.map(attempt => {
        const isOpen = openId === attempt.id;
        const content = contentsByVersion[attempt.contentVersion];
        return (
          <div
            key={attempt.id}
            className="overflow-hidden rounded-xl border border-[#E4E0D6] bg-white dark:border-[#26262B] dark:bg-[#0E0E10]"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : attempt.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F7F6F1] dark:hover:bg-[#141417]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1F7F2] font-mono text-[12px] font-semibold text-[#2F9E44] dark:bg-[#0F1512] dark:text-[#3FB950]">
                  {attempt.percent}%
                </span>
                <div>
                  <div className="font-mono text-[12px] font-semibold text-[#3F3A33] dark:text-[#D1CBC0]">
                    Attempt {attempt.attemptNumber}
                  </div>
                  <div className="font-mono text-[11px] text-[#8A867C]">
                    {formatDate(attempt.completedAt ?? attempt.createdAt)} · {attempt.score}/{attempt.total} correct
                  </div>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 shrink-0 text-[#8A867C] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="border-t border-[#EFECE4] px-4 py-4 dark:border-[#1E1E22]">
                {!content || !attempt.stages.quiz ? (
                  <p className="font-mono text-[12px] text-[#8A867C]">This attempt&apos;s question set is no longer available.</p>
                ) : (
                  <StageReview content={content} result={attempt.stages.quiz} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
