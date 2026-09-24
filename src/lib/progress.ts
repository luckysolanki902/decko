'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { NormalizedPhase, RoadmapSection } from '@/types';

// Create a simple pub/sub for progress updates
const listeners = new Set<() => void>();
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
function notifyListeners() {
  listeners.forEach(l => l());
}

interface ProgressItem {
  id: string;
  completedAt: string; // ISO date string
}

interface UseProgressReturn {
  completedItems: Set<string>;
  toggleItem: (itemId: string) => void;
  isLoading: boolean;
}

interface ProgressApiItem {
  itemId: string;
  section: RoadmapSection;
  completedAt?: string | null;
}

interface ProgressApiResponse {
  success?: boolean;
  completedItems?: ProgressApiItem[];
}

type ProgressUpdatedEvent = CustomEvent<{
  itemId: string;
  section: RoadmapSection;
  completed: boolean;
}>;

const PROGRESS_UPDATED_EVENT = 'progress-updated';

// Global cache for progress data
let globalProgressCache: Map<string, ProgressItem> | null = null;
let globalProgressPromise: Promise<void> | null = null;

// Fetch progress from API and cache it
async function fetchGlobalProgress(): Promise<Map<string, ProgressItem>> {
  const response = await fetch('/api/progress', {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  const data = await response.json() as ProgressApiResponse;
  const map = new Map<string, ProgressItem>();
  
  if (data.success && data.completedItems) {
    data.completedItems.forEach(item => {
      const key = `${item.section}-${item.itemId}`;
      map.set(key, {
        id: item.itemId,
        completedAt: item.completedAt || new Date().toISOString(),
      });
    });
  }
  
  return map;
}

// Helper to get all progress items with dates
export function getAllProgressItems(): ProgressItem[] {
  if (typeof window === 'undefined') return [];
  
  // If cache is not loaded, return empty array (will load async)
  if (!globalProgressCache) return [];
  
  return Array.from(globalProgressCache.values());
}

// Helper to get local date string in YYYY-MM-DD format
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate streak from progress items
export function calculateStreak(): { streak: number; hasCheckedToday: boolean } {
  const items = getAllProgressItems();
  if (items.length === 0) return { streak: 0, hasCheckedToday: false };
  
  // Group items by date (YYYY-MM-DD) using local timezone
  const dateSet = new Set<string>();
  items.forEach(item => {
    const date = new Date(item.completedAt);
    const dateStr = getLocalDateString(date);
    dateSet.add(dateStr);
  });
  
  if (dateSet.size === 0) return { streak: 0, hasCheckedToday: false };
  
  const today = new Date();
  const todayStr = getLocalDateString(today);
  const hasCheckedToday = dateSet.has(todayStr);
  
  let streak = 0;
  const currentDate = new Date(today);
  let gapDays = 0;
  
  // Start counting from today
  while (true) {
    const dateStr = getLocalDateString(currentDate);
    
    if (dateSet.has(dateStr)) {
      // Found a check on this date
      streak++;
      gapDays = 0; // Reset gap counter
    } else {
      // No check on this date
      gapDays++;
      
      // If we haven't started the streak yet (no checks at all from today backward)
      if (streak === 0 && gapDays > 2) {
        // More than 2 days without any check, no streak
        break;
      }
      
      // If we have a streak and gap is too large, break it
      if (streak > 0 && gapDays > 2) {
        break;
      }
    }
    
    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1);
    
    // Safety limit: don't go back more than 1 year
    const daysDiff = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) break;
  }
  
  return { streak, hasCheckedToday };
}

export function useProgress(section: RoadmapSection): UseProgressReturn {
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize cache on mount
  useEffect(() => {
    if (!globalProgressCache && !globalProgressPromise) {
      globalProgressPromise = fetchGlobalProgress().then(cache => {
        globalProgressCache = cache;
        globalProgressPromise = null;
        notifyListeners();
        setIsLoading(false);
      });
    } else if (globalProgressCache) {
      setIsLoading(false);
    } else if (globalProgressPromise) {
      globalProgressPromise.then(() => {
        setIsLoading(false);
      });
    }
    
    // Listen for progress updates
    const handleProgressUpdate = () => {
      notifyListeners();
    };
    window.addEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    return () => window.removeEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
  }, []);
  
  // Use useSyncExternalStore for instant reactivity
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return '[]';
    if (!globalProgressCache) return '[]';
    
    const items: string[] = [];
    globalProgressCache.forEach((item, key) => {
      // key format is "section-itemId"
      const [itemSection] = key.split('-', 1);
      const itemId = key.substring(itemSection.length + 1); // Get everything after "section-"
      if (itemSection === section) {
        items.push(itemId);
      }
    });
    
    return JSON.stringify(items);
  }, [section]);
  
  const storedValue = useSyncExternalStore(
    (callback) => {
      // Listen to custom notifications
      const unsubscribe = subscribe(callback);
      const handleProgressUpdate = () => callback();
      window.addEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
      return () => {
        unsubscribe();
        window.removeEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
      };
    },
    getSnapshot,
    () => '[]' // server snapshot
  );
  
  const completedItems = new Set<string>(
    (() => {
      try {
        return JSON.parse(storedValue);
      } catch {
        return [];
      }
    })()
  );

  const toggleItem = useCallback(async (itemId: string) => {
    const key = `${section}-${itemId}`;
    const isCompleted = globalProgressCache?.has(key);
    const newValue = !isCompleted;
    
    // Optimistic update
    if (globalProgressCache) {
      if (newValue) {
        globalProgressCache.set(key, { id: itemId, completedAt: new Date().toISOString() });
      } else {
        globalProgressCache.delete(key);
      }
      notifyListeners();
    }
    
    // Persist to database
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, section, completed: newValue }),
      });
      
      if (!response.ok) {
        // Revert on failure
        if (globalProgressCache) {
          if (!newValue) {
            globalProgressCache.set(key, { id: itemId, completedAt: new Date().toISOString() });
          } else {
            globalProgressCache.delete(key);
          }
          notifyListeners();
        }
      } else {
        // Notify other components
        window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT, {
          detail: { itemId, section, completed: newValue }
        }) satisfies ProgressUpdatedEvent);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert on error
      if (globalProgressCache) {
        if (!newValue) {
          globalProgressCache.set(key, { id: itemId, completedAt: new Date().toISOString() });
        } else {
          globalProgressCache.delete(key);
        }
        notifyListeners();
      }
    }
  }, [section]);

  return { completedItems, toggleItem, isLoading };
}

// Hook to track streak
export function useStreak(): { streak: number; hasCheckedToday: boolean; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize cache on mount
  useEffect(() => {
    if (!globalProgressCache && !globalProgressPromise) {
      globalProgressPromise = fetchGlobalProgress().then(cache => {
        globalProgressCache = cache;
        globalProgressPromise = null;
        notifyListeners();
        setIsLoading(false);
      });
    } else if (globalProgressCache) {
      setIsLoading(false);
    } else if (globalProgressPromise) {
      globalProgressPromise.then(() => {
        setIsLoading(false);
      });
    }
  }, []);
  
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return '0';
    // Calculate streak on each snapshot
    const { streak, hasCheckedToday } = calculateStreak();
    return JSON.stringify({ streak, hasCheckedToday });
  }, []);
  
  const storedValue = useSyncExternalStore(
    (callback) => {
      const unsubscribe = subscribe(callback);
      const handleProgressUpdate = () => callback();
      window.addEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
      return () => {
        unsubscribe();
        window.removeEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
      };
    },
    getSnapshot,
    () => JSON.stringify({ streak: 0, hasCheckedToday: false })
  );
  
  const { streak, hasCheckedToday } = JSON.parse(storedValue);
  return { streak, hasCheckedToday, isLoading };
}

// Count total checkable items in a phase
export function countPhaseItems(phase: NormalizedPhase): number {
  let count = 0;
  for (const section of phase.sections) {
    for (const topic of section.topics) {
      count += topic.items.length;
    }
  }
  return count;
}

// Count completed items in a phase  
export function countPhaseCompleted(
  phase: NormalizedPhase,
  completedItems: Set<string>
): number {
  let count = 0;
  for (const section of phase.sections) {
    for (const topic of section.topics) {
      for (let i = 0; i < topic.items.length; i++) {
        const itemId = `${phase.id}-${section.id}-${topic.id}-${i}`;
        if (completedItems.has(itemId)) count++;
      }
    }
  }
  return count;
}

// Count total items across all phases
export function countTotalItems(phases: NormalizedPhase[]): number {
  return phases.reduce((acc, phase) => acc + countPhaseItems(phase), 0);
}

// Count total completed across all phases
export function countTotalCompleted(
  phases: NormalizedPhase[],
  completedItems: Set<string>
): number {
  return phases.reduce((acc, phase) => acc + countPhaseCompleted(phase, completedItems), 0);
}
