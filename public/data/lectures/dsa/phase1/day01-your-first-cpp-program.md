# Day 1: Your first C++ program & the compile-run loop

**Duration: ~4 hours baseline; split across sessions | Focus: Turn a text file into a program, control its input and output, and diagnose your first mistakes without guessing**

---

## Why this day exists

Someone hands you two numbers and asks you to print their total.

You can do the arithmetic on paper.

The unfamiliar part is making a computer follow your instructions—and knowing what
to do when it does something different.

Today we make that whole journey visible, from the text you write to the result you see.

You do not need a LeetCode account or any previous programming knowledge.

---

## The first obstacle is not the arithmetic

Create a folder named `dsa` and open it in a text editor. A text editor changes the
characters in a file; it does not automatically turn them into a running program.

Save a file called `main.cpp`. The `.cpp` ending tells people and tools that this
file contains C++ source code: instructions written in the C++ language.

Put this inside it:

```cpp
#include <iostream>

int main() {
    std::cout << "I can run a program.\n";
    return 0;
}
```

Save the file. Nothing prints yet. Saving stores the instructions; it does not
execute them. Keep this distinction in mind when a later edit appears to do nothing.

---

## One picture for the entire journey

```text
main.cpp                compiler                 executable
text you can edit   →   checks and translates  →  program you can run
                                                       |
                                                       v
                                                terminal output
```

A **compiler** translates source into machine instructions and reports many kinds
of invalid source. Building a complete program also connects the needed library
pieces; that connecting work is called **linking**. Our compiler command performs
both steps for this small program.

The **executable** is the resulting file. Running it makes the computer perform
the instructions. Editing `main.cpp` does not edit an already-built executable.

---

## Prepare one place to type commands

A **terminal** is a window where you type commands and see their text output.
The terminal's **current directory** is the folder commands use unless you provide
a different path. Open a terminal in your `dsa` folder using your editor's terminal
command, or use `cd` followed by the folder's path.

`cd` means change directory. If the path contains spaces, surround it with quotes:

```bash
cd "/path/to/my dsa folder"
```

Replace that example path with your actual folder. The command is a terminal command,
not C++: never paste it inside `main.cpp`.

---

## Check the compiler before diagnosing your code

In the terminal, run:

```bash
g++ --version
```

A version message means a program named `g++` is available. On macOS this name
often invokes Apple's Clang compiler rather than GNU's compiler; both can compile
today's standard C++.

If the command is missing, that is an environment problem, not a mistake in your
C++ file. On macOS, `xcode-select --install` starts installation of the command-line
developer tools. On Ubuntu/Debian, `sudo apt install g++` installs GNU C++; `sudo`
requests administrator privileges. On Windows, use a configured C++ toolchain and
its terminal; the official [GCC installation links](https://gcc.gnu.org/install/)
identify supported distributions. Do not rename a text file to `.exe` as a substitute.

If installation is not possible today, a browser C++ runner can execute the same
source. Choose C++17 or later, put source in its code panel and input in its input
panel. Return to the local compile/run steps when a compiler is available.

---

## Build, then run

On macOS/Linux, with the terminal in the folder containing `main.cpp`:

```bash
g++ -std=c++17 -Wall -Wextra main.cpp -o main
./main
```

`g++` starts the compiler. `-std=c++17` selects the language version. `-Wall` and
`-Wextra` request useful warnings: diagnostics that may indicate a mistake even
when compilation can succeed. `main.cpp` names the input source. `-o main` names
the output executable. A successful build may print nothing.

`./main` then runs the executable in the current directory: `.` means this directory,
and `/` separates the directory from the filename.

In Windows PowerShell with `g++` configured, use `-o main.exe` and run `./main.exe`.
The source file stays `main.cpp` on every platform.

Expected program output:

```text
I can run a program.
```

---

## Before revealing the result

Change the message in the source to `I changed the source.`, save it, and run
`./main` **without compiling again**.

Write the message you expect before running. Which file did your edit change?
Which file does `./main` execute?

---

## Why the old message survives

The old message still prints because you ran the old executable.

```text
edit source   → main.cpp has the new message
run ./main    → main still contains the old compiled instructions
compile       → main is rebuilt from the current main.cpp
run ./main    → the new message appears
```

This is the **edit → save → compile → run** loop. It is your first debugging tool.
When output ignores a change, check whether you saved and whether the latest build
succeeded before questioning the arithmetic.

Compiled machine code can execute efficiently, but using C++ does not make every
algorithm fast. Repeating unnecessary work can still make a C++ program slow.

---

```quiz
{"prompt":"You edit and save `main.cpp`, but the next compilation fails. Running the old executable prints yesterday's message. What explains this?","options":[{"text":"C++ ignores changes inside quotation marks.","correct":false},{"text":"The terminal needs a different font.","correct":false},{"text":"The old executable was not replaced by a successful new build.","correct":true},{"text":"Saving automatically ran the compiler twice.","correct":false}],"explanation":"Source and executable are different files. A failed build does not give you a successfully updated program. Read the compiler diagnostic, fix the source, build successfully, then run. Neither quotation marks nor terminal appearance explains the old message."}
```

---

## What the five lines mean

Return to the working source. `#include <iostream>` makes declarations for standard
input/output facilities available to this file. `iostream` is a standard header;
the angle brackets are part of the include syntax, not comparison operators here.

`int main()` begins the program's entry function. A **function** is a named block
of instructions. C++ uses `main` as the entry point for a normal hosted program.
The empty parentheses mean we are not declaring any inputs to this function today.

The braces `{` and `}` delimit its body: the instructions between them belong to
`main`. Indentation makes that grouping easy for humans to see; braces establish it.

`int` before `main` says this function returns an integer status. `return 0;` ends
the function and reports successful completion to the environment. It does not print
the digit zero. We will write our own reusable functions on Day 4.

---

## A statement is an instruction, not necessarily a line

This is a statement:

```cpp
std::cout << "Hello\n";
```

The semicolon ends it. A newline in the source is usually just layout. These two
statements can share a line, although keeping them separate is easier to read:

```cpp
std::cout << "One\n"; std::cout << "Two\n";
```

`#include` is a preprocessing directive, so we do not put a statement-ending
semicolon after it. Nor do we put one after the closing brace of this `main` function.

A **comment** explains source to a human and is ignored as an instruction. `//`
starts a comment that runs to the end of the source line:

```cpp
return 0; // Report successful completion.
```

---

## Send values to the output stream

`std::cout` names the standard output stream. A **stream** is a sequence of data
entering or leaving a program. In our local run, output normally appears in the terminal.

`std::` says the name belongs to the standard-library namespace. A **namespace**
groups names so different libraries can use similar names without confusing them.

With `cout`, `<<` sends the value on its right to the output stream. Several sends
can be chained in order:

```cpp
std::cout << "Total: " << 7 << '\n';
```

This prints `Total: 7` and moves to the next output line. C++ does not automatically
insert spaces between values: the space after the colon is inside the quoted text.

---

## Text and values behave differently

Predict the two output lines before running these statements inside `main`:

```cpp
std::cout << "2 + 3" << '\n';
std::cout << 2 + 3 << '\n';
```

Write down whether quotation marks themselves will appear.

---

## The quotes change the instruction

```text
2 + 3
5
```

Double quotes mark a text literal: characters to print as written. The delimiters
tell C++ where the text starts and ends; they are not part of that text.

Without quotes, `2 + 3` is an arithmetic expression. An **expression** computes a
value. Here C++ adds two integer literals, obtains `5`, and sends that value to `cout`.

`'\n'` is a character literal representing newline. The backslash starts an escape
sequence: `\n` means one newline character, not a visible backslash followed by `n`.
`"Hello\n"` contains text plus that same newline character.

---

## Missing separators produce correct values in the wrong format

```cpp
std::cout << 12 << 34 << '\n';
```

This prints `1234`. The stream sends `12`, then immediately sends `34`.

If the required output is two values separated by one space, write:

```cpp
std::cout << 12 << ' ' << 34 << '\n';
```

`' '` is one space character. For one value per line, send ` '\n' ` between them
instead. Formatting is part of the task, not a decorative final step.

---

```quiz
{"prompt":"What does `std::cout << 4 << 5 << '\\n';` print on its output line?","options":[{"text":"45","correct":true},{"text":"9","correct":false},{"text":"4 5","correct":false},{"text":"The source text `4 << 5`","correct":false}],"explanation":"Chained output sends 4 and then 5 without adding a separator, so the visible line is 45. Addition would require `4 + 5`; a space must be explicitly sent; quotation marks would be needed to print source text literally."}
```

---

## Session checkpoint: can you control the loop?

Close the source and create a second file that prints two different lines. Compile
it to a differently named executable and run that executable. Explain which filename
is the source and which is the program.

If you needed to reopen the five-line example, that is an assisted attempt. Close
it and try again after a break. You have a concrete skill to practise; there is no
need to solve an algorithm problem yet.

The next session makes the result depend on values supplied at run time.

---

## A program that always says 30

Suppose two tickets cost 12 and 18. Printing `30` answers that one case.
Tomorrow the prices are 9 and 14. Editing and recompiling the program for every
customer is not the behavior we want. The instructions should stay the same;
the supplied values should change.

Before continuing, write the two things the program must receive and the one
thing it must produce. Use ordinary words, not C++ syntax.

---

## Give a received value a place to live

The program needs two prices as input and their total as output. A **variable**
is a named storage location whose value the program can use or replace.

```cpp
#include <iostream>
int main() {
    int first = 0;
    int second = 0;
    std::cin >> first >> second;
    std::cout << first + second << '\n';
    return 0;
}
```

`int first = 0;` creates an integer variable named `first`, initially holding zero.
`int` means this slot stores whole numbers within a finite range. Today our inputs
are small nonnegative whole numbers; Day 2 investigates the range.

`=` here supplies the initial value. It is not a mathematical claim that the
variable must equal zero forever. `first` can later receive another value.

---

## Follow one read, one calculation, one write

`std::cin` is the standard input stream. With `cin`, `>>` extracts a value into
the named variable. With `cout`, `<<` sends a value out. Direction helps recall:
input into the slot; output into the stream.

For input `12 18`:

| Statement completed | `first` | `second` | Visible output |
|---|---:|---:|---|
| Both declarations | 0 | 0 | nothing |
| First extraction | 12 | 0 | nothing |
| Second extraction | 12 | 18 | nothing |
| Output statement | 12 | 18 | `30` and a newline |

The expression `first + second` calculates a value. It does not change either
input variable. `std::cout << "first + second";` would print those words instead.

Build the file, run it, type `12 18`, and press Enter. The terminal may display
what you type; that echo is not output produced by your `cout` statement.

---

## Input can span lines

These three inputs provide the same two integers:

```text
12 18
```

```text
12
18
```

```text
   12     18
```

Formatted integer extraction skips leading **whitespace**: spaces, tabs and
newlines. After finding a number, it reads it and continues at the next input.
Our program requests two numbers; pressing Enter after only one does not satisfy
the second request. It can remain waiting for another number.

These exercises promise valid integer input. Typing `twelve` violates that
contract: integer extraction fails. Initializing a variable to zero does not
validate input. We will teach checks before relying on malformed-input handling.

---

```quiz
{"prompt":"The program executes `std::cin >> first >> second;`. You type `12`, press Enter, then type `18` and press Enter. What happens for valid integer input?","options":[{"text":"Only 12 is read because Enter ends all input.","correct":false},{"text":"The two variables receive 12 and 18.","correct":true},{"text":"The second variable receives the newline's numeric value.","correct":false},{"text":"Both variables receive 1218.","correct":false}],"explanation":"Integer extraction skips whitespace, including newlines. Each extraction reads its own number. Enter can submit a terminal line without ending the input stream; separate extractions do not concatenate separate numbers."}
```

---

## Assignment changes a stored value

Inside `main`, after declaring the variables, we could write:

```cpp
first = first + second;
```

Read the right side first: with 12 and 18, it produces 30. Store that result in
the slot on the left. Now `first` holds 30 and `second` still holds 18.

This is why a programming assignment is different from an algebraic equation.
The old value can participate in producing its replacement.

The arithmetic operations needed today are `+` addition, `-` subtraction and
`*` multiplication. Parentheses choose which arithmetic happens first:
`(first + second) * 2` doubles the total. Multiplication normally happens before
addition, so `first + second * 2` doubles only `second`.

Predict both results for 12 and 18 before opening the next screen.

---

## The parentheses changed the question

`(12 + 18) * 2` is `30 * 2`, giving 60.
`12 + 18 * 2` is `12 + 36`, giving 48.

The compiler can accept both versions. It cannot know which total the customer
wanted. A **logic error** is a program that runs but follows the wrong reasoning.
Hand calculations are useful tests because they give us an answer independent
of the program we are checking.

Use three tiny tests: ordinary values, a zero, and two different values. Different
values reveal accidental reuse of one input more readily than `5 5` does.

---

## Output is an agreement

An automated judge runs your program on supplied inputs and checks the output
against the problem's required answer. It does not need a conversation.

If the requested output is the total alone, print:

```text
30
```

not `Enter prices:` followed by `The total is 30`. Those words add output that
the statement did not request. Some judges ignore certain whitespace differences;
do not rely on that to excuse incorrect labels, missing separators or extra data.

You do not need an account or a submission today. Your local terminal lets you
learn the same input/output agreement without a new website interface.

---

## A newline and a flush do different jobs

`'\n'` represents one newline character. Double quotes enclose a sequence of
characters such as `"total"`; single quotes enclose a character such as `' '`.

Output is often collected briefly in a **buffer**, a holding area, before being
sent onward. This avoids asking the operating system to handle every character
separately. A **flush** asks the stream to send pending output onward now.

Both statements below end a line, but the second also requests a flush:

```cpp
std::cout << 30 << '\n';
std::cout << 30 << std::endl;
```

These are fragments to place inside `main`. For ordinary batch answers, prefer
`'\n'`. Repeated unnecessary flushing can be expensive. This is not a promise
that every individual newline statement is measurably faster.

---

## Why fast input settings exist

C++ streams can coordinate with a separate C input/output system. If we use only
`cin` and `cout`, we can turn that coordination off. Also, `cin` is normally
**tied** to `cout`: an input operation flushes pending output first, which helps
show a prompt before the program waits for an answer.

For a non-interactive, large-input judge program, these lines go at the beginning
of `main`, before any input or output:

```cpp
std::ios::sync_with_stdio(false);
std::cin.tie(nullptr);
```

The first is a library function call. `false` means switch synchronization off.
The second removes the automatic connection; `nullptr` means no tied stream.
We are using a library interface, not writing our own functions or manipulating
pointers today. The visible effect to remember is the changed output timing.

---

## Use the settings with a contract

After disabling synchronization, keep to C++ streams in this course; do not mix
in C input/output calls whose coordination you disabled. After untying `cin`, a
prompt may need an explicit `std::flush` to be sent before input is requested.

`std::cout << "Price? " << std::flush;` is that explicit request. It does not add
a newline. Batch problems do not need prompts, so we normally avoid this issue.
Interactive problems have additional communication rules and come much later.

There is no universal “100,000 inputs” boundary. Benefit depends on how much input
there is, the environment and other work. The two-ticket program is too small
to usefully benchmark this choice.

```quiz
{"prompt":"Why is `'\\n'` usually preferred to `std::endl` for many ordinary batch-output lines?","options":[{"text":"It guarantees the program can never time out.","correct":false},{"text":"It changes integer calculations to faster arithmetic.","correct":false},{"text":"It removes the need for exact output formatting.","correct":false},{"text":"It ends the line without requesting a flush on every line.","correct":true}],"explanation":"The difference is flushing, not arithmetic or correctness. Avoiding repeated flush requests can help throughput, but it does not guarantee any time limit and does not change the output contract."}
```

---

## Short templates hide choices

Some competition code uses `#include <bits/stdc++.h>`. In environments that
provide it, this includes many library headers at once. It saves typing, but it
is not a standard C++ header and may not exist with your compiler. We use the
standard `<iostream>` header because it supplies the streams we actually need.

Some code also uses `using namespace std;`. This makes standard-library names
available without writing `std::` each time. It can make two names ambiguous
when another part of the program supplies the same name. Explicit `std::cout`
states whose `cout` we mean and avoids that shortcut today.

A template should be a set of decisions you understand, not a password you paste.
For small local programs, the five-line version is enough. Add the two fast-input
settings when using the batch-program contract just explained.

---

## Read the first compiler diagnostic first

This intentionally broken program is missing a semicolon:

```cpp
#include <iostream>
int main() {
    int price = 12
    std::cout << price << '\n';
    return 0;
}
```

The compiler may point at `std::cout`, where it finally discovers that the previous
statement did not end correctly. A line number is a search starting point, not a
guarantee that the mistake is on that exact line.

Read the first diagnostic, inspect that line and the one before it, repair one
cause, and compile again. One missing character can produce many later messages.
Do not run an old executable and interpret its output as evidence the repair worked.

---

```quiz
{"prompt":"Compilation fails after you edit a source file, but an older executable still runs. What is the reliable next step?","options":[{"text":"Repair the first relevant diagnostic, compile successfully, then run the new executable.","correct":true},{"text":"Trust the old executable because it still prints an answer.","correct":false},{"text":"Delete every line mentioned in the compiler output.","correct":false},{"text":"Submit the source because a runnable file already exists.","correct":false}],"explanation":"A failed build does not establish that your edited source produced the executable you ran. Fix the source and require a successful build. Later diagnostics can be consequences of the first mistake; deleting all mentioned lines is not a diagnosis."}
```

---

## Practice

Use this as a five-task bank across sessions. Do the guided warm-up and one core
attempt first. A reasonable first attempt is 10–20 minutes per small task; setup
trouble is separate from reasoning time. Stop earlier to request a hint if you
cannot name a possible next action.

For each task: write expected output first, make an attempt, reveal one hint,
act on it, and only then reveal another. After reading a solution, close it and
rebuild it. Record `with help` separately from `independent`.

All tasks use only this day's input, output, variables and arithmetic. Each is
a separate `main.cpp`, compiled with the same command used earlier. Inputs meet
the stated constraints. No platform or external problem list is required.

---

## Problem 1 — a two-line receipt

**Guided warm-up · 10–15 minutes.** There is no input. Print exactly:

```text
Tickets
2 30
```

First write the characters that separate the two numbers. Then write and run the
program. A compiler success alone is insufficient: compare the output line by line.

---

## Receipt hints

1. You need two line endings and a space between the numbers.
2. Literal text belongs inside quotation marks; `cout` adds no space automatically.
3. Use `std::cout << "Tickets\n";` and build the second line yourself.

---

## Receipt solution and reasoning

```cpp
#include <iostream>
int main() {
    std::cout << "Tickets\n";
    std::cout << 2 << ' ' << 30 << '\n';
    return 0;
}
```

The first statement supplies the heading and its line ending. The second supplies
both numbers, their separator and the final line ending. There are no inputs or
changing values. The work and storage stay fixed because this always prints the
same small receipt. Changing the number of requested output characters would
change the printing work; we are not yet describing that with formal notation.

---

## Problem 2 — the total depends on input

**Core application · 15–25 minutes.** Read two whole-number prices, each between
0 and 1,000. Print their sum alone. Input `9 14` must produce `23`.

Test `0 0`, `0 7`, and `1000 1000`. Write the expected answers before running.
Reorder the two prices: should the total change? Explain your prediction.

---

## Total hints

1. You need two integer slots and one extraction per slot.
2. The calculation is an expression; it need not replace either price.
3. Use `std::cin >> first >> second;`, then send `first + second` to output.

---

## Total solution and reasoning

```cpp
#include <iostream>
int main() {
    int first = 0;
    int second = 0;
    std::cin >> first >> second;
    std::cout << first + second << '\n';
    return 0;
}
```

After the reads, the variables contain exactly the two input prices. Their sum is
therefore the requested total. Its largest possible value is 2,000, safely within
the range needed here. The program performs two integer reads, one addition and
one answer write, using two stored input integers. Swapping inputs preserves the
sum. Expected boundary answers are 0, 7 and 2,000.

---

## Problem 3 — a delivery charge changes the rule

**Changed condition · 15–25 minutes.** Read a unit price `price`, a quantity
`quantity`, and one delivery charge `delivery`. Each is an integer from 0 to 100.
Print `price * quantity + delivery`. Delivery applies once, even if quantity is zero.

Input `12 3 5` must produce `41`. Before coding, explain why multiplying the
delivery charge by the quantity answers a different question.

---

## Delivery hints

1. Separate the cost per item from the one-time cost.
2. Three supplied values need three reads, even if you know the sample values.
3. Calculate the item total first, then add the single delivery charge.

---

## Delivery solution and reasoning

```cpp
#include <iostream>
int main() {
    int price = 0;
    int quantity = 0;
    int delivery = 0;
    std::cin >> price >> quantity >> delivery;
    std::cout << price * quantity + delivery << '\n';
    return 0;
}
```

Multiplication gives the cost of all items; addition attaches the charge once.
The maximum is 10,100, still safe for today's integers. Test `12 0 5` → `5` and
`0 3 5` → `5`. These distinguish the specified rule from common incorrect formulas.
Work: three reads, one multiplication, one addition and one result write. Storage:
three integers. No list of individual items is stored or needed.

---

## Problem 4 — reconstruct after a break

**Delayed recall · 10–20 minutes, later.** Close the lecture. Read two integers
between 0 and 100. Print their sum on one line and their product on the next.
For `4 7`, output `11` then `28` on separate lines.

Also explain aloud what happens if you edit the source but do not compile again.
This task tests reconstruction of the workflow as well as recall of syntax.

---

## Reconstruction hints

1. Rebuild the include, `main` and return statement before adding the calculation.
2. Both output lines can use the original input values.
3. Use two `cout` statements, each ending with `'\n'`.

---

## Reconstruction solution and reasoning

```cpp
#include <iostream>
int main() {
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    std::cout << a + b << '\n';
    std::cout << a * b << '\n';
    return 0;
}
```

The reads store the two inputs; neither calculation modifies them. Each expression
therefore uses the original pair. Two reads, two arithmetic operations, two answer
writes and two integers of input storage suffice. The largest product is 10,000.
Editing source alone does not update the executable: build successfully, then run.

---

## Problem 5 — repair the wrong receipt

**Optional stretch · 15–25 minutes.** Read two prices in 0–100. Print them separated
by one space on the first line, then print **twice their sum** on the second.
For `12 18`, the required lines are `12 18` and `60`.

This validly compiled fragment inside `main` is wrong:

```cpp
std::cout << first << second << '\n';
std::cout << first + second * 2 << '\n';
```

Name both failures and supply a complete corrected program. Test unequal inputs.

---

## Repair hints

1. One failure concerns presentation; the other concerns arithmetic grouping.
2. `cout` does not insert a separator. Multiplication takes priority over addition.
3. Insert `' '` between the prices and put parentheses around their sum.

---

## Repair solution and reasoning

```cpp
#include <iostream>
int main() {
    int first = 0;
    int second = 0;
    std::cin >> first >> second;
    std::cout << first << ' ' << second << '\n';
    std::cout << (first + second) * 2 << '\n';
    return 0;
}
```

The explicit separator makes two visible numbers. Parentheses ensure the whole
sum, rather than just the second price, is doubled. Test `0 7`: the second line
must be 14; test `7 0`: it must also be 14. Work and storage remain fixed for this
two-input contract: one addition, one multiplication and two stored integers,
plus the small amount of input/output work.

---

## Keep evidence, not a streak

Write four short fields: task, help used, one failing input, next attempt.
If your first attempt needed the whole solution, that is a starting point. A useful
next win is reconstructing one input/output program without looking.

Keep only two durable recall cues from today:

- Given two supplied numbers, build, run and test a program that prints a requested calculation.
- Explain source versus executable, and diagnose a program that keeps printing yesterday's answer.

Try after roughly 1, 3, 7, 14 and 30 days **after studying**, adapting to results.
Keep daily review around 15–20 minutes across topics; do not accumulate an unlimited
backlog. If setup or syntax repeatedly blocks you, repair that one dependency before
adding harder problems. You are not behind because LeetCode is not useful yet.

---

## Cheat sheet

| Need | Mechanism |
|---|---|
| Build | `g++ -std=c++17 -Wall -Wextra main.cpp -o main` |
| Run on macOS/Linux | `./main` |
| Integer slot | `int price = 0;` |
| Read values | `std::cin >> first >> second;` |
| Print with a separator | `std::cout << first << ' ' << second << '\n';` |
| Group arithmetic | `(first + second) * 2` |
| Failed build | Inspect first diagnostic and preceding line; rebuild before running |
| Batch input settings | Disable synchronization and untie only with the explained stream contract |

---

## Tomorrow

Today the numbers were deliberately small. Next, try a price of 1,000,000,000
multiplied by 4: the calculation can exceed the storage range. Day 2 explains how
to choose the type of a calculation and why a larger destination alone may not fix it.

Before starting, reconstruct the two-price program once. A remembered explanation
is useful; a working program from a blank file is stronger evidence.

---

```finalquiz
{
  "title": "Day 1: Build, read, calculate, print",
  "questions": [
    {
      "id": "q1",
      "type": "single_correct",
      "prompt": "You edit `main.cpp` after a successful build. Which action updates the executable?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Save alone"
        },
        {
          "id": "b",
          "text": "Run the old executable"
        },
        {
          "id": "c",
          "text": "Compile the edited source successfully"
        },
        {
          "id": "d",
          "text": "Type new input"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "Saving changes source text; successful compilation creates the updated program. Running and input do not rebuild it.",
      "example": "Change a message, rebuild, then check the new message."
    },
    {
      "id": "q2",
      "type": "multiple_correct",
      "prompt": "Which statements about the small program are correct?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "`<iostream>` supplies stream declarations."
        },
        {
          "id": "b",
          "text": "`main` is the program's starting function."
        },
        {
          "id": "c",
          "text": "Every newline in source ends a C++ statement."
        },
        {
          "id": "d",
          "text": "`return 0;` reports successful completion from `main`."
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "d"
      ],
      "explanation": "Statements commonly end with semicolons, not source line breaks. The header, entry function and success return each have different jobs.",
      "example": "Two statements can occupy one source line and still need their separators."
    },
    {
      "id": "q3",
      "type": "single_correct",
      "prompt": "What does `std::cout << 6 << 2;` print?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "8"
        },
        {
          "id": "b",
          "text": "6 2"
        },
        {
          "id": "c",
          "text": "The characters `6 << 2`"
        },
        {
          "id": "d",
          "text": "62"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "Output chaining sends 6 and then 2 with no separator. Addition needs `+`; literal source text needs quotes.",
      "example": "Send `' '` explicitly to obtain two separated numbers."
    },
    {
      "id": "q4",
      "type": "multiple_correct",
      "prompt": "What is true of `std::cin >> a >> b;` for valid integer input?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "A newline can separate the numbers."
        },
        {
          "id": "b",
          "text": "It automatically prints a prompt."
        },
        {
          "id": "c",
          "text": "The variables must already be declared."
        },
        {
          "id": "d",
          "text": "Every Enter press ends the input stream."
        }
      ],
      "correctOptionIds": [
        "a",
        "c"
      ],
      "explanation": "Integer extraction skips whitespace, and the destination variables must exist. It does not print prompts; Enter normally submits a line rather than ending the stream.",
      "example": "Input `3` and then `8` on separate lines supplies two integers."
    },
    {
      "id": "q5",
      "type": "single_correct",
      "prompt": "Starting with `a = 4` and `b = 7`, what is `a` after `a = a + b;`?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "4"
        },
        {
          "id": "b",
          "text": "11"
        },
        {
          "id": "c",
          "text": "7"
        },
        {
          "id": "d",
          "text": "An impossible equation"
        }
      ],
      "correctOptionIds": [
        "b"
      ],
      "explanation": "Evaluate the right side with the old values, then store 11 in a. Assignment is an update, not an algebraic equality constraint.",
      "example": "The value of b remains 7."
    },
    {
      "id": "q6",
      "type": "single_correct",
      "prompt": "The statement requires only a total. Which output is appropriate for total 23?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "`Enter prices: 23`"
        },
        {
          "id": "b",
          "text": "`Total = 23`"
        },
        {
          "id": "c",
          "text": "`23` followed by a newline"
        },
        {
          "id": "d",
          "text": "`9 + 14 = 23`"
        }
      ],
      "correctOptionIds": [
        "c"
      ],
      "explanation": "Only the requested answer belongs in batch output. The other choices add unrequested words or an equation.",
      "example": "Compute with descriptive variable names; print only the specified result."
    },
    {
      "id": "q7",
      "type": "multiple_correct",
      "prompt": "Which observations about output timing are correct?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "`std::endl` ends a line and requests a flush."
        },
        {
          "id": "b",
          "text": "`'\\n'` guarantees output is immediately visible."
        },
        {
          "id": "c",
          "text": "Untying `cin` removes its automatic flush of the tied output stream."
        },
        {
          "id": "d",
          "text": "Fast-input settings guarantee acceptance."
        }
      ],
      "correctOptionIds": [
        "a",
        "c"
      ],
      "explanation": "A newline and a flush are separate operations. Untying changes automatic flushing; it does not change algorithms or guarantee time limits.",
      "example": "An interactive prompt can explicitly use `std::flush`."
    },
    {
      "id": "q8",
      "type": "single_correct",
      "prompt": "Which header is the portable choice for today's input/output?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "`<iostream>`"
        },
        {
          "id": "b",
          "text": "`<bits/stdc++.h>` on every compiler"
        },
        {
          "id": "c",
          "text": "No header, because main supplies cout"
        },
        {
          "id": "d",
          "text": "A header whose name matches your executable"
        }
      ],
      "correctOptionIds": [
        "a"
      ],
      "explanation": "iostream is the standard stream header. bits/stdc++.h is an implementation-specific convenience; main and executable names do not declare streams.",
      "example": "Include the library facility you use."
    },
    {
      "id": "q9",
      "type": "single_correct",
      "prompt": "For `first = 12` and `second = 18`, which expression doubles the whole total?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "`first + second * 2`"
        },
        {
          "id": "b",
          "text": "`first * second + 2`"
        },
        {
          "id": "c",
          "text": "`first + second + 2`"
        },
        {
          "id": "d",
          "text": "`(first + second) * 2`"
        }
      ],
      "correctOptionIds": [
        "d"
      ],
      "explanation": "Parentheses make the addition happen first, giving 60. The other expressions double only one term, multiply the prices, or add two.",
      "example": "12 + 18 * 2 gives 48."
    },
    {
      "id": "q10",
      "type": "multiple_correct",
      "prompt": "Compilation reports several errors after a missing semicolon. Which responses help?",
      "codeSnippet": null,
      "options": [
        {
          "id": "a",
          "text": "Fix the first relevant diagnostic and rebuild."
        },
        {
          "id": "b",
          "text": "Inspect the preceding source line too."
        },
        {
          "id": "c",
          "text": "Trust an old executable as proof the source is fixed."
        },
        {
          "id": "d",
          "text": "Compare the rebuilt program with hand-calculated output."
        }
      ],
      "correctOptionIds": [
        "a",
        "b",
        "d"
      ],
      "explanation": "One syntax error can trigger several later messages. Successful rebuilding and independent expected outputs test different aspects of correctness; a stale executable tests neither edit.",
      "example": "Repair syntax first, then check whether the answer is the intended one."
    }
  ]
}
```
