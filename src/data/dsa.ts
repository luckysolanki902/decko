import { Roadmap } from '@/types';
import { dsaPhases } from './phases/dsa';

export const dsaRoadmap: Roadmap = {
  id: 'dsa',
  title: 'DSA with C++ — From Scratch to Advanced Problem Solving',
  subtitle: 'C++ · Data structures & algorithms · Codeforces / CodeChef · Competitive programming',
  description:
    'A 146-unit C++ path from local beginner exercises to advanced DSA and competitive-programming practice. Preserve the Striver A2Z topic coverage, then extend into number theory, range queries, advanced graphs and DP. Learn through guided attempts, delayed recall, unlabelled transfer problems and an early contest routine. Generate lectures in batches of three and study each unit across as many sessions as needed. The 584 hours are a first-pass estimate; strong contest performance requires continuing practice, not a guaranteed rating.',
  phases: dsaPhases,
  totalDays: 146,
  totalHours: 584,
  icon: '🧩',
};
