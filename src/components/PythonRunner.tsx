'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Square, Trash2, Download, Upload, Terminal, Clock, Package, RotateCcw, Copy, Check, Keyboard, Maximize2, Minimize2, FolderOpen, File, ChevronRight, Eye, ArrowLeft } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { keymap } from '@codemirror/view';

interface OutputLine {
  type: 'stdout' | 'stderr' | 'result' | 'info';
  text: string;
  timestamp: number;
}

interface HistoryEntry {
  code: string;
  timestamp: number;
  label: string;
}

interface FSEntry {
  name: string;
  path: string;
  isDir: boolean;
  size: number;
}

interface PythonRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  theme?: 'light' | 'dark';
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function PythonRunner({ isOpen, onClose, initialCode = '', theme = 'dark' }: PythonRunnerProps) {
  const [code, setCode] = useState(initialCode || '# Write your Python code here\nprint("Hello, World!")\n');
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showPackages, setShowPackages] = useState(false);
  const [packageInput, setPackageInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [outputHeight, setOutputHeight] = useState(200);
  // File system state
  const [showFiles, setShowFiles] = useState(false);
  const [fsEntries, setFsEntries] = useState<FSEntry[]>([]);
  const [fsCwd, setFsCwd] = useState('/home/pyodide');
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState('');

  const workerRef = useRef<Worker | null>(null);
  const stdinBufferRef = useRef<SharedArrayBuffer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startY: number; startHeight: number } | null>(null);

  // Initialize the worker
  const initWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    try {
      stdinBufferRef.current = new SharedArrayBuffer(4 + 4 + 4096);
    } catch {
      stdinBufferRef.current = null;
    }

    setPyodideStatus('loading');
    const worker = new Worker('/pyodide-worker.js');

    worker.onmessage = (event: MessageEvent) => {
      const { type, text, value, status, error, executionTime: time } = event.data;

      switch (type) {
        case 'status':
          setPyodideStatus(status);
          if (status === 'ready') {
            setOutput(prev => [...prev, { type: 'info', text: '\u2713 Python environment ready (CPython 3.12)', timestamp: Date.now() }]);
          }
          if (status === 'error') {
            setOutput(prev => [...prev, { type: 'stderr', text: `Failed to load: ${error}`, timestamp: Date.now() }]);
          }
          break;
        case 'stdout':
          setOutput(prev => [...prev, { type: 'stdout', text, timestamp: Date.now() }]);
          break;
        case 'stderr':
          setOutput(prev => [...prev, { type: 'stderr', text, timestamp: Date.now() }]);
          break;
        case 'result':
          setOutput(prev => [...prev, { type: 'result', text: `\u2192 ${value}`, timestamp: Date.now() }]);
          break;
        case 'done':
          setIsRunning(false);
          setWaitingForInput(false);
          setExecutionTime(time);
          break;
        case 'error':
          setOutput(prev => [...prev, { type: 'stderr', text: error, timestamp: Date.now() }]);
          setIsRunning(false);
          break;
        case 'input-request':
          setWaitingForInput(true);
          break;
        case 'fs-list':
          setFsEntries(event.data.files || []);
          setFsCwd(event.data.dir);
          break;
        case 'fs-read': {
          const decoder = new TextDecoder();
          const content = decoder.decode(new Uint8Array(event.data.data));
          setPreviewContent(content);
          break;
        }
        case 'fs-written':
          setOutput(prev => [...prev, { type: 'info', text: `\u2713 Uploaded to ${event.data.path} (${formatSize(event.data.size)})`, timestamp: Date.now() }]);
          // Refresh the file list
          workerRef.current?.postMessage({ type: 'fs-list', dir: fsCwd });
          break;
        case 'fs-deleted':
          workerRef.current?.postMessage({ type: 'fs-list', dir: fsCwd });
          break;
        case 'fs-error':
          setOutput(prev => [...prev, { type: 'stderr', text: event.data.error, timestamp: Date.now() }]);
          break;
      }
    };

    workerRef.current = worker;
    worker.postMessage({ type: 'init', stdinBuffer: stdinBufferRef.current });
  }, [fsCwd]);

  useEffect(() => {
    if (!isOpen) return;
    if (!workerRef.current) {
      initWorker();
    }
  }, [isOpen, initWorker]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [output, waitingForInput]);

  useEffect(() => {
    if (initialCode) setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewContent !== null) setPreviewContent(null);
        else if (isFullscreen) setIsFullscreen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, isFullscreen, previewContent]);

  // Submit interactive input
  const submitInput = useCallback((text: string) => {
    const buf = stdinBufferRef.current;
    if (!buf) return;

    const encoded = new TextEncoder().encode(text);
    const dataView = new Uint8Array(buf, 8);
    dataView.set(encoded);

    const lengthView = new Int32Array(buf, 4, 1);
    Atomics.store(lengthView, 0, encoded.length);

    const statusView = new Int32Array(buf, 0, 1);
    Atomics.store(statusView, 0, 1);
    Atomics.notify(statusView, 0);

    setOutput(prev => [...prev, { type: 'stdout', text, timestamp: Date.now() }]);
    setWaitingForInput(false);
    setInputValue('');
  }, []);

  const runCode = useCallback(() => {
    if (!workerRef.current || isRunning || pyodideStatus !== 'ready') return;

    setIsRunning(true);
    setExecutionTime(null);
    setOutput(prev => [...prev, { type: 'info', text: '\u25b6 Running...', timestamp: Date.now() }]);
    workerRef.current.postMessage({ type: 'run', code });

    const firstLine = code.split('\n')[0].slice(0, 50);
    setHistory(prev => [{ code, timestamp: Date.now(), label: firstLine || 'Untitled' }, ...prev.slice(0, 49)]);
  }, [code, isRunning, pyodideStatus]);

  const stopExecution = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setIsRunning(false);
      setWaitingForInput(false);
      setOutput(prev => [...prev, { type: 'stderr', text: '\u2b1b Execution interrupted', timestamp: Date.now() }]);
      initWorker();
    }
  }, [initWorker]);

  const installPackages = useCallback(() => {
    if (!workerRef.current || !packageInput.trim()) return;
    const packages = packageInput.split(/[,\s]+/).filter(Boolean);
    workerRef.current.postMessage({ type: 'install', packages });
    setPackageInput('');
    setShowPackages(false);
  }, [packageInput]);

  const resetEnvironment = useCallback(() => {
    workerRef.current?.postMessage({ type: 'reset' });
  }, []);

  const copyOutput = useCallback(() => {
    const text = output.map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.py';
    a.click();
    URL.revokeObjectURL(url);
  }, [code]);

  const handleFileUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.py,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setCode(reader.result as string);
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  // ── File system helpers ──
  const toggleFiles = useCallback(() => {
    const opening = !showFiles;
    setShowFiles(opening);
    if (opening && workerRef.current && pyodideStatus === 'ready') {
      workerRef.current.postMessage({ type: 'fs-list', dir: fsCwd });
    }
    setPreviewContent(null);
  }, [showFiles, pyodideStatus, fsCwd]);

  const navigateDir = useCallback((dir: string) => {
    setPreviewContent(null);
    workerRef.current?.postMessage({ type: 'fs-list', dir });
  }, []);

  const previewFile = useCallback((entry: FSEntry) => {
    setPreviewName(entry.name);
    workerRef.current?.postMessage({ type: 'fs-read', path: entry.path });
  }, []);

  const downloadFsFile = useCallback((entry: FSEntry) => {
    workerRef.current?.postMessage({ type: 'fs-read', path: entry.path });
    // We'll use a one-time override to download instead of preview
    const handler = (event: MessageEvent) => {
      if (event.data.type === 'fs-read' && event.data.path === entry.path) {
        const blob = new Blob([new Uint8Array(event.data.data)]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = entry.name;
        a.click();
        URL.revokeObjectURL(url);
        workerRef.current?.removeEventListener('message', handler);
      }
    };
    workerRef.current?.addEventListener('message', handler);
  }, []);

  const deleteFsFile = useCallback((entry: FSEntry) => {
    workerRef.current?.postMessage({ type: 'fs-delete', path: entry.path });
  }, []);

  const uploadToFs = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const data = reader.result as ArrayBuffer;
          const targetPath = fsCwd === '/' ? `/${file.name}` : `${fsCwd}/${file.name}`;
          workerRef.current?.postMessage({ type: 'fs-write', path: targetPath, data }, [data]);
        };
        reader.readAsArrayBuffer(file);
      });
    };
    input.click();
  }, [fsCwd]);

  // Resize handler
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startY: e.clientY, startHeight: outputHeight };
    const handleMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const delta = resizeRef.current.startY - e.clientY;
      setOutputHeight(Math.max(100, Math.min(600, resizeRef.current.startHeight + delta)));
    };
    const handleUp = () => {
      resizeRef.current = null;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [outputHeight]);

  const runKeymap = keymap.of([{
    key: 'Mod-Enter',
    run: () => { runCode(); return true; },
  }]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const parentDir = fsCwd === '/' ? null : fsCwd.split('/').slice(0, -1).join('/') || '/';

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      <div className={`fixed z-50 flex flex-col bg-white dark:bg-[#1A1A18] border border-[#E5E4DF] dark:border-[#2C2B28] shadow-2xl transition-all duration-200 ${
        isFullscreen ? 'inset-0 rounded-none' : 'inset-3 md:inset-6 lg:inset-x-[10%] lg:inset-y-6 rounded-xl'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F2F1EE] dark:bg-[#232321] rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57] cursor-pointer hover:brightness-90" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840] cursor-pointer hover:brightness-90" onClick={() => setIsFullscreen(f => !f)} />
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#8A8A86] dark:text-[#686664]" />
              <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">Python Runner</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                pyodideStatus === 'ready' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                pyodideStatus === 'loading' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                pyodideStatus === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {pyodideStatus === 'ready' ? 'Ready' : pyodideStatus === 'loading' ? 'Loading Python...' : pyodideStatus === 'error' ? 'Error' : 'Idle'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowShortcuts(s => !s)} className="p-1.5 rounded-lg hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] text-[#8A8A86] dark:text-[#686664] transition-colors" title="Keyboard shortcuts">
              <Keyboard className="w-4 h-4" />
            </button>
            <button onClick={() => setIsFullscreen(f => !f)} className="p-1.5 rounded-lg hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] text-[#8A8A86] dark:text-[#686664] transition-colors" title="Toggle fullscreen">
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] text-[#8A8A86] dark:text-[#686664] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F2F1EE]/50 dark:bg-[#232321]/50 shrink-0 flex-wrap">
          <button onClick={runCode} disabled={isRunning || pyodideStatus !== 'ready'} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#5D8E72] hover:bg-[#4A7D61] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
            <Play className="w-3.5 h-3.5" /> Run
          </button>
          {isRunning && (
            <button onClick={stopExecution} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#C4493C] hover:bg-[#B33D30] rounded-lg transition-colors">
              <Square className="w-3 h-3" /> Stop
            </button>
          )}
          <div className="w-px h-5 bg-[#E5E4DF] dark:bg-[#2C2B28] mx-1" />
          <button onClick={() => setOutput([])} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] rounded-lg transition-colors" title="Clear output">
            <Trash2 className="w-3.5 h-3.5" /><span className="hidden sm:inline">Clear</span>
          </button>
          <button onClick={resetEnvironment} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] rounded-lg transition-colors" title="Reset environment">
            <RotateCcw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Reset</span>
          </button>
          <div className="w-px h-5 bg-[#E5E4DF] dark:bg-[#2C2B28] mx-1" />
          <button onClick={() => setShowPackages(s => !s)} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showPackages ? 'bg-[#F0E5E0] text-[#9A6452] dark:bg-[#2A2018] dark:text-[#D4A090]' : 'text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28]'}`} title="Install packages">
            <Package className="w-3.5 h-3.5" /><span className="hidden sm:inline">Packages</span>
          </button>
          <button onClick={toggleFiles} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showFiles ? 'bg-[#F0E5E0] text-[#9A6452] dark:bg-[#2A2018] dark:text-[#D4A090]' : 'text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28]'}`} title="File system">
            <FolderOpen className="w-3.5 h-3.5" /><span className="hidden sm:inline">Files</span>
          </button>
          <button onClick={() => setShowHistory(s => !s)} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showHistory ? 'bg-[#F0E5E0] text-[#9A6452] dark:bg-[#2A2018] dark:text-[#D4A090]' : 'text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28]'}`} title="Code history">
            <Clock className="w-3.5 h-3.5" /><span className="hidden sm:inline">History</span>
          </button>
          <div className="flex-1" />
          <button onClick={handleFileUpload} className="p-1.5 text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] rounded-lg transition-colors" title="Upload .py file">
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button onClick={downloadCode} className="p-1.5 text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] rounded-lg transition-colors" title="Download as .py">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shortcuts panel */}
        {showShortcuts && (
          <div className="px-4 py-3 border-b border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F0E5E0]/50 dark:bg-[#2A2018]/30 text-xs shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[#1A1A1A] dark:text-[#E8E7E4]">
              <div><kbd className="px-1.5 py-0.5 bg-[#F2F1EE] dark:bg-[#2C2B28] rounded border border-[#E5E4DF] dark:border-[#3A3936] text-[10px]">{'\u2318'}/Ctrl + Enter</kbd> Run code</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#F2F1EE] dark:bg-[#2C2B28] rounded border border-[#E5E4DF] dark:border-[#3A3936] text-[10px]">Esc</kbd> Close</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#F2F1EE] dark:bg-[#2C2B28] rounded border border-[#E5E4DF] dark:border-[#3A3936] text-[10px]">{'\u2318'}/Ctrl + S</kbd> Download</div>
            </div>
          </div>
        )}

        {/* Packages panel */}
        {showPackages && (
          <div className="px-4 py-3 border-b border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F2F1EE]/80 dark:bg-[#232321]/80 shrink-0">
            <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#E8E7E4] mb-1.5 block">
              Install Packages <span className="text-[#8A8A86] dark:text-[#686664] font-normal">(via micropip, comma-separated)</span>
            </label>
            <div className="flex gap-2">
              <input value={packageInput} onChange={e => setPackageInput(e.target.value)} placeholder="numpy, pandas, matplotlib..." onKeyDown={e => e.key === 'Enter' && installPackages()} className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-[#1A1A18] border border-[#E5E4DF] dark:border-[#2C2B28] rounded-lg text-[#1A1A1A] dark:text-[#E8E7E4] placeholder-[#8A8A86] focus:outline-none focus:ring-2 focus:ring-[#B87D6C]/40 dark:focus:ring-[#D4A090]/40" />
              <button onClick={installPackages} className="px-3 py-2 text-xs font-medium text-white bg-[#B87D6C] hover:bg-[#A66E5E] rounded-lg transition-colors">Install</button>
            </div>
            <p className="text-[10px] text-[#8A8A86] dark:text-[#686664] mt-1.5">Built-in: numpy, pandas, scipy, matplotlib, scikit-learn, sympy, and more. Imports are auto-detected.</p>
          </div>
        )}

        {/* Files panel */}
        {showFiles && (
          <div className="border-b border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F2F1EE]/80 dark:bg-[#232321]/80 shrink-0 max-h-56 flex flex-col">
            {previewContent !== null ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5E4DF] dark:border-[#2C2B28]">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPreviewContent(null)} className="p-0.5 hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] rounded transition-colors text-[#8A8A86] dark:text-[#686664]">
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <File className="w-3.5 h-3.5 text-[#8A8A86] dark:text-[#686664]" />
                    <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">{previewName}</span>
                  </div>
                </div>
                <pre className="flex-1 overflow-auto px-4 py-2 text-xs font-mono text-[#1A1A1A] dark:text-[#E8E7E4] whitespace-pre-wrap">{previewContent}</pre>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5E4DF] dark:border-[#2C2B28]">
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-[#8A8A86] dark:text-[#686664]" />
                    <span className="text-xs font-mono text-[#1A1A1A] dark:text-[#E8E7E4]">{fsCwd}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => workerRef.current?.postMessage({ type: 'fs-list', dir: fsCwd })} className="p-1 hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] rounded transition-colors text-[#8A8A86] dark:text-[#686664]" title="Refresh">
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button onClick={uploadToFs} className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white bg-[#B87D6C] hover:bg-[#A66E5E] rounded-md transition-colors" title="Upload files into Python filesystem">
                      <Upload className="w-3 h-3" /> Upload
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  {parentDir !== null && (
                    <button onClick={() => navigateDir(parentDir)} className="w-full flex items-center gap-2.5 px-4 py-1.5 text-xs text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] transition-colors">
                      <ArrowLeft className="w-3 h-3" /> ..
                    </button>
                  )}
                  {fsEntries.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-[#8A8A86] dark:text-[#686664] italic">No files here yet. Upload files or run code that creates them.</div>
                  ) : (
                    fsEntries.map(entry => (
                      <div key={entry.path} className="group flex items-center justify-between px-4 py-1.5 text-xs hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] transition-colors">
                        <button
                          onClick={() => entry.isDir ? navigateDir(entry.path) : previewFile(entry)}
                          className="flex items-center gap-2 text-[#1A1A1A] dark:text-[#E8E7E4] min-w-0 flex-1 text-left"
                        >
                          {entry.isDir ? <FolderOpen className="w-3.5 h-3.5 text-[#B87D6C] shrink-0" /> : <File className="w-3.5 h-3.5 text-[#8A8A86] dark:text-[#686664] shrink-0" />}
                          <span className="truncate">{entry.name}</span>
                          {entry.isDir && <ChevronRight className="w-3 h-3 text-[#8A8A86] shrink-0" />}
                          {!entry.isDir && <span className="text-[#8A8A86] dark:text-[#686664] text-[10px] shrink-0">{formatSize(entry.size)}</span>}
                        </button>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                          {!entry.isDir && (
                            <>
                              <button onClick={() => previewFile(entry)} className="p-1 hover:bg-[#D0CEC8] dark:hover:bg-[#3A3936] rounded text-[#8A8A86] dark:text-[#686664]" title="Preview"><Eye className="w-3 h-3" /></button>
                              <button onClick={() => downloadFsFile(entry)} className="p-1 hover:bg-[#D0CEC8] dark:hover:bg-[#3A3936] rounded text-[#8A8A86] dark:text-[#686664]" title="Download"><Download className="w-3 h-3" /></button>
                            </>
                          )}
                          <button onClick={() => deleteFsFile(entry)} className="p-1 hover:bg-[#F0E5E0] dark:hover:bg-[#2A2018] rounded text-[#8A8A86] hover:text-[#C4493C] dark:text-[#686664] dark:hover:text-[#D4A090]" title="Delete"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* History panel */}
        {showHistory && history.length > 0 && (
          <div className="px-4 py-3 border-b border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F2F1EE]/80 dark:bg-[#232321]/80 max-h-40 overflow-y-auto shrink-0">
            <div className="text-xs font-medium text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">Recent runs</div>
            <div className="space-y-1">
              {history.slice(0, 10).map((entry, i) => (
                <button key={i} onClick={() => { setCode(entry.code); setShowHistory(false); }} className="w-full text-left px-2.5 py-1.5 text-xs font-mono text-[#1A1A1A] dark:text-[#E8E7E4] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] rounded-lg transition-colors truncate">
                  <span className="text-[#8A8A86] dark:text-[#686664]">{new Date(entry.timestamp).toLocaleTimeString()}</span>{' '}{entry.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <CodeMirror
            value={code}
            onChange={setCode}
            extensions={[python(), runKeymap]}
            theme={isDark ? githubDark : githubLight}
            height="100%"
            className="h-full text-sm [&_.cm-editor]:h-full [&_.cm-scroller]:!overflow-auto"
            basicSetup={{ lineNumbers: true, highlightActiveLineGutter: true, highlightActiveLine: true, foldGutter: true, bracketMatching: true, autocompletion: true, closeBrackets: true, indentOnInput: true, tabSize: 4 }}
          />
        </div>

        {/* Resize handle */}
        <div onMouseDown={handleResizeStart} className="h-1.5 cursor-ns-resize bg-[#E5E4DF] dark:bg-[#2C2B28] hover:bg-[#B87D6C] dark:hover:bg-[#D4A090] transition-colors shrink-0 flex items-center justify-center">
          <div className="w-8 h-0.5 rounded-full bg-[#8A8A86]/40" />
        </div>

        {/* Output */}
        <div className="shrink-0 flex flex-col" style={{ height: outputHeight }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F2F1EE] dark:bg-[#232321]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#8A8A86] dark:text-[#686664]" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">Output</span>
              {executionTime !== null && (
                <span className="text-[10px] text-[#8A8A86] dark:text-[#686664] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {executionTime < 1000 ? `${executionTime.toFixed(0)}ms` : `${(executionTime / 1000).toFixed(2)}s`}
                </span>
              )}
            </div>
            <button onClick={copyOutput} className="p-1 text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28] rounded transition-colors" title="Copy output">
              {copied ? <Check className="w-3.5 h-3.5 text-[#5D8E72]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div ref={outputRef} className="flex-1 overflow-auto px-4 py-3 bg-[#1A1A18] font-mono text-xs space-y-0.5">
            {output.length === 0 && !waitingForInput ? (
              <div className="text-[#4A4846] italic">Output will appear here...</div>
            ) : (
              output.map((line, i) => (
                <div key={i} className={`whitespace-pre-wrap break-all ${
                  line.type === 'stdout' ? 'text-[#E8E7E4]' :
                  line.type === 'stderr' ? 'text-[#D4A090]' :
                  line.type === 'result' ? 'text-[#7AAE8E]' :
                  'text-[#686664]'
                }`}>{line.text}</div>
              ))
            )}
            {waitingForInput && (
              <div className="flex items-center mt-0.5">
                <span className="text-[#7AAE8E] mr-1.5 select-none">{'\u203a'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submitInput(inputValue); } }}
                  className="flex-1 bg-transparent text-[#E8E7E4] font-mono text-xs outline-none border-none caret-[#7AAE8E]"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            )}
            {isRunning && !waitingForInput && (
              <div className="flex items-center gap-2 text-[#686664]">
                <span className="inline-block w-2 h-2 bg-[#B87D6C] rounded-full animate-pulse" />
                Executing...
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F2F1EE] dark:bg-[#232321] rounded-b-xl text-[10px] text-[#8A8A86] dark:text-[#686664] shrink-0">
          <div className="flex items-center gap-3">
            <span>Python 3.12 (Pyodide)</span>
            <span>{'\u2022'}</span>
            <span>{code.split('\n').length} lines</span>
          </div>
          <div>{'\u2318'}/Ctrl+Enter to run</div>
        </div>
      </div>
    </>
  );
}
