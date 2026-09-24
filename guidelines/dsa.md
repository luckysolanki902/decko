# DSA (C++) Authoring Guidelines

Use this file whenever editing the DSA roadmap, DSA lectures, phase data, or DSA
syllabus docs. Language is **C++** throughout. Build deep problem-solving ability and
a continuing competitive-programming practice. CodeChef stars and Codeforces titles
are different systems; no course duration guarantees a rating.

Lectures are generated on demand, normally three at a time. Follow
[lecture generation prompt](lecture-generation.md) for batch
continuity and [`../src/data/syllabus/dsaroadmap/01-Study-System.md`](../src/data/syllabus/dsaroadmap/01-Study-System.md)
for entry gates, help, review, pace and confidence. Research rationale:
[DSA psychology report](../docs/research/dsa-psychology.md).

> **Read [`guidelines/teaching-method.md`](teaching-method.md) first.** It is the cross-roadmap contract for *how to explain* — failure-first derivation, prerequisite-safe examples, unpacking instead of compressing, tracing concrete values. This file covers *what* to teach and *what shape* the file takes; that one decides whether the explanation actually lands.

> **Two checks that catch the most damage, from the Phase 4 WebD rewrite:**
>
> - **The neighbour check.** Before calling a lecture done, grep the day before and the day after for its main topic. Two consecutive lectures that disagree is a bug of the same severity as broken code — soften the overstated side into a threshold, and have the later day address the tension out loud. (Rule 12)
> - **The prerequisite check is a *reading*, not a grep.** Finding a term in an earlier day proves the string exists, not that it was taught. Open that day: if the term appears inside an example about something else, it is a gap, and the fix is a plain-language detour before the first real use. (Rule 2)
>
> The runnable structural checks — opener length, borrowed future APIs, corrupted inline code, answer-key distribution — are in **The authoring workflow** in [`teaching-method.md`](teaching-method.md).

## Who the learner is (read this first — it changes how you teach)

This learner has a specific, non-negotiable style, pulled from how he actually learns:

- **Passive familiarity is not the learning target.** Reading or watching can help
  understanding, but does not establish independent recall or transfer. Every lecture
  must make him *produce*, not only follow the explanation.
- **Make an attempt possible before asking for one.** The learner should understand
  the question and possess the needed syntax. Ask for a tiny trace, prediction, or
  brute-force plan before revealing the new technique. Do not mistake an unreadable
  statement or missing prerequisite for productive struggle.
- So the DSA pedagogy is **discovery-first / problem-first**, not definition-first. You
  do **not** open with "A stack is a LIFO data structure." You open with a problem whose
  accessible, naive attempt reveals why a stack would help — then guide the derivation,
  name it and clean it up. Independent invention is not a prerequisite for understanding.

> Make the need for the tool visible. A learner can understand the derivation deeply
> without independently inventing it. Fade help from worked example to completion
> task to independent problem as competence grows.

## The Discovery Loop (the shape of every DSA lecture)

Replace the usual "concept → example → practice" with this loop, repeated per idea:

1. **Pose the problem cold.** A concrete task with small numbers. No hint of the technique.
2. **Let him attempt.** Explicitly invite a brute-force / first-instinct solution. Write
   the naive code *with* him. Make it run.
3. **Break it.** Show the input size or edge case where the naive attempt dies (TLE, wrong
   answer, stack blows up). Quantify it with complexity.
4. **Feel the missing tool.** Ask: "what would we need for this to be fast?" Let the shape
   of the answer appear before its name.
5. **Name & formalize.** *Now* introduce the data structure / algorithm / invariant. Give
   the mental model, the why-it-works, the exact operations and their cost.
6. **Rebuild clean.** Re-solve the original problem with the tool. Compare before/after
   complexity so the payoff is visible.
7. **Name the traps.** The specific bugs (off-by-one, overflow, empty container, `int` vs
   `long long`, corrupting an iterator) — the real mistakes, not vague warnings.

Not every idea needs all 7 beats, but the **problem comes before the definition, always.**

## Five-task practice bank, with a realistic core

Each lecture supplies five suitable tasks: guided warm-up, core application, changed
constraint, delayed reconstruction, optional stretch. This is a bank across sessions,
not five accepted submissions in one hour and not a proof of mastery by itself.
Assign one or two core attempts; defer the retrieval task until after a delay.

Before judge readiness, use local compile/run, trace, completion and debugging tasks.
After readiness, choose canonical problems from LeetCode, Codeforces, AtCoder or CSES
according to the topic and prerequisites. Custom exercises remain useful for isolated
mechanisms. Verify official statements and constraints; do not use a difficulty label
as a substitute for reading the problem. Keep CP practice possible on CP platforms.

Every task needs clear inputs/outputs, a prerequisite note, expected effort range,
three progressively revealing hints, a complete runnable/judge-compatible solution,
a correctness explanation and a cost analysis. Separate task, hints and solution onto
successive screens; never put feedback beside the first attempt. Before Big-O is
taught, count concrete operations and storage; teach notation before using it.
Explain the LeetCode method/class harness when introduced; explain standard-input
judges separately. Do not force either interface on Day 1.

## Time budget and retention

- A numbered day is a study unit: about four baseline hours, often across sessions.
  A default allocation is 150 minutes of guided study and 90 minutes of practice,
  feedback and recall. Advanced units can need substantially more.
- Keep long explanations when needed; split into clear session stopping points.
  Renumbering the syllabus is a separate synchronized curriculum edit.
- Begin with two closed-notes prerequisite cues after the short motivation, using
  only actually taught concepts. Feedback follows on a later screen.
- Add at most two durable review cues per session. Start reviews around 1/3/7/14/30
  days after study, adapt to performance, and cap ordinary review at 15–20 minutes.
- Include a weekly mixed problem and an early short virtual contest after foundation
  readiness. Do not postpone all contest experience to the final phase.
- Record assisted, independent, delayed-recalled and transferred work separately.
  A miss triggers a small prerequisite repair, not a complete course restart.

## No-forward-reference rule (strict for DSA)

The dependency graph matters more here than in any other course. If topic B has not been
taught yet, you may **not** use B to explain topic A.

- Don't explain recursion using trees; teach recursion on numbers/arrays/strings first.
- Don't use a `priority_queue` before the heaps phase; if a graph problem needs it, that
  problem belongs *after* heaps (the roadmap ordering already guarantees this).
- Don't use STL `set`/`map` in a lecture that precedes the containers phase.
- Merge sort / quick sort require recursion → they come **after** Recursion Foundations, not
  before. (This is why the roadmap teaches recursion basics before sorting, unlike the raw
  A2Z ordering.)
- When a prerequisite reappears, give a one-line callback ("recall that `lower_bound` returns
  the first element ≥ x"), never assume silent memory.

## C++ specifics to teach deliberately

- Overflow: `int` overflows near 2·10⁹ — teach `long long`, and *when* you need it, the day
  arithmetic first appears.
- Fast I/O (`ios::sync_with_stdio(false); cin.tie(nullptr);`) — introduced in Phase 1 and
  reused; explain *why* it matters for large inputs, don't cargo-cult it.
- STL cost model: every container/algorithm gets its Big-O the moment it's introduced.
- Undefined behavior traps: out-of-bounds `[]` vs `.at()`, invalidated iterators after
  `push_back`, signed/unsigned comparison, integer division truncation.
- Reference vs copy in function args (`vector<int>&` to avoid O(n) copies).

## The Teaching Bar (inherited from AGENTS.md, specialized)

- **Explain, never merely mention.** Every operation gets: what, why it works, cost, a tiny
  trace on 3–4 elements by hand, then the code, then the trap.
- **Mental model before syntax.** One picture (ASCII diagram / dry-run table) before any API.
- **Force recall.** Mid-lecture ` ```quiz ` quick-checks and the 5-problem ladder. Recognition
  isn't mastery.
- **Name failure modes inline**, not as an appendix.
- If a learner would have to open ChatGPT/Google to understand a line you wrote, that line
  isn't finished.

## Lecture format (markdown deck — same renderer as other courses)

DSA lectures are markdown decks rendered by `src/components/LectureDeck.tsx` with
`variant="dsa"` (falls back to a neutral accent until a DSA accent is added to
`src/components/quiz/QuizOption.tsx`).

- Path: `public/data/lectures/dsa/phaseN/dayNN-kebab-slug.md`. One file per day.
- First line: `# Day N: Title`. Second non-empty line: `**Duration: ~4h baseline; split across sessions | Focus: …**`.
- Screens split on `---`. Code fences use ```` ```cpp ````. Math via `$...$` / `$$...$$`.
- Sprinkle 4–7 mid-lecture ` ```quiz ` blocks (one after each concept beat; target a real
  misconception; four plausible options; teaching `explanation`).
- End with exactly one ` ```finalquiz ` (10 MCQs, `q1`..`q10`, `single_correct` /
  `multiple_correct`, 4 options a–d each, `correctOptionIds`, teaching `explanation`, short
  `example`). Many should be **read-the-code / predict-the-output / spot-the-bug / pick the
  right complexity**. Grading is client-side (`gradeQuiz`) — no LLM eval.
- The 5 curated problems get their own screens near the end (hint ladder + full C++ solution).
- **Section names are load-bearing.** The deck splits the lecture into chapters (Lecture →
  Practice/Review → Wrap-up → Quiz) by reading each screen's first `##`. Open the curated-problem
  run with `## Practice …` or `## Problem 1 …`, head the consolidation screen
  `## Common mistakes`, and keep `## Cheat sheet` / `## Tomorrow` contiguous at the end.
  Never use those words on a teaching screen — it cuts the lecture early. Full rules:
  [`guidelines/deck-chapters.md`](deck-chapters.md).

## Roadmap & syllabus data (keep in sync)

- Phase data (source of truth for what each day covers): `src/data/phases/dsa/index.ts`.
- Roadmap metadata: `src/data/dsa.ts`. Human-readable syllabus: `src/data/syllabus/dsaroadmap/`.
- Coverage floor / source checklist: `src/data/syllabus/dsaroadmap/_source-striver-a2z.md`.
- Keep phase titles, `# Day N:` headings, durations, and visible cards consistent.

## App wiring (when the course goes live in the app)

The phase file uses the **old** `Phase` shape (`id/number/icon/color/days` + `sections`),
exactly like `go`/`webd` — not the newer daml shape. When you wire the routes, cards, and
`RoadmapSection` type, **mirror the `go`/`webd` UI path, not the `daml` one**: copy the
`src/app/go/*` route pattern (roadmap page, `[phaseId]`, projects, notes) and register
`dsaRoadmap` the same way `goRoadmap`/`webdRoadmap` are. The daml rendering style is not the
target for this course.

## Validation

- Parse every fenced JSON quiz block; balance every code fence.
- `npm run build` and `NODE_OPTIONS="--max-old-space-size=8192" npx eslint src` when practical.
- Spot-check one lecture in the browser; walk the deck; answer one quick-check and the final quiz.

## Universal rules (from AGENTS.md)

- Protect user work — never revert unrelated dirty files.
- One lecture file per day; never combine a day range.
- Stage only relevant files; commit/push only when explicitly asked; prefer a feature branch.
