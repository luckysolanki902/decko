# Data Analytics / DAML Authoring Guidelines

Use this file whenever editing DAML lectures, Python/data analytics notes, SQL notes, Tableau notes, or analyst-thinking content.

> **Read [`guidelines/teaching-method.md`](teaching-method.md) first.** It is the cross-roadmap contract for *how to explain* — failure-first derivation, prerequisite-safe examples, unpacking instead of compressing, tracing concrete values. This file covers *what* to teach and *what shape* the file takes; that one decides whether the explanation actually lands.

> **Two checks that catch the most damage, from the Phase 4 WebD rewrite:**
>
> - **The neighbour check.** Before calling a lecture done, grep the day before and the day after for its main topic. Two consecutive lectures that disagree is a bug of the same severity as broken code — soften the overstated side into a threshold, and have the later day address the tension out loud. (Rule 12)
> - **The prerequisite check is a *reading*, not a grep.** Finding a term in an earlier day proves the string exists, not that it was taught. Open that day: if the term appears inside an example about something else, it is a gap, and the fix is a plain-language detour before the first real use. (Rule 2)
>
> The runnable structural checks — opener length, borrowed future APIs, corrupted inline code, answer-key distribution — are in **The authoring workflow** in [`teaching-method.md`](teaching-method.md).

## Lecture Files

- Path: `public/data/lectures/daml/<phaseN>/dayNN-kebab-slug.md`
- Renderer: `src/app/daml/notes/[slug]/NoteContent.tsx` through the shared `LectureDeck` component. DAML uses the same modern screen-based reader as ML and DSA.
- One file per day. Do not combine day ranges.
- Use `---` to create one focused screen per idea.
- Include 3 to 7 ` ```quiz ` blocks and exactly one ten-question ` ```finalquiz ` block.

## Markdown Contract

Every DAML lecture follows this deck structure:

```markdown
# Day N: Title that promises one clear skill

**Duration: X hours | Focus: one concrete capability**

---

## Why this day exists

10 to 20 lines. One motivating idea in known vocabulary. No objective list or prerequisite dump.

---

## The version that looks finished

Show the tempting analytical shortcut and the realistic input, definition, or decision that breaks it.

## The mental model

Give one picture, table, or trace that predicts behaviour before introducing an API.

## Concept screens

One idea per screen. For every concept: tiny example, realistic example, expected output, named failure mode, and the analytical decision it changes. Insert checkpoint quizzes after the explanation they test.

---

## Practice

Five laddered tasks: recall, mechanics, realistic analysis, debugging, and changed-task transfer.

---

## Studio: distinct project title

Build the day artifact, test one boundary, and state what evidence would change the conclusion.

---

## Common mistakes

Name the mistake, why the result becomes misleading, and the corrective check.

## Cheat sheet

Short reference followed by the final quiz block.
```

## Depth Bar

DAML lectures are **mastery-depth**, not survey-depth. Every lecture must:

- Open with a mental model before showing any API (why does this tool exist? what is it replacing?).
- Use **one concrete, runnable tidy dataset** introduced in Part 1 and reused throughout — don't switch datasets every section.
- Show **expected output** after every code block that produces output. Output blocks use ` ```text `.
- Explain **failure modes** and common mistakes, not just the happy path.
- Include a "when NOT to use this" or "common errors" callout per major section.
- Include five purposeful practice tasks plus the studio build. Add more only when they create a distinct kind of evidence.
- Use as many screens as the derivation needs. Do not compress a confusing idea to hit a line target.
- "Read like a patient mentor next to the learner" — not a reference manual, not a textbook chapter.

## Syllabus Authority

- `src/data/phases/daml/index.ts` is the source of truth for day topics. **Never cut topics.** You may add or rearrange; never remove.
- When the lecture and the syllabus disagree, fix the syllabus to match the richer lecture, or expand the lecture to cover every syllabus item.

## Teaching Rules (universal)

- **Question first.** Before showing a chart or function, state the analysis question it answers.
- **One dataset per lecture.** Introduce it in Exercise 1 of Part 1. Reuse every column you'll need later so the learner sees the full workflow.
- **Show, don't just tell.** Every concept gets a runnable snippet with output.
- **Failure modes.** At least one "common mistake / what goes wrong / how to recognise it" block per Part.
- **Chart choice.** Never say "use this chart". Say "if your question is X, then Y is the right family because…".
- **Analyst framing.** End every major section with: what decision does this output change? what can mislead us?

## Visualisation Lectures (Seaborn, Plotly, Streamlit)

- Teach the mental stack explicitly at the start: Pandas → Seaborn/Plotly → Matplotlib polish.
- Cover EVERY major function that appears in real analyst workflows. Depth matters more than coverage breadth.
- Include a "when to use which library" decision table.
- For Streamlit: teach the rerun model explicitly; learners are confused by it every time.
- For Plotly: no Dash. Plotly Express + update_layout + write_html is the scope.

## Code Style

- Always `import pandas as pd`, `import numpy as np`, `import matplotlib.pyplot as plt`, `import seaborn as sns`, `import plotly.express as px` etc. at the top of the first snippet in each Part.
- Use `print()` to show output explicitly.
- Show only enough code to illustrate the concept — 10–25 lines per block, never longer.
- Break multi-step ideas into multiple successive small blocks with prose between them.

## File / Routing Notes

- Slug comes from the filename (`day03-pandas-without-magic.md` becomes `day03-pandas-without-magic`).
- When you add or rename a lecture, also update `src/data/phases/daml/index.ts` and the DAML syllabus docs.

## Validation

After editing:
- `npm run validate:quizzes` — validate embedded and final quiz blocks.
- `npm run build` — fix all TypeScript / Next errors before committing.
- `npm run lint` — fix blocking errors.
- Spot-check in the browser at `/daml/notes/<slug>`.
