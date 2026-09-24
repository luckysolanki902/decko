# DSA curriculum audit: remembering, thinking, and growing into competitive programming

Research and repository audit: 20 September 2026. This report evaluates the pre-update design and specifies the changes implemented alongside it.

## Verdict

The syllabus has a strong technical spine, but its original learning contract is poorly matched to a beginner who forgets and reads solutions too early. More topics and longer explanations will not, by themselves, fix that. The missing layer is a repeatable system for attempting, receiving appropriate help, retrieving later, choosing among techniques, and recovering after failure.

Keep the ambition. Replace the promise of becoming a 5–7★ competitor in 146 days with a substantial foundation and a continuing contest apprenticeship. Finishing a syllabus, recalling a technique, solving a familiar exercise, and independently solving an unfamiliar contest problem are different achievements.

## What was actually examined

- `src/data/phases/dsa/index.ts`: 25 phases, 146 numbered units, generated daily practice and checkpoints; detailed inspection of foundations, prerequisite transitions, advanced DP, and contest craft.
- `src/data/dsa.ts`, the home and DSA cards, `src/data/syllabus/dsaroadmap/00-Overview.md`, and the stored A2Z coverage checklist.
- `guidelines/teaching-method.md`, `guidelines/dsa.md`, `guidelines/revision.md`, and course-data rules.
- Lectures are intentionally generated on demand in batches of three. The absence of prewritten DSA lectures is not a curriculum defect. This audit evaluates the syllabus, generation prompt, and authoring rules; existing WebD lectures supply examples of generated teaching, not evidence about unwritten DSA lectures.
- `guidelines/lecture-generation.md` was the stored generation prompt. It still referred to obsolete `pydaml-lectures/` paths, 12-lecture generation, and 4,000–4,500-line targets. It named learning psychology without prescribing a cross-batch memory handoff.

No learner trial was run. The report distinguishes research findings, repository observations, and curriculum-design judgments. Ratings below are qualitative, not experimentally measured scores.

| Dimension | Judgment before changes | Evidence |
|---|---|---|
| Technical breadth | Strong foundation and substantial advanced coverage | Recursion, sorting, search, graphs, DP, number theory, range queries, flow, advanced DP |
| Beginner entry | Fragile | Day 1 already asks for a test-case loop; formal loops arrive on Day 3 |
| Dependency safety | Good intention, imperfect execution | Day 4 names `vector` before Day 5; Day 5 uses amortized notation before Day 7 |
| Active thinking | Strong stated intention | Problem-first discovery, traces, failure cases |
| Guided support | Too absolute | The learner is expected to discover before explanation, even when syntax is unfamiliar |
| Long-term retention | Under-specified | Same-day recall is mandated, but no concrete delayed-review budget or recovery rule |
| Independent transfer | Under-specified | Topic-labelled practice tells the learner which tool to use |
| CP preparation | Broad content, late routine | Contest craft concentrated in Days 141–146; daily source rules contradict CP goals |
| Confidence and pacing | Unnecessarily threatening | Five questions in one hour, fixed four-hour days, rating promise |

## Research: what is supported and what is extrapolation

**Retrieval and spacing.** Dunlosky and colleagues rated practice testing and distributed practice highly across the literature. This supports revisiting ideas through questions rather than relying on rereading. It does not establish a magic review timetable or prove that flashcards alone produce algorithmic skill. [Review and publisher summary](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html).

**Immediate ease can mislead.** Roediger and Karpicke compared study and retrieval conditions and found delayed-retention advantages for testing. The original tasks were prose learning, not Codeforces. Our application is to retrieve invariants and reconstruct code, then separately test transfer to changed problems. [Original study](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/).

**Spacing depends on the target.** Cepeda and colleagues found that useful spacing depends on how long knowledge must be retained. A 1/3/7/14/30-day queue is a practical starting policy here, not a schedule their experiment established for programming. [Original paper](https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf).

**Beginners need examples as well as attempts.** The IES practice guide recommends alternating worked examples with problem solving and using retrieval. This supports moving from a modelled solution to a partially completed solution and then to independent work. It does not support throwing a novice at unexplained syntax until they invent it. [IES guide](https://ies.ed.gov/ncee/wwc/practiceguide/1).

**Productive failure is designed.** Sinha and Kapur's meta-analysis covered 53 studies and 166 comparisons of problem-solving-before-instruction versus the reverse. The conditions and instructional design matter. We should retain short, accessible attempts followed by explicit consolidation; prolonged helplessness is not the intervention. [Research article](https://journals.sagepub.com/doi/abs/10.3102/00346543211019105).

**Effort can feel like worse learning.** Deslauriers and colleagues found a mismatch between perceived and measured learning in active versus passive university physics instruction. Explain this possibility to learners, while also acknowledging that confusion can indicate a genuinely bad explanation. Effort is not automatically evidence of learning. [Randomized classroom study](https://www.pnas.org/doi/full/10.1073/pnas.1821936116).

**Confidence should have evidence.** Bandura's account of self-efficacy emphasizes mastery experiences among its sources. Our design interpretation is to make small independent successes visible and attributable to controllable actions. It is not a claim that an acceptance screen or a dopamine ritual guarantees motivation. [Original paper](https://dradamvolungis.com/wp-content/uploads/2011/06/self-efficacy-unifying-theory-of-behavioral-change-bandura-1977.pdf).

**CP practice advice is practitioner evidence.** The USACO Guide discusses attempts, editorials, and learning from solutions. It is useful domain experience, not a randomized trial proving an optimal number of daily problems. [Practice guidance](https://usaco.guide/general/practicing), [entry prerequisites](https://usaco.guide/general/expected-knowledge).

## Why this learner forgets

There are several possible bottlenecks; calling all of them “bad memory” hides the repair.

| Observable behavior | Likely learning bottleneck | Appropriate response |
|---|---|---|
| Explanation makes sense, blank editor does not | Recognition without retrieval | Close the solution; reconstruct one essential step |
| Remembers code but cannot explain the loop | Surface memorization | Trace concrete values and state what remains true after each iteration |
| Solves five sliding-window questions, fails an unlabelled one | The topic label supplied the decision | Mix previously taught techniques and require a choice with justification |
| Cannot begin even with the statement restated | Missing prerequisite or representation | Teach the missing operation; model a smaller case |
| Forgets after a week | Little delayed retrieval | Schedule a small closed-notes revisit with feedback |
| Knows an approach but repeatedly gets wrong answers | Implementation or testing weakness | Construct minimal counterexamples; classify the bug |
| Freezes in contests | Time pressure and task selection may be the bottleneck | Start short, low-stakes virtual sets and rehearse skipping |

These are instructional hypotheses, not medical diagnoses. A learner can have several simultaneously.

For example, after prefix sums, remembering `prefix[r] - prefix[l-1]` is weaker than reconstructing why the part before `l` is removed. Ask for the sum of positions 2 through 4 in a five-element example, then ask what changes for zero-based indexing and for a range starting at zero. Later, use a differently worded range-query task. These three checks measure mechanism, implementation, and transfer separately.

## What to retain and what to correct

### What the existing WebD examples show

Day 37's opening counter example makes a manual tab-title update work, adds Reset, shows the stale title, and derives the need for synchronization. That is a strong model for DSA: let brute force work before exposing the limit. Its concrete traces and later diagnostic examples are more useful references than a fixed line count.

The reference material is not infallible. Day 13's opener contains an objectives list and new vocabulary that the newer teaching rules explicitly discourage. Day 14 uses `map`/`filter` examples while describing them as tomorrow's material. Its practice and quizzes test useful understanding, but do not themselves specify a multi-week recall schedule. Copy the derivation quality, then check the output against current rules; do not copy every old pattern because the file is called a reference.

For each three-lecture generation request, inspect the last completed batch, the upcoming syllabus, and a small persistent handoff. Include a recall cue from the preceding batch, a changed task using an older prerequisite, and the due-review procedure. Generation dates are not study dates: schedule review relative to the learner actually studying a lesson. Never assume the learner completed or mastered a file because it exists.

Retain failure-first explanations, explicit traces, C++ safety, complexity reasoning, proof obligations, and the broad path to advanced structures. Recursion before merge sort and DSU before Kruskal are valuable sequencing decisions.

Correct the following contracts:

1. **Five exercises are a bank, not a daily pass requirement.** A beginner may need the whole practice block for one problem. Include core, guided, transfer, delayed-recall, and optional stretch choices; record assistance honestly.
2. **The source must fit the skill.** Local input/output and tracing drills are legitimate before a judge interface is understood. LeetCode is useful for interview-shaped exercises; Codeforces, AtCoder, and CSES are useful for contest-shaped work. A LeetCode-only rule cannot serve every advanced CP topic.
3. **Cold attempt means a small producible artifact.** Before reading, write an output prediction, two sample traces, a brute-force plan, or one question. It does not mean independently discovering every algorithm.
4. **Separate attempts from feedback.** Put hints and full solutions on later screens or supported disclosure surfaces. Do not claim the current app prevents scrolling past an attempt; it does not. The required learner action is explicit, while an enforced answer gate is a future UI enhancement.
5. **All elapsed study is not progress.** A checked box records coverage. Mastery requires delayed reconstruction and an unseen variation.
6. **A day is a unit, not a deadline.** The 584-hour figure is a nominal first pass. Remediation, spaced reviews, contests, and advanced specialization add time.

## Starting from zero: when to use each platform

The gates below are curriculum judgments, not platform entry requirements.

| Stage | Readiness evidence | Work to start |
|---|---|---|
| Day 1 | Can compile, run, print, and read a scalar after teaching its declaration | Three tiny local tasks: print a result, read and echo, repair a syntax error |
| After loops and functions, around Day 4 | Can trace a loop, write a return value, and explain a function signature | One scalar LeetCode problem with a locally explained C++ harness |
| After vectors and strings, around Days 5–7 | Can traverse, index safely, and test empty/small cases where allowed | One short array or string task; no obligation to solve general “Easy” questions |
| After foundation gate | Can parse judge input, implement a direct plan, and debug an incorrect submission | Curated Codeforces/AtCoder beginner problems whose prerequisites have been inspected |
| After several independent untimed solves | Can complete a small unfamiliar problem without an editorial | A 30–45-minute two-problem virtual set; review afterward |
| Later phases | Can combine known techniques and explain failure cases | Mixed sets, longer virtual contests, then live contests if desired |

Two verified entry candidates: [Number of Steps to Reduce a Number to Zero](https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/) after arithmetic, conditions, loops, and functions; [Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array/) after vector traversal, with prefix accumulation taught before assessment. “Easy” is a platform label, not proof that a first-week learner has its prerequisites. [AtCoder's practice collection](https://atcoder.jp/contests/abs/tasks) provides another route, but its tasks still require individual prerequisite screening.

LeetCode onboarding must explain that the judge calls a supplied method with arguments, and expects a returned value; introduce the minimal class/public wrapper plainly. Codeforces onboarding must explain `main`, standard input, exact output, Run versus Submit, and compile error / wrong answer / time limit exceeded. Teach one platform interface at a time.

## The daily and weekly routine

For a 90-minute session: 10 minutes retrieve older material; 25 minutes study one concept with prediction pauses; 40 minutes attempt one suitable problem; 10 minutes inspect feedback and repair; 5 minutes schedule the next revisit. This is a default, not a research-derived optimum. A four-hour unit can span multiple sessions.

For a first encounter, try for roughly 5–10 minutes to produce a trace or plan. If the statement itself is unclear, clarify it immediately. For an ordinary independent exercise, try roughly 15–25 minutes while making concrete progress. When stuck, use one hint, act on it, and reassess. Do not wait out a timer without thinking, and do not abandon a promising line merely because a timer rang.

When an editorial is needed: read only enough to unblock the next step; explain that step; close it; implement; test; record the insight and assistance. A solution reconstructed immediately after reading is **assisted learning**, not independent mastery.

Start with four new-content sessions, one mixed-review session, one optional contest/project session, and one rest/buffer day per week. If sessions are shorter, spread one unit across several days. Advanced units may consume several weeks. Do not fill a missed week with seven doubled sessions.

## A review queue that does not become a second full-time course

Create at most two durable prompts per study session: a mechanism/decision prompt and an implementation/bug prompt. Attach a representative problem only where code reconstruction is valuable. Revisit after approximately 1, 3, 7, 14, and 30 days; shorten the interval after a miss and lengthen it after repeated independent success. These intervals are adjustable design defaults.

Cap ordinary review at 15–20 minutes. Prioritize prerequisites needed today, then repeated failures, then older due items. If due work repeatedly exceeds the cap, reduce new material; do not silently expand daily hours. After a long break, diagnose three core skills and rebuild the weak link rather than restarting the entire course.

Use four statuses: **learning with help → independent once → recalled after delay → transferred**. Do not promote based on one multiple-choice score. Store date, task, help used, failure cause, next cue, and next due date. A handwritten table is sufficient; this update does not claim an automatic scheduler exists.

## Confidence, winning, and genuine challenge

A useful small win is specific: “I found the failing input before reading the solution,” “I rebuilt the loop without notes,” or “I noticed that negative numbers break my earlier window rule.” It can occur before acceptance. Give feedback about the action and evidence, not talent.

Avoid a sequence of only trivial victories: it builds dependence on familiar tasks. Alternate a secure rep with one manageable uncertainty. Also avoid five simultaneous stretch tasks: failure then says little about which prerequisite was missing.

Track independent delayed solves, help level, bug recurrence, and recovery time. Ratings can become a secondary measure after contest participation is established. Codeforces uses rating titles and colors; CodeChef uses stars. Their scales are not interchangeable. [Codeforces titles announcement](https://codeforces.com/blog/entry/20638).

## Depth toward advanced CP

The existing advanced coverage is a launchpad, not an exhaustive competitive-programming curriculum. Day 139 originally combines convex hull trick, divide-and-conquer DP, Knuth optimization, and monotonic-queue DP in one unit. Each has different validity conditions and warrants separate study sessions. Likewise flow and matching need derivations and counterexamples, not template memorization.

Use the advanced roadmap as a set of multi-session modules. After the core, choose extensions based on contest errors: computational geometry, FFT/NTT and polynomial algorithms, persistent structures, advanced tree techniques, or deeper combinatorics. List prerequisites, prove the enabling condition, implement a small version, stress-test against brute force, and solve a new problem. No finite checklist guarantees a top rating.

## How to tell whether the redesign works

Run a four-week personal pilot. Record session time, help level, next-day and seven-day recall, one weekly unlabelled transfer problem, and a brief confidence estimate before attempting. Compare prediction with actual performance. A smaller number of new problems is acceptable if independent delayed performance improves.

If recall improves but transfer does not, add contrast cases and unlabelled tasks. If neither improves, inspect prerequisite knowledge and explanation quality before increasing difficulty. If sessions keep overrunning, split units and reduce new work. These observations guide adjustment; a single learner's improvement does not establish causal proof.

## Implementation scope

The accompanying changes revise daily practice/checkpoint data, beginner prerequisite wording, roadmap promises, syllabus, DSA authoring rules, and the reusable three-lecture generation prompt. The learner-facing study guide carries the start, stuck, review, and return-after-break routines. Existing topic coverage is retained. Advanced specialization remains an explicit continuing path. Lecture generation remains on demand; automatic scheduling is not claimed as part of this update.

Following the explicit request to generate the first batch, DSA Days 1–3 now apply this design in `public/data/lectures/dsa/phase1/`. They begin locally, separate attempts from feedback, provide five-task practice banks and delayed transfer cues, and avoid assuming platform fluency or future C++ tools. The [batch handoff](../../src/data/syllabus/dsaroadmap/generation-handoff.md) records actual taught prerequisites and verification. This is an implemented teaching design, not evidence of the learner's retention outcomes.
