import { Roadmap } from "@/types";
import { damlPhases } from "./phases/daml";

export const damlRoadmap: Roadmap = {
  id: "daml",
  title: "Python & Data Analytics",
  subtitle: "Python, NumPy, Pandas, Excel, SQL, Tableau, Statistics, Experiments & Analyst Practice",
  description: "A 144-day professional data analytics path: investigate data from Day 1, build strong Python foundations, master tabular analysis, spreadsheets, SQL and BI, reason about uncertainty and experiments, analyze time without predictive modeling, govern metrics, and communicate decision-ready work.",
  totalDays: 144,
  totalHours: 588,
  phases: damlPhases,
};

// Legacy export for backwards compatibility
export const pydamlRoadmap = damlRoadmap;
