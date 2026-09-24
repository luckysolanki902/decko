export interface Topic {
  id?: string;
  title: string;
  duration?: string;
  description?: string;
  items: string[];
  project?: {
    title: string;
    description: string;
    type?: 'mini' | 'project' | 'capstone';
    features?: string[];
    hints?: string[];
  };
}

export interface SectionContent {
  description?: string;
  topics: Topic[];
  project?: {
    title: string;
    description: string;
    type?: 'mini' | 'project' | 'capstone';
    features?: string[];
    hints?: string[];
  };
}

export interface Section {
  id?: string;
  title: string;
  duration?: string;
  topics?: Topic[];
  content?: SectionContent;
  project?: {
    title: string;
    description: string;
    features?: string[];
    hints?: string[];
    type?: 'mini' | 'project' | 'capstone';
  };
}

export interface Phase {
  // Old format
  id?: string;
  number?: number;
  icon?: string;
  color?: string;
  days?: string | number;
  
  // New format  
  phase?: number;
  dayRange?: string;
  totalHours?: number;
  
  // Shared
  title: string;
  subtitle: string;
  duration?: string;
  goal?: string;
  sections: Section[];
  checkpoint?: {
    skills: string[];
    milestone?: string;
    jobReady?: string[];
    salary?: string;
  };
}

// Normalized phase for rendering
export interface NormalizedPhase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  duration: string;
  days: string;
  goal: string;
  sections: NormalizedSection[];
  checkpoint?: {
    skills: string[];
    milestone?: string;
  };
}

export interface NormalizedSection {
  id: string;
  title: string;
  duration?: string;
  topics: NormalizedTopic[];
  project?: {
    title: string;
    description: string;
    type?: 'mini' | 'project' | 'capstone';
    features?: string[];
    hints?: string[];
  };
}

export interface NormalizedTopic {
  id: string;
  title: string;
  duration?: string;
  items: string[];
  project?: {
    title: string;
    description: string;
    type?: 'mini' | 'project' | 'capstone';
    features?: string[];
    hints?: string[];
  };
}

export interface Roadmap {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  totalDays: number;
  totalHours: number;
  phases: Phase[];
  icon?: string;
  gradient?: string;
}

export interface NormalizedRoadmap {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  totalDays: number;
  totalHours: number;
  phases: NormalizedPhase[];
}

// The single source of truth for valid roadmap ids. API routes validate
// against this array, so adding a course here is all that is needed for its
// progress and project-status writes to be accepted.
export const ROADMAP_SECTIONS = ['daml', 'ml', 'webd', 'go', 'reactnative', 'dsa'] as const;

export type RoadmapSection = (typeof ROADMAP_SECTIONS)[number];

export type RoadmapVariant = 'rose' | 'emerald' | 'blue';

export interface ProgressItem {
  itemId: string;
  section: RoadmapSection;
  completed: boolean;
  completedAt: string | null;
}

export type RevisionRoadmapId = Exclude<RoadmapSection, 'go' | 'reactnative' | 'dsa'>;

// Quizzes are multiple-choice only: exactly one correct option, or two+ correct.
export type RevisionQuestionType = 'single_correct' | 'multiple_correct';

export interface RevisionQuizOption {
  id: string;
  text: string;
}

export interface RevisionQuizQuestion {
  id: string;
  type: RevisionQuestionType;
  prompt: string;
  codeSnippet: string | null;
  options: RevisionQuizOption[];
  correctOptionIds: string[];
  explanation: string;
  example: string;
  sourceTopics: string[];
}

// ─────────────────────────────────────────────────────────────────────────
// Revision system (on-demand concept revisions). Replaces the daily quiz.
// ─────────────────────────────────────────────────────────────────────────

// A single lecture (one normalized section) resolved with just its syllabus
// labels — the token-cheap context we hand the model (never full lecture docs).
export interface RevisionLecture {
  phaseId: string;
  sectionId: string;
  title: string;
  topics: { topicTitle: string; items: string[] }[];
}

// One recall flashcard shown in the "Cards" stage. `front` is a prompt/term,
// `back` the answer — both Markdown so code and formatting render.
// One retrieval card: `front` is the cue the learner answers from memory, `back`
// is the explanation they read afterwards. The lecture/topic labels let the
// session group cards and show which ideas are secure; optional so cards
// generated before they existed still load.
export interface ConceptCard {
  front: string;
  back: string;
  lectureTitle?: string;
  topicTitle?: string;
}

// 'revision' targets carry the Concept overview + cards + one quiz.
// 'final' targets (the concept-wide "Final Practice") carry quick concepts + one
// bigger medium/hard quiz — no cards.
export type RevisionTargetKind = 'revision' | 'final';

// AI-generated, cached content for one target. A "fresh set" bumps `version`;
// older versions are retained so history stays reproducible.
export interface RevisionContent {
  roadmapId: RevisionRoadmapId;
  conceptId: string;
  targetId: string; // a revision id, or 'final'
  kind: RevisionTargetKind;
  version: number;
  recap: string; // the overview ("Concept" / "Quick concepts"), rich Markdown
  concepts: ConceptCard[]; // recall cards; [] for final
  quiz: RevisionQuizQuestion[]; // the single graded quiz
  model: string;
  createdAt: string;
}

// Stage ids double as attempt.stages keys. Labels shown in the UI: recap →
// "Concept"/"Quick concepts", concepts → "Cards", quiz → "Quiz"/"Final quiz".
export type RevisionStageId = 'recap' | 'concepts' | 'quiz';
export type RevisionQuizStageId = 'quiz';

// The graded outcome of one quiz stage, with per-question correctness kept
// forever so any historical attempt can be replayed green/red with solutions.
export interface QuizStageResult {
  answers: Record<string, string[]>; // MCQ option selections by question id
  perQuestion: { id: string; type: RevisionQuestionType; correct: boolean }[];
  score: number;
  total: number;
  completedAt: string;
}

export interface RevisionAttemptStages {
  recap?: { completedAt: string };
  concepts?: { completedAt: string };
  quiz?: QuizStageResult;
}

// One attempt (redo ⇒ a new row). This is the permanent revision history.
export interface RevisionAttempt {
  id: string;
  roadmapId: RevisionRoadmapId;
  conceptId: string;
  targetId: string;
  kind: RevisionTargetKind;
  attemptNumber: number;
  contentVersion: number;
  stages: RevisionAttemptStages;
  score: number;
  total: number;
  percent: number; // 0..100 (the graded portion: final quiz, or all tiers)
  status: 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export type RevisionTargetStatus = 'locked' | 'not_started' | 'in_progress' | 'done';

export interface RevisionTargetSummary {
  targetId: string;
  title: string;
  kind: RevisionTargetKind;
  lectureCount: number;
  lectures: string[]; // the lecture (day) titles this target covers
  bestPercent: number | null;
  attempts: number;
  hasContent: boolean;
  status: RevisionTargetStatus;
  /** When this target was last completed — drives the "fading / due" signal. */
  lastCompletedAt: string | null;
  /** How many of this target's lectures the learner has actually studied. */
  lecturesLearned: number;
}

export interface ConceptSummary {
  conceptId: string;
  title: string;
  summary: string;
  revisions: RevisionTargetSummary[];
  final: RevisionTargetSummary;
  conceptPercent: number | null;
  status: 'not_started' | 'in_progress' | 'done';
  /** True for the concept whose lectures the learner is working through now. */
  isCurrent: boolean;
}
