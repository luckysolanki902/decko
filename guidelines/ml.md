# ML / DL / GenAI Authoring Guidelines

Read this file whenever you edit the ML roadmap, ML lectures, NLP/LLM/RAG/agent
content, computer vision, reinforcement learning, generative AI, MLOps, or ML
syllabus docs.

Lectures are generated on demand in batches of three. Follow
[`lecture-generation.md`](lecture-generation.md), preserve a factual batch handoff,
and use the entry, review, and gate rules in
[`../src/data/syllabus/mlroadmap/01-Study-System.md`](../src/data/syllabus/mlroadmap/01-Study-System.md).
The curriculum rationale and research limits live in
[`../docs/research/ml-research.md`](../docs/research/ml-research.md).

> **Read [`teaching-method.md`](teaching-method.md) first.** It is the
> cross-roadmap contract for how to explain: failure before rule,
> prerequisite-safe examples, concrete traces, one idea per screen, honest claims,
> and neighbouring-lecture consistency. This file adds the ML-specific contract.

Its one job is to make every ML lecture feel like a patient expert is sitting beside
one learner, exposing each hidden decision and connecting every screen to the next.
The learner should not need another tab to discover what a symbol means, why an
operation exists, which shape flows through it, how success is measured, or why an
apparently good result can still be wrong.

---

## The North Star: what “good” feels like

The WebD reference set defines the explanatory bar. The first ML batch shows how to
translate that bar into model, data, and evaluation teaching.

| Reference | What to study in it |
|---|---|
| `public/data/lectures/webd/phase2/day13-js-runtimes-mental-model.md` | One durable mental model before terminology; mechanisms and gotchas explained with their causes. |
| `public/data/lectures/webd/phase2/day14-functions-and-scope.md` | A hard invisible mechanism made visible through escalating traces. |
| `public/data/lectures/webd/phase2/day15-control-flow.md` | Exact edge cases and misconceptions, not generic warnings. |
| `public/data/lectures/webd/phase4/day37-useeffect-error-boundaries.md` | The current standard for failure-first derivation and for giving a difficult idea enough room. |
| `public/data/lectures/webd/phase4/day50-frontend-system-design.md` | One running example whose early constraints visibly determine later decisions. |
| `public/data/lectures/ml/phase1/day01-what-machine-learning-actually-is.md` | A transparent learned rule, clear boundaries between human choices and learned values, and no assumed calculus. |
| `public/data/lectures/ml/phase1/day02-your-first-model-in-30-lines.md` | Hand trace → scratch implementation → library implementation → honest held-out evaluation. |
| `public/data/lectures/ml/phase1/day03-the-generalization-problem.md` | A score that looks good is allowed to fail before leakage and validation are introduced as fixes. |

Read at least one WebD reference and the most relevant existing ML lecture before
writing. Do not copy their headings mechanically. Study how the learner's question at
the end of one screen becomes the subject of the next.

The current ML lectures are evidence, not infallible authority. If an exemplar and
this guide disagree, follow this guide and the shared teaching method.

---

## The ML teaching promise

An ML lecture is not complete because it names an algorithm, displays a formula,
imports a library, and reports a score. It must help the learner answer six questions:

1. **What decision are we trying to improve?** State who uses the output, when they
   use it, and what information exists at that moment.
2. **What evidence may the system learn from?** Identify examples, features, targets,
   labels, feedback, or rewards without pretending they appeared naturally.
3. **What behavior can this model express?** Show the family of rules before showing
   the fitted member of that family.
4. **What chooses one behavior over another?** Derive the objective, fitting rule, or
   update from a visible error or trade-off.
5. **What would count as success?** Establish a baseline, split, metric, slices, and
   constraints before celebrating a number.
6. **How can the conclusion fail?** Test leakage, shift, uncertainty, bad objectives,
   brittle inputs, resource limits, and plausible competing explanations.

These are one causal chain, not six independent checklist sections:

```text
product question
      ↓ determines
prediction moment and available inputs
      ↓ determine
dataset, target, and split
      ↓ constrain
model family and objective
      ↓ produce
fitted behaviour and errors
      ↓ examined by
metrics, slices, uncertainty, and deployment constraints
      ↓ lead to
the next experiment — not an automatic claim of success
```

If a lecture teaches only the middle box, it teaches model syntax rather than machine
learning judgment.

---

## Explain every introduced thing completely

For every concept, formula, tensor, hyperparameter, metric, API argument, and system
component, answer the following in the order that makes the need visible:

1. **The problem before it exists.** Show the reasonable first attempt and the exact
   output or decision that exposes its limit.
2. **Plain meaning.** Give one sentence using vocabulary already taught.
3. **Mechanism.** Explain what changes, what stays fixed, and what causes the result.
4. **Small proof.** Calculate or trace three or four values by hand.
5. **Executable form.** Implement the same operation with the smallest runnable code.
6. **Real use.** Show where the idea affects a realistic ML product or experiment.
7. **Boundary.** Say what it does not guarantee and when another choice is better.
8. **Failure and diagnosis.** Produce a wrong result, inspect evidence, identify the
   cause, and repair it.

Do not compress this sequence into a definition paragraph. “Attention lets tokens
look at each other,” “regularization prevents overfitting,” and “RAG reduces
hallucinations” are slogans, not explanations. Each hides choices, mechanisms,
conditions, and exceptions that the learner needs.

### APIs are concepts too

When an argument appears for the first time—`random_state`, `stratify`,
`class_weight`, `reduction`, `padding`, `temperature`, `top_p`, `max_tokens`, or any
other—explain:

- what value enters;
- what behavior changes;
- the default, after verifying it against the version actually used;
- when the learner should change it;
- what failure it cannot fix; and
- one tiny comparison where changing it visibly matters.

Never paste a constructor with twelve unexplained arguments. Introduce the smallest
correct call, then add one decision at a time as a demonstrated need appears.

### Correct seductive simplifications before they harden

Prefer a smaller accurate claim to a memorable false one.

- Cross-entropy supplies a differentiable training signal that strongly penalizes
  low probability on the true class. Do not say it universally “trains better than
  accuracy” without explaining that accuracy is piecewise constant with respect to
  small probability changes and why that matters for gradient-based optimization.
- Scaling can matter for distance-based and gradient-based methods, but not every
  estimator responds to feature scale in the same way.
- Calling `.fit()` does not imply gradient descent. Name the algorithm the estimator
  actually uses or state that its internals arrive later.
- Retrieval can provide relevant context; it does not make generation truthful.
- Structured output constrains form; it does not establish factual correctness or
  calibration.
- A fixed random seed aids reproducibility of a particular procedure; it does not
  remove sampling uncertainty or make a result general.

Audit every use of *always*, *never*, *only*, *solves*, *understands*, *guarantees*,
and *state of the art*. State the conditions under which the sentence is true.

---

## Prerequisites: prove they were taught

Assume no ML knowledge. The entry bridge establishes Python, arrays and shapes,
tables, simple plots, and elementary statistics. It does not make the entire DAML
course a hidden prerequisite, and it does not license unexplained programming syntax.

Before drafting, create a private prerequisite ledger:

| Needed today | Earlier day that teaches it | Evidence it was explained | Action if missing |
|---|---|---|---|
| array shape | exact day/file | hand trace or explicit section | brief retrieval prompt |
| logarithm | exact day/file or none | learner calculated one | teach a local bridge |
| held-out data | exact day/file | split and purpose derived | replace or teach first |

This is a reading exercise. Open the earlier lecture around the term. A word inside a
code sample about something else is not teaching. If the learner could not explain it
from that earlier screen, it is a gap.

Repair a gap in one of three ways:

1. Replace the example with one using established knowledge.
2. Add a focused, independently runnable bridge immediately before first use.
3. Move the dependent material to a later lecture.

Do not write “you may remember,” “as you know,” or “do not worry about this yet” as a
substitute for a prerequisite. A refresher may be brief only when the underlying idea
was genuinely taught earlier.

Check `src/data/phases/ml/`, the previous lecture, and the next lecture. The previous
day establishes the learner's available vocabulary. The next day reveals concepts you
must not accidentally borrow and claims your current wording must not contradict.

---

## Seamless flow: one investigation, not a bag of topics

Choose one small running problem that is rich enough to survive the lecture. Give it a
stable dataset, prediction moment, target, baseline, and success criterion. Change one
thing at a time. When the example changes, state why the original can no longer answer
the new question.

A strong ML sequence often looks like this:

1. **A real decision.** “Should this support ticket be escalated before a customer
   waits an hour?” is better than “today we study binary classification.”
2. **The obvious rule.** Let a hand-written rule or naive model work on the smallest
   cases.
3. **A counterexample.** Add one plausible row that breaks the rule; show the wrong
   prediction and its cost.
4. **A desired behavior.** Describe what a better method must do before naming it.
5. **The mechanism.** Introduce only enough vocabulary, geometry, or probability to
   build that behavior.
6. **A hand trace.** Use the same rows and concrete numbers.
7. **An implementation.** Preserve names and values so the code is the trace made
   executable, not a new example.
8. **An honest evaluation.** Compare against the established baseline on data not
   used for the choice being assessed.
9. **A failure.** Inspect a slice, perturb an input, introduce leakage, or change the
   operating condition.
10. **A decision rule.** State when this method is appropriate, what evidence is still
    missing, and what the next lecture now needs to solve.

### The transition test

The last sentence of each screen should create the question answered by the next.
Read only the final sentence of every screen and the next heading. If the transition
feels like “anyway, here is another topic,” the staircase is broken.

Useful transitions are causal:

```text
The two models tie on accuracy, but their mistakes cost different amounts.
        ↓
## Accuracy cannot see the cost of a false negative
```

Weak transitions are administrative:

```text
Now that we understand accuracy, let us move on to precision and recall.
```

### One screen, one learner question

Each screen should answer one question completely. A formula definition, a code
implementation, three edge cases, and a product discussion normally require separate
screens. Comments inside code are not prose, and a table cannot introduce unexplained
concepts. Use tables to consolidate distinctions already taught.

Do not preserve a fixed screen count. Split when the learner must scroll, when the
question changes, or when an important prediction should happen before feedback.

---

## The lecture arc

Use this arc as a causal scaffold, not a compulsory list of headings:

1. **`## Why this day exists`** — the shortest screen: roughly 10–20 lines, one
   familiar situation, no agenda, no prerequisites paragraph, no untaught term, and
   at most one small code block. The failure belongs on screen two.
2. **Readiness retrieval** — after the opener, ask for one or two prerequisites that
   today actually needs. Put feedback on a later screen.
3. **The motivating attempt** — a reasonable method that works on a small case.
4. **The break** — one realistic change, with the wrong number, output, shape, or
   decision shown explicitly.
5. **The desired behavior and mental model** — what a fix must accomplish, pictured
   before notation or API surface.
6. **Mechanics and math** — derived in small steps with shapes, units, assumptions,
   and boundary cases.
7. **Hand-worked trace** — use the running example and ask for a prediction before
   revealing each important step.
8. **Executable proof** — scratch mechanism and library parity when algorithmic; a
   runnable experiment, pipeline, diagnostic, or system trace for other topics.
9. **Realistic extension** — introduce only the complexity needed to make one genuine
   decision.
10. **Evaluation and failure modes** — baseline, held-out evidence, useful slices,
    uncertainty, diagnostics, and remaining limits.
11. **`## Practice`** — guided-to-independent work with delayed feedback, transfer,
    and a deliberate failure.
12. **`## Cheat sheet`** — decision-oriented reference after concepts are understood.
13. **`## Tomorrow`** — one paragraph naming the next unresolved problem, not a list
    of future APIs.
14. **Final quiz** — exactly 10 questions.

`## Practice` begins the deck's practice/review chapter. `## Cheat sheet` begins the
contiguous wrap-up tail; keep `## Cheat sheet` → `## Tomorrow` → final quiz together.
See [`deck-chapters.md`](deck-chapters.md) for the load-bearing heading vocabulary.

Not every day needs a model fit. A lecture about monitoring may begin with a deployed
model whose input distribution silently changes. A lecture about fairness may begin
with identical aggregate scores hiding different group errors. Preserve the causal
arc—attempt, evidence of failure, mechanism, repair, limits—even when the artifact is
not a training loop.

---

## Mental models before notation

A mental model must predict behavior, not merely decorate the screen.

Good mental models identify:

- the objects involved;
- what information moves between them;
- what is adjustable and what is fixed;
- when the process happens—training, validation, inference, or monitoring; and
- one place where the analogy stops matching reality.

For example, “gradient descent walks downhill” is incomplete until the learner knows
what landscape is being measured, which coordinates can move, how the local slope
changes a coordinate, and why a large step can cross the valley. Follow the picture
immediately with numbers that behave as the picture predicts.

Prefer diagrams that expose time and ownership:

```text
training rows ──fit──▶ learned parameters
                         │
new row ───────────────▶ model ──▶ prediction
actual outcome arrives later ───▶ evaluation / monitoring
```

State the limit: production feedback may be delayed, missing, selected, or changed by
the model's own decisions. The simple diagram is a starting contract, not all of MLOps.

---

## Mathematics must be derived, shaped, and interpreted

Math is a compressed description of behavior. Decompress it before asking the learner
to manipulate it.

### Before the formula

Show the calculation the formula will abbreviate. For a mean-squared error, compute
three predictions, three residuals, three squares, their sum, and their mean. Only
then replace the repeated arithmetic with symbols.

### The symbol ledger

On first use, give every symbol all four properties:

| Property | Question it answers |
|---|---|
| Meaning | What real or computational object is this? |
| Shape | Scalar, vector, matrix, batch, sequence, image, or distribution? |
| Units | Minutes, rupees, probability, logits, pixels, or unitless? |
| Source | Chosen by us, observed in data, computed, or learned? |

Never write `XW + b` and leave the learner to infer whether examples are rows, where
the batch dimension went, or how `b` broadcasts. Trace a concrete shape through every
operation on its first appearance:

```text
X: (4 examples, 3 features)
W: (3 features, 2 classes)
XW: (4 examples, 2 class scores)
b: (2 class scores) → copied across the 4 rows
```

### Derivation contract

For every important equation:

1. State the question the equation answers.
2. Build it from arithmetic already understood.
3. Define each symbol, shape, unit, and index range.
4. Substitute a tiny numeric example.
5. Interpret the result in the problem's language.
6. Show a boundary case: zero, tie, extreme probability, empty set, one class, or a
   saturated activation—whichever is meaningful.
7. Connect each mathematical operation to the corresponding code line.
8. State assumptions and what breaks when they fail.

Do not perform algebra merely to look rigorous. A derivation earns space when it helps
the learner predict behavior, debug code, compare alternatives, or understand an
assumption.

### Calculus and linear algebra

Derive the local piece needed today. Do not insert a generic “calculus refresher” and
then leap to backpropagation. If a gradient is needed, first show how a small parameter
change alters the loss, then introduce slope as a compact description of that change.
If a matrix product is needed, first show one output as a weighted sum and then reveal
that matrix multiplication computes many such sums together.

### Numerical reality

Whenever relevant, distinguish the mathematical expression from its stable
implementation. Show why raw exponentials overflow, why `log(0)` fails, why dtype and
precision matter, or why reduction conventions change loss magnitudes. Name the
library function that implements the stable combined operation and verify its expected
input contract, such as logits rather than probabilities.

The current deck renderer supports GFM but not LaTeX math. Use readable Unicode and
fenced `text` equations. Do not expose raw `$...$` or `$$...$$` syntax unless renderer
support has first been changed and verified.

---

## Data comes before model choice

Every realistic example needs a compact data card before training:

```text
Unit of observation: one support ticket
Prediction moment: immediately after submission
Target: whether a human escalation is needed within 60 minutes
Available inputs: text and account tier known at submission
Unavailable inputs: resolution note and final handling time
Split logic: by week, because the product changes over time
Primary risk: missing urgent tickets, especially in low-volume languages
```

This prevents the common failure where columns become features merely because they
exist in a table.

Teach each transformation with ownership and time:

- What is learned from data: mean, vocabulary, category mapping, imputation value,
  PCA directions, tokenizer training, or threshold?
- Which partition may determine it?
- What exact information leaks if the full dataset is used?
- Is the same fitted transformation applied unchanged at inference?
- What happens to missing values, unknown categories, longer sequences, or new labels?

Fit preprocessing on training data only when it learns from data. Keep transformations
inside a pipeline when that is the safe production pattern. Show the leaking version
and the deceptively improved score before giving the rule.

Splits must reflect the use case. Random row splits are not automatically honest for
time, users, patients, repeated entities, geographic regions, documents derived from
the same source, or augmented copies. Explain which future or independent unit the
held-out set is meant to simulate.

---

## Evaluation is part of the model, not an appendix

No score appears without context. Before reporting it, establish:

- the trivial, heuristic, or existing-system baseline;
- what data was used to choose model parameters and hyperparameters;
- what remained untouched for final evaluation;
- why the metric matches the decision cost;
- at least one slice where aggregate performance may hide harm or brittleness;
- uncertainty or variation appropriate to the sample size and procedure; and
- compute, latency, memory, or human-review constraints relevant to use.

The lesson must distinguish:

```text
training fit     how well the procedure fits data it learned from
validation use   evidence used to make modeling choices
test estimate    evidence reserved for the selected procedure
production value whether the whole system improves the real decision
```

A higher offline metric is not automatically a better product. Thresholds convert
scores into actions; actions have unequal costs; deployed behavior can change which
data is later observed. Teach those links when they become relevant.

When comparing methods, hold the relevant conditions fixed: split, preprocessing,
budget, seeds where affordable, evaluation code, and stopping rule. Use justified
tolerances. Do not demand identical stochastic trajectories or arbitrary decimal-place
agreement.

---

## Code should make the mechanism inspectable

The first implementation is a microscope, not a code-golf exercise.

- Use small, named arrays whose values appeared in the hand trace.
- Show shapes at first creation and after every unfamiliar transformation.
- Add assertions for the invariants the learner is supposed to notice.
- Print or plot the intermediate value that proves the mechanism.
- Fix random seeds when reproducibility helps the lesson, while explaining their
  limits.
- Pin or record library/model versions when behavior, defaults, or outputs may vary.
- Explain unfamiliar Python syntax before it carries an ML idea.
- Keep data loading separate from mechanism code so file plumbing does not hide the
  lesson.

### Scratch, library, and parity

For an algorithmic mechanism—distance voting, loss, gradient update, convolution,
attention, sampling, Bellman update—include a minimal scratch implementation before or
beside the library form. It need not be production-grade. It must be complete enough
to inspect and run.

Then parity-check the same input under matched conventions. Explain differences from
reduction, regularization, initialization, tie-breaking, solver choice, padding,
tokenization, train/eval mode, randomness, or numerical precision. Agreement proves
implementation consistency, not real-world validity.

For topics where scratch code would be artificial—data governance, evaluation design,
deployment, monitoring, responsible AI, or system design—require a different
observable proof: an executable diagnostic, data-contract check, request trace,
monitoring query, controlled experiment, incident walkthrough, or design with tested
failure injection.

Never include invented APIs unless the entire contract is defined locally. Prefer
small standard-library/NumPy examples before framework magic.

### Notebook quality

A notebook must rerun top to bottom in a fresh environment. Avoid hidden state,
out-of-order dependencies, unexplained downloads, and results that exist only because
an earlier cell was manually edited. State expected runtime, memory, data size, device,
and external assets. Provide a CPU/small-data route for every core lesson that would
otherwise require expensive compute.

---

## Depth by ML topic family

The common teaching method stays fixed; the evidence changes with the topic.

### Foundations, classical ML, and statistics

- Start with the prediction or inference error, not the estimator name.
- Make assumptions observable through counterexamples or residuals.
- Derive the objective on a tiny dataset.
- Separate model parameters, hyperparameters, and decision thresholds.
- Compare with a cheap rule and at least one plausible alternative.
- Show how preprocessing, split choice, and metric selection alter the conclusion.

### Deep learning

- Track data, activation, parameter, and gradient shapes explicitly.
- Separate forward pass, loss calculation, backward pass, optimizer step, and
  zeroing gradients in time.
- Show train versus evaluation behavior where dropout, normalization, or state matters.
- Plot or print evidence for optimization claims; do not diagnose from loss alone.
- Explain initialization, learning rate, batch size, and regularization through visible
  failure, not a tuning table.
- Treat device placement, dtype, memory, and reproducibility as part of correctness.

### NLP, embeddings, and transformers

- Show the exact text before and after normalization or tokenization.
- Distinguish token, token id, embedding vector, position, hidden state, logits, and
  generated text with shapes at every boundary.
- Trace tiny attention scores by hand before multi-head abstractions.
- Separate training objective from downstream behavior; next-token prediction does not
  itself guarantee instruction following, truthfulness, or reasoning.
- Name context-window, truncation, padding, language, and data-distribution limits.

### LLM application engineering, RAG, and agents

- Start with the failure of the simpler system: plain prompt, keyword search, one-shot
  call, or fixed workflow.
- Keep retrieval and generation evaluation separate. A fluent answer can hide a
  retrieval miss; a relevant chunk can still be misused.
- Trace ingestion → chunking → representation → retrieval → prompt assembly → model
  output → validation with one inspectable document and query.
- Explain chunking and ranking as choices with measurable trade-offs, not magic setup.
- Treat prompts, tool schemas, model/version, temperature, and retrieval configuration
  as versioned system components.
- Distinguish deterministic workflow, tool-calling loop, and genuinely adaptive
  behavior. Do not call every chain an agent.
- For tools, show argument validation, authorization boundary, timeout, retry,
  idempotency, and what the model is not allowed to decide.
- Evaluate task success, groundedness, citation support, tool correctness, latency,
  cost, and adversarial inputs. Never use “looks good” as the only test.

### Vision and multimodal systems

- Begin with representation: height, width, channels, dtype, value range, and color
  order.
- Visualize every geometric transform and track image/annotation coordinates together.
- Teach classical or rule-based alternatives where they remain competitive.
- Separate augmentation used during training from deterministic evaluation transforms.
- Inspect errors by class, scale, lighting, background, view, and data source.
- For generative or multimodal outputs, evaluate consistency and conditioning, not only
  aesthetic appeal.

### Generative models

- State what distribution, corruption process, vector field, or autoregressive factor
  the objective learns.
- Separate training process from sampling process and trace both.
- Show how guidance, temperature, scheduler, step count, or seed changes a controlled
  example.
- Discuss coverage, fidelity, diversity, memorization, safety, and evaluation limits.
- Never imply that one attractive sample estimates model quality.

### Reinforcement learning and preference optimization

- Define agent, environment, observation/state, action, reward, return, value, policy,
  episode, and horizon through one tiny interaction trace before equations.
- Keep reward separate from the objective humans actually care about.
- Show exploration, credit assignment, variance, and reward hacking as concrete
  failures.
- Derive tabular reasoning before neural approximation where the roadmap permits.
- Teach RL foundations before mapping them to RLHF/PPO. Explain DPO on its own stated
  assumptions rather than as “RLHF without RL.”
- Evaluate behavior across seeds and scenarios; one lucky trajectory proves little.

### MLOps, deployment, and research practice

- Follow one example from data/version lineage through training, registry, serving,
  monitoring, feedback, and rollback.
- Separate data drift, concept drift, performance decay, pipeline failure, and service
  failure; each needs different evidence.
- Include latency, throughput, cost, reliability, privacy, security, and observability.
- Use incident timelines and failure injection rather than architecture labels alone.
- For papers, distinguish the authors' measured claim, their interpretation, your
  inference, and unresolved limitations.
- Require a matched baseline, ablation, uncertainty, negative results, and a
  reproducible experiment record before making a research claim.

---

## Failure modes: symptom → evidence → cause → repair

“Common mistakes” cannot be a late table of warnings the learner never experiences.
Each important failure should first appear in the running example. The summary table
comes afterwards.

Use this diagnostic chain:

```text
symptom
  ↓ inspect
specific intermediate evidence
  ↓ distinguish
two or more plausible causes
  ↓ test
one discriminating experiment
  ↓ repair
smallest change supported by evidence
  ↓ verify
original failure disappears without breaking the baseline
```

Examples of evidence include shapes, class counts, split overlap, nearest neighbours,
residual plots, confusion matrices, gradient norms, learning curves, retrieved chunks,
tool traces, latency percentiles, and slice metrics.

Do not teach “try a lower learning rate” as diagnosis. Show the evidence that makes an
oversized step more plausible than bad data, a broken loss, or a shape bug. Do not
teach “add more data” without naming which failure the added data should repair.

The final `Common mistakes` or failure-mode table uses four columns when useful:

| Symptom | Evidence to inspect | Likely cause | Repair and verification |
|---|---|---|---|

Each row must be specific to the day's mechanism.

---

## Practice, memory, and independent evidence

Quick checks create retrieval opportunities; they do not prove independent skill. For
a four-hour baseline unit, plan roughly 20 minutes of retrieval, 70 of explanation and
derivation, 100 of implementation and experiments, 30 of feedback, and 20 of
reconstruction/planning. Breaks are additional. Split advanced units across sessions
rather than compressing the reasoning.

### During teaching

Before each major reveal, require a concrete attempt:

- predict a shape or output;
- compute the next value;
- choose between two explanations;
- rank two model errors by product cost;
- sketch a split or baseline;
- identify which evidence would change the conclusion.

Put feedback on the following screen. If prerequisites are new, use a worked or
partially completed example first, then fade support.

### The `## Practice` ladder

Practice must include more than five recognition prompts. Use a compact on-deck ladder
plus an executable lab or artifact when the day's scope calls for it:

1. **Retrieve** — reconstruct the central mental model without notes.
2. **Trace** — calculate or predict one known case before running code.
3. **Complete** — fill a meaningful missing step in a partially worked example.
4. **Debug** — diagnose a deliberate failure from evidence, not from a supplied label.
5. **Build** — produce a small independent artifact with a clear done condition.
6. **Transfer** — change the dataset, constraint, metric, modality, or operating
   condition so copying the worked solution is insufficient.
7. **Judge** — compare two valid approaches and defend one under stated constraints.

Do not require all seven as separate screens when one coherent lab covers several.
State which steps are guided, hinted, or closed-notes. Include expected observations or
tests so the learner can get feedback without being handed the implementation.

Retrieve two actually taught prerequisites near the beginning. End with at most two
durable review cues. Use the study system's adjustable 1/3/7/14/30-day review rhythm
and ordinary 15–20-minute cap; repair weak dependencies rather than building an
unbounded backlog.

At phase gates, require a closed-notes explanation, independent executable artifact,
deliberate failure diagnosis, and delayed changed-task check. Record coverage,
assistance, delayed reconstruction, and transfer separately.

---

## The spiral: useful early, precise later

The course should produce visible capability early without hiding how the result was
obtained.

1. Use a small tool with an understandable input/output contract.
2. Establish a baseline and honest split before reporting success.
3. Let the result fail in a way the learner can inspect.
4. Introduce another model or evaluation tool because the failure demands it.
5. Return later to derive internals of a previously used operation accurately.
6. Rebuild the mechanism and parity-check it against the library where appropriate.
7. Add production and research discipline to something the learner already values.

Keep the first model early after the readiness bridge. A learner should train a real
model before studying derivatives. But early usefulness is not permission for a black
box: explain every input, output, line, argument, and evaluation decision used today;
defer only internals that are not needed to operate the tool honestly.

When returning to internals, name the exact earlier behavior now being explained. Do
not imply every estimator uses gradient descent or that a pedagogical scratch algorithm
is identical to a library's optimized solver.

---

## Evidence, sources, and fast-moving claims

ML facts change quickly. Verify version-sensitive or research-sensitive claims at
authoring time.

- Prefer original papers for reported experiments and official documentation for API
  behavior, defaults, model cards, licenses, and limits.
- Record library/model versions and access dates when the fact may change.
- Distinguish documented fact, paper result, author interpretation, and your own
  inference.
- State dataset, task, metric, comparator, and compute conditions before repeating a
  performance claim.
- Never generalize “best on this benchmark under this setup” into “best model.”
- Never invent private architecture, training data, scale, or evaluation details.
- Treat vendor claims as claims unless independently verified.
- Link sources near the claim in the lecture or its references section; do not dump an
  unexplained bibliography at the end.

Product case studies such as TypeSafe/Jev must separate documented interfaces and
vendor descriptions from independently verified behavior. Output typing can constrain
structure; it does not guarantee truth, calibration, safety, or task success.

---

## Compute must not decide who is allowed to learn

Every expensive lab needs a core CPU/small-data route that still exercises the target
mechanism, plus an optional accelerated route. State for each route:

- expected hardware, memory, runtime, download size, and cost;
- which competence it demonstrates;
- which scale-dependent behavior it cannot demonstrate; and
- how to use supplied traces or checkpoints without pretending that inspection equals
  training.

A tiny network on synthetic data, one forward pass through a supplied checkpoint, a
toy diffusion process, or analysis of saved experiment traces can be legitimate. A
screenshot of pretrained output or an unexecuted plan is not equivalent to executing
the mechanism.

---

## Markdown and deck contract

ML lectures are markdown files rendered by `src/components/LectureDeck.tsx`.

- Path: `public/data/lectures/ml/<phaseN>/dayNN-kebab-slug.md`
- Route: `src/app/ml/notes/[slug]/page.tsx`
- Variant: `ml`
- One file per day; day number, filename, title, duration, phase data, and syllabus must
  agree.

### Hard structure

- First line: `# Day N: Title`
- Second non-empty line: `**Duration: X hours | Focus: one-line promise**`
- Separate screens with `---` on its own line.
- Include **4–7** mid-lesson `quiz` blocks, distributed after major concept beats.
- End with exactly one `finalquiz` block containing exactly 10 questions.
- Keep `## Practice`, `## Cheat sheet`, and `## Tomorrow` spelled consistently so the
  chapter rail splits at the intended boundary.

Follow [`quiz-blocks.md`](quiz-blocks.md) for the complete JSON contract. In particular,
multi-line code inside any quiz string needs a language-tagged fence encoded with `\n`;
the outer quiz block closes with a bare fence. Never refer to an answer by letter,
position, “above,” or “below,” because the runtime shuffles options.

### Quiz quality

Quick checks target a misconception that the immediately preceding teaching made
answerable. The final quiz covers the whole lecture with a healthy mix of
`single_correct` and `multiple_correct` questions.

Prefer questions that ask the learner to:

- predict a value, shape, update, or output;
- spot leakage or an invalid split;
- select the metric or baseline matching a decision;
- diagnose from a trace;
- distinguish two mechanisms;
- choose an implementation under constraints; or
- identify what a result does and does not establish.

Every distractor should represent a realistic misconception. The explanation names
the content of each tempting answer and explains why it fails; it never says “the
second option is wrong.” Distribute authored correct-answer IDs and vary the number of
correct choices in `multiple_correct` questions, while remembering that runtime order
is randomized.

### Visual and typography limits

- Use ASCII diagrams for flow, ownership, tensor movement, and time.
- Use tables for consolidation, comparisons, shape contracts, and diagnostics only
  after their concepts are taught.
- Use blockquotes sparingly for one durable rule.
- Keep code blocks focused—usually 15–40 lines—and split larger programs around
  conceptual boundaries.
- Code comments explain shapes, units, invariants, or non-obvious reasons; they do not
  repeat the syntax.
- Keep quiz option text compact enough to scan; move the necessary detail into the
  prompt or explanation.

---

## Tone

Write like a calm senior ML engineer and teacher working beside one learner. Be direct,
precise, curious, and honest about uncertainty. Use “we” for joint investigation and
“you” for an action the learner takes. Prefer short sentences and concrete nouns, but
do not shorten an explanation that still hides a causal step.

Avoid hype, anthropomorphism, textbook throat-clearing, and false certainty. Never use
“Welcome,” “In this lecture,” “we will now learn,” “obviously,” “simply,” or “just.”
Do not say a model “thinks,” “knows,” “wants,” or “understands” when the mechanism can be
described more accurately.

Interesting does not mean adding jokes or fashionable tools. It means the learner has
a live question, makes a prediction, sees surprising evidence, revises a mental model,
and gains a useful power before the energy of that question disappears.

---

## Authoring workflow

### Before drafting

1. Read `teaching-method.md`, this file, the phase entry, syllabus entry, previous day,
   next day, generation handoff, and at least one relevant exemplar.
2. Write the day's one-sentence learner transformation: what judgment or mechanism can
   they independently demonstrate afterwards?
3. Build the prerequisite ledger and repair plan.
4. Choose the running problem and write its data card.
5. Identify the reasonable first attempt, the row or condition that breaks it, and the
   observable wrong result.
6. Decide the proof required: scratch parity, controlled experiment, diagnostic,
   system trace, or failure injection.
7. List claims that need primary-source or official-document verification.
8. Sketch the screen chain as questions, not topic names.

### During drafting

1. Keep the opener short and familiar.
2. Ask for a prediction before every major reveal.
3. Reuse the running example's values, names, and constraints.
4. Introduce one new abstraction per screen.
5. Define symbols, shapes, units, ownership, and timing at first use.
6. Show the wrong output and diagnostic before the repair.
7. Add decision rules and limitations immediately after a mechanism works.
8. Keep a list of every new term and API argument; audit each for a complete
   explanation.

### Read-back pass

Read the lecture top to bottom as a learner, not as its author. Check:

- Does every screen answer the question created by the previous one?
- Does any paragraph contain an unfamiliar noun it has not unpacked?
- Does every rule have a visible failure above it?
- Does every formula have meaning, shape, units, arithmetic, interpretation, and a
  code connection?
- Does every reported score have a baseline, split, metric rationale, and limitation?
- Does the lecture distinguish implementation correctness from model usefulness?
- Are claims calibrated to their evidence?
- Could every code block run in order in a clean environment?
- Does practice require production, diagnosis, and transfer rather than recognition?
- Does `Tomorrow` arise from a limit the learner has already seen?

If a section feels vague, add the missing trace, counterexample, intermediate value,
or causal explanation. Do not repair confusion by deleting the difficult mechanism.

---

## Validation before calling a lecture done

1. Confirm phase data, syllabus, filename, title, duration, focus, and visible card are
   consistent.
2. Confirm the first two lines, screen separators, chapter headings, 4–7 quick checks,
   one final quiz, and exactly 10 final questions.
3. Run `npm run validate:quizzes`; use it for JSON and quiz shape, not answer-position
   balance.
4. Check prose and quiz code fences, including language tags inside JSON strings.
5. Run every snippet and rerun every notebook top to bottom in a clean state.
6. Verify shapes, arithmetic, expected outputs, tolerances, seeds, package/model
   versions, links, and source claims.
7. Read the actual prerequisite lectures and search the current lecture for APIs or
   concepts scheduled later.
8. Search the previous and next lecture for the main topic; reconcile contradictions
   explicitly.
9. Run `npm run typecheck`, `npm run lint`, and `npm run build` for a finished batch or
   before a pull request, in addition to quiz validation.
10. Spot-check `/ml/notes/<slug>` in the browser: navigate every screen, inspect code
    wrapping and tables, answer a quick check, grade the final quiz, and confirm the
    chapter rail changes at the intended screen.
11. Update the generation handoff with what was actually taught, gaps repaired,
    executable checks, review candidates, compute assumptions, known limitations, and
    what the next lecture may safely assume.

---

## Universal repository rules

- Protect work you did not create; never revert unrelated changes.
- One lecture file per day; never combine a range of days.
- Use npm, not pnpm or yarn.
- Stage only files relevant to the request.
- Commit and push only when explicitly asked.
