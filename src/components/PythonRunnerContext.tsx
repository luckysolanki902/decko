'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import dynamic from 'next/dynamic';

const PythonRunner = dynamic(() => import('@/components/PythonRunner'), { ssr: false });

interface PythonRunnerContextType {
  openRunner: (code?: string) => void;
}

const PythonRunnerContext = createContext<PythonRunnerContextType>({ openRunner: () => {} });

export function usePythonRunner() {
  return useContext(PythonRunnerContext);
}

export function PythonRunnerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [codeKey, setCodeKey] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const openRunner = useCallback((initialCode?: string) => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setCode(initialCode || '');
    setCodeKey(k => k + 1);
    setIsOpen(true);
  }, []);

  return (
    <PythonRunnerContext.Provider value={{ openRunner }}>
      {children}
      <PythonRunner
        key={codeKey}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialCode={code}
        theme={theme}
      />
    </PythonRunnerContext.Provider>
  );
}
