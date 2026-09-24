import { Roadmap } from '@/types';
import {
  phase1,
  phase2,
  phase3,
  phase4,
  phase5,
  phase6,
  phase7,
  phase8,
  phase9,
  phase10,
} from './phases/ml';

const phases = [phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8, phase9, phase10];
const totalDays = phases.reduce((sum, phase) => sum + (phase.sections?.length ?? 0), 0);

export const mlRoadmap: Roadmap = {
  id: 'ml',
  title: 'Machine Learning, Deep Learning & GenAI',
  subtitle: `${totalDays} study units: ML, vision, RL, LLMs, calibrated decisions, generative video/3D, research, and production`,
  description:
    'This course begins after Python and data analytics. Build, derive, debug, retrieve after a delay, and test a changed task across classical ML, neural nets, OpenCV, RL before RLHF, LLMs, calibrated decisions, RAG, agents, generative images/video/3D, and production. Lectures are generated in batches of three. Each unit can span several sessions; baseline hours exclude extra review, remediation, and specialization.',
  phases,
  totalDays,
  totalHours: totalDays * 4,
};
