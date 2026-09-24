import Link from 'next/link';
import { BookOpen, FolderKanban, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { RoadmapProgress, type PhaseSection } from '@/components/RoadmapProgress';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { damlRoadmap } from '@/data/daml';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { courseJsonLd, getCourseMetadata } from '@/lib/seo';
import { CoursePrerequisites } from '@/components/CoursePrerequisites';

export const metadata = getCourseMetadata('daml');

const sections: PhaseSection[] = [
  { title: 'Python for Investigation', subtitle: 'EDA from Day 1, then reliable programs and reproducible workflows', emoji: '🐍', phaseIds: ['phase1', 'phase2', 'phase3'] },
  { title: 'Work with Real Tables', subtitle: 'NumPy, Pandas, cleaning, visualization, and auditable Excel', emoji: '🔎', phaseIds: ['phase4', 'phase5', 'phase6'] },
  { title: 'Reason with Data', subtitle: 'SQL, analytical models, statistics, sampling, and experiments', emoji: '📐', phaseIds: ['phase7', 'phase8', 'phase9', 'phase10'] },
  { title: 'Deliver Decisions', subtitle: 'Tableau, BI, time analysis, governed metrics, and professional communication', emoji: '📊', phaseIds: ['phase11', 'phase12'] },
];

export default function DAMLPage() {
  const roadmap = normalizeRoadmap(damlRoadmap);
  return <main className="min-h-screen py-12 md:py-16"><SeoJsonLd data={courseJsonLd('daml')} /><div className="container-page">
    <PageHeader breadcrumbs={[{ label: 'Data Analytics' }]} title={roadmap.title} subtitle={`${roadmap.totalDays} focused days`} description={roadmap.description} variant="rose" />
    <CoursePrerequisites courseId="daml" />
    <nav className="mb-8 grid gap-4 md:grid-cols-3">
      <CourseLink href="/daml/notes" icon={<BookOpen className="h-5 w-5" />} title="Launch lectures" body="EDA starts immediately in the modern deck reader" />
      <CourseLink href="/daml/revision" icon={<Sparkles className="h-5 w-5" />} title="Revision" body="Retrieve definitions, checks, and decisions after a gap" />
      <CourseLink href="/daml/projects" icon={<FolderKanban className="h-5 w-5" />} title="Project ladder" body="Every artifact ends in evidence and a changed question" />
    </nav>
    <RoadmapProgress phases={roadmap.phases} section="daml" variant="rose" basePath="/daml" groupedSections={sections} />
  </div></main>;
}

function CourseLink({ href, icon, title, body }: { href: string; icon: React.ReactNode; title: string; body: string }) {
  return <Link href={href} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 transition-colors hover:border-[var(--border-hover)]"><div className="flex gap-3 text-[var(--text-primary)]">{icon}<div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-xs text-[var(--text-tertiary)]">{body}</p></div></div></Link>;
}
