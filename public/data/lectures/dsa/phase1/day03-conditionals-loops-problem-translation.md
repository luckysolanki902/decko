# Day 3: Conditionals, loops & turning a statement into code

**Duration: ~4 hours across sessions | Focus: choose an action, repeat a bounded step, and translate a statement into a tested program**

---

## Why this day exists

A ticket does not always have the same price.
A child may pay less than an adult.

Yesterday's program performed the same calculation for every input.
We need it to choose the right calculation.

We also need it to handle more than two purchases.
Writing another line for every possible purchase will not work.

A small decision and a small repeated step can solve both problems.
The hard part is being precise about when each step happens.

---

## Before you reveal: recover two dependencies

Without notes, explain why `long long result = a * b;` can still fail when
`a` and `b` are `int`. Write a safe version.

Then trace `total = total + price;` with `total = 20` and `price = 7`.
Which variable changes? What value could you use for an initially empty total?

---

## Feedback: updates need a safe starting point

Widen an operand first: `static_cast<long long>(a) * b`. A large destination
does not change the earlier multiplication.

The assignment calculates 27, then stores it in `total`; `price` remains 7.
An empty sum starts at zero. This update will become the repeated step for many
purchases. If either explanation was difficult, rebuild its Day 1 or Day 2 example
before adding repetition.

---

## Two prices, one decision

A ticket costs 50 for someone younger than 12 and 100 otherwise.
For ages 8, 12 and 30, predict the three prices before looking at the program.

The boundary matters. “Younger than 12” excludes age 12. Writing down these three
cases is already part of designing the program.

---

## A condition chooses a path

```cpp
#include <iostream>
int main() {
    int age = 0;
    std::cin >> age;
    if (age < 12) {
        std::cout << 50 << '\n';
    } else {
        std::cout << 100 << '\n';
    }
    return 0;
}
```

`age < 12` produces the boolean taught yesterday. `if` executes its braced
block when that boolean is true. `else` executes its block otherwise.
Exactly one of these two blocks runs. The answers are 50, 100 and 100.

Braces group the statements belonging to a path. Use them even for one statement;
otherwise adding a second statement later can accidentally place it outside the path.
Indentation helps humans, but braces determine the block.

---

## Add a category without charging twice

Now ages below 12 pay 50, ages 12–59 pay 100, and ages 60 or above pay 70.

Inside `main`, after reading `age`:

```cpp
if (age < 12) {
    std::cout << 50 << '\n';
} else if (age < 60) {
    std::cout << 100 << '\n';
} else {
    std::cout << 70 << '\n';
}
```

The second condition is considered only after the first failed. Reaching it already
establishes `age >= 12`, so `age < 60` identifies the middle category.
An `else if` chain chooses the first matching branch.

Two separate `if` statements are different: both can run. For a child, separate
tests `age < 12` and `age < 60` would both be true. That is useful for independent
checks, but wrong when you need exactly one price.

---

```quiz
{"prompt":"In the ticket chain, why does the middle branch need only `age < 60` rather than repeating `age >= 12`?","options":[{"text":"Every if assumes ages are positive.","correct":false},{"text":"An earlier failed `age < 12` test already establishes the lower bound.","correct":true},{"text":"The compiler guesses the intended age range.","correct":false},{"text":"All branches execute and the last answer wins.","correct":false}],"explanation":"An else-if branch is reached only when previous conditions were false. That supplies the missing lower bound. Separate if statements would not have that exclusive-path behavior."}
```

---

## Combine yes/no questions

Suppose a reduced ticket is available for ages below 12 **or** at least 60.
Use `age < 12 || age >= 60`. The operator `||` means at least one condition
is true; both being true would also satisfy it.

For an age between 12 and 59, use `age >= 12 && age < 60`.
`&&` requires both conditions. Do not write `12 <= age < 60`: C++ evaluates
one comparison first, giving a boolean, and then compares that value with 60.

`!` negates a boolean: `!ready` means ready is false.
Parentheses make combined conditions easier to read:
`(age < 12) || (age >= 60)`.

Recall the comparison symbols: `==` equality, `!=` inequality, `<=` at most,
`>=` at least. Accidentally writing `age = 12` assigns 12; it is not a comparison.
Compiler warnings are useful, but a clean build is not proof of correct logic.

---

## The order of conditions can protect a calculation

We want to ask whether integer `a` is exactly divisible by `b`.
The test `a % b == 0` is invalid for `b == 0`. Assume here `a` and `b`
are between -1,000 and 1,000, so the extreme signed-division issue from Day 2
cannot occur.

```cpp
#include <iostream>
int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    if (b != 0 && a % b == 0) {
        std::cout << "divisible\n";
    } else {
        std::cout << "not divisible or invalid divisor\n";
    }
    return 0;
}
```

Built-in `&&` evaluates its left side first. If that is false, it does not evaluate
the right side: the combined answer is already false. This is **short-circuiting**.
With zero divisor, the remainder operation is skipped.

Built-in `||` skips its right side when the left side is already true.
Reversing the guard to `a % b == 0 && b != 0` is too late.

---

## Choose one value without a large branch

The conditional operator `condition ? value_if_true : value_if_false` produces
one selected value. Here is a fragment after reading `age`:

```cpp
int price = (age < 12) ? 50 : 100;
std::cout << price << '\n';
```

Only the selected value expression is evaluated. For age 8, the declaration stores
50; for age 12, it stores 100. Use this for a short choice of value.
A long sequence of actions or deeply nested choices is easier to follow with
ordinary `if` blocks.

---

## Select among exact codes

A vending machine receives integer code 1 for water, 2 for tea, or another value
for an unknown choice.

```cpp
#include <iostream>
int main() {
    int code = 0;
    std::cin >> code;
    switch (code) {
        case 1:
            std::cout << "water\n";
            break;
        case 2:
            std::cout << "tea\n";
            break;
        default:
            std::cout << "unknown\n";
            break;
    }
    return 0;
}
```

`switch` selects an entry label by equality with the code. `case 1:` and
`case 2:` name those values; `default:` handles no match. This is useful for
several exact integral codes, whereas range conditions fit `if` better.

`break;` exits the switch. Without it, execution continues into subsequent
statements, even past the next case label. That **fallthrough** can intentionally
share work, but here it would print extra drinks. A switch is not an if-chain
with automatic stopping.

---

```quiz
{"prompt":"For a possible zero divisor, which condition protects the remainder operation?","options":[{"text":"`a % b == 0 && b != 0`","correct":false},{"text":"`b == 0 && a % b == 0`","correct":false},{"text":"`b != 0 || a % b == 0`","correct":false},{"text":"`b != 0 && a % b == 0`","correct":true}],"explanation":"The nonzero guard must be evaluated first, and && must skip the remainder when it fails. The reversed order evaluates too early; the other conditions still evaluate remainder when b is zero. Assume values avoid the extreme signed minimum divided by -1 case."}
```

---

## Three greetings suggest a repeated step

Printing a greeting three times with three copied statements works. If an input
asks for 10,000 greetings, copying the source is the wrong representation.

Write the steps in words:

1. Start a counter at zero.
2. If fewer than three greetings have been printed, print one.
3. Increase the counter.
4. Check again.

The repeated block is a **loop**. The counter tracks progress toward stopping.

---

## A for-loop puts the schedule in one place

```cpp
#include <iostream>
int main() {
    for (int i = 0; i < 3; i = i + 1) {
        std::cout << "Hi\n";
    }
    return 0;
}
```

The header has initialization, condition and update, separated by semicolons.
Initialization happens once. The condition is checked before each body execution.
The update happens after each completed body, then the condition is checked again.

| Counter at check | `i < 3` | Action |
|---:|---|---|
| 0 | true | print, then set i to 1 |
| 1 | true | print, then set i to 2 |
| 2 | true | print, then set i to 3 |
| 3 | false | leave the loop |

The body runs three times; the condition is checked four times.
`i++` and `++i` can both be used as the standalone increment here. Their
expression values differ, so use `i = i + 1` while tracing the mechanism.

---

## The endpoints determine the count

For nonnegative `n`, counters `0, 1, ..., n-1` contain exactly `n` values.
That is why `i = 0; i < n` is a useful default for repeating something `n` times.
With `n = 0`, the condition is false immediately and the body runs zero times.

Changing the condition to `i <= n` includes an extra value, `n`, producing
`n + 1` executions when the counter can represent that endpoint.

A different valid convention is `i = 1; i <= n`: values 1 through n.
Do not memorize “less-than good, less-or-equal bad.” Match the start and end to
the intended set of counter values, and ensure counter updates cannot overflow.

Before continuing, trace `i = 1; i < 3`. List the values that enter the body.
The next screen gives feedback.

---

## The missing endpoint is a real missed action

The values are 1 and 2: two executions. A task requiring three input reads would
leave one input unread. With zero-based counting, `i = 0; i < 3` reads three.

Now use the repeated step to total `n` prices. Input gives `n` first, followed
by exactly `n` values. We do not need to keep every price after adding it.

```cpp
#include <iostream>
int main() {
    int n = 0;
    std::cin >> n;
    long long total = 0;
    for (int i = 0; i < n; i = i + 1) {
        long long price = 0;
        std::cin >> price;
        total = total + price;
    }
    std::cout << total << '\n';
    return 0;
}
```

Assume `0 <= n <= 100000` and each price is in 0–1,000,000,000.
The total fits `long long` by yesterday's bound. A variable declared inside the
braces belongs to that block; the price slot is created anew on each execution.
`total` must be declared before the loop so its accumulated value survives.

---

## Trace the meaning, not only the counter

For input `3 12 7 5`:

| Prices already read | Last price | Total after update |
|---:|---:|---:|
| 0 | none | 0 |
| 1 | 12 | 12 |
| 2 | 7 | 19 |
| 3 | 5 | 24 |

After each step, `total` equals the sum of all prices read so far.
That is a fact preserved by every repetition, often called an **invariant**.

It holds initially for no prices and total zero. Reading one new price and adding
it preserves the fact. When all n prices have been read, the fact says the total
is exactly the desired answer. This is a correctness argument, not merely a
claim that the sample worked.

If `total = 0` were inside the loop, each new price would erase the previous sum.

---

```quiz
{"prompt":"A loop should read exactly n values, including none when n is zero. Which header matches that intent?","options":[{"text":"`for (int i = 0; i <= n; i = i + 1)`","correct":false},{"text":"`for (int i = 1; i < n; i = i + 1)`","correct":false},{"text":"`for (int i = 0; i < n; i = i + 1)`","correct":true},{"text":"A do-while with no initial condition check always suffices.","correct":false}],"explanation":"The zero-based values 0 through n-1 give n executions and no execution for n=0. Including n adds an extra execution; starting at 1 while excluding n removes one; do-while always enters once."}
```

---

## A while-loop follows an ongoing condition

Suppose nonnegative prices arrive until the special input -1 means stop.
The count is not supplied in advance. We can read a value, then continue while
it is not the sentinel. A **sentinel** is a reserved value that marks the end.

```cpp
#include <iostream>
int main() {
    long long price = 0;
    long long total = 0;
    std::cin >> price;
    while (price != -1) {
        total = total + price;
        std::cin >> price;
    }
    std::cout << total << '\n';
    return 0;
}
```

Assume valid input always ends with -1, at most 100,000 prices, each at most a
billion. The sentinel is tested before adding, so it is not part of the total.
The next read changes the condition's input; omitting it would repeat forever
when the first price was not -1. A real input stream may end or fail; this example
explicitly assumes the promised sentinel instead of silently pretending to handle that.

---

## A do-while enters before checking

Sometimes one execution must happen even for an initial boundary value.
To count decimal digits, repeatedly divide a nonnegative integer by ten.
The number 0 still has one written digit.

```cpp
#include <iostream>
int main() {
    long long value = 0;
    std::cin >> value;
    int digits = 0;
    do {
        digits = digits + 1;
        value = value / 10;
    } while (value != 0);
    std::cout << digits << '\n';
    return 0;
}
```

For 507, division produces 50, 5, then 0, so the body runs three times.
For 0, the body still runs once before the condition is tested.
The semicolon after `while (...)` is required in a do-while.
Use this form because the first action is required, not merely because it is shorter.

Stop for a session break here. Without notes, trace a for-loop with n=0 and this
do-while with value=0. Their different entry behavior is the key distinction.

---

## Stop a loop or skip one iteration

`break` exits the nearest enclosing loop or switch. `continue` skips the
remaining body of the nearest loop and moves toward its next condition check.
In a for-loop, the update still occurs after `continue`.

This complete program reads n values and sums only positive ones:

```cpp
#include <iostream>
int main() {
    int n = 0;
    std::cin >> n;
    long long total = 0;
    for (int i = 0; i < n; i = i + 1) {
        long long value = 0;
        std::cin >> value;
        if (value <= 0) {
            continue;
        }
        total = total + value;
    }
    std::cout << total << '\n';
    return 0;
}
```

Assume at most 100,000 values with magnitudes at most a billion. Negative and zero
values are still read; only their addition is skipped. Replacing `continue` with
`break` would leave later values unread and end this processing early.

---

## Continue can bypass progress in a while-loop

This intentionally broken fragment never advances from zero:

```cpp
int i = 0;
while (i < 3) {
    if (i == 0) {
        continue;
    }
    i = i + 1;
}
```

The update is part of the body, and `continue` jumps past it. Contrast that with
a for-loop's update clause, which still runs after continue.
Repair the design by ensuring every continuing path advances, or use a for-loop
when the counter schedule belongs in its header.

Also avoid a stray semicolon after `while (condition);` or `for (...);`:
that semicolon is an empty body. The following block is not the repeated body
you probably intended.

---

## Nested repetition counts combinations

Print a rectangle of two rows, each with three stars:

```cpp
#include <iostream>
int main() {
    for (int row = 0; row < 2; row = row + 1) {
        for (int col = 0; col < 3; col = col + 1) {
            std::cout << '*';
        }
        std::cout << '\n';
    }
    return 0;
}
```

For each row, the inner counter starts at zero again. It prints three stars,
then the outer body prints one newline. There are 2 × 3 = 6 star writes and
two newline writes. Moving the newline inside the inner loop would print a
vertical sequence instead of rows.

For n rows and m columns, the star-printing body runs n × m times.
Formal growth notation comes on Day 7; today count the actual repeated work.
A break in the inner loop exits only that inner loop, not both loops.

---

```quiz
{"prompt":"A for-loop encounters continue inside its body. What happens next?","options":[{"text":"The remaining body is skipped, then the loop's update and next condition check occur.","correct":true},{"text":"The entire program always ends.","correct":false},{"text":"The update is always skipped just as a body statement would be.","correct":false},{"text":"The enclosing outer loop automatically breaks too.","correct":false}],"explanation":"A for-loop has an update clause separate from its body. Continue skips the rest of the body but still reaches that clause. Break exits the nearest loop; neither operation automatically ends every enclosing loop or the program."}
```

---

## Translate a statement before typing

“Each test case contains a count n followed by n purchase prices. Print the total
for each case.” A **test case** is one independent instance of the task.
A leading integer t tells us how many independent cases follow.

Before coding, write:

- Input: t, then for each case n and exactly n prices.
- Output: one total per case, on its own line.
- Constraints: t at most 10, n at most 100,000, each price at most a billion.
- Plan: repeat per case; reset total; read and add n prices; print that case's answer.

Constraints justify the total type and the amount of work. Samples demonstrate
format; they do not replace the general contract.

---

## Trace two independent cases

Input:

```text
2
3 12 7 5
2 10 20
```

Expected output:

```text
24
30
```

```cpp
#include <iostream>
int main() {
    int t = 0;
    std::cin >> t;
    for (int caseIndex = 0; caseIndex < t; caseIndex = caseIndex + 1) {
        int n = 0;
        std::cin >> n;
        long long total = 0;
        for (int i = 0; i < n; i = i + 1) {
            long long price = 0;
            std::cin >> price;
            total = total + price;
        }
        std::cout << total << '\n';
    }
    return 0;
}
```

The total belongs inside the outer loop and outside the inner loop: fresh per case,
persistent across prices in that case. Putting it outside both loops would make
the second result include the first case's purchases. Indentation shows this lifetime.

---

## Test the contract's edges

Use n=0 if permitted: the total must be zero. Use one value: it must survive unchanged.
Use unequal prices so accidental reuse is visible. Use maximum values to test the
range reasoning. Use two cases to expose failure to reset.

A test that happens to pass gives evidence for that input. The invariant explains
why all valid sequences are handled. Both have a role.

| Symptom | Likely cause | Discriminating input |
|---|---|---|
| One extra read or printed value | wrong loop endpoint | n=0 or n=1 |
| Total equals only the last price | total reset inside inner loop | 3 unequal prices |
| Second case includes first | reset outside case loop | two cases |
| Program never progresses | update/read skipped | trace the repeated state |
| Multiple category outputs | separate ifs or switch fallthrough | one overlapping case |

---

## Practice

These five local tasks bridge towards judge problems without requiring a new
interface. Choose one core task and one that targets your weakest mechanism.
Allow 20–40 minutes per independent attempt; reveal one hint when your next step
is unclear. Test a trace before revealing a complete solution.

All tasks use only Days 1–3. No arrays, user-defined functions, or future library
tools are required. Keep Task 4 for delayed reconstruction.

---

## Problem 1 — one ticket price

Read age in 0–120. Print 50 below age 12, 100 from 12 through 59, and 70 at 60
or above. Samples: 11 → 50, 12 → 100, 60 → 70.
Guided warm-up: list the boundary cases before writing a branch chain.

---

## Ticket hints

1. The categories are exclusive.
2. Test the smallest range first, then the middle upper bound.
3. Use if, else if, else; only one output should execute.

---

## Ticket solution

```cpp
#include <iostream>
int main() {
    int age = 0;
    std::cin >> age;
    if (age < 12) {
        std::cout << 50 << '\n';
    } else if (age < 60) {
        std::cout << 100 << '\n';
    } else {
        std::cout << 70 << '\n';
    }
    return 0;
}
```

The first branch covers ages below 12. Reaching the second establishes age at
least 12; its condition restricts that to below 60. The remainder is 60 or above.
At most two comparisons select one output. Storage is one age integer.
Test 0, 11, 12, 59, 60 and 120.

---

## Problem 2 — count positive readings

Read n in 0–100,000, then n integers in -1,000,000,000 to 1,000,000,000.
Print how many are strictly greater than zero. Sample `5 -2 0 7 4 -1` → `2`.
Core application: choose what to accumulate; do not sum the reading values.

---

## Reading hints

1. Keep a counter initially zero.
2. Each value contributes either one to the count or nothing.
3. After reading a value, increment the count only if value > 0.

---

## Reading solution

```cpp
#include <iostream>
int main() {
    int n = 0;
    std::cin >> n;
    int positive = 0;
    for (int i = 0; i < n; i = i + 1) {
        long long value = 0;
        std::cin >> value;
        if (value > 0) {
            positive = positive + 1;
        }
    }
    std::cout << positive << '\n';
    return 0;
}
```

After each read, positive equals the number of positive readings seen so far.
A positive value increases it by one; any other value leaves it unchanged.
After n reads, that invariant is the answer. Count is at most n, so int suffices
on the established contest environment. There are n reads and n sign comparisons,
at most n counter additions, and a fixed number of stored variables.
Test n=0, all zero, all negative and all positive.

---

## Problem 3 — a rectangle whose size arrives at run time

Read rows and columns, each in 1–20. Print that many rows of stars with exactly
columns stars per row. Sample `2 3` yields two lines containing `***`.
Changed constraint: sizes are inputs, not constants embedded in the source.

---

## Rectangle hints

1. One loop chooses a row; another prints all its stars.
2. Restart the column counter for every row.
3. The newline belongs after the inner loop but inside the outer loop.

---

## Rectangle solution

```cpp
#include <iostream>
int main() {
    int rows = 0;
    int columns = 0;
    std::cin >> rows >> columns;
    for (int row = 0; row < rows; row = row + 1) {
        for (int col = 0; col < columns; col = col + 1) {
            std::cout << '*';
        }
        std::cout << '\n';
    }
    return 0;
}
```

Every inner run prints exactly columns stars. Each of the rows outer executions
adds one such run and one newline. Thus there are rows × columns star writes
and rows newline writes. The counters and dimensions occupy fixed storage;
the program does not store the rectangle. Test 1×1, 1×20 and 20×1.

---

## Problem 4 — recover independent totals

After a break, read t in 1–10. For each case, read n in 0–100,000, then n prices
in 0–1,000,000,000. Print one total per case. Build from a blank file.
Test `2 0 2 10 20`: the two answers must be 0 and 30.

---

## Independent-total hints

1. Identify which state should survive one price but not the next case.
2. Place total inside the case loop and outside the price loop.
3. Print only after the price loop ends, then let the next case create a fresh total.

---

## Independent-total solution

```cpp
#include <iostream>
int main() {
    int t = 0;
    std::cin >> t;
    for (int c = 0; c < t; c = c + 1) {
        int n = 0;
        std::cin >> n;
        long long total = 0;
        for (int i = 0; i < n; i = i + 1) {
            long long price = 0;
            std::cin >> price;
            total = total + price;
        }
        std::cout << total << '\n';
    }
    return 0;
}
```

The sum invariant applies separately to each case because total starts at zero
each time. Maximum per-case sum is 100,000,000,000,000, within the chosen range.
If the case sizes are 3, 0 and 5, there are eight price reads and additions,
not three times the largest size. General work follows the sum of case sizes
plus per-case overhead. Only a fixed number of current values and counters are stored.

---

## Problem 5 — count digits without losing zero

Read one integer from 0 to 1,000,000,000,000,000,000. Print how many decimal digits
its usual notation has. Samples: 0 → 1, 507 → 3, 1000 → 4.
Optional stretch: identify the boundary before choosing a loop form.

---

## Digit hints

1. Integer division by ten removes the last decimal digit of a nonnegative integer.
2. A pre-checked loop can perform zero steps on input zero, but the answer is one.
3. Use do-while so one digit is counted before checking whether more remain.

---

## Digit solution

```cpp
#include <iostream>
int main() {
    long long value = 0;
    std::cin >> value;
    int digits = 0;
    do {
        digits = digits + 1;
        value = value / 10;
    } while (value != 0);
    std::cout << digits << '\n';
    return 0;
}
```

For positive input, each division removes exactly one final digit until no digits
remain. The counter records those removals. For zero, the single required execution
handles its one-character notation. If the answer is d digits, there are d divisions
and increments, at most 19 for the stated range. Storage is one wide input and one
counter. Test 0, 9, 10, 99, 100 and the maximum permitted value.

---

## A readiness check, not a rating

Can you translate a small statement, name the boundaries, trace it, implement it,
and explain a bug after a delay? That is the foundation a judge platform will use.
You do not need a contest rating or a daily problem streak to prove today's work.

Keep two recall cues: “What fact remains true after each update?” and “Which inputs
make this loop run zero, one, or one extra time?” Reconstruct the positive-reading
task later, then change it to count readings in the inclusive range 10–20.
The changed condition is `value >= 10 && value <= 20`; the count invariant is the
same, with a different qualifying rule.

Use the 15–20-minute ordinary review cap and record assistance honestly.
If the loop itself remains uncertain, repair it before adding arrays or recursion.

---

## Cheat sheet

| Need | Pattern |
|---|---|
| Exclusive alternatives | if / else if / else |
| Both conditions | `&&`; left false skips right |
| At least one condition | `||`; left true skips right |
| Negation | `!` |
| Exact code choices | switch; break prevents unintended fallthrough |
| One selected value | `condition ? yes_value : no_value` |
| n repetitions | start 0, condition < n, increment once |
| Unknown repetitions | while with a guaranteed progress step |
| At least one execution | do-while |
| Skip / stop | continue / break, with different update consequences |

---

## Tomorrow

Day 4 gives a name to a repeated subtask by writing a function, and explains
where variables live when one function calls another. Today, every complete
solution remains inside main so you can see the whole path.

Before then, solve one local task from its statement with the solution closed.
That independent attempt is the useful next milestone.

---

```finalquiz
{
  "title": "Day 3: Decisions and repetition",
  "questions": [
    {
      "id": "q1",
      "type": "single_correct",
      "prompt": "A ticket chain tests age < 12, else if age < 60, else. Which price branch handles age 12?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "The child branch"
        },
        {
          "id": "b",
          "text": "The final branch"
        },
        {
          "id": "c",
          "text": "The middle branch"
        },
        {
          "id": "d",
          "text": "Both the child and middle branches"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "The first condition is false at 12; the middle is true. The exclusive chain selects one branch.",
      "example": "Boundary values reveal < versus <= mistakes."
    },
    {
      "id": "q2",
      "type": "multiple_correct",
      "prompt": "Which conditions mean age is from 12 through 59?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "age >= 12 && age < 60"
        },
        {
          "id": "b",
          "text": "12 <= age < 60"
        },
        {
          "id": "c",
          "text": "age > 12 || age < 60"
        },
        {
          "id": "d",
          "text": "!(age < 12 || age >= 60)"
        }
      ],
      "correctOptionIds": [
        "a",
        "d"
      ],
      "explanation": "The conjunction requires both bounds. Negating the outside ranges gives the same interval. A chained comparison does not have mathematical chaining semantics, and the disjunction admits too much.",
      "example": "Try ages 11, 12, 59 and 60."
    },
    {
      "id": "q3",
      "type": "single_correct",
      "prompt": "Why place b != 0 before a % b == 0 with &&?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "It changes b to 1."
        },
        {
          "id": "b",
          "text": "A failed left guard skips the invalid right calculation."
        },
        {
          "id": "c",
          "text": "It makes division floating-point."
        },
        {
          "id": "d",
          "text": "The right side always runs first."
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "Built-in && evaluates left first and skips right if left is false. It does not change operands or their types.",
      "example": "For b=0, no remainder is evaluated."
    },
    {
      "id": "q4",
      "type": "single_correct",
      "prompt": "What can missing break do in the demonstrated switch?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Make every unmatched label match"
        },
        {
          "id": "b",
          "text": "Prevent compilation in every case"
        },
        {
          "id": "c",
          "text": "Exit main automatically"
        },
        {
          "id": "d",
          "text": "Continue executing statements after subsequent case labels"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "A selected case is an entry point. Without an exit, execution can fall through. This can be intentional, but prints extra choices in the vending example.",
      "example": "Case labels do not automatically stop execution."
    },
    {
      "id": "q5",
      "type": "single_correct",
      "prompt": "For n=0, how many times does for(int i=0; i<n; i=i+1) execute its body?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Zero"
        },
        {
          "id": "b",
          "text": "One"
        },
        {
          "id": "c",
          "text": "n+1"
        },
        {
          "id": "d",
          "text": "It necessarily loops forever"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "The condition fails before the first body execution. No update is needed to leave.",
      "example": "A zero-item sum stays at its initial zero."
    },
    {
      "id": "q6",
      "type": "multiple_correct",
      "prompt": "Which statements about loop control are true?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Continue exits every enclosing loop."
        },
        {
          "id": "b",
          "text": "For-loop continue still reaches its update clause."
        },
        {
          "id": "c",
          "text": "Break exits the nearest enclosing loop or switch."
        },
        {
          "id": "d",
          "text": "Do-while checks before its first execution."
        }
      ],
      "correctOptionIds": [
        "b",
        "c"
      ],
      "explanation": "Continue skips the remaining body; for's separate update still runs. Break exits the nearest relevant construct. Do-while enters once before checking.",
      "example": "A while-body update can be bypassed by continue."
    },
    {
      "id": "q7",
      "type": "single_correct",
      "prompt": "Where should a sum of one case's n values be initialized in nested case/value loops?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Inside the value loop"
        },
        {
          "id": "b",
          "text": "After the value loop"
        },
        {
          "id": "c",
          "text": "Inside the case loop, before the value loop"
        },
        {
          "id": "d",
          "text": "Outside both loops so all cases share it"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "The sum must persist across one case's values and reset between cases. The other positions erase progress, initialize too late, or mix cases.",
      "example": "Cases totaling 24 and 30 must print 24 then 30, not 24 then 54."
    },
    {
      "id": "q8",
      "type": "single_correct",
      "prompt": "An outer loop runs 4 times and its inner loop runs 3 times per outer iteration. How many inner-body executions occur?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "7"
        },
        {
          "id": "b",
          "text": "3"
        },
        {
          "id": "c",
          "text": "4"
        },
        {
          "id": "d",
          "text": "12"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "Every outer iteration repeats all three inner steps: four groups of three.",
      "example": "Also count any outer-only work separately."
    },
    {
      "id": "q9",
      "type": "multiple_correct",
      "prompt": "Which actions support a correctness argument for summing inputs?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "State that total equals the sum read so far."
        },
        {
          "id": "b",
          "text": "Show it starts true for zero inputs."
        },
        {
          "id": "c",
          "text": "Only report that the sample passed."
        },
        {
          "id": "d",
          "text": "Show each update preserves it and the final state answers the task."
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "d"
      ],
      "explanation": "Initialization, preservation and completion connect all valid iterations to the answer. A sample is useful evidence but not the whole argument.",
      "example": "The empty sum is zero; adding the next value extends the sum by exactly that value."
    },
    {
      "id": "q10",
      "type": "single_correct",
      "prompt": "Which boundary tests are useful for digit counting and repetition?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Only the largest random input"
        },
        {
          "id": "b",
          "text": "Zero when permitted, a one-step case, and a change-of-digit boundary"
        },
        {
          "id": "c",
          "text": "Only inputs with equal digits"
        },
        {
          "id": "d",
          "text": "No tests once compilation succeeds"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "Zero probes entry behavior; one-step cases probe endpoints; 9 to 10 changes the number of divisions. Compilation cannot establish this logic.",
      "example": "Digit counts: 0 → 1, 9 → 1, 10 → 2."
    }
  ]
}
```
