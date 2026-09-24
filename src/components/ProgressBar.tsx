'use client';

import { useProgress } from '@/lib/progress';
import { RoadmapSection, RoadmapVariant } from '@/types';

interface ProgressBarProps {
  completed: number;
  total: number;
  variant?: RoadmapVariant;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ completed, total, variant = 'rose', showLabel = true, size = 'sm' }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const heights = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2'
  };
  
  const fills = {
    rose: 'bg-[#B87D6C] dark:bg-[#D4A090]',
    emerald: 'bg-[#5D8E72] dark:bg-[#7AAE8E]',
    blue: 'bg-[#6889A6] dark:bg-[#8AAAC4]'
  };
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-[#ADADA9] dark:text-[#4A4846]">
            {completed}/{total} completed
          </span>
          <span className="text-[11px] font-medium text-[#52524E] dark:text-[#9E9C98]">
            {percentage}%
          </span>
        </div>
      )}
      <div className={`${heights[size]} rounded-full bg-[#F2F1EE] dark:bg-[#232321] overflow-hidden`}>
        <div 
          className={`h-full rounded-full ${fills[variant]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* Auto-counting progress bar — reads completed count from localStorage */
interface AutoProgressBarProps {
  section: RoadmapSection;
  phaseId: string;
  totalItems: number;
  variant?: RoadmapVariant;
  className?: string;
}

export default function AutoProgressBar({ section, phaseId, totalItems, variant = 'rose', className = '' }: AutoProgressBarProps) {
  const { completedItems, isLoading } = useProgress(section);

  // Count items that start with this phaseId
  let completed = 0;
  completedItems.forEach(id => {
    if (id.startsWith(`${phaseId}-`)) completed++;
  });

  if (isLoading) {
    return (
      <div className={className}>
        <div className="h-2 rounded-full bg-[#F2F1EE] dark:bg-[#232321] animate-pulse" />
      </div>
    );
  }

  return (
    <div className={className}>
      <ProgressBar completed={completed} total={totalItems} variant={variant} size="lg" />
    </div>
  );
}
