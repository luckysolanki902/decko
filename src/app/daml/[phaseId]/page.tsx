import { use } from 'react';
import fs from 'fs';
import path from 'path';
import { damlRoadmap } from '@/data/daml';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PhaseContent } from '@/components/PhaseContent';
import { Target } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllPhaseParams, getPhaseMetadata } from '@/lib/seo';

export const generateStaticParams = () => getAllPhaseParams('daml');
export async function generateMetadata({ params }: { params: Promise<{ phaseId: string }> }) {
  return getPhaseMetadata('daml', (await params).phaseId);
}

export default function DAMLPhasePage({ params }: { params: Promise<{ phaseId: string }> }) {
  const { phaseId } = use(params);
  
  const roadmap = normalizeRoadmap(damlRoadmap);
  const phase = roadmap.phases.find(p => p.id === phaseId);
  const hasQuiz = fs.existsSync(path.join(process.cwd(), 'public', 'data', 'quizzes', 'daml', `${phaseId}.json`));

  if (!phase) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-8 text-center max-w-sm mx-auto">
          <h1 className="text-xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">Phase not found</h1>
          <p className="text-sm text-[#52524E] dark:text-[#9E9C98] mb-6">This phase doesn&apos;t exist yet.</p>
          <Link href="/daml" className="inline-flex items-center gap-2 text-[#B87D6C] dark:text-[#D4A090] hover:text-[#9A6452] dark:hover:text-[#E0B0A0] text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to overview
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 md:py-14">
      <div className="container-page">
        <div>
          <Breadcrumbs crumbs={[
            { label: 'Python & Data Analytics', href: '/daml' },
            { label: `Phase ${phase.number}` }
          ]} />

          {/* Phase Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#9A6452] dark:text-[#D4A090] bg-[#F0E5E0] dark:bg-[#2A2018] px-2.5 py-1 rounded-md">
                Phase {phase.number}
              </span>
              <span className="text-[11px] text-[#8A8A86] dark:text-[#686664]">{phase.days}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">
              {phase.title}
            </h1>
            <p className="text-[#52524E] dark:text-[#9E9C98] mb-4">{phase.subtitle}</p>

          </header>

          {/* Goal Card */}
          <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-5 mb-6">
            <div className="flex items-start gap-3">
              <Target className="w-4 h-4 text-[#B87D6C] dark:text-[#D4A090] mt-0.5 shrink-0" />
              <div>
                <h2 className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4] mb-1">Phase Goal</h2>
                <p className="text-sm text-[#52524E] dark:text-[#9E9C98] leading-relaxed">{phase.goal}</p>
              </div>
            </div>
          </div>

          {/* Client-side interactive content */}
          <PhaseContent 
            phase={phase} 
            phaseId={phaseId} 
            section="daml" 
            variant="rose" 
            backPath="/daml"
            backLabel="Back to all phases"
            hasQuiz={hasQuiz}
          />
        </div>
      </div>
    </main>
  );
}
