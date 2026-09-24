'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const options = [
    { value: 'light' as const, Icon: Sun },
    { value: 'dark' as const, Icon: Moon },
    { value: 'system' as const, Icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-0.5 bg-white/80 dark:bg-[#232321]/80 backdrop-blur-xl p-1 rounded-full border border-[#E5E4DF] dark:border-[#2C2B28]">
      {options.map(({ value, Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-1.5 rounded-full transition-colors duration-200 ${
            mounted && theme === value
              ? 'bg-[#F2F1EE] dark:bg-[#2C2B28] text-[#1A1A1A] dark:text-[#E8E7E4]'
              : 'text-[#ADADA9] dark:text-[#4A4846] hover:text-[#52524E] dark:hover:text-[#9E9C98]'
          }`}
          aria-label={value}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
