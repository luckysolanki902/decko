# How to study ML from first principles

The course contains 228 study units. Lectures are generated when needed in batches
of three, using [the generation prompt](../../../../guidelines/lecture-generation.md). Study dates
and review dates depend on when you actually work, not when an LLM creates files.

## Your entry bridge

No ML knowledge is required. Python and data handling do need to be established.
Complete the Python & Data Analytics course first if the readiness tasks below are not already comfortable.
The phase source files, rather than old day ranges in prose, identify the current topics.

| Readiness task | If it is unfamiliar |
|---|---|
| Write a function that loops over numbers and returns a computed value | [Python & Data Analytics roadmap](../pydamlroadmap/00-Overview.md) |
| Run a script/notebook, read an error, load a local data file | [Real-world Python](../../phases/daml/phase3.ts) |
| Build, index and explain the shape of a numeric array | [NumPy topics](../../phases/daml/phase7.ts) |
| Load a table, inspect missing values, select rows/columns and compute a group summary | [Pandas topics](../../phases/daml/phase7.ts) |
| Read a scatter plot, calculate a mean and explain a sample | [Python & Data Analytics roadmap](../pydamlroadmap/00-Overview.md) |

You do not need every SQL, Excel or Tableau topic before ML. You do need to read the
Python in your first model without copying unexplained syntax. Use a small worked
example for each gap, then repeat independently on changed data. Calculus and ML
linear algebra are introduced inside this course.

## The session loop

Before reading a solution or running a cell, write a prediction: a value, a shape,
the expected direction of change, a baseline, or one explanation. Then compare the
result with your prediction. If you have no foothold, study a tiny worked example,
complete a similar partial example, and only then attempt independently.

For a four-hour baseline unit, plan about 20 minutes retrieval, 70 explanation and
derivation, 100 implementation/experiments, 30 feedback and 20 reconstruction/planning.
Breaks are additional; split the unit into several sessions. Advanced derivations,
projects and debugging may require more time. Preserve depth by extending the unit.

A 45-minute session can be 5 minutes retrieval, 15 one concept, 20 one concrete
exercise, 5 correction and a next cue. Do not count a notebook's “Run all” as proof
that you could rebuild or modify it yourself.

## When stuck

First name the missing layer: Python syntax, mathematical operation, model mechanism,
shape, experimental design or interpretation. Reduce it to a three-value calculation
or a tiny tensor. Take one hint and act on it. If you read a full answer, close it,
reconstruct the critical step, record help, and return later. Do not spend hours
staring at an unexplained equation to prove determination.

An LLM can critique your attempt, explain a missing prerequisite, or provide one hint.
Ask it to wait before giving the full solution. Generated correct code is not evidence
that you learned its mechanism; supply your prediction and reasoning for feedback.

## Review without drowning in a backlog

Add at most two useful retrieval prompts per session: one mechanism/assumption and
one shape/implementation/diagnostic. Start with revisits around 1/3/7/14/30 days after
study. Adapt the interval to independent success, errors, and upcoming dependencies.
These intervals are a practical default, not a universal memory law.

Keep ordinary review to 15–20 minutes. Prioritize today's prerequisites, repeated
mistakes, then older material. If review repeatedly overflows, slow new content.
After a break, test a few essential operations and repair the weak one rather than
restarting the whole course. Keep a manual cue/date/help/next-action table.

Mix explanation with production: reconstruct a loss on three values, fix a faulty
gradient, choose a split, or diagnose a misleading result. Later change the data or
assumption. Memorizing terminology or complete notebooks does not test transfer.

## Evidence of progress

Separate **covered**, **built with help**, **independent**, **recalled after delay**
and **transferred**. At each phase gate:

1. Explain one mechanism and its assumptions without notes.
2. Build a small artifact independently and compare against a baseline/reference.
3. Diagnose an intentionally broken version.
4. Return on another study date and handle a changed task.

A miss determines the next repair. It is not evidence that you are “not an ML person.”
Keep the final quiz, but do not use its score alone to certify practical mastery.

## Practise curiosity

Keep this short experiment record: observation → two possible explanations → smallest
test that separates them → predicted outcomes → result → revised belief. Change one
important variable at a time when feasible, keep evaluation data held out, and report
uncertainty and limitations. An experiment that rejects your idea can be a good result.

Ask whether a better dataset, a simpler representation, a different objective or a
different product interface would solve the problem. A model is not automatically the
right answer. You can build small useful systems before mastering every AI subfield.

## Jev as a recurring case, not a recipe to copy

TypeSafe presents Jev as a system for typed decisions. Its stated RLCD training
approach is a vendor claim, not a publicly specified recipe reproduced by this course.
See [the documentation](https://docs.typesafe.ai/introduction).

First build a classical decision baseline and measure calibration and decision cost.
After NLP and post-training, compare decision-oriented and text-oriented approaches
on the same task. Types, confidence and correctness are distinct. Make one change
to an objective in a small experiment and assess evidence before claiming improvement.
No paid TypeSafe account is needed for the educational baseline.

## Compute and pace

Every expensive lab needs an executable CPU/small-data path. A small trained model,
a reproduced forward pass and analysis of supplied results demonstrate different
skills; label them accurately. Optional GPU work must have an explicit budget.
Never claim to have trained a model when only a checkpoint or sample was inspected.

912 hours is the nominal first pass: about 114 weeks at 8 hours/week, 57 at 16, or
38 at 24. Entry preparation, extra review, remediation and larger projects add time.
Try four new-content sessions and one review/experiment session each week, keeping
rest/buffer space. Choose a sustainable pace and develop one deep specialization
after the broad foundation rather than demanding frontier mastery of everything.

Research, sources and the detailed course assessment: [ML research report](../../../../docs/research/ml-research.md).
