import 'server-only';

import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

import { COURSES } from '@/data/courses';
import { damlRoadmap } from '@/data/daml';
import { dsaRoadmap } from '@/data/dsa';
import { goRoadmap } from '@/data/go';
import { mlRoadmap } from '@/data/ml';
import { reactNativeRoadmap } from '@/data/reactnative';
import { webdRoadmap } from '@/data/webd';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const COURSE_IDS = ['webd', 'daml', 'ml', 'dsa', 'go', 'reactnative'] as const;
export type CourseId = (typeof COURSE_IDS)[number];

export interface CourseSeo {
  id: CourseId;
  route: string;
  lectureDirectory: string;
  shortTitle: string;
  title: string;
  description: string;
  accent: string;
  accentSoft: string;
  keywords: string[];
}

export interface LectureSeo {
  courseId: CourseId;
  slug: string;
  title: string;
  day: string;
  phase: string;
  phaseId: string;
  duration: string;
  filePath: string;
  lastModified: Date;
}

const courseCards = new Map(COURSES.map(course => [course.id, course]));

export const COURSE_SEO: Record<CourseId, CourseSeo> = {
  webd: course('webd', '/webd', 'webd', 'Web Development', ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'full-stack development']),
  daml: course('daml', '/daml', 'daml', 'Python & Data Analytics', ['Python', 'SQL', 'Excel', 'Tableau', 'Pandas', 'data analytics']),
  ml: course('ml', '/ml', 'ml', 'ML, DL & GenAI', ['machine learning', 'deep learning', 'LLMs', 'RAG', 'AI agents', 'MLOps']),
  dsa: course('dsa', '/dsa', 'dsa', 'DSA with C++', ['data structures', 'algorithms', 'C++', 'competitive programming', 'dynamic programming']),
  go: course('go', '/go', 'go', 'Go Engineering', ['Go', 'Golang', 'backend engineering', 'concurrency', 'PostgreSQL', 'Docker']),
  reactnative: course('reactnative', '/react-native', 'reactnative', 'React Native', ['React Native', 'Expo', 'mobile development', 'iOS', 'Android', 'offline-first']),
};

const roadmaps = {
  webd: normalizeRoadmap(webdRoadmap),
  daml: normalizeRoadmap(damlRoadmap),
  ml: normalizeRoadmap(mlRoadmap),
  dsa: normalizeRoadmap(dsaRoadmap),
  go: normalizeRoadmap(goRoadmap),
  reactnative: normalizeRoadmap(reactNativeRoadmap),
};

function course(id: CourseId, route: string, lectureDirectory: string, shortTitle: string, keywords: string[]): CourseSeo {
  const card = courseCards.get(id);
  if (!card) throw new Error(`Missing course card for ${id}`);

  return {
    id,
    route,
    lectureDirectory,
    shortTitle,
    title: `${shortTitle} Course`,
    description: card.description,
    accent: card.accent.light,
    accentSoft: `${card.accent.light}24`,
    keywords,
  };
}

function socialImage(courseId: CourseId | 'site', kind: 'course' | 'phase' | 'lecture', slug: string) {
  return `/og/${courseId}/${kind}/${encodeURIComponent(slug)}`;
}

function pageMetadata({
  title,
  description,
  pathname,
  image,
  keywords,
  type = 'website',
}: {
  title: string;
  description: string;
  pathname: string;
  image: string;
  keywords?: string[];
  type?: 'website' | 'article';
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: pathname },
    openGraph: {
      type,
      locale: 'en_US',
      siteName: SITE_NAME,
      title,
      description,
      url: pathname,
      images: [{ url: image, width: 1200, height: 630, alt: `${title} — ${SITE_NAME}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function getCourseSeo(courseId: string) {
  return COURSE_SEO[courseId as CourseId];
}

export function getCourseMetadata(courseId: CourseId): Metadata {
  const value = COURSE_SEO[courseId];
  return pageMetadata({
    title: value.title,
    description: value.description,
    pathname: value.route,
    image: socialImage(courseId, 'course', 'overview'),
    keywords: value.keywords,
  });
}

export function getCollectionMetadata(courseId: CourseId, collection: 'notes' | 'projects'): Metadata {
  const value = COURSE_SEO[courseId];
  const isNotes = collection === 'notes';
  const title = `${isNotes ? 'Lectures & Notes' : 'Projects'} — ${value.shortTitle}`;
  const description = isNotes
    ? `Browse every free ${value.shortTitle} lecture, worked example, practice set, and recall check in order.`
    : `Build portfolio projects from the ${value.shortTitle} roadmap, progressing from guided fundamentals to production work.`;
  return pageMetadata({
    title,
    description,
    pathname: `${value.route}/${collection}`,
    image: socialImage(courseId, 'course', collection),
    keywords: value.keywords,
  });
}

export function getPhase(courseId: CourseId, phaseId: string) {
  return roadmaps[courseId].phases.find(phase => phase.id === phaseId);
}

export function getPhaseMetadata(courseId: CourseId, phaseId: string): Metadata {
  const courseValue = COURSE_SEO[courseId];
  const phase = getPhase(courseId, phaseId);
  if (!phase) return { title: 'Phase not found', robots: { index: false, follow: false } };

  const title = `${phase.title} — ${courseValue.shortTitle}`;
  const description = phase.goal || phase.subtitle;
  const pathname = `${courseValue.route}/${phaseId}`;
  return pageMetadata({
    title,
    description,
    pathname,
    image: socialImage(courseId, 'phase', phaseId),
    keywords: courseValue.keywords,
  });
}

export function getAllPhaseParams(courseId: CourseId) {
  return roadmaps[courseId].phases.map(phase => ({ phaseId: phase.id }));
}

function cleanTitle(value: string) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/^Day\s+\d+(?:\.[a-z])?:\s*/i, '')
    .replace(/\*\*/g, '')
    .trim();
}

export function getLectures(courseId: CourseId): LectureSeo[] {
  const courseValue = COURSE_SEO[courseId];
  const root = path.join(process.cwd(), 'public', 'data', 'lectures', courseValue.lectureDirectory);
  if (!fs.existsSync(root)) return [];

  const lectures: LectureSeo[] = [];
  for (const phaseFolder of fs.readdirSync(root)) {
    const phasePath = path.join(root, phaseFolder);
    if (!fs.statSync(phasePath).isDirectory() || !/^phase-?\d+$/i.test(phaseFolder)) continue;

    for (const filename of fs.readdirSync(phasePath)) {
      if (!/\.(md|html)$/i.test(filename)) continue;
      const dayMatch = filename.match(/^day(\d+)([a-z]?)-/i);
      if (!dayMatch) continue;

      const filePath = path.join(phasePath, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      const isHtml = filename.endsWith('.html');
      const heading = isHtml
        ? content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
        : content.match(/^#\s+(.+)$/m)?.[1];
      if (!heading) continue;

      const phaseNumber = phaseFolder.match(/\d+/)?.[0] ?? '';
      const daySuffix = dayMatch[2] ? `.${dayMatch[2].toLowerCase()}` : '';
      lectures.push({
        courseId,
        slug: filename.replace(/\.(md|html)$/i, ''),
        title: cleanTitle(heading),
        day: `Day ${dayMatch[1]}${daySuffix}`,
        phase: `Phase ${phaseNumber}`,
        phaseId: phaseFolder,
        duration: content.match(/Duration:\s*([^|\n]+)/i)?.[1]?.trim() || 'Self-paced',
        filePath,
        lastModified: fs.statSync(filePath).mtime,
      });
    }
  }

  return lectures;
}

export function getLecture(courseId: CourseId, slug: string) {
  return getLectures(courseId).find(lecture => lecture.slug === slug);
}

export function getLectureMetadata(courseId: CourseId, slug: string): Metadata {
  const courseValue = COURSE_SEO[courseId];
  const lecture = getLecture(courseId, slug);
  if (!lecture) return { title: 'Lecture not found', robots: { index: false, follow: false } };

  const title = `${lecture.title} — ${courseValue.shortTitle}`;
  const description = `${lecture.day} of the free ${courseValue.shortTitle} course. Learn ${lecture.title} with worked examples, practice, and recall checks.`;
  const pathname = `${courseValue.route}/notes/${lecture.slug}`;
  return pageMetadata({
    title,
    description,
    pathname,
    image: socialImage(courseId, 'lecture', lecture.slug),
    keywords: [...courseValue.keywords, lecture.title],
    type: 'article',
  });
}

export function courseJsonLd(courseId: CourseId) {
  const value = COURSE_SEO[courseId];
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: value.title,
    description: value.description,
    url: `${SITE_URL}${value.route}`,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    isAccessibleForFree: true,
    educationalLevel: 'Beginner to advanced',
    inLanguage: 'en',
  };
}

export function lectureJsonLd(courseId: CourseId, slug: string) {
  const value = COURSE_SEO[courseId];
  const lecture = getLecture(courseId, slug);
  if (!lecture) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lecture.title,
    description: `${lecture.day} in the ${value.shortTitle} course.`,
    url: `${SITE_URL}${value.route}/notes/${lecture.slug}`,
    isAccessibleForFree: true,
    learningResourceType: 'Lecture',
    educationalLevel: 'Beginner to advanced',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'Course',
      name: value.title,
      url: `${SITE_URL}${value.route}`,
    },
  };
}
