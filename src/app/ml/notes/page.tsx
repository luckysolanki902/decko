import fs from 'fs';
import path from 'path';
import { NotesPageClient, NoteItem } from '@/components/NotesPageClient';
import { mlRoadmap } from '@/data/ml';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';

function getNotes(): NoteItem[] {
  const notesDir = path.join(process.cwd(), 'public', 'data', 'lectures', 'ml');
  const notes: NoteItem[] = [];
  const roadmap = normalizeRoadmap(mlRoadmap);
  const phaseTitleByNumber = new Map(roadmap.phases.map(phase => [phase.number, phase.title]));

  if (!fs.existsSync(notesDir)) return notes;

  const phases = fs.readdirSync(notesDir).filter(item => {
    const fullPath = path.join(notesDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  phases.forEach(phaseFolder => {
    const phaseMatch = phaseFolder.match(/phase(\d+)/);
    if (!phaseMatch) return;

    const phaseId = phaseFolder;
    const phaseNumber = parseInt(phaseMatch[1]);
    const phaseTitle = phaseTitleByNumber.get(phaseNumber);
    const phaseDir = path.join(notesDir, phaseFolder);
    const files = fs.readdirSync(phaseDir).filter(file => file.endsWith('.md') || file.endsWith('.html'));

    files.forEach(file => {
      const isHtml = file.endsWith('.html');
      const filePath = path.join(phaseDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const dayMatch = file.match(/day(\d+)-/);
      const idMatch = file.match(/^(.+)\.(md|html)$/);
      const titleMatch = isHtml
        ? content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
        : content.match(/^#\s+(.+)$/m);
      const durationMatch = content.match(/Duration:\s*([\d.]+\s*hours?)/i);

      if (dayMatch && idMatch && titleMatch) {
        const dayNum = dayMatch[1];
        const title = titleMatch[1]
          .replace(/<[^>]+>/g, '')
          .replace(/^Day\s+\d+:\s*/i, '')
          .replace(/\*\*/g, '')
          .trim();

        notes.push({
          id: idMatch[1],
          phaseId,
          phase: `Phase ${phaseNumber}`,
          title,
          duration: durationMatch ? durationMatch[1] : '4 hours',
          day: `Day ${dayNum}`,
          phaseNumber,
          phaseTitle,
          file: `${phaseFolder}/${file}`,
        });
      }
    });
  });

  notes.sort((a, b) => {
    if (a.phaseNumber !== b.phaseNumber) return a.phaseNumber - b.phaseNumber;
    const dayA = parseInt(a.day.match(/\d+/)?.[0] || '0');
    const dayB = parseInt(b.day.match(/\d+/)?.[0] || '0');
    return dayA - dayB;
  });

  return notes;
}

function getQuizPhases(): Set<string> {
  const quizDir = path.join(process.cwd(), 'public', 'data', 'quizzes', 'ml');
  const phases = new Set<string>();
  if (!fs.existsSync(quizDir)) return phases;
  fs.readdirSync(quizDir).forEach(file => {
    const match = file.match(/^(phase\d+)\.json$/);
    if (match) phases.add(match[1]);
  });
  return phases;
}

export default function MLNotesPage() {
  const notes = getNotes();
  const quizPhases = [...getQuizPhases()];

  const notesByPhase = notes.reduce((acc, note) => {
    if (!acc[note.phase]) acc[note.phase] = [];
    acc[note.phase].push(note);
    return acc;
  }, {} as Record<string, NoteItem[]>);

  return (
    <NotesPageClient
      notesByPhase={notesByPhase}
      quizPhases={quizPhases}
      storageKey="ml-current-phase"
      breadcrumbs={[
        { label: 'ML, DL & GenAI', href: '/ml' },
        { label: 'Notes' },
      ]}
      notesHref="/ml/notes"
      revisionHrefPrefix="/ml/revision/phase"
    />
  );
}
