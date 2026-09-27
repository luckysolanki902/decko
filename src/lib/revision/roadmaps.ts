import { damlRoadmap } from '@/data/daml';
import { mlRoadmap } from '@/data/ml';
import { webdRoadmap } from '@/data/webd';
import { dsaRoadmap } from '@/data/dsa';
import { goRoadmap } from '@/data/go';
import { reactNativeRoadmap } from '@/data/reactnative';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { NormalizedRoadmap, RevisionLecture, RevisionRoadmapId } from '@/types';

export const SUPPORTED_REVISION_ROADMAP_IDS: RevisionRoadmapId[] = ['daml', 'ml', 'webd', 'dsa', 'go', 'reactnative'];

const normalizedRevisionRoadmaps = {
  daml: normalizeRoadmap(damlRoadmap),
  ml: normalizeRoadmap(mlRoadmap),
  webd: normalizeRoadmap(webdRoadmap),
  dsa: normalizeRoadmap(dsaRoadmap),
  go: normalizeRoadmap(goRoadmap),
  reactnative: normalizeRoadmap(reactNativeRoadmap),
} satisfies Record<RevisionRoadmapId, NormalizedRoadmap>;

export function isRevisionRoadmapId(value: unknown): value is RevisionRoadmapId {
  return typeof value === 'string' && SUPPORTED_REVISION_ROADMAP_IDS.includes(value as RevisionRoadmapId);
}

export function getNormalizedRevisionRoadmap(roadmapId: RevisionRoadmapId): NormalizedRoadmap {
  return normalizedRevisionRoadmaps[roadmapId];
}

// Resolve a single section into the token-cheap lecture shape we hand the model:
// its title plus each topic's title and completed-item labels. Never full docs.
export function resolveLecture(
  roadmapId: RevisionRoadmapId,
  phaseId: string,
  sectionId: string
): RevisionLecture | null {
  const roadmap = getNormalizedRevisionRoadmap(roadmapId);
  const phase = roadmap.phases.find(candidate => candidate.id === phaseId);
  const section = phase?.sections.find(candidate => candidate.id === sectionId);

  if (!phase || !section) {
    return null;
  }

  return {
    phaseId,
    sectionId,
    title: section.title,
    topics: section.topics.map(topic => ({
      topicTitle: topic.title,
      items: topic.items,
    })),
  };
}

// All sections of a phase in roadmap order, as lecture refs.
export function listPhaseSectionIds(roadmapId: RevisionRoadmapId, phaseId: string): string[] {
  const roadmap = getNormalizedRevisionRoadmap(roadmapId);
  const phase = roadmap.phases.find(candidate => candidate.id === phaseId);
  return phase ? phase.sections.map(section => section.id) : [];
}
