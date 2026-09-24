# Day 1: What Machine Learning Actually Is

**Duration: 4 hours baseline, split across sessions | Focus: explain what is learned, from which examples, and for which decision**

---

## Why this day exists

Imagine estimating how long a delivery will take.

You could write a rule using the distance.
But two trips of the same distance can take different amounts of time.

You also have records of previous trips.
Those records might help you make a better estimate.

The computer still needs instructions.
The question is which part you specify yourself,
and which part the examples help it choose.

That distinction is the beginning of machine learning.

---

## Before you reveal: check the entry bridge

This course begins from zero ML knowledge. It does assume the Python and data
skills in the [entry bridge](/ml): variables, loops, functions, lists, array shapes,
table columns and the arithmetic mean. Calculus is not a prerequisite today.

Without searching, calculate the mean of 10, 14 and 18. Then explain what three
rows and two columns in a numeric table mean. These are readiness checks, not
evidence that you should already know any ML vocabulary.

If Python itself is new, complete the corresponding DAML Python/NumPy/pandas
readiness tasks from the course study guide before running these labs. Do not
try to learn every new programming construct and the model mechanism simultaneously.

---

## Feedback: numbers and rows

The mean is `(10 + 14 + 18) / 3 = 14`: total divided by number of values.
Three rows and two columns mean three records, each with two stored fields.
A numeric array representing this table has shape `(3, 2)`.

A **shape** records the length along each dimension. A one-dimensional collection
of three values has shape `(3,)`; the comma is Python's notation for a one-item
shape tuple. It is different from `(3, 1)`, a table with one column.

If these distinctions are unfamiliar, build a three-row table yourself and select
one column before proceeding. Understanding the data container keeps the next
idea small.

---

## A rule works, then reality disagrees

Suppose your first rule is “every delivery takes 10 minutes.” It predicts the same
time for a one-kilometre trip and a ten-kilometre trip.

You change it to “time equals three times distance.” Better: distance matters.
But where did the number three come from? Was it a guess, a policy, or something
estimated from past trips?

Here are three deliberately simplified training records, invented for this lesson:

| Distance, kilometres | Time, minutes |
|---:|---:|
| 1 | 4 |
| 2 | 6 |
| 3 | 12 |

Before continuing, propose one way to use all three rows to choose “minutes per
kilometre.” There is more than one reasonable rule. Write yours down first.

---

## A model is a rule with a part we can choose

We will choose the average of each trip's minutes per kilometre:

```text
Trip rates: 4 / 1 = 4, 6 / 2 = 3, 12 / 3 = 4
Mean rate:  (4 + 3 + 4) / 3 = 11 / 3 ≈ 3.667
New prediction: learned rate × new distance
```

The **model** is this input-to-output rule. Its adjustable number is the rate.
Using examples to choose that number is **training**.
Using the chosen number for a new distance is **inference**, or prediction.

Machine learning builds a prediction or decision rule whose behavior is selected
from examples or experience, according to a chosen learning procedure.
It is not “the computer invents its own objective.” We chose the representation,
the rate-averaging procedure and the quantity we wanted to predict.

Our procedure is a transparent educational choice. It is not claimed to be the
best delivery model or the usual least-squares regression algorithm.

The rule that estimates a quantity from data is also called an **estimator**.
Changing how the trip rates are combined changes that estimator, even when a
particular dataset happens to give the same number.

---

## Separate fitting from using the result

```text
TRAINING
past distances + known times
          ↓
chosen learning procedure
          ↓
learned rate = 11/3

INFERENCE
new distance = 4 km + learned rate
          ↓
predicted time = 44/3 ≈ 14.667 minutes
```

At inference time we do not know the new trip's actual time yet. Supplying it as
an input would defeat the purpose of predicting it.

The model can be useful without being exact. Traffic, waiting and measurement
differences are absent from this tiny rule. A decimal prediction is not a
promise that a courier will arrive at that precise instant.

---

## Give the table's parts names

| Word | Meaning here | Concrete example |
|---|---|---|
| Example | one case from which we learn or on which we predict | one delivery |
| Feature | an input available when making the prediction | distance in km |
| Label or target | the answer we learn to predict | observed delivery minutes |
| Parameter | a value selected by the learning procedure | learned minutes/km |
| Training | choosing model behavior using examples | averaging three rates |
| Inference | applying the learned behavior | estimating a new trip |
| Dataset | collection of examples | the three recorded deliveries |

The same column is not automatically a feature in every task. If you predict
distance from travel time, their roles change. Start with the question and the
time at which the prediction is made, then identify inputs and target.

---

```quiz
{"prompt":"You must estimate a delivery's arrival time before it starts. Which proposed input is unavailable for that prediction?","options":[{"text":"The planned route distance.","correct":false},{"text":"The actual time at which this delivery finishes.","correct":true},{"text":"The start location known at dispatch.","correct":false},{"text":"The start time known at dispatch.","correct":false}],"explanation":"The finish time is an outcome, not information available at dispatch. Using it would give the model information it will not have when the prediction is needed. Input eligibility depends on the moment of use."}
```

---

## Parameters and choices around learning

A **hyperparameter** is a setting chosen outside the fitting procedure that
controls how the model learns or predicts. Tomorrow we choose how many nearby
examples vote on a new flower's type. That neighbor count is set by us; the
library does not discover it merely because we called fit.

A parameter is selected within fitting. For our toy delivery rule, the mean rate
is selected from the records. The rule “average the per-trip rates” is our
algorithm design, not a learned fact.

The distinction depends on the specified procedure. A setting can later be chosen
using an outer experiment, but that does not mean the inner fit call learned it.
For today: identify what we select in advance and what the examples determine.

---

## Rebuild the rate in Python

Create `day01_delivery.py`. These lists are our invented teaching fixture,
not a real delivery dataset. All distances are positive; dividing by a zero
distance would require a different design.

```python
distances = [1.0, 2.0, 3.0]
times = [4.0, 6.0, 12.0]
assert len(distances) == len(times) and len(distances) > 0

rates = []
for distance, minutes in zip(distances, times):
    assert distance > 0
    rates.append(minutes / distance)

learned_rate = sum(rates) / len(rates)
new_distance = 4.0
prediction = learned_rate * new_distance
print(rates)
print(learned_rate, prediction)
```

`zip` pairs corresponding values: (1,4), (2,6), (3,12).
The length assertion prevents silent loss if one list is shorter; zip otherwise
stops at the shorter list. `append` adds each newly calculated rate to the list.
An `assert` raises an error when the stated condition is false, making a violated
data assumption visible.

Predict the printed rates before running. The expected prediction is about 14.667.

---

## Compare with array arithmetic

Add this below the previous code, in an environment with NumPy installed:

```python
import numpy as np

x = np.array(distances, dtype=float)  # shape: (3,)
y = np.array(times, dtype=float)      # shape: (3,)
array_rates = y / x                  # shape: (3,)
reference_rate = np.mean(array_rates)  # one scalar number
assert x.shape == y.shape
assert np.isclose(learned_rate, reference_rate, rtol=0, atol=1e-12)
print(reference_rate * new_distance)
```

`dtype=float` requests floating numeric storage. Division pairs corresponding
array entries, producing the same three rates. `np.mean` computes their mean.

`np.isclose` checks whether the difference is within a tolerance.
`rtol=0` disables a magnitude-relative allowance; `atol=1e-12` allows an
absolute difference of one trillionth. That is generous for rounding in these
few small operations and strict enough to catch a different rate formula.
It is not a universal tolerance for every future model.

This is a parity check against NumPy's implementation of the same arithmetic.
Agreement checks implementation, not whether the model is useful on real trips.

---

## A different “average” solves a different calculation

Another plausible learner used total minutes divided by total distance:

```text
(4 + 6 + 12) / (1 + 2 + 3) = 22 / 6 = 11/3
```

Our particular fixture gives the same result. That coincidence cannot prove the
procedures equivalent. Change the times to 4, 6 and 15.

Before running, compute both procedures. Which gives a larger rate? Why might
the longer trip receive more influence in one procedure?

---

## Feedback: a changed fixture separates explanations

Mean trip rate is `(4 + 3 + 5) / 3 = 4`.
Total time divided by total distance is `25 / 6 ≈ 4.167`.
The latter effectively gives more influence to trips with more kilometres.

```python
changed_distances = np.array([1.0, 2.0, 3.0])
changed_times = np.array([4.0, 6.0, 15.0])
equal_trip_rate = np.mean(changed_times / changed_distances)
pooled_rate = np.sum(changed_times) / np.sum(changed_distances)
assert not np.isclose(equal_trip_rate, pooled_rate)
print(equal_trip_rate, pooled_rate)
```

This fragment runs after the NumPy import. `np.sum` adds entries.
The test distinguishes “these formulas are always the same” from “these data
happened to make them agree.” That is a small research habit: create a case that
makes competing explanations predict different outcomes.

---

```quiz
{"prompt":"The Python loop and NumPy mean agree on the learned rate. What has that established?","options":[{"text":"The delivery model will be accurate in every city.","correct":false},{"text":"Distance is the only cause of travel time.","correct":false},{"text":"No new trip can take longer than predicted.","correct":false},{"text":"The two implementations agree on this calculation and data.","correct":true}],"explanation":"Parity checks implementation under matched inputs and rules. They do not establish causal claims, generalization to another city, or perfect future accuracy. The changed fixture also reminds us that one agreeing example can hide different formulas."}
```

---

## Session checkpoint

Close the code. Draw training and inference as two separate paths. Reconstruct
the rate from three new positive distances and times, then compare your loop with
NumPy under the same formula.

Write the limitation in one sentence: this rule forces predicted time to be
proportional to distance and omits other influences. We have not yet measured
its performance on unseen real deliveries.

Take a break before the next session. Next we vary where the learning signal
comes from, without importing an ML library.

---

## Learning with an answer key

Our delivery table pairs inputs with known answers. That is **supervised learning**.
The supervision is the target supplied for past examples, not a human watching
every line of training code.

Predicting a number, such as minutes or sale price, is **regression**.
Predicting one of a set of categories, such as flower species, is **classification**.
A category encoded by 0, 1 or 2 is still a category: adding those codes does not
make a meaningful intermediate species.

A real supervised example is the Titanic passenger dataset. A possible question
is whether a passenger survived, using selected information available before the
outcome. Historical analysis is not a deployable real-time survival system;
the prediction question and its limitations still need to be stated.

---

## Learning without that answer column

Suppose we have descriptions of many documents but no desired group assigned
to each one. We might ask an algorithm to organize similar documents into groups.
That is an **unsupervised** task: there is no supplied correct group label for
each training example.

The 20 Newsgroups collection contains posts and topic labels. We can deliberately
ignore the labels and investigate groups in the texts. The resulting task is
unsupervised even though the original dataset also contains labels.

“Unsupervised” does not mean “no choices, no evaluation, or automatically meaningful.”
The choice of what similarity means affects the groups. We can later inspect
whether the groups are useful for our intended browsing task.
The same data can support different learning setups.

---

## Make a learning target from the data itself

Take the invented sentence “The courier carried the parcel.”
Hide its last word and ask a model to predict it from the preceding words.
The original sentence supplies the answer without a human separately labeling
it for this prediction task.

That is **self-supervised learning**: construct a training target from the data.
Another task could hide a word in the middle and use the surrounding words.
These are two different input/target constructions, not identical algorithms.

We could use the text of 20 Newsgroups posts this way, ignoring their topic labels.
The teaching example is not a quotation from that collection.
This explains a source of training supervision; it does not yet explain an LLM's
architecture, training scale or ability to answer questions reliably.

---

## Learn from consequences of actions

Consider a moving agent in a maze. It observes where it is, chooses a movement,
and receives a reward, a numeric signal describing an outcome.
Actions affect which situations it encounters next.

**Reinforcement learning** studies how to choose actions to achieve a goal defined
through such rewards over experience. A **policy** is the rule for choosing an
action from what the agent observes. Reward is feedback, not necessarily a label
saying which action was correct.

A concrete experience record has this shape:

| Current observation | Action | Reward | Next observation |
|---|---|---:|---|
| current position | move right | 0 | new position |
| near goal | move up | 1 | goal reached |

This is an invented illustration. Real offline RL data, such as Minari's D4RL
PointMaze collection, stores episodes of observations, actions and feedback.
An **episode** is one sequence of interaction; **offline** means learning from
already collected experience rather than gathering all experience live.
We are identifying the data contract, not training an agent on Day 1.

---

```quiz
{"prompt":"You use posts from a topic-labeled collection, ignore topic labels, hide words, and train a predictor of the hidden words. What describes this setup?","options":[{"text":"Self-supervised learning because the text supplies constructed targets.","correct":true},{"text":"Reinforcement learning because any prediction is an action.","correct":false},{"text":"Supervised topic classification because the source dataset contains topic labels.","correct":false},{"text":"A setup with no target of any kind.","correct":false}],"explanation":"The task uses targets constructed from the text itself. Available but unused topic labels do not define this particular task. RL requires an action/consequence objective, not merely a predicted output; hidden words are still targets."}
```

---

## Four setups, four sources of feedback

| Setup | What tells learning what to improve? | Dataset/task example |
|---|---|---|
| Supervised | supplied target for an example | Titanic survival or Ames sale price |
| Unsupervised | chosen structure objective without per-example answer labels | organize 20 Newsgroups texts while withholding topics |
| Self-supervised | targets constructed from observed data | predict hidden words in the same posts |
| Reinforcement | rewards associated with action sequences | learn behavior from PointMaze episodes |

These are not four product categories that never overlap. A system can learn
representations through one setup and later learn a decision using another.
“Generative” describes producing outputs such as text or images; it is not a fifth
mutually exclusive source of feedback in this table.

Before proceeding, classify two tasks: calculate the mean age in a table; predict
the age of an unseen person from measurements. Only the latter necessarily asks
for a learned predictive model. A table calculation can remain ordinary analytics.

---

## Inspect three real dataset descriptions

Open these dataset sources and inspect the description/schema, not a competition
leaderboard. No sklearn import or model training is needed. The task is to write
a data contract, not learn an unfamiliar downloading library.

| Source | Define one example | Candidate inputs known at prediction time | Target |
|---|---|---|---|
| [Titanic, OpenML 40945](https://www.openml.org/d/40945) | one passenger | age and passenger class, subject to availability | survived |
| [Ames house prices, OpenML 42165](https://www.openml.org/d/42165) | one home sale | recorded area and year built, known before sale | SalePrice |
| [20 Newsgroups, dataset documentation](https://scikit-learn.org/stable/datasets/real_world.html#the-20-newsgroups-text-dataset) | one post | its text under a stated content policy | topic, for classification |

Spend enough time to identify at least two actual fields or record components.
For Titanic, look for `age`, `pclass`, `survived`; for Ames, `GrLivArea`,
`YearBuilt`, `SalePrice`. Newsgroups records are documents rather than a small
numeric spreadsheet. Record one missing-information or provenance question per source.

If a site is unavailable, the table gives the contract for the reasoning exercise.
Mark the source inspection as pending; do not claim that you opened data you did
not inspect. Downloading and cleaning these full datasets is not today's core lab.

---

## Names alone do not make a safe feature list

Titanic's `boat` or `body` fields can describe events associated with survival
or recovery. They would be inappropriate inputs for a prediction before the
outcome. A model could look impressive by receiving information from afterward.

For a house price estimate, `SalePrice` itself must not also be an input.
Living area must be recorded in the same units at training and prediction time.
A row identifier is useful for tracking a record but is not automatically a
meaningful property of the house.

For text classification, headers can reveal a newsgroup name or identity clues.
Decide whether the intended product has those clues. To classify a message from
its content, relying on a topic-identifying header changes the problem.
The [official text example](https://scikit-learn.org/1.8/auto_examples/text/plot_document_classification_20newsgroups.html)
demonstrates why this distinction matters.

---

## A real reinforcement dataset is more than a label column

Inspect the [Minari PointMaze dataset description](https://minari.farama.org/datasets/D4RL/pointmaze/umaze-v2/).
Identify observation, action, reward and episode as separate parts.
You do not need to install a simulator or train a policy to understand this record.

A logged reward does not reveal what would have happened under every action that
was not taken. That is one reason learning a good policy is a different problem
from predicting a supplied category for an independent row.

The source is an example of real collected experience and a documented environment.
Our two-row maze table above is explanatory fiction, not a copied measurement.
Keep this distinction in your own experiment notes too.

---

## ML is sometimes the wrong tool

A shop's rule says shipping is free when a basket reaches 500 units.
If that is the entire contract, write the rule. Do not train a model to approximate
a known policy and occasionally charge the wrong amount.

If the question is “what were total sales last month?”, a table aggregation or
SQL query is appropriate. SQL is a language for querying structured data; you
do not need to learn its syntax to understand that this question asks for a
calculation on records, not an unknown future answer.

ML becomes a candidate when examples contain useful patterns for a task whose
decision rule is hard to specify directly. It still needs an evaluation plan,
reasonable data access, and a way to handle errors.

---

```quiz
{"prompt":"A written policy says every order at or above 500 receives free shipping. What is the appropriate first implementation?","options":[{"text":"Predict the policy with a large model trained on old bills.","correct":false},{"text":"Cluster customer names before deciding.","correct":false},{"text":"Implement the exact threshold rule.","correct":true},{"text":"Generate a new shipping policy for every order.","correct":false}],"explanation":"The desired behavior is already completely specified. A direct rule is exact and easy to test. Learning or generating a substitute adds error without resolving an unknown relationship."}
```

---

## Make a decision card before choosing a model

Write six short answers for a proposed project:

1. What decision or prediction is needed, and when?
2. What input will actually be available then?
3. What examples or experience can support learning?
4. What simple rule or constant prediction must ML improve on?
5. What does an error cost, and when should a human handle it?
6. How will you check behavior on cases not used to choose the rule?

A **baseline** is that simple reference approach. It lets “better” mean better
than something concrete. Tomorrow we compare a flower predictor with a rule
that always predicts the most common training category.

We have not yet earned a performance claim for the delivery rule. Choosing a
number from data is training; checking whether that choice helps new cases is
a separate responsibility.

---

## Common mistakes

| Symptom | Likely misunderstanding | Repair |
|---|---|---|
| Feature list includes the answer | input timing ignored | specify what is known at prediction time |
| Model code runs, therefore it works | implementation confused with usefulness | compare with a baseline on unseen cases |
| Any dataset has one permanent ML family | dataset confused with task | state target construction and learning objective |
| Array and loop disagree | shapes, pairing or formula differ | check one row and the exact arithmetic |
| More complexity is assumed better | no baseline or error cost | write the decision card first |

---

## Practice

Work in one notebook or a Python file plus a short written report. Use roughly
100 minutes for implementation and experiments across sessions, with feedback
and reconstruction afterward. The five tasks are a progression, not a typing race.

Before revealing feedback, produce the requested artifact. If stuck, use the
first hint, make one change, then continue to the next.

---

## Task 1 — build the training/inference boundary

For invented trips with distances 2, 4 and 5 km and times 8, 12 and 20 minutes,
learn the mean trip rate and predict a 6 km trip. First calculate by hand, then
implement a Python loop and NumPy comparison. Allow 20–30 minutes.

---

## Task 1 hints

1. Calculate one rate per trip before taking the mean.
2. The rates are 4, 3 and 4; the mean is 11/3.
3. Multiply the learned rate by 6 only after fitting is complete.

---

## Task 1 feedback

```python
import numpy as np

distances = [2.0, 4.0, 5.0]
times = [8.0, 12.0, 20.0]
rates = []
for distance, minutes in zip(distances, times):
    rates.append(minutes / distance)
rate = sum(rates) / len(rates)
reference = np.mean(np.array(times) / np.array(distances))
assert np.isclose(rate, reference, rtol=0, atol=1e-12)
assert np.isclose(rate * 6.0, 22.0, rtol=0, atol=1e-12)
print(rate * 6.0)
```

The prediction is 22 minutes. Both implementations use equal influence per trip.
It is a calculation on a toy fixture, not a held-out estimate of delivery quality.
The invariant of the loop is one computed rate per processed distance/time pair.

---

## Task 2 — diagnose a plausible implementation

An engineer replaces the mean of rates with `sum(times) / sum(distances)`.
Use distances [1, 2, 3] and times [4, 6, 15] to test whether that is an equivalent
implementation. Predict the result first. Allow 15–20 minutes.

---

## Task 2 hints

1. Compare the formulas, not the function names.
2. One weights trips equally; the other effectively weights by distance.
3. The expected values are 4 and 25/6.

---

## Task 2 feedback

```python
import numpy as np

x = np.array([1.0, 2.0, 3.0])
y = np.array([4.0, 6.0, 15.0])
per_trip = np.mean(y / x)
pooled = np.sum(y) / np.sum(x)
print(per_trip, pooled)
assert np.isclose(per_trip, 4.0)
assert np.isclose(pooled, 25.0 / 6.0)
assert not np.isclose(per_trip, pooled)
```

A disagreement is expected: the engineer changed the estimator, meaning the rule
that derives the quantity from data. It is not floating-point noise.
Do not “fix” this by loosening the tolerance until different formulas pass.

---

## Task 3 — make three data cards

Independently inspect the three linked dataset descriptions. For each, write:
one example, two plausible inputs, the target, prediction timing, task family,
one questionable field or assumption, and a simple baseline idea.

Then reframe the Newsgroups data as an unsupervised and a self-supervised task.
Allow 25–40 minutes. This is a written artifact; screenshots or downloaded archives
alone do not answer the questions.

---

## Task 3 hints and feedback

First choose the task, then ask which information exists at use time. For a
supervised target, distinguish category from numeric quantity.
If you need a stronger hint, use the contract table from the teaching section.

A defensible card might predict Titanic survival from selected pre-outcome
attributes, flag missing ages and post-outcome fields, and compare against a
constant category. Ames price is regression; a constant training-price estimate
is a starting baseline, not an asserted good one. Newsgroups topic classification
needs a content policy; organizing unlabeled texts or predicting hidden words
creates the other two setups.

Several answers can be valid. What matters is a consistent input/target/timing
contract, not copying our feature selection as universally correct.

---

## Task 4 — choose whether learning is needed

For each proposal, write a decision card: monthly sales total; exact free-shipping
policy; estimated delivery time for tomorrow. Then write two possible explanations
for a poor delivery estimate and an observation that could distinguish them.
Allow 20–30 minutes.

---

## Task 4 hints and feedback

Start by separating a known calculation, a written policy, and an uncertain future
quantity. For the last, ask whether the error comes from incorrect units or a
missing influence such as waiting time.

The first two can use aggregation and a direct rule. The third is an ML candidate
if suitable data and evaluation exist. Check units on the same recorded trip to
test a units bug; inspect comparable-distance trips with different waiting time
to investigate the missing-factor explanation. Neither explanation is established
merely because it sounds plausible.

---

## Task 5 — reconstruct and change the question

After a break, reconstruct the rate model without the lecture. Then change the
prediction question: estimate time **remaining after pickup**, rather than total
time from dispatch. Write which labels and timestamps must change before you
touch the formula. Allow 20–30 minutes on a later study session.

---

## Task 5 hints and feedback

Ask where the clock starts. Total delivery time includes intervals the new target
excludes. A correct new target would use completion time minus pickup time;
the old total-time label would answer the old question.

The training/inference diagram remains useful, but the target contract changes.
There is no numerical “correct answer” without the required records. Recognizing
missing data is a successful diagnosis; inventing values would not be a solution.

Keep two durable cues: “What comes from examples, and what did I choose?” and
“What information exists at prediction time?” Review after roughly 1/3/7/14/30
days from study, adapting to performance and the ordinary 15–20-minute daily cap.
Record help separately from independent reconstruction or changed-task success.

---

## Cheat sheet

| Question | Answer pattern |
|---|---|
| What is trained? | a prediction/decision rule selected using examples or experience |
| What is a feature? | a usable input at the stated prediction time |
| What is a target? | the quantity/category the chosen task asks us to predict |
| Parameter / hyperparameter? | selected within fitting / chosen around the fitting procedure |
| Training / inference? | learn behavior / use the learned behavior |
| Four feedback setups? | supplied targets, structural objective, constructed targets, action rewards |
| Do I need ML? | first check direct rules, calculations, baselines and error costs |
| Does code agreement prove usefulness? | no; it checks matched implementations |

---

## Tomorrow

Tomorrow's model predicts a flower category using nearby examples that vote.
We will trace the votes before calling a library, keep some flowers out of training,
and compare the result with a constant-category baseline.

A useful first win is being able to explain one tiny learned rule completely.
A product that uses many kinds of models is built from many such understood pieces;
you do not need to pretend you already understand all of them.

---

```finalquiz
{
  "title": "Day 1: Tasks, examples and learned rules",
  "questions": [
    {
      "id": "q1",
      "type": "single_correct",
      "prompt": "In the delivery model, which value is learned by averaging the observed trip rates?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "The meaning of minutes"
        },
        {
          "id": "b",
          "text": "The learned minutes-per-kilometre rate"
        },
        {
          "id": "c",
          "text": "The new trip's actual completion time"
        },
        {
          "id": "d",
          "text": "The decision to use Python"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "The procedure derives the rate from examples. Units and implementation choices are supplied by us; the future outcome is not known.",
      "example": "Rates 4, 3, 4 produce learned rate 11/3."
    },
    {
      "id": "q2",
      "type": "multiple_correct",
      "prompt": "Which are part of a sound feature contract?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Inputs are available when the prediction is needed."
        },
        {
          "id": "b",
          "text": "Every numeric column must be included."
        },
        {
          "id": "c",
          "text": "The future answer should be copied into the inputs."
        },
        {
          "id": "d",
          "text": "Units and column meaning stay consistent."
        }
      ],
      "correctOptionIds": [
        "a",
        "d"
      ],
      "explanation": "Availability and meaning define usable inputs. Numeric form alone does not make a field suitable; copying the answer defeats prediction.",
      "example": "Distance in km at training must not silently become miles at inference."
    },
    {
      "id": "q3",
      "type": "single_correct",
      "prompt": "Predicting one of three flower species is what task?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Regression because codes are numbers"
        },
        {
          "id": "b",
          "text": "An exact database aggregation"
        },
        {
          "id": "c",
          "text": "Classification"
        },
        {
          "id": "d",
          "text": "Reinforcement learning automatically"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "Species are categories even when encoded by numbers. A numeric code does not make arithmetic on labels meaningful.",
      "example": "Species code 2 is not twice species code 1."
    },
    {
      "id": "q4",
      "type": "single_correct",
      "prompt": "What changes when labeled texts are used to predict hidden words rather than topic labels?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Nothing; the dataset permanently determines the task."
        },
        {
          "id": "b",
          "text": "The setup must become reinforcement learning."
        },
        {
          "id": "c",
          "text": "The hidden word stops being a target."
        },
        {
          "id": "d",
          "text": "The learning target is constructed from the text itself."
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "Self-supervised target construction uses the text as supervision. The existence of unused topic labels does not fix the new task.",
      "example": "The same collection can support multiple learning setups."
    },
    {
      "id": "q5",
      "type": "multiple_correct",
      "prompt": "Which parts appear in an interaction record for reinforcement learning?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "An observation"
        },
        {
          "id": "b",
          "text": "An action"
        },
        {
          "id": "c",
          "text": "A reward or feedback signal"
        },
        {
          "id": "d",
          "text": "A guaranteed correct-action label for every alternative"
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "c"
      ],
      "explanation": "Observations, actions and rewards describe experienced interactions. The record does not generally reveal every counterfactual action's outcome.",
      "example": "A logged move right does not tell us what moving left would have caused."
    },
    {
      "id": "q6",
      "type": "single_correct",
      "prompt": "A rule already specifies free shipping above a fixed threshold. What should you try first?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Implement the rule directly"
        },
        {
          "id": "b",
          "text": "Fit an approximation before reading the rule"
        },
        {
          "id": "c",
          "text": "Use a larger model to guarantee correctness"
        },
        {
          "id": "d",
          "text": "Cluster orders without considering the policy"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "The desired calculation is known. A direct implementation is testable and avoids approximation error.",
      "example": "Learning is not needed to reproduce an exact threshold contract."
    },
    {
      "id": "q7",
      "type": "single_correct",
      "prompt": "The scratch loop matches NumPy on one fixture. Which conclusion is justified?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "The model is reliable for unseen cities."
        },
        {
          "id": "b",
          "text": "The implementations agree for that fixture and formula."
        },
        {
          "id": "c",
          "text": "The model's feature causes the outcome."
        },
        {
          "id": "d",
          "text": "No further testing is useful."
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "Agreement checks implementation under the compared conditions. It does not establish real-world predictive or causal validity.",
      "example": "Use changed data to separate formulas that coincidentally agree once."
    },
    {
      "id": "q8",
      "type": "multiple_correct",
      "prompt": "Which distinguish training from inference?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Training selects behavior using examples or experience."
        },
        {
          "id": "b",
          "text": "Inference must receive the future target as input."
        },
        {
          "id": "c",
          "text": "Inference uses the learned behavior on an input."
        },
        {
          "id": "d",
          "text": "Every inference call necessarily retrains the model."
        }
      ],
      "correctOptionIds": [
        "a",
        "c"
      ],
      "explanation": "Training derives the learned state; ordinary inference applies it. The target is not required for making the prediction, and retraining is a separate operation.",
      "example": "Fit a rate once, then apply it to a new distance."
    },
    {
      "id": "q9",
      "type": "single_correct",
      "prompt": "Why compare a model with a baseline?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "A baseline proves every prediction is correct."
        },
        {
          "id": "b",
          "text": "A baseline removes the need for held-out evaluation."
        },
        {
          "id": "c",
          "text": "Every baseline is an advanced neural network."
        },
        {
          "id": "d",
          "text": "It gives a concrete simple reference that improvement must beat."
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "A baseline establishes a meaningful comparison, not a correctness guarantee. It should be evaluated under the same task conditions.",
      "example": "Tomorrow's baseline always predicts the most common training category."
    },
    {
      "id": "q10",
      "type": "multiple_correct",
      "prompt": "Which project notes demonstrate useful scientific caution?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Separate invented fixtures from measured data."
        },
        {
          "id": "b",
          "text": "Write two plausible explanations for an observation."
        },
        {
          "id": "c",
          "text": "Claim a private model architecture without evidence."
        },
        {
          "id": "d",
          "text": "Choose an experiment that separates the explanations."
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "d"
      ],
      "explanation": "Provenance, alternatives and discriminating experiments support reasoning. Invented private details do not.",
      "example": "A unit check can distinguish a conversion bug from missing predictive information."
    }
  ]
}
```
