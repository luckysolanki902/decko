'use client';

import LectureDeck from '@/components/LectureDeck';
import type { Note } from './page';

export default function NoteContent({ note, content }: { note: Note; content: string }) {
  return <LectureDeck note={note} content={content} variant="daml" />;
}
