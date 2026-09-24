# Day 2: Variables, Constants & Primitive Types

**Duration: 4 hours | Focus: represent quantities honestly and predict every conversion, zero state, and formatted result**

## Why this day exists

Yesterday's program printed text chosen while you wrote it.

Useful programs must remember changing facts: how many hikers arrived, how much water remains, whether a trail is open, and which label a person typed.

Those facts can look similar in the terminal while behaving very differently in a calculation.

The difference appears as soon as a whole-number calculation needs a fractional answer.

Choosing how a value is represented is therefore part of choosing whether the program can be correct.

---

## The obvious calculation works until it does not

The trail desk wants to display how much of today's capacity is used:

```go
package main

import "fmt"

func main() {
	used := 7
	limit := 10
	percent := used / limit * 100
	fmt.Println(percent)
}
```

A person reads seven divided by ten, then multiplied by one hundred, and expects `70`.

Run it. The program prints:

```text
0
```

Nothing is misspelled. The source compiles. The process finishes normally. This is harder than yesterday's `undefined` error because the program did exactly what its value types asked it to do, not what the author meant.

Before reading the explanation, predict these three results:

```go
fmt.Println(7 / 10)
fmt.Println(7 / 10 * 100)
fmt.Println(float64(7 / 10) * 100)
```

Keep the predictions. We will return to them after building the model.

---

## The labelled-box mental model

Picture every variable as a labelled box:

```text
label: used       box shape: int       current contents: 7
      name                   type                         value
```

The **name** lets source code refer to the box.

The **type** defines which values fit and which operations they support. Once a variable has a type, assignment does not silently reshape it into another type.

The **value** is the current contents. Assignment may replace the contents with another compatible value.

In the first attempt, both boxes have shape `int`:

```text
used  -> int box containing 7
limit -> int box containing 10
```

The `/` operation therefore performs integer division. Integer division produces another integer and discards the fractional remainder. `7 / 10` becomes `0`; multiplying that zero by `100` cannot recover the lost fraction.

> An operation follows the types of its operands. Choose a representation that can express the result before the information is lost.

---

## Retrieve yesterday, then predict representation

Closed notes:

1. Draw source, compiler, binary, and process in order.
2. Explain why `undefined: fmt.Printline` prevents a new process from starting.
3. Predict `7 / 10` and `float64(7 / 10)`.

Feedback for the third cue:

```text
7 / 10              -> integer division -> 0
float64(7 / 10)     -> convert that 0    -> 0.0
```

The conversion is not wrong. It happens too late. This timing becomes clear once declaration and assignment are separate in your head.

---

## A name does not exist until it is declared

The long form makes every step visible:

```go
var hikers int
hikers = 6
hikers = 8
fmt.Println(hikers)
```

`var hikers int` is a **declaration**. It introduces the name `hikers` and fixes its type as `int`.

`hikers = 6` is an **assignment**. The `=` operator evaluates the value on the right and stores it in the already-declared box on the left.

`hikers = 8` is another assignment to the same box. The final print is `8`.

In mathematics, `hikers = hikers + 1` looks contradictory. In a program, `=` does not make an eternal equality claim. It means: read the old value, calculate a new value, and store the result back under this name.

---

## The zero value appears before your first assignment

Remove both assignments:

```go
package main

import "fmt"

func main() {
	var hikers int
	fmt.Println(hikers)
}
```

Predict compiler rejection, unpredictable memory, or a stable value. Run it:

```text
0
```

Go gives every declared variable a **zero value** when no initializer supplies one. You never read whatever bytes happened to occupy that memory earlier.

This is a language guarantee, not a coincidence of your machine. It makes a newly declared value deterministic and removes an entire class of uninitialized-memory bugs.

The trade is that zero can be syntactically valid while still being wrong for the problem. A counter can safely start at zero. A `packageSize` of zero would later make division impossible. The compiler guarantees a valid value of the type, not a valid business decision.

---

## Each primitive type has its own zero

Run this complete program:

```go
package main

import "fmt"

func main() {
	var hikers int
	var ratio float64
	var open bool
	var label string

	fmt.Printf("hikers=%d\n", hikers)
	fmt.Printf("ratio=%f\n", ratio)
	fmt.Printf("open=%t\n", open)
	fmt.Printf("label=%q\n", label)
}
```

Output:

```text
hikers=0
ratio=0.000000
open=false
label=""
```

The empty string is written as `""` by `%q` so its emptiness is visible. Without quotes, the line would appear to end after `label=` and you might mistake invisible output for missing output.

These zero values are not four arbitrary defaults. They are the least-surprising starting values for the primitive operations:

- numeric accumulation can begin at zero;
- a boolean claim begins false until made true;
- text begins with zero bytes of content.

Later types follow the same design goal: a well-designed Go type often tries to make its zero value immediately useful.

```quiz
{
  "prompt": "What does `var label string` contain before an explicit assignment?",
  "multiple": false,
  "options": [
    {"text":"An unpredictable text fragment from memory","correct":false},
    {"text":"The empty string `\"\"`","correct":true},
    {"text":"The word `nil`","correct":false},
    {"text":"A compile error until text is assigned","correct":false}
  ],
  "explanation": "Every declared Go value is initialized. The zero value of `string` is the empty string. That is valid language state, though a particular product may still require a nonempty label."
}
```

---

## `:=` combines declaration with the first value

Inside a function, Go provides a compact declaration:

```go
hikers := 6
```

Read `:=` as "declare this local name and infer its type from the expression on the right."

The compiler sees the integer literal `6`, chooses `int` for this local variable, creates the box, and initializes it in one statement.

This is not a shorter spelling for every `=`. After the declaration, update the existing box with assignment:

```go
hikers := 6
hikers = 8
```

If you write `hikers := 8` again in the same scope with no other new name, the compiler reports:

```text
no new variables on left side of :=
```

The compiler is saying, "you used declaration syntax, but there is nothing new to declare here."

Use `var` when the zero state is meaningful or the type must be explicit. Use `:=` for a local value whose initializer makes its type clear. Use `=` when the name already exists.

```quiz
{
  "prompt":"After `hikers := 6`, which statement changes the same variable to 8?",
  "multiple":false,
  "options":[
    {"text":"`hikers := 8` in the same scope","correct":false},
    {"text":"`var hikers = 8` in the same scope","correct":false},
    {"text":"`hikers = 8`","correct":true},
    {"text":"`int hikers = 8`","correct":false}
  ],
  "explanation":"`=` assigns to an existing variable. `:=` and `var` declare names, and Go does not use the C-style `int hikers` order."
}
```

---

## Inference chooses a type, not permanent flexibility

This compiles:

```go
count := 6
count = 9
```

This does not:

```go
count := 6
count = 9.5
```

The first line inferred `int`. The later decimal value does not fit the box's type, so the compiler rejects the assignment.

Type inference removes repeated spelling at the declaration site. It does not create a variable whose type changes whenever a new value arrives.

That rigidity is useful. If a name represents a whole-number count, a fractional assignment is evidence that either the new value is wrong or the original representation no longer matches the problem. Go makes you decide which.

---

## Scope decides which box a name reaches

Run this program and predict both lines first:

```go
package main

import "fmt"

func main() {
	status := "open"

	{
		status := "inspection"
		fmt.Println("inside:", status)
	}

	fmt.Println("outside:", status)
}
```

Output:

```text
inside: inspection
outside: open
```

Braces create an inner **lexical scope**, a region of source where declared names are available. The inner `:=` creates a new box also labelled `status`. While execution is inside that block, the closer name hides the outer one.

This is **shadowing**:

```text
outer scope: status -> "open"
inner scope: status -> "inspection"   closer name wins here
```

When the inner block ends, its box is no longer reachable by name. The outer box was never changed.

If the intention is to update the existing outer value, use assignment:

```go
status = "inspection"
```

Shadowing is dangerous precisely because both programs compile. The debugging symptom is often, "the new value printed inside the block, but the old value returned afterward."

---

## Diagnose shadowing with addresses drawn on paper

You do not need pointer syntax to debug this yet. Draw two boxes:

```text
before block
  outer status: "open"

inside after :=
  outer status: "open"
  inner status: "inspection"   <- current name resolves here

after block
  outer status: "open"
```

Then ask one syntax question: did the suspicious line use `:=` or `=`?

The common naive patch is to delete braces until the value seems to work. That widens lifetimes and hides the actual distinction. Keep the scope that expresses the job, and choose declaration or assignment intentionally.

```quiz
{
  "prompt":"Why does the outer `status` remain `open` after the inner block?",
  "multiple":false,
  "options":[
    {"text":"Strings cannot be reassigned","correct":false},
    {"text":"Printing restores the old value","correct":false},
    {"text":"Braces copy every value back afterward","correct":false},
    {"text":"Inner `:=` declared a new variable that shadowed the outer one","correct":true}
  ],
  "explanation":"The inner and outer names refer to different storage locations. Use `=` if the existing outer variable should change."
}
```

---

## `int` represents whole-number arithmetic

Use `int` for ordinary counts, indexes, and quantities that do not need a fixed external width:

```go
hikers := 7
packs := 3

fmt.Println(hikers + packs)
fmt.Println(hikers - packs)
fmt.Println(hikers * packs)
fmt.Println(hikers / packs)
fmt.Println(hikers % packs)
```

Output:

```text
10
4
21
2
1
```

`/` returns the whole-number quotient because both operands are integers. `%` returns the remainder. The equation behind the last two lines is:

```text
7 = 3 * 2 + 1
        ^     ^
     quotient remainder
```

The remainder operator is useful whenever work cycles through a fixed size or you need to know whether division was exact. Day 3 uses it in control flow; today its arithmetic meaning is enough.

The size of `int` follows the target architecture, at least 32 bits and commonly 64 bits on current desktops and servers. Use it by default for in-memory counts unless an external format demands an exact width.

---

## Sized and unsigned integers solve narrower problems

Go also provides signed widths such as `int8`, `int16`, `int32`, and `int64`, plus unsigned forms such as `uint8` and `uint64`.

The number states the width in bits. A signed `int8` can represent values from -128 through 127. An unsigned `uint8` uses all eight bits for nonnegative values, from 0 through 255.

It is tempting to use `uint8` for a nonnegative count. That works until the real world reaches 256:

```go
package main

import "fmt"

func main() {
	var count uint8 = 255
	fmt.Println(count)

	count++
	fmt.Println(count)
}
```

Output:

```text
255
0
```

The fixed-width value wraps because there is no 256 pattern available in eight bits. Unsigned does not mean validated. It only changes the representable range.

Choose a fixed width when a file format, network protocol, database contract, or measured memory constraint requires one. Do not choose it merely because current examples are small.

---

## `float64` represents fractions approximately

The first capacity calculation needs fractional division. A `float64` can represent a very large range of numbers with a fractional part:

```go
used := 7.0
limit := 10.0
ratio := used / limit
fmt.Println(ratio)
```

Output:

```text
0.7
```

Why the word **approximately**? Computers store these values in binary scientific notation. Many familiar decimal fractions have no finite binary representation, much as one third has no finite decimal representation.

Run:

```go
package main

import "fmt"

func main() {
	left := 0.1
	right := 0.2
	value := left + right
	fmt.Printf("%.20f\n", value)
}
```

Output on Go's `float64` representation:

```text
0.30000000000000004441
```

That does not make floats defective. They are excellent for measurements such as temperature and distance, where the inputs are approximate already. It does mean that exact money and exact equality need domain-specific representation choices later.

---

## `bool` does not borrow truth from numbers or text

A `bool` contains exactly `true` or `false`:

```go
open := true
full := false
fmt.Println(open, full)
```

Comparisons produce booleans:

```go
used := 7
limit := 10
fmt.Println(used < limit)
fmt.Println(used == limit)
```

Output:

```text
true
false
```

Go does not treat `0`, `1`, `""`, or `"yes"` as booleans. This is rejected:

```go
var open bool = 1
```

That explicitness prevents the same value from sometimes meaning a count and sometimes meaning a condition. Day 3 uses boolean expressions to choose paths.

---

## A string is immutable bytes, commonly UTF-8 text

A string literal uses double quotes:

```go
trail := "North Ridge"
fmt.Println(trail)
fmt.Println(len(trail))
```

`len` reports the number of bytes in the string. For basic English letters, one byte represents one character, so the result often matches what a person counts.

That agreement breaks with wider Unicode text:

```go
package main

import "fmt"

func main() {
	label := "界"
	fmt.Println(label)
	fmt.Println(len(label))
}
```

Output:

```text
界
3
```

The visible character is encoded as three UTF-8 bytes. `len` is not broken; it answers a byte-storage question.

Strings are **immutable**, meaning existing string contents are not edited byte by byte. Operations produce new string values, which can then be assigned to a variable. Day 8 develops Unicode-safe traversal and transformation. Today the required boundary is: visible character count and byte count are not interchangeable.

---

## `byte` and `rune` name two different units

`byte` is an alias for `uint8`, one eight-bit storage unit. `rune` is an alias for `int32`, used to represent one Unicode code point.

Run:

```go
package main

import "fmt"

func main() {
	letter := byte('A')
	mark := rune('界')

	fmt.Println(letter)
	fmt.Println(mark)
	fmt.Printf("%c %c\n", letter, mark)
}
```

Output:

```text
65
30028
A 界
```

Single quotes create a **rune literal**, a numeric code point. Converting `'A'` to `byte` is safe because 65 fits from 0 through 255. The code point for `'界'` is 30028, so it does not fit in one byte.

`%c` tells `Printf` to display the numeric value as a character. It changes presentation, not the stored type.

Do not leave with the slogan "a rune is a character" as an absolute truth. Some visible symbols are composed from multiple Unicode code points. The safe statement today is narrower: a rune represents one code point, while a byte represents one encoded storage unit.

---

## Repair integer division at the right moment

Return to the opening failure:

```go
used := 7
limit := 10

wrong := float64(used / limit) * 100
right := float64(used) / float64(limit) * 100

fmt.Println(wrong)
fmt.Println(right)
```

Trace evaluation from the innermost operation:

```text
used / limit                      -> int division   -> 0
float64(used / limit)             -> convert 0      -> 0.0

float64(used)                     -> 7.0
float64(limit)                    -> 10.0
7.0 / 10.0                        -> float division -> 0.7
0.7 * 100                         -> 70
```

A **conversion** uses type syntax like a call: `float64(used)`. It requests a value represented as `float64`.

Go requires numeric conversions to be explicit because converting can lose range, precision, or fractional information. The visible syntax makes the decision reviewable.

```quiz
{
  "prompt":"Which expression produces `0.7` when `used` is integer 7 and `limit` is integer 10?",
  "multiple":false,
  "options":[
    {"text":"`float64(used) / float64(limit)`","correct":true},
    {"text":"`float64(used / limit)`","correct":false},
    {"text":"`used / limit`","correct":false},
    {"text":"`int(float64(used) / float64(limit))`","correct":false}
  ],
  "explanation":"Both operands must become floating-point before division. Converting afterward preserves the already truncated zero; converting the fractional result back to `int` truncates it again."
}
```

---

## Conversion is not validation

This compiles:

```go
large := 300
small := uint8(large)
fmt.Println(small)
```

Output:

```text
44
```

The conversion keeps only the low eight bits because `uint8` cannot represent 300. Go required the conversion to be explicit, but once you requested it, the language performed the defined numeric conversion.

That is why this sentence is too strong: "explicit conversion makes the value safe." It does not. Explicit conversion makes the programmer's request visible.

Before narrowing a runtime value, the program must establish that it fits the destination range. Day 3 introduces the control flow needed to enforce that policy. Today, recognize the symptom: a surprisingly small number after narrowing is likely range loss, not random corruption.

---

## Constants solve the repeated-literal problem

Suppose a program writes the same package size three times:

```go
fmt.Println(250)
fmt.Println(7 * 250)
fmt.Println(10 * 250)
```

The code works. Then package size changes to 300 and one copy is missed. The program now uses two competing facts.

Name the shared fact once:

```go
const gramsPerPack = 250

fmt.Println(gramsPerPack)
fmt.Println(7 * gramsPerPack)
fmt.Println(10 * gramsPerPack)
```

A **constant** gives a name to a value that cannot be reassigned. The benefit is not only protection from change. It gives a repeated fact one source and one domain name.

This fails:

```go
const gramsPerPack = 250
gramsPerPack = 300
```

The compiler rejects reassignment because the declaration promised a constant value.

---

## Untyped numeric constants delay the machine type

Consider:

```go
const packs = 7

var whole int = packs
var measured float64 = packs

fmt.Println(whole)
fmt.Println(measured)
```

The literal constant `7` is **untyped** until a context needs a concrete type. It can become an `int` in the first declaration and a `float64` in the second because the exact value fits both.

This flexibility is limited by representability:

```go
const huge = 300
var small uint8 = huge
```

The compiler rejects the declaration because constant 300 cannot be represented by `uint8`.

Compare that with the earlier runtime conversion from variable `large`. For a known constant, the compiler can prove the overflow before execution. For a variable whose value exists at runtime, an explicit narrowing conversion can wrap.

```text
known constant 300 -> uint8 assignment  -> compile-time rejection
runtime int 300    -> uint8 conversion  -> result 44
```

---

## `iota` numbers related constants without duplicated literals

Status codes often begin like this:

```go
const (
	statusUnknown = 0
	statusOpen    = 1
	statusClosed  = 2
)
```

It works. The repeated numbering becomes fragile when a new state is inserted between two existing lines.

Inside a parenthesized constant group, `iota` starts at zero and increases once per constant specification:

```go
const (
	statusUnknown = iota
	statusOpen
	statusClosed
)
```

The values are `0`, `1`, and `2`. Later lines repeat the previous expression automatically, while `iota` has advanced.

Starting with `statusUnknown` gives the zero value a deliberate meaning. A declared status that was never assigned is unknown, not accidentally open.

Use `iota` for a related run of integer constants where automatic numbering is part of the design. Do not use it when the external values are fixed by a protocol or when explicit values communicate more clearly.

---

## Printing a value and formatting a contract are different jobs

The obvious output uses `Println`:

```go
name := "north trail"
used := 7
fmt.Println(name, used)
```

Output:

```text
north trail 7
```

`Println` prints each argument using a default representation, inserts spaces between operands when needed, and ends with a newline.

That is excellent for quick evidence. It is too loose for a user-facing sentence that needs labels, precision, and a literal percent sign.

`Printf` uses a **format string**, text containing placeholders that describe how later arguments should appear:

```go
ratio := 0.7
fmt.Printf("%s: %d hikers, %.1f%% capacity\n", name, used, ratio*100)
```

Output:

```text
north trail: 7 hikers, 70.0% capacity
```

The format string is a small output contract. Each verb consumes a corresponding later argument.

---

## Read each formatting verb

In this call:

```go
fmt.Printf("%s: %d hikers, %.1f%% capacity\n", name, used, ratio*100)
```

- `%s` formats a string.
- `%d` formats a base-10 integer.
- `%.1f` formats a floating-point value with one digit after the decimal point.
- `%%` prints one literal percent sign and consumes no argument.
- `\n` is a newline escape inside the string.

Two debugging verbs are especially useful:

```go
fmt.Printf("type=%T value=%v\n", used, used)
```

`%T` prints the type. `%v` prints a default representation of the value.

Do not memorize the entire `fmt` package. Know the verbs used by today's output, then consult documentation when a new output contract asks for another.

---

## A wrong verb leaves visible evidence

Try formatting a string with `%d`:

```go
name := "north trail"
fmt.Printf("name=%d\n", name)
```

The program compiles because `Printf` accepts values of many types. At runtime, `fmt` reports the mismatch inside the output:

```text
name=%!d(string=north trail)
```

Read that marker rather than calling it random punctuation:

- `%!d` says verb `%d` could not format the supplied value normally.
- `string=` reports the actual type.
- `north trail` reports the value.

The smallest repair is `%s`, not converting the label to a number.

This is a useful contrast with ordinary type errors. The flexible formatting API accepts the call, then exposes the verb mismatch in its result. Your debugging procedure must include reading the exact output, not only checking whether compilation succeeded.

```quiz
{
  "prompt": "`fmt.Printf(\"name=%d\\n\", \"ridge\")` prints a `%!d(string=...)` marker. What is the smallest correct repair?",
  "multiple": false,
  "options": [
    {"text":"Change `%d` to `%s` because the value is a string","correct":true},
    {"text":"Change the string into `bool`","correct":false},
    {"text":"Replace `Printf` with `gofmt`","correct":false},
    {"text":"Ignore the marker because formatting cannot fail","correct":false}
  ],
  "explanation": "The marker says the decimal-integer verb received a string. `%s` matches the intended text value. Compilation alone cannot prove a flexible format string matches its arguments."
}
```

---

## A realistic capacity report, traced end to end

Now repair the opening program without adding any Day 3 control flow:

```go
package main

import "fmt"

func main() {
	const trailName = "north trail"

	used := 7
	limit := 10
	ratio := float64(used) / float64(limit)

	fmt.Printf("%s: %d of %d places used (%.1f%%)\n",
		trailName, used, limit, ratio*100)
}
```

Output:

```text
north trail: 7 of 10 places used (70.0%)
```

Trace the data:

```text
integer facts: used=7, limit=10
conversion:    7 -> 7.0, 10 -> 10.0
division:      7.0 / 10.0 -> approximately 0.7
display math:  0.7 * 100 -> approximately 70
formatting:    %.1f -> one displayed fractional digit
```

The code keeps counts as integers and converts at the point where a fractional ratio is required. That is more honest than storing all counts as floats merely because one later result needs a fraction.

---

## Debug values in a fixed order

When a value looks wrong, do not immediately add conversions everywhere. Use this order:

```text
1. intended meaning
   Is this a count, measurement, yes/no fact, text, byte, or code point?

2. actual type
   Print `%T` beside `%v`.

3. operation order
   Which subexpression runs before conversion or formatting?

4. representable range
   Can the destination type hold this value?

5. scope
   Did `:=` create a closer box instead of updating the intended one?

6. presentation
   Does the format verb match the value and precision requirement?
```

Examples:

```text
expected 70, got 0       -> inspect operand types and division order
expected 300, got 44     -> inspect narrowing range
changed inside, old outside -> inspect scope and :=
expected label, got %!d  -> inspect format verb
```

This turns "Go handled my value strangely" into a concrete search.

---

## Common mistakes

| Mistake | Why it hurts | Better move |
|---|---|---|
| Treating `:=` as shorter assignment | It redeclares or fails when no name is new | Declare once, then use `=` |
| Assuming inference means dynamic type | Later incompatible assignments fail | Treat inferred type as fixed |
| Treating a zero value as domain approval | Language validity is not business validity | State the domain boundary separately |
| Updating with `:=` inside a block | A shadow box may be created | Draw scopes; use `=` for the outer variable |
| Expecting integer division to preserve a fraction | The remainder is discarded before later math | Convert operands before division |
| Converting after integer division | Lost information cannot return | Trace innermost operation first |
| Assuming explicit conversion validates range | Narrowing can wrap | Prove the value fits before conversion |
| Choosing `uint8` because values are nonnegative | Real values above 255 wrap | Use `int` unless an external width requires otherwise |
| Comparing float output as if decimals were exact | Binary representation can differ slightly | Choose tolerances or exact units when the domain requires them |
| Assuming one byte is one visible character | UTF-8 characters can span bytes | Keep byte storage distinct from code points |
| Saying a rune is always one visible character | A visible symbol may use multiple code points | Say rune means one Unicode code point |
| Using a wrong format verb | Output contains `%!` diagnostic markers | Pair verb, type, and desired presentation |

---

## Practice: five reps from recall to transfer

Write each as a real `.go` file and run it. Predict output before execution.

### 1. Recall: zero-value evidence

Declare an `int`, `float64`, `bool`, and `string` with `var` and no initializer. Print each with `%T`, `%v`, and where useful `%q`.

Done means you can distinguish language-valid zero from domain-valid input without reading the lecture.

### 2. Mechanics: declaration, assignment, and shadowing

Start with `status := "open"`. In an inner block, first shadow it with `:=` and record both outputs. Then change only that token to `=` and record both outputs again.

Before running the second version, draw the number of boxes you expect. Deliberately trigger `no new variables on left side of :=` in the outer scope and repair it.

### 3. Prediction: conversion timing

For `used := 9` and `limit := 4`, predict all four values:

```go
used / limit
float64(used / limit)
float64(used) / float64(limit)
int(float64(used) / float64(limit))
```

Run them, then explain exactly where the fraction is lost in each integer result.

### 4. Deliberate failure: range and format evidence

Convert runtime `int(300)` to `uint8` and explain `44`. Then try to assign constant `300` directly to `uint8` and compare runtime evidence with compiler evidence.

In a separate line, give `%d` a string, read the `%!` marker, and repair only the verb.

### 5. Transfer: battery report

Represent a field battery report containing a station label, current charge units, maximum units, an approximate voltage, an online flag, and unknown/normal/low status codes.

Use constants for facts that do not change, make the zero status mean unknown, calculate a percentage without integer truncation, and print one stable report line. Defend each type by the operations and range it must support, not by how the final value looks.

After help, close it and reconstruct the calculation and output contract once. Keep at most two delayed prompts: the integer-division timing trace and the two-box shadowing trace. Review after study, not after file generation.

---

## Cheat sheet

```text
DECLARATION AND ASSIGNMENT
  var n int             declare n; zero value is 0
  n = 3                 assign existing n
  n := 3                declare local n and infer int
  const limit = 10      immutable named value

ZERO VALUES
  int, float64          0
  bool                  false
  string                ""
  valid Go value does not guarantee valid domain input

PRIMITIVES
  int                   ordinary whole-number arithmetic
  int8...int64          exact signed widths when required
  uint8...uint64        exact unsigned widths, can still overflow
  float64               approximate fractional arithmetic
  bool                  true or false, no truthy integers or strings
  string                immutable bytes, commonly UTF-8 text
  byte                  alias for uint8
  rune                  alias for int32, one Unicode code point

OPERATIONS
  / on ints             integer quotient, remainder discarded
  % on ints             remainder
  float64(n)            explicit conversion; not validation
  inner :=              can shadow an outer name

CONSTANTS
  untyped numeric constant can adapt when exactly representable
  iota starts at 0 and increments per const specification

FORMAT
  Println               default values, spaces, newline
  Printf                format-string-controlled output
  %T  %v  %q            type, default value, quoted value
  %d  %f  %s  %t  %c    integer, float, string, boolean, character
  %.1f  %%  \n          precision, percent sign, newline
```

---

## Tomorrow

Values and calculations are now explicit. The next problem is deciding which statements should run and how often, while keeping every threshold and stopping condition visible enough to trace.

```finalquiz
{
  "title":"Day 2: Values and representation",
  "questions":[
    {"id":"q1","type":"single_correct","prompt":"What does a declared `var count int` contain before assignment?","codeSnippet":null,"options":[{"id":"a","text":"An unpredictable memory value"},{"id":"b","text":"`nil`"},{"id":"c","text":"A compiler error"},{"id":"d","text":"The integer zero"}],"correctOptionIds":["d"],"explanation":"Go initializes an `int` to zero. It is valid language state, though the domain may reject it for a package size or other constrained value.","example":"A counter can begin at zero without an initializer."},
    {"id":"q2","type":"single_correct","prompt":"After `n := 4`, which statement updates the same variable?","codeSnippet":null,"options":[{"id":"a","text":"`n = 5`"},{"id":"b","text":"`n := 5` in the same scope"},{"id":"c","text":"`var n int = 5` in the same scope"},{"id":"d","text":"`int n = 5`"}],"correctOptionIds":["a"],"explanation":"`=` assigns to the existing box. The declaration forms try to create another name, and Go does not use C-style declaration order.","example":"Declare once, assign many times."},
    {"id":"q3","type":"multiple_correct","prompt":"Which are zero values?","codeSnippet":null,"options":[{"id":"a","text":"`false` for `bool`"},{"id":"b","text":"`\"\"` for `string`"},{"id":"c","text":"`1` for `int`"},{"id":"d","text":"`0` for `float64`"}],"correctOptionIds":["a","b","d"],"explanation":"Boolean, string, and float zero values are `false`, empty string, and numeric zero. Integer one is not a zero value.","example":"Zero means type default, not automatic domain approval."},
    {"id":"q4","type":"single_correct","prompt":"What is `float64(7 / 10)`?","codeSnippet":null,"options":[{"id":"a","text":"`0.7`"},{"id":"b","text":"`0.0`"},{"id":"c","text":"A compile error"},{"id":"d","text":"`70.0`"}],"correctOptionIds":["b"],"explanation":"Integer division first produces zero, then conversion produces floating zero. Convert both operands before division for `0.7`.","example":"Operation order determines when precision is lost."},
    {"id":"q5","type":"multiple_correct","prompt":"Which claims about constants are correct?","codeSnippet":null,"options":[{"id":"a","text":"A constant cannot be reassigned"},{"id":"b","text":"An untyped numeric constant can adapt to compatible numeric contexts"},{"id":"c","text":"Any constant fits in `uint8`"},{"id":"d","text":"`iota` can number related constants"}],"correctOptionIds":["a","b","d"],"explanation":"Constants are immutable; untyped numeric constants have contextual flexibility; `iota` counts specifications. Values still must fit concrete destination types.","example":"Constant 300 cannot initialize a `uint8`."},
    {"id":"q6","type":"single_correct","prompt":"Why does inner `status := \"closed\"` not update an outer `status`?","codeSnippet":null,"options":[{"id":"a","text":"Strings are immutable"},{"id":"b","text":"The compiler restores outer values"},{"id":"c","text":"It declares a shadow variable in the inner scope"},{"id":"d","text":"Printing copies the value"}],"correctOptionIds":["c"],"explanation":"The inner declaration creates another storage location. String immutability concerns string contents, not whether a variable can be assigned another string.","example":"Use `status = \"closed\"` to update the outer name."},
    {"id":"q7","type":"single_correct","prompt":"Which type is the ordinary choice for a count with no required external width?","codeSnippet":null,"options":[{"id":"a","text":"`bool`"},{"id":"b","text":"`string`"},{"id":"c","text":"`uint8`"},{"id":"d","text":"`int`"}],"correctOptionIds":["d"],"explanation":"`int` is the normal whole-number type. A tiny unsigned width introduces a 255 boundary without a stated protocol or storage need.","example":"Use exact widths when an external contract requires them."},
    {"id":"q8","type":"multiple_correct","prompt":"Which formatting claims are correct?","codeSnippet":null,"options":[{"id":"a","text":"`%d` formats a decimal integer"},{"id":"b","text":"`%.1f` requests one fractional digit"},{"id":"c","text":"`%T` prints a value's type"},{"id":"d","text":"`%s` changes any variable's stored type to string"}],"correctOptionIds":["a","b","c"],"explanation":"The first three describe presentation. `%s` expects a string value for formatting; it does not mutate or convert a variable's stored type.","example":"Use `%T` and `%v` together while diagnosing a value."},
    {"id":"q9","type":"single_correct","prompt":"Why is a zero package size dangerous even though Go initializes it safely?","codeSnippet":null,"options":[{"id":"a","text":"Zero is invalid Go syntax"},{"id":"b","text":"Language-valid state can still violate the problem's rules"},{"id":"c","text":"Zero changes the variable's type"},{"id":"d","text":"Go leaves zero uninitialized"}],"correctOptionIds":["b"],"explanation":"Initialization prevents leftover-memory values, not nonsensical domain input. Later control flow must reject a zero divisor or package size.","example":"Valid representation and valid business value are separate claims."},
    {"id":"q10","type":"multiple_correct","prompt":"Which representations match their intended facts?","codeSnippet":null,"options":[{"id":"a","text":"`bool` for whether a trail is open"},{"id":"b","text":"`float64` for an approximate temperature"},{"id":"c","text":"`string` for a trail label"},{"id":"d","text":"`byte` for every possible visible character"}],"correctOptionIds":["a","b","c"],"explanation":"Boolean, float, and string match those domains. One visible Unicode character can require multiple bytes, and some visible symbols can contain multiple code points.","example":"Choose by operations and range, not by how a printed value looks."}
  ]
}
```
