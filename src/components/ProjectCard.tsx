'use client';

import { useState } from 'react';
import { ChevronDown, Lightbulb, Wrench, FolderKanban, Trophy } from 'lucide-react';
import { RoadmapVariant } from '@/types';

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    type?: 'mini' | 'project' | 'capstone';
    features?: string[];
    hints?: string[];
  };
  variant?: RoadmapVariant;
}

export function ProjectCard({ project, variant = 'rose' }: ProjectCardProps) {
  const [hintsOpen, setHintsOpen] = useState(false);
  const accentText = {
    rose: 'text-[#9A6452] dark:text-[#D4A090]',
    emerald: 'text-[#4F7F64] dark:text-[#7AAE8E]',
    blue: 'text-[#507290] dark:text-[#8AAAC4]',
  }[variant];

  const typeConfig = {
    mini: { 
      label: 'Mini Project', 
      text: accentText,
      Icon: Wrench 
    },
    project: { 
      label: 'Project',
      text: 'text-[#5D8E72] dark:text-[#7AAE8E]',
      Icon: FolderKanban 
    },
    capstone: { 
      label: 'Capstone',
      text: 'text-[#8B7BBF] dark:text-[#B8A8E0]',
      Icon: Trophy 
    },
  };

  const config = typeConfig[project.type || 'project'];

  return (
    <div className="rounded-xl p-4 bg-[#F2F1EE] dark:bg-[#232321] border border-[#E5E4DF] dark:border-[#2C2B28]">
      <div className="flex items-center gap-2 mb-2.5">
        <config.Icon className={`w-3.5 h-3.5 ${config.text}`} />
        <span className={`text-[11px] font-medium ${config.text} tracking-wide uppercase`}>{config.label}</span>
      </div>
      <h5 className="text-sm font-medium text-[#1A1A1A] dark:text-[#E8E7E4] mb-1.5">
        {project.title}
      </h5>
      <p className="text-xs text-[#52524E] dark:text-[#9E9C98] leading-relaxed">
        {project.description}
      </p>
      {project.features && project.features.length > 0 && (
        <ul className="mt-3 space-y-1">
          {project.features.map((f, i) => (
            <li key={i} className="text-xs text-[#52524E] dark:text-[#9E9C98] flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#ADADA9] dark:bg-[#4A4846] mt-1.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      )}
      {project.hints && project.hints.length > 0 && (
        <div className="mt-4 rounded-xl border border-[#DEDAD3] dark:border-[#373532] overflow-hidden">
          <button type="button" onClick={() => setHintsOpen(open => !open)} aria-expanded={hintsOpen} className="w-full px-3 py-2.5 flex items-center justify-between gap-2 text-left text-xs font-semibold text-[#6B625A] dark:text-[#C8C2BA] hover:bg-white/60 dark:hover:bg-black/10">
            <span className="inline-flex items-center gap-2"><Lightbulb className="w-3.5 h-3.5" />{hintsOpen ? 'Project hints' : 'Stuck? Show hints'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${hintsOpen ? 'rotate-180' : ''}`} />
          </button>
          {hintsOpen && <ul className="px-3 pb-3 space-y-1.5">{project.hints.map((hint, i) => <li key={i} className="text-xs text-[#52524E] dark:text-[#9E9C98] leading-relaxed flex gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-[#ADADA9] shrink-0" />{hint}</li>)}</ul>}
        </div>
      )}
    </div>
  );
}
