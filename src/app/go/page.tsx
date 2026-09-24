import Link from 'next/link';
import { BookOpen, FolderKanban } from 'lucide-react';
import { goRoadmap } from '@/data/go';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { PageHeader } from '@/components/PageHeader';
import { RoadmapProgress, PhaseSection } from '@/components/RoadmapProgress';
import { courseJsonLd, getCourseMetadata } from '@/lib/seo';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { CoursePrerequisites } from '@/components/CoursePrerequisites';

export const metadata = getCourseMetadata('go');

const sections: PhaseSection[] = [
  { title: 'Language Foundations', subtitle: 'Toolchain, values, collections, memory, and the type system', emoji: '🐹', phaseIds: ['phase1', 'phase2', 'phase3'] },
  { title: 'Build Reliable Programs', subtitle: 'Modules, files, CLIs, concurrency, testing, and security', emoji: '🧩', phaseIds: ['phase4', 'phase5', 'phase6'] },
  { title: 'Production Services', subtitle: 'HTTP, PostgreSQL, authentication, caching, workers, and telemetry', emoji: '⚙️', phaseIds: ['phase7', 'phase8', 'phase9'] },
  { title: 'Ship and Integrate', subtitle: 'Containers, delivery, operations, and the final relief network', emoji: '🚀', phaseIds: ['phase10', 'phase11'] },
];

export default function GoPage() {
  const roadmap = normalizeRoadmap(goRoadmap);
  return <main className="min-h-screen py-12 md:py-16"><SeoJsonLd data={courseJsonLd('go')} /><div className="container-page">
    <PageHeader breadcrumbs={[{ label: 'Go Engineering' }]} title={roadmap.title} subtitle={`${roadmap.totalDays} Days`} description={roadmap.description} variant="blue" />
    <CoursePrerequisites courseId="go" />
    <div className="grid gap-4 mb-8 md:grid-cols-2">
      <Link href="/go/notes" className="group"><div className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936]"><div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-[#00ADD8]" /><div><h3 className="text-sm font-semibold">Lectures & Notes</h3><p className="text-xs text-[#8A8A86]">Mastery-depth lessons, exercises, and quizzes</p></div></div></div></Link>
      <Link href="/go/projects" className="group"><div className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936]"><div className="flex items-center gap-3"><FolderKanban className="w-5 h-5 text-[#00ADD8]" /><div><h3 className="text-sm font-semibold">Projects</h3><p className="text-xs text-[#8A8A86]">Every phase project and final capstone</p></div></div></div></Link>
    </div>
    <RoadmapProgress phases={roadmap.phases} section="go" variant="blue" basePath="/go" groupedSections={sections} />
  </div></main>;
}
