import { use } from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { mlRoadmap } from '@/data/ml';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PhaseContent } from '@/components/PhaseContent';
import { Target } from 'lucide-react';
import { getAllPhaseParams, getPhaseMetadata } from '@/lib/seo';

export const generateStaticParams = () => getAllPhaseParams('ml');
export async function generateMetadata({ params }: { params: Promise<{ phaseId: string }> }) {
  return getPhaseMetadata('ml', (await params).phaseId);
}

export default function MLPhasePage({ params }: { params: Promise<{ phaseId: string }> }) {
  const { phaseId } = use(params);
  const roadmap = normalizeRoadmap(mlRoadmap);
  const phase = roadmap.phases.find(p => p.id === phaseId);
  const hasQuiz = fs.existsSync(path.join(process.cwd(), 'public', 'data', 'quizzes', 'ml', `${phaseId}.json`));

  if (!phase) return notFound();

  return (
    <main className="min-h-screen py-10 md:py-14">
      <div className="container-page">
        <Breadcrumbs crumbs={[
          { label: 'ML, DL & GenAI', href: '/ml' },
          { label: `Phase ${phase.number}` }
        ]} />

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-medium text-[#4F7F64] dark:text-[#7AAE8E] bg-[#E2EDE6] dark:bg-[#1C2820] px-2.5 py-1 rounded-md">
              Phase {phase.number}
            </span>
            <span className="text-[11px] text-[#8A8A86] dark:text-[#686664]">{phase.days}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">
            {phase.title}
          </h1>
          <p className="text-[#52524E] dark:text-[#9E9C98] mb-4">{phase.subtitle}</p>
        </header>

        <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-5 mb-6">
          <div className="flex items-start gap-3">
            <Target className="w-4 h-4 text-[#5D8E72] dark:text-[#7AAE8E] mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4] mb-1">Phase Goal</h2>
              <p className="text-sm text-[#52524E] dark:text-[#9E9C98] leading-relaxed">{phase.goal}</p>
            </div>
          </div>
        </div>

        <PhaseContent
          phase={phase}
          phaseId={phaseId}
          section="ml"
          variant="emerald"
          backPath="/ml"
          backLabel="Back to all phases"
          hasQuiz={hasQuiz}
        />
      </div>
    </main>
  );
}
