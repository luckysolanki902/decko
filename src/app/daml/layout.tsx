'use client';

import { PythonRunnerProvider, usePythonRunner } from '@/components/PythonRunnerContext';
import { Terminal } from 'lucide-react';

function PythonFAB() {
  const { openRunner } = usePythonRunner();
  return (
    <button
      onClick={() => openRunner()}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
      title="Open Python Runner (Pyodide)"
    >
      <Terminal className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:inline">Python</span>
    </button>
  );
}

export default function DamlLayout({ children }: { children: React.ReactNode }) {
  return (
    <PythonRunnerProvider>
      {children}
      {/* <PythonFAB /> */}
    </PythonRunnerProvider>
  );
}
