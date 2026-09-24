# Go Authoring Guidelines

Read this file whenever you edit Go lectures, Go phase data, or Go syllabus docs.

> **Read [`guidelines/teaching-method.md`](teaching-method.md) first.** It is the cross-roadmap contract for *how to explain* — failure-first derivation, prerequisite-safe examples, unpacking instead of compressing, tracing concrete values. This file covers *what* to teach and *what shape* the file takes; that one decides whether the explanation actually lands.

> **Two checks that catch the most damage, from the Phase 4 WebD rewrite:**
>
> - **The neighbour check.** Before calling a lecture done, grep the day before and the day after for its main topic. Two consecutive lectures that disagree is a bug of the same severity as broken code — soften the overstated side into a threshold, and have the later day address the tension out loud. (Rule 12)
> - **The prerequisite check is a *reading*, not a grep.** Finding a term in an earlier day proves the string exists, not that it was taught. Open that day: if the term appears inside an example about something else, it is a gap, and the fix is a plain-language detour before the first real use. (Rule 2)
>
> The runnable structural checks — opener length, borrowed future APIs, corrupted inline code, answer-key distribution — are in **The authoring workflow** in [`teaching-method.md`](teaching-method.md).

Its one job: make every Go lecture as clear, deep, and *self-contained* as the WebD reference set. A learner should never have to open ChatGPT, Google a term, or ask "wait, but why?" — because the lecture already answered it, in flow, before they had to ask.

---

## The North Star: what "good" looks like

The standard is **not** the current Go lectures. It is the WebD reference set. Read at least one of these before writing a single line of Go content:

| Reference | Why it's the exemplar |
|---|---|
| `public/data/lectures/webd/phase2/day13-js-runtimes-mental-model.md` | The gold standard for *flow*: one mental model ("JS is a guest, the runtime is the house") before any syntax; every primitive and gotcha explained with its **why**. |
| `public/data/lectures/webd/phase2/day14-functions-and-scope.md` | Teaches a genuinely hard idea (closures) from first principles with escalating examples until it clicks. |
| `public/data/lectures/webd/phase2/day15-control-flow.md` | Names the exact traps (`0` is falsy, `[]` is truthy, `==` coercion) and explains *why they exist*, not just that they do. |

If a Go lecture does not feel like these, it is not finished. Length is a symptom, not the goal: those files run ~950–1150 lines because they *explain*, not because they pad.

---

## The one rule that governs everything: explain, never merely mention

The failure mode we are permanently fixing: lectures that *name* a thing and move on. "Use `:=` inside functions." "`defer` runs at the end." "A slice has a capacity." A learner who reads that still has to go elsewhere to actually understand it.

Every Go lecture must instead do this for **each keyword, type, function, operator, and behavior it introduces**:

1. **What it is** — one plain sentence.
2. **Why it exists / why it behaves this way** — the mechanism or the design decision behind it. Go has unusually good answers here, and they are what makes the rule stick:
   - `:=` exists so declaration is visually distinct from assignment, which makes shadowing bugs *visible in a diff*.
   - Zero values exist so no Go value is ever uninitialized garbage — which is why `var buf bytes.Buffer` is immediately usable.
   - `defer` is LIFO because cleanup must unwind in the reverse order of acquisition, the same way nested locks and files must be released.
   - `switch` has no implicit fallthrough because C's implicit fallthrough caused more bugs than it ever saved keystrokes.
   - Unused variables and imports are *compile errors*, not warnings, because Go decided a codebase with no dead weight is worth a little friction.
3. **A tiny runnable example**, then a **realistic one**, then where it shows up in **real Go services**.
4. **The trap**, named precisely — the specific way beginners misuse it, and the fix.

If you introduce a standard-library function (`strings.Builder`, `strconv.Atoi`, `errors.Is`), show it working, show its edge case, and show it in a real transformation — never a bare one-liner with no context.

> Test for every paragraph: *"Could a motivated beginner now use this without opening another tab?"* If not, the paragraph isn't done.

### Never lean on a concept that hasn't been taught yet

This is the rule Go lectures break most often, because Go's pieces are so interconnected. **A lecture may only use what earlier days have already taught.**

- Day 3 (control flow) must not explain `for` using a slice `range` before slices exist (Day 6) — use an integer loop, or teach the minimum needed inline and say so.
- Do not use goroutines, interfaces, structs, methods, generics, or `error` values in an example before their day, unless the lecture explicitly teaches the piece it needs first, from scratch.
- If you genuinely need a forward concept, introduce it in one sentence at a level the learner can hold ("`error` is just a value that is either `nil` or a description of what went wrong; Day 14 goes deep"), then move on. Never drop an unexplained term and hope.
- Check the day's position in `src/data/phases/go/index.ts` before writing. Everything after it is off-limits as an assumed prerequisite.

---

## Flow: the lecture is a staircase, not a bag of notes

Each section must unlock the next, so the learner never asks "why are we talking about this now?"

The arc (follow it unless the topic genuinely demands otherwise):

1. **Why this day exists** — **the shortest screen in the lecture.** ~10–20 lines, one idea, in vocabulary the learner already has. Connect to yesterday — what they can already do, and what it still can't express — and stop there. **No** term the lecture has not taught yet, **no** "by the end you'll be able to…" list, no prerequisites paragraph, no description of how the lecture is structured, at most one code block. The motivating failure goes on screens 2–3, where it has room to be *shown*. See Rule 1b in [`teaching-method.md`](teaching-method.md).
2. **The mental model** — a single clarifying picture (a metaphor, an ASCII diagram, a table) *before any syntax*. This is the most important screen; spend real effort here. Day 2's "labelled box" is the right shape.
3. **Core mechanics** — one idea per screen, each fully explained per the rule above.
4. **Decision rules** — when to use which; the judgment a Go reviewer has that a beginner lacks (value vs pointer receiver, sentinel vs typed error, `for` form to reach for).
5. **What the compiler / runtime is actually doing** — at least one section per lecture. Go rewards this: escape analysis, slice headers, method sets, the scheduler, `defer` records.
6. **Real patterns** — how this appears in actual Go services, not toy snippets.
7. **Common mistakes** — a table of mistake / why it hurts / the better move.
8. **Practice** — a short, high-signal section (see below).
9. **Cheat sheet** — a plain-text quick reference.
10. **Final quiz** — exactly 10 questions.

Sections 7–9 are also **structural**: the deck reads those heading names to split the lecture into chapters (Lecture → Practice/Review → Wrap-up → Quiz) for its progress rail and counter. Spell them `## Common mistakes`, `## Practice`, `## Cheat sheet`, keep the reference tail contiguous at the end, and never use those words to head a teaching screen. Full rules: [`guidelines/deck-chapters.md`](deck-chapters.md).

Flow rules:

- Examples get bigger **only after** the underlying rule is clear. Tiny runnable example → plain-language explanation → realistic version → real-service pattern.
- Reinforce a repeated concept from a **slightly different angle** rather than restating it. Callbacks to earlier days by name ("the labelled box from Day 2") are why things stick.
- Every `---` screen must earn its place. If a screen doesn't teach the rule, the exception, the pattern, or the failure mode, cut it.
- Every code block must compile as written, or be explicitly marked as a fragment. Include the `package main` / `import` scaffolding the first time it matters in a lecture, then it's fair to show fragments.

---

## Markdown contract (technical — the renderer depends on this)

Go lectures are markdown files rendered as a fullscreen deck by `src/components/LectureDeck.tsx`.

- Path: `public/data/lectures/go/<phaseN>/dayNN-kebab-slug.md`
- Loaded by `src/app/go/notes/[slug]/page.tsx` (file-based — slug from the filename, title from the `# Day N:` heading, duration from the `**Duration: …**` line) → `NoteContent` → `LectureDeck` with `variant="go"`.
- Write **only** `.md`.

The renderer splits the file into screens on `---` lines and extracts fenced ` ```quiz ` and ` ```finalquiz ` blocks into dedicated screens.

### Hard rules

- First line must be `# Day N: Title`.
- Second non-empty line must be `**Duration: X hours | Focus: one-line promise**`.
- Screens are separated by `---` on its own line.
- Mid-lesson quick checks use ` ```quiz ` fences (JSON: `prompt`, `options[]` with `text`/`correct`, `explanation`). Include **3–7**, spread through the lecture, each targeting a *non-obvious* idea.
- The lecture ends with exactly **one** ` ```finalquiz ` fence containing exactly 10 multiple-choice questions.

### Code inside quiz JSON (this has broken the deck before — follow it exactly)

Quiz `prompt`, `option.text`, `explanation`, and `example` are all rendered as Markdown. That means:

- **Any code longer than one line MUST be inside a fenced block within the JSON string**, written as `\n` escapes:
  `"prompt": "What does this code print?\n\n` + "```" + `go\nvar count int\nfmt.Println(count)\n` + "```" + `"`
  Without the fence, Markdown reflows the lines into one paragraph and the learner sees `var count int fmt.Println(count)` — unreadable, and the exact bug this rule exists to prevent.
- The same applies to **option text**. A multi-line option must be fenced. Program *output* options (`"0\n12"`) use a ` ```text ` fence.
- Single identifiers and expressions inside prose use inline backticks: `` "`:=` declares and initializes" ``.
- The **closing fence of the quiz block must be a bare ` ``` ` on its own line**, and every fence *inside* the JSON must carry a language tag (```` ```go ````, ```` ```text ````). The parser closes the block at the first bare fence; an untagged inner fence would truncate the JSON and spill raw payload onto a screen.
- `codeSnippet` is an alternative for a single large snippet shown under the prompt. It is rendered as plain preformatted text (no Markdown, no highlighting). Prefer a fenced block in `prompt`; use `codeSnippet` only when the code is the whole question.

### Final-quiz shape

- `title`: short string.
- `questions`: exactly **10** items, ids `q1`…`q10`.
- Each question:
  - `type`: `"single_correct"` (exactly one correct) or `"multiple_correct"` (two or more). Use a healthy mix.
  - `prompt`: Markdown, per the code rules above.
  - `options`: exactly **4** objects `{ "id": "a", "text": "…" }` with ids `a`–`d`.
  - `correctOptionIds`: array of correct ids.
  - `explanation`: the walkthrough shown after grading — why the right answer is right *and* why each tempting distractor is wrong.
  - `example`: one short, sticky example that aids recall.
- Questions test real understanding — read code, predict output, spot the bug, choose the right approach, catch a Go-specific gotcha (shadowing, `defer` argument evaluation time, integer division, loop-variable capture, nil maps). Not trivia. Distractors must be the actual mistakes a learner makes.
- Grading is client-side; there is no LLM grade route.
- All JSON must be valid and parseable. **Always validate** (see Validation) before calling the file done.

---

## Depth bar

Go lectures are mastery-depth, not survey-depth. Each lecture must:

- Cover **every** area named in the day's `areas[]` in `src/data/phases/go/index.ts` — never cut one; add or reorder only.
- Explain the *why* before the mechanics, and every keyword/function per the one rule above.
- Include a mental-model screen with a metaphor, diagram, or table.
- Include at least one "what the compiler or runtime is actually doing" explanation.
- Include a common-mistakes table.
- Include a cheat sheet.
- Length: roughly 900–1200 lines for a 4-hour lecture. Longer is fine when the extra length is *teaching*, not padding.

### Go-specific depth requirements

These are the places Go lectures go shallow. Each must be taught explicitly on the day it first appears:

- **Value semantics.** What is copied vs shared on every assignment and function call. This is the single biggest source of Go beginner bugs and deserves repeated, angled reinforcement.
- **Zero values.** Not "it defaults to 0" but *why* it makes the type usable and what a well-designed zero value buys an API.
- **The error convention.** Errors are ordinary values returned alongside results; the `if err != nil` shape is a deliberate trade, and the learner should know what Go bought with it.
- **The compiler's opinions.** Unused variables and imports are errors; `gofmt` is not configurable; exported means capitalized. Explain each as a design decision, not a quirk to endure.
- **Naming and idiom.** Short receiver names, no `Get` prefixes, package name as part of the identifier (`http.Client`, not `http.HTTPClient`). Teach idiom as you go, not in a style appendix.

---

## Practice standard

Keep the practice section **short and high-signal** — 5 numbered reps, ~15 minutes total, matching the current reference lectures. This is a tight refresher, not a problem set.

- Every rep is specific enough to act on immediately. Never "play around with X."
- Reps must be written as real `.go` files and run — say so in the lead-in line.
- Include at least one rep that asks the learner to **predict output before running**, and at least one that has them deliberately trigger a compiler error and read it.
- Ladder within the five: recall → mechanics → a realistic small task.

---

## Common mistakes standard

Every lecture includes a `Common mistakes` table with three columns: the mistake · why it hurts · the better move. Name realistic, specific Go failure modes — shadowing with `:=` in an inner scope, `defer` inside a loop, taking the address of a loop variable, comparing a non-nil-typed error to `nil`, integer division truncating, forgetting `%w` when wrapping. Not vague warnings.

---

## Tone

Calm, direct, slightly opinionated when it helps, rigorous without being academic. Respect the learner's intelligence and time. Avoid hype, motivational filler, and cleverness that hides the point. Never write "Welcome", "In this lecture", "obviously", "simply", or "just".

---

## Visual & typography reference (LectureDeck)

- Body `text-[16px] md:text-[17px]`, line-height 1.75.
- Start each major screen with an `h2`. Tables render at `~14.5px` in a rounded card — prefer tables for comparisons and gotchas.
- Blockquotes render as a left-accent callout — use sparingly, for THE key rule on a screen.
- Code blocks `~13.5px`, full width. Keep each block 15–40 lines; break larger examples into successive blocks with short prose between them.
- Quiz option text ~15px. Keep prose options under ~120 chars; fenced code options should stay under ~10 lines.

---

## Roadmap & syllabus data (keep in sync)

- `src/data/phases/go/index.ts` is the **source of truth** for what each day covers (`title` + four `areas`). Never cut areas; you may add or rearrange.
- Human-readable syllabus markdown: `src/data/syllabus/goroadmap/`.
- Keep day titles, durations, focus lines, lecture filenames, and visible app cards consistent across all of these.

---

## Validation (do this before calling a lecture done)

1. Confirm structure: first line `# Day N:`, second line `**Duration: … | Focus: …**`, screens split on `---`, 3–7 `quiz` blocks, exactly one `finalquiz` with exactly 10 `q1`…`q10` questions (each 4 options, valid `correctOptionIds`, `explanation`, `example`).
2. **Parse every fenced JSON block.** A Node `JSON.parse` loop over the extracted blocks catches the one broken quote that would blank a screen. Extract blocks by scanning for a ` ```quiz `/` ```finalquiz ` opener and the next **bare** ` ``` ` — never with a non-greedy regex, which stops at the first fence inside the JSON.
3. Confirm every multi-line code string in the quiz JSON is fenced with a language tag.
4. Confirm code fences in the prose body are balanced.
5. Verify every Go snippet compiles (or is a clearly-marked fragment), and that no example uses a concept from a later day.
6. Run `npm run build`; fix anything blocking.
7. Spot-check in the browser: open `/go/notes/<slug>`, walk the deck with arrow keys, answer one quick check, and confirm the final quiz grades and its last screen is the quiz — not raw JSON.
8. Read the chapter rail under the top bar: the **Lecture** track must end where the teaching ends, and the boundary card must land on the first practice/review screen. A flat bar instead of a rail means no section heading matched — see [`guidelines/deck-chapters.md`](deck-chapters.md).

---

## Universal rules (from AGENTS.md)

- Protect user work — never revert unrelated dirty files or changes you didn't make.
- One lecture file per day; never combine a day range into one lecture.
- Stage only files relevant to the request; commit/push only when the user explicitly asks.
