import fs from 'fs';
import path from 'path';
import { use } from 'react';
import { notFound } from 'next/navigation';
import NoteContent from './NoteContent';
import { isDamlRevisionFile, parseDamlPhaseId } from '@/lib/damlPhaseId';
import { damlRoadmap } from '@/data/daml';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { getLectureMetadata, lectureJsonLd } from '@/lib/seo';
import { SeoJsonLd } from '@/components/SeoJsonLd';

export interface Note {
  id: string;
  phase: string;
  phaseId: string;
  phaseNumber: number;
  title: string;
  duration: string;
  day: string;
  file: string;
  isRevision?: boolean;
}

function parseNoteDay(file: string) {
  const match = file.match(/day(\d+)([a-z]?)-/i);
  if (!match) return null;

  const dayNumber = Number(match[1]);
  const suffix = match[2]?.toLowerCase() || '';

  return {
    label: suffix ? `Day ${dayNumber}.${suffix}` : `Day ${dayNumber}`,
  };
}

function stripDayPrefix(title: string) {
  return title.replace(/^Day\s+\d+(?:\.[a-z])?:\s*/i, '').replace(/\*\*/g, '').trim();
}

function getNotes(): Note[] {
  const notesDir = path.join(process.cwd(), 'public', 'data', 'lectures', 'daml');
  const notes: Note[] = [];
  const roadmap = normalizeRoadmap(damlRoadmap);
  const allowedPhaseNumbers = new Set(roadmap.phases.map(phase => phase.number));

  if (!fs.existsSync(notesDir)) {
    return notes;
  }

  const phases = fs.readdirSync(notesDir).filter(item => {
    const fullPath = path.join(notesDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  phases.forEach(phaseFolder => {
    const parsedPhase = parseDamlPhaseId(phaseFolder);
    if (!parsedPhase) return;

    const { phaseId, phaseLabel, phaseNumber } = parsedPhase;
    if (!allowedPhaseNumbers.has(phaseNumber)) return;

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
            phaseNumber,
            title: titleMatch ? titleMatch[1].replace(/\*\*/g, '').trim() : `Phase ${phaseLabel} Revision`,
            duration: 'Quick Read',
            day: 'Revision',
            file: `${phaseFolder}/${file}`,
            isRevision: true,
          });
        }
        return;
      }

      const parsedDay = parseNoteDay(file);
      const idMatch = file.match(/^(.+)\.md$/);
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const durationMatch = content.match(/Duration:\s*(\d+\s*hours?)/i);

      if (parsedDay && idMatch && titleMatch) {
        const title = stripDayPrefix(titleMatch[1]);

        notes.push({
          id: idMatch[1],
          phase: `Phase ${phaseLabel}`,
          phaseId,
          phaseNumber,
          title,
          duration: durationMatch ? durationMatch[1] : '5 hours',
          day: parsedDay.label,
          file: `${phaseFolder}/${file}`,
        });
      }
    });
  });

  return notes;
}

function getNoteContent(file: string): string {
  const filePath = path.join(process.cwd(), 'public', 'data', 'lectures', 'daml', file);
  
  if (!fs.existsSync(filePath)) {
    return '# Error Loading Note\n\nCould not load note content.';
  }
  
  return fs.readFileSync(filePath, 'utf-8');
}

export async function generateStaticParams() {
  const notes = getNotes();
  return notes.map((note) => ({
    slug: note.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return getLectureMetadata('daml', (await params).slug);
}

export default function DAMLNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const notes = getNotes();
  const note = notes.find(l => l.id === slug);
  
  if (!note) return notFound();

  // Read content server-side
  const content = getNoteContent(note.file);

  return <><SeoJsonLd data={lectureJsonLd('daml', slug)} /><NoteContent note={note} content={content} /></>;
}
