# Day 2: Data types, integer overflow & precision

**Duration: ~4 hours across sessions | Focus: choose the type of the calculation, not just the answer slot**

---

## Why this day exists

Yesterday our calculator worked with small prices.

A shop can sell many items.
A game can count billions of points.
The same calculation should still mean the same thing.

But a program has limited space for each number.

An answer can go wrong even when every input looks reasonable.
It can also lose the fractional part before you print it.

We need to notice where the value changes,
and choose how it is represented before that happens.

---

## Before you reveal: two small recalls

Without opening Day 1, write a complete program that reads two small integers
and prints their product. What command rebuilds it after an edit?

Then predict the difference between printing `"a * b"` and printing `a * b`.
If you cannot reconstruct the program, use the next screen as a worked repair,
close it, and retry with addition.

---

## Repair the workflow before changing the numbers

```cpp
#include <iostream>
int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    std::cout << a * b << '\n';
    return 0;
}
```

Compile with `g++ -std=c++17 -Wall -Wextra main.cpp -o main`, then run `./main`
(on Windows, use the executable command established in Day 1).
Quoted text prints literally; an unquoted arithmetic expression is calculated.

For input `12 3`, expect 36. Now consider `1000000000 4`. Both input values
fit a typical 32-bit `int`. Their product, 4,000,000,000, does not.
Do not treat whatever this overflowing program prints as a mathematical rule.

---

## A type is a storage and operations contract

Picture numbered lockers. A small locker can hold only a limited set of values;
writing a large locker number on the receipt does not enlarge the original locker.

A **type** describes what values a variable can represent and how operations on
those values behave. The type is chosen when the variable is declared.

| Type | Intended use | Example declaration |
|---|---|---|
| `int` | whole numbers in a bounded range | `int count = 12;` |
| `long long` | a wider whole-number range | `long long total = 0;` |
| `char` | one encoded character | `char grade = 'A';` |
| `bool` | false or true | `bool ready = true;` |
| `double` | approximate fractional numbers | `double price = 12.5;` |

These declarations introduce no branching. A boolean is a stored yes/no value;
Day 3 teaches how to choose different actions using it.

---

## How much room is there?

A **bit** has two states. With 32 bits there are 2 multiplied by itself 32 times,
or 4,294,967,296 possible bit patterns. A typical signed 32-bit integer uses half
its range for negative values and represents:

```text
-2,147,483,648 through 2,147,483,647
```

On typical contest systems, `long long` is 64 bits, with a positive maximum of
9,223,372,036,854,775,807. The shorthand “about 2e9” means about two billion;
“9e18” means about nine quintillion. These are approximate reminders, not exact bounds.

C++ does not promise that every `int` is 32 bits. It guarantees at least a
minimum range; `long long` has at least 64 bits. Check the actual environment
when a boundary matters rather than treating a common implementation as universal.

---

## Ask the environment rather than guessing

```cpp
#include <iostream>
#include <limits>
int main() {
    std::cout << sizeof(int) << '\n';
    std::cout << std::numeric_limits<int>::lowest() << ' '
              << std::numeric_limits<int>::max() << '\n';
    std::cout << sizeof(long long) << '\n';
    std::cout << std::numeric_limits<long long>::max() << '\n';
    return 0;
}
```

`sizeof(type)` gives storage in **bytes**, not the largest value. On common
machines a byte has eight bits; `sizeof(char)` is always one byte in C++.
A four-byte result does not mean the largest integer is four.

`<limits>` supplies properties of numeric types. In `numeric_limits<int>`,
the angle-bracket part selects the type whose properties we want.
`::max()` asks for its largest finite value; `::lowest()` asks for its lowest.
We are using this existing library tool, not designing the angle-bracket mechanism.

---

```quiz
{"prompt":"A machine reports `sizeof(int) == 4`. What does that measurement describe?","options":[{"text":"The largest integer is 4.","correct":false},{"text":"An int stores exactly four decimal digits.","correct":false},{"text":"The storage occupied by an int is four bytes.","correct":true},{"text":"Every multiplication of two ints is safe.","correct":false}],"explanation":"sizeof measures storage, not a decimal range or arithmetic safety. numeric_limits supplies the actual value bounds. Two individually valid inputs can have an out-of-range product."}
```

---

## Inspect the calculation before the destination

A tempting repair is:

```cpp
long long total = a * b;
```

This is a fragment inside `main`, after declaring `a` and `b` as `int`.
The destination is wide, but the multiplication still uses the operand types.
Two `int` operands normally produce an `int` calculation.

```text
int a, int b → int multiplication → convert result → long long total
                    ↑ too late if this overflows
```

**Signed integer overflow is undefined behavior**: the C++ language does not
provide a reliable result for that execution. Seeing a negative answer once does
not establish a guaranteed wraparound rule. Compiler optimizations can make the
consequences different from what a simple bit picture suggests.

---

## Widen before multiplying

```cpp
#include <iostream>
int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    long long total = static_cast<long long>(a) * b;
    std::cout << total << '\n';
    return 0;
}
```

`static_cast<long long>(a)` produces a `long long` value equal to `a`.
It does not change the declared type of `a`. Multiplication now has a wide
operand, so the other operand is converted to that wider signed type too.

For today's input, the multiplication can represent 4,000,000,000.
The destination then stores that valid result.

You will also see `1LL * a * b`: `1LL` is the integer literal one with type
`long long`. Because multiplication groups left to right, widening happens
before `a * b`. In contrast, `a * b * 1LL` may widen too late.
The older spelling `(long long)a * b` performs the intended widening here,
but the explicit `static_cast` makes the conversion clearer.

---

## Calculate a bound, not a feeling

Suppose up to 100,000 purchases each cost at most 1,000,000,000 units.
The total can reach:

```text
100,000 × 1,000,000,000 = 100,000,000,000,000
```

That is much larger than a typical `int` maximum, but within a 64-bit signed range.
We have not learned to store a list of purchases yet; this is reasoning about a
future total, not a reason to introduce a container now.

A 64-bit type is still finite. Multiplying two values near its maximum can also
overflow. For every intermediate expression, estimate the largest magnitude it
can produce. The final answer being small does not make every intermediate safe.

Pause here. Rebuild the wide-product program without looking; test `0 9`,
`1000000000 4`, and `1000000000 1000000000`.

---

```quiz
{"prompt":"With int operands a and b, which expression widens before their potentially large multiplication?","options":[{"text":"`static_cast<long long>(a) * b`","correct":true},{"text":"`static_cast<long long>(a * b)`","correct":false},{"text":"`a * b * 1LL`","correct":false},{"text":"Assigning `a * b` to long long always suffices.","correct":false}],"explanation":"Converting an operand changes the multiplication's type before it happens. Converting the product or multiplying it by 1LL afterward cannot repair an earlier overflowing int operation. A wide destination alone also acts too late."}
```

---

## Unsigned arithmetic has a different contract

`unsigned int` stores nonnegative integers. For a 32-bit unsigned type, its
range is 0 through 4,294,967,295. Its arithmetic is defined modulo one more than
its maximum: reaching the end cycles through zero.

```cpp
#include <iostream>
#include <limits>
int main() {
    unsigned int value = std::numeric_limits<unsigned int>::max();
    std::cout << value + 1u << '\n';
    return 0;
}
```

This prints 0. The suffix `u` makes the literal unsigned. This wrapping behavior
is a property of unsigned arithmetic; it must not be transferred to signed overflow.
Unsigned also does not reject accidental negative calculations. Subtracting one
from unsigned zero yields a large value, not an error message.

---

## Comparison can convert a value too

`<`, `>`, `<=`, `>=`, `==` and `!=` produce a boolean: less, greater,
at most, at least, equal, and unequal. `==` compares; `=` assigns.

```cpp
#include <iostream>
int main() {
    int debt = -1;
    unsigned int limit = 1u;
    bool result = debt < limit;
    std::cout << result << '\n';
    return 0;
}
```

For these matching-rank signed and unsigned types, the comparison converts
`debt` to `unsigned int`. Negative one becomes the unsigned maximum, so the
comparison is false and the default boolean output is 0. True prints as 1.

The expression is not comparing the two mathematical integers as you probably
intended. Prefer consistent signed types for ordinary counts and arithmetic
unless an unsigned contract is useful. Conversion to a signed type is safe only
after establishing that the unsigned value fits that signed type.

---

## Characters and flags are not tiny general-purpose numbers

```cpp
#include <iostream>
int main() {
    char grade = 'A';
    bool passed = true;
    std::cout << grade << ' ' << passed << '\n';
    return 0;
}
```

This prints `A 1`. A character is represented by an encoding number internally,
but output treats a `char` as a character. The encoding and whether plain `char`
is signed are implementation details you should not assume for numeric bounds.

A `bool` represents false or true; converting zero to it produces false and
converting a nonzero number produces true. It is not a replacement for a count.
Storing 12 as a boolean loses the distinction between 12 and any other nonzero count.

---

```quiz
{"prompt":"Why can comparing int -1 with unsigned int 1 produce false for 'less than'?","options":[{"text":"C++ considers -1 mathematically greater than 1.","correct":false},{"text":"Unsigned integers cannot appear in comparisons.","correct":false},{"text":"A boolean cannot represent false.","correct":false},{"text":"The signed operand is converted to unsigned for this comparison.","correct":true}],"explanation":"The usual conversions for this pair change -1 to the unsigned maximum before comparison. This is a type-conversion issue, not a new mathematical ordering. Booleans represent both true and false."}
```

---

## Seven shared between two people

Before running code, predict both results:

```cpp
double first = 7 / 2;
double second = 7.0 / 2;
```

These are declaration fragments inside `main`. Which calculation keeps the half?
Write the type of each operand before deciding.

---

## Integer division discards the fraction first

With two integer operands, `7 / 2` is integer division and produces 3.
Assigning that 3 to `double` produces 3.0; the missing half does not reappear.

With `7.0 / 2`, a floating operand makes this floating-point division, giving 3.5.

Integer division truncates toward zero: `-7 / 2` is -3, not -4.
The **remainder** operator `%` supplies what is left after integer division:
`7 % 2` is 1 because `7 = 3 * 2 + 1`.
For a negative dividend, `-7 % 2` is -1.

A divisor of zero is not valid for these integer operations. Also, the minimum
signed value divided by -1 cannot fit its type and is another invalid boundary.
Our exercises avoid both; Day 3 teaches guards for ordinary zero divisors.

---

## Decimal-looking numbers use a binary representation

Imagine allowing only halves, quarters, eighths and so on. You can represent
one half exactly, but one tenth needs an unending expansion in these fractions.
Typical `float` and `double` store a finite approximation.

Typical `float` offers about 6–9 significant decimal digits, and `double`
about 15–17, depending on the exact guarantee being discussed. Significant digits
count across the whole number, not “digits after the decimal point.”
Prefer `double` for ordinary fractional calculations in this course.

```cpp
#include <iostream>
#include <iomanip>
int main() {
    double sum = 0.1 + 0.2;
    std::cout << std::setprecision(17) << sum << '\n';
    std::cout << (sum == 0.3) << '\n';
    return 0;
}
```

`<iomanip>` supplies output-format controls. `setprecision(17)` requests 17
significant digits in the default format; it does not improve stored accuracy.
On ordinary binary64 implementations, this shows about 0.30000000000000004 and
the equality comparison prints 0.

---

## Make “close enough” mean something

For a length measured to a millionth of a metre, a difference below that
measurement tolerance may be irrelevant:

```cpp
#include <iostream>
#include <cmath>
int main() {
    double measured = 0.1 + 0.2;
    double expected = 0.3;
    double tolerance = 0.000001;
    bool close = std::abs(measured - expected) <= tolerance;
    std::cout << close << '\n';
    return 0;
}
```

`<cmath>` supplies numeric functions. `std::abs` gives the magnitude, so both
a small positive difference and a small negative difference can count as close.
The boolean is true when the error magnitude is at most the chosen tolerance.

This **absolute tolerance** is appropriate only if the units and scale justify it.
For values near a billion, relative error may matter more; near zero, a purely
relative rule can be unhelpful. There is no universal epsilon to paste everywhere.
Exact equality is still appropriate for values deliberately assigned the same
exact representable quantity. The rule is not “never use == on doubles.”

---

```quiz
{"prompt":"What is the value of `double average = 7 / 2;`?","options":[{"text":"3.5, because the destination is double.","correct":false},{"text":"3.0, because integer division happened first.","correct":true},{"text":"4.0, because division always rounds up.","correct":false},{"text":"It cannot compile because the types differ.","correct":false}],"explanation":"Both operands are ints, so division produces 3 before conversion to double. Use 7.0 / 2 or widen an operand to double to preserve the fractional result. Conversion is allowed but cannot recover discarded information."}
```

---

## Choose exact units when the problem allows them

If a bill is defined in whole cents, represent 12.35 as 1,235 cents.
Adding 1,235 and 265 then gives exactly 1,500 cents using integers, provided
the sum fits the type. This avoids unnecessary approximation.

Not every financial calculation is solved by choosing cents: interest, percentages
and rounding rules require an explicit contract. For today's exact addition,
whole cents are sufficient.

`std::fixed << std::setprecision(2)` displays two digits after the decimal point.
It changes presentation, not the underlying stored number. Printing a rounded
answer is not the same as storing an exact value.

---

## Failure map before the independent work

| Symptom | Likely cause | Repair |
|---|---|---|
| Large product fails, small product works | intermediate int overflow | widen an operand before multiplying |
| Fraction disappears | integer division happened first | convert an operand to double |
| -1 compares strangely with a count | mixed signedness | choose consistent types after range checks |
| Printed decimals look unequal | finite binary approximation | inspect precision; use justified tolerance |
| A boolean count prints 1 | quantity stored as yes/no | use an integer count |
| More printed digits do not fix accuracy | formatting confused with representation | choose arithmetic/representation first |

Try describing one row with your own concrete input. That is stronger than
remembering the table's wording.

---

## Practice

Choose Tasks 1 and 2 first, then one variation. Tasks are local programs using
Days 1–2 only. Allow roughly 15–30 minutes per attempt and take one hint when
you cannot identify a next action. Keep the delayed task for a later session.

For each task, state the largest intermediate value before writing the program.
Each solution below is a separate complete program, not a fragment to concatenate.

---

## Problem 1 — a large rectangular area

Read integer side lengths `a` and `b`, each from 0 to 1,000,000,000.
Print the exact whole-number area. Sample: `1000000000 4` → `4000000000`.
Prerequisites: input, multiplication, wide signed arithmetic. Guided warm-up.

---

## Area hints

1. The maximum product is 1,000,000,000,000,000,000.
2. Both the calculation and storage must support that bound.
3. Read both inputs as `long long`; then multiplication already has wide operands.

---

## Area solution

```cpp
#include <iostream>
int main() {
    long long a = 0;
    long long b = 0;
    std::cin >> a >> b;
    std::cout << a * b << '\n';
    return 0;
}
```

The two stored sides are exactly the inputs. Their product is the definition of
area here and fits a signed type with at least 64 bits. Test zero, the sample
and the maximum pair. Work is two reads, one multiplication and one write;
storage is two wide integers. No loop or data structure is needed.

---

## Problem 2 — preserve the half

Read two integers from 0 to 1,000,000. Print their arithmetic mean with two digits
after the decimal point. Sample: `7 8` → `7.50`.
Prerequisites: addition, floating division, output formatting. Core application.

---

## Mean hints

1. Add the two values and divide the sum by two.
2. An integer sum divided by integer two loses a half.
3. Use `(a + b) / 2.0`, then fixed output with precision two.

---

## Mean solution

```cpp
#include <iostream>
#include <iomanip>
int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    double mean = (a + b) / 2.0;
    std::cout << std::fixed << std::setprecision(2) << mean << '\n';
    return 0;
}
```

The sum is at most 2,000,000, so it fits the usual contest int environment established
earlier. Division has a double operand. For integer pairs, the mean is an integer
or half-integer, exactly representable at this scale in ordinary binary64.
Test `0 1` → `0.50` and `8 8` → `8.00`.
Work: two reads, one addition, one division, one output; storage: two ints and a double.

---

## Problem 3 — exact money, exact units

Read two nonnegative integer amounts in cents, each at most 1,000,000,000,000.
Print their total **in cents**, with no currency symbol or decimal conversion.
Sample: `1235 265` → `1500`. Changed constraint: inputs exceed int range.

---

## Money hints

1. The inputs are already exact smallest units; do not divide by 100.
2. The largest total is 2,000,000,000,000.
3. Use `long long` for both values and add them directly.

---

## Money solution

```cpp
#include <iostream>
int main() {
    long long first = 0;
    long long second = 0;
    std::cin >> first >> second;
    std::cout << first + second << '\n';
    return 0;
}
```

The specified output unit is cents. Integer addition preserves that unit and is
exact within the established bound. Test `0 1` → `1` and both maximum inputs.
Work is two reads and one addition before output; storage is two wide integers.
Using floating point would add approximation without solving a need in this task.

---

## Problem 4 — rebuild the safe multiplication

Later, from a blank file, read two `int` values in 0–1,000,000,000 and print
their product safely. Keep the input variables as `int` this time.
Explain why a `long long` destination by itself is insufficient.
Prerequisites: explicit widening. Delayed reconstruction, about 15 minutes.

---

## Safe-product hints

1. Think about the operands at the instant multiplication occurs.
2. Widen one input value without changing the original variable's declared type.
3. Use `static_cast<long long>(a) * b`.

---

## Safe-product solution

```cpp
#include <iostream>
int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    long long product = static_cast<long long>(a) * b;
    std::cout << product << '\n';
    return 0;
}
```

The conversion precedes multiplication, so the operation can represent every
product up to 10 to the power 18. The extra destination stores that valid result.
There are two reads, one widening, one multiplication and one write, with three
named numeric variables. Test the maximum pair and explain each step without notes.

---

## Problem 5 — divide a duration

Read an integer duration `seconds` from 0 to 1,000,000,000.
Print complete minutes and remaining seconds, separated by a space.
Input `125` → `2 5`; input `59` → `0 59`.
Prerequisites: integer division and remainder. Optional transfer, 20–30 minutes.

---

## Duration hints

1. A complete minute contains 60 seconds.
2. The quotient counts complete groups; the remainder gives the leftover.
3. Calculate `seconds / 60` and `seconds % 60`.

---

## Duration solution

```cpp
#include <iostream>
int main() {
    long long seconds = 0;
    std::cin >> seconds;
    std::cout << seconds / 60 << ' ' << seconds % 60 << '\n';
    return 0;
}
```

For nonnegative input, integer division gives the number of full groups of 60.
The remainder is between 0 and 59 and satisfies
`seconds = minutes * 60 + remainder`. Test 0, 59, 60 and 61.
Work: one read, one division, one remainder operation and output; storage:
one named input integer plus temporary expression values.

---

## Recall and a changed task

Keep two durable cues: “Where must widening occur?” and “What information is
lost by integer division?” In a later session, explain both and reconstruct one
example from a blank file.

Then change the area problem into a perimeter problem, `2 * (a + b)`, for the
same large side bounds. State the intermediate bounds and choose types before
running. The answer is not “always use the largest type”; it is “justify the range.”

Review within the course's 15–20-minute daily cap. Record whether you used a hint,
reconstructed independently, or transferred after a delay. Reading this screen
does not award any of those outcomes.

---

## Cheat sheet

| Question | Decision |
|---|---|
| Can any intermediate exceed the type's maximum? | Bound it; widen before the operation |
| Need exact whole units? | Use an integer type with enough range |
| Need a fraction? | Make division floating before it happens |
| Need approximate equality? | Choose tolerance from units, scale and purpose |
| Need actual implementation limits? | `sizeof`, `numeric_limits<T>::lowest()/max()` |
| Need whole groups and leftovers? | Integer `/` and `%`, with valid divisor |
| Printing hides small error? | `setprecision` reveals more; it does not repair arithmetic |

---

## Tomorrow

A bill may charge different prices for different ages. A program may need to
read an unknown number of purchases. Day 3 teaches decisions and repetition.

Bring today's habit with you: test boundary values and know the type of every
intermediate calculation. A loop can repeat an arithmetic mistake many times.

---

```finalquiz
{
  "title": "Day 2: Representation and arithmetic",
  "questions": [
    {
      "id": "q1",
      "type": "single_correct",
      "prompt": "For int operands a and b, which repair prevents an overflowing int product before storing it?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Assign a * b to long long"
        },
        {
          "id": "b",
          "text": "Cast a * b after multiplication"
        },
        {
          "id": "c",
          "text": "Multiply a * b by 1LL afterward"
        },
        {
          "id": "d",
          "text": "Convert a to long long before multiplying by b"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "The operands determine the operation's type. All other repairs can act after the unsafe int multiplication.",
      "example": "Use static_cast<long long>(a) * b."
    },
    {
      "id": "q2",
      "type": "multiple_correct",
      "prompt": "Which facts describe the type contract?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "sizeof measures bytes."
        },
        {
          "id": "b",
          "text": "An int is exactly 32 bits on every C++ implementation."
        },
        {
          "id": "c",
          "text": "numeric_limits can report bounds."
        },
        {
          "id": "d",
          "text": "long long has an unlimited range."
        }
      ],
      "correctOptionIds": [
        "a",
        "c"
      ],
      "explanation": "Storage and bounds can be inspected. Typical widths are not universal promises, and long long remains finite.",
      "example": "A wide type can still overflow."
    },
    {
      "id": "q3",
      "type": "single_correct",
      "prompt": "What does signed integer overflow guarantee?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "A negative result"
        },
        {
          "id": "b",
          "text": "No reliable result under the language rules"
        },
        {
          "id": "c",
          "text": "Modulo wrapping exactly like unsigned"
        },
        {
          "id": "d",
          "text": "An automatic exception"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "Signed overflow is undefined behavior. None of the specific runtime outcomes is guaranteed.",
      "example": "A result observed in one build is not a contract."
    },
    {
      "id": "q4",
      "type": "single_correct",
      "prompt": "Which expression gives 3.5?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "7 / 2"
        },
        {
          "id": "b",
          "text": "double(7 / 2)"
        },
        {
          "id": "c",
          "text": "7.0 / 2"
        },
        {
          "id": "d",
          "text": "7 % 2"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "A floating operand changes division before it occurs. Converting an integer quotient later preserves 3, while remainder gives 1.",
      "example": "Widen the input to the operation, not its already truncated output."
    },
    {
      "id": "q5",
      "type": "multiple_correct",
      "prompt": "Which statements about floating-point are justified?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Formatting with more digits improves the stored result."
        },
        {
          "id": "b",
          "text": "0.1 can be approximate in binary."
        },
        {
          "id": "c",
          "text": "A tolerance should reflect the task's scale and units."
        },
        {
          "id": "d",
          "text": "Exact equality is always forbidden."
        }
      ],
      "correctOptionIds": [
        "b",
        "c"
      ],
      "explanation": "Finite binary representation can approximate decimal values. Tolerance is task-dependent; formatting does not alter stored accuracy and exact comparisons have legitimate uses.",
      "example": "Display precision and arithmetic precision solve different problems."
    },
    {
      "id": "q6",
      "type": "single_correct",
      "prompt": "What are -7 / 2 and -7 % 2?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "-3 and -1"
        },
        {
          "id": "b",
          "text": "-4 and 1"
        },
        {
          "id": "c",
          "text": "-3 and 1"
        },
        {
          "id": "d",
          "text": "-4 and -1"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "Integer division truncates toward zero. The remainder satisfies -7 = (-3)*2 + (-1).",
      "example": "Check quotient * divisor + remainder."
    },
    {
      "id": "q7",
      "type": "single_correct",
      "prompt": "Why can int -1 < unsigned int 1 be false?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "The computer reversed the comparison symbol."
        },
        {
          "id": "b",
          "text": "Negative input always becomes zero."
        },
        {
          "id": "c",
          "text": "The unsigned type cannot store 1."
        },
        {
          "id": "d",
          "text": "The signed operand converts to a large unsigned value."
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "For these matching-rank types, conversion to unsigned happens before comparison. The mathematical values you intended are not the values compared.",
      "example": "Use consistent types with justified range."
    },
    {
      "id": "q8",
      "type": "multiple_correct",
      "prompt": "Which are valid representation choices for today's tasks?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "bool for a yes/no flag"
        },
        {
          "id": "b",
          "text": "char for one encoded character"
        },
        {
          "id": "c",
          "text": "long long for every conceivable integer without bounds checks"
        },
        {
          "id": "d",
          "text": "Whole cents for exact addition of cent-denominated amounts"
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "d"
      ],
      "explanation": "Flags and characters have specialized meaning. Whole-cent addition is exact within range. No finite integer type handles every conceivable magnitude.",
      "example": "Choose units and bounds together."
    },
    {
      "id": "q9",
      "type": "single_correct",
      "prompt": "The largest two inputs are 1,000,000,000 each. What maximum product must you support?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "2,000,000,000"
        },
        {
          "id": "b",
          "text": "1,000,000,000"
        },
        {
          "id": "c",
          "text": "1,000,000,000,000,000,000"
        },
        {
          "id": "d",
          "text": "An unlimited number"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "Multiplying the two largest nonnegative inputs gives 10 to the power 18. The sum bound is a different operation.",
      "example": "Bound the expression actually evaluated."
    },
    {
      "id": "q10",
      "type": "multiple_correct",
      "prompt": "Which checks would catch numeric mistakes?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Test maximum permitted input."
        },
        {
          "id": "b",
          "text": "Use only small equal inputs."
        },
        {
          "id": "c",
          "text": "Check the types before division or multiplication."
        },
        {
          "id": "d",
          "text": "Compare output with an independently calculated result."
        }
      ],
      "correctOptionIds": [
        "a",
        "c",
        "d"
      ],
      "explanation": "Boundary inputs expose range errors; operand inspection exposes conversion errors; independent arithmetic tests reasoning. Small equal inputs alone can hide mistakes.",
      "example": "Test 0, a typical case and the largest legal case."
    }
  ]
}
```
