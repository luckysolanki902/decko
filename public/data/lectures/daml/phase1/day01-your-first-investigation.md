# Day 1: Your First Data Investigation

**Duration: 4 hours | Focus: turn a small dataset into a checked decision brief**

---

## Why this day exists

A city coordinator must decide which neighbourhood may need longer cooling-centre hours during the next heat alert.

The spreadsheet is small. It is tempting to find the largest number and send an answer.

But a confident answer can describe the wrong thing, hide an incomplete row, or disappear when the notebook restarts.

Today you will make one modest claim that another person can inspect and reproduce.

---

## The answer that arrives too quickly

Each row records one cooling centre on the same hot afternoon.

```text
centre_id,neighbourhood,capacity,visitors,open_hours
C01,Riverside,40,38,8
C02,Riverside,30,27,8
C03,Hillview,50,31,6
C04,Hillview,35,,6
C05,Market,60,54,10
C06,Market,20,18,10
```

A first attempt says Market has `72` visitors, so Market needs help. The addition is correct. The decision is not yet supported. Market also has the most capacity, and Hillview has a missing count.

Before reading on, predict which check comes first: calculate totals, or establish what one row means.

---

## Feedback: begin with the row

One row represents one centre observed on one afternoon. That meaning is the dataset's **grain**.

```text
one row = one centre on one afternoon
six rows = six centre observations
```

Grain controls what can safely be counted. Six rows do not mean six neighbourhoods or six visitors. If dates are added later, the grain becomes one centre on one date.

> State the grain before calculating. A calculation is meaningful only when you know what its rows count.

```quiz
{
  "prompt": "A new file contains one row per centre per date. What changed?",
  "multiple": false,
  "options": [
    {"text":"Only the number of columns","correct":false},
    {"text":"The grain now includes a date","correct":true},
    {"text":"Each row now represents a neighbourhood","correct":false},
    {"text":"Capacity became a percentage","correct":false}
  ],
  "explanation": "The observation is now a centre on a particular date. Counts and totals must respect that added part of the grain."
}
```

---

## The analyst loop

An investigation is a loop in which each check earns the next claim.

```text
question → rows and columns → checks → evidence → decision
              ↑                              ↓
              └──────── correction ─────────┘
```

Here the question is about access. The checks cover row meaning, columns, missing values, and plausible ranges. Evidence compares visitors with capacity. The decision is where to investigate longer hours, not a claim that longer hours are proven to work.

Hillview's missing value sends us backward because its total would be incomplete.

---

## Four tools, four jobs

Python is the language that expresses steps. A notebook stores those steps in cells. VS Code displays the notebook. Pandas is a Python library that supplies a labelled table called a DataFrame.

```text
VS Code
└── notebook
    ├── cell: Python instructions
    └── output
         └── pandas can represent a CSV as a DataFrame
```

Saving cells does not prove they run correctly from a clean start.

---

## The same words are not the same tool

The four names above often arrive in one installation screen, so it is easy to blend them together. Separate them by asking what would remain if one piece disappeared.

If VS Code closed, the Python language would still exist. You could run a `.py` file elsewhere. If pandas were unavailable, Python could still run `print(2 + 2)`, but it would not know what `pd.read_csv` means. If the notebook were replaced by a `.py` file, the instructions would still be Python, but you would lose the cell-by-cell interface.

```text
Python     rules for values and instructions
pandas     extra Python code for labelled tables
notebook   a document that stores instructions in runnable cells
VS Code    the application used to edit and run that document
```

This distinction is a debugging tool. `NameError` concerns a Python name. `ModuleNotFoundError: No module named 'pandas'` means the library is unavailable in this Python session. A cell with no visible output may have run successfully but contained no `print(...)` or final expression to display.

> Diagnose the layer that failed before changing the analysis.

---

## A cell is not a page in a book

A notebook looks like a document, but Python does not read every visible cell whenever you look at it. It runs only the cell you request, using the memory held by the current session.

Predict the result of this exact order: run Cell B, run Cell A, then run Cell B again.

```python
# Cell A
question = "Which neighbourhood needs attention?"
```

```python
# Cell B
print(question)
```

Do not run it yet. Write the expected result for both attempts at Cell B. The code is identical, but the session state is not.

---

## A visible first win

```python
message = "Cooling-centre check started"
print(message)
```

Expected output:

```text
Cooling-centre check started
```

The first line gives text the name `message`. The second asks Python to display the stored value. Python runs top to bottom.

Now predict what a fresh session does with `print(question)` when no earlier cell defines `question`.

---

## Feedback: execution creates state

The cell fails:

```text
NameError: name 'question' is not defined
```

Saved code and current session state differ.

```text
question = "Where?"   run     → question exists
question = "Where?"   restart → question does not exist
```

```python
question = "Which neighbourhood may need longer hours?"
print(question)
```

Expected output:

```text
Which neighbourhood may need longer hours?
```

The named failure is **hidden state**: a later cell works only because another cell happened to run. Restarting and running all cells top to bottom exposes it.

For the prediction, the first attempt at Cell B raises `NameError`. Cell A then creates the name. The second attempt prints the question.

```text
before Cell A runs: session has no `question` name
after Cell A runs:  session maps `question` to the text value
after restart:      that session memory is cleared again
```

Saving preserves written cells and stored outputs. It does not prove the cells work in order. When a clean run fails, read the final error line, find the cell that should create the missing value, place that definition before its first use, restart, and run all again. Repeatedly running cells until the error vanishes only recreates hidden state.

```quiz
{
  "prompt": "A notebook works after manual cell runs but fails after restart and run all. What is the strongest diagnosis?",
  "multiple": false,
  "options": [
    {"text":"The CSV has too many rows","correct":false},
    {"text":"VS Code cannot run Python","correct":false},
    {"text":"A cell relies on state created out of order","correct":true},
    {"text":"Every notebook must become a script","correct":false}
  ],
  "explanation": "The clean run removed hidden state. Put each definition before its first use."
}
```

---

## From CSV text to a table

CSV means **comma-separated values**. It is plain text, not a spreadsheet workbook. Each line is a row, and commas separate fields within that row.

```text
centre_id,neighbourhood,capacity,visitors,open_hours  ← header labels
C01,Riverside,40,38,8                                ← first data row
```

The header tells a reader what each position means. Without it, `C01,Riverside,40,38,8` is only five values whose roles must be guessed. CSV also stores characters, not business definitions. The characters `40` could be a count, an identifier, or part of a code. A reader can infer a useful type, but the analyst must verify that interpretation.

Save the six lines as `cooling_centres.csv` beside the notebook.

```python
import pandas as pd

centres = pd.read_csv("cooling_centres.csv")
print(centres)
```

Expected output:

```text
  centre_id neighbourhood  capacity  visitors  open_hours
0        C01     Riverside        40      38.0           8
1        C02     Riverside        30      27.0           8
2        C03      Hillview        50      31.0           6
3        C04      Hillview        35       NaN           6
4        C05        Market        60      54.0          10
5        C06        Market        20      18.0          10
```

`import pandas as pd` loads pandas under the short name `pd`. `pd.read_csv(...)` reads the file and returns a DataFrame. `centres =` preserves that result under a meaningful name.

The leftmost labels `0` to `5` are added by pandas. They are not centre IDs. `NaN` marks the absent visitor count.

---

## A DataFrame is a labelled rectangle

The unfamiliar noun is **DataFrame**. For today, picture a rectangle with column labels across the top and row labels down the side.

```text
                         column labels
                 centre_id  neighbourhood  capacity
row label 0          C01       Riverside        40
row label 1          C02       Riverside        30
row label 2          C03        Hillview        50
```

The rectangle holds data values. Column labels say what each vertical field represents. Row labels help pandas locate rows, but they are not automatically part of the source data. That is why `0`, `1`, and `2` must not be reported as centre identifiers.

The variable `centres` refers to the whole rectangle. This expression selects the column with the exact label `capacity`:

```python
print(centres["capacity"])
```

Expected output:

```text
0    40
1    30
2    50
3    35
4    60
5    20
Name: capacity, dtype: int64
```

Square brackets here mean "look up this column label." A misspelling raises `KeyError`, evidence that the requested label is absent.

---

## Read the import and function call in slow motion

```python
import pandas as pd
```

`import` asks Python to make another body of code available. `pandas` is the installed library name. `as pd` gives it a shorter local name. The alias does not create a different library.

Now read the next line from the inside out:

```python
centres = pd.read_csv("cooling_centres.csv")
```

1. The quoted text names a path.
2. Parentheses call pandas' `read_csv` function with that path.
3. The call returns a DataFrame.
4. `centres =` binds the returned table to a name.

Writing only `pd.read_csv` refers to the function itself and reads no file. Parentheses are what ask the function to run.

---

## Diagnose the path before the data

`FileNotFoundError` says Python could not find the path. It does not say the CSV contents are bad.

```python
from pathlib import Path

print(Path.cwd())
print(Path("cooling_centres.csv").exists())
```

Example output:

```text
/Users/learner/cooling-analysis
True
```

`Path.cwd()` shows the folder Python searches from. `.exists()` tests the named path. A `False` result tells you to fix the location or name before changing analysis code.

When `read_csv` fails, Python prints a **traceback**, a record of the calls that led to the failure. Start at its last line:

```text
FileNotFoundError: [Errno 2] No such file or directory: 'cooling_centres.csv'
```

That line names both the failure and the path. Inspect in this order:

```text
1. final error line
2. Path.cwd()
3. the exact path with .exists()
4. spelling, extension, and folder
5. then rerun read_csv
```

Changing CSV contents cannot repair a path that points somewhere else.

---

## Predict the shape

Before running `print(centres.shape)`, count data rows and headers. Write the expected pair as `(rows, columns)`.

---

## Feedback: inspect structure first

```python
print(centres.shape)
print(centres.columns.tolist())
print(centres.head(3))
```

Expected output:

```text
(6, 5)
['centre_id', 'neighbourhood', 'capacity', 'visitors', 'open_hours']
  centre_id neighbourhood  capacity  visitors  open_hours
0        C01     Riverside        40      38.0           8
1        C02     Riverside        30      27.0           8
2        C03      Hillview        50      31.0           6
```

`.shape` gives rows first. `.columns.tolist()` displays the labels. `.head(3)` previews three rows. A preview is not a quality proof because the fourth row holds the missing value.

Each expression answers a different question:

```text
shape             How large is the rectangle?
columns.tolist()  What are the exact field labels?
head(3)           Do these first rows look like the expected kind of record?
```

`shape` is an **attribute**, stored information about the DataFrame, so it has no call parentheses. `head(3)` is a **method**, an operation the DataFrame performs, so parentheses call it and `3` is the argument. `columns` is an attribute whose result then uses the `tolist()` method.

A preview is orientation, not certification. It deliberately hides rows four through six, including the missing visitor value. Pair it with checks that scan all rows.

```quiz
{
  "prompt": "The DataFrame has shape `(6, 5)`. Which interpretation is correct?",
  "multiple": false,
  "options": [
    {"text":"Six columns and five rows","correct":false},
    {"text":"Six neighbourhoods and five centres","correct":false},
    {"text":"Six values in every column","correct":false},
    {"text":"Six rows and five columns","correct":true}
  ],
  "explanation": "Shape is ordered as rows, then columns. It says nothing about uniqueness or completeness."
}
```

---

## Count labels, not people

```python
print(centres["neighbourhood"].value_counts())
```

Expected output:

```text
neighbourhood
Riverside    2
Hillview     2
Market       2
Name: count, dtype: int64
```

Square brackets select one column. `.value_counts()` counts each distinct label. It reports two centre rows per neighbourhood, not two visitors.

Trace the count by hand:

```text
read C01  → Riverside 1
read C02  → Riverside 2
read C03  → Hillview 1
read C04  → Hillview 2
read C05  → Market 1
read C06  → Market 2
```

The output unit is centre rows because that is the input grain. If the file later held one centre per date, the same code would count centre-date rows. Unchanged code can acquire a different meaning when grain changes.

---

## Missing is not zero

Predict which column will have a missing count of one.

```python
print(centres.isna().sum())
```

Expected output:

```text
centre_id       0
neighbourhood   0
capacity        0
visitors        1
open_hours      0
dtype: int64
```

`isna()` marks missing cells. `sum()` counts those marks down each column. Replacing the blank with zero would claim no visitors attended, which was never observed.

The calls form a pipeline:

```text
original cell  → is it missing? → mark → sum marks by column
38             → False          → 0
blank / NaN    → True           → 1
```

Keep three meanings separate:

```text
0 visitors       measured, with nobody present
missing visitors no usable measurement recorded
centre closed    an operational fact needing its own evidence
```

They lead to different actions. Zero may suggest low observed demand. Missingness may require a reporting repair. Closure may explain why no count exists. Filling all three with zero erases the decision-relevant difference.

Before changing a missing value, ask whether parsing failed, what blank means in the source contract, whether reporting was expected, whether an authorised source can recover it, and which comparisons must disclose its absence.

```quiz
{
  "prompt": "Why is replacing Hillview's missing visitor count with `0` unsafe?",
  "multiple": false,
  "options": [
    {"text":"Zero claims no visitors attended, which was not observed","correct":true},
    {"text":"Pandas forbids zero in numeric columns","correct":false},
    {"text":"Zero would add a row","correct":false},
    {"text":"Missing means the centre was closed","correct":false}
  ],
  "explanation": "An unavailable measurement and a measured zero have different meanings."
}
```

---

## A measure that respects capacity

Raw totals reward large centres for being large. Compare two complete rows:

```text
centre  visitors  capacity
C01          38        40
C05          54        60
```

C05 has more visitors. C01 has less room left relative to its size. For crowding, neither raw visitor count nor raw capacity answers the question alone.

Predict both shares before running code:

```text
C01: 38 / 40 = 0.95
C05: 54 / 60 = 0.90
```

```python
centres["occupancy_rate"] = centres["visitors"] / centres["capacity"]
print(centres[["centre_id", "neighbourhood", "occupancy_rate"]])
```

Expected output:

```text
  centre_id neighbourhood  occupancy_rate
0        C01     Riverside        0.950000
1        C02     Riverside        0.900000
2        C03      Hillview        0.620000
3        C04      Hillview             NaN
4        C05        Market        0.900000
5        C06        Market        0.900000
```

The division happens row by row. `0.95` means 95 visitors per 100 places for C01. Riverside deserves a closer look, but this one-afternoon file cannot prove that longer hours will improve safety.

The derived column does not change the grain. Every row still describes one centre on one afternoon. It adds a measure calculated from two fields on that row.

Missingness also travels: C04 has no visitor count, so its occupancy is `NaN`. That is safer than a made-up percentage. The missing input prevents a false output.

Capacity is the denominator. A zero capacity would make the ratio undefined, while a negative capacity would violate the field's real-world meaning. The current rows contain neither, but the analysis still depends on this stated assumption:

```text
capacity is recorded, numeric, and greater than zero
```

---

## Keep claims in layers

```text
evidence       C01 recorded 38 visitors for 40 places: 95%
interpretation C01 had the highest observed complete occupancy
decision       investigate Riverside for extended hours first
```

The named failure is **causal overreach**: claiming the policy will reduce heat risk when the table measures neither policy effects nor health outcomes.

Several dates, hourly arrivals, or turn-away counts could change the recommendation.

### Break the conclusion one realistic step later

Suppose tomorrow's file shows C01 at 50% occupancy. The statement "C01 is always the most crowded" breaks immediately. Today's evidence never contained "always"; the analyst added it.

Now suppose C04's missing visitor count is recovered as 35. Its occupancy becomes 100%, higher than C01. The Riverside recommendation may remain a useful provisional next step, but it is sensitive to that missing value.

This produces a practical question: **what plausible new evidence would change the recommendation?** Here, recovering C04 matters more than printing extra decimal places for C01.

---

## Debug the investigation in a fixed order

Random edits are expensive because one successful run does not reveal which edit mattered.

```text
symptom                         inspect first
NameError                       cell order and the missing name
FileNotFoundError               working directory and exact path
KeyError for a column           columns.tolist() and spelling
unexpected shape                source lines, separator, and header
surprising category counts      grain and raw labels
wrong or missing ratio          numerator, denominator, and missing inputs
overconfident recommendation    period, missing evidence, and wording
```

After a repair, restart and run all. That proves the fix works from a clean state.

```quiz
{
  "prompt": "Which statement stays closest to the evidence?",
  "multiple": false,
  "options": [
    {"text":"Longer hours will eliminate heat risk","correct":false},
    {"text":"Market has excess capacity every day","correct":false},
    {"text":"C01 had the highest observed occupancy among complete rows","correct":true},
    {"text":"C04 had no visitors","correct":false}
  ],
  "explanation": "The C01 statement is a bounded comparison. The others invent causation, generalise, or turn missingness into zero."
}
```

---

## Practice

Work in order and close the teaching screens during reconstruction.

1. **Recall:** draw the analyst loop, define grain, and state this file's grain.
2. **Guided mechanics:** recreate and load the CSV. Before each call, write the question answered by `shape`, `columns.tolist()`, `head(3)`, `value_counts()`, and `isna().sum()`.
3. **Independent reconstruction:** from a blank notebook, check the path, load the data, inspect it, count labels and missing cells, calculate occupancy, then restart and run all.
4. **Debugging:** create `NameError`, `FileNotFoundError`, and a column `KeyError` one at a time. Record the final traceback line, failed layer, diagnostic check, and smallest repair.
5. **Analysis:** write separate evidence, interpretation, and recommendation sentences for C01, plus why C04's missing value could change the result.
6. **Changed-task transfer:** the user now asks which individual centre needs a staffing check. Choose the grain and measure without a technique hint, and explain why neighbourhood totals answer a different question.
7. **Counterexample:** invent one additional row that weakens the Riverside recommendation. State which claim changes and which still holds.

Keep at most two later prompts: "What does grain control?" and "Why restart and run all?" Review around 1, 3, 7, 14, and 30 days after study, adapting after errors.

---

## Studio: Cooling-Centre Access Note

Build a rerunnable notebook that states the question and grain, loads the CSV, shows structural and missingness checks, calculates occupancy, and ends with evidence, interpretation, recommendation, one limitation, and evidence that could change the decision. Restart and run all before sharing.

Use this completion test:

```text
[ ] question names the user and decision
[ ] grain appears before calculations
[ ] source path is checked
[ ] shape, labels, preview, category counts, and missing counts are visible
[ ] occupancy names numerator and denominator
[ ] C04 remains missing rather than becoming zero
[ ] evidence, interpretation, and recommendation are separate
[ ] a plausible result that would change the recommendation is named
[ ] restart and run all succeeds
```

Then change the request to a centre-level staffing check. Explain which notebook steps remain valid and which conclusion must change. That explanation is evidence of transfer; rerunning the unchanged notebook is not.

Record help honestly. Learned with help, independent once, recalled later, and transferred are different evidence.

---

## Common mistakes

- Counting the header as a row. `.shape` counts data rows.
- Treating the pandas index as the centre identifier.
- Turning a missing measurement into zero without evidence.
- Trusting a notebook that only runs in a lucky cell order.
- Turning one observed ratio into a claim about policy effects.

---

## Cheat sheet

```python
import pandas as pd
from pathlib import Path

print(Path.cwd())
print(Path("cooling_centres.csv").exists())
centres = pd.read_csv("cooling_centres.csv")
print(centres.shape)
print(centres.columns.tolist())
print(centres.head(3))
print(centres["neighbourhood"].value_counts())
print(centres.isna().sum())
centres["occupancy_rate"] = centres["visitors"] / centres["capacity"]
```

---

## Summary

You declared grain, inspected CSV structure, diagnosed path and state failures, preserved missingness, calculated a bounded measure, and separated evidence from decision.

Tomorrow, the same decision becomes a reason to understand how Python stores numbers and text, performs business arithmetic, and rejects unsafe conversions.

---

```finalquiz
{
  "title": "Day 1: Your First Data Investigation",
  "questions": [
    {"id":"q1","type":"single_correct","prompt":"What is the dataset grain?","codeSnippet":null,"options":[{"id":"a","text":"One visitor"},{"id":"b","text":"One neighbourhood"},{"id":"c","text":"One centre on one afternoon"},{"id":"d","text":"One capacity value"}],"correctOptionIds":["c"],"explanation":"Each row describes one centre observed on the shared afternoon.","example":"C01 is one centre observation."},
    {"id":"q2","type":"multiple_correct","prompt":"Which checks belong before a decision claim?","codeSnippet":null,"options":[{"id":"a","text":"Inspect missing values"},{"id":"b","text":"Assume blanks are zero"},{"id":"c","text":"State the row grain"},{"id":"d","text":"Hide incomplete rows"}],"correctOptionIds":["a","c"],"explanation":"Grain and missingness establish what the calculation can mean.","example":"Disclose Hillview's blank before comparison."},
    {"id":"q3","type":"single_correct","prompt":"What does `(6, 5)` mean?","codeSnippet":null,"options":[{"id":"a","text":"Six columns, five rows"},{"id":"b","text":"Six rows, five columns"},{"id":"c","text":"Six complete rows, five blanks"},{"id":"d","text":"Six centres in five areas"}],"correctOptionIds":["b"],"explanation":"Shape reports rows first and columns second.","example":"There are six data lines and five headers."},
    {"id":"q4","type":"single_correct","prompt":"Why restart and run all?","codeSnippet":null,"options":[{"id":"a","text":"To sort rows"},{"id":"b","text":"To add an index"},{"id":"c","text":"To remove blanks"},{"id":"d","text":"To expose hidden state dependencies"}],"correctOptionIds":["d"],"explanation":"A clean session proves cells create values before using them.","example":"A name used before definition fails."},
    {"id":"q5","type":"multiple_correct","prompt":"Which claims are supported?","codeSnippet":null,"options":[{"id":"a","text":"C01 recorded 95% occupancy"},{"id":"b","text":"Longer hours prevent illness"},{"id":"c","text":"C04 had zero visitors"},{"id":"d","text":"One visitor count is missing"}],"correctOptionIds":["a","d"],"explanation":"The rate and missing count are observable; the other claims are invented.","example":"Stay within measured fields and time."},
    {"id":"q6","type":"single_correct","prompt":"What does `value_counts()` answer here?","codeSnippet":null,"options":[{"id":"a","text":"Visitor totals"},{"id":"b","text":"Average capacity"},{"id":"c","text":"Rows per neighbourhood label"},{"id":"d","text":"Missing cells per column"}],"correctOptionIds":["c"],"explanation":"It counts occurrences of each selected label.","example":"Riverside appears twice."},
    {"id":"q7","type":"single_correct","prompt":"A path existence check is `False`. What comes first?","codeSnippet":null,"options":[{"id":"a","text":"Check file location and name"},{"id":"b","text":"Change capacity values"},{"id":"c","text":"Fill missing visitors"},{"id":"d","text":"Calculate occupancy"}],"correctOptionIds":["a"],"explanation":"Resolve the path before inspecting file contents.","example":"Compare the name with the working folder."},
    {"id":"q8","type":"multiple_correct","prompt":"Which tool descriptions are correct?","codeSnippet":null,"options":[{"id":"a","text":"A notebook is the Python language"},{"id":"b","text":"Pandas supplies the DataFrame"},{"id":"c","text":"VS Code is the CSV format"},{"id":"d","text":"A notebook stores executable cells"}],"correctOptionIds":["b","d"],"explanation":"Pandas provides tables; notebooks hold cells. Python is the language and VS Code the application.","example":"Notebook Python can call pandas."},
    {"id":"q9","type":"single_correct","prompt":"Why is `NaN` not zero visitors?","codeSnippet":null,"options":[{"id":"a","text":"It marks an unavailable value"},{"id":"b","text":"It marks a duplicate"},{"id":"c","text":"It means no capacity"},{"id":"d","text":"It is another spelling of zero"}],"correctOptionIds":["a"],"explanation":"Missingness is absence of a recorded value; zero is a recorded count.","example":"C04 attendance is unknown."},
    {"id":"q10","type":"multiple_correct","prompt":"What makes the notebook decision-ready?","codeSnippet":null,"options":[{"id":"a","text":"A decorative title"},{"id":"b","text":"A stated limitation"},{"id":"c","text":"A recommendation tied to checked evidence"},{"id":"d","text":"A hidden correction"}],"correctOptionIds":["b","c"],"explanation":"A useful brief connects checks to a bounded recommendation and exposes limits.","example":"Recommend investigation, not certainty."}
  ]
}
```
