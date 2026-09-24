# Day 2: Values Behind the Decision

**Duration: 4 hours | Focus: calculate rates without losing meaning, units, or trust**

---

## Why this day exists

Yesterday, a table helped you identify a crowded cooling centre.

Today the coordinator asks a smaller question: how much spare capacity remains, and how should that number appear in a brief?

A calculator can produce digits. An analyst must preserve what those digits represent.

One wrong type, unit, or rounding choice can turn correct arithmetic into a misleading answer.

---

## The arithmetic that looks finished

For Riverside centre C01, capacity is 40 and visitors are 38.

```python
print(38 / 40 * 100)
```

Expected output:

```text
95.0
```

The number is correct, but the line does not say whether `40` is seats, visitors, or hours. Copy it three times and a reviewer cannot tell which number changed.

Now imagine the visitor count arrives as the text `"38"`. Predict what `"38" / 40` does before running it.

---

## The mental model: Python evaluates, then binds

An assignment line is a two-step event, not a spreadsheet formula that stays alive.

```text
spare_places = capacity_places - visitor_count
               └──────── evaluate ────────┘
       bind the finished value to the name ───────┘
```

Python first finds the current values on the right, performs the operation, and produces one result. Only then does it bind that result to the name on the left.

For `capacity_places = 40` and `visitor_count = 38`:

```text
look up capacity_places   → 40
look up visitor_count     → 38
subtract                  → 2
bind spare_places         → 2
```

This picture will explain two later surprises: changing `visitor_count` does not update an older `spare_places`, and invalid text fails before a result can be bound.

---

## Names carry the analysis

```text
raw fact → named value → operation → named result → labelled message
```

A **value** is a piece of data such as `38`, `40.0`, or `"Riverside"`. A **variable** is a name bound to a value.

```python
centre_name = "Riverside C01"
capacity_places = 40
visitor_count = 38

spare_places = capacity_places - visitor_count
print(spare_places)
```

Expected output:

```text
2
```

`=` assigns the value on the right to the name on the left. It does not assert mathematical equality forever. If you later assign `visitor_count = 39`, the name refers to the new value.

`snake_case` uses lowercase words joined by underscores. Names such as `capacity_places` expose the unit and beat vague names such as `x`.

### A name is not the value itself

Think of a name as a label Python can use to find a value. Two names can refer to equal values without becoming the same word.

```python
capacity_places = 40
emergency_limit_places = 40

print(capacity_places)
print(emergency_limit_places)
```

Expected output:

```text
40
40
```

The equal output does not erase the different meanings. One value describes recorded capacity; the other describes a policy limit. Good names preserve that distinction for the reviewer.

### Names should expose meaning and unit

Compare these calculations:

```python
x = 38 / 40
occupancy_rate = visitor_count / capacity_places
```

Both may produce `0.95`. Only the second lets a reader audit numerator, denominator, and intended meaning without searching backward. Long names are not automatically good, but ambiguous ones create analytical debt.

```quiz
{
  "prompt": "Which name best protects the unit of the value `40`?",
  "multiple": false,
  "options": [
    {"text":"x","correct":false},
    {"text":"number","correct":false},
    {"text":"capacity_places","correct":true},
    {"text":"data","correct":false}
  ],
  "explanation": "`capacity_places` states both the business meaning and the unit, which makes later arithmetic reviewable."
}
```

---

## Literals and types

A literal writes a value directly in code. Python assigns each value a type because the same symbol can mean different work for different kinds of values.

```python
print(type(38))
print(type(0.95))
print(type("38"))
print(type(True))
```

Expected output:

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```

`int` represents whole numbers, `float` represents numbers with a decimal representation, `str` represents text, and `bool` represents `True` or `False`.

The types describe representation and permitted operations. A visitor count of `38` and a centre ID of `"38"` may look similar when printed, but one belongs in arithmetic and the other is a label.

### The same printed characters can have different behaviour

Predict all four outputs:

```python
print(38 + 2)
print("38" + "2")
print(38 == 38)
print("38" == 38)
```

Do not run yet. Ask what job `+` can perform for each type. Numbers can be added. Strings can be joined. Equality compares both value and type meaning.

---

## Feedback: type changes the operation

Expected output:

```text
40
382
True
False
```

`"38" + "2"` joins text; it does not perform arithmetic. Python does not inspect quoted characters and silently decide that they should become numbers. This refusal protects identifiers such as centre code `"001"`, whose leading zeros would be lost by numeric conversion.

> Convert because the field definition says the value is numeric, not merely because the characters look numeric.

The Boolean results also matter. `True` and `False` are values, not printed opinions. Day 3 will use them to choose paths through a policy rule.

---

## The predicted failure

```python
visitor_count_text = "38"
print(visitor_count_text / 40)
```

Expected error:

```text
TypeError: unsupported operand type(s) for /: 'str' and 'int'
```

Python refuses to guess whether the text is a number, an identifier, or a typo. That refusal protects the analysis.

The naive patch is to remove the quotes wherever you notice them. It fails when values arrive from a file or form. The durable fix is to convert at the boundary and handle conversion failure explicitly.

```python
visitor_count = int(visitor_count_text)
occupancy_rate = visitor_count / capacity_places
print(occupancy_rate)
```

Expected output:

```text
0.95
```

`int(...)` asks Python to interpret valid whole-number text as an integer. It does not make every string valid.

---

## A failed conversion is information

Predict which input converts successfully: `"38"`, `"38.5"`, or `"unknown"`.

```python
print(int("38"))
print(int("38.5"))
```

The first prints `38`. The second stops with:

```text
ValueError: invalid literal for int() with base 10: '38.5'
```

`38.5` describes a decimal number, so `float("38.5")` is meaningful. `"unknown"` is not a number and should remain missing or be rejected according to the data definition.

The named mistake is **blind conversion**: forcing every value through a conversion without deciding what invalid input means. A failed conversion may expose a source problem that matters more than the calculation.

### Conversion is a boundary decision

A **boundary** is where data crosses from one representation into another part of the analysis. Text from a file or form enters Python as characters; conversion is where you assert what those characters mean.

```text
source text "38"   → validate meaning → int 38   → arithmetic
source text "38.5" → visitor count?   → reject or investigate
source text "N/A"  → missing marker?  → preserve according to the contract
```

The correct conversion depends on the field, not on what Python is capable of parsing. `float("38.5")` works, but a half visitor may violate the definition of a head count. A technically successful conversion can still be analytically wrong.

Use the failure message as evidence:

```text
TypeError   operation is undefined for the existing types
ValueError  conversion function received content it cannot interpret
```

First inspect `type(value)` and the raw value. Then decide whether conversion, missingness handling, or source correction matches the field definition.

```quiz
{
  "prompt": "The source contains `\"unknown\"` for visitors. What is the safest first response?",
  "multiple": false,
  "options": [
    {"text":"Convert it to zero","correct":false},
    {"text":"Repeat the previous row's value","correct":false},
    {"text":"Delete the whole dataset","correct":false},
    {"text":"Treat it as invalid or missing according to the field definition","correct":true}
  ],
  "explanation": "`unknown` does not assert zero. Preserve or reject it using an explicit data rule rather than inventing a count."
}
```

---

## Arithmetic needs units

Operators do not carry business meaning. `-` knows how to subtract numbers; it does not know whether the result is spare places, a temperature difference, or a data-entry mistake.

Before calculating, write units beside the values:

```text
capacity_places  40 places
visitor_count    38 visitors present at the observation time
open_hours        8 hours scheduled
```

Then predict the unit produced by each expression. Addition and subtraction need compatible quantities. Division creates a relationship between numerator and denominator.

```python
capacity_places = 40
visitor_count = 38
open_hours = 8

spare_places = capacity_places - visitor_count
visitors_per_hour = visitor_count / open_hours
occupancy_rate = visitor_count / capacity_places

print(spare_places)
print(visitors_per_hour)
print(occupancy_rate)
```

Expected output:

```text
2
4.75
0.95
```

The operations create different units:

- places minus visitors is interpreted here as spare places because one visitor occupies one place at the observation time;
- visitors divided by hours gives visitors per hour only if `visitor_count` actually counts arrivals across those hours;
- visitors divided by capacity gives a unitless share.

Our dataset does not say the 38 visitors are arrivals accumulated across eight hours. Therefore `4.75 visitors per hour` is computable but not justified. Arithmetic cannot repair an unclear field definition.

This is the difference between a **calculation** and a **measure**. A calculation is the mechanical result of an expression. A measure is a calculation whose fields, units, time window, and interpretation match a defined question.

```text
38 / 8 = 4.75                         valid arithmetic
4.75 arrivals per hour                unsupported measure if 38 is a snapshot
38 / 40 = 0.95 occupancy proportion   supported by the stated snapshot fields
```

When a result looks plausible, check definitions before celebrating. Plausibility is not evidence of valid meaning.

---

## Precedence can change a rate

The coordinator wants unused capacity as a percentage.

Predict both results:

```python
wrong_rate = capacity_places - visitor_count / capacity_places
right_rate = (capacity_places - visitor_count) / capacity_places

print(wrong_rate)
print(right_rate)
```

Expected output:

```text
39.05
0.05
```

Python performs division before subtraction. Parentheses make the intended numerator happen first.

```text
without parentheses: 40 - (38 / 40) = 39.05
with parentheses:     (40 - 38) / 40 = 0.05
```

The wrong result is not merely imprecise. It answers no useful unit-consistent question. Write parentheses when they make the business definition visible.

### Derive the expression from words

Do not begin with symbols. Begin with the measure's sentence:

```text
unused share = unused places / all available places
unused places = capacity places - occupied places
```

Substitute the second definition into the first:

```text
unused share = (capacity places - occupied places) / capacity places
```

Only then translate names into Python. This procedure makes parentheses a consequence of the definition rather than punctuation to memorise.

### Predict before trusting a plausible number

Unused capacity cannot reasonably be `39.05` when total capacity is `40`. A proportion should be between `0` and `1` for a valid non-overcapacity observation. That rough range check catches the precedence mistake even before you inspect the expression.

Use both checks:

1. trace the operation order;
2. ask whether the result's range and unit are plausible.

```quiz
{
  "prompt": "Which expression calculates the unused share of capacity?",
  "multiple": false,
  "options": [
    {"text":"`capacity_places - visitor_count / capacity_places`","correct":false},
    {"text":"`capacity_places / visitor_count - capacity_places`","correct":false},
    {"text":"`visitor_count / capacity_places - 1`","correct":false},
    {"text":"`(capacity_places - visitor_count) / capacity_places`","correct":true}
  ],
  "explanation": "Unused places form the numerator, and total capacity is the denominator. Parentheses preserve that definition."
}
```

---

## Ratios, rates, and percentages

`0.95` is a proportion. Multiplying by 100 expresses the same relationship as a percentage.

```python
occupancy_rate = visitor_count / capacity_places
occupancy_percent = occupancy_rate * 100

print(occupancy_rate)
print(occupancy_percent)
```

Expected output:

```text
0.95
95.0
```

The denominator must be named. "95 percent" is incomplete unless the reader knows it means visitors divided by capacity.

These related words answer different questions:

**Ratio** compares one quantity with another. `38 / 40` compares visitors with capacity.

**Rate** is a ratio where the denominator often carries a unit such as time, distance, or population. "Arrivals per hour" needs accumulated arrivals and hours from the same period.

**Proportion** is a part divided by its whole. Occupied places divided by all available places gives `0.95`.

**Percentage** scales a proportion by 100 for communication. `0.95` and `95%` describe the same share in different scales.

The words are sometimes used loosely in workplaces. The safe habit is to state numerator, denominator, unit, and time window so the formula remains auditable.

A **percentage-point** change compares percentages by subtraction. Moving from 90% to 95% is a 5 percentage-point increase. The relative percent increase is `(95 - 90) / 90 * 100`, about 5.56%. These are different claims.

```python
old_percent = 90
new_percent = 95

point_change = new_percent - old_percent
relative_percent_change = (new_percent - old_percent) / old_percent * 100

print(point_change)
print(relative_percent_change)
```

Expected output:

```text
5
5.555555555555555
```

Trace why the two changes differ:

```text
percentage-point change = 95 - 90 = 5 points
relative percent change = change / starting value × 100
                        = 5 / 90 × 100
                        = 5.56%
```

The relative calculation uses the old value as its denominator. If the old percentage were zero, relative percent change would be undefined because division by zero has no meaningful result. Percentage-point change would still be calculable.

Do not write "increased by 5%" when the calculation was subtraction of two percentages. Name points when you mean points.

---

## Decimal output can be more precise than the evidence

Binary computers cannot represent every decimal fraction exactly. You can observe the familiar result directly:

```python
print(0.1 + 0.2)
```

Expected output:

```text
0.30000000000000004
```

This does not mean Python cannot do useful decimal arithmetic. It means a `float` stores a nearby binary approximation. Many languages behave the same way.

Two different problems must not be blended:

```text
representation detail   0.1 + 0.2 shows a tiny stored approximation
measurement uncertainty visitor counts, capacity definitions, and timing limit the claim
```

Formatting can hide irrelevant display noise, but it cannot improve source quality. Later in the course you will meet tools for exact decimal money. Today the rule is narrower: keep full intermediate values, avoid equality claims built on long decimal tails, and format the final communication to a justified precision.

---

## Strings label the evidence

Text values are strings. An f-string lets you place named values inside a message.

```python
centre_name = "Riverside C01"
occupancy_percent = 95.0

message = f"{centre_name}: {occupancy_percent}% occupied"
print(message)
```

Expected output:

```text
Riverside C01: 95.0% occupied
```

The leading `f` tells Python to replace expressions inside `{}` with their values. The colon and percent sign outside braces are ordinary label text.

Without the leading `f`, Python prints the braces literally. That visible failure is a formatting bug, not a calculation bug.

Read the syntax one piece at a time:

```python
message = f"{centre_name}: {occupancy_percent}% occupied"
```

The `f` changes how Python reads the quoted text. Characters outside braces remain literal labels. Each pair of braces holds a Python expression whose value is inserted. The percent sign after the second brace is literal text; Python does not multiply by 100 merely because `%` appears in the message.

This version therefore mislabels a proportion:

```python
occupancy_rate = 0.95
print(f"Occupancy: {occupancy_rate}%")
```

Expected but misleading output:

```text
Occupancy: 0.95%
```

The value should be multiplied by 100 or formatted with percentage-aware logic before receiving a percent label. A polished string can still carry a unit error.

---

## Precision should match the decision

The relative increase above contains many digits. Showing them all suggests more measurement certainty than the inputs support.

```python
message = f"Relative increase: {relative_percent_change:.1f}%"
print(message)
```

Expected output:

```text
Relative increase: 5.6%
```

Inside the braces, `:.1f` formats a numeric value with one digit after the decimal point. It changes the display, not the stored value.

Round for communication after calculating. Do not repeatedly round intermediate values because small losses can accumulate.

### Trace display separately from storage

```python
value = 5.555555555555555
message = f"Relative increase: {value:.1f}%"

print(value)
print(message)
```

Expected output:

```text
5.555555555555555
Relative increase: 5.6%
```

The stored float did not become `5.6`. The formatting instruction produced a string representation for this message. A later calculation using `value` still uses the fuller stored number.

Too many digits imply false certainty. Too few can hide a decision-relevant difference. Choose precision from source quality and decision threshold, not from how many decimals Python can print.

```quiz
{
  "prompt": "Why format the final message instead of rounding every intermediate value?",
  "multiple": false,
  "options": [
    {"text":"Formatting changes the raw source","correct":false},
    {"text":"Keeping full intermediate values avoids accumulated rounding loss","correct":true},
    {"text":"Python cannot round a float","correct":false},
    {"text":"More displayed digits always improve decisions","correct":false}
  ],
  "explanation": "Calculate with the available precision, then format the result to match the audience and measurement quality."
}
```

---

## Trace reassignment before running

Predict all three printed values:

```python
visitor_count = 38
occupancy_rate = visitor_count / 40
visitor_count = 39

print(visitor_count)
print(occupancy_rate)
print(visitor_count / 40)
```

---

## Feedback: names do not create live formulas

Expected output:

```text
39
0.95
0.975
```

When `occupancy_rate` was assigned, Python calculated `38 / 40` and stored `0.95`. Reassigning `visitor_count` later does not reach backward and recalculate older variables.

The spreadsheet-like misconception is that every assignment remains a live formula. In Python, rerun the calculation after changing an input.

Trace the three events:

```text
1. visitor_count = 38              name points to 38
2. occupancy_rate = 38 / 40        calculate now, store 0.95
3. visitor_count = 39              name now points to 39
                                    stored 0.95 is untouched
```

The naive patch is to remember to rerun one line manually. It works once and fails when another dependent value is forgotten. In this early notebook, keep inputs together and derived calculations immediately below them, then use restart and run all. Later, functions will package repeated calculations so an updated input cannot skip a required step.

---

## Debug a suspicious number without guessing

Suppose the brief prints `3905.0% unused`. Use a fixed procedure:

1. **Read the final expression.** Is multiplication by 100 happening once?
2. **Print every input with its type.** Did text or an unexpected decimal enter?
3. **Write the intended formula in words.** What are numerator and denominator?
4. **Add parentheses from the verbal formula.** Do not rely on visual intuition.
5. **Calculate a tiny case by hand.** With 38 of 40 places used, unused share must be 2 of 40, or 5%.
6. **Check range and unit.** A normal unused share cannot be 3905% here.

Useful instrumentation:

```python
print(capacity_places, type(capacity_places))
print(visitor_count, type(visitor_count))
print(capacity_places - visitor_count)
print((capacity_places - visitor_count) / capacity_places)
```

Expected output for the running values:

```text
40 <class 'int'>
38 <class 'int'>
2
0.05
```

Each line isolates one assumption. This is more reliable than changing several operators at once.

```quiz
{
  "prompt": "After `visitor_count` changes from `38` to `39`, why does stored `occupancy_rate` remain `0.95`?",
  "multiple": false,
  "options": [
    {"text":"Assignment stored the earlier calculated value","correct":true},
    {"text":"Integers cannot change","correct":false},
    {"text":"Division only runs once per notebook","correct":false},
    {"text":"The variable name is too long","correct":false}
  ],
  "explanation": "An assignment evaluates its right side at that moment. Recalculate derived values after an input changes."
}
```

---

## Practice

1. **Recall:** define value, variable, type, ratio, proportion, percentage, and percentage point with one example each.
2. **Trace:** on paper, trace `capacity = 30`, `visitors = 27`, `rate = visitors / capacity`, then `visitors = 28`. Predict all stored values before running.
3. **Mechanics:** calculate spare places, occupancy proportion, and occupancy percentage for capacity 30 and visitors 27. Label every unit.
4. **Communication:** write an f-string naming the centre, numerator, denominator, and percentage to one decimal place. Prove formatting did not change the stored float.
5. **Debugging:** diagnose `"27" / 30`, `int("27.5")`, `30 - 27 / 30`, and `f"{0.9}%"`. Name a different cause and smallest repair for each.
6. **Independent reconstruction:** begin with four named raw inputs, convert one valid text value at the boundary, calculate two measures, and emit a labelled message without referring to the examples.
7. **Changed-task transfer:** temperature arrives as `"39.5"`. Choose a conversion, preserve the unit in the name, and explain why a whole-person visitor count used a different type. Then state one input that should fail rather than convert.
8. **Counterexample:** construct a case where percentage points are calculable but relative percent change is not, and explain the denominator failure.

Keep two prompts for later retrieval: "Why does reassignment not update an older result?" and "Percentage points versus relative percent change." Include Day 1's grain prompt in the next short review.

---

## Studio: Riverside Capacity Message

Create a clean notebook cell that starts with named inputs for centre, capacity, visitors, and hours. Calculate spare places and occupancy, then produce a concise message with honest precision. Add a second input where visitors arrive as valid text, convert it at the boundary, and show the result. Add a third invalid value and write what the analysis should do rather than silently inventing a number.

---

## Common mistakes

- Using vague names that hide the unit.
- Expecting quoted digits to behave like numbers.
- Converting `unknown` to zero without a data rule.
- Omitting parentheses around the intended numerator.
- Calling a five percentage-point rise a five percent rise.
- Rounding every intermediate calculation.
- Expecting reassignment to update an already stored result.

---

## Cheat sheet

```python
centre_name = "Riverside C01"
capacity_places = 40
visitor_count = int("38")

spare_places = capacity_places - visitor_count
occupancy_rate = visitor_count / capacity_places
occupancy_percent = occupancy_rate * 100

print(type(visitor_count))
print(f"{centre_name}: {occupancy_percent:.1f}% occupied")
```

---

## Summary

You used meaningful names, distinguished integers, floats, strings, and booleans, converted text deliberately, traced precedence, labelled denominators and units, separated percentage points from relative change, and formatted without false precision.

Tomorrow, those values become ordered business rules. You will see why a condition can be individually true yet still produce the wrong category.

---

```finalquiz
{
  "title":"Day 2: Values Behind the Decision",
  "questions":[
    {"id":"q1","type":"single_correct","prompt":"What does assignment do?","codeSnippet":null,"options":[{"id":"a","text":"Binds a name to the evaluated value"},{"id":"b","text":"Creates a permanent live formula"},{"id":"c","text":"Proves two expressions are forever equal"},{"id":"d","text":"Converts every value to text"}],"correctOptionIds":["a"],"explanation":"Python evaluates the right side and binds the resulting value to the left-side name.","example":"`spare = 40 - 38` stores `2`."},
    {"id":"q2","type":"multiple_correct","prompt":"Which names preserve useful units?","codeSnippet":null,"options":[{"id":"a","text":"`x`"},{"id":"b","text":"`open_hours`"},{"id":"c","text":"`capacity_places`"},{"id":"d","text":"`thing`"}],"correctOptionIds":["b","c"],"explanation":"Both names reveal meaning and unit.","example":"Units make arithmetic reviewable."},
    {"id":"q3","type":"single_correct","prompt":"Why does `\"38\" / 40` fail?","codeSnippet":null,"options":[{"id":"a","text":"Forty is too large"},{"id":"b","text":"Division needs matching variable names"},{"id":"c","text":"Text has no defined division by an integer"},{"id":"d","text":"Quoted values are missing"}],"correctOptionIds":["c"],"explanation":"Python refuses an undefined operation between string text and an integer.","example":"Convert valid numeric text at the boundary."},
    {"id":"q4","type":"single_correct","prompt":"Which expression gives unused capacity share?","codeSnippet":null,"options":[{"id":"a","text":"`capacity - visitors / capacity`"},{"id":"b","text":"`(capacity - visitors) / capacity`"},{"id":"c","text":"`capacity / visitors - capacity`"},{"id":"d","text":"`visitors - capacity / visitors`"}],"correctOptionIds":["b"],"explanation":"Unused places form the numerator before division by total capacity.","example":"`(40 - 38) / 40` is `0.05`."},
    {"id":"q5","type":"multiple_correct","prompt":"Which statements about conversion are sound?","codeSnippet":null,"options":[{"id":"a","text":"`int(\"38\")` can produce `38`"},{"id":"b","text":"Every invalid value should become zero"},{"id":"c","text":"A failed conversion can reveal a data-quality problem"},{"id":"d","text":"`int(\"38.5\")` preserves the decimal"}],"correctOptionIds":["a","c"],"explanation":"Valid whole-number text converts; failure is evidence to handle, not erase.","example":"Use `float` only when decimals fit the field."},
    {"id":"q6","type":"single_correct","prompt":"A rise from 90% to 95% equals what percentage-point change?","codeSnippet":null,"options":[{"id":"a","text":"0.05 points"},{"id":"b","text":"5.56 points"},{"id":"c","text":"95 points"},{"id":"d","text":"5 points"}],"correctOptionIds":["d"],"explanation":"Percentage-point change subtracts the two percentages.","example":"`95 - 90 = 5`."},
    {"id":"q7","type":"single_correct","prompt":"What does `:.1f` do in an f-string?","codeSnippet":null,"options":[{"id":"a","text":"Marks a value missing"},{"id":"b","text":"Changes the source value to text permanently"},{"id":"c","text":"Divides the value by ten"},{"id":"d","text":"Displays a number with one decimal place"}],"correctOptionIds":["d"],"explanation":"It controls display precision without changing the stored input.","example":"`5.555` displays as `5.6`."},
    {"id":"q8","type":"multiple_correct","prompt":"Which claims need a stated denominator or unit?","codeSnippet":null,"options":[{"id":"a","text":"The centre is called C01"},{"id":"b","text":"Occupancy is 95%"},{"id":"c","text":"The file has a header"},{"id":"d","text":"The rate is 4.75 visitors per hour"}],"correctOptionIds":["b","d"],"explanation":"Percentages need their base, and rates need both numerator and denominator units.","example":"Say visitors divided by capacity."},
    {"id":"q9","type":"single_correct","prompt":"Why can `visitors / open_hours` be computable but unjustified?","codeSnippet":null,"options":[{"id":"a","text":"The field may be a snapshot, not arrivals accumulated over hours"},{"id":"b","text":"Python cannot divide integers"},{"id":"c","text":"Hours are always text"},{"id":"d","text":"Rates never help analysts"}],"correctOptionIds":["a"],"explanation":"Arithmetic needs a field definition that supports the intended interpretation.","example":"Snapshot occupancy is not automatically arrival rate."},
    {"id":"q10","type":"multiple_correct","prompt":"After an input changes, which actions protect the result?","codeSnippet":null,"options":[{"id":"a","text":"Assume old derived values update themselves"},{"id":"b","text":"Recalculate dependent values"},{"id":"c","text":"Check the displayed unit and label"},{"id":"d","text":"Add more decimal places"}],"correctOptionIds":["b","c"],"explanation":"Python stores evaluated results, so recalculate and verify meaning after input changes.","example":"Update occupancy after changing visitors."}
  ]
}
```
