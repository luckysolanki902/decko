# Course Data Guidelines

Use this file whenever editing roadmap metadata, phase data, syllabus markdowns, or visible app cards.

## Roadmap Data

- Top-level roadmaps live in `src/data/<roadmap>.ts`.
- Phase data lives in `src/data/phases/<roadmap>/`.
- Human-readable syllabus docs live in `src/data/syllabus/<roadmap>roadmap/`.
- Public lectures live in `public/data/lectures/<roadmap>/phaseN/`.

## Phase Data Rules

- One section per day.
- Section title must be `Day N: <Headline>` and match the lecture H1.
- Day numbering must be continuous within the roadmap.
- Each day should have 4-8 topics.
- Each topic should have 4-10 atomic learnable items.
- The last topic of the last day in a phase should carry the phase capstone when appropriate.
- Project descriptions describe what to build and constraints, not full solutions.

## Sync Checklist

When adding or changing lectures:

- Update the lecture file title.
- Update matching phase section title/items if needed.
- Update syllabus markdown if the phase overview changes.
- Update top-level roadmap totals if days/hours changed.
- Update visible home/roadmap cards if phase count or day count changed.
- Ensure notes routes can discover the files.

## Validation

Run targeted checks first:

```bash
npm run build
npm run lint
```

Existing unrelated warnings can be left alone. Do not fix unrelated files just because validation reports pre-existing warnings.

## Git

- Stage only files relevant to the request.
- Do not commit unrelated dirty files.
- Use a clear commit message that names the course/content change.
