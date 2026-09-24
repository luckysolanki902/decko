import { use } from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Target } from 'lucide-react';
import { goRoadmap } from '@/data/go';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PhaseContent } from '@/components/PhaseContent';
import { getAllPhaseParams, getPhaseMetadata } from '@/lib/seo';

export const generateStaticParams = () => getAllPhaseParams('go');
export async function generateMetadata({ params }: { params: Promise<{ phaseId: string }> }) {
  return getPhaseMetadata('go', (await params).phaseId);
}

export default function GoPhasePage({ params }: { params: Promise<{ phaseId: string }> }) {
  const { phaseId } = use(params);
  const phase = normalizeRoadmap(goRoadmap).phases.find(item => item.id === phaseId);
  if (!phase) return notFound();
  const hasQuiz = fs.existsSync(path.join(process.cwd(), 'public', 'data', 'quizzes', 'go', `${phaseId}.json`));
  return <main className="min-h-screen py-10 md:py-14"><div className="container-page">
    <Breadcrumbs crumbs={[{ label: 'Go Engineering', href: '/go' }, { label: `Phase ${phase.number}` }]} />
    <header className="mb-8"><div className="flex gap-3 mb-4"><span className="text-[11px] font-medium text-[#075A72] bg-[#DDF7FC] px-2.5 py-1 rounded-md">Phase {phase.number}</span><span className="text-[11px] text-[#8A8A86]">{phase.days}</span></div><h1 className="text-2xl md:text-3xl font-semibold mb-2">{phase.title}</h1><p className="text-[#52524E] dark:text-[#9E9C98]">{phase.subtitle}</p></header>
    <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-5 mb-6"><div className="flex gap-3"><Target className="w-4 h-4 text-[#00ADD8] mt-0.5" /><div><h2 className="text-sm font-medium mb-1">Phase Goal</h2><p className="text-sm text-[#52524E] dark:text-[#9E9C98]">{phase.goal}</p></div></div></div>
    <PhaseContent phase={phase} phaseId={phaseId} section="go" variant="blue" backPath="/go" backLabel="Back to all phases" hasQuiz={hasQuiz} />
  </div></main>;
}
