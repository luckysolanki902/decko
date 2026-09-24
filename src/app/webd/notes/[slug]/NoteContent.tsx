'use client';

import LectureDeck from '@/components/LectureDeck';
import { Note } from './page';

export default function NoteContent({ note, content }: { note: Note; content: string }) {
  return <LectureDeck note={note} content={content} variant="webd" />;
}
