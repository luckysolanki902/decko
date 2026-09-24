'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface AccordionProps {
  title: string;
  duration?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'section' | 'topic';
  completedCount?: number;
  totalCount?: number;
  isNextToStudy?: boolean;
}

function CompletionRing({ completed, total, size = 20 }: { completed: number; total: number; size?: number }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? completed / total : 0;
  const offset = circumference * (1 - percentage);
  const isComplete = completed === total && total > 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-[#E5E4DF] dark:text-[#2C2B28]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ease-out ${
            isComplete
              ? 'text-[#5D8E72] dark:text-[#7AAE8E]'
              : 'text-[#B87D6C] dark:text-[#D4A090]'
          }`}
        />
      </svg>
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-[#5D8E72] dark:text-[#7AAE8E]" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

export function Accordion({ title, duration, children, defaultOpen = false, variant = 'section', completedCount, totalCount, isNextToStudy = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || isNextToStudy);
  const ref = useRef<HTMLDivElement>(null);
  const hasCompletion = completedCount !== undefined && totalCount !== undefined && totalCount > 0;
  const isFullyCompleted = hasCompletion && completedCount === totalCount;
  const hasProgress = hasCompletion && completedCount! > 0;

  useEffect(() => {
    if (isNextToStudy && ref.current) {
      const timeout = setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isNextToStudy]);

  return (
    <div
      ref={ref}
      className={`
        rounded-xl overflow-hidden transition-colors duration-200 relative
        ${isNextToStudy
          ? 'border-2 border-[#B87D6C]/50 dark:border-[#D4A090]/30 bg-white dark:bg-[#1A1A18]'
          : isFullyCompleted
            ? 'border border-[#C0DAC8]/60 dark:border-[#1C2820] bg-[#FAFDF9] dark:bg-[#141614]'
            : `border border-[#E5E4DF] dark:border-[#2C2B28] bg-white dark:bg-[#1A1A18] ${!isOpen ? 'hover:border-[#D0CEC8] dark:hover:border-[#3A3936]' : ''}`
        }
      `}
    >
      {/* "Up Next" label */}
      {isNextToStudy && (
        <div className="flex items-center gap-1.5 px-5 pt-3 pb-0">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B87D6C] dark:text-[#D4A090]">
            Up Next
          </span>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {hasCompletion && (
            <CompletionRing completed={completedCount!} total={totalCount!} />
          )}

          <div className="min-w-0 flex-1">
            <h4 className={`font-medium leading-tight transition-colors duration-200 ${
              variant === 'section' ? 'text-sm' : 'text-[13px]'
            } ${
              isFullyCompleted
                ? 'text-[#5D8E72] dark:text-[#7AAE8E]'
                : 'text-[#1A1A1A] dark:text-[#E8E7E4]'
            }`}>
              {title}
            </h4>
          </div>

          {hasCompletion && !isFullyCompleted && hasProgress && (
            <span className="text-[10px] font-medium text-[#9A6452] dark:text-[#D4A090] bg-[#F0E5E0] dark:bg-[#2A2018] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 tabular-nums">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 shrink-0 ml-3 transition-transform duration-200 ${
            isFullyCompleted
              ? 'text-[#5D8E72] dark:text-[#7AAE8E]'
              : 'text-[#ADADA9] dark:text-[#4A4846]'
          } ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div 
        className="accordion-content" 
        data-open={isOpen}
      >
        <div>
          <div className="px-5 pb-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
