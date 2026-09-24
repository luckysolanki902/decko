'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { RevisionQuizQuestion } from '@/types';
import { MarkdownBlock } from './markdown';

const optionLabel = ['A', 'B', 'C', 'D', 'E', 'F'];

interface Props {
  question: RevisionQuizQuestion;
  index: number;
  mode: 'answer' | 'review';
  selected: string[];
  onToggleOption?: (optionId: string) => void;
  reviewCorrect?: boolean;
}

export default function RevisionQuestionCard({ question, index, mode, selected, onToggleOption, reviewCorrect }: Props) {
  const isReview = mode === 'review';
  const isMultiple = question.type === 'multiple_correct';

  return (
    <section className="overflow-hidden rounded-xl border border-[#E4E0D6] bg-white dark:border-[#26262B] dark:bg-[#0E0E10]">
      <div className="flex items-center justify-between gap-2 border-b border-[#EFECE4] px-5 py-3 dark:border-[#1E1E22]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A867C] dark:text-[#7C7C76]">
          Question {index + 1}
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#E0DCD2] bg-[#F1EFE8] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#6B6862] dark:border-[#26262B] dark:bg-[#151518] dark:text-[#8A8A84]">
            {isMultiple ? 'Multiple' : 'Single'}
          </span>
          {isReview && (
            <span
              className={`flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${
                reviewCorrect ? 'text-[#2F9E44] dark:text-[#3FB950]' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {reviewCorrect ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              {reviewCorrect ? 'Correct' : 'Wrong'}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-4 md:px-6">
        <div className="text-[1rem] leading-7 text-[#171614] dark:text-[#F1F0EC]">
          <MarkdownBlock text={question.prompt} />
        </div>

        {question.codeSnippet && (
          <pre className="mt-4 overflow-x-auto rounded-lg border border-[#E4E0D6] bg-[#F7F6F1] px-5 py-4 font-mono text-[0.9rem] leading-7 text-[#24292E] dark:border-[#26262B] dark:bg-[#0C0C0E] dark:text-[#E6E6E3]">
            <code>{question.codeSnippet}</code>
          </pre>
        )}

        <div className="mt-4 space-y-2.5">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected.includes(option.id);
            const isCorrectOption = question.correctOptionIds.includes(option.id);

            let colorClass: string;
            let badgeClass: string;
            if (isReview) {
              if (isCorrectOption) {
                colorClass = 'border-[#2F9E44] bg-[#F1F7F2] dark:border-[#3FB950] dark:bg-[#0F1512]';
                badgeClass = 'bg-[#2F9E44] text-white dark:bg-[#3FB950] dark:text-[#0A0A0B]';
              } else if (isSelected) {
                colorClass = 'border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-950/30';
                badgeClass = 'bg-red-500 text-white';
              } else {
                colorClass = 'border-[#E4E0D6] bg-white opacity-70 dark:border-[#26262B] dark:bg-[#0E0E10]';
                badgeClass = 'bg-[#EDEAE2] text-[#8A867C] dark:bg-[#1B1B1F] dark:text-[#7C7C76]';
              }
            } else if (isSelected) {
              colorClass = 'border-[#2F9E44] bg-[#F1F7F2] dark:border-[#3FB950] dark:bg-[#0F1512]';
              badgeClass = 'bg-[#2F9E44] text-white dark:bg-[#3FB950] dark:text-[#0A0A0B]';
            } else {
              colorClass =
                'border-[#E4E0D6] bg-white hover:border-[#C9C4B6] hover:bg-[#FAF9F5] dark:border-[#26262B] dark:bg-[#0E0E10] dark:hover:border-[#3A3A40] dark:hover:bg-[#141417]';
              badgeClass = 'bg-[#EDEAE2] text-[#6B6862] dark:bg-[#1B1B1F] dark:text-[#9E9C98]';
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={isReview}
                onClick={() => onToggleOption?.(option.id)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-default ${colorClass}`}
              >
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold ${badgeClass}`}>
                  {isReview && isCorrectOption ? <Check className="h-3 w-3" /> : optionLabel[optionIndex]}
                </span>
                <span className="flex-1 text-[0.95rem] leading-6 text-[#1A1A1A] dark:text-[#E6E6E3]">
                  <MarkdownBlock text={option.text} />
                </span>
              </button>
            );
          })}
        </div>

        {!isReview && isMultiple && (
          <p className="mt-2 font-mono text-[11px] text-[#8A867C] dark:text-[#7C7C76]">Select all that apply.</p>
        )}

        {isReview && (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-[#2F9E44]/30 border-l-2 border-l-[#2F9E44] bg-[#F7FAF7] px-4 py-3 dark:border-[#3FB950]/25 dark:border-l-[#3FB950] dark:bg-[#0D110D]">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#2F9E44] dark:text-[#3FB950]">Why</div>
              <MarkdownBlock text={question.explanation} />
              {question.example && (
                <div className="mt-3 border-t border-[#E4E0D6] pt-3 dark:border-[#26262B]">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A867C]">Example</div>
                  <MarkdownBlock text={question.example} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
