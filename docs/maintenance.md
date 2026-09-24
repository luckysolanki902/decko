# Repository maintenance

## File layout

Framework and configuration entry points stay at the root, alongside `README.md`,
`AGENTS.md`, the `CLAUDE.md` pointer, and the licence, contributing, security and
conduct files. Everything else has a home:

| Location | Contents |
|---|---|
| `guidelines/` | Authoring and teaching rules |
| `docs/research/` | Research reports and curriculum assessments |
| `scripts/` | Validation, statistics and migration tools |
| `public/data/lectures/<course>/phaseN/` | Lectures and their assets |
| `src/data/phases/<course>/` | Source of truth for what each day covers |
| `src/data/syllabus/<course>roadmap/` | Human-readable syllabi and study guides |

Published lecture and asset URLs live under `public/data/lectures/`. Documentation
cleanup must not change saved lesson URLs — a learner's bookmark is a contract.

Use npm with the committed `package-lock.json`. Build output, dependencies, virtual
environments, editor state and credentials are not source documentation. A local Python
environment is still needed for chart generation.

## Sources of truth

When these disagree, the order is:

1. `src/data/phases/<course>/` — what a day actually covers.
2. `src/data/syllabus/<course>roadmap/` — the readable description of it.
3. `docs/research/` — the reasoning behind curriculum choices.

Research reports record evidence and design reasoning at a point in time. Later
improvements override older audits; do not treat a report as current curriculum.

Keep phase data, syllabus documents, lecture titles, durations and the homepage cards
in `src/data/courses.ts` consistent with one another. `npm run stats` reports the real
lecture counts.

## Data model

Course content is shared and public. Everything personal is keyed by `userId`:

| Collection | Scope |
|---|---|
| `users` | Accounts. Unique index on `username`. |
| `progress` | Per learner, per checklist item. |
| `project_status` | Per learner, per project. |
| `quiz_results` | Per learner, per phase quiz. |
| `trackers`, `tracker_logs` | Per learner. Capped at 10 trackers per account. |
| `revision_attempts` | Per learner. |
| `revision_content` | **Shared** — authored revision sets, no `userId`. |
| `suggestions`, `votes` | Requests board. One vote per account per request. |

Indexes are created on first connection in `src/lib/mongodb.ts`. Adding a per-user
collection means adding a `(userId, …)` index there and filtering on `userId` in every
query — not checking ownership after the read.

## Content authoring

Lectures and revision sets are AI-drafted against the guidelines in
[`AGENTS.md`](../AGENTS.md), then reviewed, corrected and committed. Authoring happens
in the repository, not at runtime: the deployed application makes no calls to any AI
provider and holds no provider credentials, and there is deliberately no model API key
in the environment.

Gaps are surfaced through the requests board rather than filled at runtime: learners
vote, and the most-wanted material is written next. This keeps the quality bar in
[`AGENTS.md`](../AGENTS.md) enforceable, and keeps running the site free beyond hosting
and the database.

## Routine checks

```bash
npm run validate:quizzes
npm run typecheck
npm run lint
npm run build
npm run stats
```

After lecture edits, spot-check the affected pages in the browser — chapter navigation
and quiz rendering in particular. The validator checks quiz structure, not answer
balance or teaching quality.
