import { Roadmap } from '@/types';
import { goPhases } from './phases/go';

export const goRoadmap: Roadmap = {
  id: 'go',
  title: 'Go Engineering — From First Program to Production Systems',
  subtitle: 'Go 1.26 · Backend engineering · Concurrency · PostgreSQL · Docker',
  description: 'A 55-day, standard-library-first Go course grounded in the current official Go documentation. Learn the language from zero, then build tested APIs, concurrent services, database-backed systems, production containers, and a deployed disaster-relief supply network.',
  phases: goPhases,
  totalDays: 55,
  totalHours: 231,
};
