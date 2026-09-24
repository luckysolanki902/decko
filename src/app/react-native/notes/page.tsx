import fs from 'fs';
import path from 'path';
import { NotesPageClient, NoteItem } from '@/components/NotesPageClient';
import { reactNativeRoadmap } from '@/data/reactnative';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';

function notes(): NoteItem[] {
  const root = path.join(process.cwd(), 'public', 'data', 'lectures', 'reactnative');
  if (!fs.existsSync(root)) return [];
  const titles = new Map(normalizeRoadmap(reactNativeRoadmap).phases.map(phase => [phase.number, phase.title]));
  const result: NoteItem[] = [];
  for (const folder of fs.readdirSync(root)) {
    const match = folder.match(/^phase(\d+)$/); if (!match) continue;
    const phaseNumber = Number(match[1]); const dir = path.join(root, folder);
    for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.md'))) {
      const day = file.match(/^day(\d+)-/); if (!day) continue;
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const title = content.match(/^#\s+(.+)$/m)?.[1]?.replace(/^Day\s+\d+:\s*/, '') || file;
      const duration = content.match(/Duration:\s*([\d.]+\s*hours?)/i)?.[1] || '4 hours';
      result.push({ id: file.replace(/\.md$/, ''), phaseId: folder, phase: `Phase ${phaseNumber}`, title, duration, day: `Day ${day[1]}`, phaseNumber, phaseTitle: titles.get(phaseNumber), file: `${folder}/${file}` });
    }
  }
  return result.sort((a,b) => Number(a.day.replace(/\D/g,'')) - Number(b.day.replace(/\D/g,'')));
}

export default function ReactNativeNotesPage() {
  const grouped = notes().reduce((acc, note) => { (acc[note.phase] ||= []).push(note); return acc; }, {} as Record<string, NoteItem[]>);
  return <NotesPageClient notesByPhase={grouped} quizPhases={[]} storageKey="reactnative-current-phase" breadcrumbs={[{ label:'React Native', href:'/react-native' }, { label:'Notes' }]} notesHref="/react-native/notes" revisionHrefPrefix="/react-native/revision/phase" />;
}
