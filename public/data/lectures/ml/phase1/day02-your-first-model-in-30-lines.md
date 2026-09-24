# Day 2: Your First Model in 30 Lines

**Duration: 4 hours baseline, split across sessions | Focus: trace neighbor votes, fit one fixed model, and evaluate it against an honest baseline**

---

## Why this day exists

Yesterday we chose a prediction rule from examples.
Today we need to see one work on measured data.

Imagine an unfamiliar flower beside a tray of named flowers.
You compare its measurements with the flowers you already know.
Nearby examples can help suggest its name.

But checking only the tray you learned from would be an easy test.
We need some flowers that stay outside the learning process.

A useful first model should be small enough to explain,
and tested carefully enough that its score means something.

---

## Before you reveal: two recalls

From Day 1, draw the training and inference paths. Which path can use known
answers for the examples it learns from?

Then explain the shape difference between a table with five rows and one feature
and a collection of five labels. Write both shapes before continuing.

---

## Feedback: keep inputs and answers paired

Training can use known labels. Inference receives features and produces a predicted
label; a real answer, if later available, can be used for evaluation.

Five examples with one feature form shape `(5, 1)`. Their labels form `(5,)`.
Each row and its label must refer to the same example. Shuffling the feature rows
without moving their labels in the same way destroys those pairings.

Keep that diagram beside your notebook. Today we add a voting mechanism, not a
new definition of training.

---

## A small decision you can make by hand

Our invented training data has one numeric feature, a measurement x, and two
category codes. Codes 0 and 1 are names, not quantities to average.

| x | label |
|---:|---:|
| 1 | 0 |
| 2 | 0 |
| 4 | 1 |
| 7 | 1 |
| 9 | 1 |

For a new x=1.5, find the **three nearest** x values and let their labels vote.
Write the three distances, the labels and the winning label before moving on.
Distance in one dimension is the absolute difference.

---

## Trace the first vote

Distances from 1.5 to 1, 2, 4, 7 and 9 are 0.5, 0.5, 2.5, 5.5 and 7.5.
The three nearest training rows therefore have labels 0, 0 and 1.
Two votes beat one: predict label 0.

The method is **k-nearest neighbors**, abbreviated KNN.
The setting k is the number of nearby examples consulted. Here k=3.
It is a hyperparameter: we choose it before fitting this model.

For this classifier, fitting primarily stores training information for later
neighbor queries. There is no learned slope or gradient step to imagine.
Different algorithms learn in different ways; `fit` is an interface, not one
universal optimization procedure.

---

## Two more votes before any library

Repeat the calculation for x=5.2 and x=8.2. Keep the training table unchanged.
Write three nearest measurements and their labels for each.

If you are unsure, calculate all five absolute differences and sort them from
smallest to largest. Do not guess from only the closest example; k is three.

---

## Feedback: distance first, vote second

| Query | Three nearest training x values | Labels | Prediction |
|---:|---|---|---:|
| 5.2 | 4, 7, 2 | 1, 1, 0 | 1 |
| 8.2 | 9, 7, 4 | 1, 1, 1 | 1 |

For 5.2, distances are 4.2, 3.2, 1.2, 1.8 and 3.8.
For 8.2, they are 7.2, 6.2, 4.2, 1.2 and 0.8.

The prediction is a category selected by votes, not the average of the numeric
category codes. Odd k prevents a two-class vote tie when every neighbor has one
vote, but does not prevent all multiclass ties or distance ties at the cutoff.
Our examples avoid an ambiguous winning label.

---

```quiz
{"prompt":"The three selected neighbors have category labels 0, 0 and 1. What does ordinary equal-vote KNN classification predict?","options":[{"text":"The new numeric category 1/3.","correct":false},{"text":"Category 1 because it has the largest code.","correct":false},{"text":"Category 0 because it has more votes.","correct":true},{"text":"The feature value of the nearest row.","correct":false}],"explanation":"Classification selects a category by vote count. Numeric label codes are identifiers, not measurements to average or rank. Feature distance selects neighbors; label votes select the output category."}
```

---

## Implement the vote with arrays

Run this standalone script in the NumPy environment from Day 1:

```python
import numpy as np

train_x = np.array([1.0, 2.0, 4.0, 7.0, 9.0])  # shape: (5,)
train_y = np.array([0, 0, 1, 1, 1])               # shape: (5,)
queries = np.array([1.5, 5.2, 8.2])              # shape: (3,)
scratch_predictions = []
for query in queries:
    distances = np.abs(train_x - query)          # shape: (5,)
    order = np.argsort(distances)                 # shape: (5,)
    neighbor_labels = train_y[order[:3]]          # shape: (3,)
    counts = np.bincount(neighbor_labels, minlength=2)
    prediction = int(np.argmax(counts))
    scratch_predictions.append(prediction)
print(scratch_predictions)
assert scratch_predictions == [0, 1, 1]
```

Subtraction compares every training value with the current query.
`np.abs` removes the sign of each difference.
`np.argsort` returns indices in increasing-value order, not the sorted values.
`order[:3]` takes the first three indices; indexing train_y with them selects
the labels belonging to those same rows.

---

## Count labels without treating them as measurements

For labels [0,0,1], `np.bincount(..., minlength=2)` returns [2,1]:
two occurrences of code 0 and one of code 1. It requires nonnegative integer codes.
`minlength=2` ensures both categories have a count even if one receives no votes.

`np.argmax` returns the position of a largest count. Here position zero is
category code zero. In a tie it returns the first maximum, a rule we should
understand rather than mistake for evidence of superiority. Our fixture has no
winning-vote ties, and we do not claim general library parity under every tie case.

`int(...)` converts the NumPy integer scalar to an ordinary Python integer.
The stored predictions are [0,1,1]. We can now compare this explicitly understood
mechanism with an ML library.

---

## Prepare the local environment

Use a project environment so dependencies belong to this course's files.

macOS/Linux terminal:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install numpy scikit-learn
```

Windows PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install numpy scikit-learn
```

`venv` creates an isolated environment; activation chooses its Python for the
terminal. `python -m pip` installs into that selected interpreter.
The installed package is named `scikit-learn`; its import name is `sklearn`.
Use the same interpreter in your notebook if you use one.
If imports fail, check interpreter selection before changing model code.

The module attribute `sklearn.__version__` records the installed library version
after `import sklearn`. Keep it with the fixed settings in your experiment notes
so a later difference can be investigated rather than guessed at.

---

## Library parity on the tiny votes

Append this below the scratch script:

```python
from sklearn.neighbors import KNeighborsClassifier

tiny_model = KNeighborsClassifier(n_neighbors=3, weights="uniform",
                                 metric="euclidean")
tiny_model.fit(train_x.reshape(-1, 1), train_y)
library_predictions = tiny_model.predict(queries.reshape(-1, 1))
assert np.array_equal(library_predictions, scratch_predictions)
print(library_predictions)
```

`KNeighborsClassifier(...)` constructs an object holding the settings and, after
fit, the learned state. `n_neighbors=3` selects three neighbors.
`weights="uniform"` gives each one an equal vote.
`metric="euclidean"` selects ordinary straight-line distance.
The [official estimator contract](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html)
documents these settings.

`reshape(-1, 1)` makes a one-feature table: infer the number of rows from the
available values and use one column. Training becomes shape (5,1); queries (3,1).
`fit(X,y)` receives paired feature rows and labels. `predict(X)` returns one
category code per row. `array_equal` checks exact equality of these discrete
predictions; a floating tolerance is unnecessary for category IDs.

---

## More features require one distance per row

Iris has four measurements per flower. Think of a row as a point with four
coordinates. Straight-line distance extends the one-feature idea:

1. Subtract corresponding measurements.
2. Square each difference, making it nonnegative.
3. Add those squared differences.
4. Take the square root, the nonnegative number whose square is that sum.

For two-feature points (1,2) and (4,6), differences are -3 and -4; squared
differences are 9 and 16; their sum is 25; distance is 5.

In symbols, for two rows x and z with d features:

```text
distance(x, z) = square root of [ (x₁ - z₁)² + ... + (x_d - z_d)² ]
```

Here a subscript selects a column, d is the number of columns, and the dots mean
continue adding the squared differences for every column. The result is one distance number per pair
of rows. You do not need calculus to follow this calculation.

---

## Units influence who is near

If one feature is height in metres and another is a quantity in thousands,
their raw numeric differences can contribute very differently to the distance.
Changing metres to centimetres multiplies that coordinate's differences by 100
and its squared contributions by 10,000.

That can change the selected neighbors without changing the underlying objects.
Iris's four measurements are all given in centimetres, which makes this first
raw-distance exercise understandable; equal units still do not prove optimal
relative weighting.

We fix this representation for today's experiment. Later lessons teach systematic
transformations. Do not silently add an unexplained scaler to make the score
look better. Feature order and units are part of the model's input contract.

---

```quiz
{"prompt":"You fitted on rows with four features. To predict one new flower, what feature-array shape is required?","options":[{"text":"(4, 1), treating each measurement as a separate flower.","correct":false},{"text":"(4,), because the library never needs a row dimension.","correct":false},{"text":"(1,), containing only a label.","correct":false},{"text":"(1, 4), one row containing four features in the training order.","correct":true}],"explanation":"The estimator expects rows of examples and columns of features. One flower still needs a row dimension. Four rows with one feature change the meaning and violate the fitted four-feature contract."}
```

---

## Session checkpoint

Without copying, compute one vote from the five-row fixture and explain each
array's shape. Then rerun the scratch/library comparison.

Agreement demonstrates this mechanism under matched settings on an unambiguous
fixture. It is not yet an estimate of performance on unseen real flowers.
The next session creates that evaluation boundary.

---

## Keep an exam set outside fitting

If you ask KNN to classify its own training rows, each row can find itself.
That can produce an optimistic result about a different question:
“Can I reproduce the examples I already stored?”

A **training set** supplies the examples used for fitting.
A **test set** is held aside to evaluate the fitted procedure on different examples.
We split paired feature rows and labels together **before fitting**.

Today, choose k=3 in advance and leave it fixed. If you repeatedly change k after
looking at test results, the test starts influencing your choices. It is no longer
an untouched final exam. Day 3 adds a separate validation set for such decisions.

---

## Meet the Iris table

The [Iris dataset](https://scikit-learn.org/stable/datasets/toy_dataset.html#iris-plants-dataset)
contains 150 flowers with four measured features and three species.
It is bundled with scikit-learn, so this lab needs no account or dataset download.

Feature order is sepal length, sepal width, petal length, petal width, all in cm.
Sepals are the outer flower parts; petals are the familiar inner colored parts.
A row contains their lengths and widths, not a photograph.
There are 50 examples of each species.

A **Bunch** returned by the loader is a container with named fields accessible
as attributes. `data` holds measurements, `target` holds integer category codes,
and `target_names` maps those codes to readable species names.
The model's class code is not an estimated probability.

---

## A baseline must take the same exam

A simple baseline always predicts the most common category **in the training set**.
It needs no feature measurements. If our model cannot outperform such a rule on
the same held-out cases, its complexity has not yet earned its place.

Here the training categories are balanced, so there is a tie for most common.
Our counting rule chooses the first maximum. That tie rule is a reproducible
convention, not evidence that the selected species is intrinsically more likely.

**Accuracy** is the fraction of examples whose predicted category equals the
true category:

```text
accuracy = number of correct predictions / number of evaluated examples
```

If 20 of 30 are correct, accuracy is 20/30, about 0.667.
The denominator matters: one changed prediction on 30 examples changes the
reported score by 1/30. A decimal score is not certainty about future performance.

---

## The complete fixed experiment

Save as `day02_iris.py`. This complete experiment is fewer than 30 nonblank lines;
the explanation around it is intentionally longer than the code.

```python
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

iris = load_iris()
X, y = iris.data, iris.target
assert X.shape == (150, 4) and y.shape == (150,)
assert np.isfinite(X).all()
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
assert X_train.shape == (120, 4) and X_test.shape == (30, 4)
model = KNeighborsClassifier(n_neighbors=3, weights="uniform", metric="euclidean")
model.fit(X_train, y_train)
pred = model.predict(X_test)
assert pred.shape == y_test.shape
counts = np.bincount(y_train, minlength=3)
majority = int(np.argmax(counts))
baseline = np.full(y_test.shape, majority, dtype=int)
correct = int(np.sum(pred == y_test))
accuracy = correct / len(y_test)
baseline_accuracy = float(np.mean(baseline == y_test))
assert np.isclose(accuracy, model.score(X_test, y_test))
print("correct:", correct, "of", len(y_test))
print("KNN:", accuracy, "baseline:", baseline_accuracy)
print("train accuracy:", model.score(X_train, y_train))
print("first prediction:", iris.target_names[pred[0]])
```

Before running, predict the shapes and baseline accuracy. Predicting the exact
KNN accuracy is not required: it depends on which flower measurements vote.
Write a plausible explanation for why the two scores might differ.

---

## Unpack the split

`train_test_split` takes X and y together and returns training features, test
features, training labels and test labels in that order.

- `test_size=0.2` reserves 20%, or 30 rows. The remaining 120 train the model.
- `random_state=42` fixes the random split for reproducibility in this setup.
  It is not a lucky value or an accuracy improvement.
- `stratify=y` keeps class proportions represented in both sets. With this
  balanced dataset and these sizes, test has ten examples of each species.

The default random shuffling is suitable for this introductory exercise.
It is not automatically suitable for repeated measurements of the same person,
future forecasting, or every collection process. Day 3 investigates those cases.
The [splitter documentation](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)
specifies the interface.

Changing the seed repeatedly until the score looks good selects a favorable exam.
Fix the design before evaluating, and record it.

---

## Unpack assertions and counting

`np.isfinite(X)` makes a boolean table indicating whether each number is finite,
excluding missing numeric values and infinities. `.all()` requires every entry
to pass. This checks one basic data assumption; it is not a complete audit.

`pred == y_test` compares corresponding label codes and produces 30 booleans.
`np.sum` counts true values as ones; dividing by 30 gives accuracy.
`np.mean` of those booleans computes the same fraction directly.

`np.full(y_test.shape, majority, dtype=int)` creates a label array of the requested
shape, filling every position with the training-derived majority code.
Using the shape of the test array is allowed here; learning which answer to
predict from test labels would not be the stated baseline procedure.

`model.score(X_test, y_test)` returns accuracy for this classifier.
Other estimator types can use different score definitions; do not assume
`score` always means accuracy throughout the course.

---

## Interpret the result before celebrating it

The baseline score is 10/30, or one third, because it predicts one species for
every row of a test set with ten of each species.

KNN should be compared with that same baseline on those same 30 rows. Record
your actual count and scores. Do not edit the experiment to match a promised
percentage. Library versions or tie handling can matter in some data configurations.

A high score is evidence about this split of this small dataset under these
measurements. It does not establish reliability on phone photos, an unseen species,
or differently collected measurements. Those inputs violate or extend today's
contract. A perfect test score is possible on a small, separable set; it is not
automatically evidence of leakage or universal excellence.

---

```quiz
{"prompt":"The held-out score looks low. Why should you not keep trying k values and choose the one with the highest score on these same test rows?","options":[{"text":"KNN can never use a different k.","correct":false},{"text":"The test answers would start guiding the model-selection decision.","correct":true},{"text":"Changing a hyperparameter is a syntax error.","correct":false},{"text":"A fixed seed makes test reuse statistically harmless.","correct":false}],"explanation":"The issue is the evaluation boundary. Choosing settings from test outcomes makes those outcomes part of development. A separate validation set can guide choices; a fixed seed reproduces the split but does not restore independence."}
```

---

## Predict one row without losing its table shape

Append to the Iris script:

```python
one_flower = X_test[:1]                # shape: (1, 4)
one_code = model.predict(one_flower)   # shape: (1,)
print(iris.target_names[one_code[0]])
```

A slice `[:1]` keeps a table containing its first row.
By contrast, `X_test[0]` selects the row itself, shape (4,), removing the outer
row dimension. Passing that directly to `predict` is a common shape error.
If you already have such a row, `.reshape(1, -1)` restores one row with an
inferred column count.

A pandas DataFrame can also represent a feature table; it is not obligatory to
convert every input to a NumPy array. Whichever container you choose, keep
training and prediction column names, order, count and units consistent.

---

## Inspect individual outcomes

Append this diagnostic after the fixed evaluation:

```python
wrong = np.flatnonzero(pred != y_test)
print("wrong test positions:", wrong)
for index in wrong:
    print(X_test[index], "true:", iris.target_names[y_test[index]],
          "predicted:", iris.target_names[pred[index]])
```

`pred != y_test` marks mistakes. `flatnonzero` returns their positions in the
one-dimensional array. The loop prints the corresponding measurement row and
both readable labels. These are positions in the held-out table, not global
dataset IDs.

If there are no mistakes on your split, the loop prints none. That does not
prove every future flower will be correct. If there are errors, inspect whether
they involve similar measurements or an input-contract problem.
Do not fix labels merely because they disagree with the model.

---

## Design a units experiment without using the test as a tuning set

Two explanations for a strange prediction are: the query has the wrong units,
or the model has difficulty separating legitimate examples.

Use the tiny five-row fixture as a controlled diagnostic. Keep its training values
fixed and compare query 1.5 with an accidentally multiplied query 150.
The second query will be near the high end of the training measurements, so its
nearest labels differ. This directly tests the effect of a units error.

It does not select a new model using Iris test answers. It is an input-contract
experiment with known constructed data. Correcting a units bug is not permission
to repeatedly optimize test performance.

---

```quiz
{"prompt":"A model has high training accuracy and lower held-out accuracy. What can you conclude immediately?","options":[{"text":"The library is definitely broken.","correct":false},{"text":"The features must have leaked the target.","correct":false},{"text":"The model cannot ever be useful.","correct":false},{"text":"The two evaluations differ; inspect the split, data and model before assigning a cause.","correct":true}],"explanation":"The gap is a diagnostic observation, not a unique explanation. Memorization, limited samples, difficult classes, shift, leakage or implementation problems need different evidence. The next lesson develops that diagnosis."}
```

---

## Common mistakes

| Symptom | Likely cause | First check |
|---|---|---|
| Expected 2D array | one row lost its row dimension | inspect shape; use (1,4) |
| Number of samples disagrees | X and y split or filtered differently | preserve row/label pairing |
| Prediction changes after unit conversion | distance contract changed | compare units and feature order |
| Baseline implausibly strong | it used held-out answers to choose a class | derive its rule from y_train |
| Result cannot be reproduced | environment or split changed | record version, seed and fixed settings |
| Perfect score inspires a broad claim | small benchmark treated as deployment proof | state population and limitations |

---

## Practice

Use the scratch fixture and Iris experiment as two separate artifacts.
Allow 20–35 minutes per task initially and extend if you are repairing a prerequisite.
Do one guided task, then one independent modification; reserve reconstruction
for a later session. Reveal hints before full feedback.

---

## Task 1 — another visible vote

Using the five-row fixture and k=3, predict x=3.1 by hand. List all distances,
selected labels and the majority. Then compare scratch and library predictions.

---

## Task 1 hints

1. Distances correspond to the unchanged rows 1, 2, 4, 7, 9.
2. The three nearest are 4, 2 and 1.
3. Their labels are 1, 0 and 0.

---

## Task 1 feedback

The distances are 2.1, 1.1, 0.9, 3.9 and 5.9; label 0 wins.
With the tiny-model setup from the teaching section still loaded:

```python
query = 3.1
selected = np.argsort(np.abs(train_x - query))[:3]
scratch = int(np.argmax(np.bincount(train_y[selected], minlength=2)))
reference = int(tiny_model.predict(np.array([[query]]))[0])
assert scratch == reference == 0
```

The double brackets create a one-row, one-column table. This task uses the tiny
fixture's variables, not the Iris arrays; mixing the two notebooks would change
the question.

---

## Task 2 — produce an experiment record

Independently reproduce the Iris script. Save the actual correct count, test size,
KNN score, baseline score, training score, fixed k, split seed and library version.
Add two sentences on what this does and does not demonstrate.

---

## Task 2 hints and feedback

Start by rebuilding load → split → fixed model → fit → predict → baseline → compare.
If blocked, reconstruct only the shapes and the split, then continue.
Do not copy a score from this lecture.

To record the installed version after importing sklearn:

```python
import sklearn
print("scikit-learn:", sklearn.__version__)
```

A defensible interpretation says the fixed procedure was evaluated on 30 held-out
Iris rows and compared with a training-derived constant rule. It does not claim
general flower recognition from images or guaranteed accuracy in deployment.
The artifact is the script plus your actual output and interpretation.

---

## Task 3 — repair the row shape

In a copy of the Iris script, deliberately run `model.predict(X_test[0])`.
Read the error; predict the two shapes involved. Then repair the call without
changing the model or adding a new measurement.

---

## Task 3 hints and feedback

Check the array's outer row dimension. Use a slice to preserve it, or reshape a
single extracted row. After the main Iris script:

```python
print(X_test[0].shape, X_test[:1].shape)
repaired = model.predict(X_test[:1])
assert repaired.shape == (1,)
assert repaired[0] == pred[0]
```

The error is a container contract mismatch, not evidence of weak ML ability.
Both repairs represent the same four measurements as one example.

---

## Task 4 — make the units failure visible

In the tiny fixture, predict query 1.5 and query 150 with the same fitted model.
Before running, explain which three training examples should vote for each.
Then correct the second query if it was supplied in units 100 times smaller.

---

## Task 4 hints and feedback

A large number is not automatically a large physical measurement; units matter.
Convert the query into the training units before asking for neighbors.
Using the tiny setup:

```python
original = tiny_model.predict(np.array([[1.5]]))
wrong_units = tiny_model.predict(np.array([[150.0]]))
repaired = tiny_model.predict(np.array([[150.0 / 100.0]]))
assert original[0] == 0
assert wrong_units[0] == 1
assert repaired[0] == original[0]
```

This demonstrates the mechanism of a units bug under controlled conditions.
It does not prove units are the cause of every real prediction error.

---

## Task 5 — delayed reconstruction and a changed condition

Later, rebuild the tiny voting calculation without notes for query 6.3.
Then explain what changes if the contract asks for **one** neighbor instead of three.
Do not use Iris test results to decide which setting is better.

---

## Task 5 hints and feedback

For 6.3, the nearest three measurements are 7, 4 and 9, all label 1.
The one-neighbor version uses only 7, also label 1. Agreement on this query does
not mean k=1 and k=3 always agree. For query 3.1, k=1 predicts 1 while k=3 predicts 0.

The changed setting alters how much local evidence votes. Later, a validation
experiment can compare settings for a specified task.

Keep two recall cues: “Trace distances, indices, labels and votes” and “Draw which
rows fit the model and which rows evaluate it.” Schedule brief delayed reviews
after studying, within the ordinary 15–20-minute daily cap. Log assistance,
independent reconstruction and changed-task success separately.

---

## Cheat sheet

| Operation | Contract |
|---|---|
| X / y | rows × features / one label per row |
| KNN training | store examples for neighbor-based prediction |
| k | preselected number of voting neighbors |
| fit(X_train, y_train) | use paired training information |
| predict(X_test) | produce one label per feature row |
| score for this classifier | fraction of correct labels |
| Baseline | choose most common training label; evaluate on the same test rows |
| One flower | shape (1,4), same feature order and units |
| Fixed test | evaluate the chosen procedure; do not tune against it |

---

## Tomorrow

We already used a proper held-out split today. Tomorrow does not pretend that
we forgot it. It asks when a split can still give misleading evidence, why a
training score can be high, and how to select a model without reusing its final exam.

Bring your actual experiment record, including any surprising result.
A surprise is a question to investigate, not an instruction to hide the score.

---

```finalquiz
{
  "title": "Day 2: A visible first model",
  "questions": [
    {
      "id": "q1",
      "type": "single_correct",
      "prompt": "With neighbor labels 0,1,1 and equal votes, what is predicted?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Feature value 1"
        },
        {
          "id": "b",
          "text": "Category 1"
        },
        {
          "id": "c",
          "text": "The numeric average 2/3 as a new class"
        },
        {
          "id": "d",
          "text": "The farthest neighbor's label"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "Two of three votes belong to category 1. Categories are selected, not averaged into new labels.",
      "example": "Distance selects rows; votes select the category."
    },
    {
      "id": "q2",
      "type": "multiple_correct",
      "prompt": "Which shape statements fit the Iris experiment?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "X has shape (150,4)."
        },
        {
          "id": "b",
          "text": "y has shape (150,4)."
        },
        {
          "id": "c",
          "text": "One new flower should have shape (1,4)."
        },
        {
          "id": "d",
          "text": "Predicting 30 rows returns 30 labels."
        }
      ],
      "correctOptionIds": [
        "a",
        "c",
        "d"
      ],
      "explanation": "The table has four features per row; y has one label per row. Single-row inputs still preserve the row dimension.",
      "example": "Training and test feature counts must match."
    },
    {
      "id": "q3",
      "type": "single_correct",
      "prompt": "What does random_state=42 do in the split?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Guarantees a representative future population"
        },
        {
          "id": "b",
          "text": "Optimizes k"
        },
        {
          "id": "c",
          "text": "Ensures perfect accuracy"
        },
        {
          "id": "d",
          "text": "Makes the chosen random split reproducible in this setup"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "The seed controls the split's pseudorandom choices. It does not establish representativeness, tune the model or guarantee a score.",
      "example": "Do not search seeds for a favorable exam."
    },
    {
      "id": "q4",
      "type": "single_correct",
      "prompt": "Where should the constant baseline's predicted category come from?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "The most common training label"
        },
        {
          "id": "b",
          "text": "The most common test label"
        },
        {
          "id": "c",
          "text": "Whichever class makes the reported test score highest"
        },
        {
          "id": "d",
          "text": "A mean of numeric species codes"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "The baseline's rule is chosen using training data, then evaluated on the same test rows as the model. Test-derived choices contaminate that comparison.",
      "example": "Balanced training classes require an explicit tie convention."
    },
    {
      "id": "q5",
      "type": "multiple_correct",
      "prompt": "Which facts about this KNN fit are correct?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "It necessarily uses gradient descent."
        },
        {
          "id": "b",
          "text": "It uses the training examples for neighbor queries."
        },
        {
          "id": "c",
          "text": "k=3 was chosen before fitting."
        },
        {
          "id": "d",
          "text": "Calling fit guarantees accuracy on new species."
        }
      ],
      "correctOptionIds": [
        "b",
        "c"
      ],
      "explanation": "This estimator stores training information for neighbor-based prediction. The neighbor count is a supplied setting, and no generalization guarantee follows from fit.",
      "example": "A common method name does not imply a common optimizer."
    },
    {
      "id": "q6",
      "type": "single_correct",
      "prompt": "Why can changing centimetres to millimetres for only one feature change neighbors?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Units never affect numeric distances."
        },
        {
          "id": "b",
          "text": "The label code automatically compensates."
        },
        {
          "id": "c",
          "text": "That coordinate contributes differently to the computed distance."
        },
        {
          "id": "d",
          "text": "The model always retrains on every query."
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "Changing one coordinate's scale changes its contribution to distance unless the representation is adjusted consistently. Labels do not correct units.",
      "example": "A factor 10 in a difference becomes factor 100 when squared."
    },
    {
      "id": "q7",
      "type": "multiple_correct",
      "prompt": "Which test-set practices preserve today's intended boundary?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Fix k before looking at the test result."
        },
        {
          "id": "b",
          "text": "Try many k values and report the best test score as untouched."
        },
        {
          "id": "c",
          "text": "Evaluate model and baseline on the same held-out rows."
        },
        {
          "id": "d",
          "text": "Choose a seed after seeing which score looks best."
        }
      ],
      "correctOptionIds": [
        "a",
        "c"
      ],
      "explanation": "Fixed design and a common held-out comparison support interpretation. Selecting settings or seeds from test outcomes uses the test in development.",
      "example": "Use validation for model-selection decisions."
    },
    {
      "id": "q8",
      "type": "single_correct",
      "prompt": "For this classifier, how is accuracy calculated?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Mean of predicted species codes"
        },
        {
          "id": "b",
          "text": "Correct labels divided by evaluated examples"
        },
        {
          "id": "c",
          "text": "Number of feature columns divided by rows"
        },
        {
          "id": "d",
          "text": "Largest predicted category"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "Accuracy compares each prediction with its true label, counts correct pairs and divides by the number evaluated.",
      "example": "20 correct of 30 is about 0.667."
    },
    {
      "id": "q9",
      "type": "multiple_correct",
      "prompt": "Which claims are supported by scratch/library agreement on the tiny fixture?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Both used matched k, voting and distance settings."
        },
        {
          "id": "b",
          "text": "The comparison checked discrete predictions exactly."
        },
        {
          "id": "c",
          "text": "Every possible tie is proven identical."
        },
        {
          "id": "d",
          "text": "The model is ready for all real flower photos."
        }
      ],
      "correctOptionIds": [
        "a",
        "b"
      ],
      "explanation": "The fixture checks a matched, unambiguous case. It does not exhaust tie behavior or establish a different input modality's reliability.",
      "example": "A numeric measurement classifier is not yet an image classifier."
    },
    {
      "id": "q10",
      "type": "single_correct",
      "prompt": "A small held-out set receives perfect predictions. What is the appropriate interpretation?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Leakage is proven."
        },
        {
          "id": "b",
          "text": "Universal accuracy is proven."
        },
        {
          "id": "c",
          "text": "Testing is no longer needed."
        },
        {
          "id": "d",
          "text": "Record the result and limitations; perfection alone proves neither leakage nor universal reliability."
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "A small separable test set can be perfectly classified. Audit the procedure and state its population and sample limits rather than asserting a unique cause.",
      "example": "Thirty correct predictions are still thirty observations."
    }
  ]
}
```
