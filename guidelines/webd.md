# WebD Authoring Guidelines

Read this file whenever you edit WebD lectures, WebD phase data, or WebD syllabus docs.

> **Read [`guidelines/teaching-method.md`](teaching-method.md) first.** It is the cross-roadmap contract for *how to explain* — failure-first derivation, prerequisite-safe examples, unpacking instead of compressing, tracing concrete values. This file covers *what* WebD lectures contain and *what shape* the file takes. Both apply; the teaching-method rules are the ones that decide whether a lecture actually works.

Its one job: make every future WebD lecture as clear, deep, and *self-contained* as the reference set. A learner should never have to open another LLM, Google a term, or ask "wait, but why?" — because the lecture already answered it, in flow, before they had to ask.

---

## The North Star: what "good" looks like

These files are the standard. Read at least one before writing anything.

| Reference | Why it's the exemplar |
|---|---|
| `phase1/day01-html-foundations.md` | Momentum + a Day-1 shippable build; every tag and attribute explained. |
| `phase1/day02-html-forms-inputs-tables.md` | Exhaustive coverage — every input type, attribute, and validation rule. |
| `phase2/day13-js-runtimes-mental-model.md` | The gold standard for *flow*: mental model ("JS is a guest, the runtime is the house") before syntax; every primitive and gotcha explained with its **why**. |
| `phase2/day14-functions-and-scope.md` | Teaches a genuinely hard idea (closures) from first principles with escalating examples until it clicks. |
| `phase2/day15-control-flow.md` | Names the exact traps (0 is falsy, `[]` is truthy, `==` coercion) and explains *why they exist*, not just that they do. |
| **`phase4/day37-useeffect-error-boundaries.md`** | **The current standard.** Failure-first throughout: the tab title drifts from the count, and every rule afterwards arrives as the fix for something the reader watched break. |
| **`phase4/day39-context-reducer.md`** | Prop drilling shown as four real components rather than a diagram, and reducers motivated by a working `useState` cart that already contains a bug. |
| **`phase4/day50-frontend-system-design.md`** | One running example carried through eight steps, so an assumption made in Step 1 visibly decides a choice in Step 6. |
| `phase4/day33`–`day51` | The React sequence as a whole: prerequisite-safe ordering, causal explanations, no premature APIs, short recall practice, distributed practice days, production judgment. |

If a new lecture does not feel like these, it is not finished.

**Read Day 37 before writing any new lecture.** It is the clearest worked example of the method in [`teaching-method.md`](teaching-method.md): the opener is 21 lines and names none of the day's three tools, the render/commit explanation runs 120 lines because the compressed version was unreadable, and every trap is shown producing its wrong output before the rule is stated.

---

## The one rule that governs everything: explain, never merely mention

The failure mode we are permanently fixing: lectures that *name* a concept and move on. "Use `===` for equality." "`typeof null` is `"object"`." "Arrays are truthy." A learner who reads that still has to go elsewhere to understand it.

Every WebD lecture must instead do this for **each property, method, attribute, operator, and behavior it introduces**:

1. **What it is** — in one plain sentence.
2. **Why it exists / why it behaves this way** — the mechanism or history behind it. `typeof null === "object"` is a 1995 bug that can't be fixed; `0.1 + 0.2` is binary floating point; `const` locks the binding not the contents. The *why* is what makes it stick.
3. **A tiny example**, then a **realistic example**, then where it shows up in **real products**.
4. **The trap**, named precisely — the specific way beginners misuse it, and the fix.

If you introduce a method (`.slice`, `.map`, `.reduce`), show it working, show its edge case, and show it in a real transformation — never a bare one-liner with no context. If you introduce an attribute, explain what each value does and when you'd reach for it. Assume the learner will otherwise have to look it up, and make that unnecessary.

> Test for every paragraph: *"Could a motivated beginner now use this without opening another tab?"* If not, the paragraph isn't done.

---

## Flow: the lecture is a staircase, not a bag of notes

The thing that made the reference lectures land was **flow** — each section unlocks the next, so the learner never asks "why are we talking about this now?"

The realized arc (follow it unless the topic genuinely demands otherwise):

1. **Why this day exists** — **the shortest screen in the lecture.** ~10–20 lines, one idea, in vocabulary the learner already has. Its only job is to make them want screen 2. **No** term the lecture has not taught yet, **no** "by the end you'll be able to…" list, no prerequisites paragraph, no description of how the lecture is structured, at most one code block. The motivating failure goes on screens 2–3, where it has room to be *shown*. See Rule 1b in [`teaching-method.md`](teaching-method.md).
2. **The mental model** — a single clarifying picture (a metaphor, an ASCII diagram, a table) *before any syntax*. This is the most important screen; spend real effort here.
3. **Core mechanics / syntax** — introduced one idea at a time, each fully explained per the rule above.
4. **Decision rules** — when to use which; the judgment a senior has that a beginner lacks.
5. **Real patterns** — how this appears in actual products, not toy snippets.
6. **Hands-on build** — a small real thing that proves the day's promise, with at least one point where the learner must make a real decision. *Omitted for React Phase 4 concept lectures, which move builds into dedicated practice-set days — see the practice-separation section below.*
7. **Common mistakes** — a table of mistake / why it hurts / the better move. Each row names a **specific** failure and its cause, not a vague warning.
8. **Practice** — **5 numbered reps**, ~15 minutes, ladder-ordered (recall → mechanics → a realistic task), with at least one that asks the learner to *predict before running*. See the Practice standard below; the older "≥30 reps in 4 tiers" target applies only to legacy DAML-style notes, not to deck lectures.
9. **Cheat sheet** — a plain-text quick reference. Write it as the page the learner would keep open while working: grouped by decision, with the traps inline (`❌ …` / `✅ …`), not as a list of signatures.
10. **Tomorrow** — one paragraph connecting today to the next day. Name the next day's **problem**, not its API list — it is the same failure-first rule applied to the handoff.
11. **Final quiz** — exactly 10 questions.

Sections 6–10 are also **structural**: the deck reads those heading names to split the lecture into chapters (Lecture → Practice/Review → Wrap-up → Quiz) for its progress rail and counter. Name them from the vocabulary in [`guidelines/deck-chapters.md`](deck-chapters.md), and put the first practice/review heading exactly where the teaching stops.

Flow rules that made it work:

- Examples get bigger **only after** the underlying rule is clear. Tiny runnable example → plain-language explanation → realistic version → real-product pattern.
- Reinforce a repeated concept from a **slightly different angle** rather than copy-pasting a restatement. (Day 15 re-used the Day-13 "label and box" model to explain reference equality — that callback is why it clicked.)
- Each `---` screen should earn its place. If a screen doesn't teach the rule, the exception, the pattern, or the failure mode, cut it.
- Call back to earlier days by name when it strengthens memory. The course is cumulative, not episodic.

---

## Markdown contract (technical — the renderer depends on this)

WebD lectures are deep markdown files rendered as a Typeform-style fullscreen deck by `src/components/LectureDeck.tsx`.

- Path: `public/data/lectures/webd/<phaseN>/dayNN-kebab-slug.md`
- Loaded by `src/app/webd/notes/[slug]/page.tsx` (file-based — slug is derived from the filename, title from the `# Day N:` heading, duration from the `**Duration: …**` line) → `NoteContent` → `LectureDeck` with `variant="webd"`.
- Write **only** `.md`. The old standalone `.html` lectures are retired; do not create new ones.

The renderer splits the file into screens on `---` lines, and extracts fenced ` ```quiz ` and ` ```finalquiz ` blocks into dedicated screens.

### Hard rules

These are the default for concept lectures. The three-screen React practice-set exception is defined under **React Phase 4 practice separation** below.

- First line must be `# Day N: Title`.
- Second non-empty line must be `**Duration: X hours | Focus: one-line promise**`.
- Screens are separated by `---` on its own line.
- Mid-lesson quick checks use ` ```quiz ` fences (JSON: `prompt`, `options[]` with `text`/`correct`, `explanation`). Include **3–7**, spread through the lecture, each targeting a *non-obvious* idea. Keep option text under ~120 chars.
- The lecture ends with exactly **one** ` ```finalquiz ` fence. All questions are **multiple-choice only** — never short-answer or code-to-write. It contains:
  - `title`: short string.
  - `questions`: an array of **exactly 10** items with ids `q1`…`q10`.
  - Each question:
    - `type`: `"single_correct"` (exactly one correct option) or `"multiple_correct"` (two or more). Use a healthy mix.
    - `prompt`: the question in Markdown (inline code / fenced code allowed). Put larger code in `codeSnippet` (string) or `null`.
    - `options`: exactly **4** objects `{ "id": "a", "text": "…" }` with ids `a`,`b`,`c`,`d`. Options may contain code.
    - `correctOptionIds`: array of the correct option ids (one for single, two+ for multiple).
    - `explanation`: the walkthrough shown after grading — why the right answer is right and why the tempting distractors are wrong.
    - `example`: one short, sticky example that aids recall.
  - Questions must test real understanding (read code, predict output, spot the bug, choose the right approach, catch a gotcha) — not shallow trivia. Distractors are the actual mistakes a learner makes. Grading is automatic (client-side); there is no LLM grade route.
- All JSON inside fenced blocks must be valid and parseable — double quotes, escaped inner quotes/backticks. **Always run `npm run validate:quizzes`** before considering the file done; a single malformed block breaks the deck. The validator checks JSON and quiz structure, not authored answer-position balance—the renderer randomizes displayed option order. Still choose correct option IDs without systematic bias when authoring.

### Deck chapters (section names are load-bearing)

The deck groups screens into chapters — **Lecture → Practice or Review → Wrap-up → Quiz** — by reading the first `##` of each screen, and renders them as a segmented progress rail, a chapter-relative counter, and a card on the boundary screen ("That was the lecture — practice starts here").

- The boundary is the first heading matching a practice opener (`Hands-on…`, `Practice…`, `Task 1 …`, `Your turn…`, `Exercise…`) at any position, or a review opener (`Common mistakes…`, `Debugging…`, `Interview…`, `Check your understanding…`) in the back half.
- Keep `Cheat sheet` → `Tomorrow` contiguous at the end; that run becomes the Wrap-up chapter.
- Never use those words to head a *teaching* screen (`## Hands-on with the event object`) — it cuts the lecture early and mislabels everything after it.

Full vocabulary and rules: [`guidelines/deck-chapters.md`](deck-chapters.md).

> **Code inside quiz JSON:** any code longer than one line — in `prompt`, `option.text`, `explanation`, or `example` — **must** be inside a language-tagged fence written with `\n` escapes, and the quiz block's own closing fence must be a bare ` ``` `. Unfenced multi-line code gets reflowed into one unreadable line; an untagged inner fence truncates the JSON and spills raw payload onto a screen. Full contract: [`guidelines/quiz-blocks.md`](quiz-blocks.md).

---

## Depth bar

WebD lectures are mastery-depth, not survey-depth. Each lecture must:

- Cover **every** essential topic named in the day's title and syllabus `topics[]` — never cut a syllabus item; add or reorder only.
- Explain the *why* before the mechanics, and every property/method/attribute per the one rule above.
- Include a mental-model screen with a metaphor, diagram, or table.
- Include at least one "what the runtime/browser is actually doing" explanation.
- Include a hands-on build with a real decision point, and a common-mistakes table, except where a phase explicitly separates builds into dedicated practice-set lectures.
- Include a cheat sheet and a `Tomorrow` continuity paragraph.
- Length: roughly **1000–1600 lines** for a 4-hour lecture, and more when the topic earns it. Day 13–15 run ~900–1050; the rewritten Phase 4 concept lectures run 1000–2500, and Day 37 is the longest because Effects have the most failure modes to show. Longer is right whenever the extra length is *derivation* — a motivating failure, a value trace, an unpacked mechanism. Longer is wrong when it is a list of things the API can do.

> **Length is an output, not a target.** Apply the rules in [`teaching-method.md`](teaching-method.md) and the line count follows. If a lecture is short, the usual cause is asserted conclusions rather than missing topics — check for rules with no failure above them before adding material.

### Depth by topic type

- **Syntax/language (JS fundamentals, HTML, CSS basics):** mental model, syntax patterns, edge cases, beginner misconceptions, one "what the engine actually does."
- **Layout/styling/UI (Flexbox, Grid, Tailwind, animation):** visual decision rules, responsive behavior, state behavior, DevTools debugging, one section on taste/judgment.
- **State/logic/JS (arrays, DOM, events, async, React state):** execution model, how state changes over time, ordering/timing, bugs from mutation/stale values/async, tiny example first then real app example.
- **Backend/API/data flow (HTTP, Express, auth, DB):** request/response mental model, error cases, validation/security hygiene, how frontend vs backend responsibilities differ, one step-by-step walkthrough.

---

## Practice standard

Inside a concept lecture, keep the practice section **short and high-signal** — 5 numbered reps, ~15 minutes total, matching the reference lectures (`day13`–`day15` each carry exactly five). This is a tight refresher, not a problem set. A dedicated React practice-set lecture follows its separate three-app contract below.

- Every rep is specific enough to act on immediately. Never "play around with X."
- Reps must be typed and run — say so in the lead-in line.
- Include at least one rep that asks the learner to **predict the result before running it**.
- Ladder within the five: recall → mechanics → a realistic small task.

---

## Common mistakes standard

Every lecture includes a `Common mistakes` table with three columns: the mistake · why it hurts · the better move. Name realistic, specific failure modes (the falsy-`0` bug, forgetting `break`, mutating an argument, `==` coercion) — not vague warnings.

---

## Tone

Calm, direct, slightly opinionated when it helps, rigorous without being academic. Respect the learner's intelligence and time. Avoid hype, motivational filler, passive textbook voice, and cleverness that hides the point. Encourage through clarity, not cheerleading.

---

## Build-day rules

- The build must exercise the day's core skill and be a natural consequence of the lesson, not a tacked-on assignment.
- Concrete enough to guide, open enough that the learner isn't just transcribing; include at least one real decision.
- Project/clone days include a reflection or comparison framework.
- Day 1 of every phase must end with a **deployable, hands-on mini-build** shipped before the learner closes the laptop. No theory-only first days.

### React Phase 4 practice separation

- Treat the rewritten Day 33–51 sequence as the Phase 4 quality baseline. Preserve its prerequisite order: an example may use earlier course knowledge, but it must not casually depend on a Hook, library, or pattern taught on a future day. If a future term is unavoidable, either teach it from zero at that point or replace the example.
- Answer the causal beginner question before expanding the API. For state, that means showing exactly why a local `let` resets on render, why changing it does not request another render, what React remembers, and why the setter exists. Apply the same standard to Effects, Context, routing, forms, server state, performance, Redux, testing, and system design: failure first → runtime mental model → smallest correct example → realistic pattern → decision rule → named trap.
- React concept lectures do **not** contain hands-on build, mini-build, or project slides. With no build section, the deck's boundary falls on `## Common mistakes` and the chapter is labelled **Review** — that is the intended shape for these lectures, so keep that heading exactly where the teaching stops. They still include five short typed recall reps; learner-facing apps belong in dedicated practice-set lectures.
- Dedicated practice sets are Days 36, 40, 44, and 48. Each contains exactly three small apps, each designed for a maximum of 30 minutes. Keep the entire lecture to three app screens separated by two `---` lines; requirements, hints, and the done condition stay on the same screen as their app. Do not add a framing, recap, solution, or project slide.
- Practice-set lectures are intentionally exempt from the concept-lecture duration/focus line, 700–1000-line depth target, 3–7 quick checks, common-mistakes table, five-rep ladder, and final quiz. Their second non-empty line states the three-app and 30-minute contract, and they contain no `quiz` or `finalquiz` blocks.
- The Phase 4 day-one build exception is retired while this distributed-practice structure is in use. Do not re-add a Day 33 project slide.

---

## Visual & typography reference (LectureDeck)

Author for the deck's wide content column:

- Body `text-[16px] md:text-[17px]`, line-height 1.75; sentences wrap ~60–80 chars on desktop.
- `h1` 4xl–5xl, `h2` 2xl–3xl (start each major screen with an `h2`), `h3` xl, `h4` uppercase eyebrow.
- Tables render at `~14.5px` in a rounded card — prefer tables for comparisons (A vs B, symptom vs fix, gotchas).
- Blockquotes render as a left-accent callout — use sparingly, for THE key rule on a screen.
- Code blocks `~13.5px`, full width. Keep each block 15–40 lines; break larger examples into successive blocks with short prose between them.
- Quiz option text ~15.5px — keep under ~120 chars so it stays 1–2 lines.

---

## Routing & file notes

- `src/app/webd/notes/[slug]/page.tsx` scans the phase folders; only `.md` is used. Slug = filename without extension; title = `# Day N:` heading; duration parsed from the `**Duration: … hours**` line. Adding a well-named `.md` file is all that's needed to publish it — no manifest to update for the note route itself.
- `LectureDeck` autofocuses and supports arrow / space / PageUp / PageDown / Home / End, with ESC×2 to exit. Arrows keep navigating on the final-quiz screen; only Space is yielded there, so it can activate the focused option button.
- The keyboard handler ignores INPUT / TEXTAREA / contentEditable / `.cm-editor` targets so typing never navigates screens.
- The final quiz (`LectureFinalQuiz`) is multiple-choice and grades **client-side** — there is no grade API route and no answer persistence. "Check answers" reveals per-question walkthroughs; "Do again" resets.

---

## Roadmap & syllabus data (keep in sync)

- `src/data/phases/webd/phaseN.ts` is the **source of truth** for what each day covers. Never cut topics; you may add or rearrange. If a lecture and the syllabus `topics[]` disagree, expand the lecture to honor every item, or enrich the syllabus to match the richer lecture — whichever adds depth.
- Human-readable syllabus markdown: `src/data/syllabus/webdroadmap/`. When you add or rename a lecture, keep phase data and syllabus markdown consistent in the same change.
- Keep day titles, durations, focus lines, lecture filenames, and visible app cards consistent across all of these.

---

## Validation (do this before calling a lecture done)

1. Confirm structure. For concept lectures: first line `# Day N:`, second line `**Duration: … | Focus: …**`, screens split on `---`, 3–7 `quiz` blocks, exactly one `finalquiz` with exactly 10 `q1`…`q10` multiple-choice questions (each 4 options, valid `correctOptionIds`, `explanation`, `example`). For React practice sets: exactly three app screens and no quiz blocks.
2. **Run `npm run validate:quizzes`** — it parses every quiz/finalquiz payload, checks the required shape, and flags malformed fences or unfenced multi-line code. It deliberately does not score answer-position spread because option order is randomized during rendering. Extract blocks by scanning for the opener and the next **bare** ` ``` `, never with a non-greedy regex.
3. Confirm code fences in the prose body are balanced (even count of ```` ``` ````).
4. **Run the teaching checks**, not only the structural ones — opener length, borrowed future APIs, corrupted inline code, and answer-key distribution. The exact commands are in **The authoring workflow** in [`teaching-method.md`](teaching-method.md); they take under a minute and catch what proofreading does not.
5. **Check the neighbouring days.** Grep Day N−1 and Day N+1 for this lecture's main topic and confirm they do not contradict it. Two consecutive lectures disagreeing is a bug of the same severity as broken code — see Rule 12.
6. Run `npm run build`; fix anything blocking.
7. Spot-check in the browser. For a concept lecture, open `/webd/notes/<slug>`, walk the deck with arrow keys, answer one quick check, and confirm the final quiz grades and is the last screen — not raw JSON. For a React practice set, confirm the contract line promises three apps at no more than 30 minutes each, the deck has exactly three screens with no quiz, and App 3 is the final screen.
8. Check chapter behavior by lecture type. A concept lecture's **Lecture** track must end where teaching ends, and its boundary card must land on the first practice/review screen. A three-screen React practice deck may show one flat Practice track with no boundary card because it starts directly at `## App 1`; that is valid. See [`guidelines/deck-chapters.md`](deck-chapters.md).

---

## Universal rules (from AGENTS.md)

- Protect user work — never revert unrelated dirty files or changes you didn't make.
- One lecture file per day; never combine a day range into one lecture.
- Stage only files relevant to the request; commit/push only when the user explicitly asks.
