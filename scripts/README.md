# Maintenance utilities

Run from the repository root.

## Checks

```bash
npm run validate:quizzes   # quiz JSON and structural contracts
npm run typecheck          # tsc --noEmit
npm run lint               # eslint
npm run build              # production build
```

All four must pass before a pull request.

`validate-quizzes.mjs` scans lecture Markdown for valid quiz JSON and the structural
contract: balanced fences, parseable blocks, a correct answer present, valid shapes.

It **cannot** judge answer-position balance, because the runtime randomises option
order before display. Keeping correct answers spread across positions is an authoring
responsibility — see the answer-key rules in [`AGENTS.md`](../AGENTS.md).

The script also works when invoked by absolute path from another directory.

## Content statistics

```bash
npm run stats
```

Prints lectures, words and quiz blocks per course. The homepage cards in
`src/data/courses.ts` quote lecture counts — run this after authoring a batch and
update them, so the site never promises more than the repository contains.

## Database migration

```bash
MONGODB_URI=... npm run migrate:revision -- --from <source-db> --to <target-db> [--dry-run]
```

Copies authored revision sets between databases on the same connection string.
Revision sets are course content, so they are the only thing worth carrying across —
progress, attempts, quiz results and tracker logs belong to individual accounts and
are deliberately left behind.

Matching is on `(roadmapId, conceptId, targetId, version)`, so the script is safe to
re-run: anything already present is skipped. Use `--dry-run` first.

## DAML chart assets

`assets/generate-daml-charts.py` generates the Day 114/115 images and interactive
Plotly files under `public/data/lectures/daml/phase7/images/` and `plotly/`. It needs
NumPy, pandas, Matplotlib, seaborn, Plotly and the image-export backend for the
installed Plotly version. Some source datasets are downloaded.

```bash
.venv/bin/python scripts/assets/generate-daml-charts.py
```

This overwrites generated chart assets — run it intentionally and review the output.
It is not part of the ordinary build or lint cycle. Output locations resolve from the
script's own location rather than the shell's working directory.
