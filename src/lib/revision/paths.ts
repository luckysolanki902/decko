import type { RevisionRoadmapId } from '@/types';

export function revisionBasePath(roadmapId: RevisionRoadmapId): string {
  return `${courseBasePath(roadmapId)}/revision`;
}

export function courseBasePath(roadmapId: RevisionRoadmapId): string {
  return roadmapId === 'reactnative' ? '/react-native' : `/${roadmapId}`;
}
