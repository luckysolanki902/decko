# Day 3: Conditions Become Data Rules

**Duration: 4 hours | Focus: translate policy into ordered, testable Python decisions**

---

## Why this day exists

Yesterday you calculated that Riverside C01 was 95% occupied.

Now the coordinator needs a label that staff can act on: monitor, review, or urgent.

The arithmetic is no longer the hard part. The risk sits in the rule.

A boundary placed one character too far, or a broad rule checked too early, can give a plausible but wrong instruction.

---

## The rule that looks readable

Suppose the policy says:

```text
urgent  : occupancy is at least 95%, or spare places are at most 2
review  : occupancy is at least 85%
monitor : everything else
```

A learner writes:

```python
occupancy_percent = 95.0
spare_places = 2

if occupancy_percent >= 85:
    status = "review"
elif occupancy_percent >= 95 or spare_places <= 2:
    status = "urgent"
else:
    status = "monitor"

print(status)
```

Expected but wrong output:

```text
review
```

Both the broad review condition and the urgent condition are true. Python chooses the first true branch and stops.

Before seeing the fix, write the order in which you would ask the policy questions.

---

## The mental model: a gate asks one question

Each condition is a gate. A row reaches the gate with concrete values. The gate evaluates one yes-or-no question and produces a Boolean.

```text
row values                   question                    answer
95.0% occupancy, 2 spare → occupancy at least 95?  → True
82.5% occupancy, 7 spare → occupancy at least 95?  → False
```

An `if` chain places gates in order. The first gate producing `True` chooses the path and closes the rest of the chain.

```text
row → urgent gate? ─True─→ urgent, stop
          │False
          ▼
       review gate? ─True─→ review, stop
          │False
          ▼
        monitor
```

Python does not know which label is more important. The written order carries that policy meaning. This is why correct individual comparisons can still create a wrong overall result.

---

## A condition is a yes-or-no test

Yesterday's values feed today's tests.

```text
value → comparison → Boolean → branch
 95       >= 95       True      urgent
```

A Boolean is one of two values: `True` or `False`.

```python
occupancy_percent = 95.0
spare_places = 2

print(occupancy_percent >= 95)
print(spare_places <= 2)
print(occupancy_percent == 100)
print(occupancy_percent != 100)
```

Expected output:

```text
True
True
False
True
```

`>=` means greater than or equal, `<=` means less than or equal, `==` compares values, and `!=` asks whether values differ. A single `=` assigns; it does not compare.

Read comparisons as complete sentences:

```text
occupancy_percent >= 95  "occupancy percent is at least 95"
spare_places <= 2        "spare places is at most 2"
status == "urgent"       "status has the same value as the text urgent"
status != "monitor"      "status differs from the text monitor"
```

The left and right sides are evaluated before comparison. The result is not the original number or label. It is the Boolean value `True` or `False`.

### Assignment and comparison fail differently

This line binds a name:

```python
threshold = 95
```

This expression compares two values:

```python
print(occupancy_percent == threshold)
```

Expected output for `occupancy_percent = 95.0`:

```text
True
```

Writing `if occupancy_percent = 95:` is a syntax error. Python refuses because assignment is not the yes-or-no expression the `if` header requires. Read the error before changing the operator so you understand which role was missing.

```quiz
{
  "prompt": "The policy includes exactly 95% in urgent. Which comparison expresses that boundary?",
  "multiple": false,
  "options": [
    {"text":"`occupancy_percent > 95`","correct":false},
    {"text":"`occupancy_percent >= 95`","correct":true},
    {"text":"`occupancy_percent = 95`","correct":false},
    {"text":"`occupancy_percent != 95`","correct":false}
  ],
  "explanation": "`>=` includes the boundary itself. `>` would exclude exactly 95, while `=` is assignment syntax."
}
```

---

## Predict the boundaries

Without running code, fill the Boolean results:

```python
print(94.9 >= 95)
print(95.0 >= 95)
print(95.1 >= 95)
```

This three-value check is a boundary test: just below, exactly at, and just above the threshold.

---

## Feedback: the character changes the policy

Expected output:

```text
False
True
True
```

Changing `>=` to `>` makes exactly `95.0` false. Neither operator is universally better. The written policy decides which is correct.

The named mistake is an **off-by-boundary error**. It hides in ordinary values and appears at the threshold, so every important cutoff deserves tests on both sides and at equality.

One comfortable example cannot distinguish `>` from `>=`. Both classify `95.1` as true. The exact boundary is the **discriminating case**, the input where two competing implementations behave differently.

```text
test value  > 95   >= 95
94.9        False  False
95.0        False  True   ← reveals the policy difference
95.1        True   True
```

When two rules seem equivalent, search for the smallest input that makes them disagree.

---

## Membership checks categories

The coordinator treats only centres in priority neighbourhoods as eligible for extended-hour review.

```python
neighbourhood = "Riverside"
priority_neighbourhoods = ["Riverside", "Hillview"]

print(neighbourhood in priority_neighbourhoods)
print("Market" in priority_neighbourhoods)
```

Expected output:

```text
True
False
```

`in` asks whether a value equals one of the values inside the collection. The square brackets create a list. Today the list is simply a small group of allowed labels; Day 4 will teach lists in depth.

Membership is exact. `"riverside"` is not equal to `"Riverside"`. Silently correcting case today would introduce string-cleaning rules that the course has not yet established. First expose the mismatch, then ask the data owner which labels are valid.

Trace the operation without needing list mechanics:

```text
target: "Riverside"
compare with "Riverside" → equal → membership True → stop searching

target: "Market"
compare with "Riverside" → not equal
compare with "Hillview"  → not equal
no match                 → membership False
```

The collection is a bounded set of permitted labels for this example. Day 4 teaches how lists are indexed, changed, copied, and iterated. None of those future operations is needed to understand today's membership question.

---

## Combine tests with `and`

Suppose review requires both a priority neighbourhood and occupancy of at least 85%.

```python
is_priority = neighbourhood in priority_neighbourhoods
is_busy = occupancy_percent >= 85

print(is_priority)
print(is_busy)
print(is_priority and is_busy)
```

Expected output:

```text
True
True
True
```

`and` is true only when both sides are true. If Riverside were 70% occupied, membership would remain true but the combined result would become false.

The analytical trap is reading `and` as a loose English connector. It represents a strict truth requirement: every joined condition must pass.

### Predict the entire `and` truth table

There are only four possible pairs. Fill the result column before revealing it.

```text
left   right   left and right
True   True    ?
True   False   ?
False  True    ?
False  False   ?
```

---

## Feedback: `and` rejects on the first failure

```text
left   right   left and right
True   True    True
True   False   False
False  True    False
False  False   False
```

Only one row passes. A rule joined by `and` becomes stricter as requirements are added because every requirement must hold.

For the running policy:

```text
priority?  busy?  eligible for priority review?
True       True   True
True       False  False
False      True   False
False      False  False
```

This table is a compact specification. A later code result that disagrees with it exposes either an implementation bug or an unclear policy.

---

## Combine alternatives with `or`

Urgent status can arise through either high occupancy or very few spare places.

```python
high_occupancy = occupancy_percent >= 95
few_spare_places = spare_places <= 2

print(high_occupancy or few_spare_places)
```

Expected output:

```text
True
```

`or` is true when at least one side is true. It is also true when both sides are true.

That last case is a common misconception. In ordinary speech, "tea or coffee" may imply one choice. Python's Boolean `or` accepts either or both.

### Predict the entire `or` truth table

```text
left   right   left or right
True   True    ?
True   False   ?
False  True    ?
False  False   ?
```

---

## Feedback: `or` fails only when every alternative fails

```text
left   right   left or right
True   True    True
True   False   True
False  True    True
False  False   False
```

Three rows pass. A rule joined by `or` becomes broader as alternatives are added.

This gives a useful language check:

```text
"both conditions are required"     → and
"either condition is sufficient"   → or
```

If the policy writer means exactly one trigger, ordinary `or` is not that rule. Ask for clarification rather than pretending ordinary speech is precise enough.

```quiz
{
  "prompt": "A centre is high occupancy and also has two spare places. What does `high_occupancy or few_spare_places` produce?",
  "multiple": false,
  "options": [
    {"text":"`False`, because exactly one side must be true","correct":false},
    {"text":"An error, because both sides are true","correct":false},
    {"text":"`True`, because at least one side is true","correct":true},
    {"text":"The text `urgent` automatically","correct":false}
  ],
  "explanation": "Boolean `or` is true when one or both operands are true. The label still requires an `if` branch."
}
```

---

## Reverse a test with `not`

```python
visitor_count_missing = False
print(not visitor_count_missing)
```

Expected output:

```text
True
```

`not` reverses one Boolean value. It does not repair missing data. It only lets a rule say "the count is not missing" once the missingness check already exists.

Prefer positive names such as `has_visitor_count` when they make the rule easier to read. `not visitor_count_missing` is valid, but double negatives become error-prone.

`not` has a two-row truth table:

```text
value   not value
True    False
False   True
```

Compare these two names:

```python
visitor_count_missing = False
has_visitor_count = True

print(not visitor_count_missing)
print(has_visitor_count)
```

Expected output:

```text
True
True
```

They produce the same result, but `has_visitor_count and is_priority` is easier to audit than `not visitor_count_missing and is_priority`. Positive names reduce the number of mental reversals.

---

## Precedence can rewrite the policy

Consider this eligibility rule:

```python
eligible = has_visitor_count and is_priority or high_occupancy
```

Python evaluates `and` before `or`, so it reads the expression as:

```python
eligible = (has_visitor_count and is_priority) or high_occupancy
```

That means a high-occupancy row with a missing visitor count could still become eligible if `high_occupancy` came from an unreliable value.

If the policy requires a present count plus either priority location or high occupancy, write:

```python
eligible = has_visitor_count and (is_priority or high_occupancy)
```

Parentheses make the business grouping visible. Relying on memorised precedence saves two characters and costs review time.

### Trace a case where grouping changes the answer

Use these values:

```python
has_visitor_count = False
is_priority = False
high_occupancy = True
```

The unparenthesised expression is evaluated as `(False and False) or True`:

```text
False and False → False
False or True   → True    ← missing count still passes
```

The intended expression is `False and (False or True)`:

```text
False or True   → True
False and True  → False   ← required count blocks eligibility
```

Both expressions contain identical names and operators. Parentheses encode a different policy. This is why a reviewer needs a truth trace, not reassurance that the line "looks right."

### Short-circuiting avoids unnecessary checks

Python evaluates Boolean expressions from left to right and may stop once the final answer is already known. `False and anything` must be false, so the right side is not needed. `True or anything` must be true, so the right side is not needed.

For this course boundary, the practical lesson is simple: put a required availability check before a dependent check.

```python
has_neighbourhood = neighbourhood != ""
eligible = has_neighbourhood and neighbourhood in priority_neighbourhoods
```

The first test expresses the prerequisite. The membership test matters only when a category is present. Do not use short-circuiting to hide invalid data; use it to order an explicit rule safely.

```quiz
{
  "prompt": "Which expression requires a present visitor count and then accepts either priority location or high occupancy?",
  "multiple": false,
  "options": [
    {"text":"`has_count and (is_priority or high_occupancy)`","correct":true},
    {"text":"`(has_count and is_priority) or high_occupancy`","correct":false},
    {"text":"`not has_count or is_priority`","correct":false},
    {"text":"`has_count and is_priority and high_occupancy`","correct":false}
  ],
  "explanation": "The parentheses make presence mandatory while allowing either of the two operational triggers."
}
```

---

## `if` chooses a path

```python
occupancy_percent = 82.5

if occupancy_percent >= 85:
    status = "review"
else:
    status = "monitor"

print(status)
```

Expected output:

```text
monitor
```

The colon ends the condition header. The indented line belongs to that branch. `else` runs when the `if` condition is false.

Indentation is part of Python's structure. A line aligned outside both branches runs afterward, regardless of which branch was selected.

Read every symbol in the first line:

```python
if occupancy_percent >= 85:
```

`if` announces a conditional path. `occupancy_percent >= 85` is the Boolean expression. The colon says an indented block follows. The four leading spaces on the next line are not decoration; they tell Python which instructions belong to the branch.

```python
if occupancy_percent >= 85:
    status = "review"

print("classification finished")
```

Expected output when occupancy is `82.5`:

```text
classification finished
```

The assignment is skipped because the condition is false. The unindented `print` still runs because it belongs to the surrounding flow, not the branch.

### A branch needs a value on every path

This tempting version fails for low occupancy:

```python
if occupancy_percent >= 85:
    status = "review"

print(status)
```

Expected error for `occupancy_percent = 82.5`:

```text
NameError: name 'status' is not defined
```

No branch created `status`. An `else` is not busywork here; it completes the promise that the classification produces one label for every valid input.

---

## `elif` makes an ordered rulebook

The opening bug occurred because the broader rule came first. Put the most specific, highest-priority case first.

```python
occupancy_percent = 95.0
spare_places = 2

if occupancy_percent >= 95 or spare_places <= 2:
    status = "urgent"
elif occupancy_percent >= 85:
    status = "review"
else:
    status = "monitor"

print(status)
```

Expected output:

```text
urgent
```

Python checks top to bottom and runs the first true branch. It does not search for the "best" label afterward.

```text
95%:
urgent test → True  → choose urgent → stop

90%:
urgent test → False
review test → True  → choose review → stop
```

> In an `if`/`elif` chain, order overlapping rules from highest priority or narrowest case to broader fallback cases.

### Trace the broken and repaired chains side by side

For `occupancy_percent = 95.0` and `spare_places = 2`:

```text
BROKEN ORDER
review condition: 95 >= 85                 → True
choose review and stop
urgent condition is never evaluated        → WRONG label

REPAIRED ORDER
urgent condition: 95 >= 95 or 2 <= 2       → True
choose urgent and stop                      → intended label
```

The repaired order is not "largest number first" as a universal Python rule. It follows this policy's priority. If a future policy says a safety hold overrides urgent service, that narrower hold condition must come first.

### The naive patch that does not scale

You could patch exactly `95.0` before the broad branch:

```python
if occupancy_percent == 95:
    status = "urgent"
elif occupancy_percent >= 85:
    status = "review"
```

It fixes one test and fails at `96.0`, which should also be urgent. Patching examples is not the same as implementing the rule. Use the actual inclusive range condition and test around its boundary.

---

## Separate `if` statements answer a different question

Predict the output:

```python
status = "monitor"

if occupancy_percent >= 85:
    status = "review"

if occupancy_percent >= 95:
    status = "urgent"

print(status)
```

---

## Feedback: one choice versus several checks

Expected output:

```text
urgent
```

Both independent `if` statements are evaluated. The second assignment overwrites the first. It happens to end correctly here, but reversing the two blocks would end at `review`.

Use a single `if`/`elif`/`else` chain when exactly one status must be chosen. Use separate `if` statements when several independent flags may all be recorded.

```python
flags = ""

if occupancy_percent >= 95:
    flags = flags + "high occupancy; "

if spare_places <= 2:
    flags = flags + "few spare places; "

print(flags)
```

Expected output:

```text
high occupancy; few spare places;
```

The label is exclusive; the diagnostic flags are cumulative. Choosing the structure depends on the question.

```quiz
{
  "prompt": "When are separate `if` statements preferable to one `if`/`elif` chain?",
  "multiple": false,
  "options": [
    {"text":"When exactly one status must win","correct":false},
    {"text":"When every condition is false","correct":false},
    {"text":"When indentation is inconvenient","correct":false},
    {"text":"When several independent flags may all apply","correct":true}
  ],
  "explanation": "Independent `if` statements can all run. An `if`/`elif` chain chooses the first true branch only."
}
```

---

## Missing categories need their own path

Suppose category text can be absent. Using an empty string as if it were a real neighbourhood can silently send the row to `monitor`.

```python
neighbourhood = ""

if neighbourhood == "":
    status = "needs data review"
elif neighbourhood in priority_neighbourhoods:
    status = "priority area"
else:
    status = "standard area"

print(status)
```

Expected output:

```text
needs data review
```

The missing-data branch comes first because no operational category should be assigned until the required input exists.

An empty string is only one possible missing marker. The source contract must say whether blanks, `None`, or labels such as `"Unknown"` occur. Do not invent a universal missingness rule from this one example.

### Missing is not an ordinary fallback category

Without the first branch, an empty neighbourhood is not in the priority list and falls into `standard area`. That output is syntactically valid and operationally false: the program has converted "we do not know" into "we know it is standard."

Trace it:

```text
neighbourhood = ""
"" in priority_neighbourhoods → False
else branch                    → "standard area"   ← misleading
```

Required-data checks belong before real categories because classification assumes those inputs exist. The output `needs data review` is not a weaker neighbourhood label. It is a different workflow instruction.

---

## Build a boundary table before trusting the rule

Trace representative cases by hand:

```text
occupancy  spare  expected
84.9       6      monitor
85.0       6      review
94.9       3      review
95.0       3      urgent
80.0       2      urgent
```

Then run each case through the same rule by changing only the two inputs. If actual and expected differ, inspect in this order:

1. Is the boundary operator correct?
2. Are parentheses preserving the intended grouping?
3. Is a broader branch placed before a narrower one?
4. Is required data missing or mislabeled?
5. Are the units the ones the policy expects?

This diagnostic order is cheaper than randomly editing comparisons.

### Add cases that separate competing explanations

The five rows above test the occupancy and spare-place cutoffs. They do not test missing category handling or priority eligibility. Add cases for those mechanisms:

```text
neighbourhood  occupancy  spare  present?  expected
Riverside      95.0       3      yes       urgent
Market         95.0       3      yes       review under priority-only urgent policy
""             95.0       1      no        needs data review
Hillview       84.9       2      yes       urgent through spare-place trigger
```

Each row has a purpose. The Market row distinguishes a global urgent rule from a priority-only one. The blank row proves missingness overrides operational categories. The Hillview row proves the alternative trigger works when high occupancy is false.

Do not add twenty comfortable examples that exercise the same path. Add the smallest cases that make plausible implementations disagree.

---

## Debug a wrong label in a fixed order

Suppose C01 prints `review` when you expect `urgent`.

1. Print raw input values and types.
2. Print each named Boolean separately.
3. Print the combined urgent Boolean.
4. Compare just below, at, and above each threshold.
5. Inspect parentheses.
6. Inspect branch order.
7. Confirm required fields are present and labels match exactly.

Instrumentation for the running case:

```python
print(occupancy_percent, type(occupancy_percent))
print(spare_places, type(spare_places))
print(occupancy_percent >= 95)
print(spare_places <= 2)
print((occupancy_percent >= 95) or (spare_places <= 2))
```

Expected output:

```text
95.0 <class 'float'>
2 <class 'int'>
True
True
True
```

If these values are correct but the label is wrong, the failure lies in control flow, usually branch order. If one Boolean is wrong, diagnose its inputs, boundary, or grouping first.

```quiz
{
  "prompt": "A value of exactly `85.0` becomes `monitor`, but policy says review starts at 85%. What should you inspect first?",
  "multiple": false,
  "options": [
    {"text":"Whether `>` was used instead of `>=`","correct":true},
    {"text":"Whether the variable name is short","correct":false},
    {"text":"Whether output has two decimal places","correct":false},
    {"text":"Whether the notebook title is saved","correct":false}
  ],
  "explanation": "A failure exactly at the threshold points first to an inclusive-versus-exclusive boundary error."
}
```

---

## Practice

1. **Recall:** write complete truth tables for `and`, `or`, and `not` without notes. Verify only after committing answers.
2. **Boundary mechanics:** classify `84.9`, `85.0`, `94.9`, `95.0`, and `95.1`. Explain why exactly `85.0` and `95.0` are discriminating cases.
3. **Guided rule:** add the alternative urgent trigger of at most two spare places. Name each Boolean first, then explain the combined expression in words.
4. **Trace:** for one row, write every comparison result and each branch Python visits. Do this once for `urgent` and once for `monitor`.
5. **Debugging:** put review before urgent, capture the wrong result, and repair it. Then replace `>= 95` with `> 95` and use the boundary table to locate the different bug.
6. **Independent reconstruction:** from a blank cell, implement exactly one status plus cumulative diagnostic text without looking at the example. Prove that both flags can appear while only one status does.
7. **Changed-task transfer:** only priority neighbourhoods may be urgent; other busy centres become review. Write a truth plan and discriminating cases before code. Do not title the task with the operator to use.
8. **Policy challenge:** write one ambiguous sentence that could mean `and` or `or`. List the two different outcomes and the exact question you would ask the coordinator.

For later retrieval, keep "Why does rule order matter?" and "One chain versus independent `if`s?" Also retrieve Day 2's percentage-point distinction during a short review.

---

## Studio: Cooling-Centre Triage Card

Build a small notebook cell with named inputs for neighbourhood, occupancy percentage, spare places, and whether the category is present. Produce exactly one operational status plus any independent diagnostic flags. Include a boundary table with at least five cases, one missing-category case, and one changed-policy case. State which result would make you revisit the rule wording with the coordinator.

Use this evidence checklist:

```text
[ ] each policy phrase has a named Boolean
[ ] inclusive boundaries are tested below, at, and above
[ ] mixed and/or logic has explicit parentheses
[ ] missing required data wins before operational labels
[ ] one if/elif/else chain produces exactly one status
[ ] independent if statements may record more than one flag
[ ] expected results are written before code runs
[ ] one changed policy is implemented without copying the original branch order blindly
```

Finally, hand the card to a reviewer with only the policy text and boundary table visible. If the reviewer cannot predict every label without reading the code, the policy or test cases are still under-specified.

---

## Common mistakes

- Using `=` where a comparison needs `==`.
- Excluding an inclusive boundary with `>`.
- Putting a broad branch before a higher-priority overlapping branch.
- Relying on `and`/`or` precedence when parentheses better express policy.
- Expecting `or` to mean exactly one condition.
- Using independent `if`s for one exclusive label, then overwriting it.
- Allowing missing category text to fall into a real operational category.

---

## Cheat sheet

```python
is_priority = neighbourhood in ["Riverside", "Hillview"]
high_occupancy = occupancy_percent >= 95
few_spare_places = spare_places <= 2

if neighbourhood == "":
    status = "needs data review"
elif is_priority and (high_occupancy or few_spare_places):
    status = "urgent"
elif occupancy_percent >= 85:
    status = "review"
else:
    status = "monitor"
```

---

## Summary

You produced Booleans with comparisons and membership, combined them with `and`, `or`, and `not`, made grouping explicit, ordered overlapping branches, separated exclusive labels from cumulative flags, and tested missing values plus threshold boundaries.

Tomorrow, lists become the main subject so you can apply the same reasoning across several observations instead of rewriting one case at a time.

---

```finalquiz
{
  "title":"Day 3: Conditions Become Data Rules",
  "questions":[
    {"id":"q1","type":"single_correct","prompt":"Which value type results from `95 >= 85`?","codeSnippet":null,"options":[{"id":"a","text":"String"},{"id":"b","text":"Boolean"},{"id":"c","text":"Float"},{"id":"d","text":"List"}],"correctOptionIds":["b"],"explanation":"A comparison produces `True` or `False`, both Boolean values.","example":"`95 >= 85` is `True`."},
    {"id":"q2","type":"multiple_correct","prompt":"Which tests are true when occupancy is exactly 95?","codeSnippet":null,"options":[{"id":"a","text":"`occupancy >= 95`"},{"id":"b","text":"`occupancy > 95`"},{"id":"c","text":"`occupancy == 95`"},{"id":"d","text":"`occupancy != 95`"}],"correctOptionIds":["a","c"],"explanation":"Inclusive comparison and equality include the exact boundary.","example":"Test just below, at, and above a cutoff."},
    {"id":"q3","type":"single_correct","prompt":"Why did the broad review branch misclassify 95%?","codeSnippet":null,"options":[{"id":"a","text":"`else` always wins"},{"id":"b","text":"Python checks `elif` first"},{"id":"c","text":"Percentages cannot be compared"},{"id":"d","text":"Python chose the first true branch"}],"correctOptionIds":["d"],"explanation":"An `if`/`elif` chain stops after the first true condition.","example":"Put urgent before overlapping review."},
    {"id":"q4","type":"single_correct","prompt":"What does Boolean `or` require?","codeSnippet":null,"options":[{"id":"a","text":"Exactly one true side"},{"id":"b","text":"Both sides true"},{"id":"c","text":"Both sides false"},{"id":"d","text":"At least one true side"}],"correctOptionIds":["d"],"explanation":"`or` is true when one or both operands are true.","example":"Both urgent triggers may hold."},
    {"id":"q5","type":"multiple_correct","prompt":"Which are useful boundary cases for a 95% cutoff?","codeSnippet":null,"options":[{"id":"a","text":"94.9"},{"id":"b","text":"95.0"},{"id":"c","text":"95.1"},{"id":"d","text":"A random notebook title"}],"correctOptionIds":["a","b","c"],"explanation":"Values just below, exactly at, and just above reveal threshold errors.","example":"A normal value alone can miss the bug."},
    {"id":"q6","type":"single_correct","prompt":"When should one `if`/`elif` chain be preferred?","codeSnippet":null,"options":[{"id":"a","text":"When every flag should accumulate"},{"id":"b","text":"When no conditions exist"},{"id":"c","text":"When exactly one status should be selected"},{"id":"d","text":"When values are strings"}],"correctOptionIds":["c"],"explanation":"A chain represents mutually exclusive outcomes by choosing the first true branch.","example":"One centre gets one operational status."},
    {"id":"q7","type":"single_correct","prompt":"What does `in` check in the neighbourhood rule?","codeSnippet":null,"options":[{"id":"a","text":"Whether the list is sorted"},{"id":"b","text":"Whether occupancy is numeric"},{"id":"c","text":"Whether every label is missing"},{"id":"d","text":"Whether the label equals a member of the collection"}],"correctOptionIds":["d"],"explanation":"Membership compares the target value with collection members.","example":"Riverside appears in the priority labels."},
    {"id":"q8","type":"multiple_correct","prompt":"Which problems can change a policy result?","codeSnippet":null,"options":[{"id":"a","text":"A descriptive variable name"},{"id":"b","text":"Wrong branch order"},{"id":"c","text":"A missing required category"},{"id":"d","text":"Parentheses matching the written rule"}],"correctOptionIds":["b","c"],"explanation":"Order and missing inputs can misclassify; clear names and correct grouping help prevent errors.","example":"Missing category should enter review, not monitor."},
    {"id":"q9","type":"single_correct","prompt":"Why add parentheses around mixed `and` and `or` logic?","codeSnippet":null,"options":[{"id":"a","text":"To make intended policy grouping explicit"},{"id":"b","text":"To convert strings to numbers"},{"id":"c","text":"To create another branch"},{"id":"d","text":"To round percentages"}],"correctOptionIds":["a"],"explanation":"Parentheses expose which requirements travel together and reduce precedence mistakes.","example":"Require data presence before either trigger."},
    {"id":"q10","type":"multiple_correct","prompt":"Which evidence strengthens a rule implementation?","codeSnippet":null,"options":[{"id":"a","text":"Only one comfortable example"},{"id":"b","text":"A just-below threshold case"},{"id":"c","text":"A hidden default for missing text"},{"id":"d","text":"A changed-policy case"}],"correctOptionIds":["b","d"],"explanation":"Boundary and transfer cases test mechanism and interpretation rather than familiarity.","example":"Change priority eligibility and predict before running."}
  ]
}
```
