import Link from 'next/link';
import { BookOpen, FolderKanban } from 'lucide-react';
import { dsaRoadmap } from '@/data/dsa';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { PageHeader } from '@/components/PageHeader';
import { RoadmapProgress, PhaseSection } from '@/components/RoadmapProgress';
import { courseJsonLd, getCourseMetadata } from '@/lib/seo';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { CoursePrerequisites } from '@/components/CoursePrerequisites';

export const metadata = getCourseMetadata('dsa');

const sections: PhaseSection[] = [
  { title: 'Foundations', subtitle: 'C++ & complexity, STL, recursion, sorting, and binary search', emoji: '💻', phaseIds: ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'] },
  { title: 'Core Data Structures', subtitle: 'Arrays, strings, sliding window, linked lists, backtracking, bits, stacks/queues, and heaps', emoji: '🧱', phaseIds: ['phase6', 'phase7', 'phase8', 'phase9', 'phase10', 'phase11', 'phase12', 'phase13'] },
  { title: 'Trees, Graphs & DP', subtitle: 'Greedy, binary trees, BST, tries, graphs, and dynamic programming', emoji: '🌳', phaseIds: ['phase14', 'phase15', 'phase16', 'phase17', 'phase18', 'phase19'] },
  { title: 'Advanced & Contest Craft', subtitle: 'Advanced strings, number theory, segment trees, advanced graphs/DP, and competitive programming', emoji: '🏆', phaseIds: ['phase20', 'phase21', 'phase22', 'phase23', 'phase24', 'phase25'] },
];

export default function DsaPage() {
  const roadmap = normalizeRoadmap(dsaRoadmap);
  return <main className="min-h-screen py-12 md:py-16"><SeoJsonLd data={courseJsonLd('dsa')} /><div className="container-page">
    <PageHeader breadcrumbs={[{ label: 'DSA with C++' }]} title={roadmap.title} subtitle={`${roadmap.totalDays} study units · flexible pace`} description={roadmap.description} variant="blue" />
    <CoursePrerequisites courseId="dsa" />
    <div className="grid gap-4 mb-8 md:grid-cols-2">
      <Link href="/dsa/notes" className="group"><div className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936]"><div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-[#6366F1]" /><div><h3 className="text-sm font-semibold">Lectures & Notes</h3><p className="text-xs text-[#8A8A86]">Guided attempts, spaced recall, practice banks, and quizzes</p></div></div></div></Link>
      <Link href="/dsa/projects" className="group"><div className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936]"><div className="flex items-center gap-3"><FolderKanban className="w-5 h-5 text-[#6366F1]" /><div><h3 className="text-sm font-semibold">Projects</h3><p className="text-xs text-[#8A8A86]">The contest-simulation capstone</p></div></div></div></Link>
    </div>
    <RoadmapProgress phases={roadmap.phases} section="dsa" variant="blue" basePath="/dsa" groupedSections={sections} />
  </div></main>;
}
