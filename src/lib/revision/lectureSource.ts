import 'server-only';

import fs from 'fs';
import path from 'path';

import { RevisionLecture, RevisionRoadmapId } from '@/types';

const LECTURES_BASE = path.join(process.cwd(), 'public', 'data', 'lectures');

// Lecture files live at public/data/lectures/<roadmap>/<phaseId>/<sectionId>-<slug>.md,
// so the section id is the filename prefix. Cached because one generation reads the
// same lectures once per model call (overview + every quiz batch).
const cache = new Map<string, string | null>();

function readLectureFile(roadmapId: RevisionRoadmapId, phaseId: string, sectionId: string): string | null {
  const cacheKey = `${roadmapId}/${phaseId}/${sectionId}`;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  let content: string | null = null;
  try {
    const phaseDir = path.join(LECTURES_BASE, roadmapId, phaseId);
    const match = fs
      .readdirSync(phaseDir)
      .find(file => /\.(md|html)$/.test(file) && file.slice(0, file.indexOf('-')) === sectionId);
    if (match) {
      content = fs.readFileSync(path.join(phaseDir, match), 'utf-8');
    }
  } catch {
    // Missing phase folder or unreadable file — fall back to the topic outline.
    content = null;
  }

  cache.set(cacheKey, content);
  return content;
}

// Quiz fences are large blocks of JSON answer keys. They add nothing to a recap and
// would let the quiz generator copy existing questions instead of writing new ones.
function stripQuizBlocks(markdown: string): string {
  return markdown
    .replace(/```(?:quiz|finalquiz)\s[\s\S]*?```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Keep a lecture whole when it fits. When it doesn't, cut at a heading boundary so
// the model never sees half a sentence.
function clampToBudget(markdown: string, budget: number): string {
  if (markdown.length <= budget) {
    return markdown;
  }
  const slice = markdown.slice(0, budget);
  const lastHeading = slice.lastIndexOf('\n## ');
  const cut = lastHeading > budget * 0.5 ? slice.slice(0, lastHeading) : slice;
  return `${cut.trim()}\n\n_(Lecture truncated here — cover what is above.)_`;
}

export interface LectureSource {
  title: string;
  /** Full lecture markdown when the file was found, else null. */
  content: string | null;
  outline: string;
}

function buildOutline(lecture: RevisionLecture): string {
  return lecture.topics
    .map(topic => {
      const items = topic.items.map(item => `    - ${item}`).join('\n');
      return `  • ${topic.topicTitle}${items ? `\n${items}` : ''}`;
    })
    .join('\n');
}

// The lecture material handed to the model: real lecture text where we have it,
// with the topic outline alongside it as the authoritative scope list.
export function buildLectureSources(
  roadmapId: RevisionRoadmapId,
  lectures: RevisionLecture[],
  totalBudget: number
): LectureSource[] {
  const perLecture = Math.floor(totalBudget / Math.max(lectures.length, 1));

  return lectures.map(lecture => {
    const raw = readLectureFile(roadmapId, lecture.phaseId, lecture.sectionId);
    return {
      title: lecture.title,
      content: raw ? clampToBudget(stripQuizBlocks(raw), perLecture) : null,
      outline: buildOutline(lecture),
    };
  });
}

export function renderLectureSources(sources: LectureSource[]): string {
  return sources
    .map((source, index) => {
      const header = `===== Lecture ${index + 1}: ${source.title} =====`;
      const outline = `Topics covered:\n${source.outline}`;
      return source.content
        ? `${header}\n${outline}\n\n--- Full lecture text ---\n${source.content}`
        : `${header}\n${outline}`;
    })
    .join('\n\n');
}
