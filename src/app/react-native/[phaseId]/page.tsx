import { use } from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Target } from 'lucide-react';
import { reactNativeRoadmap } from '@/data/reactnative';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PhaseContent } from '@/components/PhaseContent';
import { getAllPhaseParams, getPhaseMetadata } from '@/lib/seo';

export const generateStaticParams = () => getAllPhaseParams('reactnative');
export async function generateMetadata({ params }: { params: Promise<{ phaseId: string }> }) {
  return getPhaseMetadata('reactnative', (await params).phaseId);
}

export default function ReactNativePhasePage({ params }: { params: Promise<{ phaseId: string }> }) {
  const { phaseId } = use(params);
  const phase = normalizeRoadmap(reactNativeRoadmap).phases.find(item => item.id === phaseId);
  if (!phase) return notFound();
  const hasQuiz = fs.existsSync(path.join(process.cwd(), 'public', 'data', 'quizzes', 'reactnative', `${phaseId}.json`));
  return <main className="min-h-screen py-10 md:py-14"><div className="container-page">
    <Breadcrumbs crumbs={[{ label: 'React Native', href: '/react-native' }, { label: `Phase ${phase.number}` }]} />
    <header className="mb-8"><div className="flex gap-3 mb-4"><span className="text-[11px] font-medium text-[#146078] bg-[#E8F9FD] px-2.5 py-1 rounded-md">Phase {phase.number}</span><span className="text-[11px] text-[#8A8A86]">{phase.days}</span></div><h1 className="text-2xl md:text-3xl font-semibold mb-2">{phase.title}</h1><p className="text-[#52524E] dark:text-[#9E9C98]">{phase.subtitle}</p></header>
    <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-5 mb-6"><div className="flex gap-3"><Target className="w-4 h-4 text-[#22A7C8] mt-0.5" /><div><h2 className="text-sm font-medium mb-1">Phase Goal</h2><p className="text-sm text-[#52524E] dark:text-[#9E9C98]">{phase.goal}</p></div></div></div>
    <PhaseContent phase={phase} phaseId={phaseId} section="reactnative" variant="blue" backPath="/react-native" backLabel="Back to all phases" hasQuiz={hasQuiz} />
  </div></main>;
}
