'use client';

import { Flame } from 'lucide-react';
import { useStreak } from '@/lib/progress';

export function StreakDisplay() {
  const { streak, hasCheckedToday, isLoading } = useStreak();
  
  if (isLoading) return null;
  
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1A1A18] border border-[#E5E4DF] dark:border-[#2C2B28]">
      <Flame className={`w-4 h-4 transition-colors ${hasCheckedToday ? 'text-[#FF6B35]' : 'text-[#D0CEC8] dark:text-[#3A3936]'}`} />
      <span className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">
        {streak}
      </span>
    </div>
  );
}
