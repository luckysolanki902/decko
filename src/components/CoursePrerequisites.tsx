import Link from 'next/link';

import { COURSES } from '@/data/courses';

export function CoursePrerequisites({ courseId }: { courseId: string }) {
  const course = COURSES.find(item => item.id === courseId);
  if (!course) return null;

  return (
    <aside className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Prerequisites</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{course.prerequisites}</p>
      {course.prerequisiteCourseId && (
        <Link
          href={COURSES.find(item => item.id === course.prerequisiteCourseId)?.href ?? '/'}
          className="mt-3 inline-block text-sm font-medium text-[var(--text-primary)] underline underline-offset-4"
        >
          Study the prerequisite course first
        </Link>
      )}
    </aside>
  );
}
