'use client';

import Link from 'next/link';
import { ProgressBar } from '@/components/ProgressBar';
import ProgressCheckbox from '@/components/ProgressCheckbox';
import { ProjectCard } from '@/components/ProjectCard';
import { Accordion } from '@/components/Accordion';
import { useProgress, countPhaseItems, countPhaseCompleted } from '@/lib/progress';
import { Check, ArrowLeft, Wrench, FolderKanban, GraduationCap, BookOpen } from 'lucide-react';
import { NormalizedPhase, RoadmapSection, RoadmapVariant } from '@/types';

interface PhaseContentProps {
  phase: NormalizedPhase;
  phaseId: string;
  section: RoadmapSection;
  variant: RoadmapVariant;
  backPath: string;
  backLabel: string;
  hasQuiz?: boolean;
}

export function PhaseContent({ phase, phaseId, section, variant, backPath, backLabel, hasQuiz }: PhaseContentProps) {
  const { completedItems, isLoading } = useProgress(section);

  const totalItems = countPhaseItems(phase);
  const completed = countPhaseCompleted(phase, completedItems);
  const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
  const notesPath = section === 'reactnative' ? '/react-native/notes' : `/${section}/notes`;

  // Collect all projects
  const miniProjects: { title: string; description: string; type: string }[] = [];
  const majorProjects: { title: string; description: string; type: string }[] = [];
  
  phase.sections.forEach(sec => {
    if (sec.project) {
      if (sec.project.type === 'mini') {
        miniProjects.push(sec.project as { title: string; description: string; type: string });
      } else {
        majorProjects.push(sec.project as { title: string; description: string; type: string });
      }
    }
    sec.topics.forEach(topic => {
      if (topic.project) {
        if (topic.project.type === 'mini') {
          miniProjects.push(topic.project as { title: string; description: string; type: string });
        } else {
          majorProjects.push(topic.project as { title: string; description: string; type: string });
        }
      }
    });
  });

  return (
    <>
      {/* Progress */}
      <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">Progress</span>
          {!isLoading && (
            <span className="text-lg font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] tabular-nums">{percentage}%</span>
          )}
        </div>
        {isLoading ? (
          <div className="h-1.5 rounded-full bg-[#F2F1EE] dark:bg-[#232321] animate-pulse" />
        ) : (
          <ProgressBar completed={completed} total={totalItems} variant={variant} size="md" showLabel={false} />
        )}
        {!isLoading && (
          <p className="text-xs text-[#8A8A86] dark:text-[#686664] mt-2">{completed} of {totalItems} items completed</p>
        )}
      </div>

      {/* Project Trackers */}
      {(miniProjects.length > 0 || majorProjects.length > 0) && (
        <div className="grid gap-5 sm:grid-cols-2 mb-8">
          <Link
            href={notesPath}
            className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-5 transition-colors hover:border-[#D0CEC8] dark:hover:border-[#3A3936]"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#6889A6] dark:text-[#8AAAC4]" />
              <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">Notes</span>
            </div>
            <p className="text-xs leading-relaxed text-[#52524E] dark:text-[#9E9C98]">
              Open the written lectures for this course before checking off the phase topics.
            </p>
          </Link>
          {miniProjects.length > 0 && (
            <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-[#B87D6C] dark:text-[#D4A090]" />
                <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">Mini Projects</span>
              </div>
              <div className="space-y-2">
                {miniProjects.map((p, i) => (
                  <div key={i} className="text-xs text-[#52524E] dark:text-[#9E9C98] flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B87D6C] dark:bg-[#D4A090] mt-1.5 shrink-0" />
                    {p.title}
                  </div>
                ))}
              </div>
            </div>
          )}
          {majorProjects.length > 0 && (
            <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-5">
              <div className="flex items-center gap-2 mb-3">
                <FolderKanban className="w-4 h-4 text-[#5D8E72] dark:text-[#7AAE8E]" />
                <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">Projects</span>
              </div>
              <div className="space-y-2">
                {majorProjects.map((p, i) => (
                  <div key={i} className="text-xs text-[#52524E] dark:text-[#9E9C98] flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#5D8E72] dark:bg-[#7AAE8E] mt-1.5 shrink-0" />
                    {p.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sections with quiz inserted before last section */}
      <div className="space-y-6">
        {(() => {
          // Build a flat list of all topics to determine "next to study"
          let foundNextToStudy = false;
          let nextToStudyTopicId: string | null = null;

          // First pass: find the "next to study" topic
          for (const sec of phase.sections) {
            for (const topic of sec.topics) {
              const topicTotal = topic.items.length;
              let topicCompleted = 0;
              for (let idx = 0; idx < topic.items.length; idx++) {
                const itemId = `${phaseId}-${sec.id}-${topic.id}-${idx}`;
                if (completedItems.has(itemId)) topicCompleted++;
              }
              if (topicCompleted < topicTotal && !foundNextToStudy) {
                nextToStudyTopicId = `${sec.id}-${topic.id}`;
                foundNextToStudy = true;
              }
            }
          }

          const renderSection = (sec: NormalizedPhase['sections'][number]) => (
            <section key={sec.id}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">{sec.title}</h2>
              </div>

              <div className="space-y-3">
                {sec.topics.map((topic) => {
                  const topicTotal = topic.items.length;
                  let topicCompleted = 0;
                  for (let idx = 0; idx < topic.items.length; idx++) {
                    const itemId = `${phaseId}-${sec.id}-${topic.id}-${idx}`;
                    if (completedItems.has(itemId)) topicCompleted++;
                  }
                  const topicKey = `${sec.id}-${topic.id}`;
                  const isNextToStudy = !isLoading && topicKey === nextToStudyTopicId;

                  return (
                    <Accordion 
                      key={topic.id} 
                      title={topic.title}
                      defaultOpen={false}
                      completedCount={isLoading ? undefined : topicCompleted}
                      totalCount={isLoading ? undefined : topicTotal}
                      isNextToStudy={isNextToStudy}
                    >
                      <div className="space-y-0.5 mb-4">
                        {topic.items.map((item, idx) => (
                          <ProgressCheckbox
                            key={`${topic.id}-${idx}`}
                            itemId={`${phaseId}-${sec.id}-${topic.id}-${idx}`}
                            section={section}
                            label={item}
                          />
                        ))}
                      </div>

                      {topic.project && (
                        <ProjectCard project={topic.project} variant={variant} />
                      )}
                    </Accordion>
                  );
                })}
              </div>

              {sec.project && (
                <div className="mt-4">
                  <ProjectCard project={sec.project} variant={variant} />
              </div>
            )}
          </section>
          );

          const allSections = phase.sections;
          const sectionsBeforeLast = allSections.slice(0, -1);
          const lastSection = allSections[allSections.length - 1];

          return (
            <>
              {sectionsBeforeLast.map(renderSection)}

              {/* Revision Quiz - before the last section (capstone) */}
              {hasQuiz && (
                <Link
                  href={`/${section}/revision/${phaseId}`}
                  className="block group"
                >
                  <div className={`${
                    variant === 'rose'
                      ? 'bg-[#F0E5E0] dark:bg-[#2A2018] border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936]'
                      : variant === 'emerald'
                        ? 'bg-[#E2EDE6] dark:bg-[#1C2820] border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936]'
                        : 'bg-[#E2EBF0] dark:bg-[#182228] border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#D0CEC8] dark:hover:border-[#3A3936]'
                  } rounded-xl p-5 border transition-colors duration-200`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${
                        variant === 'rose' ? 'bg-[#F0E5E0] dark:bg-[#2A2018]' : variant === 'emerald' ? 'bg-[#E2EDE6] dark:bg-[#1C2820]' : 'bg-[#E2EBF0] dark:bg-[#182228]'
                      } flex items-center justify-center shrink-0 mt-0.5`}>
                        <GraduationCap className={`w-5 h-5 ${
                          variant === 'rose' ? 'text-[#B87D6C] dark:text-[#D4A090]' : variant === 'emerald' ? 'text-[#5D8E72] dark:text-[#7AAE8E]' : 'text-[#6889A6] dark:text-[#8AAAC4]'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-1 ${
                          variant === 'rose' ? 'group-hover:text-[#B87D6C] dark:group-hover:text-[#D4A090]' : variant === 'emerald' ? 'group-hover:text-[#5D8E72] dark:group-hover:text-[#7AAE8E]' : 'group-hover:text-[#6889A6] dark:group-hover:text-[#8AAAC4]'
                        } transition-colors`}>
                          Revision Quiz
                        </h3>
                        <p className="text-xs text-[#8A8A86] dark:text-[#686664]">
                          Test your understanding with MCQs
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {renderSection(lastSection)}
            </>
          );
        })()}
      </div>

      {/* Checkpoint */}
      {phase.checkpoint && (
        <div className="bg-[#E2EDE6] dark:bg-[#1C2820] rounded-xl border border-[#C0DAC8] dark:border-[#2A3A30] p-5 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-[#5D8E72] dark:bg-[#7AAE8E] flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">Phase Complete!</h2>
          </div>
          <p className="text-xs text-[#52524E] dark:text-[#9E9C98] mb-3">After this phase, you&apos;ll be able to:</p>
          <ul className="space-y-2">
            {phase.checkpoint.skills.map((skill, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-[#1A1A1A] dark:text-[#E8E7E4]">
                <span className="w-1 h-1 rounded-full bg-[#5D8E72] dark:bg-[#7AAE8E] mt-2 shrink-0" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
          {phase.checkpoint.milestone && (
            <p className="text-xs text-[#52524E] dark:text-[#9E9C98] mt-4 pt-4 border-t border-[#C0DAC8] dark:border-[#2A3A30] leading-relaxed">
              {phase.checkpoint.milestone}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-10 pt-6 border-t border-[#E5E4DF] dark:border-[#2C2B28]">
        <Link 
          href={backPath} 
          className="inline-flex items-center gap-2 text-sm text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      </footer>
    </>
  );
}
