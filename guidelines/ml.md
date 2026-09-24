# ML / DL / GenAI Authoring Guidelines

Read this file whenever you edit the ML roadmap, ML lectures, NLP/LLM/RAG/agent content, or ML syllabus docs.

Lectures are generated on demand in batches of three. Follow
[lecture generation prompt](lecture-generation.md), retain a factual
batch handoff, and use the entry/review/gate rules in
[`../src/data/syllabus/mlroadmap/01-Study-System.md`](../src/data/syllabus/mlroadmap/01-Study-System.md).
Research rationale: [ML research report](../docs/research/ml-research.md).

> **Read [`guidelines/teaching-method.md`](teaching-method.md) first.** It is the cross-roadmap contract for *how to explain* — failure-first derivation, prerequisite-safe examples, unpacking instead of compressing, tracing concrete values. This file covers *what* to teach and *what shape* the file takes; that one decides whether the explanation actually lands.

> **Two checks that catch the most damage, from the Phase 4 WebD rewrite:**
>
> - **The neighbour check.** Before calling a lecture done, grep the day before and the day after for its main topic. Two consecutive lectures that disagree is a bug of the same severity as broken code — soften the overstated side into a threshold, and have the later day address the tension out loud. (Rule 12)
> - **The prerequisite check is a *reading*, not a grep.** Finding a term in an earlier day proves the string exists, not that it was taught. Open that day: if the term appears inside an example about something else, it is a gap, and the fix is a plain-language detour before the first real use. (Rule 2)
>
> The runnable structural checks — opener length, borrowed future APIs, corrupted inline code, answer-key distribution — are in **The authoring workflow** in [`teaching-method.md`](teaching-method.md).

Its one job: make every ML lecture as clear, deep, and *self-contained* as the WebD reference set. A learner should never have to open ChatGPT, Google a term, or ask "wait, but why?" — because the lecture already answered it, in flow, before they had to ask.

---

## The North Star: what "good" looks like

The standard is **not** the current ML lectures. It is the WebD reference set. Read at least one of these before writing a single line of ML content:

| Reference | Why it's the exemplar |
|---|---|
| `public/data/lectures/webd/phase2/day13-js-runtimes-mental-model.md` | The gold standard for *flow*: one mental model before any syntax; every primitive and gotcha explained with its **why**. |
| `public/data/lectures/webd/phase2/day14-functions-and-scope.md` | Teaches a genuinely hard idea (closures) from first principles with escalating examples until it clicks. |
| `public/data/lectures/webd/phase2/day15-control-flow.md` | Names the exact traps and explains *why they exist*, not just that they do. |

If an ML lecture does not feel like these, it is not finished. Those files run ~950–1150 lines because they *explain*, not because they pad.

---

## The one rule that governs everything: explain, never merely mention

The failure mode we are permanently fixing: lectures that *name* a concept and move on. "We use cross-entropy loss." "Standardize your features." "Attention lets tokens look at each other." A learner who reads that still has to go elsewhere to actually understand it.

Every ML lecture must instead do this for **each concept, formula, hyperparameter, and API argument it introduces**:

1. **What it is** — one plain sentence a non-engineer could repeat.
2. **Why it exists / why it behaves this way** — the mechanism behind it, not the name of it:
   - Cross-entropy, not "the standard classification loss," but: it is the negative log of the probability you assigned to the true label, so being confidently wrong is punished without bound — which is *why* it trains better than accuracy.
   - Standardization matters because gradient descent takes one shared step size across all dimensions, so a feature measured in rupees and one measured in years produce wildly different gradient magnitudes.
   - Train/test split exists because a model that memorizes scores perfectly on data it has seen, which measures nothing.
3. **A tiny worked example by hand** — three or four rows computed in the text — then the **NumPy/PyTorch version**, then where it shows up in a **real system**.
4. **The trap**, named precisely — the specific way beginners get it wrong, and the fix. Leakage, evaluating on train, forgetting to fit the scaler on train only, shape mismatches, unnormalized logits.

If you introduce an API argument (`random_state`, `stratify`, `class_weight`, `temperature`, `top_k`), explain what it does, when you'd change it, and what breaks if you leave it at the default.

> Test for every paragraph: *"Could a motivated learner now use this without opening another tab?"* If not, the paragraph isn't done.

### Never lean on a concept that hasn't been taught yet

- Do not use a metric before the learner has trained a model whose mistakes that metric measures.
- Do not use gradients, regularization, embeddings, or attention in an example before their day, unless the lecture teaches the needed piece first, from scratch.
- A one-line name-drop is not prerequisite teaching. If an example needs a future concept, replace the example or teach the needed mechanism with a self-contained tiny worked example before use. Naming a future topic for motivation does not license using it.
- Check the day's position in `src/data/phases/ml/` before writing. Everything after it is off-limits as an assumed prerequisite.

Assume no ML knowledge. The entry bridge establishes Python, array/table manipulation,
basic plots and elementary statistics; do not require the entire analytics course.
Check the learner-facing readiness tasks and repair gaps with relevant DAML material.
Derive required linear algebra and calculus when introduced; a one-line refresher is
enough only for a mechanism that was actually taught earlier and can be recalled.

---

## Flow: the lecture is a staircase, not a bag of notes

Each section must unlock the next, so the learner never asks "why are we talking about this now?"

The arc (follow it unless the topic genuinely demands otherwise):

1. **Why this day exists** — **the shortest screen in the lecture.** ~10–20 lines, one idea, in vocabulary the learner already has. Its only job is to make them want screen 2. **No** term the lecture has not taught yet, **no** "by the end you'll be able to…" list, no prerequisites paragraph, no description of how the lecture is structured, at most one code block. The motivating failure goes on screens 2–3, where it has room to be *shown*. See Rule 1b in [`teaching-method.md`](teaching-method.md).
2. **The one-sentence definition** — the central idea, written so a non-engineer could repeat it.
3. **The mental model** — a story, a 2-D picture, or an ASCII diagram *before any math*. This is the most important screen; spend real effort here.
4. **Vocabulary table** (when new terms appear) — the word · plain English · an analogy to something the learner already knows (pandas, SQL, plotting).
5. **Math / mechanics** — derived, not asserted. Give the meaning and shape of every symbol. The current `DeckMarkdown` renderer supports GFM but not LaTeX math: use readable Unicode or fenced `text` equations with worked arithmetic, rather than exposing raw `$...$`/`$$...$$` syntax. Recheck renderer support before changing that convention.
6. **A worked numeric example by hand** — a tiny dataset computed in the text, before any code.
7. **NumPy / PyTorch implementation** — the minimum correct version, with shape comments and assertions.
8. **Library parity check** — the same problem with sklearn / PyTorch / HF; compare the numbers and explain any disagreement.
9. **Failure modes** — a table of symptom → likely cause → fix.
10. **Practice** — guided-to-independent tasks, feedback, retrieval and transfer (see below).
11. **Cheat sheet** — formulas, commands, patterns, one screen.
12. **Final quiz** — exactly 10 questions.

Sections 10–12 are also **structural**: the deck reads those heading names to split the lecture into chapters (Lecture → Practice/Review → Wrap-up → Quiz) for its progress rail and counter. `## Practice` opens the boundary and `## Cheat sheet` opens the reference tail, so keep both spelled that way and keep the tail contiguous. `Failure modes` is not a recognised opener — if that screen is where the teaching stops rather than a mid-lecture beat, head it `Common mistakes` instead. Full rules: [`guidelines/deck-chapters.md`](deck-chapters.md).

Flow rules:

- Examples get bigger **only after** the underlying rule is clear. Hand-computed example → plain-language explanation → NumPy → library → real system.
- Reinforce a repeated concept from a **slightly different angle** rather than restating it. Callbacks to earlier days by name are why things stick.
- Every `---` screen must earn its place. If a screen doesn't teach the rule, the exception, the pattern, or the failure mode, cut it.
- Never explain a formula only with words *or* only with symbols — always both.
- Never paste a giant code block without breaking it apart with prose.

---

## The Spiral Principle (motivation before machinery)

The course must be employment-grade, not just research-grade. A learner who studies six days of math before training a model loses faith long before the math pays off. So the curriculum spirals:

1. **Use a small tool with an understandable contract** — fit/predict/score on a real dataset. Explain every code line, input, output and argument; defer only internals that the syllabus will derive later. Include an honest split and baseline before reporting success.
2. **Notice it lied** — train/test, baselines, the failure they'd hit if they shipped today.
3. **Train another, and another** — by the end of week 1 the learner has trained three model types and shipped a notebook to GitHub.
4. **Open the hood** — only now teach the math, as an explanation of code the learner already ran.
5. **Rebuild from scratch** — re-implement the week-1 models, parity-check to four+ decimal places, delete the magic.
6. **Add discipline** — CV, calibration, audits, model cards. The learner already cares because they have something to protect.

Rules that follow:

- Keep the first ML model by Day 2 after the readiness bridge. Later phases should produce an early small artifact appropriate to their prerequisites; do not force training a model before teaching the mechanism that makes the task safe to attempt.
- A learner must train a real model **before** seeing a derivative.
- Connect math/internals to a specific earlier operation accurately. Do not claim all estimators use gradient descent or that a scratch pedagogical algorithm is the exact library implementation.
- Failure modes for a tool are taught the day the tool is introduced (one-line teasers), then re-taught in depth later.

---

## Markdown contract (technical — the renderer depends on this)

ML lectures are markdown files rendered as a fullscreen deck by `src/components/LectureDeck.tsx`.

- Path: `public/data/lectures/ml/<phaseN>/dayNN-kebab-slug.md`
- Loaded by `src/app/ml/notes/[slug]/page.tsx` → `NoteContent` → `LectureDeck` with `variant="ml"`.
- One file per day. Day numbers must match `src/data/phases/ml/`.

The renderer splits the file into screens on `---` lines and extracts fenced ` ```quiz ` and ` ```finalquiz ` blocks into dedicated screens.

### Hard rules

- First line must be `# Day N: Title`.
- Second non-empty line must be `**Duration: X hours | Focus: one-line promise**`.
- Screens are separated by `---` on its own line.
- Mid-lesson quick checks use ` ```quiz ` fences (JSON: `prompt`, `options[]` with `text`/`correct`, `explanation`). Include **4–7**, one after each major concept beat, each targeting a *non-obvious* misconception rather than a definition lookup.
- The lecture ends with exactly **one** ` ```finalquiz ` fence containing exactly 10 multiple-choice questions.

### Code inside quiz JSON (this has broken the deck before — follow it exactly)

Quiz `prompt`, `option.text`, `explanation`, and `example` are all rendered as Markdown. That means:

- **Any code longer than one line MUST be inside a fenced block within the JSON string**, written as `\n` escapes:
  `"prompt": "What does this print?\n\n` + "```" + `python\nX = np.zeros((3, 2))\nprint(X.shape)\n` + "```" + `"`
  Without the fence, Markdown reflows the lines into one paragraph and the learner sees `X = np.zeros((3, 2)) print(X.shape)` — unreadable, and the exact bug this rule exists to prevent.
- The same applies to **option text**. A multi-line option must be fenced. Program *output* or shape options (`"(3, 2)\n(2, 3)"`) use a ` ```text ` fence.
- Single identifiers and expressions inside prose use inline backticks: `` "`random_state` fixes the shuffle" ``.
- The **closing fence of the quiz block must be a bare ` ``` ` on its own line**, and every fence *inside* the JSON must carry a language tag (```` ```python ````, ```` ```text ````). The parser closes the block at the first bare fence; an untagged inner fence would truncate the JSON and spill raw payload onto a screen.
- `codeSnippet` is an alternative for a single large snippet shown under the prompt. It renders as plain preformatted text (no Markdown, no highlighting). Prefer a fenced block in `prompt`.

### Final-quiz shape

- `title`: short string.
- `questions`: exactly **10** items, ids `q1`…`q10`.
- Each question:
  - `type`: `"single_correct"` or `"multiple_correct"` (two or more correct). Use a healthy mix.
  - `prompt`: Markdown, per the code rules above.
  - `options`: exactly **4** objects `{ "id": "a", "text": "…" }` with ids `a`–`d`.
  - `correctOptionIds`: array of correct ids.
  - `explanation`: the walkthrough shown after grading — why the right answer is right *and* why each tempting distractor is wrong.
  - `example`: one short, sticky example that aids recall.
- The 10 questions together cover the whole lecture, not just the last section. Many should show a snippet and ask the learner to predict output, pick the correct implementation, spot a leakage bug, or read a shape — reasoning, not import recall.
- Grading is client-side; there is no LLM grade route.
- All JSON must be valid and parseable. **Always validate** (see Validation) before calling the file done.

---

## Depth bar

Each ML lecture must:

- Cover **every** topic named in the day's entry in `src/data/phases/ml/` — never cut one; add or reorder only.
- Read like a patient mentor explaining the mental model before notation.
- Derive every important formula in plain prose, not just symbols, and give the shape of every symbol.
- Include a hand-computed numeric example before any code.
- Include at least one **scratch implementation** the learner can run, with shape comments and assertions, then a parity check against a library.
- Include at least one **failure-mode table** (symptom → diagnosis → fix).
- Include a cheat sheet.
- Length follows the explanation, not a line quota. Add depth through derivations, worked examples, counterexamples, debugging and evaluation. Keep one idea per screen and mark session stopping points when a unit needs more time.

---

## Practice, memory, pace and research standard

Five short reps can serve as a refresher, but they are not the entire practical work.
For a four-hour baseline unit allow about 20 minutes retrieval, 70 explanation/math,
100 implementation/experiments, 30 feedback and 20 reconstruction/planning. Breaks
are additional. Split a unit across sessions and extend advanced work as needed.

- Require a prediction, calculation or proposed explanation before feedback at each
  major concept beat. Put feedback on a later screen; model or partially complete
  an example when prerequisites are new, then fade help.
- Reps run in a notebook or `.py` file. Include a deliberate failure and its diagnosis,
  an independent artifact, and a changed condition that tests transfer.
- Retrieve two actual earlier prerequisites near the beginning after the short opener.
  End with at most two durable cues; review around 1/3/7/14/30 days after study as an
  adjustable default, with a 15–20-minute ordinary daily cap and a recovery route.
- Record coverage, assistance, delayed reconstruction and transfer separately. A
  quiz or notebook execution does not establish independent mastery.
- Expensive labs need an executable CPU/small-data route plus optional accelerated
  work. State which competence each demonstrates; a plan is not an executed lab.
- Compare implementations under matched settings and justified numeric tolerance,
  not arbitrary decimal-place equality or identical stochastic trajectories.
- Ask for two competing explanations and one discriminating experiment. Evaluate
  baseline, changed variable, held-out performance, uncertainty and limitations.
- Product case studies such as TypeSafe/Jev distinguish documented interfaces and
  vendor training claims from independently verified results. Never invent a private
  model architecture or imply that output types guarantee calibrated correctness.
- At phase gates require explanation, independent build, deliberate bug diagnosis
  and a delayed changed-task check. Repair the weak dependency before advancing.

---

## Formatting moves that pull weight

- **Tables** for vocabulary, comparisons, failure modes, when-to-use-which decisions, and shape contracts.
- **Block-quoted aphorisms** for the one or two sentences the reader should memorize ("Generalization is the only thing that matters.").
- **ASCII diagrams** for system pictures (training vs inference, pipelines, attention flow). They survive copy-paste; SVG does not.
- **Numbered lists only for sequences** (steps, derivations); **bullets for parallel items**. Do not mix.
- **Code comments teach shape**, not restate Python. Every line producing a new shape gets a `# shape: (n, d)` comment on first appearance.

---

## Tone

Calm, direct, slightly opinionated when it helps, rigorous without being academic. Write like a senior engineer sitting next to one student — "we" for joint thinking, "you" for instruction. Short sentences, concrete nouns, active verbs. One paragraph = one idea.

Never write "Welcome", "Hello", "In this lecture", "we will now learn", or "in this section" — the structure should be visible, not announced. Never write "obviously", "simply", or "just"; they shame the reader.

---

## Roadmap & syllabus data (keep in sync)

- Phase data: `src/data/phases/ml/phaseN.ts` — the source of truth for day titles, durations, focus, and notes filenames.
- Human-readable syllabus markdown: `src/data/syllabus/mlroadmap/`.
- Keep phase data, syllabus markdown, lecture filenames, and the `# Day N: Title` heading inside the lecture **all in sync**.

---

## Validation (do this before calling a lecture done)

1. Confirm structure: first line `# Day N:`, second line `**Duration: … | Focus: …**`, screens split on `---`, 4–7 `quiz` blocks, exactly one `finalquiz` with exactly 10 `q1`…`q10` questions (each 4 options, valid `correctOptionIds`, `explanation`, `example`).
2. **Parse every fenced JSON block.** A Node `JSON.parse` loop over the extracted blocks catches the one broken quote that would blank a screen. Extract blocks by scanning for a ` ```quiz `/` ```finalquiz ` opener and the next **bare** ` ``` ` — never with a non-greedy regex, which stops at the first fence inside the JSON.
3. Confirm every multi-line code string in the quiz JSON is fenced with a language tag.
4. Confirm code fences in the prose body are balanced.
5. Verify every snippet runs, and that no example uses a concept from a later day.
6. Run `npm run build`; fix anything blocking.
7. Spot-check in the browser: open `/ml/notes/<slug>`, walk the deck with arrow keys, answer one quick check, and confirm the final quiz grades and its last screen is the quiz — not raw JSON.
8. Read the chapter rail under the top bar: the **Lecture** track must end where the teaching ends, and the boundary card must land on the first practice/review screen. A flat bar instead of a rail means no section heading matched — see [`guidelines/deck-chapters.md`](deck-chapters.md).

---

## Universal rules (from AGENTS.md)

- Protect user work — never revert unrelated dirty files or changes you didn't make.
- One lecture file per day; never combine a day range into one lecture.
- Stage only files relevant to the request; commit/push only when the user explicitly asks.
