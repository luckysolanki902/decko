import Link from 'next/link';
import { BookOpen, FolderKanban } from 'lucide-react';
import { reactNativeRoadmap } from '@/data/reactnative';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { PageHeader } from '@/components/PageHeader';
import { RoadmapProgress, PhaseSection } from '@/components/RoadmapProgress';
import { courseJsonLd, getCourseMetadata } from '@/lib/seo';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { CoursePrerequisites } from '@/components/CoursePrerequisites';

export const metadata = getCourseMetadata('reactnative');

const sections: PhaseSection[] = [
  { title: 'Native Product Foundations', subtitle: 'Core components, adaptive layout, forms, lists, and accessibility', emoji: '📱', phaseIds: ['phase1', 'phase2'] },
  { title: 'Navigation and Offline Data', subtitle: 'Typed routes, state, persistence, synchronization, and conflict', emoji: '🔄', phaseIds: ['phase3', 'phase4'] },
  { title: 'Device-Quality Experiences', subtitle: 'Capabilities, motion, performance, testing, security, and inclusion', emoji: '🧭', phaseIds: ['phase5', 'phase6', 'phase7'] },
  { title: 'Native Delivery', subtitle: 'Platform toolchains, modules, widgets, stores, operations, and capstone', emoji: '🚀', phaseIds: ['phase8', 'phase9', 'phase10'] },
];

export default function ReactNativePage() {
  const roadmap = normalizeRoadmap(reactNativeRoadmap);
  return <main className="min-h-screen py-12 md:py-16"><SeoJsonLd data={courseJsonLd('reactnative')} /><div className="container-page">
    <PageHeader breadcrumbs={[{ label: 'React Native' }]} title={roadmap.title} subtitle={`${roadmap.totalDays} Days`} description={roadmap.description} variant="blue" />
    <CoursePrerequisites courseId="reactnative" />
    <div className="grid gap-4 mb-8 md:grid-cols-2">
      <Link href="/react-native/notes" className="group"><div className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#61DAFB]"><div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-[#22A7C8]" /><div><h3 className="text-sm font-semibold">Lectures & Notes</h3><p className="text-xs text-[#8A8A86]">Mastery-depth lessons, exercises, and quizzes</p></div></div></div></Link>
      <Link href="/react-native/projects" className="group"><div className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#61DAFB]"><div className="flex items-center gap-3"><FolderKanban className="w-5 h-5 text-[#22A7C8]" /><div><h3 className="text-sm font-semibold">Projects</h3><p className="text-xs text-[#8A8A86]">A substantial product and evidence gate in every phase</p></div></div></div></Link>
    </div>
    <RoadmapProgress phases={roadmap.phases} section="reactnative" variant="blue" basePath="/react-native" groupedSections={sections} />
  </div></main>;
}
