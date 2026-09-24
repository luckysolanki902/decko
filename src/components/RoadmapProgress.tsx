'use client';

import { useEffect, useMemo, useState } from 'react';
import { PhaseCard } from '@/components/PhaseCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgress, countPhaseItems, countPhaseCompleted, countTotalItems, countTotalCompleted } from '@/lib/progress';
import { useQuizScores } from '@/lib/quiz';
import { NormalizedPhase, RoadmapSection, RoadmapVariant } from '@/types';
import { ChevronDown } from 'lucide-react';

export interface PhaseSection {
  title: string;
  subtitle: string;
  emoji: string;
  phaseIds: string[];
  locked?: boolean;
  lockedMessage?: string;
  careerInfo?: {
    roles: string[];
    salaries: {
      indiaCorporate: string;
      indianStartups: string;
      usStartups: string;
    };
  };
}

interface RoadmapProgressProps {
  phases: NormalizedPhase[];
  section: RoadmapSection;
  variant: RoadmapVariant;
  basePath: string;
  groupedSections?: PhaseSection[];
  optionalPhases?: NormalizedPhase[];
}

export function RoadmapProgress({ phases, section, variant, basePath, groupedSections, optionalPhases }: RoadmapProgressProps) {
  const { completedItems, isLoading } = useProgress(section);
  const { scores: quizScores } = useQuizScores(section);
  const [optionalOpen, setOptionalOpen] = useState(false);
  const [openLockedSections, setOpenLockedSections] = useState<Set<string>>(new Set());

  const storageKey = `webd-include-production-devops`;
  const [includeLocked, setIncludeLocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setIncludeLocked(stored === 'true');
    setMounted(true);
  }, []);

  const toggleIncludeLocked = () => {
    const next = !includeLocked;
    setIncludeLocked(next);
    localStorage.setItem(storageKey, String(next));
  };

  const lockedPhaseIds = useMemo(() => {
    if (!groupedSections) return new Set<string>();
    const ids = new Set<string>();
    for (const grp of groupedSections) {
      if (grp.locked) grp.phaseIds.forEach(id => ids.add(id));
    }
    return ids;
  }, [groupedSections]);

  const progressPhases = useMemo(() => {
    if (includeLocked || lockedPhaseIds.size === 0) return phases;
    return phases.filter(p => !lockedPhaseIds.has(p.id));
  }, [phases, includeLocked, lockedPhaseIds]);

  const totalItems = useMemo(() => countTotalItems(progressPhases), [progressPhases]);
  const totalCompleted = useMemo(() => countTotalCompleted(progressPhases, completedItems), [progressPhases, completedItems]);
  const percentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  const renderPhaseCard = (phase: NormalizedPhase) => (
    <PhaseCard
      key={phase.id}
      phase={phase}
      basePath={basePath}
      variant={variant}
      completed={countPhaseCompleted(phase, completedItems)}
      total={countPhaseItems(phase)}
      quizScore={quizScores[phase.id] || null}
    />
  );

  return (
    <>
      {/* Overall Progress */}
      <div className="bg-white dark:bg-[#1A1A18] rounded-xl p-6 border border-[#E5E4DF] dark:border-[#2C2B28] mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4] mb-0.5">Overall Progress</h3>
            {!isLoading && (
              <p className="text-xs text-[#8A8A86] dark:text-[#686664]">{totalCompleted} of {totalItems} items</p>
            )}
          </div>
          {mounted && lockedPhaseIds.size > 0 && (
            <label className="flex items-center gap-1.5 cursor-pointer select-none mr-3">
              <input
                type="checkbox"
                checked={includeLocked}
                onChange={toggleIncludeLocked}
                className="w-3.5 h-3.5 rounded border-[#D0CEC8] dark:border-[#3A3936] text-blue-500 focus:ring-blue-400 cursor-pointer"
              />
              <span className="text-[11px] text-[#8A8A86] dark:text-[#686664] whitespace-nowrap">Include 🚀⚙️</span>
            </label>
          )}
          {!isLoading && (
            <span className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="h-2 rounded-full bg-[#F2F1EE] dark:bg-[#232321] animate-pulse" />
        ) : (
          <ProgressBar completed={totalCompleted} total={totalItems} variant={variant} size="md" showLabel={false} />
        )}
      </div>

      {groupedSections ? (
        <div className="space-y-12">
          {groupedSections.map((grp, idx) => {
            const sectionPhases = grp.phaseIds
              .map(id => phases.find(p => p.id === id))
              .filter((p): p is NormalizedPhase => !!p);

            const sectionTotal = sectionPhases.reduce((acc, p) => acc + countPhaseItems(p), 0);
            const sectionCompleted = sectionPhases.reduce((acc, p) => acc + countPhaseCompleted(p, completedItems), 0);
            const sectionPct = sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;
            const isLocked = Boolean(grp.locked);
            const isOpen = openLockedSections.has(grp.title);

            const toggleLockedSection = () => {
              setOpenLockedSections(current => {
                const next = new Set(current);
                if (next.has(grp.title)) next.delete(grp.title);
                else next.add(grp.title);
                return next;
              });
            };

            return (
              <section key={idx} className="relative">
                {/* Section Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{grp.emoji}</span>
                    <div>
                      <h2 className="text-xl font-bold text-[#1A1A1A] dark:text-[#E8E7E4]">
                        {grp.title}
                      </h2>
                      <p className="text-sm text-[#8A8A86] dark:text-[#686664]">{grp.subtitle}</p>
                    </div>
                    {!isLoading && !isLocked && (
                      <span className="ml-auto text-sm font-medium text-[#8A8A86] dark:text-[#686664] tabular-nums">
                        {sectionPct}%
                      </span>
                    )}
                  </div>
                  {!isLoading && !isLocked && (
                    <ProgressBar completed={sectionCompleted} total={sectionTotal} variant={variant} size="sm" showLabel={false} />
                  )}
                </div>

                {isLocked ? (
                  <div className="rounded-xl bg-white dark:bg-[#1A1A18] border border-dashed border-[#D0CEC8] dark:border-[#3A3936] overflow-hidden">
                    <button onClick={toggleLockedSection} aria-expanded={isOpen} className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#F8F7F5] dark:hover:bg-[#232321] transition-colors">
                      <div>
                        <span className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">Do these after your Go milestone</span>
                        <p className="text-xs text-[#8A8A86] dark:text-[#686664] mt-1">{grp.lockedMessage}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 shrink-0 text-[#8A8A86] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && <div className="p-5 pt-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">{sectionPhases.map(renderPhaseCard)}</div>}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children mb-5">
                    {sectionPhases.map(renderPhaseCard)}
                  </div>
                )}

                {/* Section divider */}
                {idx < groupedSections.length - 1 && (
                  <div className="mt-12 border-t border-dashed border-[#E5E4DF] dark:border-[#2C2B28]" />
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* Flat Phases Grid (default) */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {phases.map(renderPhaseCard)}
        </div>
      )}

      {/* Optional Phases Accordion */}
      {optionalPhases && optionalPhases.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setOptionalOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-white dark:bg-[#1A1A18] border border-dashed border-[#D0CEC8] dark:border-[#3A3936] text-left hover:border-[#B0ADA8] dark:hover:border-[#4A4844] transition-colors group"
          >
            <div>
              <span className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">Optional Phases</span>
              <p className="text-xs text-[#8A8A86] dark:text-[#686664] mt-0.5">
                Extra depth once you&apos;re hired — come back when ready
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#8A8A86] dark:text-[#686664] transition-transform duration-200 ${optionalOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {optionalOpen && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {optionalPhases.map(renderPhaseCard)}
            </div>
          )}
        </div>
      )}
    </>
  );
}
