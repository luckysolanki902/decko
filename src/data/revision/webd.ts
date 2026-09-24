import type { ConceptDef } from './types';

export const webdConcepts: ConceptDef[] = [
  { id: 'publish', title: 'Publish a Useful Page', summary: 'HTML structure, CSS reasoning, resilient layout, responsive constraints, and accessible forms.', sources: [{ phaseId: 'phase1' }] },
  { id: 'browser', title: 'Make the Browser Respond', summary: 'JavaScript values, control flow, functions, collections, the DOM, async work, and persistence.', sources: [{ phaseId: 'phase2' }] },
  { id: 'react', title: 'Build Products with React', summary: 'Components, state snapshots, effects, state architecture, complete flows, and testing.', sources: [{ phaseId: 'phase3' }] },
  { id: 'production', title: 'Full-Stack Production', summary: 'HTTP, persistence, identity, Next.js boundaries, delivery, observability, and operation.', sources: [{ phaseId: 'phase4' }] },
];
