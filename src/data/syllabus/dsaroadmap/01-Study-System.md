# How to study DSA and start practising

This course has 146 numbered study units, generated as lectures in batches of three.
One unit may take several sessions. The numbering is an order, not a deadline.

## Start where your hands can succeed

On Day 1, run a tiny local C++ program, change its output, read one number after its
declaration is explained, and repair a compiler error. That is real programming
practice. You do not need to open LeetCode yet.

After conditions, loops and functions, try a scalar problem such as
[Number of Steps to Reduce a Number to Zero](https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/).
First explain the C++ judge wrapper: the platform calls the supplied method and
checks the returned result. The method is not a standalone `main` program. If that
interface is still confusing, do the same reasoning locally before submitting.

After vectors, try [Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array/)
with prefix accumulation explained first. A platform's “Easy” label does not mean
you already know all the tools it requires.

Before Codeforces or AtCoder practice, show that you can read a statement, trace a
sample, parse standard input, write a direct loop, test a small edge case and fix a
wrong answer. Use prerequisite-screened tasks; a low rating or an A label alone
does not guarantee suitability. The [AtCoder beginner collection](https://atcoder.jp/contests/abs/tasks)
and [USACO entry guidance](https://usaco.guide/general/expected-knowledge) are sources
to choose from, not extra mandatory courses.

## What to do in a 90-minute session

| Minutes | Action | Evidence to keep |
|---:|---|---|
| 10 | Retrieve a recent mechanism and an older bug without notes | Your attempt, then correction |
| 25 | Study one concept beat with prediction pauses | One hand trace or small explanation |
| 40 | Attempt one suitable task | Plan, code, tests, assistance used |
| 10 | Read feedback and repair the weak step | Cause of the error and a counterexample |
| 5 | Close the solution and plan the revisit | One or two review cues |

This is a starting allocation. If you have 45 minutes, split the session. If you
have four hours, use several blocks with breaks rather than four hours of reading.
Extra explanation is welcome when needed; progress depends on producing something.

## Before revealing an answer

Write at least one concrete artifact: two sample traces, a brute-force plan, an
output prediction, or a specific question. An incorrect artifact is useful because
feedback now has something to correct. “I thought about it” is harder to inspect.

If you cannot restate the problem, clarify it immediately. If you understand it
but have no approach, try a smaller input. If syntax is missing, learn that syntax
through a tiny worked example. You are not expected to invent the language.

For a new concept, a 5–10-minute attempt is enough to expose a question. For an
ordinary independent problem, try around 15–25 minutes while making progress.
Continue a promising line; take a hint when stalled. These are adjustable defaults,
not deadlines or scientifically optimal intervals.

Read hints one at a time: nudge → insight → approach. After each hint, do something
with it. If you need the full solution, explain the missing step, close the solution,
rebuild it, and test it. Mark this as learned with help, then revisit later.

## How much practice is enough today?

The lecture's five-task bank contains guided, core, changed-constraint, delayed-recall
and optional stretch work. Usually attempt one or two core tasks in a session.
Do not force five accepts in an hour. A hard task may take multiple sessions.

Try four new-content sessions, one mixed-review session, one optional contest/project
session and one rest/buffer day per week. Adapt to your available time. After several
independent foundation solves, start a 30–45-minute virtual set with two suitable
problems. Learn to skip, return, and upsolve one task afterward. Live contests are
optional at first; your score is information about the next practice choice.

## Remember the mechanism, not an entire solution script

Keep a small manual table:

| Cue/task | Last attempt | Help | Failure cause | Next revisit |
|---|---|---|---|---|
| Explain a loop boundary with a tiny example | Actual date studied | none / hint / solution | boundary / syntax / idea / testing | Actual chosen date |

Add at most two durable cues per session. Initially revisit around 1, 3, 7, 14 and
30 days **after studying**, then adjust. A miss gets feedback and a sooner small
retry; repeated independent success gets more spacing. Occasionally reconstruct
code and solve a changed problem—verbal cards alone cannot test implementation.

Keep ordinary review within 15–20 minutes. First retrieve prerequisites needed
today, then recurring mistakes, then older due items. If the queue keeps overflowing,
reduce new content. After a break, diagnose three core skills and repair the weakest;
do not restart the whole course or repay every missed review in one sitting.

## A useful phase gate

Choose a representative technique from the phase. Explain its invariant or why it
works, implement it without the solution, diagnose a deliberate bug, and solve an
unlabelled variation after a delay. Use two separate study dates where possible.
If a step fails, repair that dependency and retry a smaller task. A quiz helps
locate misconceptions but does not replace this gate.

Record four states separately: learned with help, independent once, recalled after
a delay, transferred to a changed task. Your LLM cannot infer these from generated
files. Supply real attempt notes when asking for a tailored next batch.

## Confidence and the advanced path

Count wins you can explain: found a counterexample, reduced help, recovered an old
idea, repaired a bug, or chose the right technique without seeing its label. An
honest failed attempt can reveal progress. Avoid comparing one week's practice with
someone else's years of contests.

Advanced units are multi-session modules. Day 139's DP optimizations require separate
work on each enabling condition, derivation, implementation and counterexample.
Beyond the numbered core, choose extensions according to contest errors: geometry,
FFT/NTT and polynomials, persistent structures, advanced tree methods or deeper
combinatorics. Each requires its own prerequisite check and practice cycle.

CodeChef stars and Codeforces titles measure different contest systems. The course
supports serious ambitions; it does not guarantee a rank, rating or completion date.

Research and rationale: [DSA psychology audit](../../../../docs/research/dsa-psychology.md).
