# Day 3: Control Flow Without Hidden Magic

**Duration: 4 hours | Focus: make decisions, repetition, and stopping conditions readable as policy**

## Why this day exists

Yesterday's program could store facts and calculate with them. It still performed every statement in order.

A useful program must sometimes refuse work, choose one response, or repeat a step.

The danger is not learning a few keywords. The danger is writing a path that looks reasonable but takes the wrong turn at one exact boundary.

A clear branch or loop should survive a pencil trace before it earns a run.

When behavior is wrong, that trace should reveal the first value that went the wrong way.

---

## The plausible branch that lies at the boundary

The dispatch policy says:

> Two litres or more is enough water to dispatch a team.

The obvious first program is close:

```go
package main

import "fmt"

func main() {
	water := 2

	if water > 2 {
		fmt.Println("enough for dispatch")
	} else {
		fmt.Println("hold dispatch")
	}
}
```

It compiles. It runs. It prints:

```text
hold dispatch
```

The syntax is valid and the type is correct. The failure is that `>` excludes equality while the written policy includes it.

The repair is one character, `water >= 2`. Before applying it, we need a model that makes the wrong turn visible instead of making boundary operators a guessing game.

---

## Predict three routes before the reveal

For each value, write the boolean result and the output of the original `water > 2` program:

```text
water = 1
water = 2
water = 3
```

Then repeat for `water >= 2`.

Do not settle for "the second condition works." State the exact difference:

```text
2 > 2   -> false
2 >= 2  -> true
```

The value exactly at the threshold is the evidence that distinguishes the two policies.

---

## Control flow is a route map

```text
current values
     |
     v
 boolean question? ---- false ----> one route
     |
    true
     v
 another route
     |
     v
 next statement after the decision
```

An `if` chooses a route. A loop returns to an earlier question. A `switch` names several alternative routes.

None of those structures understands "safe," "valid," or "fair." The author writes that meaning as boolean expressions and order.

A **boolean expression** is an expression that produces the `bool` values `true` or `false` from Day 2. Control flow consumes those values to choose where execution goes next.

The debugging habit follows directly:

```text
replace names with concrete values
evaluate the boolean
follow only the route that result permits
```

---

## Retrieve yesterday, then repair the threshold

Closed notes:

1. Why does `float64(7 / 10)` remain zero?
2. What is the difference between `:=` and `=`?
3. What is the zero value of `bool`?
4. Which outputs should `water >= 2` produce for water values 1, 2, and 3?

Feedback:

```text
1 >= 2 -> false -> hold dispatch
2 >= 2 -> true  -> enough for dispatch
3 >= 2 -> true  -> enough for dispatch
```

The older prerequisite matters here: comparisons produce the `bool` values that direct execution. If `bool` still feels like a printed word rather than a two-valued type, rerun Day 2's comparison example before continuing.

---

## Comparisons turn values into decisions

Go provides six comparison operators for ordered primitive values:

```go
water := 2

fmt.Println(water == 2)
fmt.Println(water != 2)
fmt.Println(water < 2)
fmt.Println(water <= 2)
fmt.Println(water > 2)
fmt.Println(water >= 2)
```

Output:

```text
true
false
false
true
false
true
```

Read them precisely:

- `==` asks whether values are equal. Assignment uses one `=`, so equality needs two.
- `!=` asks whether values are not equal.
- `<` and `>` exclude equality.
- `<=` and `>=` include equality.

The common failure is not forgetting what the symbols mean. It is translating an English boundary carelessly. Underline words such as "at least," "more than," "up to," and "before" in the policy before choosing an operator.

---

## Go requires a real boolean condition

This is valid:

```go
water := 2
enough := water >= 2

if enough {
	fmt.Println("dispatch")
}
```

This is not:

```go
if water {
	fmt.Println("dispatch")
}
```

`water` is an `int`, not a `bool`. Go does not decide that zero means false and nonzero means true. It also does not treat empty strings as false.

The compiler's refusal makes the policy explicit. You must write the actual question: `water > 0`, `water >= 2`, or another comparison that states what the number means.

That is why Go has no list of truthy and falsy primitive values to memorize. The condition's type must be `bool`.

---

## Read every part of `if`

```go
if water >= 2 {
	fmt.Println("enough")
}
```

- `if` begins a conditional statement.
- `water >= 2` is the boolean expression evaluated now.
- `{` begins the body selected when the result is true.
- `}` ends that body.

Go does not require parentheses around the condition. Writing `if (water >= 2)` is accepted, but `gofmt` removes unnecessary parentheses. The standard shape keeps the condition visually close to the body.

Braces are required. This prevents indentation from pretending that two statements are guarded when only one really is.

After the body finishes, execution continues after the whole `if` statement.

---

## `else` owns the false route

When exactly one of two responses must happen:

```go
if water >= 2 {
	fmt.Println("enough")
} else {
	fmt.Println("hold")
}
```

The condition is evaluated once. If true, the first body runs and the `else` body is skipped. If false, the first body is skipped and the `else` body runs.

Exactly one body runs in this two-way statement. Then execution rejoins below it:

```text
             true -> print enough --+
water >= 2?                         +-> next statement
             false -> print hold ---+
```

Keep `else` on the same line as the closing brace:

```go
} else {
```

Go inserts semicolons automatically at certain line endings. Placing `else` on a new line can make the prior `}` look like the end of a complete statement and produce a syntax error. `gofmt` preserves the idiomatic same-line shape.

```quiz
{
  "prompt": "A minimum of 2 litres is allowed. Which condition represents that boundary exactly?",
  "multiple": false,
  "options": [
    {"text":"`water > 2`","correct":false},
    {"text":"`water == 3`","correct":false},
    {"text":"`water >= 2`","correct":true},
    {"text":"`water < 2`","correct":false}
  ],
  "explanation": "The phrase `minimum of 2` includes equality, so `>=` is required. Testing 1, 2, and 3 exposes the difference between `>` and `>=`."
}
```

---

## Combine policies only after each question is clear

Dispatch now requires enough water and a working radio:

```go
water := 3
radioReady := true

fmt.Println(water >= 2 && radioReady)
```

`&&` means logical AND. The whole result is true only when both operands are true.

Suppose dispatch may use either the primary or backup radio:

```go
primaryReady := false
backupReady := true

fmt.Println(primaryReady || backupReady)
```

`||` means logical OR. The result is true when at least one operand is true.

`!` means logical NOT. It flips one boolean:

```go
blocked := false
fmt.Println(!blocked)
```

Output is `true`.

Use names that let the expression read as policy:

```go
canDispatch := water >= 2 && radioReady && !blocked
```

The compiler checks that every operand is boolean. It cannot check whether AND or OR matches the real rule, so trace combinations at the boundaries.

---

## Short-circuiting prevents unnecessary evaluation

Logical operators evaluate left to right, but they stop once the result is decided.

For AND, a false left side makes the whole expression false, so the right side is skipped:

```go
groups := 0
safe := groups != 0 && 12/groups > 2
fmt.Println(safe)
```

Output:

```text
false
```

The division is never evaluated, so the program does not panic on division by zero.

Reverse the order:

```go
safe := 12/groups > 2 && groups != 0
```

Now the dangerous division happens before the guard and the process panics.

For OR, a true left side already makes the whole expression true, so the right side is skipped.

> Put the cheap safety condition before the operation that depends on it.

Do not use short-circuiting as a clever substitute for readable multi-step policy. Its best use is a compact dependency such as "nonzero, and then safe to divide."

---

## Several branches are checked in order

The desk labels water levels:

```go
water := 7

if water >= 10 {
	fmt.Println("full")
} else if water >= 5 {
	fmt.Println("ready")
} else if water > 0 {
	fmt.Println("low")
} else {
	fmt.Println("empty")
}
```

Go evaluates conditions from top to bottom and runs the first matching body. The rest are skipped.

That order is part of the policy. Put `water > 0` first and a value of 12 is labelled `low`, because the broad condition succeeds before the more specific `>= 10` condition is reached.

Trace `0`, `1`, `4`, `5`, `9`, and `10`. Those values sit at or beside every threshold and reveal gaps and mistaken order.

The lesson is not "always sort numbers descending." It is: order overlapping conditions so the first true branch is the intended one.

---

## An `if` initializer contains temporary work

The obvious version calculates before the decision:

```go
remaining := capacity - loaded
if remaining >= request {
	fmt.Println("approve")
}
fmt.Println("remaining:", remaining)
```

This is right when later code genuinely needs `remaining`.

If the value exists only to choose and explain this one branch, leaving it available afterward gives later code an unnecessary name to misuse.

Go allows one small statement before the condition:

```go
if remaining := capacity - loaded; remaining >= request {
	fmt.Println("approve")
} else {
	fmt.Println("short by", request-remaining)
}
```

The semicolon separates the initializer from the boolean condition.

`remaining` exists in the condition and both branch bodies because all are part of the same `if` statement. It does not exist after the statement.

Trying to print it later produces:

```text
undefined: remaining
```

That failure is the promised containment. The name cannot leak beyond its job.

```quiz
{
  "prompt":"Where is `remaining` available in `if remaining := capacity-loaded; remaining >= request { ... } else { ... }`?",
  "multiple":false,
  "options":[
    {"text":"Only inside the true body","correct":false},
    {"text":"Inside the condition and both branch bodies","correct":true},
    {"text":"Everywhere after the `if`","correct":false},
    {"text":"Only before the semicolon","correct":false}
  ],
  "explanation":"The initializer's name belongs to the entire `if` statement, including its condition and both bodies, but not later statements."
}
```

---

## Guard clauses appear when nesting starts to hide the main route

The first validation grows naturally:

```go
if groups > 0 {
	if people > 0 {
		if water >= people*2 {
			fmt.Println("schedule can be built")
		}
	}
}
```

It is not incorrect. Add a message for every failure and the normal action moves farther right while every reader must remember which outer conditions still hold.

A **guard clause** handles a rejecting case and leaves the current function immediately:

```go
if groups <= 0 {
	fmt.Println("groups must be positive")
	return
}

if people <= 0 {
	fmt.Println("people must be positive")
	return
}

if water < people*2 {
	fmt.Println("not enough water")
	return
}

fmt.Println("schedule can be built")
```

`return` ends the current function. Here the current function is `main`, so no later Go statements in `main` execute and the process soon ends.

The valid route stays flat because invalid cases have complete responses and leave.

Do not turn this into "every `if` should return." A clear two-way choice is often best expressed with `if` and `else`. Guards fit rejecting cases whose only correct next action is to stop this function's work.

---

## Repetition first works by copying

The desk needs to print three equipment checks. The first attempt is valid:

```go
fmt.Println("check person 1")
fmt.Println("check person 2")
fmt.Println("check person 3")
```

It works for three. Change the requirement to one hundred and the weakness becomes visible: one hundred copies, one hundred numbers to edit, and one hundred chances to skip or duplicate a person.

The repeated part is the action. The changing part is the number. A loop states those separately.

Go has one loop keyword, `for`, with three useful shapes. The first makes a counted sequence explicit.

---

## The three-part `for` loop is a small machine

```go
for person := 1; person <= 3; person++ {
	fmt.Println("check person", person)
}
```

Its header has three statements separated by semicolons:

```text
for initialization ; continuation question ; update
    person := 1      person <= 3          person++
```

The execution order is:

1. Run `person := 1` once.
2. Evaluate `person <= 3` before a body run.
3. If false, leave the loop.
4. If true, run the body.
5. Run `person++`, which means add one to `person`.
6. Return to step 2.

The loop variable exists only inside the loop statement. Using `person` afterward produces `undefined: person`.

---

## Predict the counted trace before running

For this loop:

```go
for person := 1; person <= 3; person++ {
	fmt.Println(person)
}
```

Complete the trace:

```text
person before test  condition  body output  person after update
1                   true       1            2
2                   true       2            3
3                   true       3            4
4                   false      none         no update
```

The body runs three times, not four. The value 4 exists only long enough to fail the next condition.

Now change the condition to `person < 3`:

```text
person 1 -> true -> print 1
person 2 -> true -> print 2
person 3 -> false -> stop
```

Person 3 disappears. That is an **off-by-one error**, a boundary mistake where a loop runs one time too few or too many.

```quiz
{
  "prompt":"How many times does `for i := 0; i < 3; i++` run its body?",
  "multiple":false,
  "options":[
    {"text":"Four times, for 0 through 3","correct":false},
    {"text":"Twice, for 1 and 2","correct":false},
    {"text":"Three times, for 0, 1, and 2","correct":true},
    {"text":"It does not stop","correct":false}
  ],
  "explanation":"The condition is checked before each body run. Values 0, 1, and 2 satisfy `i < 3`; 3 does not."
}
```

---

## Start, condition, and update must agree on the label system

Both loops run three times:

```go
for i := 0; i < 3; i++ {
	fmt.Println(i)
}

for person := 1; person <= 3; person++ {
	fmt.Println(person)
}
```

Their visible labels differ:

```text
first loop:  0, 1, 2
second loop: 1, 2, 3
```

Neither is universally correct. Zero-based positions are natural when working with indexed collections later. Human ticket and person labels often begin at one.

The failure comes from mixing systems:

```go
for person := 1; person < 3; person++ {
```

Start-at-one with less-than-three prints only 1 and 2. Decide what the numbers mean, then choose all three header parts together.

---

## The condition-only loop exposes moving state

Sometimes the number of repetitions is not best expressed as a fixed count. You have a state and continue while a condition holds:

```go
remaining := 3

for remaining > 0 {
	fmt.Println("pack one; remaining before:", remaining)
	remaining--
}
```

Output:

```text
pack one; remaining before: 3
pack one; remaining before: 2
pack one; remaining before: 1
```

This shape resembles `while` in other languages. Go still uses the single keyword `for`.

`remaining--` means subtract one from the existing variable. It is the movement that eventually makes `remaining > 0` false.

Every condition-only loop needs a termination argument:

```text
starting state -> body changes state -> changed state approaches stop boundary
```

---

## Break a loop on purpose and diagnose it

Remove `remaining--`:

```go
remaining := 3

for remaining > 0 {
	fmt.Println("pack one; remaining:", remaining)
}
```

The source compiles. The program repeatedly prints 3 because nothing changes the value used by the condition.

Stop it in the terminal with Control-C. That key combination asks the operating system to interrupt the running process.

Now diagnose with three columns:

```text
iteration  remaining before  remaining after  next condition
1          3                 3                3 > 0 -> true
2          3                 3                3 > 0 -> true
3          3                 3                3 > 0 -> true
```

You do not need to stare at the loop longer. The trace proves there is no evidence of progress toward false.

The smallest repair is to update the relevant state exactly once per successful iteration.

---

## The indefinite loop says the stop lives inside

Omit the condition entirely:

```go
for {
	fmt.Println("checking")
	break
}
```

`for {}` means there is no header condition. The loop continues until control leaves through something inside, such as `break` or `return`, or until an external event stops the process.

`break` exits the nearest loop and continues with the first statement after that loop.

This is not automatically an infinite bug. It is the honest form when the stop condition is discovered in the body rather than known at the top.

It becomes a bug when no reachable path can leave. The debugging question is: under which concrete state does execution reach `break` or `return`?

---

## `continue` skips work, not the loop itself

```go
for i := 1; i <= 4; i++ {
	if i == 2 {
		continue
	}

	fmt.Println(i)
}
```

Output:

```text
1
3
4
```

`continue` skips the remainder of the current body and begins the next iteration. In a three-part `for`, Go runs the update statement `i++` before checking the condition again. That is why the loop does not stay stuck at 2.

Now consider a condition-only loop:

```go
i := 1
for i <= 4 {
	if i == 2 {
		continue
	}
	i++
}
```

This gets stuck at 2 because `continue` jumps past the only update. The keyword is not dangerous by itself; the placement of state movement is.

When using `continue`, trace whether every continuing path still advances the state that controls termination.

---

## `break`, `continue`, and `return` leave different regions

Keep the three exits separate:

```text
continue -> skip rest of this iteration, loop may run again
break    -> leave nearest loop or switch, function continues
return   -> leave the current function entirely
```

For example:

```go
for i := 1; i <= 5; i++ {
	if i == 2 {
		continue
	}
	if i == 4 {
		break
	}
	fmt.Println(i)
}

fmt.Println("after loop")
```

Output:

```text
1
3
after loop
```

At 2, printing is skipped but the loop continues. At 4, the loop ends. The final line still runs because `break` did not leave `main`.

---

## Repeated equality questions reveal a switch

The first version is valid:

```go
if code == 0 {
	fmt.Println("unknown")
} else if code == 1 {
	fmt.Println("open")
} else if code == 2 {
	fmt.Println("closed")
} else {
	fmt.Println("invalid")
}
```

The repeated subject `code` and repeated `==` obscure the fact that this is one value matched against named alternatives.

A value switch makes that shape visible:

```go
switch code {
case 0:
	fmt.Println("unknown")
case 1:
	fmt.Println("open")
case 2:
	fmt.Println("closed")
default:
	fmt.Println("invalid")
}
```

Go evaluates `code`, finds the first matching case, runs that body, and continues after the switch.

`default` handles the no-match route. It can appear elsewhere in the source order, but putting it last usually matches how people scan alternatives.

---

## Go does not fall through by default

Programmers coming from C or JavaScript often write a defensive `break` after every case because those languages continue into later cases unless stopped.

Go made the opposite default:

```go
switch code {
case 1:
	fmt.Println("open")
case 2:
	fmt.Println("closed")
}

fmt.Println("done")
```

For `code == 1`, output is:

```text
open
done
```

The `case 2` body does not run. There is no implicit fallthrough.

Why choose that behavior? Most cases represent alternative routes, and accidental continuation has historically caused bugs. Go makes the common safe meaning automatic.

The keyword `fallthrough` explicitly enters the next case body, but it does not test the next case's expression. That surprising behavior makes it a rare tool. Prefer listing multiple matching values in one case when they share behavior:

```go
case 1, 2:
	fmt.Println("known state")
```

```quiz
{
  "prompt":"A matching Go `switch` case finishes and has no `fallthrough`. What happens next?",
  "multiple":false,
  "options":[
    {"text":"Every later case body runs","correct":false},
    {"text":"The same case repeats","correct":false},
    {"text":"The program restarts `main`","correct":false},
    {"text":"Control continues after the switch","correct":true}
  ],
  "explanation":"Go cases stop automatically. Explicit `fallthrough` is required to enter the next body, and even then the next case expression is not tested."
}
```

---

## An expressionless switch reads as ordered policy

Thresholds do not compare one value to fixed equal alternatives. Each route has a different boolean question:

```go
temperature := 7

switch {
case temperature < 0:
	fmt.Println("ice risk")
case temperature < 10:
	fmt.Println("cold")
case temperature < 25:
	fmt.Println("mild")
default:
	fmt.Println("hot")
}
```

With no expression after `switch`, Go tests each case as a boolean from top to bottom and runs the first true body.

For `temperature == 7`:

```text
7 < 0  -> false
7 < 10 -> true  -> print cold, stop testing cases
```

Move `temperature < 25` to the top and 7 becomes mild. The code still compiles; the policy order is wrong.

Trace -1, 0, 9, 10, 24, and 25. These are below, at, and above each boundary. A typical value such as 17 cannot expose every operator mistake.

---

## Choose among `if`, value `switch`, and expressionless `switch`

Use the shape of the policy, not a preference for one keyword:

```text
one boolean question
  -> if

one value compared with several exact alternatives
  -> switch value

several ordered boolean thresholds
  -> expressionless switch, or an if / else if chain
```

An expressionless switch and an `if / else if` chain can express the same threshold policy. Choose the form that makes the repeated structure clearest to the reader.

Do not force a `switch` into a two-way yes/no decision. Do not repeat `code ==` through a long chain when a value switch states the alternatives directly.

The best construct makes the decision visible before the reader inspects every line.

---

## Build a fair rotation after validation

The dispatch desk must assign seven people across three groups in rotation:

```text
person 1 -> group 1
person 2 -> group 2
person 3 -> group 3
person 4 -> group 1
...
```

Day 2 taught `%` as the remainder operator. For three groups, the remainders cycle:

```text
0 % 3 -> 0
1 % 3 -> 1
2 % 3 -> 2
3 % 3 -> 0
```

Human labels begin at 1, so shift before and after remainder:

```text
(person - 1) % groups + 1
```

For people 1 through 4, that yields group labels 1, 2, 3, 1.

The calculation works only when `groups` is positive. Validation must happen before the loop reaches `% groups`.

---

## The realistic program

```go
package main

import "fmt"

func main() {
	people := 7
	groups := 3

	if people <= 0 {
		fmt.Println("people must be positive")
		return
	}

	if groups <= 0 {
		fmt.Println("groups must be positive")
		return
	}

	for person := 1; person <= people; person++ {
		group := (person-1)%groups + 1
		fmt.Printf("person %d -> group %d\n", person, group)
	}
}
```

Output:

```text
person 1 -> group 1
person 2 -> group 2
person 3 -> group 3
person 4 -> group 1
person 5 -> group 2
person 6 -> group 3
person 7 -> group 1
```

Each part now has a reason:

- guard clauses reject values for which the later arithmetic has no sensible policy;
- the counted loop exposes the label range 1 through `people`;
- remainder creates a repeating zero-based cycle;
- the surrounding subtraction and addition translate between human labels and that cycle.

---

## See the runtime failure the guard prevents

Set `groups := 0` and temporarily remove its guard. The program compiles because `groups` is a variable and zero is a valid integer value.

At runtime, the first iteration reaches:

```go
(person - 1) % groups
```

The process panics with an integer divide-by-zero message. A **panic** is a runtime failure that stops normal execution when the program reaches an operation it cannot complete.

This is different from a compiler error:

```text
compiler error -> source rejected, new process never begins
panic          -> valid program began, reached invalid runtime state
```

Restore the guard. The goal is not to catch the panic afterward. The policy knows zero groups are invalid, so it prevents the operation from being reached.

```quiz
{
  "prompt": "Why must `groups <= 0` be rejected before `(person-1) % groups`?",
  "multiple": false,
  "options": [
    {"text":"Remainder by zero panics when the running process reaches it","correct":true},
    {"text":"Every positive divisor is a compile error","correct":false},
    {"text":"`%` formats strings inside arithmetic","correct":false},
    {"text":"The guard changes `groups` into a constant","correct":false}
  ],
  "explanation": "A variable may legally hold zero, so compilation can succeed. At runtime integer division or remainder by zero cannot complete and panics. The guard prevents that state from reaching the operation."
}
```

---

## Add changed policy without tangling the route

The desk adds one rule: every fifth ticket needs a manual review marker.

The loop already owns one person at a time, so the condition belongs inside it:

```go
for person := 1; person <= people; person++ {
	group := (person-1)%groups + 1

	if person%5 == 0 {
		fmt.Printf("person %d -> group %d, review\n", person, group)
	} else {
		fmt.Printf("person %d -> group %d\n", person, group)
	}
}
```

Do not introduce an extra counter. `person` already represents the ticket number, and `person%5 == 0` directly asks whether five divides it with no remainder.

Trace people 4, 5, and 6. The changed task tests whether you can choose a branch inside a known loop from the policy, rather than being told "use modulo here."

---

## Debug branches by locating the first wrong route

For wrong branching, record the input, boolean result, and chosen path:

```text
symptom: water 2 is held
input: water = 2
condition: 2 > 2 -> false
chosen path: hold
policy: 2 is allowed
first disagreement: comparison excludes equality
repair: >=
```

For an ordered chain or switch, add every condition reached before the chosen path:

```text
temperature = 7
7 < 25 -> true -> mild
expected cold
first disagreement: broad mild case appears before cold case
```

Do not rewrite the whole decision before finding that first disagreement. A trace converts a feeling about the final output into one falsifiable line.

---

## Debug loops by proving movement and termination

Use four columns:

```text
state before -> condition -> body effect -> state after
```

For a missing final person:

```text
person before: 7
condition: 7 < 7 -> false
body: skipped
state after: none
first disagreement: condition excludes intended final label
```

For a nonterminating countdown:

```text
remaining before: 3
condition: 3 > 0 -> true
body effect on remaining: none
remaining after: 3
next condition: true again
```

For a `continue` trap:

```text
i before: 2
condition: i == 2 -> true
continue skips: i++
i after: 2
next condition: i <= 4 -> true again
```

The exact procedure is:

1. choose the smallest input that still fails;
2. write the initial state;
3. evaluate the condition with concrete values;
4. record which statements actually run;
5. record the new state;
6. stop at the first row that differs from policy.

---

## Common mistakes

| Mistake | Why it hurts | Better move |
|---|---|---|
| Using `>` when the minimum is included | The exact threshold takes the wrong route | Test below, at, and above the boundary |
| Using `=` when asking equality | Assignment and comparison are different jobs | Use `==` for equality |
| Trying `if count` | `int` is not `bool` in Go | Write the actual comparison |
| Putting a dangerous operation before its guard | Left-to-right evaluation reaches failure first | Put the cheap validity check first |
| Ordering a broad branch before a narrow one | The first true route hides later policy | Trace every boundary in source order |
| Expecting an `if` initializer afterward | Its scope ends with the statement | Declare earlier only if later code needs it |
| Nesting complete rejection cases | The normal path drifts right and becomes hard to scan | Use guard clauses when rejection ends the work |
| Mixing zero-based and one-based loop bounds | One item is skipped or added | Decide what the counter labels mean |
| Updating no loop state | The condition can remain true forever | Trace state before and after the body |
| Placing `continue` before the only update | A condition-only loop can freeze on one value | Ensure every continuing path advances control state |
| Confusing `break` with `return` | Code after the loop runs unexpectedly or is skipped unexpectedly | Name the region each keyword exits |
| Expecting switch fallthrough | You predict extra case bodies | Go exits after a match by default |
| Using `fallthrough` to test the next case | The next expression is not checked | Combine case values or rewrite the policy |
| Taking remainder before checking zero | The running process panics | Guard the divisor first |

---

## Practice: five reps from trace to transfer

Write real `.go` files, write predictions first, and run them. Keep the trace beside the output.

### 1. Recall: reconstruct one branch

Write a program that prints `safe` when a temperature is from 0 through 35 inclusive, otherwise `unsafe`.

Test -1, 0, 35, and 36. Done means each boundary output matches a written boolean trace, not only your intuition.

### 2. Mechanics: scope and ordered policy

Use an `if` initializer to compute `remaining := capacity - loaded`. Print an approval or shortage inside the statement, then deliberately reference `remaining` afterward and read the compiler error.

Next, write an ordered water-level chain and prove with boundary values that the most specific intended route wins.

### 3. Loop proof: predict, break, repair

Trace `for i := 1; i <= 3; i++` on paper. Run it. Change `<=` to `<` and name the missing label.

Then write a condition-only countdown, remove its update, observe the repeated state, stop the process, and repair it. Done means you can show why it terminates using a decreasing value and a false boundary.

### 4. Deliberate control transfer

For numbers 1 through 8, skip 3 with `continue`, stop before printing 7 with `break`, and print `after loop` once the loop ends.

Predict the full output first. Then rewrite as a condition-only loop and make sure no `continue` path skips the counter update.

### 5. Transfer: inspection-ticket routing

Route a positive number of tickets across a positive number of desks. Reject either nonpositive input before remainder. Mark every fifth ticket for manual review. Add a priority policy:

```text
ticket numbers 1 through 3 -> urgent
ticket numbers 4 through 10 -> standard
later tickets -> backlog
```

Choose `if`, value `switch`, expressionless `switch`, and loop forms based on the policy shape without being told which one belongs where. Test below, at, and above every threshold, plus zero desks.

If you use help, record it. Close the answer and reconstruct the termination trace and first-true-case explanation independently later.

Keep at most two delayed prompts:

- Reconstruct a loop trace with state before, condition, body effect, and state after.
- Explain why moving one expressionless-switch case can change output even when every condition remains the same.

Repeat the transfer task later with different thresholds. Recognition of today's code is not evidence that you can select the structure under a changed policy.

---

## Cheat sheet

```text
BOOLEAN QUESTIONS
  ==  !=                 equal, not equal
  <  <=  >  >=           ordered comparisons
  a && b                 both must be true; false left skips right
  a || b                 at least one true; true left skips right
  !a                     logical not
  Go conditions require bool; 0 and "" are not booleans

BRANCHING
  if condition { ... }                 choose true route
  if init; condition { ... }           temporary scoped to full if
  else                                 false route
  else if                              ordered next question
  return                               leave current function
  first true branch wins in an ordered chain

LOOPS
  for init; condition; update { ... }  counted loop
  for condition { ... }                condition-only loop
  for { ... }                          stop condition lives inside
  break                                leave nearest loop or switch
  continue                             begin next iteration
  prove: state moves toward making condition false

SWITCH
  switch value { case x: ... }         exact alternatives
  switch { case condition: ... }       ordered boolean alternatives
  default                              route when no case matches
  no implicit fallthrough

DEBUGGING
  branch: input -> boolean -> chosen route
  loop: state before -> condition -> body effect -> state after
  test below, at, and above every boundary
```

---

## Tomorrow

Control flow can choose and repeat statements, but the rotation policy still lives as one copied block inside `main`. The next problem is giving reusable behavior a name, defining its inputs and outputs, and guaranteeing cleanup even when a function leaves early.

```finalquiz
{
  "title":"Day 3: Visible control flow",
  "questions":[
    {"id":"q1","type":"single_correct","prompt":"A minimum of 2 litres is allowed. Which condition accepts the boundary?","codeSnippet":null,"options":[{"id":"a","text":"`water > 2`"},{"id":"b","text":"`water == 3`"},{"id":"c","text":"`water >= 2`"},{"id":"d","text":"`water < 2`"}],"correctOptionIds":["c"],"explanation":"`>=` includes equality. `>` rejects exactly 2, equality with 3 accepts one value, and `<` selects the invalid side.","example":"Trace 1, 2, and 3."},
    {"id":"q2","type":"multiple_correct","prompt":"Where can a name from an `if` initializer be used?","codeSnippet":null,"options":[{"id":"a","text":"In the condition"},{"id":"b","text":"In the true branch"},{"id":"c","text":"In the `else` branch"},{"id":"d","text":"After the entire `if` statement"}],"correctOptionIds":["a","b","c"],"explanation":"The initializer belongs to the full `if` statement, including both branches, but its scope ends afterward.","example":"`if n := 3; n > 0 { ... } else { ... }`."},
    {"id":"q3","type":"single_correct","prompt":"How many body runs occur for `for i := 0; i < 4; i++`?","codeSnippet":null,"options":[{"id":"a","text":"Four"},{"id":"b","text":"Three"},{"id":"c","text":"Five"},{"id":"d","text":"It never stops"}],"correctOptionIds":["a"],"explanation":"Values 0, 1, 2, and 3 pass. At 4 the condition is false before the body.","example":"List accepted values instead of guessing from the bound."},
    {"id":"q4","type":"single_correct","prompt":"A condition-only loop stays at `remaining == 5`. What is the likely cause?","codeSnippet":null,"options":[{"id":"a","text":"`for` cannot test conditions"},{"id":"b","text":"The body does not move state toward the stop condition"},{"id":"c","text":"Five is not an integer"},{"id":"d","text":"Go requires a `while` keyword"}],"correctOptionIds":["b"],"explanation":"Go's condition-only `for` is valid. If relevant state never changes, a true condition stays true.","example":"Trace remaining before and after each body."},
    {"id":"q5","type":"multiple_correct","prompt":"Which statements about `switch` are correct?","codeSnippet":null,"options":[{"id":"a","text":"The first matching case normally wins"},{"id":"b","text":"Cases fall through automatically"},{"id":"c","text":"`default` handles no match"},{"id":"d","text":"An expressionless switch tests boolean cases in order"}],"correctOptionIds":["a","c","d"],"explanation":"Go exits after the first match unless explicit `fallthrough` is used. Default and ordered boolean cases behave as described.","example":"Put narrower thresholds before broader overlapping ones."},
    {"id":"q6","type":"single_correct","prompt":"What does `continue` do inside a loop?","codeSnippet":null,"options":[{"id":"a","text":"Ends the function"},{"id":"b","text":"Ends the process"},{"id":"c","text":"Exits the loop permanently"},{"id":"d","text":"Skips the remaining body and begins the next iteration"}],"correctOptionIds":["d"],"explanation":"`continue` advances to the next iteration. `return` leaves the function and `break` leaves the loop.","example":"In a three-part loop, the update still runs before the next condition check."},
    {"id":"q7","type":"single_correct","prompt":"Why guard `groups <= 0` before `person % groups`?","codeSnippet":null,"options":[{"id":"a","text":"Remainder by zero panics at runtime"},{"id":"b","text":"Positive divisors are compile errors"},{"id":"c","text":"`%` formats strings here"},{"id":"d","text":"Guards make variables constant"}],"correctOptionIds":["a"],"explanation":"The expression compiles with a variable divisor, but reaching a zero divisor at runtime panics. Validate before entering the loop.","example":"Reject invalid group counts before calculating a rotation."},
    {"id":"q8","type":"multiple_correct","prompt":"Which are strong boundary tests for `temperature < 10`?","codeSnippet":null,"options":[{"id":"a","text":"9"},{"id":"b","text":"10"},{"id":"c","text":"11"},{"id":"d","text":"Only 5 repeated three times"}],"correctOptionIds":["a","b","c"],"explanation":"Below, at, and above the boundary reveal the operator's exact policy. Repeating one typical value adds little evidence.","example":"Use adjacent values around every threshold."},
    {"id":"q9","type":"single_correct","prompt":"When is a guard clause a strong choice?","codeSnippet":null,"options":[{"id":"a","text":"When every valid path should stop immediately"},{"id":"b","text":"When an invalid case has a complete response and later work must not run"},{"id":"c","text":"Whenever braces appear"},{"id":"d","text":"Only inside loops"}],"correctOptionIds":["b"],"explanation":"A guard handles a rejecting case early and leaves the normal path flat. It is not mandatory for every two-way decision.","example":"Reject nonpositive groups, then build the schedule."},
    {"id":"q10","type":"multiple_correct","prompt":"Which traces help diagnose control flow?","codeSnippet":null,"options":[{"id":"a","text":"Input and boolean result for a branch"},{"id":"b","text":"State before and after each loop body"},{"id":"c","text":"The stop condition at each iteration"},{"id":"d","text":"Only the final output with no intermediate values"}],"correctOptionIds":["a","b","c"],"explanation":"Branches need condition evidence; loops also need state movement and stopping evidence. Final output alone hides the first wrong route.","example":"Find the first trace row that differs from policy."}
  ]
}
```
