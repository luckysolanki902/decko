import fs from 'fs';
import path from 'path';
import { use } from 'react';
import { notFound } from 'next/navigation';
import NoteContent from './NoteContent';
import { getLectureMetadata, lectureJsonLd } from '@/lib/seo';
import { SeoJsonLd } from '@/components/SeoJsonLd';

export type Note = { id:string; phase:string; title:string; duration:string; day:string; file:string };
function allNotes(): Note[] {
  const root = path.join(process.cwd(),'public','data','lectures','dsa'); const result: Note[]=[];
  if (!fs.existsSync(root)) return result;
  for (const folder of fs.readdirSync(root)) { if (!/^phase\d+$/.test(folder)) continue; const dir=path.join(root,folder);
    for (const file of fs.readdirSync(dir).filter(name=>name.endsWith('.md'))) { const day=file.match(/^day(\d+)-/); if(!day) continue; const content=fs.readFileSync(path.join(dir,file),'utf8'); const heading=content.match(/^#\s+(.+)$/m)?.[1]; if(!heading) continue; result.push({id:file.replace(/\.md$/,''),phase:`Phase ${folder.replace(/\D/g,'')}`,title:heading.replace(/^Day\s+\d+:\s*/,''),duration:content.match(/Duration:\s*([^|]+?)(?:\s*\||$)/im)?.[1]?.trim()||'3 hours',day:`Day ${day[1]}`,file:`${folder}/${file}`}); }
  } return result;
}
export function generateStaticParams(){return allNotes().map(note=>({slug:note.id}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){return getLectureMetadata('dsa',(await params).slug);}
export default function DsaNotePage({params}:{params:Promise<{slug:string}>}){const {slug}=use(params);const note=allNotes().find(item=>item.id===slug);if(!note)return notFound();const content=fs.readFileSync(path.join(process.cwd(),'public','data','lectures','dsa',note.file),'utf8');return <><SeoJsonLd data={lectureJsonLd('dsa',slug)}/><NoteContent note={note} content={content}/></>;}
