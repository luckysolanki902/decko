# Contributing to decko

Thanks for considering it. Contributions fall into three groups, and they are not
equally easy to get merged — the teaching bar is the hard part, not the code.

## What is most useful

**Corrections to existing lectures rank above new ones.** A single paragraph that
misleads a learner costs more than a missing lecture, because the learner does not know
to distrust it. If you hit something wrong, unclear, or under-explained, that is the
most valuable issue you can open.

Roughly in order of usefulness:

1. **Corrections** — something is factually wrong, contradicts a neighbouring lecture, or asserts something stronger than the truth.
2. **Clarity fixes** — a passage you had to re-read, or had to look up elsewhere to follow. Say exactly which paragraph and what was missing.
3. **New lectures** — valuable, but held to the full bar in [`AGENTS.md`](AGENTS.md). Read it first.
4. **Application code** — bug fixes, accessibility, performance.

If you are not sure what to pick up, the requests board on the live site shows what
learners have actually voted for.

## Before writing course content

Read, in this order:

1. [`AGENTS.md`](AGENTS.md) — the teaching bar and the rules broken most often.
2. [`guidelines/teaching-method.md`](guidelines/teaching-method.md) — the full method.
3. The guideline for your roadmap from the router in `AGENTS.md`.
4. A reference lecture: `public/data/lectures/webd/phase4/day37-useeffect-error-boundaries.md`.

A pull request that has not read these will not pass review, and a review that has to
re-teach the method costs more than writing the lecture. The rules are specific for a
reason — each came from a real complaint about a real lecture.

The three that catch people most often:

- **Failure first.** Do not state a rule before showing the problem it solves.
- **Nothing from the future.** Every example must be buildable from earlier days only.
- **A prerequisite check is a reading, not a search.** Finding a term in an earlier day proves the string exists, not that it was taught.

## Reporting a problem in a lecture

Open an issue with:

- The file path (e.g. `public/data/lectures/webd/phase2/day14-functions-and-scope.md`).
- The heading or line the problem is under.
- What you expected to understand at that point, and what actually stopped you.

"Day 14 is confusing" is not actionable. "In *Closures*, `counter` is used before
anything explains that the inner function keeps the outer scope alive — I could not
tell whether it was a new variable" is immediately fixable.

## Working on code

```bash
npm ci
cp .env.example .env.local     # fill in MONGODB_URI and JWT_SECRET
npm run dev
```

Conventions that matter here:

- **Every personal record is scoped by `userId`, in the query filter** — not in a check after the read. Course content is shared; progress, trackers, attempts, quiz results and votes are not.
- **Mutating API routes call `requireSession()`.** Keep the check next to the data it protects.
- **No AI provider calls at runtime.** Lectures are AI-drafted during authoring and committed after review, but the deployed app holds no model API key and generates nothing on request. Pull requests adding runtime generation will be declined: content nobody has read before the learner is exactly what the review step exists to prevent.
- Comments explain *why*, not *what*, and match the surrounding style.
- Prefer editing an existing file over adding a new one.

## Checks

All four must pass before you open a pull request:

```bash
npm run validate:quizzes
npm run typecheck
npm run lint
npm run build
```

`validate:quizzes` checks quiz *structure* — malformed JSON, broken fences, missing
answers. It cannot judge answer-position balance, because the runtime randomises option
order. That part is on you: see the answer-key rules in [`AGENTS.md`](AGENTS.md).

Spot-check any lecture you touched in the browser, including chapter navigation and
quiz rendering.

## Pull requests

- One logical change per pull request. A correction and a refactor do not belong together.
- Stage only files relevant to your change. Never revert unrelated modified files.
- Describe what changed and why. If it is a lecture fix, say what a learner was getting stuck on.
- Write commit messages as ordinary human-authored work — no tooling attribution, no co-author trailers.

## Licensing of contributions

By contributing you agree that your work is licensed under the same terms as the
repository:

- **Code** under [MIT](LICENSE).
- **Course content** (`public/data/lectures/`, `src/data/syllabus/`, `guidelines/`) under [CC BY-SA 4.0](LICENSE-CONTENT).

Only submit material you wrote or have the right to relicense. Do not paste content
from paid courses, books or other sites.

## Code of conduct

Participation is covered by the [Code of Conduct](CODE_OF_CONDUCT.md).
