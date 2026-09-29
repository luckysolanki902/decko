# DSA (C++) Authoring Guidelines

Read this file whenever you edit the DSA roadmap, DSA lectures, phase data,
competitive-programming material, or DSA syllabus docs. The implementation language is
**C++** throughout.

Lectures are generated on demand, normally three at a time. Follow
[`lecture-generation.md`](lecture-generation.md), preserve a factual batch handoff,
and use the entry, help, review, pace, and gate rules in
[`../src/data/syllabus/dsaroadmap/01-Study-System.md`](../src/data/syllabus/dsaroadmap/01-Study-System.md).
The learning-design rationale and its limits live in
[`../docs/research/dsa-psychology.md`](../docs/research/dsa-psychology.md).

> **Read [`teaching-method.md`](teaching-method.md) first.** It is the
> cross-roadmap contract for failure-first teaching, prerequisite-safe examples,
> concrete traces, one idea per screen, honest claims, and neighbouring-lecture
> consistency. This file adds the DSA- and C++-specific contract.

The goal is not to produce a catalogue of algorithms or a folder of memorized
templates. It is to build a learner who can understand a problem, derive a workable
first solution, recognize why it fails, discover the missing structure, justify a
better algorithm, implement it safely, and find the smallest input that disproves a
wrong idea.

CodeChef stars and Codeforces titles are different rating systems. A course can prepare
the learner for continuing competitive-programming practice; no syllabus length,
acceptance count, or study duration guarantees a rating.

---

## The North Star: what “good” feels like

The WebD references define the explanatory bar. The first DSA batch demonstrates how
that bar becomes C++ and algorithm teaching.

| Reference | What to study in it |
|---|---|
| `public/data/lectures/webd/phase2/day13-js-runtimes-mental-model.md` | One durable mental model before syntax and a careful explanation of runtime behavior. |
| `public/data/lectures/webd/phase2/day14-functions-and-scope.md` | An invisible mechanism made visible with escalating traces. |
| `public/data/lectures/webd/phase2/day15-control-flow.md` | Exact edge cases and misconceptions rather than generic warnings. |
| `public/data/lectures/webd/phase4/day37-useeffect-error-boundaries.md` | The standard for letting a reasonable attempt work, break, and create the need for the new tool. |
| `public/data/lectures/dsa/phase1/day01-your-first-cpp-program.md` | A true zero-programming entry: compile/run loop, visible diagnostics, local practice, and no unexplained judge harness. |
| `public/data/lectures/dsa/phase1/day02-data-types-overflow-precision.md` | Language behavior taught through failing arithmetic, bounds, and corrected calculations rather than a type list. |
| `public/data/lectures/dsa/phase1/day03-conditionals-loops-problem-translation.md` | Control flow connected to statement translation, loop invariants, boundary tests, and state reset. |

Read at least one WebD reference and the most relevant existing DSA lecture before
writing. Study the causal flow, not its headings. Current reference lectures are
evidence, not infallible authority; newer instructions govern where they disagree.

---

## The DSA teaching promise

A lecture is not complete because it gives the optimal solution and passes the sample.
It must help the learner answer these questions:

1. **What exactly is the task?** Restate the input, required output, constraints, and
   ambiguous words with one tiny example.
2. **What would I try with no special technique?** Produce a correct first plan before
   optimizing it.
3. **Where does that plan fail?** Use a concrete counterexample or input bound, not the
   phrase “too slow.”
4. **What repeated work or hidden structure causes the failure?** Make the missing
   information or property visible before naming a pattern.
5. **Why does the improved algorithm work?** State what remains true, prove progress,
   and connect termination to the required answer.
6. **What does it cost?** Derive time and auxiliary space from counted operations,
   container costs, recursion depth, and input dimensions.
7. **Can I implement and test it safely in C++?** Cover types, bounds, ownership,
   invalidation, judge interface, and edge cases.
8. **When should I not use it?** State the preconditions and show the smallest changed
   problem that breaks the technique.

These form one reasoning chain:

```text
statement + constraints
        ↓ suggest
correct brute force
        ↓ exposes
repeated work / ordering / state / monotonicity
        ↓ creates
an invariant and a better representation
        ↓ justify
the optimized algorithm
        ↓ constrain
C++ implementation and complexity
        ↓ challenged by
counterexamples, stress tests, and changed problems
```

If the lecture begins at “optimized algorithm,” the learner sees a magic trick. If it
ends at accepted code, the learner has not learned when the trick is valid.

---

## Who the learner is

Assume no prior DSA knowledge and only the C++ syntax explicitly taught so far.

- Passive familiarity is not the target. Reading a solution may support learning, but
  it is not an independent solve, delayed recall, or transfer.
- Make an attempt possible before asking for one. The statement, notation, examples,
  and required syntax must already be understandable.
- A first attempt can be a trace, output prediction, brute-force plan, counterexample,
  or question. Independent invention of the final algorithm is not a prerequisite for
  understanding it.
- Productive struggle is bounded and followed by explicit consolidation. Confusion
  caused by missing prerequisites or vague prose is an authoring defect, not desirable
  difficulty.
- Fade help: fully worked case → partially completed case → independent problem →
  delayed changed problem.

Confidence should come from evidence the learner can explain: finding a failing input,
repairing a loop invariant, using less help, reconstructing after a delay, or choosing
the right technique in an unlabelled problem. Do not praise talent or treat an
acceptance badge as proof of mastery.

---

## Prerequisites: read, do not grep

The dependency graph is load-bearing. Before drafting, make a private prerequisite
ledger:

| Needed today | Earlier teaching source | Evidence it was explained | Action if missing |
|---|---|---|---|
| vector indexing | exact day/file | learner traced safe indices | retrieve briefly |
| recursion | exact day/file or none | call-stack trace and base case | teach first or move topic |
| ordered set | exact day/file or none | operations and costs derived | replace with known tool |

Open the earlier lecture around the term. A function or container appearing inside an
unrelated example does not establish that it was taught. If the learner could not
explain its contract and cost from that earlier material, it is a gap.

Repair a gap by replacing the example, teaching a focused bridge immediately before
first use, or moving the dependent material later. Do not write “you already know,”
“we will explain this later,” or “ignore this line for now.”

### Strict no-forward-reference rules

- Teach recursion on numbers, arrays, or strings before using recursive trees.
- Do not use `priority_queue` before heaps establish its model and costs.
- Do not use `set`, `map`, `unordered_set`, or `unordered_map` before the relevant STL
  container contract is taught.
- Merge sort and quicksort require recursion first.
- Dijkstra requires weighted-graph representation and a taught priority queue.
- Kruskal requires both sorting and DSU.
- Fenwick and segment trees require prefix/range reasoning and indexing conventions.
- Memoization requires recursion-state reasoning; tabulation requires the dependency
  order to be visible.
- An advanced library call cannot smuggle in the exact technique being taught.

Check `src/data/phases/dsa/index.ts`, the previous lecture, and the next lecture. The
previous day defines available vocabulary. The next day identifies tools still
off-limits and claims that must not contradict today's explanation.

---

## The Discovery Loop

Repeat this loop for each major idea. The problem comes before the definition, but the
attempt is sized to what the learner can genuinely produce.

1. **Pose a tiny concrete task.** Use numbers small enough to trace by hand. Do not put
   the technique in the heading.
2. **Clarify the contract.** Restate inputs, output, valid range, ordering, duplicates,
   empty cases, and whether input may be modified.
3. **Ask for an artifact.** Request two traces, a direct plan, a prediction, or one
   suspected edge case before revealing feedback.
4. **Build the obvious solution.** Let it be correct and useful. Show runnable code,
   not a caricature written to fail.
5. **Price it.** Count the work on a small input, generalize to the constraint, and
   estimate why it passes or fails.
6. **Expose the repeated work or missing memory.** Mark duplicated comparisons,
   recomputed subproblems, forgotten candidates, or an ordering property.
7. **Describe the desired ability.** Say what information a better solution must retain
   or avoid recomputing before naming the data structure or algorithm.
8. **Name and model the tool.** Give one predictive diagram or state table, its
   operations, preconditions, and costs.
9. **Derive the invariant.** State what is true before and after every meaningful step.
10. **Rebuild the original solution.** Keep the same input and names so the optimized
    code is the reasoning made executable.
11. **Prove and price it.** Explain correctness, termination, time, space, and any
    amortized or expected qualification.
12. **Break the optimized idea.** Change a condition—negative values, duplicates,
    disconnected graph, unsorted input, overflow, impossible target—and show whether
    the method survives.
13. **Extract a decision rule.** State the signals, preconditions, and counter-signals
    that should guide future selection.

Not every syntax lesson needs all thirteen beats. Every algorithmic idea needs the
causal spine: correct first attempt → measured failure → missing structure → invariant
→ justified improvement → counterexample boundary.

---

## Seamless flow: one investigation per concept

Carry one small running problem through the lecture. Keep its values, indices, names,
constraints, and indexing convention stable. Change only one condition at a time, and
state why the previous example can no longer answer the next question.

The last sentence of each screen should create the question answered by the next. Read
only those last sentences and subsequent headings. If the transition feels like “now
let us learn another method,” the lecture is a topic list rather than an investigation.

Strong transition:

```text
The left pointer never needs to move backward—but only because every value is positive.
        ↓
## One negative value destroys that monotonic movement
```

Weak transition:

```text
Now that sliding window is clear, let us discuss prefix sums.
```

One screen answers one learner question. A definition, full trace, proof, code,
complexity analysis, three edge cases, and comparison usually require separate screens.
Comments in code are not a substitute for prose. Tables summarize concepts after they
are taught; they do not introduce five techniques at once.

---

## The lecture arc

Use this as a causal scaffold rather than a rigid heading template:

1. **`## Why this day exists`** — the shortest screen: roughly 10–20 lines, one
   familiar problem, no agenda, no prerequisite list, no untaught term, and at most one
   tiny code block. The failure belongs on screen two.
2. **Readiness retrieval** — one recent prerequisite and one older relevant bug, asked
   closed-notes after the opener; feedback appears later.
3. **Problem contract and sample trace** — remove ambiguity before technique discovery.
4. **Reasonable first solution** — code or pseudocode using only known tools.
5. **Concrete failure** — wrong answer, operation count, memory growth, recursion depth,
   or judge verdict made visible.
6. **Missing structure and mental model** — what the solution needs before the name.
7. **Operations and invariant** — derive one at a time with state traces.
8. **Correctness argument** — why every step preserves truth and why termination gives
   the required answer.
9. **C++ implementation** — smallest complete version, then any abstraction that
   improves clarity without hiding the mechanism.
10. **Complexity derivation** — time and auxiliary space from the actual code.
11. **Boundary and contrast cases** — when the pattern works, almost works, and fails.
12. **Debugging and testing** — diagnose a deliberate bug and stress against an oracle
    where appropriate.
13. **`## Practice`** — the five-task bank with attempts, later hints, and later
    solutions.
14. **`## Common mistakes`** — consolidation only; no new teaching after the practice
    boundary.
15. **`## Cheat sheet`** — decision-oriented reference, not a template dump.
16. **`## Tomorrow`** — one unresolved problem that naturally creates the next day.
17. **Final quiz** — exactly 10 questions.

`## Practice` opens the deck's practice chapter. Keep `## Cheat sheet` → `## Tomorrow`
contiguous as the wrap-up tail. Follow [`deck-chapters.md`](deck-chapters.md); these
headings affect the rendered navigation.

---

## Problem statements need teaching too

Do not assume that reading a competitive-programming statement is a transparent skill.
For the first problem of a new statement shape, explicitly identify:

- unit of input and number of test cases;
- whether indices in the statement are 0-based or 1-based;
- whether a subarray must be contiguous;
- whether “subsequence,” “subset,” “path,” “simple path,” or “distinct” has a technical
  meaning;
- allowed mutations and required output order;
- constraint dimensions—`n`, `m`, `V`, `E`, value range, query count, test-case sum;
- the sample's state changes, not only its final output; and
- at least one valid case not represented by the sample.

Translate prose into a contract before writing code:

```text
Given:      array a of n integers
Return:     length of a contiguous segment
Condition:  segment sum is at most k
Known:      all a[i] are positive
Must handle: no valid non-empty segment
May change a: no
```

The word “positive” is then visible as an algorithmic condition, not decorative text.

---

## Trace state, not narration

“Move the pointer and update the sum” does not teach what the algorithm knows. A trace
must expose the state that drives the next decision.

Use a table when several values evolve together:

| Step | left | right | new value | current sum | best | Why this move is legal |
|---:|---:|---:|---:|---:|---:|---|

Before the table, define what each column means and whether the interval is `[left,
right]` or `[left, right)`. After it, interpret the decisive row in prose.

Trace standards:

- Use a small input with a boundary, duplicate, tie, or other revealing feature.
- Show state before and after the operation when mutation matters.
- Mark what is discarded and why it can never be needed again.
- For recursion, show call, parameters, local state, child return, and final return.
- For graphs, show frontier/queue, visited or distance state, chosen edge, and stale
  entries when relevant.
- For DP, show state meaning, dependency, transition candidates, chosen value, and
  computation order.
- Stop once the pattern is established; then ask the learner to complete the trace.

Every trace must agree exactly with the supplied code's indexing, update order, and tie
behavior.

---

## Invariants and correctness proofs

An invariant is not a ceremonial sentence. It is the fact that makes the next step
safe. Introduce it after the learner has seen what would go wrong without it.

For an iterative algorithm, answer:

1. **Initialization:** why is the invariant true before the first iteration?
2. **Maintenance:** assuming it is true now, why does this operation preserve it?
3. **Progress:** what strictly moves toward termination?
4. **Termination:** when the loop stops, how does the invariant imply the requested
   result?

For recursion, state:

- what `solve(state)` promises to return;
- the smallest state that can be answered directly;
- why each recursive call is a smaller valid instance;
- how returned answers combine; and
- why all paths terminate.

Choose the proof style that exposes the algorithm's mechanism:

- **Induction** for recursively defined results or prefixes of work.
- **Exchange argument** for greedy choices: transform an optimal solution to include
  the chosen item without making it worse.
- **Contradiction** when assuming a missed better answer conflicts with maintained
  state.
- **Cut/cycle property** for MST choices after those properties are taught.
- **State dependency proof** for DP: all and only valid previous states are considered.
- **Amortized argument** when occasional expensive operations are paid for across a
  sequence.

Do not write “clearly,” “obviously,” or “it can be proved.” Write the missing proof
step. Do not claim an invariant that is false at the moment the code checks it; align
the wording with the update order.

### Proof and code must correspond

Annotate the explanation, not every line, with the proof obligation each block
fulfills:

```text
discard impossible prefix  → safe because all future right endpoints only increase sum
record current length       → window is valid at this exact point
advance right               → explores the next not-yet-considered endpoint
```

If the code contains a branch the proof never discusses, the proof is incomplete. If
the proof assumes sorted input but the code never sorts or receives that guarantee,
the implementation is incomplete.

---

## Complexity must be derived from work

Before Big-O is taught, count exact comparisons, assignments, recursive calls, and
stored values on concrete inputs. When notation arrives, show what information it
keeps and what it intentionally discards.

For every implementation:

1. Identify all independent input dimensions and constraint sums.
2. Count how often each loop body, recursive state, edge, element, or container
   operation can occur.
3. Include the cost of work inside loops—sorting, substring construction, copying,
   hashing, comparison, or heap operations.
4. Add sequential phases; multiply genuinely nested work.
5. Separate auxiliary space from input/output storage and include recursion stack.
6. State worst-case, expected, amortized, or average-case qualification explicitly.
7. Connect the result back to the actual maximum constraints.

Do not infer complexity from indentation alone. Two nested pointers can be O(n) when
each moves forward at most n times. One visible loop can be O(n²) if it repeatedly
erases from the front of a vector or constructs growing strings.

### Qualifications that must not disappear

- Hash-table operations are generally expected average O(1), with worse theoretical
  cases; do not state unconditional O(1).
- `vector::push_back` is amortized O(1), not O(1) for every call.
- Balanced ordered containers are O(log n) for their standard searches/updates, with
  comparison costs when keys are non-trivial.
- Recursive space includes maximum active call depth, not total calls.
- Outputting k answers already costs Ω(k).
- Sorting comparisons may be O(n log n), while copying or comparing large objects can
  change the practical and formal cost.
- Bitset, word-level, and pseudo-polynomial algorithms need their parameter dependence
  stated honestly.

Never use “fast enough” without evaluating the real bounds and language costs. Avoid
universal operations-per-second folklore; if a rough contest estimate is used, label it
as an environment-dependent sanity check, not a proof.

---

## C++ is part of the algorithm

Every new language feature or standard-library operation gets its contract, cost,
mutation behavior, invalidation rules, and smallest failure case.

### Types and arithmetic

- Teach bounds before choosing `int` or `long long`.
- Show that storing into `long long` does not repair multiplication already performed
  as `int`; widen an operand first.
- Signed overflow is undefined behavior. Do not teach observed wraparound as a rule.
- Explain integer division, remainder with signed values when relevant, and floating
  precision before using them in logic.
- Audit midpoint, sum, product, distance, path cost, and sentinel expressions for
  overflow.
- Use a sentinel only if it cannot collide with a valid value and its later arithmetic
  is safe.

### Containers and algorithms

For each introduced container, show:

- logical model and memory/ordering behavior relevant today;
- construction and empty state;
- core operations and costs;
- references/iterators invalidated by mutation;
- copy cost and when to pass by `const&` or by value;
- duplicate and ordering semantics; and
- one situation where another container is the better choice.

For STL algorithms such as `sort`, `lower_bound`, `reverse`, or `accumulate`, teach
range convention, preconditions, return value, cost, comparator contract, and edge
cases. Do not let a one-line call hide the exact mechanism currently being learned.

### Memory and ownership

Prefer safe standard containers. When pointers, linked nodes, or manual allocation are
the lesson, draw ownership and lifetime. Distinguish null pointer, dangling pointer,
memory leak, double delete, and stack lifetime through concrete programs. Do not add
manual memory management merely to make a data structure look traditional.

### Undefined behavior and portability

Name C++ failures precisely:

- out-of-bounds access;
- use of invalidated iterator/reference;
- reading an uninitialized value;
- signed overflow;
- invalid shift count or signed shift assumptions;
- comparator that violates strict weak ordering;
- dereferencing `end()` or an empty container's unavailable element;
- excessive recursion depth;
- mixed signed/unsigned comparison surprises.

`#include <bits/stdc++.h>` is convenient on common GNU contest toolchains but is not a
standard C++ header. Teach the trade-off and use the include style appropriate to the
declared environment. Likewise, fast I/O settings need an explained reason; they are
not ritual lines.

### Complete and runnable code

The first full solution must compile in the stated language standard and match the
stated interface. Explain whether it is:

- a local program with `main` and standard input/output;
- a LeetCode-style method called by a hidden harness; or
- a reusable function tested by a local driver.

Do not mix interfaces without explanation. Show exact input and expected output for
local code. Keep snippets small, but never omit a line required to understand the
mechanism and then label the fragment “complete.”

---

## From brute force to optimization without teleporting

Every optimization must remove identified work or exploit a proved property.

```text
Brute force repeats what?
        ↓
Can we remember it, order it, or avoid reconsidering it?
        ↓
What invariant makes that safe?
        ↓
Which data structure supports the required operations at the needed cost?
```

When multiple levels exist, show meaningful intermediate solutions. Do not force three
versions when the middle one teaches nothing, but do not jump from O(n³) to O(n log n)
with “we can optimize this.”

For each version, preserve a comparison table only after teaching it:

| Version | Repeated work removed | New invariant/structure | Time | Extra space | New risk |
|---|---|---|---|---|---|

The best asymptotic complexity is not automatically the best teaching or production
choice. Small constraints, implementation risk, constants, memory, online updates,
and need for reconstruction can make a simpler method preferable. State the decision
under the given constraints.

---

## Counterexamples, tests, and stress testing

Samples demonstrate the statement; they do not validate the solution. Teach the
learner to construct tests from assumptions and branches.

### Minimum test set

Choose applicable cases rather than pasting a generic list:

- smallest valid input;
- one element below/at/above a threshold;
- empty result or impossible case when allowed;
- all equal, strictly increasing, strictly decreasing;
- duplicates and ties;
- negative, zero, and extreme magnitude values;
- answer at the first or last position;
- disconnected, cyclic, or multi-edge graph cases;
- maximum depth or skewed structure;
- case that forces every branch or state transition;
- case that violates the optimized method's precondition.

For every deliberate bug, first ask for the smallest failing input. Then trace the
first state where actual behavior diverges from the invariant.

### Brute-force oracle

When feasible, keep the simple correct solution as an oracle. Generate many small
valid inputs, compare outputs with the optimized implementation, and stop on the first
mismatch. Explain:

- how inputs are generated;
- why small exhaustive/random cases are useful;
- what both implementations might still get wrong together;
- how to preserve the seed and failing case; and
- why stress testing supports but does not replace a proof.

Do not use random testing before randomness and the harness syntax can be explained.
A hand-enumerated comparison is the earlier-course alternative.

---

## Diagnose verdicts, do not patch blindly

Teach the evidence path for each failure:

| Verdict/symptom | First evidence to inspect | Common cause families |
|---|---|---|
| Compile error | first diagnostic and referenced line | syntax, type mismatch, missing declaration/header |
| Runtime error | smallest crashing input, sanitizer/stack trace | bounds, empty access, division by zero, recursion depth |
| Wrong answer | first divergent state on a minimal counterexample | invariant, boundary, reset, overflow, misunderstood contract |
| Time limit exceeded | operation counts and hot path | wrong complexity, hidden copy, container misuse, repeated work |
| Memory limit exceeded | allocation sizes and active states | oversized table, copies, recursion, retained structures |
| Output mismatch | exact bytes/tokens expected | formatting, extra text, wrong order, missing newline where relevant |

Use compiler warnings and sanitizers when the environment supports them. Explain what
they catch and what they do not. Never present “add prints everywhere” as the debugging
method; choose state that can falsify the invariant.

After the repair, rerun the original failing case, nearby boundaries, and at least one
previously passing case. A patch that fixes one input can introduce another bug.

---

## Pattern recognition without template memorization

Never teach a pattern as “when you see these words, paste this code.” Teach five parts:

1. **Signal:** what repeated work or structural property suggests the technique?
2. **Precondition:** what must be true for it to be correct?
3. **Invariant/state:** what information does it maintain?
4. **Counter-signal:** what changed condition breaks or weakens it?
5. **Contrast:** which nearby technique is tempting, and why is it wrong here?

Examples:

- Sliding window is not “subarray means two pointers.” Its monotonic movement often
  depends on how extending/shrinking affects validity; negative values can break a sum
  condition that positives made monotone.
- Greedy is not “take the locally best choice.” The choice needs an exchange, cut, or
  staying-ahead argument.
- DP is not “recursion plus memo.” Define the state, prove it contains enough history,
  enumerate valid transitions, establish base cases, and choose an acyclic evaluation
  order.
- Binary search on answer is not “the answer is a number.” A monotone feasibility
  predicate must divide the search space.
- BFS is not universally shortest path. It gives fewest edges in an unweighted graph;
  weighted settings require different conditions and tools.

Mixed practice must omit the technique label. Ask the learner to justify both the
chosen method and the rejected near-neighbour.

---

## Depth by topic family

The discovery method remains constant; the proof and trace evidence change.

### C++ foundations and complexity

- Explain the compile/run model, errors, types, scope, calls, references, and standard
  input/output before judge abstractions.
- Count concrete work before asymptotic notation.
- Show value changes, lifetime, copies, and memory layout only to the depth needed for
  later correctness and cost reasoning.
- Make every new syntax form runnable in isolation before it carries an algorithm.

### Arrays, strings, hashing, and pointer patterns

- Fix an indexing and interval convention and maintain it visibly.
- Derive prefix/suffix information from repeated range work.
- State whether order, contiguity, duplicates, or sign restrictions matter.
- For hashing, explain key equality, frequency/state meaning, missing keys, and expected
  costs.
- For two-pointer/window methods, prove why discarded positions never need to return.

### Recursion, backtracking, and divide-and-conquer

- Draw call frames and the shrinking measure before code.
- Separate choice, constraint, recursive call, and undo.
- Trace mutable shared state before and after backtracking.
- Distinguish number of states, branching factor, depth, work per state, and output
  size.
- For divide-and-conquer, show split, recursive contracts, combine step, and recurrence
  through concrete levels before general notation.

### Sorting and binary search

- Teach the ordering property each algorithm establishes, not only swaps.
- Derive stability, in-place behavior, worst/average cases, and input sensitivity where
  relevant.
- For binary search, write the search-space meaning and invariant before `while`.
- State whether bounds are inclusive or half-open and prove each update removes at
  least one candidate without discarding a valid answer.
- For answer search, prove predicate monotonicity before code.

### Linked lists, stacks, queues, heaps, and trees

- Draw nodes, links, ownership, top/front/root, and empty state.
- Show how each mutation reconnects structure without losing access.
- Derive stack/queue applications from the information that must be remembered in
  order.
- For heaps, distinguish heap order from full sorting and trace sift operations.
- For trees, define subtree contracts and trace both traversal order and returned
  information. Include skewed depth and null children.

### Graphs and DSU

- Define vertex/edge direction, weight, indexing, and disconnectedness before storage.
- Compare adjacency list/matrix costs under actual `V` and `E`.
- Trace frontier, visited timing, parent/distance, and stale entries.
- State the conditions for shortest-path and MST algorithms precisely.
- For DSU, derive parent/rank-or-size state, path compression, union policy, and the
  near-constant amortized qualification without pretending each operation is literally
  constant.

### Greedy algorithms

- Let a plausible greedy rule fail first when possible.
- Identify the actual choice, remaining subproblem, and feasibility condition.
- Supply an exchange, staying-ahead, cut, or structural proof.
- Include a near-neighbour problem where the greedy rule fails and DP or another method
  is required.

### Dynamic programming

- Start from a recursive decision tree or repeated dependency, not a table template.
- Define state in a full sentence and test whether it contains enough information.
- Derive transitions by enumerating legal last/next choices.
- Establish base cases from state meaning, not memorized initialization.
- Show memoization, tabulation order, and space optimization as separate transformations.
- Prove overwritten states are no longer needed before compressing memory.
- Distinguish pseudo-polynomial complexity from polynomial in input bit length.

### Tries, range queries, number theory, and advanced structures

- Motivate the operation mix that simpler containers cannot support efficiently.
- Draw stored summaries and update/query paths.
- Prove merge/combination rules and identity elements where relevant.
- State indexing, overflow, modular arithmetic, and laziness invariants precisely.
- Compare against a brute-force oracle on small cases.
- Advanced optimizations must derive their enabling condition and include a
  counterexample where the condition fails.

### Competitive-programming craft

- Teach statement triage, constraint reading, skipping, time allocation, testing,
  submission verdicts, and upsolving as observable skills.
- Use short low-stakes virtual sets after foundation readiness, not only at course end.
- Analyze why a problem was missed: statement, idea, proof, implementation, testing,
  complexity, or contest decision.
- Do not convert ratings, difficulty labels, or editorial availability into claims
  about learner ability.

---

## Practice bank: five roles, not five daily accepts

Each concept lecture provides five suitable tasks across sessions:

1. **Guided warm-up** — same mechanism, small input, one scaffolded step.
2. **Core application** — independent implementation of the central idea.
3. **Changed constraint** — a precondition, output, or bound changes; the learner must
   adapt or reject the original method.
4. **Delayed reconstruction** — solve after the notes and solution are closed, scheduled
   for a later session.
5. **Optional stretch** — one meaningful combination or harder proof, not prerequisite
   for continuing today.

Usually assign one or two core attempts in a session. The bank is not a one-hour quota
and not proof of mastery.

### Task contract

Every task includes:

- complete statement or verified official link;
- input/output format and constraints;
- prerequisite note;
- target evidence—trace, proof, code, tests, or all four;
- adjustable expected effort range;
- three progressively revealing hints;
- complete runnable or judge-compatible C++ solution;
- correctness explanation tied to the code;
- time and auxiliary-space derivation; and
- at least one edge test and one changed-condition question.

Put task, hints, and solution on successive screens. Do not reveal feedback beside the
attempt. The hints should be:

1. **Nudge:** points to the failing observation or useful representation.
2. **Insight:** states the missing invariant or subproblem.
3. **Approach:** outlines the algorithm without supplying line-by-line code.

After each hint, require another artifact. If the learner reads the full solution, ask
them to explain the missing step, close it, rebuild, and test. Mark that as learned with
help; do not relabel immediate reconstruction as independent.

### Choosing platforms

- Start locally until compile/run, scalar input/output, tracing, and basic debugging are
  comfortable.
- Introduce a LeetCode method/class harness only after functions and required containers
  are taught.
- Introduce Codeforces/AtCoder/CSES standard-input workflows only after the learner can
  parse multiple cases, produce exact output, and diagnose basic verdicts.
- Read the official statement and constraints before selecting any external problem.
  A platform's “Easy,” rating, or letter is not a prerequisite check.
- Use LeetCode for suitable interview-shaped tasks and Codeforces, AtCoder, or CSES for
  suitable contest-shaped work. No single platform is mandatory for every topic.

External problem content can change. Verify current statements, constraints, and
availability at authoring time. Link to the official problem, and do not reproduce
substantial copyrighted statements when a concise self-contained restatement or link
is sufficient.

---

## Retention, mixed practice, and contests

A numbered day is a study unit, not a deadline. Roughly four baseline hours may span
several sessions. A useful default is about 150 minutes guided study and 90 minutes of
practice, feedback, and recall; advanced modules may take substantially longer.

- Begin after the short opener with two actual prerequisite retrieval cues, with
  feedback on later screens.
- Add at most two durable review cues per session.
- Start reviews around 1/3/7/14/30 days after actual study and adapt to performance.
- Keep ordinary review near 15–20 minutes. If it repeatedly overflows, reduce new work
  and repair the weakest dependency.
- Include a weekly mixed problem whose heading does not disclose the technique.
- After several independent foundation solves, add a 30–45-minute two-problem virtual
  set; rehearse skipping, returning, and upsolving.
- Record learned-with-help, independent-once, delayed-recalled, and transferred
  separately.

At phase gates require: a closed-notes explanation of one invariant, independent
implementation, diagnosis of a deliberate bug, complexity derivation, and an unlabelled
changed problem after a delay. A failed gate triggers targeted repair, not a full-course
restart.

---

## Sources and factual accuracy

Use primary or authoritative sources for facts that can change or are easy to state
incorrectly:

- official C++ references or the language standard for library behavior and complexity;
- official judge statements for problem constraints and interfaces;
- original papers or trusted algorithm texts for specialized algorithms;
- official platform documentation for ratings, verdicts, and contest behavior.

Distinguish language guarantees from common implementation behavior. Examples:

- do not promise the exact growth factor of `vector`;
- do not promise a fixed byte width for every fundamental type when the standard gives
  a minimum or implementation-dependent range;
- do not treat one compiler's signed-overflow result as specified;
- do not state hash operations as worst-case O(1);
- do not infer a problem's current constraints from an old editorial.

When a claim depends on a compiler, standard version, judge, or platform, name it.

---

## Markdown and deck contract

DSA lectures are markdown decks rendered by `src/components/LectureDeck.tsx`.

- Path: `public/data/lectures/dsa/phaseN/dayNN-kebab-slug.md`
- Variant: `dsa`
- One file per day.
- Phase data source of truth: `src/data/phases/dsa/index.ts`
- Roadmap metadata: `src/data/dsa.ts`
- Human syllabus: `src/data/syllabus/dsaroadmap/`
- Coverage floor: `src/data/syllabus/dsaroadmap/_source-striver-a2z.md`

Keep phase title, filename, `# Day N:` heading, duration, focus, syllabus, and visible
card consistent.

### Hard structure

- First line: `# Day N: Title`
- Second non-empty line:
  `**Duration: ~4h baseline; split across sessions | Focus: …**`
- Separate screens with `---` on its own line.
- Use `cpp` language tags for C++ fences.
- Include **4–7** mid-lesson `quiz` blocks after major concept beats.
- End with exactly one `finalquiz` containing exactly 10 multiple-choice questions.
- Open the problem bank with `## Practice …` or `## Problem 1 …` and preserve the
  contiguous `## Cheat sheet` → `## Tomorrow` wrap-up tail.

The current renderer supports GFM but does not include LaTeX math rendering. Use
readable Unicode and fenced `text` equations rather than raw `$...$` or `$$...$$`.

Follow [`quiz-blocks.md`](quiz-blocks.md) for the complete JSON contract. Multi-line code
inside a quiz string needs a language-tagged fence encoded with `\n`; the outer quiz
block closes with a bare fence. Never refer to an answer by letter, position, “above,”
or “below,” because options are shuffled.

### Quiz quality

Quick checks test a misconception made answerable by the preceding screens. The final
quiz covers the whole lecture with a healthy mix of `single_correct` and
`multiple_correct` questions.

Prefer questions that ask the learner to:

- predict an output or next state;
- complete a trace;
- identify the invariant a line preserves;
- find the smallest failing input;
- distinguish compile error, undefined behavior, wrong answer, and performance issue;
- derive complexity from code;
- choose a valid method under constraints; or
- identify the changed condition that invalidates an algorithm.

Every distractor should encode a real mistake. Explanations describe choices by
content, not by position, and explain why tempting wrong reasoning fails. Distribute
authored correct IDs and vary the number of correct choices in `multiple_correct`
questions; runtime order is randomized.

### Visual and typography rules

- Use ASCII diagrams for memory, pointers, trees, recursion, graph flow, and ownership.
- Use state tables for evolving multi-variable algorithms.
- Use tables for consolidation and comparison only after teaching the entries.
- Keep code blocks focused—usually 15–40 lines—and split large programs at conceptual
  boundaries.
- Code comments explain invariants, bounds, ownership, or non-obvious reasons; they do
  not narrate obvious syntax.
- Use blockquotes sparingly for one durable rule.

---

## App wiring

The DSA phase file uses the older `Phase` shape (`id/number/icon/color/days` plus
`sections`), like Go and WebD rather than DAML. When wiring routes, cards, and
`RoadmapSection`, mirror the Go/WebD route pattern and register `dsaRoadmap` the same
way as `goRoadmap` and `webdRoadmap`. Do not silently migrate data shapes as part of a
lecture-authoring change.

---

## Tone

Write like a calm senior competitive programmer and teacher working beside one learner.
Be precise, curious, and explicit about uncertainty. Use “we” for shared reasoning and
“you” for a learner action. Short sentences are useful; compressed logic is not.

Avoid hype, gatekeeping, rank promises, textbook throat-clearing, and cleverness that
hides the invariant. Never use “Welcome,” “In this lecture,” “we will now learn,”
“obviously,” “simply,” “trivial,” or “just.” A problem is not easy because its platform
label says so.

Interesting DSA teaching does not require a fantasy story around every array. Interest
comes from a live puzzle, a plausible idea, a counterexample that changes the learner's
mind, a hidden structure becoming visible, and code whose behavior they can now
predict.

---

## Authoring workflow

### Before drafting

1. Read `teaching-method.md`, this file, the phase entry, syllabus entry, previous day,
   next day, generation handoff, and at least one relevant exemplar.
2. Write the learner transformation: what can they independently trace, justify,
   implement, and diagnose after this unit?
3. Build the prerequisite ledger and repair plan.
4. Choose the running problem, tiny input, brute force, constraint that breaks it, and
   the observable failure.
5. Write the intended invariant and proof outline before writing optimized code.
6. Identify the smallest counterexample to the most tempting wrong approach.
7. Decide how complexity will be derived and which input dimensions matter.
8. Select the five practice roles and verify every external problem's prerequisites and
   current official statement.
9. List every new C++ feature, standard-library operation, and behavior that needs its
   contract explained.
10. Sketch the screen chain as learner questions rather than topic names.

### During drafting

1. Keep the opener short and in established vocabulary.
2. Ask for a concrete artifact before each major reveal.
3. Keep the same input and names from brute force through optimization.
4. Introduce one abstraction per screen.
5. Trace actual state and update order.
6. Tie each code block to an invariant or proof obligation.
7. Derive costs from the implementation, including hidden container and copy costs.
8. Show the wrong output or verdict and diagnostic before the repair.
9. State preconditions and a breaking contrast case as soon as the algorithm works.
10. Keep task, hints, solution, proof, and complexity on intentionally separated screens.

### Read-back pass

Read as a learner who cannot see the solution in your head:

- Can they restate the problem and produce the first attempt with known syntax?
- Is the naive method genuinely correct before it is made too slow or too large?
- Is the failure quantified with real constraints?
- Does the mental model predict the trace?
- Is the invariant true at the exact point the prose claims?
- Does the proof cover every branch and termination?
- Does the complexity match the actual code, copies, recursion, and container costs?
- Are C++ behavior and portability claims exact?
- Does every optimized method include its preconditions and a contrast case?
- Can every complete program compile and every stated test produce the shown output?
- Do practice tasks fade help and include delayed, unlabelled transfer?
- Does `Tomorrow` emerge from an unresolved limit already shown?

When something feels vague, add the missing state, failing input, proof step, or counted
operation. Do not fix confusion by deleting the mechanism or replacing it with a
template.

---

## Validation before calling a lecture done

1. Confirm phase data, syllabus, filename, title, duration, focus, and visible card are
   consistent.
2. Confirm the first two lines, screen separators, chapter boundary, 4–7 quick checks,
   one final quiz, and exactly 10 final questions.
3. Run `npm run validate:quizzes`; use it for JSON and quiz shape, not authored
   answer-position balance.
4. Check prose and quiz fences, including language tags inside JSON strings.
5. Compile every complete C++ program using the declared standard in a clean temporary
   directory. Run stated valid tests and compare exact output.
6. Compile contextual fragments inside the minimum documented harness where practical.
   Do not execute intentionally infinite, undefined, or destructive examples.
7. Use warnings and sanitizers where supported for relevant examples; record platform
   limitations rather than pretending one tool proves correctness.
8. Recalculate traces, complexity, bounds, overflow, and proof claims independently of
   the prose.
9. Read the actual prerequisite lectures and search for containers, syntax, algorithms,
   or proof ideas scheduled later.
10. Search the previous and next lecture for the main topic and reconcile contradictions.
11. Verify official external problem statements, constraints, and links.
12. Run `npm run typecheck`, `npm run lint`, and `npm run build` for a finished batch or
    before a pull request, in addition to quiz validation.
13. Spot-check `/dsa/notes/<slug>` in the browser: navigate every screen, inspect tables
    and code wrapping, answer a quick check, grade the final quiz, and confirm chapter
    boundaries.
14. Update `src/data/syllabus/dsaroadmap/generation-handoff.md` with what was actually
    taught, prerequisite repairs, compile/test evidence, review cues, unresolved limits,
    and what the next lecture may safely assume. Never invent learner mastery.

---

## Universal repository rules

- Protect work you did not create; never revert unrelated changes.
- One lecture file per day; never combine a range of days.
- Use npm, not pnpm or yarn.
- Stage only files relevant to the request.
- Commit and push only when explicitly asked; prefer a feature branch.
