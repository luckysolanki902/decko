'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Clock, GraduationCap, Sparkles, BookMarked, ArrowLeft, Check } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export interface NoteItem {
  id: string;
  phase: string;
  phaseId: string;
  title: string;
  duration: string;
  day: string;
  phaseNumber: number;
  phaseTitle?: string;
  file: string;
  isRevision?: boolean;
}

interface NotesPageClientProps {
  notesByPhase: Record<string, NoteItem[]>;
  quizPhases: string[];
  storageKey: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  notesHref: string; // e.g. '/daml/notes'
  revisionHrefPrefix: string; // e.g. '/daml/revision/phase'
}

export function NotesPageClient({
  notesByPhase,
  quizPhases,
  storageKey,
  breadcrumbs,
  notesHref,
  revisionHrefPrefix,
}: NotesPageClientProps) {
  const [currentPhaseOverride, setCurrentPhaseOverride] = useState<string | null>(null);
  const [expandedOtherPhase, setExpandedOtherPhase] = useState<string | null>(null);

  const storedPhase = useSyncExternalStore(
    onStoreChange => {
      if (typeof window === 'undefined') return () => undefined;

      const handleStorage = (event: StorageEvent) => {
        if (event.key === storageKey) {
          onStoreChange();
        }
      };

      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    },
    () => {
      if (typeof window === 'undefined') return null;

      const saved = window.localStorage.getItem(storageKey);
      return saved && notesByPhase[saved] ? saved : null;
    },
    () => null,
  );

  const currentPhase = currentPhaseOverride ?? storedPhase;

  const handleSetCurrent = (phase: string) => {
    setCurrentPhaseOverride(phase);
    localStorage.setItem(storageKey, phase);
    setExpandedOtherPhase(null);
  };

  const quizSet = new Set(quizPhases);
  const allPhases = Object.keys(notesByPhase);
  const otherPhases = currentPhase ? allPhases.filter(p => p !== currentPhase) : allPhases.slice(1);
  const activePhase = currentPhase && notesByPhase[currentPhase] ? currentPhase : null;

  const getPhaseDisplayTitle = (phase: string) => {
    const phaseMeta = notesByPhase[phase]?.[0];
    return phaseMeta?.phaseTitle ? `${phase}: ${phaseMeta.phaseTitle}` : phase;
  };

  const renderNoteRow = (note: NoteItem, baseHref: string) => (
    <Link key={note.id} href={`${baseHref}/${note.id}`} className="group block">
      <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors hover:bg-[#F2F1EE] dark:hover:bg-[#232321] border-l-2 border-transparent hover:border-[#B87D6C] dark:hover:border-[#D4A090]">
        <span className="text-[11px] font-medium text-[#ADADA9] dark:text-[#4A4846] w-16 shrink-0 tabular-nums">{note.day}</span>
        <span className="text-sm text-[#1A1A1A] dark:text-[#E8E7E4] flex-1 min-w-0 truncate group-hover:text-[#9A6452] dark:group-hover:text-[#D4A090] transition-colors">
          {note.title}
        </span>
        <span className="flex items-center gap-1 text-xs text-[#ADADA9] dark:text-[#4A4846] shrink-0">
          <Clock className="w-3 h-3" />
          {note.duration}
        </span>
      </div>
    </Link>
  );

  const renderRevisionRow = (note: NoteItem, baseHref: string) => (
    <Link href={`${baseHref}/${note.id}`} className="group block">
      <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors hover:bg-[#F0E5E0] dark:hover:bg-[#2A2018] border-l-2 border-transparent hover:border-[#B87D6C] dark:hover:border-[#D4A090]">
        <Sparkles className="w-3.5 h-3.5 text-[#B87D6C] dark:text-[#D4A090] shrink-0 ml-0.5" />
        <span className="text-sm text-[#1A1A1A] dark:text-[#E8E7E4] flex-1 group-hover:text-[#9A6452] dark:group-hover:text-[#D4A090] transition-colors">
          {note.phase} Quick Revision
        </span>
        <span className="text-xs text-[#ADADA9] dark:text-[#4A4846]">Review</span>
      </div>
    </Link>
  );

  const renderQuizRow = (phase: string, phaseId: string) => (
    <Link href={`${revisionHrefPrefix}${phaseId.replace(/^phase/, '')}`} className="group block">
      <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors hover:bg-[#F0E5E0] dark:hover:bg-[#2A2018] border-l-2 border-transparent hover:border-[#B87D6C] dark:hover:border-[#D4A090]">
        <GraduationCap className="w-3.5 h-3.5 text-[#B87D6C] dark:text-[#D4A090] shrink-0 ml-0.5" />
        <span className="text-sm text-[#1A1A1A] dark:text-[#E8E7E4] flex-1 group-hover:text-[#9A6452] dark:group-hover:text-[#D4A090] transition-colors">
          {phase} Revision Quiz
        </span>
        <span className="text-xs text-[#ADADA9] dark:text-[#4A4846]">MCQ</span>
      </div>
    </Link>
  );

  const renderPhaseSection = (phase: string, phaseNotes: NoteItem[], showSetCurrent: boolean) => {
    const phaseMeta = phaseNotes[0];
    const hasQuiz = Boolean(phaseMeta) && quizSet.has(phaseMeta.phaseId);
    const regularNotes = phaseNotes.filter(n => !n.isRevision);
    const revisionNote = phaseNotes.find(n => n.isRevision);
    const isActive = phase === currentPhase;

    return (
      <section key={phase}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-medium text-[#9A6452] dark:text-[#D4A090] bg-[#F0E5E0] dark:bg-[#2A2018] px-2.5 py-1 rounded-md">
            {phase}
          </span>
          {showSetCurrent && (
            isActive ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5D8E72] dark:text-[#7AAE8E] bg-[#E2EDE6] dark:bg-[#1C2820] border border-[#C0DAC8] dark:border-[#2A3A30] px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> Current
              </span>
            ) : (
              <button
                onClick={() => handleSetCurrent(phase)}
                className="text-[11px] font-medium text-[#8A8A86] dark:text-[#686664] hover:text-[#B87D6C] dark:hover:text-[#D4A090] border border-[#E5E4DF] dark:border-[#2C2B28] hover:border-[#B87D6C] dark:hover:border-[#D4A090] px-2 py-0.5 rounded-full transition-colors"
              >
                Set as Current
              </button>
            )
          )}
        </div>
        <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] overflow-hidden divide-y divide-[#F2F1EE] dark:divide-[#232321]">
          {regularNotes.map(note => renderNoteRow(note, notesHref))}
          {revisionNote && renderRevisionRow(revisionNote, notesHref)}
          {hasQuiz && phaseMeta && renderQuizRow(phase, phaseMeta.phaseId)}
        </div>
      </section>
    );
  };

  // If nothing is stored yet, show all phases normally but with Set as Current on each
  if (!activePhase) {
    return (
      <main className="min-h-screen py-10 md:py-14">
        <div className="container-page">
          <div>
            <Breadcrumbs crumbs={breadcrumbs} />
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">Notes</h1>
              <p className="text-[#52524E] dark:text-[#9E9C98] leading-relaxed max-w-2xl">
                Detailed lessons organized by phase. Each note includes theory, hands-on exercises, and practice challenges.
              </p>
              <p className="mt-3 text-xs text-[#8A8A86] dark:text-[#686664]">
                👆 Hit <strong>Set as Current</strong> on the phase you&apos;re studying to focus the view.
              </p>
            </header>
            <div className="space-y-8">
              {allPhases.map(phase => renderPhaseSection(phase, notesByPhase[phase], true))}
            </div>
            <div className="mt-10 bg-[#F2F1EE] dark:bg-[#232321] rounded-xl px-6 py-5 border border-[#E5E4DF] dark:border-[#2C2B28]">
              <div className="flex items-center justify-center gap-3">
                <BookMarked className="w-5 h-5 text-[#8A8A86] dark:text-[#686664]" />
                <p className="text-sm text-[#8A8A86] dark:text-[#686664]">More phases &amp; lectures coming soon</p>
              </div>
            </div>
            <footer className="text-center mt-10 pt-6 border-t border-[#E5E4DF] dark:border-[#2C2B28]">
              <Link href={notesHref.replace('/notes', '')} className="inline-flex items-center gap-2 text-sm text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to overview
              </Link>
            </footer>
          </div>
        </div>
      </main>
    );
  }

  const activeNotes = notesByPhase[activePhase];

  return (
    <main className="min-h-screen py-10 md:py-14">
      <div className="container-page">
        <div>
          <Breadcrumbs crumbs={breadcrumbs} />
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">Notes</h1>
            <p className="text-[#52524E] dark:text-[#9E9C98] leading-relaxed max-w-2xl">
              Detailed lessons organized by phase. Each note includes theory, hands-on exercises, and practice challenges.
            </p>
          </header>

          {/* Active phase */}
          <div className="space-y-8">
            {renderPhaseSection(activePhase, activeNotes, true)}
          </div>

          {/* Other phases */}
          {otherPhases.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-[#52524E] dark:text-[#9E9C98]">
                  Other Phases
                </span>
                <span className="text-xs text-[#8A8A86] dark:text-[#686664]">({otherPhases.length})</span>
                <div className="flex-1 h-px bg-[#E5E4DF] dark:bg-[#2C2B28]" />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {otherPhases.map(phase => {
                  const isExpanded = expandedOtherPhase === phase;

                  return (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => setExpandedOtherPhase(isExpanded ? null : phase)}
                      className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                        isExpanded
                          ? 'border-[#B87D6C] bg-[#F0E5E0] text-[#7A4E40] dark:border-[#D4A090] dark:bg-[#2A2018] dark:text-[#E4BAAB]'
                          : 'border-[#E5E4DF] bg-white text-[#52524E] hover:border-[#B87D6C] hover:text-[#9A6452] dark:border-[#2C2B28] dark:bg-[#1A1A18] dark:text-[#9E9C98] dark:hover:border-[#D4A090] dark:hover:text-[#D4A090]'
                      }`}
                    >
                      {getPhaseDisplayTitle(phase)}
                    </button>
                  );
                })}
              </div>

              {expandedOtherPhase && notesByPhase[expandedOtherPhase] && (
                <div className="space-y-8">
                  {renderPhaseSection(expandedOtherPhase, notesByPhase[expandedOtherPhase], true)}
                </div>
              )}
            </div>
          )}

          <div className="mt-10 bg-[#F2F1EE] dark:bg-[#232321] rounded-xl px-6 py-5 border border-[#E5E4DF] dark:border-[#2C2B28]">
            <div className="flex items-center justify-center gap-3">
              <BookMarked className="w-5 h-5 text-[#8A8A86] dark:text-[#686664]" />
              <p className="text-sm text-[#8A8A86] dark:text-[#686664]">More phases &amp; lectures coming soon</p>
            </div>
          </div>

          <footer className="text-center mt-10 pt-6 border-t border-[#E5E4DF] dark:border-[#2C2B28]">
            <Link href={notesHref.replace('/notes', '')} className="inline-flex items-center gap-2 text-sm text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to overview
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
