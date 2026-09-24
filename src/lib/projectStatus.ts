'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoadmapSection } from '@/types';

export type ProjectStatus = 'active' | 'completed' | 'ignored';

interface ProjectStatusData {
  projectId: string;
  section: RoadmapSection;
  status: ProjectStatus;
  completedAt: string | null;
  ignoredAt: string | null;
}

export function useProjectStatus(section: RoadmapSection) {
  const [statuses, setStatuses] = useState<Map<string, ProjectStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch(`/api/project-status?section=${section}`);
        const data = await response.json();
        
        if (data.success && data.statuses) {
          const statusMap = new Map<string, ProjectStatus>();
          data.statuses.forEach((item: ProjectStatusData) => {
            statusMap.set(item.projectId, item.status);
          });
          setStatuses(statusMap);
        }
      } catch (error) {
        console.error('Error fetching project statuses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatuses();
  }, [section]);

  // Update a project status
  const updateStatus = useCallback(async (projectId: string, newStatus: ProjectStatus) => {
    try {
      // Optimistic update
      setStatuses(prev => {
        const updated = new Map(prev);
        updated.set(projectId, newStatus);
        return updated;
      });

      const response = await fetch('/api/project-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, section, status: newStatus }),
      });

      const data = await response.json();
      
      if (!data.success) {
        // Revert on failure
        setStatuses(prev => {
          const reverted = new Map(prev);
          const currentStatus = prev.get(projectId);
          if (currentStatus) {
            reverted.set(projectId, currentStatus);
          }
          return reverted;
        });
        console.error('Failed to update project status');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      // Revert on error
      setStatuses(prev => new Map(prev));
    }
  }, [section]);

  const getStatus = useCallback((projectId: string): ProjectStatus => {
    return statuses.get(projectId) || 'active';
  }, [statuses]);

  const toggleComplete = useCallback((projectId: string) => {
    const currentStatus = getStatus(projectId);
    const newStatus: ProjectStatus = currentStatus === 'completed' ? 'active' : 'completed';
    updateStatus(projectId, newStatus);
  }, [getStatus, updateStatus]);

  const toggleIgnore = useCallback((projectId: string) => {
    const currentStatus = getStatus(projectId);
    const newStatus: ProjectStatus = currentStatus === 'ignored' ? 'active' : 'ignored';
    updateStatus(projectId, newStatus);
  }, [getStatus, updateStatus]);

  return {
    statuses,
    isLoading,
    getStatus,
    updateStatus,
    toggleComplete,
    toggleIgnore,
  };
}
