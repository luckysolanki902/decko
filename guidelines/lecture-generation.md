# Prompt: Generate the Next Three Lectures

Use this prompt for on-demand generation in any roadmap. The syllabus exists in advance; lecture files are created as the learner needs them. Unwritten future lectures are expected.

## Copyable request

> Generate the next three lectures for **[roadmap]**, starting at **[day, or infer the next unwritten day]**. Follow `AGENTS.md`, `guidelines/teaching-method.md`, the roadmap guideline, and this prompt. Read the actual syllabus and relevant earlier lectures. Write one file per day, sequentially, in small topic/subtopic chunks. Make every explanation self-contained using only previously taught material. Include attempts before feedback, guided support, delayed retrieval and changed-task practice. Validate all three and leave a factual batch handoff. Do not commit or push unless asked.

## 1. Establish the teaching boundary

- Read `AGENTS.md` and its routed guidelines, including quiz and deck-chapter rules when applicable. The roadmap phase data in `src/data/phases/<roadmap>/` is the source of truth; human syllabus docs live in `src/data/syllabus/`.
- Locate existing lectures under `public/data/lectures/<roadmap>/`. Use the course's route/file conventions rather than inventing a new folder or combining days.
- If an explicit start day was supplied, use it. Otherwise infer the next unwritten day from the actual files and phase data. Existing files show what has been authored, **not what the learner has studied**. Never overwrite an existing lecture without a request to revise it. Generate fewer than three only if the roadmap has fewer remaining units, and explain that fact.
- Read the previous three relevant lectures and any earlier prerequisite explanation. If none exist, use the syllabus and teach required foundations locally. A term appearing in a code example does not establish that it was taught.
- Inspect the next unit's syllabus for continuity. Do not use its tools in this batch's examples before teaching them.
- Read `src/data/syllabus/<roadmap>roadmap/generation-handoff.md` if present (use the actual syllabus folder for DAML). This is authoring continuity, not a record of learner mastery.

## 2. Plan three connected lectures before writing

Make a compact coverage map: day, required topics, prerequisite source, running example, learner-produced artifact, failure to diagnose, delayed-review cue, and changed-task assessment. Check all named syllabus items. Keep advanced depth; distribute the work across clearly marked study sessions if needed.

Use WebD Days 13–15 and especially Day 37 as examples of derivation and traces. Read actual passages rather than copying headings. Older examples can violate newer rules; current instructions govern. Do not impose an arbitrary line count or infer teaching quality from length.

For DSA and ML also read their learner `01-Study-System.md` and the matching research report when changing pedagogy. The reports justify policy; the current syllabus decides topic order.

## 3. Write one concept beat at a time

Keep the opening motivation short and in known vocabulary. Put the concrete motivating failure on the following screen. For each idea:

1. Show a small task the learner can understand now.
2. Ask for a concrete output **before** showing feedback: a predicted value/shape, hand trace, small plan, counterexample, or calculation. Place the answer on a later screen, not beside the prompt.
3. If needed, give a bounded hint or a partially completed example. A beginner need not invent unfamiliar syntax. Explain the difference between a prerequisite gap and a difficult but accessible problem.
4. Derive the mechanism through one tiny case, then a realistic case. Explain every newly used operation, symbol and assumption.
5. Show an error or boundary case and how to diagnose it.
6. Require a short reconstruction without looking, followed by a changed task using only known prerequisites.

Write and inspect each topic-sized chunk before continuing. Preserve the connected argument across chunk boundaries. Do not draft three entire lectures as one unreviewed wall of content.

Use headings such as `## Before you reveal the result` for mid-teaching attempts. Do not use reserved `Practice`, `Problem 1`, `Your turn`, or `Drill` headings before the actual practice chapter; they change the deck's chapter boundary.

## 4. Make memory cross the batch boundary

- Near the start after the short motivation, include two brief closed-notes retrieval cues: one recent prerequisite and one older related idea, where such material exists. Put corrective feedback on a later screen. First-day cues must not assume nonexistent prior lessons.
- Select cues from actual previous teaching, not solely from a syllabus promise. Provide a small repair explanation when a prerequisite is weak.
- Include a mixed or unlabelled task whose solution requires choosing among already taught approaches. Do not announce its technique in the title.
- End practice with at most two durable prompts to add to a manual queue, a representative reconstruction task, and a changed-task follow-up. Start around 1/3/7/14/30 days **after study**, adapting to success, failure and workload. Generation dates do not start the review clock.
- Keep ordinary daily review around 15–20 minutes. Prioritize today's dependencies and recurrent errors. If the queue repeatedly overflows, reduce new material and use a recovery session; do not assign an unlimited backlog.
- Make assistance visible: learned with help, independent once, recalled after a delay, transferred. The LLM cannot award these statuses merely by generating content.

## 5. Respect course-specific practice

**DSA:** local compile/trace/debug exercises first; introduce judge harnesses explicitly. A five-task bank is a menu, not five required accepts per hour. Choose one or two core tasks and reserve recall/transfer for later sessions. Select LeetCode, Codeforces, AtCoder, CSES or custom drills by prerequisites and goal; verify official problem statements when using external problems. Separate hint steps, full solution, correctness argument, and complexity. Before Big-O is taught, count concrete work and explain any new notation locally. Never imply a rating follows automatically from completion.

**ML:** explain early library operations without pretending their internals are prerequisites; rebuild mechanisms when the syllabus introduces them. Predict shapes/numbers, hand-compute, implement, compare under justified tolerances, deliberately break, diagnose, and evaluate a changed condition. Give expensive labs an executable CPU/small-data route and state what it does and does not demonstrate. Require competing explanations and one discriminating experiment. Treat vendor claims as claims, not independent proof.

**Other courses:** follow their routed practice contract while retaining short retrieval, staged feedback, dependency checks and batch continuity. For WebD use npm in course commands.

## 6. Finish with evidence and a factual handoff

For each lecture check H1, duration/focus, syllabus coverage, opener, neighboring claims, prerequisite-safe snippets, fence balance, quiz JSON and chapter order. Run `npm run validate:quizzes` for structure, never to judge answer-position balance. Follow the quiz contract: varied authored answers, no positional references, exactly ten final questions where required. Run relevant snippets, build/lint when practical, and inspect one generated lecture in the browser. Distinguish existing failures from new ones.

Update the course's `generation-handoff.md` using this compact template:

```markdown
# Generation handoff — <course>
- Authored batch: <actual day IDs, titles and file paths>
- Actually explained: <essential concepts, syntax and APIs; where introduced>
- Prerequisite repairs: <gap and exact teaching location>
- Next syllabus unit: <day/title; concepts still off-limits as assumed knowledge>
- Retrieval candidates: <cue, source lecture, expected mechanism, changed-task idea>
- Verification: <what ran, results, limitations>
- Learner evidence: unknown unless the user supplied actual attempts/results
```

Keep the handoff compact; retain older still-needed dependency and review cues. Do not invent dates studied, scores, due dates or mastery. Report the three generated files and any unresolved issue plainly. Do not generate extra lectures to fill a quota or commit/push without explicit authorization.
