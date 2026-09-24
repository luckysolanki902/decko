'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { RoadmapSection } from '@/types';

interface ProgressCheckboxProps {
  itemId: string;
  section: RoadmapSection;
  label: string;
}

interface ProgressApiItem {
  itemId: string;
  section: RoadmapSection;
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
let progressCache: Map<string, boolean> | null = null;
let progressPromise: Promise<void> | null = null;

async function fetchProgress(): Promise<Map<string, boolean>> {
  const response = await fetch('/api/progress', {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  const data = await response.json() as ProgressApiResponse;
  const map = new Map<string, boolean>();
  
  if (data.success && data.completedItems) {
    data.completedItems.forEach(item => {
      const key = `${item.section}-${item.itemId}`;
      map.set(key, true);
    });
  }
  
  return map;
}

function useItemProgress(section: RoadmapSection, itemId: string) {
  const [checked, setChecked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const itemKey = `${section}-${itemId}`;

  useEffect(() => {
    // Initialize progress cache if needed
    if (!progressCache && !progressPromise) {
      progressPromise = fetchProgress().then(cache => {
        progressCache = cache;
        progressPromise = null;
        setChecked(cache.get(itemKey) || false);
      });
    } else if (progressCache) {
      setChecked(progressCache.get(itemKey) || false);
    } else if (progressPromise) {
      // Wait for existing promise
      progressPromise.then(() => {
        setChecked(progressCache?.get(itemKey) || false);
      });
    }

    // Listen for custom progress update events
    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as ProgressUpdatedEvent;
      const { itemId: updatedItemId, section: updatedSection, completed } = customEvent.detail;
      const updatedKey = `${updatedSection}-${updatedItemId}`;
      if (updatedKey === itemKey) {
        setChecked(completed);
      }
    };

    window.addEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    return () => window.removeEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
  }, [section, itemId, itemKey]);

  const toggle = useCallback(() => {
    // Optimistic update - update UI immediately
    const newValue = !checked;
    setChecked(newValue);
    
    // Update cache
    if (progressCache) {
      if (newValue) {
        progressCache.set(itemKey, true);
      } else {
        progressCache.delete(itemKey);
      }
    }
    
    // Persist to database using startTransition
    startTransition(async () => {
      try {
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId, section, completed: newValue }),
        });
        
        if (response.ok) {
          // Notify other components about the update
          window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT, {
            detail: { itemId, section, completed: newValue }
          }) satisfies ProgressUpdatedEvent);
        } else {
          // Revert on failure
          setChecked(!newValue);
          if (progressCache) {
            if (!newValue) {
              progressCache.set(itemKey, true);
            } else {
              progressCache.delete(itemKey);
            }
          }
        }
      } catch (error) {
        console.error('Error updating progress:', error);
        // Revert on error
        setChecked(!newValue);
        if (progressCache) {
          if (!newValue) {
            progressCache.set(itemKey, true);
          } else {
            progressCache.delete(itemKey);
          }
        }
      }
    });
  }, [section, itemId, itemKey, checked, startTransition]);

  return { checked, toggle, isPending };
}

export default function ProgressCheckbox({ itemId, section, label }: ProgressCheckboxProps) {
  const { checked, toggle } = useItemProgress(section, itemId);

  return (
    <label
      className={`flex items-start gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-colors duration-150 group select-none ${
        checked
          ? 'bg-[#F2F1EE] dark:bg-[#232321]'
          : 'hover:bg-[#F2F1EE]/60 dark:hover:bg-[#232321]/60'
      }`}
    >
      <input
        type="checkbox"
        className="checkbox-custom mt-0.5"
        checked={checked}
        onChange={toggle}
      />
      <span
        className={`text-sm leading-relaxed transition-colors duration-150 ${
          checked
            ? 'text-[#ADADA9] dark:text-[#4A4846] line-through decoration-[#D0CEC8] dark:decoration-[#3A3936]'
            : 'text-[#1A1A1A] dark:text-[#E8E7E4]'
        }`}
      >
        {label}
      </span>
    </label>
  );
}
