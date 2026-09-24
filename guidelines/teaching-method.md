# Teaching Method (all roadmaps)

Read this **before** `guidelines/<roadmap>.md`, whichever roadmap you are writing for. The per-roadmap files say *what* to cover and *what shape* the file takes. This file says **how to explain**, and it applies to daml, ml, webd, dsa, go, and reactnative alike.

It exists because of a specific, repeated failure. A lecture can hit every structural target — right length, right sections, right syllabus coverage, valid quizzes — and still be unusable, because it **states conclusions instead of building them**. The learner reads it, understands nothing, opens ChatGPT, and gets a better explanation in a fifth of the words.

That is the failure this file prevents. The reference case is the WebD Day 37 rewrite (`public/data/lectures/webd/phase4/day37-useeffect-error-boundaries.md`); the diagnosis that produced these rules is preserved at the bottom.

> **The bar, in one sentence:** the learner reads the deck top to bottom, alone, and never once needs to open another tab.

## On-demand batches and durable learning

Lectures are normally authored three at a time using
[the lecture generation prompt](lecture-generation.md). Generation
is not study completion. Read earlier teaching, write topic-sized chunks, and leave
a factual handoff with prerequisite coverage and retrieval candidates.

Explanatory clarity and active production are separate requirements. Before each
major reveal, ask for a concrete prediction, trace, calculation or plan, and show
feedback on a later screen. Make the attempt accessible with worked or partially
completed examples when needed; the learner need not invent unknown syntax.

Bring back an actually taught older prerequisite, not merely yesterday's topic.
Include a changed task that requires selecting among known tools. For DSA and ML,
follow their study-system guides for capped delayed review and help-aware mastery
gates. Other roadmaps retain their routed practice rules. Never claim that a long
explanation, generated file, or recognition quiz proves delayed independent skill.

---

## Rule 1 — Failure first, rule second

**Never state a rule before the learner has seen the problem it solves.**

A rule delivered before the pain is just a sentence to memorise. The same rule delivered after a bug the learner watched happen is a relief — they were already looking for it.

The shape:

```
1. the obvious first attempt          (written the way a learner would write it)
2. it works                            (say so — don't sandbag it)
3. the app grows one realistic step
4. it breaks — show the broken output concretely
5. the naive patch                     (and why the patch does not scale)
6. NOW the tool, arriving as the fix the learner was already reaching for
7. the rule, stated once, in a blockquote
```

Steps 2 and 5 are the ones authors skip, and they are load-bearing. If the first attempt is presented as obviously stupid, the learner learns nothing — they would never have written it. Show the version they *would* write, let it work, then break it.

Applies everywhere, not just to APIs:

| Topic | The failure that must come first |
|---|---|
| a hook / API | code that does the job by hand, then a case the by-hand version cannot cover |
| a data structure | a naive solution that is correct but too slow, with the actual operation count |
| a language feature | the workaround people wrote before it existed, and what it could not express |
| a statistical method | a conclusion drawn without it that is confidently wrong |
| an architectural pattern | the version that works at one screen and collapses at three |

**Anti-pattern to delete on sight:** a section that opens `## X: what it is` followed by a definition, a table of its parts, and a correct example. That is reference documentation. The learner already has reference documentation.

---

## Rule 1b — The opening screen is the shortest screen in the lecture

`## Why this day exists` has exactly one job: make the learner want the next screen. It is **not** a lecture summary, an agenda, or a syllabus restatement.

**Hard limits.** Roughly 10–20 lines. One idea. One para, or one small table, or one short flow diagram — pick *one*, not all three.

**Banned from this screen:**

- Any term the lecture has not taught yet. The learner cannot be motivated by a word they do not know, and naming `useEffect`, `useRef`, and "error boundaries" on screen one tells them the day is hard before it tells them why they care.
- A "by the end you will be able to…" list. It reads as a syllabus and every item uses vocabulary from later screens.
- A prerequisites paragraph ("everything today builds on Days 14–23…"). If prerequisites hold, the learner will never notice. If one is shaky, a list of day numbers does not help.
- A meta-paragraph about how the lecture is structured ("most explanations start with X; we will do the opposite"). Just do it.
- More than one code block.

**What works:** the situation, in plain words, with the problem visible at the end.

```markdown
## Why this day exists

So far, everything you changed lived inside React:

    you call setState   →   React redraws the screen

But a web page has parts React does not own:

| Part of the page          | Who controls it |
|---------------------------|-----------------|
| text inside your components | React         |
| the browser tab's title     | the browser   |
| a timer you started         | the browser   |

React will not touch the right-hand column. If the tab title should
change, *something* has to tell the browser — and that is today's topic.
```

Twelve lines, no new vocabulary, and the learner now has a question they want answered. Everything that used to live on this screen — the duplication, the failure, the stakes — belongs on screens two and three, where it has room to be shown properly.

The same applies to a long screen anywhere: **if the opener runs past one screenful, split it.** Day 38's opener originally ran 130 lines through three distinct beats; it became four screens (`Why this day exists` → `The same sixteen lines, three times` → `Why copies are worse than repetitive` → `What we want instead`) and got easier without a word being cut.

---

## Rule 2 — Explain with what the learner already has

**An example may only use concepts already taught in this course.** No exceptions, and the ban is stronger than it sounds: it covers not just future *lectures* but any API, library, or protocol the learner has no reason to know.

The Day 37 failure was teaching `useEffect` — a hard idea — through a chat-room connection API that existed nowhere in the course. The learner had to learn connection lifecycle *and* effect lifecycle simultaneously, from a function whose behaviour was never specified. Both halves stayed unlearned.

Before writing any example, ask: **which day taught every single thing in this snippet?** If you cannot name a day for something, one of three things must happen:

1. replace the example with one built from taught material (almost always possible, and almost always better);
2. teach the unfamiliar thing from zero, right there, properly — not in a parenthetical; or
3. cut the example.

### "It appeared in an earlier day" is not the same as "it was taught"

The prerequisite check fails silently when you grep for a term, find a hit, and tick it off. A learner hit exactly this on Day 38: the lecture used `window.addEventListener` and `navigator.onLine` and claimed both came from Day 20. In reality `window` was *mentioned once* on Day 13 in a list of things the browser provides, `window.addEventListener` appeared once on Day 20 inside a throttling example with no explanation of what `window` is, and `navigator` had never been introduced at all.

Grepping proved the string existed. It did not prove the learner could read it.

So the check is not "does this term appear earlier?" but:

> **Is there a day where this was *explained* — what it is, why it exists, with an example — rather than merely used in passing?**

Open the earlier lecture and look at the surrounding paragraph. If the term appears inside a code sample demonstrating something else, it was not taught.

When you find a genuine gap, the fix is a **plain-language detour before the first real use**: strip the new concept out of the day's framework entirely and teach it on its own terms, with snippets the learner can run immediately. For `window` that meant one screen of pure browser JavaScript — what `window` is, how it differs from `document` and `navigator`, why some events attach to the page rather than an element — with no React anywhere in it, placed immediately before the component that needed it.

Two notes on doing that well:

- **Put the detour at the first use, not the second.** The learner meeting it again later gets a short pointer back, not a repeat.
- **Make it independently runnable.** "Paste this in your console and switch DevTools to Offline" is worth more than three paragraphs, because the learner verifies it themselves.

Signs you have broken this rule:

- an example calls a function you invented and never defined (`connectToRoom`, `fetchThing`, `doTheWork`);
- a snippet mixes the day's new idea with a second unfamiliar idea;
- you catch yourself writing "don't worry about this part for now" — **that phrase is a bug report**, delete the example;
- the example's domain needs explaining before the code does (sockets, WebRTC, a specific cloud product).

**Prefer examples the learner can run and see.** Something visible in a browser tab, a printed value, a number that goes up. `document.title` beats a socket because the learner *watches it change*.

### Forward references

You may **name** a future day to create anticipation. You may not **use** anything from it.

```
Good:  "Day 43 introduces the tool that handles caching and retries for you."
Good:  "There are Hooks that keep a function stable across renders; you meet them
        on the performance day."
Bad:   any code sample using useCallback before the performance day
Bad:   "as you know from useReducer…" in a lecture before useReducer
```

Run the check mechanically before calling a lecture done: grep the file for every API introduced later in the roadmap.

---

## Rule 3 — A compressed sentence is not depth

Density is not rigor. If a sentence would take a paragraph to unpack, **write the paragraph.**

This paragraph shipped in a lecture and was, correctly, called incomprehensible:

> "Render must stay pure. React may call a component to calculate a possible screen and later decide not to commit it. Starting timers or subscriptions during render would create outside work for a screen that may never appear."

Every clause is true. It is still useless, because it names four unexplained abstractions (*pure*, *calculate a possible screen*, *commit*, *outside work*) and shows zero code and zero consequence. The learner cannot picture a single concrete thing.

The replacement runs about 120 lines and contains: what "render" actually means (React calling your function to ask a question), what comes back (a description, not pixels), what commit is, why the DOM does not exist during render *with the `TypeError` that proves it*, why React may call a component more than once, and a traced example where three renders create three uncancellable timers.

**Same idea. Same rigor. Nothing removed.** The difference is that it is *derived* rather than *asserted*.

Practical tests, applied per paragraph:

- **The unfamiliar-noun test.** Count the terms in this paragraph a learner at this point in the course could not define. More than zero → unpack them first.
- **The "so what" test.** After every mechanism, does the learner know what goes *wrong* without it? If not, add the consequence.
- **The picture test.** Could they draw what you just described? If not, add the diagram, trace, or metaphor you were holding in your head while writing it.

> Depth means more explanation, never more compression. A lecture is allowed to be long. It is not allowed to be dense.

---

## Rule 4 — Tables and cheat sheets summarize; prose and code teach

A table is an excellent *recap* of something understood and a terrible *introduction* to something new. It strips exactly the reasoning the learner needs.

This is not teaching:

| Part | Meaning |
|---|---|
| setup function | What outside process should be active? |
| cleanup function | How do we stop that exact process? |
| dependency list | Which changing React values configure the process? |

A learner who does not already know the answer learns nothing from it. Each of those rows needs its own worked example, its own bug, and its own trace — and then the table is genuinely useful as a summary.

**The rule:** no concept may make its first appearance inside a table. Prose + runnable code first; the table afterwards, or in the cheat sheet.

Same for comparison tables (A vs B). Teach A, teach B, show a case where choosing wrong hurts — *then* tabulate.

---

## Rule 4b — Never assert something stronger than the truth

A learner who spots that your claim is overstated stops trusting the rest of the lecture — correctly.

The failing line: *"Some ways the count changes cannot be patched at all,"* followed by three code fragments. Two of those three **could** be patched; they were just tedious. Only the third — state owned by a parent — genuinely could not. The learner caught it immediately and lost the point of the whole screen.

The fix is to grade each case honestly, and let the honest version make the argument better:

```
Case 1 (server response)  → patchable. It is just a fifth copy of the line.
Case 2 (restored value)   → patchable. Sixth copy. Notice the pattern.
Case 3 (parent owns it)   → genuinely not patchable, and here is exactly why.
```

The escalation is more convincing than the overstatement was, because the learner is agreeing at every step instead of finding the hole.

**Check every superlative you write:** *always, never, cannot, impossible, the only way, must*. For each one, spend ten seconds trying to break it. If you can, weaken the claim and use the exception as teaching material.

---

## Rule 4c — One idea per screen; code fragments are not an argument

The same failing screen dumped three unexplained fragments in a single code block and expected the learner to infer the point:

```tsx
// The count arrives from a server response.
const data = await response.json();
setCount(data.count);

// The count is restored from localStorage when the page loads.
setCount(readSavedCount());

// The count is a prop, and the PARENT changed it.
// There is no handler in this file to add a line to.
```

Three unrelated scenarios, three comments doing the work that prose should do, and a "there is no handler in this file" claim about a file that was never shown. Nothing here can be followed.

Each case needs its own `###` heading and its own walk-through: **the code → what the value becomes → what the screen shows → what the other system shows → whether it can be fixed → what that costs.** For the parent case, that means actually writing out `Parent` *and* `Counter` so the learner can see with their own eyes that `Counter` contains no handler.

Rules that follow from this:

- **A comment inside a code block is not an explanation.** If the point is in a comment, move it to prose.
- **Never claim something about code you have not shown.** "There is no handler in this file" requires the file on screen.
- **If a screen makes three points, it is three screens.** The deck splits on `---`; use it. A screen the learner scrolls is a screen they skim.
- **Show both sides of a comparison.** "The parent changed it" means nothing until the parent's code is visible next to the child's.

---

## Rule 5 — Trace concrete values, don't describe behaviour abstractly

"The Effect keeps the connection created with the first room id" is a description. This is a trace:

```text
press +                zoom 100 → 110      correct
click "Use big steps"  step  10 → 25
press +                zoom 110 → 120      WRONG — you expected 135
```

Traces are what make a bug *felt*. Use them for anything that unfolds over time — state changes, lifecycle order, console output, request timing, loop iterations, pointer movement, recursion depth.

Three habits:

- **Show the wrong output, labelled wrong.** Not "this can cause problems" — the actual bad value, with `← WRONG` next to it.
- **Number the steps and name what changed at each one.** "1. On the first render, `step` is `10`. 2. That function closes over that value…"
- **Timestamps for anything async.** `t = 900ms  request 1 responds → screen shows user 1  ❌` teaches a race condition in one line.

---

## Rule 6 — Interrogate your own slogan before you ship it

Short memorable rules are valuable and dangerous. Before writing one, **actively look for the case where it gives the wrong answer.** If a learner will hit that case in normal work, the slogan is wrong and must be replaced — not footnoted.

Worked example. A lecture taught "outside system → use an Effect." The learner correctly objected: `document.title` can be set from a click handler, so the slogan cannot be the rule. It was too crude, and following it leads to real damage — an Effect that re-sends an order every time the cart changes.

The honest rule turned out to be a question, not a slogan:

> If this same state changed for a completely different reason, should this code still run?
> Yes → Effect. No → event handler.

Which is longer, harder to fit on a slide, and actually correct.

**The check:** for every rule you write, construct one counterexample and one near-miss. If the rule survives, keep it and show the near-miss as a teaching moment. If it does not, you have found the real rule — teach that one instead.

Related: **decision rules should be ordered and cheapest-first**, so the learner knows what to check before reaching for the heavy tool.

---

## Rule 7 — Explain the syntax you just typed

When a construct first appears, account for **every** part of it: each argument, each symbol, each piece of punctuation that carries meaning. The learner is looking straight at characters they do not recognise, and skipping them is what sends them to another tab.

For `useEffect(() => { ... }, [count])` that meant explaining: that it takes exactly two arguments; that argument one is a function you hand to React rather than call; that argument two is an array React compares against last render; and where each one starts in the collapsed formatting everyone actually writes.

Things authors habitually skip that always need a sentence:

- why a value is `null` initially (`useRef<HTMLInputElement>(null)` — the element does not exist during the first render);
- why `?.` is there (two reasons: the type, and the genuine runtime case);
- why a function is *named* rather than inline (`removeEventListener` compares by reference);
- why an arrow wraps a call (`useState(() => read())` vs `useState(read())` — when each is evaluated);
- what a language keyword is doing here specifically (`static` on `getDerivedStateFromError` means React may call it during render, so it must be pure).

If a line has a detail that would make a learner pause, that detail is the lecture.

---

## Rule 8 — Deliver the "why" behind the framework's choice

When a framework, language, or library does something surprising, explain **the reasoning of the people who built it**. It converts an arbitrary-feeling rule into something the learner can re-derive later.

> React unmounts the whole tree on an uncaught render error. Why? It has no valid description for that subtree, and a half-updated UI is dangerous — a banking app showing a stale balance next to a live transfer button is worse than showing nothing.

Now the learner will never forget what a boundary is for. Compare with "React unmounts the tree; use an error boundary," which they will forget by tomorrow.

Do this for every "just how it is" moment: dev-mode double invocation, why `typeof null` is `"object"`, why a slice header is copied by value, why floats do not compare equal.

---

## Rule 9 — Name the misconception, not just the correct answer

For every non-obvious idea, state the wrong belief a learner is likely to hold, in their words, and dismantle it. Correct information does not overwrite an existing wrong model; it sits alongside it.

- "Nearly everyone learns cleanup as 'the thing that runs when the component is removed.' That is one of the **two** times it runs, and the other is where the power is."
- "People choose `[]` because they want it to run once. But `[]` is not a request — it is a statement of fact about your code, and if the fact is false you get this bug."

Then repair it in the same breath. This also gives you your distractors: a quiz option is only worth writing if it is a misconception someone actually holds.

---

## Rule 10 — Show the diagnostic, not only the fix

A learner who can only recognise a bug in a lecture's tidy example cannot find it in their own code at 1am. Give them the observable symptom and the procedure.

- **Symptom → cause**, not just cause → fix: "setup repeating with identical values and no cleanup between → an unstable dependency."
- **An ordered debugging procedure**, so they stop changing things at random.
- **The instrumentation itself** — the exact `console.log` to add and what correct output looks like next to each broken output.

---

## Rule 11 — Carry one running example through the whole lecture

A lecture with a fresh example per section makes the learner re-orient constantly and never lets them feel a decision *compound*. Pick one scenario in the opener and keep it.

```text
Day 37   a counter whose tab title must match it
Day 38   three components that all need the online status
Day 41   a movie catalogue with shareable filtered views
Day 43   two components asking for the same user profile
Day 46   a search box over 5,000 products
Day 50   a weather dashboard, from clarifying questions to budgets
```

The payoff is that an early decision visibly determines a later one. Day 50's "people share forecasts by link" is stated in Step 1 and is still doing work in Step 6, when it becomes the reason to server-render the city page. A lecture with six unrelated examples cannot show that.

Introduce a second example only to make a **contrast** the running one cannot — Day 37 needs `sendOrder` alongside `document.title`, because the whole point is that two things touching the outside world belong in different places.

---

## Rule 12 — Consecutive lectures must not contradict each other

A lecture is correct in isolation and still wrong if it disagrees with the day before it. The learner reads them a day apart and simply loses trust.

The real case: Day 50 told the reader to "rule out" Redux for a weather dashboard. Day 51 **is** a weather dashboard that uses Redux — and the syllabus mandates it. Both lectures were internally consistent, well argued, and jointly useless on that point.

The fault was in the more absolute claim, which is Rule 4b again: three persisted client-owned values read across several routes is a genuinely borderline case, not an obvious no.

**How to resolve one, in order of preference:**

1. **Soften the overstated side into a threshold.** "Leave it out at this scope, and here is what would change my mind" is both truer and more useful than a verdict. Then say explicitly that the later day crosses that threshold.
2. **Address it out loud in the second lecture.** Day 51 now opens with "didn't yesterday say not to use Redux?" and answers it. A tension the learner would have spotted is worth more as a teaching moment than as a thing you hoped they would miss.
3. **Change the code** — only when neither day is syllabus-bound.

**The syllabus wins ties.** If `src/data/phases/<roadmap>/` mandates a tool for a day, the lecture honours it, and the *other* lecture is the one that adjusts. Never quietly drop a syllabus item to resolve a disagreement.

**Fix every instance, not the first one.** A softened claim usually appears four times: the prose, the cheat sheet, a worked example, and a quiz option. Grep for the phrasing and move them together, or the lecture ends up contradicting *itself*.

> When you touch a claim in one lecture, grep the neighbouring days for the same topic. Two days that disagree is a bug with the same severity as broken code.

---

## Applying this without losing depth

None of these rules trade depth away. Read that again, because the instinct when a lecture is called "confusing" is to simplify it, and that is the wrong correction.

The Day 37 rewrite went from 1,130 lines to 2,306 — it got **twice as long** while becoming easier. Nothing was cut. Everything got its motivating failure, its trace, and its full unpacking. Coverage was *added*: the race-condition timeline, the reference-equality reason listener removal silently fails, React's reasoning for unmounting on error, why setup cannot be `async`.

> The site is for **self-study to mastery**, not overview. A confused learner needs *more* explanation, not less material.

If you must choose, choose: **fewer topics, fully derived** over more topics mentioned. But check the syllabus first — usually you do not have to choose, you just have to write more.

---

## The authoring workflow

How the Phase 4 rewrites were actually produced. Editing a weak lecture in place does not work — the original's structure survives, and you end up with motivating failures bolted onto sections that still assert their conclusions.

```text
1. READ the whole existing lecture, and write down the diagnosis
   (which rules it breaks, and where)
2. CHECK prerequisites: what earlier days actually taught, and what
   later days own. Read the syllabus topics for the day.
3. DELETE the file
4. WRITE it in chunks, one topic beat per file, into a scratchpad
5. ASSEMBLE, normalise, and validate
6. FIX the answer-key distribution
7. COMMIT with the diagnosis in the message
```

**Write in chunks, not in one pass.** Each chunk is one or two `##` screens. Long single-pass writing drifts: the last third stops deriving and starts asserting, because the momentum of listing things takes over. Chunks also let you check prerequisites per beat rather than at the end.

```bash
# assemble the chunks in order
cat "$SP"/d47-0{1,2,3,4,5,6,7}.md > "$OUT"
```

**Normalise the joins.** Chunk boundaries produce `---` separators without the blank line the renderer expects:

```bash
python3 - "$OUT" <<'PY'
import sys, re
p = sys.argv[1]; s = open(p).read()
s = re.sub(r'\n---\n(?!\n)', '\n---\n\n', s)   # blank line after every separator
s = re.sub(r'\n{4,}', '\n\n\n', s)             # collapse runs of blank lines
open(p, 'w').write(s)
PY
```

**Then run the structural checks.** These catch the mistakes that survive a careful read:

```bash
npm run validate:quizzes                       # always; parses every quiz block

f=public/data/lectures/webd/phase4/dayNN-slug.md
grep -c '^```' $f                               # must be EVEN, or a fence is unclosed
grep -c '^```quiz$' $f                          # 3–7
grep -c '^```finalquiz$' $f                     # exactly 1
grep -n '^## Common mistakes\|^## Cheat sheet\|^## Tomorrow' $f   # tail order

# opener length — must be ~10–20 lines
python3 -c "
s=open('$f').read().split('\n')
i=next(k for k,l in enumerate(s) if l.startswith('## Why this'))
j=next(k for k in range(i+1,len(s)) if s[k]=='---')
print('opener:', j-i, 'lines')"

# borrowed from a future day? (adjust the list per lecture)
grep -n "useMemo\|useCallback\|Suspense\|createSlice\|useQuery" $f || echo none

# corrupted inline code — a closing backtick replaced by a paren
grep -n '`[A-Za-z_][A-Za-z0-9_<>.]*)[?:,.; ]' $f | grep -v '```' || echo clean
```

That last one is not hypothetical: a find-and-replace once corrupted six spans across three lectures, and it survives proofreading because it looks like a function call.

### Answer-key distribution

The runtime shuffles displayed option order, so this is about not *authoring* a pattern. Check it mechanically rather than by feel:

```bash
node -e '
const s=require("fs").readFileSync(process.argv[1],"utf8");
const q=JSON.parse(s.match(/```finalquiz\n([\s\S]*?)\n```/)[1]);
const t={a:0,b:0,c:0,d:0};
q.questions.forEach(x=>x.correctOptionIds.forEach(i=>t[i]++));
console.log("multi counts:", q.questions.filter(x=>x.type==="multiple_correct")
  .map(x=>x.correctOptionIds.length).join(","), "| tally:", JSON.stringify(t));
const m=[...s.matchAll(/```quiz\n([\s\S]*?)\n```/g)].map(x=>JSON.parse(x[1]));
console.log("mid-quiz correct index:", m.map(x=>x.options
  .map((o,i)=>o.correct?i:null).filter(v=>v!==null).join("+")).join(", "));
' "$f"
```

Three things to fix when it comes back skewed:

- **No letter at 0 or above ~6** of the ten answers. Reorder options; never reword a correct answer to fit a slot.
- **Vary how many options are correct** in `multiple_correct` — a file of all-3s is a pattern. Change it by turning one true option into a **real misconception**, never by deleting a true one. The replacement should teach something.
- **Vary the authored position of mid-lecture answers.** Four quick checks all with the correct option second is a habit worth breaking.

---

## Pre-flight check

Run before calling any lecture done, in addition to the per-roadmap validation:

1. **The self-study test.** Read it as someone who has done every previous day and nothing else. Mark any sentence that would send you to ChatGPT. Every mark is a rewrite, not a tweak.
1b. **The opener check.** Is `## Why this day exists` under ~20 lines, free of every term the lecture has not taught, and free of a "by the end" list? Does any other screen run past one screenful without a `---`?
1c. **The superlative check.** Grep the file for *cannot, never, always, impossible, the only*. Try to break each one. Weaken what breaks and teach the exception.
2. **The prerequisite grep.** For every API, function, and term used, name the day that taught it — then **open that day and confirm it was explained rather than merely used in passing.** A grep hit inside an example about something else is not teaching. Also grep for later-day APIs by name, to catch borrowing from the future.
3. **The undefined-symbol scan.** Every function called in an example is either defined in the lecture, taught earlier, or obvious from its name *and* irrelevant to the point being made.
4. **The first-appearance scan.** No concept introduced first in a table.
5. **The rule-motivation scan.** Every blockquoted rule has a concrete failure above it on the same screen or the one before.
6. **The slogan check.** Each memorable rule survives one deliberate counterexample.
7. **The trace scan.** Every time-ordered behaviour has a concrete trace with real values, and every claimed bug shows its wrong output.
8. **"Don't worry about this."** Grep for that phrase and its relatives. Each hit is an unexplained dependency.
9. **The neighbour check.** Grep the day before and the day after for this lecture's main topic. If they disagree with it, fix the overstated side and make the later day address the tension out loud (Rule 12).
10. **The running-example check.** Can you name this lecture's one scenario? If it changed three times, the reader re-oriented three times.
11. **The tail check.** `Common mistakes` → `Practice` → `Cheat sheet` → `Tomorrow` → the final quiz, in that order, with the reference tail unbroken. `Tomorrow` names the next day's *problem*, not its API list.

---

## Appendix: the diagnosis these rules came from

A learner reported that WebD Day 37 was impossible to follow and that ChatGPT explained the same material far better in far fewer words. Comparing the two, line by line, produced this list. It is worth keeping because the failures are subtle — the lecture looked professional and passed every structural check.

| What the lecture did | What the good explanation did |
|---|---|
| Stated "Filtering is a calculation, so it belongs during render." | Showed a handler-based version working, then a Reset button that silently desyncs it, then the fix |
| Taught Effects through an invented chat-connection API | Taught them through `document.title`, a timer, and a listener — all previously covered, all visible |
| Compressed render/commit purity into three abstract sentences | Spent 120 lines on it: what render means, what commit means, `setInterval` in a body creating three timers |
| Used tables as the explanation | Used prose + traced code, tables only as recap |
| "outside system → Effect" | "would this still need to run if the state changed for another reason?" — with the order-charged-five-times counterexample |
| Described bugs abstractly | Traced them with real values and wrong outputs marked wrong |
| Gave the correct rule | Named the wrong belief first, then dismantled it |

The uncomfortable lesson: **the lecture was not too shallow, and it was not too short.** It was 1,130 careful lines. It failed because it delivered conclusions the learner had no way to reconstruct — and no amount of additional correct-but-asserted material would have fixed that.
