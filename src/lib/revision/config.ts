import { revisionConfig } from '@/data/revision';
import { ConceptDef } from '@/data/revision/types';
import { RevisionLecture, RevisionRoadmapId, RevisionTargetKind } from '@/types';
import { listPhaseSectionIds, resolveLecture } from '@/lib/revision/roadmaps';

const DEFAULT_MAX_PER_REVISION = 3;
export const FINAL_TARGET_ID = 'final';

export interface ResolvedRevision {
  id: string;
  title: string;
  lectures: RevisionLecture[];
}

export interface ResolvedConcept {
  id: string;
  title: string;
  summary: string;
  revisions: ResolvedRevision[];
  finalLectures: RevisionLecture[]; // every lecture in the concept
}

export interface ResolvedTarget {
  conceptId: string;
  conceptTitle: string;
  targetId: string;
  kind: RevisionTargetKind;
  title: string;
  lectures: RevisionLecture[];
}

export function getConceptDefs(roadmapId: RevisionRoadmapId): ConceptDef[] {
  return revisionConfig[roadmapId] ?? [];
}

export function getConceptDef(roadmapId: RevisionRoadmapId, conceptId: string): ConceptDef | null {
  return getConceptDefs(roadmapId).find(concept => concept.id === conceptId) ?? null;
}

// Flatten a concept's sources into an ordered list of resolved lectures. Any
// section id that no longer exists in the roadmap is silently skipped so a
// syllabus edit can't crash the dashboard.
function resolveConceptLectures(roadmapId: RevisionRoadmapId, def: ConceptDef): RevisionLecture[] {
  const lectures: RevisionLecture[] = [];

  for (const source of def.sources) {
    const sectionIds = source.sectionIds ?? listPhaseSectionIds(roadmapId, source.phaseId);
    for (const sectionId of sectionIds) {
      const lecture = resolveLecture(roadmapId, source.phaseId, sectionId);
      if (lecture) {
        lectures.push(lecture);
      }
    }
  }

  return lectures;
}

// Pull the leading day number(s) out of a section title like "Day 78: ..." or
// "Days 41-42: ..." so we can label a revision "Days 78–80" without hand-typing.
function parseDayNumber(title: string): number | null {
  const match = title.match(/day[s]?\s+(\d+)/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function deriveRevisionTitle(lectures: RevisionLecture[], index: number): string {
  const numbers = lectures.map(lecture => parseDayNumber(lecture.title)).filter((n): n is number => n !== null);
  if (numbers.length > 0) {
    const start = Math.min(...numbers);
    const end = Math.max(...numbers);
    return start === end ? `Day ${start}` : `Days ${start}–${end}`;
  }
  return `Part ${index + 1}`;
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export function resolveConcept(roadmapId: RevisionRoadmapId, conceptId: string): ResolvedConcept | null {
  const def = getConceptDef(roadmapId, conceptId);
  if (!def) {
    return null;
  }

  const allLectures = resolveConceptLectures(roadmapId, def);
  const maxPerRevision = def.maxPerRevision ?? DEFAULT_MAX_PER_REVISION;

  let revisions: ResolvedRevision[];

  if (def.revisions && def.revisions.length > 0) {
    // Hand-authored grouping.
    revisions = def.revisions.map((manual, index) => {
      const lectures = manual.sections
        .map(ref => resolveLecture(roadmapId, ref.phaseId, ref.sectionId))
        .filter((lecture): lecture is RevisionLecture => lecture !== null);
      return {
        id: manual.id ?? `${conceptId}-r${index + 1}`,
        title: manual.title ?? deriveRevisionTitle(lectures, index),
        lectures,
      };
    });
  } else {
    revisions = chunk(allLectures, maxPerRevision).map((lectures, index) => ({
      id: `${conceptId}-r${index + 1}`,
      title: deriveRevisionTitle(lectures, index),
      lectures,
    }));
  }

  return {
    id: def.id,
    title: def.title,
    summary: def.summary,
    revisions,
    finalLectures: allLectures,
  };
}

export function resolveTarget(
  roadmapId: RevisionRoadmapId,
  conceptId: string,
  targetId: string
): ResolvedTarget | null {
  const concept = resolveConcept(roadmapId, conceptId);
  if (!concept) {
    return null;
  }

  if (targetId === FINAL_TARGET_ID) {
    return {
      conceptId,
      conceptTitle: concept.title,
      targetId: FINAL_TARGET_ID,
      kind: 'final',
      title: `${concept.title} — Final Practice`,
      lectures: concept.finalLectures,
    };
  }

  const revision = concept.revisions.find(candidate => candidate.id === targetId);
  if (!revision) {
    return null;
  }

  return {
    conceptId,
    conceptTitle: concept.title,
    targetId: revision.id,
    kind: 'revision',
    title: revision.title,
    lectures: revision.lectures,
  };
}
