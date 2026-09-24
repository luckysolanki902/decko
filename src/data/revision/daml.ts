import type { ConceptDef } from './types';

export const damlConcepts: ConceptDef[] = [
  { id: 'python-analysis', title: 'Python Analysis Foundations', summary: 'Python reasoning, files, errors, reusable functions, domain records, and reproducible analytical workflows.', sources: [{ phaseId: 'phase1' }, { phaseId: 'phase2' }, { phaseId: 'phase3' }] },
  { id: 'tabular-eda', title: 'Tabular Analysis & EDA', summary: 'NumPy, Pandas, cleaning, reshaping, quality investigation, visualization, and reproducible evidence.', sources: [{ phaseId: 'phase4' }, { phaseId: 'phase5' }] },
  { id: 'excel-sql', title: 'Excel, SQL & Data Models', summary: 'Auditable spreadsheets, relational grain, joins, windows, dimensional models, reconciliation, and metric SQL.', sources: [{ phaseId: 'phase6' }, { phaseId: 'phase7' }, { phaseId: 'phase8' }] },
  { id: 'uncertainty', title: 'Statistics & Experiments', summary: 'Variation, probability, sampling, estimation, inference, effect size, power, and responsible A/B decisions.', sources: [{ phaseId: 'phase9' }, { phaseId: 'phase10' }] },
  { id: 'delivery', title: 'BI, Time & Professional Delivery', summary: 'Tableau, non-ML time-series analysis, governed metrics, stakeholder communication, ethics, portfolio, and interviews.', sources: [{ phaseId: 'phase11' }, { phaseId: 'phase12' }] },
];
