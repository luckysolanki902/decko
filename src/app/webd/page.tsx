import Link from 'next/link';
import { BookOpen, FolderKanban, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { RoadmapProgress, type PhaseSection } from '@/components/RoadmapProgress';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { CoursePrerequisites } from '@/components/CoursePrerequisites';
import { webdRoadmap } from '@/data/webd';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { courseJsonLd, getCourseMetadata } from '@/lib/seo';

export const metadata = getCourseMetadata('webd');

const sections: PhaseSection[] = [
  { title: 'Browser Foundations', subtitle: 'HTML, CSS, JavaScript, and TypeScript before frameworks', emoji: '🌐', phaseIds: ['phase1', 'phase2', 'phase3'] },
  { title: 'Full-Stack Products', subtitle: 'React, APIs, databases, identity, and Next.js', emoji: '⚛️', phaseIds: ['phase4', 'phase5', 'phase6', 'phase7', 'phase8'] },
  { title: 'Production Systems', subtitle: 'Payments, storage, real-time work, testing, jobs, and trusted email', emoji: '⚙️', phaseIds: ['phase9', 'phase10', 'phase11', 'phase12', 'phase13', 'phase14'] },
  { title: 'Ship and Operate', subtitle: 'Containers, continuous delivery, AWS, GCP, and reliability', emoji: '🚀', phaseIds: ['phase15', 'phase16', 'phase17'] },
];

export default function WebDPage() {
  const roadmap = normalizeRoadmap(webdRoadmap);
  return <CoursePage roadmap={roadmap} />;
}

function CoursePage({ roadmap }: { roadmap: ReturnType<typeof normalizeRoadmap> }) {
  return <main className="min-h-screen py-12 md:py-16"><SeoJsonLd data={courseJsonLd('webd')} /><div className="container-page">
    <PageHeader breadcrumbs={[{ label: 'Web Engineering' }]} title={roadmap.title} subtitle={`${roadmap.totalDays} focused days`} description={roadmap.description} variant="blue" />
    <CoursePrerequisites courseId="webd" />
    <nav className="mb-8 grid gap-4 md:grid-cols-3">
      <CourseLink href="/webd/notes" icon={<BookOpen className="h-5 w-5" />} title="Launch lectures" body="Three modern deck lectures with embedded checks" />
      <CourseLink href="/webd/revision" icon={<Sparkles className="h-5 w-5" />} title="Revision" body="Recall first, then take the graded check" />
      <CourseLink href="/webd/projects" icon={<FolderKanban className="h-5 w-5" />} title="Project ladder" body="A distinct professional artifact and evidence gate in every phase" />
    </nav>
    <RoadmapProgress phases={roadmap.phases} section="webd" variant="blue" basePath="/webd" groupedSections={sections} />
  </div></main>;
}

function CourseLink({ href, icon, title, body }: { href: string; icon: React.ReactNode; title: string; body: string }) {
  return <Link href={href} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 transition-colors hover:border-[var(--border-hover)]"><div className="flex gap-3 text-[var(--text-primary)]">{icon}<div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-xs text-[var(--text-tertiary)]">{body}</p></div></div></Link>;
}
