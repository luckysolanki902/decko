'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Trophy } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { reactNativeRoadmap } from '@/data/reactnative';
import { normalizeRoadmap } from '@/lib/normalizeRoadmap';
import { useProgress } from '@/lib/progress';

export default function ReactNativeProjectsPage() {
  const { completedItems } = useProgress('reactnative');
  const projects = useMemo(() => normalizeRoadmap(reactNativeRoadmap).phases.flatMap(phase => phase.sections.flatMap(section => section.topics.flatMap(topic => {
    if (topic.project?.type !== 'capstone') return [];
    const id = `${phase.id}-${section.id}-${topic.id}-project`;
    return [{ id, title: topic.project.title, description: topic.project.description, phase: phase.number, phaseTitle: phase.title, completed: completedItems.has(id) }];
  }))), [completedItems]);
  const completed = projects.filter(project => project.completed).length;
  return <main className="min-h-screen py-10 md:py-14"><div className="container-page">
    <Breadcrumbs crumbs={[{label:'React Native',href:'/react-native'},{label:'Projects'}]} />
    <header className="mb-8"><h1 className="text-2xl md:text-3xl font-semibold mb-2">React Native Project Portfolio</h1><p className="text-[#52524E] dark:text-[#9E9C98] max-w-2xl mb-4">One mobile product closes every phase. Each project proves a different hiring signal: navigation, offline correctness, device APIs, performance, native code, or production delivery.</p><div className="flex items-center gap-3"><span className="text-sm font-medium">{completed} of {projects.length} completed</span><div className="flex-1 max-w-xs h-2 rounded-full bg-[#F2F1EE] dark:bg-[#232321] overflow-hidden"><div className="h-full bg-[#22A7C8]" style={{width:`${projects.length?completed/projects.length*100:0}%`}} /></div></div></header>
    <div className="grid gap-4 md:grid-cols-2">{projects.map(project=><article key={project.id} className="rounded-xl p-5 border bg-white dark:bg-[#1A1A18] border-[#E5E4DF] dark:border-[#2C2B28]"><div className="flex gap-3">{project.completed?<Check className="w-5 h-5 text-[#22A7C8] shrink-0"/>:<Trophy className="w-5 h-5 text-[#8A8A86] shrink-0"/>}<div><p className="text-xs font-medium text-[#1689A7] mb-1">Phase {project.phase} · {project.phaseTitle}</p><h2 className="text-sm font-semibold mb-2">{project.title}</h2><p className="text-xs text-[#52524E] dark:text-[#9E9C98] leading-relaxed">{project.description}</p></div></div></article>)}</div>
    <footer className="text-center mt-10 pt-6 border-t"><Link href="/react-native" className="inline-flex items-center gap-2 text-sm text-[#8A8A86] hover:text-[#22A7C8]"><ArrowLeft className="w-4 h-4"/>Back to overview</Link></footer>
  </div></main>;
}
