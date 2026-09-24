# DSA with C++ Roadmap — Overview

## Outcome

A 146-unit, C++-first path from your first compiled program to advanced DSA and a
continuing competitive-programming practice. The stored A2Z checklist is a coverage
reference, not a daily solve quota. The path extends into number theory, advanced
structures, graphs, DP and contest craft. Completion does not guarantee a rating;
CodeChef stars and Codeforces titles are different systems.

Lectures are generated on demand in batches of three. Use the
[generation prompt](../../../../guidelines/lecture-generation.md), [study system](01-Study-System.md),
and [research report](../../../../docs/research/dsa-psychology.md). A generated lecture is not
evidence that the learner has studied or mastered it.

## How this course teaches (read `guidelines/dsa.md`)

- **Guided discovery.** Understand the task, produce a trace or naive plan, then receive
  hints, derivation and feedback. New syntax is taught, not left to be invented.
- **Five-task bank.** Guided warm-up, core, changed constraint, delayed recall, optional
  stretch. Usually attempt one or two core tasks; this is not five accepts per hour.
- **Local first, judges when ready.** Begin with compile/run/trace/debug tasks. Introduce
  the LeetCode harness after functions and CP input/output after foundation readiness.
- **Flexible units.** About four baseline hours each, across as many sessions as needed;
  additional review and advanced practice are expected.
- **Memory and transfer.** Short prerequisite retrieval, a capped manual review queue,
  weekly mixed tasks, early short virtual sets, and delayed phase gates.
- **Strict no-forward-reference ordering.** Recursion before sorting's merge/quick; heaps before
  any priority-queue graph problem; DSU before Kruskal; and so on.

## Sequence

| Phase | Days | Focus |
|---|---:|---|
| 1 | 1–7 | C++ & Complexity Foundations — Write, run, and put a price on small C++ programs before any data structure appears |
| 2 | 8–13 | STL Foundations & Problem-Solving Reflex — Become fluent with the containers and algorithms you will reuse for the entire course |
| 3 | 14–17 | Recursion Foundations — An unshakable grip on recursion over numbers, arrays and strings |
| 4 | 18–21 | Sorting Techniques — Implement the classic sorts, understand invariants, and use custom comparators fluently |
| 5 | 22–27 | Binary Search — on arrays & on the answer — Halving the search space, and the far more powerful binary-search-on-the-answer |
| 6 | 28–35 | Arrays: Easy to Medium to Hard — A deep bag of array techniques: prefix sums, two pointers, Kadane, intervals, matrix moves |
| 7 | 36–39 | Strings: Basic & Medium — Comfortable string manipulation and the medium classics (heavy algorithms come later) |
| 8 | 40–44 | Two Pointers & Sliding Window — The window / two-pointer engine that solves a huge class of subarray and substring problems in O(n) |
| 9 | 45–50 | Linked List — Full command of singly and doubly lists and the pointer-manipulation classics |
| 10 | 51–57 | Recursion Patterns & Backtracking — Turn recursion into a problem-solving engine: subsets, permutations, combinations, grid puzzles |
| 11 | 58–61 | Bit Manipulation — Think in bits: masks, tricks, and the subset / XOR problems that appear constantly |
| 12 | 62–67 | Stacks & Queues — Implement them, master expression evaluation, and the monotonic-stack pattern |
| 13 | 68–71 | Heaps / Priority Queues — The binary heap and priority_queue for top-K, scheduling and streaming-median problems |
| 14 | 72–75 | Greedy Algorithms — Recognize when local choices are globally optimal, and prove it |
| 15 | 76–83 | Binary Trees — Total command of tree traversals and the medium/hard tree problems |
| 16 | 84–87 | Binary Search Trees — Use the BST ordering property for fast search/insert/delete and the classic problems |
| 17 | 88–90 | Tries — The prefix-tree structure for fast string-prefix queries and bitwise-XOR problems |
| 18 | 91–101 | Graphs — Representations, BFS/DFS, toposort, shortest paths, MST and DSU, in a clean dependency order |
| 19 | 102–113 | Dynamic Programming — From recursion + memo to tabulation to space optimization across every major DP pattern |
| 20 | 114–117 | Advanced Strings — Linear-time string matching and structure: KMP, Z, hashing, Manacher |
| 21 | 118–122 | Number Theory & Combinatorics — The math toolkit for CP: sieve, modular arithmetic, inverses, combinatorics, matrix exponentiation |
| 22 | 123–128 | Advanced Data Structures — Range-query power tools: Fenwick, segment trees (+ lazy), sparse tables, Mo's |
| 23 | 129–134 | Advanced Graphs — The graph theory that separates strong CP: SCC, bridges, LCA, flows, matching |
| 24 | 135–140 | Advanced Dynamic Programming — The DP that wins contests: bitmask, digit, tree rerooting, SOS, and optimizations |
| 25 | 141–146 | Competitive Programming Craft & Contest Mastery — Turn technique into rating: constructive, game theory, interactive, and a real contest routine |

**Totals: 25 phases · 146 study units · ~584 baseline hours, plus review and continuing practice.**

## Daily learning contract

Each lecture: pose a problem cold → attempt the naive solution → break it on the constraints →
feel the missing tool → name and formalize it → rebuild the solution cleanly → name the exact
traps. It closes with mid-lecture quick-checks, a 10-question final quiz (graded client-side),
and the five-task bank with staged hints, complete solutions, correctness and cost
reasoning. Each batch leaves an authoring handoff; reviews are scheduled relative
to actual study dates and actual attempts.

## Final proof

The capstone (Day 146) is a self-run virtual contest (not an official rated event) plus upsolving, a tested reusable
C++ template/snippet library covering every structure in the course, a stress-testing harness, and
a weakness-based practice plan. Advanced units can take several sessions each; DP
optimizations in particular need separate derivations and counterexamples. After the
core, select further geometry, FFT/NTT, persistence or other specialization from
actual contest errors. Progress is measured, not promised.
