# Contributor and Agent Instructions

This file is the entry point for anyone — human or AI — writing course content or code
in this repository. It is deliberately short: its job is to state the non-negotiable
rules and route you to the detailed guideline for whatever you are editing.

**Read the routed guideline before you write.** The teaching bar here is specific, and
work that does not meet it is rejected in review regardless of how much of it there is.

## Scope

decko hosts six learning roadmaps:

| Id | Course |
|---|---|
| `webd` | Frontend, backend, full-stack and production web development |
| `daml` | Python, data analytics, SQL, Tableau, statistics, analyst thinking |
| `ml` | Machine learning, deep learning, NLP, LLMs, RAG, agents, diffusion, MLOps |
| `dsa` | Data structures and algorithms in C++, from scratch to competitive programming |
| `go` | Go from first principles to production services |
| `reactnative` | Cross-platform mobile development with React Native |

## Guideline router

| Work area | Read first |
|---|---|
| **Any lecture, any roadmap — how to explain** (read before the roadmap file) | [`guidelines/teaching-method.md`](guidelines/teaching-method.md) |
| On-demand lecture generation — normally the next three lectures | [`guidelines/lecture-generation.md`](guidelines/lecture-generation.md) |
| DAML / data analytics lectures, Python, SQL and Tableau notes | [`guidelines/da.md`](guidelines/da.md) |
| ML/DL/GenAI roadmap and lectures, NLP/LLM/RAG/agent content | [`guidelines/ml.md`](guidelines/ml.md) |
| WebD lectures, HTML/CSS/JS notes, frontend and backend content | [`guidelines/webd.md`](guidelines/webd.md) |
| DSA (C++) lectures and the competitive-programming roadmap | [`guidelines/dsa.md`](guidelines/dsa.md) |
| Go lectures and backend-in-Go content | [`guidelines/go.md`](guidelines/go.md) |
| Quiz blocks — ` ```quiz ` / ` ```finalquiz ` JSON | [`guidelines/quiz-blocks.md`](guidelines/quiz-blocks.md) |
| Revision sets — retrieval cards, orientation, session length | [`guidelines/revision.md`](guidelines/revision.md) |
| Section headings that split a deck lecture into chapters | [`guidelines/deck-chapters.md`](guidelines/deck-chapters.md) |
| Phase data, roadmap metadata, syllabus sync | [`guidelines/course-data.md`](guidelines/course-data.md) |
| Researching or generating a complete new course and project ladder | [`guidelines/course-generation.md`](guidelines/course-generation.md) |
| Legacy DAML lecture style details | [`guidelines/legacy-daml-style.md`](guidelines/legacy-daml-style.md) |

## The teaching bar

Every lecture should read like a patient expert sitting beside the learner and thinking
several moves ahead for them. Concretely:

- **Explain, never merely mention.** For every concept, property, method or attribute: what it is, *why* it exists or behaves that way, a tiny example → a realistic one → a real-world use, and the precise trap beginners fall into. If a learner would have to open another tool to understand a paragraph, that paragraph is not finished.
- **Failure first, rule second.** Never state a rule before the learner has watched the problem it solves. Show the version they *would* write, let it work, break it with one realistic step, then introduce the tool as the fix they were already reaching for.
- **Mental model before syntax.** Lead with one clarifying picture — a metaphor, an ASCII diagram, a table — before any API surface.
- **Explain only with what is already taught.** Every example must be buildable from earlier days. No invented APIs, no "don't worry about this part for now", no borrowing a future lecture's tool to demonstrate today's.
- **Flow like a staircase.** Each section unlocks the next. The learner never asks "why are we covering this now?"
- **Name the failure modes.** Debugging and common mistakes are part of the lecture, not an appendix. Name the specific mistake and its cause, not a vague warning.
- **Force recall.** Recognition is not mastery. Include quick checks and a tiered practice ladder that make the learner produce, not just nod along.

The reference set is `public/data/lectures/webd/phase2/day13`–`day15`, `day28` for
project work, and `phase4/day37` for failure-first derivation. Match that depth in any
roadmap.

### The five rules broken most often

These came from real reader complaints:

1. **The opening screen is the shortest screen.** `## Why this day exists` is 10–20 lines, one idea, in vocabulary the learner already has. No term the lecture has not taught yet, no "by the end you'll be able to…" list, no prerequisites paragraph, no meta-description of the lecture's structure. The motivating failure goes on screen 2, where it can be *shown*.
2. **One idea per screen, and never assert something stronger than the truth.** A screen that makes three points is three screens. A comment inside a code block is not an explanation. Check every *cannot / never / always / only* you write — a learner who catches an overstatement stops trusting the whole lecture.
3. **A prerequisite check is a reading, not a grep.** Finding a term in an earlier day proves the string exists, not that it was taught. Open that day. If the term sits inside an example about something else, it is a gap — fix it with a plain-language detour before the first real use.
4. **Neighbouring lectures must not contradict each other.** Before finishing a lecture, search the day before and after for its topic. Two consecutive days disagreeing is a bug of the same severity as broken code.
5. **A confusing lecture is under-explained, not over-long.** When something reads as vague, the fix is more derivation — more traces, more motivating failures, more unpacking — never fewer topics or shorter prose.

Full method and the runnable checks: [`guidelines/teaching-method.md`](guidelines/teaching-method.md).
The worked reference is `public/data/lectures/webd/phase4/day37-useeffect-error-boundaries.md`.

## Answer-key balance

Correct answers must be distributed evenly across option positions. Do not let most
answers cluster on the first or second option while the others go untouched.

> **Never refer to an option by its letter or position.** Not "option (b) is wrong", not
> "answer c", not "the second option", not "the last choice". Describe the option by its
> content — "the version that returns the error last", "the answer claiming the loop runs
> twice".

The runtime randomises displayed option order. A shuffler remaps `(b)`-style references
so older content stays correct, but that is a safety net, not a licence to write new
content that way — phrasings like "the second option" **will** end up pointing at the
wrong thing.

Two supporting rules:

- **Never encode position in option text.** No "both of the above", no "none of these", no option that only makes sense in a fixed order.
- **Vary the correct set in `multiple_correct` questions** — how many are correct, not just which. Shuffling changes positions, not counts.

Because the runtime randomises order, **do not use the validator to judge answer-position
balance**. Run `npm run validate:quizzes` after every lecture edit, but use it only to
catch malformed JSON, broken fences, invalid quiz shapes and missing answers.

## Content conventions

- **One lecture file per day.** Never combine a day range into one lecture.
- **Use npm**, not pnpm or yarn. The committed `package-lock.json` is authoritative.
- Keep phase data, syllabus documents, lecture titles, durations and visible app cards consistent with each other.
- Lectures are AI-drafted against these guidelines, then read back and corrected before they ship. The guidelines are the product; the drafting is the cheap part. Never ship a draft you have not read against the bar above.
- **Authoring is not runtime.** The deployed application contains no AI generation and requires no model API key. Content is produced during authoring and committed; when material is missing it goes on the requests board to be voted on, never generated on demand.

## Engineering conventions

- **Protect work you did not do.** Never revert unrelated modified files. Stage only files relevant to your change.
- **Every personal record is scoped by `userId`**, and the user id belongs in the query filter — not in a check performed after the read. Course content is shared and public; progress, trackers, attempts, quiz results and votes are not.
- **Mutating API routes call `requireSession()`.** The check lives beside the data it protects rather than in a central list that can drift.
- Prefer editing existing files over creating new ones.
- Comments explain *why*, not *what*. Match the density and idiom of the surrounding code.

## Before you open a pull request

```bash
npm run validate:quizzes
npm run typecheck
npm run lint
npm run build
```

All four must pass. Spot-check an affected lecture in the browser, including chapter
navigation and quiz rendering.

**Commit and push only when explicitly asked.** Prefer a feature branch over the default
branch. Write commit messages as ordinary human-authored work: describe the change and
its reason, with no tooling attribution or co-author trailers.
