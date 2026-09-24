import { Roadmap, NormalizedRoadmap, NormalizedPhase, NormalizedSection, NormalizedTopic, Phase, Section, Topic } from '@/types';

function normalizeTopics(topics: Topic[], sectionId: string): NormalizedTopic[] {
  return topics.map((topic, idx) => ({
    id: topic.id || `${sectionId}-t${idx}`,
    title: topic.title,
    duration: topic.duration,
    items: topic.items || [],
    project: topic.project,
  }));
}

function normalizeSection(section: Section, phaseId: string, idx: number): NormalizedSection {
  const sectionId = section.id || `${phaseId}-s${idx}`;
  
  // If section has content.topics (new format), use that
  const content = section.content;
  const rawTopics = section.topics || (content?.topics) || [];
  
  // Section-level project can be on section directly or in content
  const sectionProject = section.project || content?.project;
  
  return {
    id: sectionId,
    title: section.title,
    duration: section.duration,
    topics: normalizeTopics(rawTopics, sectionId),
    project: sectionProject,
  };
}

function normalizePhase(phase: Phase, idx: number): NormalizedPhase {
  const phaseNumber = phase.number ?? phase.phase ?? idx;
  const phaseId = phase.id || `phase${phaseNumber}`;
  
  const days = typeof phase.days === 'string' 
    ? phase.days 
    : (phase.dayRange || `${phase.days} Days`);
  
  const duration = phase.duration || 
    (phase.totalHours ? `${typeof phase.days === 'number' ? phase.days : '?'} Days | ~${phase.totalHours} Hours` : '');

  return {
    id: phaseId,
    number: phaseNumber,
    title: phase.title,
    subtitle: phase.subtitle,
    duration,
    days,
    goal: phase.goal || phase.subtitle,
    sections: phase.sections.map((s, i) => normalizeSection(s, phaseId, i)),
    checkpoint: phase.checkpoint ? {
      skills: phase.checkpoint.skills,
      milestone: phase.checkpoint.milestone,
    } : undefined,
  };
}

export function normalizeRoadmap(roadmap: Roadmap): NormalizedRoadmap {
  return {
    id: roadmap.id,
    title: roadmap.title,
    subtitle: roadmap.subtitle,
    description: roadmap.description,
    totalDays: roadmap.totalDays,
    totalHours: roadmap.totalHours,
    phases: roadmap.phases.map((p, i) => normalizePhase(p, i)),
  };
}
