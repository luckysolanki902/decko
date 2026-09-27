import type { ConceptDef } from './types';

export const damlConcepts: ConceptDef[] = [
  { id: 'analysis-foundations', title: 'Python & Exploratory Analysis Foundations', summary: 'The analyst loop, Python fundamentals, tabular grain, quality checks, useful summaries, first charts, and reproducible evidence.', sources: [{ phaseId: 'phase1' }] },
  { id: 'python-program-design', title: 'Python Problem Solving & Program Design', summary: 'Collection choice, function contracts, modules, tests, generators, dates, money, ranking rules, and dependable analytical utilities.', sources: [{ phaseId: 'phase2' }] },
  { id: 'reproducible-workflows', title: 'Files, Errors, OOP & Reproducible Workflows', summary: 'Safe file boundaries, explicit failures, diagnostic logs, configuration, environments, domain models, and reliable handoffs.', sources: [{ phaseId: 'phase3' }] },
  { id: 'numpy-pandas', title: 'NumPy & Pandas Foundations', summary: 'Arrays and DataFrames, shape, dtypes, indexes, selection, vectorized transformations, grouped summaries, and auditable table operations.', sources: [{ phaseId: 'phase4' }] },
  { id: 'cleaning-eda-visualization', title: 'Data Cleaning, EDA & Visualization', summary: 'Profiling, missingness, duplicates, category repair, reshaping, relationship checks, chart design, and uncertainty-aware investigation.', sources: [{ phaseId: 'phase5' }] },
  { id: 'excel-analysis', title: 'Excel for Auditable Analysis', summary: 'Structured tables, controlled formulas, lookups, pivots, validation, reconciliation, charts, and reviewable spreadsheet models.', sources: [{ phaseId: 'phase6' }] },
  { id: 'sql-foundations', title: 'SQL Query Foundations', summary: 'Relational grain, filtering, aggregation, joins, subqueries, readable query structure, null behavior, and result reconciliation.', sources: [{ phaseId: 'phase7' }] },
  { id: 'advanced-sql-modeling', title: 'Advanced SQL & Analytical Data Modeling', summary: 'Window functions, sequences, cohorts, dimensional models, governed metrics, reusable layers, and performance-aware SQL design.', sources: [{ phaseId: 'phase8' }] },
  { id: 'statistics-probability-sampling', title: 'Statistics, Probability & Sampling', summary: 'Distribution shape, variation, probability, sampling design, bias, representativeness, and careful population claims.', sources: [{ phaseId: 'phase9' }] },
  { id: 'inference-experiments', title: 'Inference & Experiment Design', summary: 'Estimation, confidence intervals, hypothesis tests, effect sizes, power, A/B design, guardrails, and responsible decisions.', sources: [{ phaseId: 'phase10' }] },
  { id: 'bi-time-metrics', title: 'Tableau, BI, Time Series & Metric Systems', summary: 'Governed dashboards, metric definitions, visual interaction, time decomposition, baseline analysis, data freshness, and operational delivery.', sources: [{ phaseId: 'phase11' }] },
  { id: 'professional-analytics', title: 'Professional Analytics & Communication', summary: 'Ambiguous question framing, stakeholder alignment, ethical analysis, decision communication, portfolio evidence, and interview defense.', sources: [{ phaseId: 'phase12' }] },
];
