'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { RoadmapSection } from '@/types';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizData {
  phaseId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  section: string;
  phaseId: string;
  answers: Record<string, number>;
  score: number;
  total: number;
  completedAt: string | null;
}

// ─── Global cache for quiz scores ───
const quizListeners = new Set<() => void>();
function quizSubscribe(cb: () => void) {
  quizListeners.add(cb);
  return () => quizListeners.delete(cb);
}
function notifyQuizListeners() {
  quizListeners.forEach(l => l());
}

let quizScoreCache: Map<string, { score: number; total: number }> | null = null;
let quizScorePromise: Promise<void> | null = null;

async function fetchQuizScores(section: string): Promise<Map<string, { score: number; total: number }>> {
  const res = await fetch(`/api/quiz?section=${section}`, { cache: 'no-store' });
  const data = await res.json();
  const map = new Map<string, { score: number; total: number }>();
  if (data.success && data.results) {
    for (const r of data.results) {
      map.set(`${r.section}-${r.phaseId}`, { score: r.score, total: r.total });
    }
  }
  return map;
}

export function useQuizScores(section: RoadmapSection) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!quizScoreCache && !quizScorePromise) {
      quizScorePromise = fetchQuizScores(section).then(cache => {
        quizScoreCache = cache;
        quizScorePromise = null;
        notifyQuizListeners();
        setIsLoading(false);
      });
    } else if (quizScoreCache) {
      setIsLoading(false);
    } else if (quizScorePromise) {
      quizScorePromise.then(() => setIsLoading(false));
    }
  }, [section]);

  const getSnapshot = useCallback(() => {
    if (!quizScoreCache) return '{}';
    const obj: Record<string, { score: number; total: number }> = {};
    quizScoreCache.forEach((val, key) => {
      if (key.startsWith(`${section}-`)) {
        const phaseId = key.substring(section.length + 1);
        obj[phaseId] = val;
      }
    });
    return JSON.stringify(obj);
  }, [section]);

  const stored = useSyncExternalStore(
    (cb) => {
      const unsub = quizSubscribe(cb);
      return unsub;
    },
    getSnapshot,
    () => '{}'
  );

  const scores: Record<string, { score: number; total: number }> = JSON.parse(stored);
  return { scores, isLoading };
}

// ─── Local storage helpers for in-progress quiz state ───
function lsKey(section: string, phaseId: string, suffix: string) {
  return `quiz-${suffix}-${section}-${phaseId}`;
}

export function getLocalQuizIndex(section: string, phaseId: string): number {
  if (typeof window === 'undefined') return 0;
  const val = localStorage.getItem(lsKey(section, phaseId, 'index'));
  return val ? parseInt(val, 10) : 0;
}

export function setLocalQuizIndex(section: string, phaseId: string, index: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(lsKey(section, phaseId, 'index'), String(index));
}

export function getLocalQuizAnswers(section: string, phaseId: string): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const val = localStorage.getItem(lsKey(section, phaseId, 'answers'));
  if (!val) return {};
  try { return JSON.parse(val); } catch { return {}; }
}

export function setLocalQuizAnswers(section: string, phaseId: string, answers: Record<string, number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(lsKey(section, phaseId, 'answers'), JSON.stringify(answers));
}

export function clearLocalQuizState(section: string, phaseId: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(lsKey(section, phaseId, 'index'));
  localStorage.removeItem(lsKey(section, phaseId, 'answers'));
}

// ─── Save quiz result to API ───
export async function saveQuizResult(
  section: string,
  phaseId: string,
  answers: Record<string, number>,
  score: number,
  total: number
) {
  const res = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, phaseId, answers, score, total }),
  });
  const data = await res.json();
  if (data.success) {
    // Update cache
    if (!quizScoreCache) quizScoreCache = new Map();
    quizScoreCache.set(`${section}-${phaseId}`, { score, total });
    notifyQuizListeners();
  }
  // Mark as completed
  await fetch('/api/quiz', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, phaseId }),
  });
  return data;
}

// ─── Sync per-question answer to server (fire-and-forget) ───
export function syncQuizAnswer(
  section: string,
  phaseId: string,
  answers: Record<string, number>,
  questions: QuizQuestion[],
  total: number
) {
  const score = questions.filter(q => answers[String(q.id)] === q.correct).length;
  fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, phaseId, answers, score, total }),
  }).catch(() => {
    // Silently fail — local state is the source of truth, will retry on next answer
  });
}

// ─── Load saved answers from server ───
export async function loadServerQuizAnswers(
  section: string,
  phaseId: string
): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(`/api/quiz?section=${section}&phaseId=${phaseId}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success && data.results?.length > 0) {
      const result = data.results[0];
      if (result.answers && Object.keys(result.answers).length > 0 && !result.completedAt) {
        return result.answers;
      }
    }
  } catch {
    // Silently fail — use local state
  }
  return null;
}

// ─── Clear quiz progress from server ───
export async function clearQuizProgress(section: string, phaseId: string) {
  const res = await fetch(`/api/quiz?section=${section}&phaseId=${phaseId}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (data.success) {
    // Remove from cache
    if (quizScoreCache) {
      quizScoreCache.delete(`${section}-${phaseId}`);
      notifyQuizListeners();
    }
  }
  clearLocalQuizState(section, phaseId);
  return data;
}
