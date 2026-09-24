'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Check } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useProgress } from '@/lib/progress';
import { webdRoadmap } from '@/data/webd';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';

export default function WebDProjectsPage() {
  const { completedItems } = useProgress('webd');
  
  const capstoneProjects = useMemo(() => {
    // Extract capstone projects from roadmap
    const roadmap = normalizeRoadmap(webdRoadmap);
    const projects: Array<{
      id: string;
      title: string;
      description: string;
      phase: string;
      phaseTitle: string;
      completed: boolean;
    }> = [];

    roadmap.phases.forEach(phase => {
      phase.sections.forEach(section => {
        // Check section project
        if (section.project && section.project.type === 'capstone') {
          const projectId = `${phase.id}-${section.id}-project`;
          projects.push({
            id: projectId,
            title: section.project.title,
            description: section.project.description,
            phase: `Phase ${phase.number}`,
            phaseTitle: phase.title,
            completed: completedItems.has(projectId)
          });
        }
        
        // Check topic projects
        section.topics.forEach(topic => {
          if (topic.project && topic.project.type === 'capstone') {
            const projectId = `${phase.id}-${section.id}-${topic.id}-project`;
            projects.push({
              id: projectId,
              title: topic.project.title,
              description: topic.project.description,
              phase: `Phase ${phase.number}`,
              phaseTitle: phase.title,
              completed: completedItems.has(projectId)
            });
          }
        });
      });
    });

    return projects;
  }, [completedItems]);

  const completedProjects = capstoneProjects.filter(p => p.completed);
  const totalProjects = capstoneProjects.length;

  return (
    <main className="min-h-screen py-10 md:py-14">
      <div className="container-page">
        <div>
          <Breadcrumbs crumbs={[
            { label: 'Web Dev', href: '/webd' },
            { label: 'Projects' }
          ]} />

          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">
              Capstone Projects
            </h1>
            <p className="text-[#52524E] dark:text-[#9E9C98] leading-relaxed mb-4">
              Major portfolio-ready projects completed throughout your learning journey.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">
                {completedProjects.length} of {totalProjects} completed
              </span>
              {totalProjects > 0 && (
                <div className="flex-1 max-w-xs h-2 rounded-full bg-[#F2F1EE] dark:bg-[#232321] overflow-hidden">
                  <div 
                    className="h-full bg-[#6889A6] transition-all duration-300"
                    style={{ width: `${(completedProjects.length / totalProjects) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </header>

          {/* Completed Projects */}
          {completedProjects.length > 0 ? (
            <div className="space-y-4 mb-8">
              <h2 className="text-base font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5D8E72] dark:text-[#7AAE8E]" />
                Completed Projects
              </h2>
              {completedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-[#1A1A18] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28]"
                >
                  <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-[#5D8E72] dark:text-[#7AAE8E] mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[#507290] dark:text-[#8AAAC4] bg-[#E2EBF0] dark:bg-[#182228] px-2 py-0.5 rounded">
                          {project.phase}
                        </span>
                        <span className="text-xs text-[#8A8A86] dark:text-[#686664]">{project.phaseTitle}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#52524E] dark:text-[#9E9C98] leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#E2EDE6] dark:bg-[#1C2820] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#5D8E72] dark:text-[#7AAE8E]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1A1A18] rounded-xl p-8 border border-[#E5E4DF] dark:border-[#2C2B28] text-center mb-8">
              <Trophy className="w-12 h-12 text-[#6889A6] dark:text-[#8AAAC4] mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">
                No Completed Projects Yet
              </h3>
              <p className="text-xs text-[#8A8A86] dark:text-[#686664]">
                Complete capstone projects as you progress through the roadmap and they&apos;ll appear here.
              </p>
            </div>
          )}

          {/* Upcoming Projects */}
          {capstoneProjects.filter(p => !p.completed).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#52524E] dark:text-[#9E9C98] mb-4">
                Upcoming Projects
              </h2>
              {capstoneProjects.filter(p => !p.completed).map((project) => (
                <div
                  key={project.id}
                  className="bg-[#F2F1EE] dark:bg-[#232321] rounded-xl p-5 border border-[#E5E4DF] dark:border-[#2C2B28] opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-[#ADADA9] dark:text-[#4A4846] mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[#ADADA9] dark:text-[#4A4846] bg-white dark:bg-[#1A1A18] px-2 py-0.5 rounded">
                          {project.phase}
                        </span>
                        <span className="text-xs text-[#ADADA9] dark:text-[#4A4846]">{project.phaseTitle}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#52524E] dark:text-[#9E9C98] mb-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#8A8A86] dark:text-[#686664] leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="text-center mt-10 pt-6 border-t border-[#E5E4DF] dark:border-[#2C2B28]">
            <Link 
              href="/webd" 
              className="inline-flex items-center gap-2 text-sm text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to overview
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
