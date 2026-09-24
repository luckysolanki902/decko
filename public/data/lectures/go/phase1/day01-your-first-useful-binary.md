# Day 1: Why Go, Go 1.26 & Your First Program

**Duration: 4 hours | Focus: turn readable source into a checked, formatted, reusable program**

## Why this day exists

A text file can describe a program without being a program you can run.

Go gives you a short path from one readable file to one executable file. More importantly, it checks that path before the new program starts.

When something breaks, you need to know who rejected it: the shell, the Go tool, the compiler, or the running program.

That one distinction turns an error from a dead end into a location.

It also explains why changing source text does not change a program you built earlier.

---

## The first attempt works

Create a directory named `trail-status`, enter it, and save this as `main.go`:

```go
package main

import "fmt"

func main() {
	fmt.Println("trail status: open")
}
```

Run:

```bash
go run main.go
```

The terminal prints:

```text
trail status: open
```

This is a real success. You wrote source, Go accepted it, and the computer executed it. Do not let its small size hide what happened.

The tempting mental model is:

```text
main.go  ->  output
```

That model works while everything is correct. It breaks the first time the output is missing, stale, or wrong, because it gives you nowhere to look between the file and the terminal.

---

## Predict before the first failure

Write down three answers before changing the file:

1. If `Println` becomes `Printline`, does `main` begin running and then fail, or does the new program fail to start?
2. If the text changes from `open` to `closed`, will an executable built earlier change too?
3. Does `go run` leave a reusable `trail-status` executable in this directory?

Do not reveal the answers by running yet. A prediction makes the later evidence useful. Without a prediction, a learner can see any output and feel that it was expected all along.

---

## The program travels through four owners

Use this picture for every failure today:

```text
your command
    |
    v
shell  ->  Go tool  ->  compiler  ->  executable  ->  process  ->  output
           chooses      checks and     saved file      one run
           the work     translates
```

Each noun names a different job:

- The **shell** is the terminal program that reads a command such as `go run .` and finds the executable named `go`.
- The **Go tool** is the command-line program named `go`. Its second word, such as `run`, `build`, or `env`, selects a job.
- The **compiler** reads Go source, checks its structure, names, and types, then translates accepted source into machine instructions.
- An **executable** or **binary** is a file containing those instructions in a form the operating system can load.
- A **process** is one running instance of an executable. It starts, performs work, and ends.

A source file is not a sleeping process. An executable is not a process either. You can keep one executable on disk and run it ten times, creating ten separate processes over time.

> Source is the description. A binary is a built snapshot. A process is one execution of that snapshot.

---

## Test the four-owner model

Now change `Println` to `Printline` and run `go run main.go` again.

The important part of the diagnostic is:

```text
undefined: fmt.Printline
```

Nothing inside `main` began executing. The compiler inspected the selector `fmt.Printline`, looked for that name in package `fmt`, and could not find it.

Restore `Println`, then change the text to `trail status: opne`. The program now builds and runs, but prints the wrong word:

```text
trail status: opne
```

The compiler cannot reject that. `"trail status: opne"` is a valid string. Only the person who knows the intended message can call it wrong.

The two failures need different questions:

```text
undefined: fmt.Printline   -> compiler evidence: the source is not a valid program
trail status: opne         -> program evidence: valid instructions express the wrong intent
```

The compiler checks consistency, not your business meaning.

```quiz
{
  "prompt": "`go run main.go` reports `undefined: fmt.Printline`. Which stage produced the message?",
  "multiple": false,
  "options": [
    {"text":"The running program after `main` finished","correct":false},
    {"text":"The compiler before a new program could run","correct":true},
    {"text":"`fmt.Println` while printing","correct":false},
    {"text":"The operating system after saving a final binary","correct":false}
  ],
  "explanation": "An undefined Go name is rejected during compilation. Since compilation failed, the new program did not start. A misspelled message is different: it is valid source, so the process can run and print the wrong intent."
}
```

---

## Before Go reads a file, the shell must find Go

Try to separate these two commands in your mind:

```bash
go version
go run main.go
```

The shell handles the first word, `go`, before any Go source is involved. It searches a list of directories called `PATH` for an executable with that name.

If the shell prints:

```text
command not found: go
```

then no `.go` file was opened. Changing `main.go` cannot repair this failure because the failure happened before the Go tool started.

The useful first checks are whether Go is installed, whether the terminal was reopened after installation changed `PATH`, and whether `go version` works in this same terminal.

This is the first debugging habit of the course: diagnose the earliest owner that could have produced the evidence.

---

## Install and verify Go 1.26

Install the Go 1.26 release family from the official Go distribution for your operating system. An installer places the toolchain on disk and normally updates the command path used by new terminal sessions.

After installation, open a fresh terminal and run:

```bash
go version
```

A result has this shape:

```text
go version go1.26.5 darwin/arm64
```

Read it rather than merely celebrating it:

- `go1.26.5` is the installed toolchain release.
- `darwin` is the target operating system name used for macOS.
- `arm64` is the processor architecture.

Your exact patch number, operating system, and architecture may differ. The evidence that matters is that the command runs and reports a Go 1.26 release.

If it reports an older release, the installation exists but does not match this roadmap. That differs from `command not found`, where the shell cannot locate Go at all.

---

## `go env` shows the toolchain's current context

Run:

```bash
go env GOROOT GOPATH GOOS GOARCH GOMOD
```

An **environment setting** is a named value that influences how a tool runs. This command asks Go to print five settings:

- `GOROOT` is the directory containing the Go distribution, including the compiler and standard library.
- `GOPATH` is a tool-managed workspace used for downloaded module data, build caches, and installed commands. Projects do not have to live inside it.
- `GOOS` is the target operating system.
- `GOARCH` is the target processor architecture.
- `GOMOD` is the path to the `go.mod` governing the current directory, or a value indicating that no module is active.

These are evidence, not five values to memorize. If a command behaves differently in two terminals, `go env` helps reveal whether they are using different toolchains or project contexts.

---

## The current directory is part of the command

The dot in `go run .` means "the package in the current directory." A directory is the folder the shell is currently operating inside.

Run these when location is uncertain:

```bash
pwd
ls
```

`pwd` prints the working directory. `ls` lists its files on macOS and Linux. On Windows PowerShell, `Get-Location` and `Get-ChildItem` provide the same evidence.

If `main.go` lives in `trail-status` but the terminal is one directory above it, `go run .` asks Go to run a different directory. The dot does not mean "find my project somewhere nearby." It is a precise location.

This explains a common loop:

```text
edit trail-status/main.go
run go run . from Desktop
receive a module or package error
edit main.go again
receive the same error
```

The source was never the problem. The command selected the wrong place.

---

## One file works, then project context breaks

`go run main.go` names one file directly, so the first program can run before the directory has a module file.

The more useful project command is:

```bash
go run .
```

The dot asks Go to work with the package in this directory. In a modern project, the Go tool also needs to know which module owns that package. Without a nearby `go.mod`, it may report that no main module can be found.

The obvious first attempt, a single named file, worked. The realistic next step, treating the directory as a project, exposed the missing identity.

That is why `go mod init` arrives now.

---

## Give the project a stable identity

From inside `trail-status`, run:

```bash
go mod init example.com/trail-status
```

The command creates `go.mod`. Its essential lines have this shape:

```text
module example.com/trail-status

go 1.26
```

The **module path** is the project's import identity. It gives packages in this codebase a stable prefix that does not depend on where one developer placed the folder.

`example.com/trail-status` looks like a web address, but the program does not contact that website when it starts. Published projects often match a source host because that makes imports discoverable. For this local project, the example path is sufficient.

The `go 1.26` line records language and module behavior expected by the project. It does not download a compiler and does not replace `go version`; the installed toolchain performs the build.

---

## Module, package, file, and function are different containers

Place these words inside one another:

```text
module: example.com/trail-status
|
+-- directory: trail-status
    |
    +-- package: main
        |
        +-- file: main.go
            |
            +-- function: main
```

A **module** is the versioned code unit named by `go.mod`. It can contain many packages.

A **package** is a group of Go files in one directory that compile together. Files in that directory declare the same package name, apart from a testing convention taught later.

A **file** is source text stored on disk. Its `.go` suffix tells the tool that it contains Go source.

A **function** is a named unit of behavior inside a package. Day 4 teaches general functions. Today you only need the entry function named `main`.

The word `main` appears twice for related but distinct reasons:

```go
package main

func main() {
}
```

The package name says the package can become an executable. The function name gives that executable its entry point. An executable needs both.

```quiz
{
  "prompt": "Which description correctly separates a module from a package?",
  "multiple": false,
  "options": [
    {"text":"A package versions many modules","correct":false},
    {"text":"A module names a versioned code unit; a package groups files compiled together in one directory","correct":true},
    {"text":"They are two words for the `main.go` file","correct":false},
    {"text":"A module is created once for every function","correct":false}
  ],
  "explanation": "The module is the larger named unit recorded in `go.mod`. A module can contain multiple package directories. A package is the set of Go files compiled together in one directory."
}
```

---

## Read line one: `package main`

```go
package main
```

`package` is a keyword, a word reserved by the language for a grammatical job. `main` is the package name.

Try this plausible change:

```go
package desk

import "fmt"

func main() {
	fmt.Println("trail status: open")
}
```

The function is still named `main`, but `go run .` reports that this is not a main package. The rule is not "any function named main is executable." The executable boundary is the pair:

```text
package main + func main() = runnable entry package
```

Restore `package main`.

---

## Read the dependency declaration: `import "fmt"`

```go
import "fmt"
```

`import` tells the compiler that this file uses names supplied by another package. The quoted text is an **import path**, a stable identifier for that package.

`fmt` belongs to Go's **standard library**, the packages shipped with the toolchain. No separate download is needed.

Why declare dependencies? Explicit imports let a reader see what the file relies on, let the compiler reject accidental or missing dependencies, and let tools determine what must be built.

The declaration does not paste all of `fmt` into your source. It makes the package available under the local name `fmt` in this file.

---

## The unused import failure is deliberate friction

Delete the print call but keep the import. Predict warning or rejection, then run.

```text
"fmt" imported and not used
```

Go treats this as an error. The file claims it depends on `fmt`, while its behavior proves otherwise.

The naive patch is a meaningless call:

```go
fmt.Println()
```

That suppresses the diagnostic while making the program worse. The real repair is to make declarations match behavior: remove the import until formatting is needed again.

Go's choice creates small friction during editing, but prevents unused dependencies from becoming permanent dead weight.

```quiz
{
  "prompt": "A file imports `fmt` but contains no `fmt` use. What is the best repair?",
  "multiple": false,
  "options": [
    {"text":"Add a meaningless print so the compiler becomes quiet","correct":false},
    {"text":"Ignore it because Go still creates the executable","correct":false},
    {"text":"Remove the import unless real behavior needs it","correct":true},
    {"text":"Rename package `main` to `fmt`","correct":false}
  ],
  "explanation": "Unused imports are compile errors. Dependency declarations should match actual dependencies. A meaningless use suppresses the evidence without repairing the contradiction."
}
```

---

## Read the entry declaration: `func main()`

```go
func main() {
```

- `func` begins a function declaration.
- `main` is the function's name.
- `(` and `)` surround its parameter list. The list is empty, so this entry function accepts no values from a caller.
- `{` begins the function body, the statements that run.
- The matching `}` ends the body.

You do not write code that calls `main`. When the operating system starts the program, Go's runtime prepares the process and invokes this entry function.

The **runtime** is support code linked into a Go program. It handles work such as memory management and, later in the course, scheduling concurrent tasks. Your statements still begin in `main`.

Day 4 teaches parameters, returns, and reusable functions. Using them now would blur today's boundary, so this program keeps its behavior inside the entry function.

---

## Read the call: `fmt.Println(...)`

```go
fmt.Println("trail status: open")
```

`fmt` is the imported package name. The dot is a **selector**: choose a name supplied by that package. `Println` is the selected function.

Its capital `P` matters. In Go, a package makes a name available to other packages by starting that name with an uppercase letter. The usual word is **exported**. `Println` is exported by `fmt`, so package `main` may use it.

The parentheses contain the **argument**, the value handed to `Println` for this call.

The value is a **string literal**:

```go
"trail status: open"
```

Double quotes mark where the text begins and ends. The quotes are source syntax, not part of the output. `Println` writes the text and then a newline, so the next terminal prompt begins on a fresh line.

Every mark in the first program now has a job.

---

## Named files and the dot select different inputs

Both commands compile and run, but they discover source differently:

```bash
go run main.go
go run .
```

The first explicitly names a source file. The second names the package in the current directory. A real package can grow beyond one file, so the package command is the better project habit.

Do not turn that into an overstated rule that named files never work. They do. The distinction is scope:

```text
named file  -> use the source files named by the command
dot         -> discover and build the package in this directory
```

For this course project, create `go.mod` and prefer `go run .` so the command continues to mean the right thing as the directory grows.

---

## `go run` proves execution, not a saved artifact

Run `go run .`, then list the project directory. No new `trail-status` file remains.

The Go tool compiled the package into a temporary location, started that temporary executable, waited for the process to finish, and handled the temporary build result for you.

```text
source -> temporary executable -> process -> output
```

It answers, "Does the current package compile, and what happens when it runs now?"

It does not answer, "Did I create the reusable file I intend to hand to someone?"

---

## `go build` keeps the snapshot

Run:

```bash
go build -o trail-status .
```

Read the command:

- `go` starts the Go tool.
- `build` asks it to compile without immediately running.
- `-o` chooses the output path.
- `trail-status` is that output name.
- `.` selects the current package.

Now run the artifact on macOS or Linux:

```bash
./trail-status
```

The `./` tells the shell to use the file in this directory. Shells normally search `PATH`, not the current directory, so typing only `trail-status` may say command not found even while the file is present.

On Windows, the file normally has an `.exe` suffix and can be run from PowerShell with `./trail-status.exe`.

---

## One binary can create many processes

Run `./trail-status` three times.

The executable remains one file. Each run creates a fresh process:

```text
trail-status binary on disk
    |
    +-> process 1 -> prints -> exits
    +-> process 2 -> prints -> exits
    +-> process 3 -> prints -> exits
```

The file is passive data on disk; a process is active execution managed by the operating system.

This distinction matters later for servers and multiple running instances. Today it explains a simpler fact: building creates the reusable artifact, while running creates a temporary execution.

---

## The stale-binary failure

Build while the source says `open`, then change the source to `trail status: closed` without rebuilding. Predict:

```bash
./trail-status
go run .
```

The evidence is:

```text
./trail-status  -> trail status: open
go run .        -> trail status: closed
```

The saved executable contains instructions translated from the earlier source. Editing `main.go` changes text, not existing machine instructions.

The wrong diagnosis is "Go ignored my change." You asked two different artifacts to run: the old saved snapshot and a new temporary build.

Rebuild, then run `./trail-status` again. It now prints `closed`.

> A binary has no live link back to its source. Rebuild when the source that should define the artifact changes.

```quiz
{
  "prompt": "A saved binary prints old text after `main.go` changed. Which explanation fits?",
  "multiple": false,
  "options": [
    {"text":"The binary contains instructions from the earlier build","correct":true},
    {"text":"Source updates only after a terminal restart","correct":false},
    {"text":"`Println` stores its first argument forever","correct":false},
    {"text":"A module may be compiled only once","correct":false}
  ],
  "explanation": "Editing source does not mutate an existing executable. `go run .` compiles current source temporarily, while `./trail-status` runs the saved artifact. Rebuild to replace that artifact."
}
```

---

## A valid program can still be difficult to share

This cramped source is valid:

```go
package main
import "fmt"
func main(){fmt.Println("trail status: open")}
```

It builds because spaces and line breaks do not carry all the meaning. But if every contributor chooses different spacing, reviews fill with layout changes and equivalent files look unrelated.

The naive fix is a long style document. That creates arguments and still depends on every person applying it perfectly.

Go takes the decision away from individual preference by shipping one formatter.

---

## `gofmt` makes layout mechanical

Preview what the formatter would change:

```bash
gofmt -d main.go
```

The `-d` option asks for a **diff**, a display of old lines and proposed new lines. It does not rewrite the file.

Apply the formatting:

```bash
gofmt -w main.go
```

The `-w` option writes the formatted result back to the file. The tool standardizes blank lines, indentation, and brace spacing.

`gofmt` is intentionally not configurable in the way many formatters are. Go traded personal layout styles for a common visual language across projects. A code review can focus on behavior instead of which contributor prefers two spaces.

---

## Formatting cannot repair meaning

Change `Println` back to `Printline`, then run `gofmt -w main.go`.

The file becomes neatly formatted and remains invalid:

```go
fmt.Printline("trail status: open")
```

`gofmt` parses enough structure to lay source out consistently. It does not guess which API name you intended or whether `open` should be `closed`.

Keep the ownership boundary clear:

```text
gofmt                -> layout
compiler             -> language consistency
tests and observation -> intended behavior
```

A clean-looking program can be wrong. A poorly formatted program can compile. Tools solve the jobs they own.

---

## Read a diagnostic as coordinates plus a claim

A compiler message often has this shape:

```text
./main.go:6:6: undefined: fmt.Printline
```

Read it from left to right:

- `./main.go` names the file.
- the first `6` names the line.
- the next `6` names a column near the problem.
- `undefined: fmt.Printline` states the compiler's claim.

The location is where the compiler noticed inconsistency, not a promise that the root cause is exactly there. A missing quote earlier can make a later line look broken.

Use this procedure:

1. Read the first useful diagnostic.
2. Open the named file and location.
3. Restate the claim in plain language.
4. Change one cause.
5. Run the same command again.

Changing five unrelated lines destroys the evidence about which repair mattered.

---

## Diagnose from the producer

Four symptoms can appear around the same tiny program:

| Evidence | First owner to inspect | First useful question |
|---|---|---|
| `command not found: go` | shell | Can this terminal locate the Go tool? |
| `cannot find main module` | Go tool | Am I in the project, and does it have `go.mod`? |
| `undefined: fmt.Printline` | compiler | Is the selected name spelled and imported correctly? |
| `trail status: opne` | running program | Which valid source expressed the wrong output? |

This table is a recap, not the first appearance of the concepts. Use it as an ordered map for the next failure.

```quiz
{
  "prompt": "The terminal says `command not found: go`. What should you inspect first?",
  "multiple": false,
  "options": [
    {"text":"The spelling inside `fmt.Println`","correct":false},
    {"text":"Whether an old binary contains stale text","correct":false},
    {"text":"Whether the source package is named `main`","correct":false},
    {"text":"The Go installation and this shell's command path","correct":true}
  ],
  "explanation": "The shell failed while locating the command named `go`, before the Go tool or compiler could inspect source. Verify the installation and run `go version` in the same terminal."
}
```

---

## Build one artifact without borrowing future concepts

Change the program into an equipment-check command:

```go
package main

import "fmt"

func main() {
	fmt.Println("equipment check")
	fmt.Println("radio: packed")
	fmt.Println("water: packed")
}
```

This is deliberately small. Command-line arguments, branching, and reusable functions belong to later days. Today's proof is the toolchain path:

1. Initialize the module if it does not exist.
2. Preview and apply formatting.
3. Run the current package.
4. Build a reusable artifact named `equipment-check`.
5. Run that artifact.
6. Change `water: packed` to `water: refill`.
7. Prove the existing artifact is stale, then rebuild it.

The changed message is a transfer check: does the source, build, and execution model survive a realistic edit?

---

## Debugging procedure: locate the earliest broken promise

Walk in order:

```text
1. shell promise
   Can this terminal find `go`?                 go version

2. location promise
   Am I inside the intended project?            pwd, ls

3. module promise
   Which go.mod governs this directory?          go env GOMOD

4. source promise
   Does the compiler accept current files?       go build .

5. artifact promise
   Did I rebuild the file I am now running?      rebuild, run exact path

6. behavior promise
   Does accepted code express intended output?   compare exact output
```

Stop at the first failed promise. If `go version` fails, inspecting `go.mod` is premature. If `go build .` fails, a new binary was not produced. If the build succeeds but an old named artifact still prints old text, confirm which path you ran.

This is faster than changing tools, source, and commands at random because it preserves causality.

---

## Common mistakes

| Mistake | Why it hurts | Better move |
|---|---|---|
| Editing source after `command not found: go` | The shell never started the Go tool | Verify installation and `PATH` with `go version` |
| Running from the wrong directory | `.` selects a package you did not intend | Check `pwd`, `ls`, and `go env GOMOD` |
| Treating module and package as synonyms | Project identity and compile grouping become muddled | Draw module outside package outside files |
| Renaming the package but keeping `func main` | A function name alone does not make an executable package | Keep both `package main` and `func main` |
| Keeping an unused import | It claims a dependency behavior does not use | Remove it until needed |
| Calling every failure a runtime error | You search a process that may never have started | Identify shell, Go tool, compiler, or process |
| Expecting `go run` to leave a project binary | Its build artifact is temporary | Use `go build -o <name> .` |
| Running an old binary after editing | The artifact is a snapshot, not a live link | Rebuild the exact artifact you run |
| Typing only a local binary name | The shell searches `PATH`, not necessarily `.` | Use `./name` from its directory |
| Hand-formatting by preference | Diffs fill with layout noise | Run `gofmt -w` |
| Expecting `gofmt` to fix an undefined name | Formatting and meaning are separate jobs | Read the compiler diagnostic |

---

## Practice: five evidence-producing reps

Write real files and run every command. Keep each prediction beside the observed evidence.

### 1. Recall: reconstruct the entry program

Without looking up the answer, create a fresh directory and write the smallest program that prints `field desk ready`.

Before running, label every symbol in `package main`, `import "fmt"`, `func main()`, and `fmt.Println(...)`. Done means the program works and you can explain each symbol aloud.

### 2. Mechanics: turn the file into a project artifact

Initialize module `example.com/field-desk`, run the package with `.`, format it, then build `field-desk`.

Predict which commands leave files in the project directory. Verify with a directory listing. Done means you can point at source, `go.mod`, and executable and state who created each.

### 3. Deliberate failure: classify four producers

Trigger these one at a time and repair each before the next:

1. a misspelled shell command such as `goo version`;
2. `go run .` from a directory with no intended module;
3. `fmt.Printline`;
4. a valid but misspelled output string.

Record exact evidence, owner, whether a new process began, and the smallest repair.

### 4. Reconstruction: prove staleness

Build a binary that prints `revision one`. Change only the string to `revision two`.

Predict the output of the saved binary and `go run .`, run both, explain the difference without saying "Go cached it," then rebuild and verify.

### 5. Transfer: equipment-check handoff

In a new directory, build an `equipment-check` artifact that prints a heading and two status lines. Your colleague will run only the artifact, not `go run`.

Choose a module path, format the file, create the artifact, and write three commands the colleague can use to verify the Go version, project context, and artifact output. Change one status and demonstrate the exact rebuild step required.

If you use help, mark the rep assisted. Close the help, wait, and reconstruct the critical path once before marking an independent attempt.

Keep at most two delayed prompts:

- Draw shell to Go tool to compiler to binary to process, then place one real error at the stage that emits it.
- Reproduce and explain a stale binary without looking at this lecture.

Use roughly 1, 3, 7, 14, and 30 days after study as starting review gaps, adjusting to recall and workload.

---

## Cheat sheet

```text
PROGRAM SHAPE
  package main                  executable package
  import "fmt"                  used standard-library dependency
  func main() { ... }           process entry function
  fmt.Println(value)            print value, then newline

CONTAINERS
  module                        versioned code unit named by go.mod
  package                       files compiled together in one directory
  file                          source text on disk
  function                      named behavior inside a package

PIPELINE
  shell -> Go tool -> compiler -> executable -> process -> output
  source = description
  binary = build-time snapshot
  process = one running instance

COMMANDS
  go version                    show installed release and target
  go env GOROOT GOPATH GOOS GOARCH GOMOD
  go mod init <path>            create module identity
  go run .                      compile package temporarily and run
  go build -o <name> .          build reusable executable
  gofmt -d <file.go>            preview formatting diff
  gofmt -w <file.go>            write standard formatting
  ./<name>                      run local executable on macOS/Linux

DIAGNOSIS
  command missing -> location -> module -> compile -> artifact -> behavior
  read first useful error, change one cause, rerun the same command
```

---

## Tomorrow

Today's program always prints values chosen while you wrote it. The next problem is representing facts that change, while preventing a count, a fraction, and a piece of text from being mixed accidentally.

```finalquiz
{
  "title":"Day 1: Source to executable",
  "questions":[
    {"id":"q1","type":"single_correct","prompt":"Which order matches building and running?","codeSnippet":null,"options":[{"id":"a","text":"process, source, compiler, binary"},{"id":"b","text":"source, process, binary, compiler"},{"id":"c","text":"source, compiler, binary, process"},{"id":"d","text":"compiler, process, source, binary"}],"correctOptionIds":["c"],"explanation":"The compiler checks and translates source into a binary. Asking the operating system to run that binary creates a process. The other orders put execution before a runnable artifact exists.","example":"`go build -o desk .`, then `./desk`."},
    {"id":"q2","type":"multiple_correct","prompt":"Which statements are true?","codeSnippet":null,"options":[{"id":"a","text":"A module can contain packages"},{"id":"b","text":"A package groups files compiled together"},{"id":"c","text":"Every package is named `main`"},{"id":"d","text":"A module path requires a runtime website request"}],"correctOptionIds":["a","b"],"explanation":"Modules are larger named units containing packages. Only executable packages use the special name `main`; a module path is an identity and does not imply a website request when the program starts.","example":"One trail module may later contain several package directories."},
    {"id":"q3","type":"single_correct","prompt":"Why does Go reject an unused import?","codeSnippet":null,"options":[{"id":"a","text":"Imports are test-only"},{"id":"b","text":"It contradicts the file's actual dependencies"},{"id":"c","text":"Standard packages require payment"},{"id":"d","text":"Imports belong after `main`"}],"correctOptionIds":["b"],"explanation":"The declaration claims a dependency that the file does not use. A meaningless call hides the contradiction; removing the import keeps declared dependencies honest.","example":"Remove `fmt` when no `fmt` name is used."},
    {"id":"q4","type":"single_correct","prompt":"What does `go run .` do?","codeSnippet":null,"options":[{"id":"a","text":"Formats files"},{"id":"b","text":"Runs source without compilation"},{"id":"c","text":"Installs the program globally"},{"id":"d","text":"Compiles the current package temporarily and runs it"}],"correctOptionIds":["d"],"explanation":"`go run` includes compilation, starts the resulting temporary executable, and does not leave a reusable project binary or install the command globally.","example":"Use it for the edit-compile-run feedback loop."},
    {"id":"q5","type":"multiple_correct","prompt":"What can `gofmt` do?","codeSnippet":null,"options":[{"id":"a","text":"Standardize spacing and indentation"},{"id":"b","text":"Repair an undefined API name"},{"id":"c","text":"Arrange valid source consistently"},{"id":"d","text":"Choose the intended business output"}],"correctOptionIds":["a","c"],"explanation":"Formatting handles source layout. It does not know whether you meant `Println`, whether a status should be open, or what behavior the product requires.","example":"It expands cramped braces but cannot invent `Println`."},
    {"id":"q6","type":"single_correct","prompt":"The shell says `command not found: go`. Inspect what first?","codeSnippet":null,"options":[{"id":"a","text":"Installation and this shell's command path"},{"id":"b","text":"`fmt.Println` spelling"},{"id":"c","text":"String contents"},{"id":"d","text":"Binary freshness"}],"correctOptionIds":["a"],"explanation":"The shell could not locate the executable named `go`, so no source or binary was inspected. Verify the installation with `go version` in that terminal.","example":"A source edit cannot repair a command the shell cannot start."},
    {"id":"q7","type":"single_correct","prompt":"Why can a saved binary print old text after source changes?","codeSnippet":null,"options":[{"id":"a","text":"Strings update only once per day"},{"id":"b","text":"Modules forbid rebuilding"},{"id":"c","text":"The binary is a snapshot from an earlier build"},{"id":"d","text":"The compiler reverted the source file"}],"correctOptionIds":["c"],"explanation":"Existing machine instructions do not change when source text changes. `go run .` builds current source temporarily; the saved artifact must be rebuilt explicitly.","example":"Rebuild, then rerun the exact artifact path."},
    {"id":"q8","type":"multiple_correct","prompt":"Which readings of the first program are correct?","codeSnippet":null,"options":[{"id":"a","text":"`main` is the process entry function"},{"id":"b","text":"The dot selects `Println` from `fmt`"},{"id":"c","text":"Double quotes create a package"},{"id":"d","text":"`()` is an empty parameter list"}],"correctOptionIds":["a","b","d"],"explanation":"The entry point, selector, and empty parameter list readings are correct. Double quotes delimit the string argument; they do not create a package.","example":"Read `func main() { fmt.Println(\"ready\") }` symbol by symbol."},
    {"id":"q9","type":"single_correct","prompt":"What is the best next action for `undefined: fmt.Printline`?","codeSnippet":null,"options":[{"id":"a","text":"Reinstall the operating system"},{"id":"b","text":"Add several unrelated imports"},{"id":"c","text":"Run an old binary instead"},{"id":"d","text":"Inspect the reported selector, repair one cause, and rerun"}],"correctOptionIds":["d"],"explanation":"The compiler names one unresolved selector. A focused repair preserves evidence; unrelated changes make it harder to learn which cause mattered.","example":"Change `Printline` to `Println`, then repeat the same build command."},
    {"id":"q10","type":"multiple_correct","prompt":"Which commands leave the stated evidence?","codeSnippet":null,"options":[{"id":"a","text":"`go version` shows release information"},{"id":"b","text":"`go build -o desk .` creates an artifact"},{"id":"c","text":"`gofmt -d main.go` previews formatting differences"},{"id":"d","text":"`go run .` proves the command was installed globally"}],"correctOptionIds":["a","b","c"],"explanation":"The first three commands provide the described evidence. `go run .` compiles and runs the local package temporarily; it does not install the command globally.","example":"Choose the command that tests the layer you are debugging."}
  ]
}
```
