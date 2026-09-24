# Quiz Block Contract (all roadmaps)

Read this before writing or editing any ` ```quiz ` or ` ```finalquiz ` block, in **any** roadmap.

These blocks are JSON embedded in Markdown, and their contents are then rendered *as Markdown*. That double layer is where every past breakage came from. The rules below are not style preferences — violating them either makes code unreadable or corrupts the whole lecture.

---

## How the renderer reads these blocks

`src/components/LectureDeck.tsx` → `stripCodeFences()` scans line by line:

1. It finds an opening ` ```quiz ` or ` ```finalquiz ` **alone on its line**.
2. It takes everything up to the next **bare ` ``` `** (a line containing only three backticks) as the JSON payload.
3. It `JSON.parse`s that payload and renders it as a dedicated screen.

Then `QuizMarkdown` (`src/components/revision/markdown.tsx`) renders `prompt`, every `option.text`, `explanation`, and `example` as Markdown — with GFM, syntax highlighting, and single newlines treated as hard line breaks.

Two consequences drive everything else:

- **Every fence *inside* the JSON must carry a language tag** (```` ```go ````, ```` ```python ````, ```` ```js ````, ```` ```text ````). An untagged inner fence looks like the block's closing fence, truncating the JSON. The payload then fails to parse and the remainder spills onto a screen as raw JSON.
- **Multi-line code that is not fenced gets reflowed.** `"var count int\nfmt.Println(count)"` renders as `var count int fmt.Println(count)` — one mushed line the learner cannot read.

---

## The rules

### 1. Any code longer than one line must be fenced, inside the JSON string

Write the fence with `\n` escapes inside the JSON value:

```
"prompt": "What does this code print?\n\n```go\nvar count int\nfmt.Println(count)\ncount = 12\nfmt.Println(count)\n```"
```

This applies identically to `option.text`, `explanation`, and `example`.

### 2. Option text follows the same rule

A multi-line option **must** be fenced. Options that are program *output* rather than source use a ` ```text ` fence:

```
"options": [
  { "id": "a", "text": "```text\n0\n12\n```" },
  { "id": "b", "text": "```go\nconst (\n    statusPending = iota\n    statusConfirmed\n)\n```" }
]
```

### 3. Single identifiers and expressions use inline backticks

```
"explanation": "`:=` declares and initializes; `=` assigns to an existing variable."
```

### 4. The block's closing fence is a bare ` ``` ` on its own line

Never indent it, never tag it, and never let an untagged fence appear anywhere inside the payload.

### 5. `codeSnippet` is the fallback, not the default

`codeSnippet` renders as plain preformatted text — no Markdown, no syntax highlighting. Prefer a fenced block in `prompt`. Reach for `codeSnippet` only when a single large snippet *is* the whole question. Otherwise set it to `null`.

### 6. Never refer to an option by its letter

Option order is randomised on every page load by `src/lib/quizShuffle.ts`, so the option sitting at **b** is different for each learner and each refresh.

```
✗ "explanation": "Option (b) is right; (a) confuses the two."
✓ "explanation": "Returning the error last is right; the version that puts it first confuses the two."
```

The shuffler remaps `(b)` and `option b` references so older content survives, but phrasings it cannot detect — "the second option", "the last two choices" — will silently point at the wrong thing. Describe options by their content. For the same reason, never write "both of the above" or "none of these".

### 7. Keep options short

Prose options under ~120 chars so they stay 1–2 lines. Fenced code options under ~10 lines — if all four options need more, the question is doing too much.

---

## Shapes

### Mid-lecture quick check (` ```quiz `)

```json
{
  "prompt": "Targeted question on a non-obvious point.",
  "multiple": false,
  "options": [
    { "text": "Wrong but plausible", "correct": false },
    { "text": "Correct", "correct": true },
    { "text": "Distractor", "correct": false },
    { "text": "Distractor", "correct": false }
  ],
  "explanation": "Why this is right and the others aren't."
}
```

Place 3–7 per lecture, one after each major concept beat. Each must target a real misconception, not a definition lookup.

### End-of-lecture quiz (` ```finalquiz `)

```json
{
  "title": "Day N: Topic",
  "questions": [
    {
      "id": "q1",
      "type": "single_correct",
      "prompt": "…",
      "codeSnippet": null,
      "options": [
        { "id": "a", "text": "…" },
        { "id": "b", "text": "…" },
        { "id": "c", "text": "…" },
        { "id": "d", "text": "…" }
      ],
      "correctOptionIds": ["b"],
      "explanation": "Why b is right and why a/c/d are tempting but wrong.",
      "example": "One short sticky example."
    }
  ]
}
```

- Exactly **one** `finalquiz` per lecture, exactly **10** questions, ids `q1`…`q10`.
- Exactly **4** options per question, ids `a`–`d`.
- `type` is `"single_correct"` or `"multiple_correct"` (two or more correct ids). Use a healthy mix.
- All questions are multiple-choice. Never short-answer or code-to-write.
- The 10 together cover the whole lecture, not just the last section.
- Distractors must be the actual mistakes a learner makes, not joke answers.
- Grading is client-side; there is no LLM grade route.

---

## Validation (required before calling a lecture done)

Extract blocks by **scanning for the opener and the next bare fence** — never with a non-greedy regex like ``/```(quiz|finalquiz)([\s\S]*?)```/``, which stops at the first fence *inside* the JSON. That regex is what corrupted eight lecture files before this contract existed.

Check, for every block in the file:

1. `JSON.parse` succeeds on the payload.
2. `finalquiz` has exactly 10 questions with ids `q1`…`q10`, each with 4 options and a non-empty `correctOptionIds` whose ids all exist in `options`.
3. Every string value containing a newline either is fenced or is deliberate prose (never bare code).
4. Every fence inside a payload carries a language tag.
5. The lecture's last screen renders as the quiz — not as raw JSON.

Run `npm run validate:quizzes` at the repository root after every quiz edit. It validates JSON, fences, required fields, question counts, option IDs, and correct-answer references. It intentionally does **not** judge authored answer-position distribution because `src/lib/quizShuffle.ts` randomizes the displayed order. Authors must nevertheless avoid repeatedly favoring the same authored option IDs or following an obvious answer pattern.
