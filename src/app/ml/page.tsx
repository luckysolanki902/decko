import Link from 'next/link';
import { mlRoadmap } from '@/data/ml';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { PageHeader } from '@/components/PageHeader';
import { RoadmapProgress, PhaseSection } from '@/components/RoadmapProgress';
import { BookOpen, FolderKanban } from 'lucide-react';
import { courseJsonLd, getCourseMetadata } from '@/lib/seo';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { CoursePrerequisites } from '@/components/CoursePrerequisites';

export const metadata = getCourseMetadata('ml');

const mlSections: PhaseSection[] = [
  {
    title: 'Classical ML Core',
    subtitle: 'ML math -> supervised ML -> unsupervised discovery and retrieval foundations',
    emoji: '🧠',
    phaseIds: ['phase1', 'phase2', 'phase3'],
    careerInfo: {
      roles: ['ML Intern', 'Data Science Intern', 'Junior Data Scientist', 'Applied ML Intern'],
      salaries: {
        indiaCorporate: '₹6-12 LPA',
        indianStartups: '₹8-16 LPA',
        usStartups: '$70-115K/yr',
      },
    },
  },
  {
    title: 'Deep Learning & Multimodal',
    subtitle: 'Neural nets from scratch -> PyTorch -> vision and multimodal perception',
    emoji: '⚙️',
    phaseIds: ['phase4', 'phase5'],
    careerInfo: {
      roles: ['Deep Learning Intern', 'Computer Vision Intern', 'ML Engineer Intern', 'AI Prototyping Engineer'],
      salaries: {
        indiaCorporate: '₹8-18 LPA',
        indianStartups: '₹10-22 LPA',
        usStartups: '$90-145K/yr',
      },
    },
  },
  {
    title: 'NLP, Transformers, RL & LLMs',
    subtitle: 'Classic NLP -> transformer internals -> RL foundations -> post-training, evaluation, and calibrated decisions',
    emoji: '✨',
    phaseIds: ['phase6', 'phase7', 'phase8'],
    careerInfo: {
      roles: ['NLP Intern', 'GenAI Intern', 'LLM Engineer Intern', 'Applied AI Engineer'],
      salaries: {
        indiaCorporate: '₹10-24 LPA',
        indianStartups: '₹12-30 LPA',
        usStartups: '$105-170K/yr',
      },
    },
  },
  {
    title: 'RAG, Agents & Production AI',
    subtitle: 'Retrieval, tool use, agents, observability, security, and LLM product engineering',
    emoji: '🧩',
    phaseIds: ['phase9'],
    careerInfo: {
      roles: ['RAG Engineer', 'Agent Engineer', 'LLM App Engineer', 'AI Product Engineer'],
      salaries: {
        indiaCorporate: '₹14-32 LPA',
        indianStartups: '₹18-45 LPA',
        usStartups: '$125-210K/yr',
      },
    },
  },
  {
    title: 'Generative Images, Video, 3D & Launch',
    subtitle: 'Diffusion, flow matching, spatial generation, world models, research experiments, and production',
    emoji: '🚀',
    phaseIds: ['phase10'],
    careerInfo: {
      roles: ['ML Engineer', 'AI Product Engineer', 'MLOps Intern', 'Founding AI Engineer'],
      salaries: {
        indiaCorporate: '₹12-28 LPA',
        indianStartups: '₹16-36 LPA',
        usStartups: '$115-190K/yr',
      },
    },
  },
];

export default function MLPage() {
  const roadmap = normalizeRoadmap(mlRoadmap);

  return (
    <main className="min-h-screen py-12 md:py-16">
      <SeoJsonLd data={courseJsonLd('ml')} />
      <div className="container-page">
        <PageHeader
          breadcrumbs={[{ label: 'ML, DL & GenAI' }]}
          title={roadmap.title}
          subtitle={`${roadmap.totalDays} study units · flexible pace`}
          description={roadmap.description}
          variant="emerald"
        />

        <CoursePrerequisites courseId="ml" />

        <div className="grid gap-4 mb-8 md:grid-cols-2">
          <Link href="/ml/notes" className="group">
            <div className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936] transition-colors">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#5D8E72] dark:text-[#7AAE8E]" />
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-0.5">Notes</h3>
                  <p className="text-xs text-[#8A8A86] dark:text-[#686664]">Deep lectures and practice</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/ml/projects" className="group">
            <div className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936] transition-colors">
              <div className="flex items-center gap-3">
                <FolderKanban className="w-5 h-5 text-[#5D8E72] dark:text-[#7AAE8E]" />
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-0.5">Projects</h3>
                  <p className="text-xs text-[#8A8A86] dark:text-[#686664]">Portfolio capstones</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <RoadmapProgress
          phases={roadmap.phases}
          section="ml"
          variant="emerald"
          basePath="/ml"
          groupedSections={mlSections}
        />
      </div>
    </main>
  );
}
