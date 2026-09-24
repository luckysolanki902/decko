# Researching and Generating a New Course

Use this guide when adding a new roadmap or rebuilding one from first principles. Do not generate lectures until the complete syllabus, dependency graph, project ladder, and evidence model have been reviewed.

## The outcome

A course is not a list of topics. It is a sequence of changed capabilities. Each day must answer four questions:

1. What useful thing can the learner do after this day that they could not do before?
2. What earlier knowledge does this day retrieve and strengthen?
3. What failure makes the new idea necessary?
4. What evidence distinguishes independent understanding from a copied result?

The roadmap must preserve professional depth while creating frequent, honest wins. An early win is a small useful artifact with understood boundaries, not a toy presented as mastery.

## 1. Research the field before choosing topics

Use current primary sources wherever possible:

- official language, framework, platform, and tool documentation;
- current university curricula for dependency comparisons, not as proof of pedagogy;
- professional competency frameworks and representative job descriptions;
- foundational or current research papers for scientific fields;
- postmortems, standards, and security guidance for production practice.

Create a research report in `docs/research/<course>-research.md` that records:

- the field's durable foundations;
- current professional workflows and tool boundaries;
- common curriculum dependency mistakes;
- safety, ethics, accessibility, and operational concerns;
- claims that remain uncertain or vendor-specific;
- sources and the exact curriculum decisions they support.

Do not turn popularity into a prerequisite. A tool belongs in the core only when it teaches a durable mechanism, appears in real work, or unlocks later dependencies.

## 2. Define the learner and the proof

Write an entry contract: what can be assumed, how each prerequisite is diagnosed, and the smallest repair route for each gap.

Define evidence levels used throughout the course:

| Level | Evidence |
|---|---|
| Covered | The learner encountered the explanation. |
| Built with help | The artifact works, with visible assistance recorded. |
| Independent | The critical path was reconstructed without the answer open. |
| Recalled | The mechanism was produced again after a meaningful gap. |
| Transferred | A changed task was solved without being told which technique to use. |

Course completion must never imply all five levels automatically.

## 3. Design the capability spine

Start with 4 to 8 phases. Give each phase:

- one capability statement;
- one dependency-safe sequence;
- one distinct capstone with a real user or operator;
- one gate that mixes explanation, building, diagnosis, delayed recall, and transfer.

Then design days backward from those gates. Each day needs 4 to 8 topics, and each topic needs 4 to 10 atomic items. Follow `guidelines/course-data.md` exactly.

The sequence should alternate expansion and consolidation:

```text
visible win -> explain mechanism -> break assumption -> repair -> changed task -> delayed return
```

Do not postpone the identity of the field. A data course performs EDA immediately. A web course publishes a page immediately. A mobile course runs an interaction on a device immediately. A backend course ships a useful binary or service immediately.

## 4. Build a completely original project ladder

Projects must be designed from the new capability spine, not renamed from another course or repository.

For every project specify:

- user and decision;
- constraints and failure states;
- concepts it integrates;
- evidence of correctness;
- one changed requirement for transfer;
- what is explicitly out of scope.

Search the repository for every legacy project title, domain, dataset, and signature feature. A renamed clone is still a trace. Replace the problem, user, data, interaction, and success criteria together.

Avoid portfolio clichés unless the course studies why they fail. Prefer specific tools for communities, operators, researchers, or small organizations where constraints create real judgment.

## 5. Apply the learning system

Read `guidelines/teaching-method.md` before writing roadmap text. The syllabus must make these mechanisms possible:

- failure before rule;
- prediction before reveal;
- worked example followed by completion, independent reconstruction, and transfer;
- 3 to 7 checkpoint quizzes inside each lecture;
- one ten-question final quiz;
- retrieval from recent and older prerequisites;
- default review around 1, 3, 7, 14, and 30 days, adapted to evidence and workload;
- help-aware progress rather than completion-only progress;
- phase gates that include diagnosis and changed-task performance.

Use challenge carefully. Productive failure means a bounded attempt with enough prior knowledge and timely instruction afterward. It does not mean withholding prerequisites or making beginners guess unknown syntax.

## 6. Check the full dependency graph

For every day, list every language feature, API, mathematical idea, protocol, and tool used by its examples. Point each one to the day that teaches it.

If no earlier day teaches it, reorder the syllabus, add a prerequisite bridge, or remove the dependency. A word appearing earlier does not count as teaching.

Check neighboring days for contradictions. Check that projects use only taught capabilities. Check that advanced phases return to foundations under changed conditions rather than abandoning them.

## 7. Write the source files

Update all of these together:

- `src/data/<course>.ts` for identity and totals;
- `src/data/phases/<course>/` for structured day data;
- `src/data/syllabus/<course>roadmap/` for the human-readable syllabus;
- `src/data/courses.ts` for the public card;
- course page groupings, revision configuration, metadata, and project surfaces;
- `AGENTS.md` and the guideline router for the new course.

Only after those agree should you use `guidelines/lecture-generation.md` to author the first three lectures.

## 8. Audit before release

Confirm:

- day numbering is continuous;
- titles, counts, durations, cards, and syllabus docs agree;
- every project is original and dependency-safe;
- no legacy project names, datasets, or descriptions remain;
- first-day work expresses the real identity of the field;
- every phase gate has explicit evidence beyond completion;
- generated lectures use the modern deck and valid quiz blocks;
- `npm run validate:quizzes`, `npm run typecheck`, `npm run lint`, and `npm run build` pass.

Record unresolved evidence gaps honestly. Do not claim a course is psychologically optimal, job-guaranteeing, or mastery-producing. Describe the mechanisms it uses and the evidence it asks the learner to produce.
