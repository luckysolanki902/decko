import fs from 'fs';
import path from 'path';
import { NotesPageClient } from '@/components/NotesPageClient';
import { isDamlRevisionFile, parseDamlPhaseId, parseDamlQuizFilename } from '@/lib/damlPhaseId';
import { damlRoadmap } from '@/data/daml';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';

import { NoteItem } from '@/components/NotesPageClient';

function parseNoteDay(file: string) {
  const match = file.match(/day(\d+)([a-z]?)-/i);
  if (!match) return null;

  const dayNumber = Number(match[1]);
  const suffix = match[2]?.toLowerCase() || '';

  return {
    dayNumber,
    suffix,
    label: suffix ? `Day ${dayNumber}.${suffix}` : `Day ${dayNumber}`,
  };
}

function stripDayPrefix(title: string) {
  return title.replace(/^Day\s+\d+(?:\.[a-z])?:\s*/i, '').replace(/\*\*/g, '').trim();
}

function getNotes(): NoteItem[] {
  const notesDir = path.join(process.cwd(), 'public', 'data', 'lectures', 'daml');
  const notes: NoteItem[] = [];
  const roadmap = normalizeRoadmap(damlRoadmap);
  const allowedPhaseNumbers = new Set(roadmap.phases.map(phase => phase.number));
  const phaseTitleByNumber = new Map(roadmap.phases.map(phase => [phase.number, phase.title]));

  // Check if directory exists
  if (!fs.existsSync(notesDir)) {
    return notes;
  }

  // Read all phase directories
  const phases = fs.readdirSync(notesDir).filter(item => {
    const fullPath = path.join(notesDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  phases.forEach(phaseFolder => {
    const parsedPhase = parseDamlPhaseId(phaseFolder);
    if (!parsedPhase) return;

    const { phaseId, phaseLabel, phaseNumber } = parsedPhase;
    if (!allowedPhaseNumbers.has(phaseNumber)) return;

    const phaseTitle = phaseTitleByNumber.get(phaseNumber);
    const phaseDir = path.join(notesDir, phaseFolder);
    const files = fs.readdirSync(phaseDir).filter(file => file.endsWith('.md'));

    files.forEach(file => {
      const filePath = path.join(phaseDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check if it's a revision file
      if (isDamlRevisionFile(file)) {
        const idMatch = file.match(/^(.+)\.md$/);
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (idMatch) {
          notes.push({
            id: idMatch[1],
            phase: `Phase ${phaseLabel}`,
            phaseId,
            title: titleMatch ? titleMatch[1].replace(/\*\*/g, '').trim() : `Phase ${phaseLabel} Revision`,
            duration: 'Quick Read',
            day: 'Revision',
            phaseNumber,
            phaseTitle,
            file: `${phaseFolder}/${file}`,
            isRevision: true,
          });
        }
        return;
      }

      // Extract metadata using regex
      const parsedDay = parseNoteDay(file);
      const idMatch = file.match(/^(.+)\.md$/);
      
      // Extract title from markdown (first h1)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      
      // Extract duration from markdown
      const durationMatch = content.match(/Duration:\s*(\d+\s*hours?)/i);

      if (parsedDay && idMatch && titleMatch) {
        const title = stripDayPrefix(titleMatch[1]);

        notes.push({
          id: idMatch[1],
          phase: `Phase ${phaseLabel}`,
          phaseId,
          title,
          duration: durationMatch ? durationMatch[1] : '5 hours',
          day: parsedDay.label,
          phaseNumber,
          phaseTitle,
          file: `${phaseFolder}/${file}`,
        });
      }
    });
  });

  // Sort by phase number, then by day
  notes.sort((a, b) => {
    if (a.phaseNumber !== b.phaseNumber) {
      return a.phaseNumber - b.phaseNumber;
    }

    if (Boolean(a.isRevision) !== Boolean(b.isRevision)) {
      return a.isRevision ? 1 : -1;
    }

    const dayA = a.day.match(/Day\s+(\d+)(?:\.([a-z]))?/i);
    const dayB = b.day.match(/Day\s+(\d+)(?:\.([a-z]))?/i);

    const numA = Number(dayA?.[1] || '0');
    const numB = Number(dayB?.[1] || '0');
    if (numA !== numB) return numA - numB;

    const suffixA = dayA?.[2] || '';
    const suffixB = dayB?.[2] || '';
    if (suffixA === suffixB) return 0;
    if (!suffixA) return -1;
    if (!suffixB) return 1;
    return suffixA.localeCompare(suffixB);
  });

  return notes;
}

function getQuizPhases(): Set<string> {
  const quizDir = path.join(process.cwd(), 'public', 'data', 'quizzes', 'daml');
  const phases = new Set<string>();
  if (!fs.existsSync(quizDir)) return phases;
  fs.readdirSync(quizDir).forEach(file => {
    const parsedQuiz = parseDamlQuizFilename(file);
    if (parsedQuiz) phases.add(parsedQuiz.phaseId);
  });
  return phases;
}

export default function DAMLNotesPage() {
  const notes = getNotes();
  const quizPhases = [...getQuizPhases()];

  // Group notes by phase
  const notesByPhase = notes.reduce((acc, note) => {
    if (!acc[note.phase]) acc[note.phase] = [];
    acc[note.phase].push(note);
    return acc;
  }, {} as Record<string, NoteItem[]>);

  return (
    <NotesPageClient
      notesByPhase={notesByPhase}
      quizPhases={quizPhases}
      storageKey="daml-current-phase"
      breadcrumbs={[
        { label: 'Python & Data Analytics', href: '/daml' },
        { label: 'Notes' },
      ]}
      notesHref="/daml/notes"
      revisionHrefPrefix="/daml/revision/phase"
    />
  );
}

