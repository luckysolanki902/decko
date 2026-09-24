'use client';

import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { RoadmapVariant } from '@/types';

interface PhaseCardProps {
  phase: {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    duration: string;
    days: string;
    goal: string;
  };
  basePath: string;
  variant?: RoadmapVariant;
  completed: number;
  total: number;
  quizScore?: { score: number; total: number } | null;
}

export function PhaseCard({ phase, basePath, variant = 'rose', completed, total, quizScore }: PhaseCardProps) {
  const styles = {
    rose: {
      accentBg: 'bg-[#F0E5E0] dark:bg-[#2A2018]',
      accentText: 'text-[#9A6452] dark:text-[#D4A090]',
      hoverAccent: 'group-hover:text-[#B87D6C] dark:group-hover:text-[#D4A090]',
    },
    emerald: {
      accentBg: 'bg-[#E2EDE6] dark:bg-[#1C2820]',
      accentText: 'text-[#4F7F64] dark:text-[#7AAE8E]',
      hoverAccent: 'group-hover:text-[#5D8E72] dark:group-hover:text-[#7AAE8E]',
    },
    blue: {
      accentBg: 'bg-[#E2EBF0] dark:bg-[#182228]',
      accentText: 'text-[#507290] dark:text-[#8AAAC4]',
      hoverAccent: 'group-hover:text-[#6889A6] dark:group-hover:text-[#8AAAC4]',
    },
  }[variant];
  
  return (
    <Link href={`${basePath}/${phase.id}`} className="group block">
      <article className="bg-white dark:bg-[#1A1A18] rounded-xl p-6 border border-[#E5E4DF] dark:border-[#2C2B28] h-full flex flex-col hover:border-[#D0CEC8] dark:hover:border-[#3A3936] transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] font-medium ${styles.accentText} ${styles.accentBg} px-2.5 py-1 rounded-md tracking-wide`}>
            Phase {phase.number}
          </span>
          <ArrowRight className={`w-4 h-4 text-[#ADADA9] dark:text-[#4A4846] ${styles.hoverAccent} transition-colors`} />
        </div>
        
        {/* Title & Subtitle */}
        <h3 className="text-base font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-1 leading-tight">
          {phase.title}
        </h3>
        <p className="text-xs text-[#8A8A86] dark:text-[#686664] mb-3">
          {phase.subtitle}
        </p>
        
        {/* Meta */}
        <div className="flex items-center gap-2 text-[11px] text-[#ADADA9] dark:text-[#4A4846] mb-4">
          <span>{phase.days}</span>
        </div>

        {/* Goal */}
        <p className="text-xs text-[#52524E] dark:text-[#9E9C98] leading-relaxed mb-5 flex-1 line-clamp-3">
          {phase.goal}
        </p>
        
        {/* Progress */}
        <ProgressBar completed={completed} total={total} variant={variant} />
        
        {/* Quiz Score */}
        {quizScore && (
          <div className="flex items-center gap-1.5 mt-2">
            <GraduationCap className={`w-3.5 h-3.5 ${styles.accentText}`} />
            <span className="text-[11px] text-[#8A8A86] dark:text-[#686664]">
              Quiz: <span className="font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">{Math.round((quizScore.score / quizScore.total) * 100)}%</span>
            </span>
          </div>
        )}
      </article>
    </Link>
  );
}
