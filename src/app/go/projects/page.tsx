'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Trophy } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { goRoadmap } from '@/data/go';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { useProgress } from '@/lib/progress';

export default function GoProjectsPage() {
  const { completedItems } = useProgress('go');
  const projects = useMemo(() => {
    return normalizeRoadmap(goRoadmap).phases.flatMap(phase =>
      phase.sections.flatMap(section => section.topics.flatMap(topic => {
        if (topic.project?.type !== 'capstone') return [];
        const id = `${phase.id}-${section.id}-${topic.id}-project`;
        return [{ id, title: topic.project.title, description: topic.project.description, phase: phase.number, phaseTitle: phase.title, completed: completedItems.has(id) }];
      })),
    );
  }, [completedItems]);

  const completed = projects.filter(project => project.completed).length;

  return (
    <main className="min-h-screen py-10 md:py-14">
      <div className="container-page">
        <Breadcrumbs crumbs={[{ label: 'Go Engineering', href: '/go' }, { label: 'Projects' }]} />
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">Go Project Portfolio</h1>
          <p className="text-[#52524E] dark:text-[#9E9C98] leading-relaxed max-w-2xl mb-4">
            One substantial build closes every phase. The sequence grows from a precise field tool into a concurrent monitor and an operated public-data service.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{completed} of {projects.length} completed</span>
            <div className="flex-1 max-w-xs h-2 rounded-full bg-[#F2F1EE] dark:bg-[#232321] overflow-hidden">
              <div className="h-full bg-[#00ADD8] transition-all" style={{ width: `${projects.length ? completed / projects.length * 100 : 0}%` }} />
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map(project => (
            <article key={project.id} className={`rounded-xl p-5 border ${project.completed ? 'bg-white dark:bg-[#1A1A18] border-[#9ADCEB] dark:border-[#17677A]' : 'bg-[#F7F7F5] dark:bg-[#20201E] border-[#E5E4DF] dark:border-[#2C2B28]'}`}>
              <div className="flex items-start gap-3">
                {project.completed ? <Check className="w-5 h-5 text-[#0096B7] shrink-0 mt-0.5" /> : <Trophy className="w-5 h-5 text-[#8A8A86] shrink-0 mt-0.5" />}
                <div>
                  <p className="text-xs font-medium text-[#0096B7] mb-1">Phase {project.phase} · {project.phaseTitle}</p>
                  <h2 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">{project.title}</h2>
                  <p className="text-xs text-[#52524E] dark:text-[#9E9C98] leading-relaxed">{project.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="text-center mt-10 pt-6 border-t border-[#E5E4DF] dark:border-[#2C2B28]">
          <Link href="/go" className="inline-flex items-center gap-2 text-sm text-[#8A8A86] hover:text-[#0096B7] transition-colors"><ArrowLeft className="w-4 h-4" />Back to overview</Link>
        </footer>
      </div>
    </main>
  );
}
