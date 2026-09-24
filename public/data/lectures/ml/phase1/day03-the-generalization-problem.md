# Day 3: The Generalization Problem

**Duration: 4 hours baseline, split across sessions | Focus: diagnose misleading scores and protect evaluation from model-development choices**

---

## Why this day exists

You can remember the answers to a practice sheet.
That does not tell us how you will handle a different sheet.

A model can also look good on familiar examples.
Yesterday we kept some flowers outside training for that reason.

But unfamiliar rows are not always unfamiliar situations.
Two rows may describe the same person.
A field may reveal something that happens after the answer is needed.

We need to ask what the test actually tests,
before we decide what its score allows us to claim.

---

## Before you reveal: two recalls

Draw yesterday's split. Which arrays went into fit? Which labels were used only
after prediction to count correct answers? Why did the baseline choose its class
from training labels?

Then hand-trace a one-neighbor prediction at x=2.1 when the stored rows are
x=2 with label 0 and x=8 with label 1. State both distances.

---

## Feedback: the boundary and the mechanism

Fit used X_train and y_train. Predictions used X_test; comparing them with y_test
evaluated the procedure. The baseline used y_train to choose its constant output
so its rule was not selected using exam answers.

Distances from 2.1 are 0.1 and 5.9, so one-neighbor prediction is category 0.
A one-neighbor model can reproduce a unique training row's label by finding that
exact row at distance zero. That explains a possible perfect training score
without assuming the model discovered a useful broader pattern.

---

## Generalization is a claim about a population

A **sample** is the set of cases we observed.
The **population** is the wider set of cases about which we want to make a claim:
perhaps future flowers measured with the same procedure, or next month's orders.

**Generalization** means useful performance beyond the examples used to develop
the model, under a specified intended-use distribution.
A **distribution** describes which kinds of cases and outcomes occur, and how often.

A random sample of one city's deliveries does not automatically represent every
city. “Unseen” alone is not enough: a test must approximate the future conditions
the claim concerns.

The population is not necessarily all possible inputs. Today's task should state
a narrower, testable claim before measuring anything.

---

## Two perfect scores can mean different things

A model might score perfectly on training because the classes are genuinely easy
to distinguish, because the sample is small, or because it memorizes examples.
It might also exploit a field that improperly reveals the answer.

Perfect training accuracy is a reason to examine the mechanism and held-out
evidence, not a standalone verdict of cheating or a trophy proving usefulness.
Yesterday's KNN result was already evaluated on held-out Iris rows; we do not
need to manufacture a score drop to make it “honest.”

Now we construct a tiny fixture where the mechanism is completely visible.

---

## Predict this model's failure before running it

Training rows:

| x | recorded training label |
|---:|---:|
| 0 | 0 |
| 10 | 1 |
| 20 | 0 |
| 30 | 1 |

Held-out teaching rows:

| x | independently specified answer |
|---:|---:|
| 1 | 0 |
| 11 | 0 |
| 21 | 1 |
| 31 | 1 |

Use one nearest neighbor. Predict every training label and every held-out label.
Count the correct predictions yourself before seeing code.

This is a deliberately constructed example, not a report that real ML models
always achieve these percentages.

---

## The training score hid two bad labels

Each training row finds itself: predictions [0,1,0,1], so training accuracy is 4/4.
Held-out rows find nearest training rows 0,10,20,30, predicting [0,1,0,1].
Against [0,0,1,1], only the first and last are correct: 2/4, or 50%.

In this invented data-generating process, the trusted rule is “x at least 15
belongs to category 1; otherwise category 0.” Two training labels were deliberately
corrupted. We know that from the fixture's construction, **not** because a test
mistake authorizes us to rewrite a label.

Real data requires independent provenance or annotation evidence before changing
a disputed label. A model's disagreement is not the ground truth.

---

## Scratch calculation and library comparison

Save this as a separate `day03_fixture.py`:

```python
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

X_train = np.array([[0.0], [10.0], [20.0], [30.0]])  # shape: (4,1)
y_recorded = np.array([0, 1, 0, 1])                 # shape: (4,)
X_check = np.array([[1.0], [11.0], [21.0], [31.0]])  # shape: (4,1)
y_check = np.array([0, 0, 1, 1])                    # shape: (4,)
scratch = []
for row in X_check:
    distances = np.abs(X_train[:, 0] - row[0])      # shape: (4,)
    nearest = int(np.argmin(distances))
    scratch.append(int(y_recorded[nearest]))
model = KNeighborsClassifier(n_neighbors=1, metric="euclidean")
model.fit(X_train, y_recorded)
pred = model.predict(X_check)
assert np.array_equal(pred, scratch)
assert np.array_equal(pred, [0, 1, 0, 1])
print("train:", model.score(X_train, y_recorded))
print("check:", np.mean(pred == y_check))
```

`X_train[:, 0]` selects all rows of the first column. `row[0]` selects the query's
single feature. `np.argmin` returns the position of the smallest distance;
it is the minimum counterpart to yesterday's argmax. All nearest matches here
are unambiguous. The outputs are 1.0 for train and 0.5 for the check set.

---

## Repair the documented cause, not the desired percentage

Append:

```python
trusted_train = (X_train[:, 0] >= 15).astype(int)  # shape: (4,)
assert np.array_equal(trusted_train, [0, 0, 1, 1])
repaired_model = KNeighborsClassifier(n_neighbors=1, metric="euclidean")
repaired_model.fit(X_train, trusted_train)
repaired_pred = repaired_model.predict(X_check)
print("repaired check:", np.mean(repaired_pred == y_check))
assert np.array_equal(repaired_pred, y_check)
```

The comparison produces booleans; `.astype(int)` converts false to 0 and true
to 1. We use it here to reconstruct the labels from the independently known
fixture rule. The repaired teaching check becomes 100%.

This same four-row set was inspected during diagnosis, so its improved score is
a **debugging check**, not fresh independent evidence of real-world performance.
A final empirical claim needs separately reserved, representative cases after
the repair procedure is fixed. For this synthetic task the rule is known; in a
real task, future labels must come from a trusted observation process.

---

```quiz
{"prompt":"A one-neighbor model scores 100% on unique training rows. What does that result alone establish?","options":[{"text":"It can reproduce those training labels, including any incorrect labels.","correct":true},{"text":"Every training label is true.","correct":false},{"text":"The future population follows the same pattern.","correct":false},{"text":"The test set must contain leakage.","correct":false}],"explanation":"Each row can find itself at zero distance. This explains reproduction of stored labels without verifying their truth or future usefulness. Neither generalization nor leakage follows solely from the training score."}
```

---

## Read the gap as a clue

The **train–test gap** is the difference between training performance and held-out
performance for the same metric. A large gap can reflect learning quirks of the
training sample rather than patterns that carry over.

**Overfitting** means adapting too much to the particular development data,
including noise or idiosyncrasies, so performance on the intended new cases suffers.
**Underfitting** means the chosen procedure fails to capture useful patterns even
in the available training relationship.

| Observation | Candidate explanations | Useful next evidence |
|---|---|---|
| Train high, test lower | memorization, small sample, shift, data issue | inspect rows, provenance, split and uncertainty |
| Train low, test low | weak features, overly restrictive model, noisy labels, bug | check baseline and hand-computed examples |
| Both high | useful signal or shared shortcuts/leakage | audit feature timing and split independence |
| Test higher than train | small sample variation, easier test cases | inspect counts and sampling |

The pattern does not identify one unique cause. Multiple explanations can coexist.
A small gap is not enough if both scores are poor.

---

## Four ways an exam can leak answers

**Leakage** is information entering development or evaluation in a way that would
not be available under the intended prediction procedure, producing misleading
evidence of performance.

| Pattern | Concrete failure | Repair direction |
|---|---|---|
| Target leakage | predict loan default using a later collections outcome | keep only information available at decision time |
| Contamination | near-duplicate versions of the same case appear on both sides | separate related cases before modeling |
| Temporal leakage | use future observations to build a past-time predictor | make development respect time |
| Preprocessing leakage | estimate data transforms using held-out values | learn transforms on training data only |

These categories can overlap. The useful action is identifying exactly how
information crossed the intended boundary, not winning an argument about its name.
The [scikit-learn pitfalls guide](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)
documents the general separation principle.

---

## A field can reveal an answer without sharing its name

Suppose a return-risk model predicts whether an order will be returned next month.
The features include `refund_processed`, recorded after the return happened.
Even if the target column itself is removed, the answer has entered indirectly.

Ask, for each feature: **Could I read this value at the instant the production
prediction is required?** If not, it does not belong in that prediction's inputs.

Sometimes a status known at a later time is valid for a different task.
For example, predicting processing delay after a refund begins has a different
prediction moment. Feature eligibility follows the task, not a permanent list
of forbidden column names.

---

## Different rows can still be the same case

A patient has ten visits. If nine visits enter training and the tenth enters test,
a model may identify that patient rather than learn to handle a new patient.

That split may be valid for a carefully defined “next visit of a known patient”
task if timing and availability are respected. It is not a reliable test of
“first visit of a never-seen patient.” The intended use determines the boundary.

A **group split** assigns all records of one entity to one side when evaluation
requires new entities. Group can mean patient, customer, household or source
document. Deduplicating literal identical rows alone may miss slightly edited
copies or related examples.

---

```quiz
{"prompt":"You want to predict outcomes for patients never seen during development. Which split best matches that claim?","options":[{"text":"Randomly place each visit independently on either side.","correct":false},{"text":"Put future outcomes into the features.","correct":false},{"text":"Keep every visit of a patient on only one side of the split.","correct":true},{"text":"Use training accuracy because visits are related.","correct":false}],"explanation":"A group boundary prevents the same patient's records from appearing in development and evaluation for a new-patient claim. A random visit split can test a different task. Future features and training-only scores do not repair that mismatch."}
```

---

## Time changes what could have been known

For next month's demand, a random split can let later months inform training while
earlier months are called test. That reverses the intended prediction direction.

A simple chronological design trains on an earlier period and evaluates on a later
period. Every feature must also be constructed from information available by its
prediction time. A “past seven-day average” must not accidentally include tomorrow.

Sorting by time alone is not a complete solution: delayed labels, overlapping
windows and repeated entities may need additional separation.
For today's small lab, we can demonstrate the boundary directly with indices;
advanced time-series validation comes later.

---

## Preprocessing is part of the learned procedure

**Preprocessing** changes raw inputs into the representation given to a model.
Some changes are fixed in advance, such as a known metres-to-centimetres conversion.
Others estimate quantities from data, such as a minimum and maximum.

Consider a one-feature rule mapping the training minimum to 0 and maximum to 1:

```text
scaled(x) = (x - training minimum) / (training maximum - training minimum)
```

If training values are 10 and 20, their transformed values are 0 and 1.
A future value 30 maps to 2. That is not an arithmetic bug: it is outside the
observed training range. We did not promise every future value stays in [0,1].

If we include future 30 when estimating the range, the training values instead
become 0 and 0.5. Held-out information has changed the fitted representation.

---

## Compute a transform without crossing the boundary

```python
import numpy as np

train = np.array([10.0, 20.0])    # shape: (2,)
future = np.array([30.0])        # shape: (1,)
low = np.min(train)
high = np.max(train)
assert high > low
train_scaled = (train - low) / (high - low)
future_scaled = (future - low) / (high - low)
assert np.array_equal(train_scaled, [0.0, 1.0])
assert np.array_equal(future_scaled, [2.0])
print(train_scaled, future_scaled)
```

`np.min` and `np.max` extract the smallest and largest training values.
The assertion rejects a zero range; a constant feature needs an explicit handling
policy before division. Both sets use the same training-derived numbers.
We are teaching the mechanism locally, not assuming a future preprocessing API.

With one feature, uniform positive scaling preserves neighbor ordering. In multiple
features, changing their relative scales can change the neighbors. Thus leakage
does not have to improve every model or every score to violate the evaluation design.

---

## Session checkpoint: name the crossing

Close the table and explain one example each of target, contamination, temporal
and preprocessing leakage. For each, name the exact information that crossed the
boundary and the intended deployment condition it violated.

Then draw a training-only transform used on both training and held-out rows.
A correction is more useful when you can say what it protects.
Take a break before model selection; it introduces a third data role.

---

## Choosing a model needs a practice exam

Suppose we want to compare k=1, k=3 and k=5.
Training accuracy alone favors memorization in some cases, but using the final
test repeatedly makes the final test guide our choice.

Introduce a **validation set**: held-out development cases used to choose settings.
The final test remains separate until the chosen procedure is fixed.

```text
training rows   → fit candidate models
validation rows → compare candidates and choose a setting
training + validation, if planned → refit the chosen setting
final test     → one final evaluation of that fixed procedure
```

Validation is not an unlimited source of truth. Repeated experimentation can adapt
to its quirks too. Today we make three predeclared comparisons and record the rule
for ties. Later, more robust validation methods will extend this design.

---

## Plan the partition sizes before writing code

Use Iris again, but this is a **teaching demonstration of three-way splitting**,
not a fresh publication-quality benchmark. We already inspected results from
the dataset yesterday.

First reserve 30 final-test rows, leaving 120 development rows.
Then reserve 25% of those 120 for validation: 30 rows.
That leaves 90 for training.

```text
150 original
├── 30 test
└── 120 development
    ├── 30 validation
    └── 90 training
```

The second fraction is 0.25 of the development remainder, not 0.25 of the original.
Each split preserves category proportions through stratification.
Choose settings and tie behavior before looking at validation outcomes.

---

## Make the three roles explicit

Start a new `day03_selection.py`:

```python
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

X, y = load_iris(return_X_y=True)
X_dev, X_test, y_dev, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
X_train, X_val, y_train, y_val = train_test_split(
    X_dev, y_dev, test_size=0.25, random_state=7, stratify=y_dev)
assert X_train.shape == (90, 4)
assert X_val.shape == X_test.shape == (30, 4)
assert y_train.shape == (90,)
assert y_val.shape == y_test.shape == (30,)
```

`return_X_y=True` asks the Iris loader for the feature table and labels directly,
instead of the named container used yesterday. Nothing about the underlying
examples changes. The two seeds control two different splits; neither is chosen
for a desired score.

The array names encode roles. None of the final test values is needed to fit or
select the candidate models.

---

## Choose a candidate from validation only

Append:

```python
candidate_ks = [1, 3, 5]
best_k = None
best_validation = -1.0
for k in candidate_ks:
    candidate = KNeighborsClassifier(n_neighbors=k, weights="uniform",
                                     metric="euclidean")
    candidate.fit(X_train, y_train)
    validation_accuracy = candidate.score(X_val, y_val)
    print("k:", k, "validation:", validation_accuracy)
    if validation_accuracy > best_validation:
        best_validation = validation_accuracy
        best_k = k
assert best_k in candidate_ks
print("chosen k:", best_k)
```

`None` marks “nothing selected yet.” Accuracy cannot be below zero, so -1 ensures
the first evaluated candidate replaces the initial state.
The strict `>` keeps the earlier candidate when scores tie. Because our list is
[1,3,5], the declared tie rule selects the smallest listed k.

That is a convention for this controlled comparison, not a law that smaller k is
always better. Changing candidates or tie rules after inspecting results is another
development choice to disclose.

---

## Refit, then evaluate the chosen procedure

Append:

```python
final_model = KNeighborsClassifier(n_neighbors=best_k, weights="uniform",
                                   metric="euclidean")
final_model.fit(X_dev, y_dev)
final_pred = final_model.predict(X_test)
majority = int(np.argmax(np.bincount(y_dev, minlength=3)))
baseline_pred = np.full(y_test.shape, majority, dtype=int)
test_accuracy = float(np.mean(final_pred == y_test))
baseline_accuracy = float(np.mean(baseline_pred == y_test))
print("final test:", test_accuracy, "baseline:", baseline_accuracy)
print("correct:", int(np.sum(final_pred == y_test)), "of", len(y_test))
```

After choosing k, we refit using all 120 development rows, including validation
rows. That was part of the plan. Validation chose a setting; the final test
evaluates the refitted procedure. The constant baseline now also uses development
labels, keeping its learning boundary consistent.

Do not change k after this output and continue calling the same test untouched.
If diagnosis leads to further development, record that the test was consulted and
reserve genuinely fresh evaluation evidence for a new final claim.

---

```quiz
{"prompt":"You reserve 20% of 150 rows for test, then 25% of the remainder for validation. What are the training, validation and test sizes?","options":[{"text":"75, 45, 30","correct":false},{"text":"90, 30, 30","correct":true},{"text":"120, 30, 30","correct":false},{"text":"100, 25, 25","correct":false}],"explanation":"The first split leaves 120 development rows. A quarter of 120 is 30, leaving 90 for fitting candidates. The second percentage applies to the remainder, not the original total."}
```

---

## Small exams have visible uncertainty

On a 30-row test, one mistake changes accuracy by about 3.33 percentage points.
Two procedures differing by one correct answer have not automatically established
a stable population-level advantage.

There are several sources of uncertainty: which cases entered the sample, their
measurement quality, how representative the split is, and sometimes randomness
in learning. A fixed seed makes one experiment reproducible; it does not remove
these uncertainties.

For today's report, preserve the numerator and denominator, baseline, selection
procedure and population claim. Later statistical lessons derive uncertainty
intervals and repeated evaluation carefully. Do not invent a confidence statement
from a single rounded percentage.

---

## A slice can reveal what an average hides

A **slice** is a meaningful subset, such as one species or one region.
An overall score can combine easy and hard subsets into one number.

After the final fixed Iris evaluation, this diagnostic prints counts by species:

```python
for label in [0, 1, 2]:
    mask = y_test == label
    total = int(np.sum(mask))
    right = int(np.sum(final_pred[mask] == y_test[mask]))
    print("species code:", label, "correct:", right, "of", total)
```

A boolean mask selects rows for which the condition is true. Here each class
has ten test examples because of the split. Ten is still a small sample.

This inspection can identify questions for future development. If you then change
the model based on a slice's errors, the same final test is now development evidence.
Reporting every slice does not make a previously consulted test fresh again.

---

## Design the smallest experiment that separates causes

Observation: a model trained on last year's deliveries performs worse this month.

Candidate explanation A: the incoming distance field changed from kilometres to metres.
Candidate explanation B: road closures changed how long trips take.

Discriminating check: take a few trips with verified physical distance and inspect
the raw field values. A factor-of-1,000 discrepancy supports the units explanation.
If units agree, compare duration patterns on similar routes while checking dates
and collection procedures. That may support a change in the relationship, but
still requires evidence.

**Distribution shift** means the kinds of inputs, their frequency, or their
relationship to outcomes differ from development conditions.
A larger model does not automatically fix a mismatched input contract or a changed
world. Diagnose before prescribing.

---

```quiz
{"prompt":"Training values 10 and 20 define a min-max transform. What should the same transform produce for a held-out value 30?","options":[{"text":"1, because every transformed value must be clipped to the training range.","correct":false},{"text":"0.5, after refitting on the held-out value.","correct":false},{"text":"An error solely because the result exceeds 1.","correct":false},{"text":"2, because (30-10)/(20-10) is 2.","correct":true}],"explanation":"Apply the training-derived transform unchanged. An outside-range value can map outside [0,1]; clipping would be an additional explicit policy. Refitting the transform on the held-out value crosses the evaluation boundary."}
```

---

## Inspect a split with identities and masks

The group/time exercises use the same row-selection idea as the species slice.
`patients == 30` produces a boolean array: true for rows belonging to patient 30.
For a boolean NumPy array, `~mask` flips true and false, selecting the other rows.
`np.flatnonzero(mask)` returns the positions selected by that mask.

A Python `set` keeps distinct values. Converting the patient IDs on each side to
sets lets us ask whether any patient appears in both: `left.isdisjoint(right)` is
true exactly when they share no member. This checks entity separation; it does
not establish that either side represents a sufficiently diverse population.

For a time cutoff, `days <= 3` similarly marks the earlier records. Select those
values to fit a transform, then apply the training-derived constants to later rows.
`np.allclose(actual, expected, rtol=0, atol=1e-12)` extends Day 1's closeness check
to an array: every corresponding pair must meet the chosen tolerance. Today's
tiny arithmetic makes that tolerance appropriate; do not reuse it blindly for
large or numerically unstable computations.

---

## Common mistakes

| Observation or action | What it does not establish | Better next step |
|---|---|---|
| 100% training accuracy | true labels or generalization | inspect mechanism and held-out evidence |
| Train/test gap | one uniquely identified cause | compare competing explanations |
| Different row IDs | independent real-world cases | inspect groups and duplicates |
| Random splitting | correct simulation of future use | consider time and entity boundaries |
| More trials on the same test | an independent final score | separate validation; disclose reuse |
| Better score after label edits | legitimate ground-truth repair | require independent label provenance |

---

## Practice

Produce a short experiment report with code, actual counts, competing explanations
and a stated boundary. The core tasks are the synthetic diagnosis and a three-way
Iris experiment. The remaining tasks test transfer and delayed reconstruction.

Allow about 25–40 minutes for a new task and longer when a prerequisite needs repair.
Ask for a hint about the layer that blocks you: shape, code, mechanism, or experimental
design. A copied high score is not a substitute for the report.

---

## Task 1 — explain the manufactured gap

Rebuild the four-row synthetic fixture from the teaching section.
Compute one-neighbor predictions by hand, with your own NumPy loop, and with sklearn.
Then repair only the labels that the independently known x>=15 rule establishes
were corrupted. Report before/after results and explain why the reused check set
is debugging evidence rather than a new generalization test.

---

## Task 1 hints

1. Every unique training row finds itself, even when its stored label is wrong.
2. Match check rows 1,11,21,31 to training rows 0,10,20,30.
3. Trusted training labels are [0,0,1,1]; the old labels were [0,1,0,1].

---

## Task 1 feedback

The original training score is 4/4 and check score 2/4.
After the fixture's independently justified correction, check predictions are
[0,0,1,1], giving 4/4. The complete runnable solution is the two consecutive
blocks under “Scratch calculation” and “Repair the documented cause”; keep them
in one separate file and verify their assertions.

If you changed labels only to agree with desired check outcomes, you changed the
meaning of the task rather than diagnosing trustworthy ground truth.
Your report should name the synthetic rule as the source of the correction.

---

## Task 2 — choose k without consulting the final test

Independently write the three-way Iris experiment. Predeclare candidate settings
[1,3,5], choose using validation accuracy with the stated tie rule, refit on development,
then report final-test and baseline counts. Save the actual candidate scores.

Add a note that Iris has already been used in this teaching sequence; this is a
workflow demonstration, not an untouched external scientific benchmark.

---

## Task 2 hints and feedback

First draw the 90/30/30 partitions. Next, check that every candidate score uses
X_val and y_val. Finally, check that X_test and y_test appear only in the fixed
final evaluation and subsequent disclosed diagnostics.

The three consecutive script blocks in the teaching section form the runnable
reference. A valid artifact can choose any candidate the observed validation
scores and predeclared tie rule select; do not hard-code a desired k.

Record the environment version as yesterday. If your output differs from a peer's,
compare data, versions, settings and splits before claiming one model is better.

---

## Task 3 — protect patient groups

Here are record IDs 0 through 5 with patient IDs [10,10,20,20,30,30].
Your claim concerns patients never encountered during training. Put patient 30
in the check set and all other patients in training. Produce the two index lists
and verify there is no patient overlap. Do not train a model; the split is the artifact.

---

## Task 3 hints

1. Split by patient identity, not independent row position.
2. Construct a boolean condition for patient == 30.
3. Use flatnonzero on the condition and its logical opposite.

---

## Task 3 feedback

```python
import numpy as np

patients = np.array([10, 10, 20, 20, 30, 30])
check_mask = patients == 30
check_indices = np.flatnonzero(check_mask)
train_indices = np.flatnonzero(~check_mask)
train_patients = set(patients[train_indices])
check_patients = set(patients[check_indices])
assert train_patients.isdisjoint(check_patients)
assert np.array_equal(train_indices, [0, 1, 2, 3])
assert np.array_equal(check_indices, [4, 5])
print(train_indices, check_indices)
```

Here `~` flips each entry of a boolean NumPy array. A Python `set` keeps distinct
patient IDs; `isdisjoint` checks that two sets share no member. These operations
inspect the split, not learn from outcomes. Patient 30 alone is a tiny teaching
check, not representative evidence for all future patients.
For a “future visit of known patients” claim, you would also need a time-aware design.

---

## Task 4 — respect time and fitted transforms

Observed days are 1,2,3,4,5 with feature values 10,12,14,16,30.
Use days 1–3 as training and days 4–5 as later check cases.
Fit the min-max rule only on training. Predict the transformed check values by hand,
then implement. State why values above one are possible.

---

## Task 4 hints

1. Training minimum is 10 and maximum is 14.
2. Transform all later values with that same range of 4.
3. The check values become 1.5 and 5, not numbers forced into [0,1].

---

## Task 4 feedback

```python
import numpy as np

days = np.array([1, 2, 3, 4, 5])
values = np.array([10.0, 12.0, 14.0, 16.0, 30.0])
train_mask = days <= 3
train_values = values[train_mask]
check_values = values[~train_mask]
low, high = np.min(train_values), np.max(train_values)
assert high > low
transformed = (check_values - low) / (high - low)
assert np.allclose(transformed, [1.5, 5.0], rtol=0, atol=1e-12)
print(transformed)
```

`allclose` requires the tolerance comparison to pass for all corresponding array
entries. Later values exceed the historical range. Re-estimating the range using
day 5 would let the future influence the earlier fitted procedure.
This example checks one boundary; real temporal evaluation may need more constraints.

---

## Task 5 — diagnose without a named technique

After a delay, read this case without the lecture:
“An order model gets 98% on a random-row split. Some orders have several edited
records. One feature is the date the refund completed. The product must decide
return risk when an order is placed.”

Write two independent failure hypotheses and the smallest checks that distinguish
them. Propose an evaluation boundary. Then reconstruct the three-way data-role
diagram from memory.

---

## Task 5 hints and feedback

First inspect prediction-time availability; then inspect whether related records
crossed the split. These are separate questions, so finding one does not clear the other.

Refund completion occurs after the placement-time decision and should be excluded
from its feature contract. Edited records of the same order can contaminate the
split; group them together. For future orders, reserve a later period, while
respecting related entities and label availability. Choose settings within the
development boundary and keep final evaluation separate.

Keep only two durable cues: “Which information crosses the boundary?” and “What
evidence distinguishes my two explanations?” Revisit with a changed domain after
study, following the adjustable review schedule and daily cap.
Record whether the reconstruction was independent; the existence of this answer
does not demonstrate that you could produce it.

---

## Cheat sheet

| Concept | Operational meaning |
|---|---|
| Population / sample | intended wider cases / observed cases |
| Generalization | useful performance beyond development under specified conditions |
| Gap | diagnostic difference, not a unique cause |
| Leakage | information crosses the intended prediction/development boundary |
| Group / time split | simulate new entities / later use |
| Fitted preprocessing | derive on training; apply the same rule to held-out rows |
| Validation | guide model-selection decisions |
| Final test | evaluate a fixed procedure; disclose later reuse |
| Small-score claim | include correct count, denominator, baseline and limitations |

---

## Tomorrow

Day 4 predicts a number with linear regression. It will explain a new model and
the measurements used to judge numeric prediction errors.

The evaluation habit remains: define the task, protect the split, use a baseline,
inspect errors and state what the evidence supports. No model upgrade replaces it.

---

```finalquiz
{
  "title": "Day 3: What does the test actually test?",
  "questions": [
    {
      "id": "q1",
      "type": "single_correct",
      "prompt": "What does the intended population specify?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Only the stored training rows"
        },
        {
          "id": "b",
          "text": "The wider cases about which the performance claim is made"
        },
        {
          "id": "c",
          "text": "Every imaginable input without limits"
        },
        {
          "id": "d",
          "text": "The name of the dataset file"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "Generalization concerns a specified wider use, not merely the sample or every conceivable input. The population claim guides evaluation design.",
      "example": "Future deliveries in one service region form a narrower claim than worldwide delivery prediction."
    },
    {
      "id": "q2",
      "type": "multiple_correct",
      "prompt": "Which explanations can be consistent with perfect training accuracy?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Memorizing unique training rows"
        },
        {
          "id": "b",
          "text": "Genuinely separable categories"
        },
        {
          "id": "c",
          "text": "Corrupted labels being reproduced"
        },
        {
          "id": "d",
          "text": "Guaranteed truth of every recorded label"
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "c"
      ],
      "explanation": "Several mechanisms can reproduce training answers. The score does not authenticate labels or establish future performance.",
      "example": "A one-neighbor model can retrieve a training row's own wrong label."
    },
    {
      "id": "q3",
      "type": "single_correct",
      "prompt": "In the synthetic fixture, where did legitimate repaired labels come from?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "The known data-generating rule specified independently of model predictions"
        },
        {
          "id": "b",
          "text": "A desire to get 100%"
        },
        {
          "id": "c",
          "text": "The most confident model prediction"
        },
        {
          "id": "d",
          "text": "Changing every test label to match the model"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "The fixture explicitly supplies a trusted threshold rule. Repair requires independent evidence; prediction agreement or a desired score is not ground truth.",
      "example": "At x=10 the trusted rule says 0 despite the corrupted recorded 1."
    },
    {
      "id": "q4",
      "type": "single_correct",
      "prompt": "Which split matches evaluating future months?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Use later months for training and earlier months for final testing."
        },
        {
          "id": "b",
          "text": "Mix all dates and ignore feature construction times."
        },
        {
          "id": "c",
          "text": "Use a random seed until the score rises."
        },
        {
          "id": "d",
          "text": "Use earlier development data and later evaluation, respecting feature and label availability."
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "Chronology and information timing must match deployment. Merely shuffling or searching seeds does not address future information.",
      "example": "A past-week feature must exclude tomorrow's observations."
    },
    {
      "id": "q5",
      "type": "multiple_correct",
      "prompt": "Which are leakage risks for a placement-time return predictor?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Refund completion as an input"
        },
        {
          "id": "b",
          "text": "Using a fixed units conversion known in advance"
        },
        {
          "id": "c",
          "text": "Edited copies of one order on both sides"
        },
        {
          "id": "d",
          "text": "Choosing k from validation within development"
        }
      ],
      "correctOptionIds": [
        "a",
        "c"
      ],
      "explanation": "Future refund information and related-record contamination cross the intended boundary. A predeclared unit conversion and appropriate validation use do not inherently do so.",
      "example": "Define the prediction moment and entity boundary first."
    },
    {
      "id": "q6",
      "type": "single_correct",
      "prompt": "A training-only min-max transform fitted on 10 and 20 receives 30. What happens?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "It must refit its maximum to 30."
        },
        {
          "id": "b",
          "text": "It produces 2 under the unchanged transform."
        },
        {
          "id": "c",
          "text": "The held-out label decides the range."
        },
        {
          "id": "d",
          "text": "It proves the code is wrong."
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "The formula gives (30-10)/(20-10)=2. Held-out values can exceed the observed training range without violating the transform.",
      "example": "Clipping would be an additional explicit policy."
    },
    {
      "id": "q7",
      "type": "single_correct",
      "prompt": "Which tasks belong to validation and final test respectively?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Fit every candidate on test, then report validation."
        },
        {
          "id": "b",
          "text": "Choose settings on test, then rename it validation afterward."
        },
        {
          "id": "c",
          "text": "Choose settings on validation; evaluate the fixed procedure on final test."
        },
        {
          "id": "d",
          "text": "Use both interchangeably because both are unseen at first."
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "Roles are determined by how information is used. Once a set guides choices, it is development evidence; renaming does not restore an untouched final test.",
      "example": "Three candidate k values can be compared on validation."
    },
    {
      "id": "q8",
      "type": "multiple_correct",
      "prompt": "Which statements about a train-test gap are warranted?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "A gap uniquely proves overfitting."
        },
        {
          "id": "b",
          "text": "A gap can motivate inspection of sampling or shift."
        },
        {
          "id": "c",
          "text": "A small gap guarantees usefulness."
        },
        {
          "id": "d",
          "text": "The same gap can have multiple causes."
        }
      ],
      "correctOptionIds": [
        "b",
        "d"
      ],
      "explanation": "The gap is a clue. Sampling, shift, noise, memorization or bugs require different evidence. Two low scores can have a small gap and still be useless.",
      "example": "Write two explanations and a check that separates them."
    },
    {
      "id": "q9",
      "type": "single_correct",
      "prompt": "One extra correct answer on a 30-row test changes accuracy by approximately how much?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "3.33 percentage points"
        },
        {
          "id": "b",
          "text": "30 percentage points"
        },
        {
          "id": "c",
          "text": "0.03 percentage points"
        },
        {
          "id": "d",
          "text": "It has no effect"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "One divided by thirty is about 0.0333 as a fraction, or 3.33 percentage points. Counts reveal how coarse a small evaluation is.",
      "example": "29/30 and 30/30 differ by one case, not proof of universal superiority."
    },
    {
      "id": "q10",
      "type": "multiple_correct",
      "prompt": "Which reporting habits preserve the meaning of evidence?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Include counts and the baseline."
        },
        {
          "id": "b",
          "text": "Disclose test reuse after diagnosis."
        },
        {
          "id": "c",
          "text": "Separate a debugging check from fresh evaluation."
        },
        {
          "id": "d",
          "text": "Hide experiments that did not improve the score."
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "c"
      ],
      "explanation": "Counts, a reference and disclosure make the procedure assessable. Hiding unfavorable development history can misrepresent evidence.",
      "example": "A repaired teaching fixture is not a new independent population sample."
    }
  ]
}
```
