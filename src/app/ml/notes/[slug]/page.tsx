import fs from 'fs';
import path from 'path';
import { use } from 'react';
import { notFound } from 'next/navigation';
import NoteContent from './NoteContent';
import { getLectureMetadata, lectureJsonLd } from '@/lib/seo';
import { SeoJsonLd } from '@/components/SeoJsonLd';

export interface Note {
  id: string;
  phase: string;
  title: string;
  duration: string;
  day: string;
  file: string;
  kind: 'html' | 'md';
}

function getNotes(): Note[] {
  const notesDir = path.join(process.cwd(), 'public', 'data', 'lectures', 'ml');
  const notes: Note[] = [];

  if (!fs.existsSync(notesDir)) return notes;

  const phases = fs.readdirSync(notesDir).filter(item => {
    const fullPath = path.join(notesDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  phases.forEach(phaseFolder => {
    const phaseMatch = phaseFolder.match(/phase(\d+)/);
    if (!phaseMatch) return;

    const phaseNumber = parseInt(phaseMatch[1]);
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
        const rawTitle = titleMatch[1]
          .replace(/<[^>]+>/g, '')
          .replace(/^Day\s+\d+:\s*/i, '')
          .replace(/\*\*/g, '')
          .trim();

        notes.push({
          id: idMatch[1],
          phase: `Phase ${phaseNumber}`,
          title: rawTitle,
          duration: durationMatch ? durationMatch[1] : '4 hours',
          day: `Day ${dayMatch[1]}`,
          file: `${phaseFolder}/${file}`,
          kind: isHtml ? 'html' : 'md',
        });
      }
    });
  });

  return notes;
}

function getNoteContent(file: string): string {
  const filePath = path.join(process.cwd(), 'public', 'data', 'lectures', 'ml', file);
  if (!fs.existsSync(filePath)) return '# Error Loading Note\n\nCould not load note content.';
  return fs.readFileSync(filePath, 'utf-8');
}

export async function generateStaticParams() {
  const notes = getNotes();
  return notes.map(note => ({ slug: note.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return getLectureMetadata('ml', (await params).slug);
}

export default function MLNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const notes = getNotes();
  const note = notes.find(item => item.id === slug);

  if (!note) return notFound();

  const content = note.kind === 'html' ? '' : getNoteContent(note.file);
  return <><SeoJsonLd data={lectureJsonLd('ml', slug)} /><NoteContent note={note} content={content} /></>;
}
