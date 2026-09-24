import { RevisionRoadmapId } from '@/types';

// A slice of a phase to pull lectures from. Omit `sectionIds` to take the
// whole phase (in roadmap order); provide them to carve a concept out of part
// of a phase (e.g. splitting DAML's phase6 into Excel / SQL / Tableau).
export interface ConceptSource {
  phaseId: string;
  sectionIds?: string[];
}

// Optional hand-authored grouping of a concept's lectures into revisions. When
// omitted, lectures are auto-chunked into groups of `maxPerRevision`.
export interface ManualRevision {
  id?: string;
  title?: string;
  sections: { phaseId: string; sectionId: string }[];
}

// A curated concept cluster: the big card on the dashboard. It maps to a set of
// lectures (spanning or splitting phases) which become 1..N revisions plus one
// concept-wide Final Practice.
export interface ConceptDef {
  id: string;
  title: string;
  summary: string;
  maxPerRevision?: number; // default 3
  sources: ConceptSource[];
  revisions?: ManualRevision[];
}

export type RevisionConfig = Record<RevisionRoadmapId, ConceptDef[]>;
