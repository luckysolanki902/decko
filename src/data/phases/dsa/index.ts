import { Phase, Section, Topic } from '@/types';

// Source of truth for what each DSA day covers. See guidelines/dsa.md for the
// authoring rules (guided discovery, a five-task bank with delayed recall, strict
// no-forward-reference ordering) and src/data/syllabus/dsaroadmap/ for the human
// syllabus + the verbatim Striver A2Z coverage floor. Lectures are authored on
// demand; this file remains the full phase/day/topic coverage skeleton.

type TopicSpec = { title: string; items: string[] };
type DaySpec = { day: number; title: string; topics: TopicSpec[]; project?: NonNullable<Topic['project']> };
type PhaseSpec = { number: number; title: string; subtitle: string; goal: string; icon: string; color: string; days: DaySpec[] };

// A unit can span multiple sessions. Practice includes delayed recall, not a
// quota of five new accepted submissions. See the learner study guide.
function practice(day: number): TopicSpec {
  const entry = day <= 3
    ? 'Start locally: predict, trace, write, and debug tiny programs using only syntax already taught; no judge quota'
    : day <= 7
      ? 'Start one prerequisite-safe LeetCode task only after explaining its function/class harness; local drills remain valid'
      : 'Choose one core problem from LeetCode, Codeforces, AtCoder, or CSES after checking its prerequisites; hide its technique label';
  return {
    title: 'Practice, delayed recall, and independent transfer',
    items: [
      entry,
      day === 1 ? 'Rebuild the smallest working program after closing the example; explain each part' : 'Spend 10–20 minutes retrieving one earlier mechanism and one earlier bug before new work; prioritize weak prerequisites',
      'Use a five-task bank: guided warm-up, core, changed constraint, delayed recall, optional stretch; attempt one or two, not all five on a timer',
      'Before a solution, produce a trace or brute-force plan; when stuck take one hint, act on it, then reassess',
      'Record help used, the failing input, the corrected reasoning, and a next review date; start around 1/3/7/14/30 days and adapt',
      'Reserve a weekly mixed review; after foundation readiness add a short virtual contest and upsolve one task with known prerequisites',
      'Prove progress through a delayed blank-editor reconstruction and a changed problem; a same-day quiz is supporting evidence only',
    ],
  };
}

function toTopic(day: number, i: number, t: TopicSpec): Topic {
  return { id: `day${day}-topic${i + 1}`, title: t.title, duration: i === 3 ? '~90 mins practice/review' : '~50 mins; extend as needed', items: t.items };
}

function section(spec: DaySpec): Section {
  const topics = [...spec.topics, practice(spec.day)].map((t, i) => toTopic(spec.day, i, t));
  const s: Section = { id: `day${spec.day}`, title: `Day ${spec.day}: ${spec.title}`, duration: '~4h baseline; split across sessions', topics };
  if (spec.project) s.project = spec.project;
  return s;
}

function phase(spec: PhaseSpec): Phase {
  const first = spec.days[0].day;
  const last = spec.days[spec.days.length - 1].day;
  return {
    id: `phase${spec.number}`,
    number: spec.number,
    title: spec.title,
    subtitle: spec.subtitle,
    duration: `${spec.days.length} Units | ~${spec.days.length * 4} baseline hours + review`,
    days: `Days ${first}-${last}`,
    goal: spec.goal,
    icon: spec.icon,
    color: spec.color,
    sections: spec.days.map(section),
    checkpoint: {
      skills: spec.days.map(day => day.title).slice(0, 8),
      milestone: `After Phase ${spec.number}, explain a core invariant, reconstruct a solution after a delay, diagnose a bug, and solve one unlabelled variation. Repair a failed prerequisite before advancing; record help separately from independent work.`,
    },
  };
}

const specs: PhaseSpec[] = [
  {
    "number": 1,
    "title": "C++ & Complexity Foundations",
    "subtitle": "Write, run, and put a price on small C++ programs before any data structure appears",
    "goal": "Get fluent enough with C++ and Big-O that every later problem is about the idea, not the syntax.",
    "icon": "💻",
    "color": "cyan",
    "days": [
      {
        "day": 1,
        "title": "Your first C++ program & the compile-run loop",
        "topics": [
          {
            "title": "From source to a running program",
            "items": [
              "What a compiler does: .cpp turns into an executable, and why compiled C++ is fast",
              "Anatomy of a program: includes, int main(), statements, semicolons, return 0",
              "Compile and run from the terminal: g++ file.cpp -o file, then run it",
              "Reading a compiler error by its line number instead of panicking"
            ]
          },
          {
            "title": "Printing and the CP skeleton",
            "items": [
              "cout and the << operator; a plain newline versus endl and why newline is faster",
              "The starter template every solution begins from (headers plus main)",
              "Bits/stdc++.h: what it pulls in and its trade-off",
              "using namespace std: convenience versus the name-clash risk"
            ]
          },
          {
            "title": "Reading input and fast I/O",
            "items": [
              "cin and >> for reading multiple values; what >> skips (whitespace)",
              "sync_with_stdio(false) and cin.tie(nullptr): buffering, flushing, stream coordination and large-input trade-offs without a universal numeric threshold",
              "Declare an integer input slot before cin; trace one read and print (test-case loops arrive on Day 3)",
              "Matching the exact required output format"
            ]
          }
        ]
      },
      {
        "day": 2,
        "title": "Data types, integer overflow & precision",
        "topics": [
          {
            "title": "Primitive types and their ranges",
            "items": [
              "int, long long, char, bool, double: sizes and value ranges",
              "Why int caps near 2e9 and long long near 9e18",
              "When to reach for long long: sums and products of large arrays",
              "sizeof and numeric_limits to check a range"
            ]
          },
          {
            "title": "The overflow trap",
            "items": [
              "Signed overflow is undefined behavior: an observed wraparound is not a reliable rule; contrast unsigned arithmetic",
              "Multiplying two ints that fit but whose product does not",
              "Casting to long long before multiplying: (long long)a * b",
              "unsigned types and the signed/unsigned comparison pitfall"
            ]
          },
          {
            "title": "Floating point and precision",
            "items": [
              "double versus float; why 0.1 + 0.2 is not exactly 0.3",
              "Integer division truncates (7/2 is 3) versus real division",
              "Comparing doubles with an epsilon instead of ==",
              "When to avoid floating point and stay in integers"
            ]
          }
        ]
      },
      {
        "day": 3,
        "title": "Conditionals, loops & turning a statement into code",
        "topics": [
          {
            "title": "Branching",
            "items": [
              "if / else if / else and boolean conditions",
              "Comparison and logical operators (&&, ||, !) and short-circuit evaluation",
              "switch-case: when it beats a chain of ifs, and the fallthrough trap",
              "The ternary ?: for a compact conditional value"
            ]
          },
          {
            "title": "Loops and iteration",
            "items": [
              "for, while, do-while: which to reach for and why",
              "break and continue and the readable use of each",
              "Nested loops and reading their combined cost (n times m)",
              "Off-by-one errors: <= versus <, and picking loop bounds deliberately"
            ]
          },
          {
            "title": "From problem statement to first program",
            "items": [
              "Reading a problem: input format, output format, constraints",
              "Restating the task in one sentence before typing",
              "Sketching the plan as comments, then filling in code",
              "Dry-running the sample by hand before submitting"
            ]
          }
        ]
      },
      {
        "day": 4,
        "title": "Functions, scope & the call stack",
        "topics": [
          {
            "title": "Writing and calling functions",
            "items": [
              "Declaring a function: return type, name, parameters, body",
              "Why functions: naming a sub-task and reusing it",
              "void functions versus value-returning functions",
              "Ordering and forward declarations"
            ]
          },
          {
            "title": "Pass by value versus pass by reference",
            "items": [
              "Pass by value copies the argument (and its O(n) cost for containers)",
              "Pass by reference (int&) lets a function change the caller's variable",
              "const int& as a read-only reference; apply references to containers after vectors are taught on Day 5",
              "Local scope, shadowing, and where a variable lives"
            ]
          },
          {
            "title": "The call stack (mental model for recursion later)",
            "items": [
              "What a stack frame is: parameters, locals, return address",
              "How calls push frames and returns pop them",
              "A function calling itself: the seed of recursion (we build it fully in Phase 3)",
              "Stack overflow: what too-deep recursion actually does"
            ]
          }
        ]
      },
      {
        "day": 5,
        "title": "Arrays & std::vector — the workhorse",
        "topics": [
          {
            "title": "Fixed arrays",
            "items": [
              "Declaring an array, indexing from 0, contiguous memory",
              "Iterating with a for loop and the size",
              "Out-of-bounds access is undefined behavior (no safety net)",
              "2D arrays and row-major layout"
            ]
          },
          {
            "title": "std::vector as a resizable array",
            "items": [
              "Why vector over raw arrays: it knows its own size and can grow",
              "Creating and sizing: vector<int> v(n, 0)",
              "push_back, size, empty, back, and indexing with []",
              "Range-based for and iterating by reference"
            ]
          },
          {
            "title": "Common vector operations and their cost",
            "items": [
              "Count copies over repeated push_back calls; geometric capacity growth is typical, exact growth is implementation-dependent; formalize amortized cost on Day 7",
              "The invalidated-reference trap after push_back",
              "Passing vectors by reference to avoid copies",
              "2D vectors: vector<vector<int>> to build a grid"
            ]
          }
        ]
      },
      {
        "day": 6,
        "title": "Strings in C++",
        "topics": [
          {
            "title": "std::string basics",
            "items": [
              "Creating strings, length/size, indexing characters",
              "Concatenation with + and += and its cost",
              "Reading strings: >> reads one token, getline reads a whole line",
              "Iterating characters and modifying in place"
            ]
          },
          {
            "title": "Characters are numbers",
            "items": [
              "A char is an integer: 'a' has an ASCII code",
              "c - 'a' maps a lowercase letter to 0..25 (the frequency-array trick)",
              "c - '0' turns the char '7' into the number 7",
              "toupper, tolower, isalpha, isdigit helpers"
            ]
          },
          {
            "title": "Useful string operations",
            "items": [
              "substr, find, and comparing strings",
              "push_back and pop_back on a string",
              "Building a string efficiently versus repeated + in a loop",
              "to_string and stoi for number-string conversion"
            ]
          }
        ]
      },
      {
        "day": 7,
        "title": "Time & space complexity — putting a price on code",
        "topics": [
          {
            "title": "Counting operations",
            "items": [
              "Why we count operations: rough timing estimates depend on language, hardware, memory access, and operation cost; measure rather than assume 1e8 per second",
              "Counting the dominant operation in a loop",
              "Big-O as a growth rate: drop constants and lower-order terms",
              "The common classes: O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n)"
            ]
          },
          {
            "title": "Reading constraints to pick an approach",
            "items": [
              "Mapping n to an allowed complexity (n<=20 to 2^n; n<=1e3 to n^2; n<=1e5 to n log n; n<=1e7 to n)",
              "Worst / average / best case and why we design for worst",
              "Space complexity: extra memory versus in-place",
              "Amortized cost: why push_back is O(1) on average"
            ]
          },
          {
            "title": "Estimating before coding",
            "items": [
              "Predicting a time-limit-exceeded from constraints before writing a line",
              "Nested loops multiply; sequential loops add",
              "Recursion cost as (number of calls) times (work per call)",
              "A worked example: turning an O(n^2) idea into O(n) with a plan"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 2,
    "title": "STL Foundations & Problem-Solving Reflex",
    "subtitle": "Become fluent with the containers and algorithms you will reuse for the entire course",
    "goal": "Turn the standard library into muscle memory and build the reflex of translating a statement into clean code.",
    "icon": "🧰",
    "color": "teal",
    "days": [
      {
        "day": 8,
        "title": "pair, tuple, references & iterators",
        "topics": [
          {
            "title": "Grouping values",
            "items": [
              "pair<A,B>: first/second, make_pair, and when to bundle two values",
              "Comparing pairs: lexicographic order (first, then second)",
              "tuple for three or more values; tie for unpacking",
              "Structured bindings: auto [a, b] = p"
            ]
          },
          {
            "title": "Iterators as generalized pointers",
            "items": [
              "begin() and end(); end() is one-past-the-last",
              "Dereference with *it, advance with ++it",
              "Half-open ranges [begin, end) and why they compose cleanly",
              "const_iterator and when you cannot modify through an iterator"
            ]
          },
          {
            "title": "References and auto",
            "items": [
              "auto to let the compiler name a type; auto& to avoid a copy",
              "Range-for by value versus by reference",
              "const auto& for read-only traversal of big containers",
              "The invalidated-iterator idea: changing a container while iterating"
            ]
          }
        ]
      },
      {
        "day": 9,
        "title": "vector mastery + the <algorithm> staples",
        "topics": [
          {
            "title": "Building and reshaping vectors",
            "items": [
              "Initializer lists, resize, assign, clear",
              "insert and erase and their O(n) cost",
              "front, back, pop_back; emplace_back versus push_back",
              "swap and moving data cheaply"
            ]
          },
          {
            "title": "The algorithms you use daily",
            "items": [
              "sort(v.begin(), v.end()) and default ascending order",
              "reverse, min_element, max_element, accumulate",
              "count, find, and count_if with a simple lambda",
              "lower_bound and upper_bound on a sorted vector (full binary search in Phase 5)"
            ]
          },
          {
            "title": "Custom ordering with comparators",
            "items": [
              "Sorting descending with greater<int>() or a lambda",
              "Sorting a vector of pairs or structs by a chosen key",
              "stable_sort and when stability matters",
              "The strict-weak-ordering rule a comparator must obey"
            ]
          }
        ]
      },
      {
        "day": 10,
        "title": "Ordered containers — set, multiset & map",
        "topics": [
          {
            "title": "set and multiset",
            "items": [
              "set keeps unique elements sorted; O(log n) insert/find/erase",
              "Why sorted: it is a balanced binary search tree underneath",
              "multiset allows duplicates; erasing one versus all occurrences",
              "Iterating a set yields sorted order for free"
            ]
          },
          {
            "title": "map — key to value",
            "items": [
              "map<K,V> as a sorted dictionary; operator[] inserts a default",
              "The [] auto-insert trap (accidentally creating keys)",
              "find versus count versus [] for lookups without inserting",
              "Iterating a map yields keys in sorted order"
            ]
          },
          {
            "title": "When ordered structures shine",
            "items": [
              "lower_bound/upper_bound on a set for nearest-neighbor queries",
              "Frequency maps: counting with map<int,int>",
              "begin() and rbegin() for min/max in a changing set",
              "Cost model: everything is O(log n), not O(1)"
            ]
          }
        ]
      },
      {
        "day": 11,
        "title": "Hashing — unordered_set & unordered_map",
        "topics": [
          {
            "title": "Hash tables versus trees",
            "items": [
              "Average O(1) insert/find via hashing; the bucket mental model",
              "unordered_set and unordered_map mirror set/map",
              "No sorted order: iteration order is unspecified",
              "When O(1) average beats O(log n): huge lookups where order does not matter"
            ]
          },
          {
            "title": "How hashing breaks",
            "items": [
              "Worst-case O(n) on collisions; anti-hash tests in CP",
              "Why unordered_map<int,int> can be hacked to TLE on Codeforces",
              "Mitigations: a custom hash with a random seed, or fall back to a sorted map",
              "Hashing custom keys (pairs) needs a hash function"
            ]
          },
          {
            "title": "The counting toolkit",
            "items": [
              "Frequency array versus hash map: pick the array when the key range is small",
              "Counting characters with an int[26]",
              "Detecting duplicates and the first unique element",
              "One-pass versus two-pass counting"
            ]
          }
        ]
      },
      {
        "day": 12,
        "title": "Basic number crunching for problems",
        "topics": [
          {
            "title": "Digits and numbers",
            "items": [
              "Extracting digits with % 10 and / 10",
              "Reversing a number and checking a palindrome number",
              "Counting digits and summing digits",
              "Base conversion: decimal to binary and back"
            ]
          },
          {
            "title": "Divisibility and GCD",
            "items": [
              "Even/odd, divisibility, and modulo behavior with negatives",
              "GCD via the Euclidean algorithm and why it works",
              "LCM from GCD with an overflow-safe order: a / gcd * b",
              "__gcd and C++17 gcd/lcm"
            ]
          },
          {
            "title": "Primes and powers (basics)",
            "items": [
              "Primality by trial division up to sqrt(n)",
              "Listing divisors in O(sqrt n) with the i, n/i pairing",
              "Binary exponentiation (fast power) and its code",
              "Why sqrt-time beats the naive O(n) loop"
            ]
          }
        ]
      },
      {
        "day": 13,
        "title": "Simulation & pattern problems (the translation reflex)",
        "topics": [
          {
            "title": "Pattern printing",
            "items": [
              "Mapping (row, col) to the character to print",
              "Nested loops for triangles, pyramids, diamonds",
              "Finding the formula linking the row index to counts of spaces/stars",
              "Debugging alignment by dry-running two rows"
            ]
          },
          {
            "title": "Simulation problems",
            "items": [
              "Literally following the rules step by step (grid moves, event queues)",
              "Choosing the right container to model the state",
              "Boundary handling and stopping conditions",
              "Keeping simulation O(n) instead of rescanning each step"
            ]
          },
          {
            "title": "Clean coding habits that save contests",
            "items": [
              "Meaningful names, small helpers, early returns",
              "Guarding edge cases (n==0, single element, all same)",
              "Printing in the exact required format",
              "A pre-submit checklist: overflow, bounds, format, sample match"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 3,
    "title": "Recursion Foundations",
    "subtitle": "An unshakable grip on recursion over numbers, arrays and strings",
    "goal": "Make recursion second nature so every later tree, graph and DP topic stands on solid ground.",
    "icon": "🌀",
    "color": "indigo",
    "days": [
      {
        "day": 14,
        "title": "How recursion actually works",
        "topics": [
          {
            "title": "The recursion mental model",
            "items": [
              "A function that solves a big instance by calling itself on a smaller one",
              "Base case (when to stop) and recursive case (how to shrink)",
              "The recursion tree and the call stack side by side",
              "Why a missing or wrong base case causes a stack overflow"
            ]
          },
          {
            "title": "Your first recursions",
            "items": [
              "Print 1..N and N..1 (order of work versus order of calls)",
              "Sum of first N and factorial by recursion",
              "Tracing the stack frame by frame on paper",
              "The two moments: on the way down versus on the way back up"
            ]
          },
          {
            "title": "Parameterized versus functional recursion",
            "items": [
              "Carrying an accumulator down versus returning a value up",
              "Return-value recursion: build the answer from the child call",
              "Where the work happens relative to the recursive call",
              "Converting a simple loop into a recursion and back"
            ]
          }
        ]
      },
      {
        "day": 15,
        "title": "Recursion on arrays & strings",
        "topics": [
          {
            "title": "Traversal by recursion",
            "items": [
              "Reverse an array with two indices moving inward",
              "Check a string is a palindrome recursively",
              "Sum and max framed recursively",
              "Passing the array by reference plus an index parameter"
            ]
          },
          {
            "title": "Fibonacci and the cost of naive recursion",
            "items": [
              "Fibonacci by recursion and drawing its call tree",
              "Counting repeated subproblems (why it is O(2^n))",
              "The idea that remembering answers will later kill the repetition",
              "Depth versus breadth of the recursion tree"
            ]
          },
          {
            "title": "Multiple recursive calls",
            "items": [
              "Two calls per node (the pick/not-pick shape) on small inputs",
              "How branching factor and depth set the total call count",
              "When exponential is acceptable (n up to about 20)",
              "Turning a recursive count into a recursive enumeration"
            ]
          }
        ]
      },
      {
        "day": 16,
        "title": "Subsequences & choices (the pick / not-pick engine)",
        "topics": [
          {
            "title": "The pick / not-pick template",
            "items": [
              "Every element: include it or skip it, giving 2^n subsequences",
              "Building the choice tree and reading a leaf as one subsequence",
              "Passing a current list down and printing at the base case",
              "Backtracking: undo the choice after the recursive call returns"
            ]
          },
          {
            "title": "Sum-based subsequence problems",
            "items": [
              "Print all subsequences with a target sum",
              "Return true if any subsequence hits the sum (short-circuit)",
              "Count subsequences with a given sum",
              "The three shapes: print all / return one / count"
            ]
          },
          {
            "title": "Trimming the tree",
            "items": [
              "Stop early when the running sum exceeds the target (pruning)",
              "Why pruning changes constants, not always the worst case",
              "Recognizing the pick/not-pick shape in future problems",
              "Handoff to the backtracking phase where this scales up"
            ]
          }
        ]
      },
      {
        "day": 17,
        "title": "Recursion problem set & stack-based recursion",
        "topics": [
          {
            "title": "Classic small recursions",
            "items": [
              "pow(x, n) recursively with fast exponentiation",
              "Reverse a stack using recursion",
              "Sort a stack using recursion",
              "Digit-based recursion (count good numbers)"
            ]
          },
          {
            "title": "Recursion patterns recap",
            "items": [
              "Naming the base case, the state, and the transition every time",
              "When to pass an index versus iterate inside the call",
              "Spotting infinite recursion and fixing the shrink step",
              "A template you can reuse for the rest of the course"
            ]
          },
          {
            "title": "Depth, limits & debugging",
            "items": [
              "Default stack depth and when deep recursion crashes",
              "Converting deep recursion to iteration when needed",
              "Printing the recursion trace to debug a wrong answer",
              "The shared-global-vector bug and how to avoid it"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 4,
    "title": "Sorting Techniques",
    "subtitle": "Implement the classic sorts, understand invariants, and use custom comparators fluently",
    "goal": "Know how sorting really works and wield sorting as a preprocessing weapon.",
    "icon": "🔀",
    "color": "sky",
    "days": [
      {
        "day": 18,
        "title": "Quadratic sorts & the idea of an invariant",
        "topics": [
          {
            "title": "Selection sort",
            "items": [
              "The invariant: the prefix is sorted and holds the smallest elements",
              "Selecting the minimum of the unsorted suffix each pass",
              "O(n^2) comparisons, O(n) swaps; not stable",
              "Dry run on 5 elements tracking the boundary"
            ]
          },
          {
            "title": "Bubble sort",
            "items": [
              "Adjacent swaps bubbling the max to the end each pass",
              "Early-exit when a pass makes no swaps (best case O(n))",
              "Stability and why equal elements keep their order",
              "Worst case O(n^2)"
            ]
          },
          {
            "title": "Insertion sort",
            "items": [
              "Inserting each new element into the sorted prefix",
              "Why it is fast on nearly-sorted data (O(n) best case)",
              "Stable and in-place; the shifting cost",
              "Where library sorts fall back to insertion sort for tiny ranges"
            ]
          }
        ]
      },
      {
        "day": 19,
        "title": "Merge sort & divide and conquer",
        "topics": [
          {
            "title": "The divide-and-conquer idea",
            "items": [
              "Split in half, sort each half, merge two sorted halves",
              "Why recursion (Phase 3) is the natural fit",
              "The merge step: two pointers walking both halves",
              "O(n log n) time, O(n) extra space"
            ]
          },
          {
            "title": "Implementing merge sort",
            "items": [
              "The recursive split with mid = l + (r - l) / 2",
              "Writing a correct, stable merge into a temp buffer",
              "Copying back and the index-bookkeeping traps",
              "Verifying with a hand trace on 6 elements"
            ]
          },
          {
            "title": "Counting inversions",
            "items": [
              "What an inversion is and why it measures unsortedness",
              "Counting inversions during the merge step for free",
              "Reverse pairs as a merge-sort variant",
              "Why brute force is O(n^2) and this is O(n log n)"
            ]
          }
        ]
      },
      {
        "day": 20,
        "title": "Quick sort & quickselect",
        "topics": [
          {
            "title": "Partitioning",
            "items": [
              "Choosing a pivot and partitioning around it",
              "Lomuto versus Hoare partition schemes",
              "In-place, not stable; O(n log n) average, O(n^2) worst",
              "Why a bad pivot on sorted input degrades it"
            ]
          },
          {
            "title": "Quick sort assembly",
            "items": [
              "Recursing on the two partitions",
              "Randomized or median-of-three pivot to dodge the worst case",
              "Recursion depth considerations",
              "Comparing quick versus merge in practice"
            ]
          },
          {
            "title": "Quickselect — kth element without a full sort",
            "items": [
              "Partition once, recurse into only the side containing k",
              "Average O(n), worst O(n^2)",
              "Finding the kth smallest or largest",
              "When quickselect beats sorting or a heap"
            ]
          }
        ]
      },
      {
        "day": 21,
        "title": "Non-comparison sorts & sorting in practice",
        "topics": [
          {
            "title": "Counting & radix sort",
            "items": [
              "Counting sort for a small integer range in O(n + k)",
              "Why comparison sorts cannot beat O(n log n) but these can",
              "Radix sort digit by digit and its stability requirement",
              "Bucket sort intuition for uniform data"
            ]
          },
          {
            "title": "std::sort and custom comparators (mastery)",
            "items": [
              "std::sort is introsort: O(n log n) guaranteed",
              "Sorting structs by multiple keys with a comparator",
              "Sorting indices by their values with a capturing lambda",
              "stable_sort versus sort and when the order of equals matters"
            ]
          },
          {
            "title": "Sorting as a preprocessing weapon",
            "items": [
              "Many problems become easy once sorted (pairs, greedy, two-pointer)",
              "Coordinate compression: map values to ranks",
              "Sorting plus binary search combos",
              "Recognizing when sorting is the unlock"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 5,
    "title": "Binary Search — on arrays & on the answer",
    "subtitle": "Halving the search space, and the far more powerful binary-search-on-the-answer",
    "goal": "Master exact search and, crucially, recognizing the monotonic predicate that unlocks answer-search.",
    "icon": "🎯",
    "color": "blue",
    "days": [
      {
        "day": 22,
        "title": "Binary search on a sorted array",
        "topics": [
          {
            "title": "The core idea",
            "items": [
              "Sorted order lets you halve the search space each step",
              "The loop with lo, hi, mid and its exit condition",
              "Why mid = lo + (hi - lo) / 2 avoids overflow",
              "O(log n) and the invariant: the answer stays inside [lo, hi]"
            ]
          },
          {
            "title": "Correct boundaries",
            "items": [
              "Inclusive [lo, hi] versus half-open [lo, hi) templates",
              "The classic infinite-loop bug and how to prevent it",
              "Finding an exact target and returning its index",
              "Hand trace on an 8-element array"
            ]
          },
          {
            "title": "lower_bound / upper_bound by hand",
            "items": [
              "lower_bound: first index with a[i] >= x",
              "upper_bound: first index with a[i] > x",
              "Floor and ceil of x in a sorted array",
              "First and last occurrence, and counting occurrences"
            ]
          }
        ]
      },
      {
        "day": 23,
        "title": "Binary search on tricky arrays",
        "topics": [
          {
            "title": "Rotated sorted arrays",
            "items": [
              "Search in a rotated sorted array (no duplicates)",
              "Identifying which half is sorted at each step",
              "Handling duplicates (the ambiguous mid case)",
              "Finding the minimum and the rotation count"
            ]
          },
          {
            "title": "Peak and single element",
            "items": [
              "Find a peak element using the slope direction",
              "Single element in a sorted-doubled array via index parity",
              "Why binary search works without full sortedness here",
              "Naming the monotonic property you are exploiting"
            ]
          },
          {
            "title": "The monotonic-predicate mindset",
            "items": [
              "Reframe search as: find the boundary where a yes/no answer flips",
              "Writing the predicate check(mid) cleanly",
              "The first-true and last-true templates",
              "This reframing is the bridge to binary search on the answer"
            ]
          }
        ]
      },
      {
        "day": 24,
        "title": "Binary search on the answer — part 1",
        "topics": [
          {
            "title": "The pattern",
            "items": [
              "When the answer is a number in a range and feasibility is monotonic",
              "Guess the answer, write check(guess), shrink the range",
              "Minimize-the-maximum and maximize-the-minimum shapes",
              "Deriving the search bounds from the constraints"
            ]
          },
          {
            "title": "Classic problems",
            "items": [
              "Koko eating bananas (minimum speed)",
              "Minimum days to make m bouquets",
              "Smallest divisor given a threshold",
              "Capacity to ship packages within D days"
            ]
          },
          {
            "title": "Getting check() right",
            "items": [
              "Making the feasibility test O(n) so the total is O(n log range)",
              "Integer sqrt and nth root by binary search",
              "Off-by-one in the final answer (return lo versus hi)",
              "Proving monotonicity before trusting the approach"
            ]
          }
        ]
      },
      {
        "day": 25,
        "title": "Binary search on the answer — part 2 (allocation)",
        "topics": [
          {
            "title": "The split / allocation family",
            "items": [
              "Aggressive cows (maximize the minimum distance)",
              "Book allocation and split array largest sum",
              "Painter's partition",
              "Recognizing they are the same problem in disguise"
            ]
          },
          {
            "title": "The greedy feasibility check",
            "items": [
              "A greedy count of groups or painters for a candidate value",
              "Why the greedy check is both correct and fast",
              "Setting lo and hi to the tightest valid bounds",
              "Kth missing positive number by binary search"
            ]
          },
          {
            "title": "Common pitfalls",
            "items": [
              "Mixing up the minimize versus maximize direction",
              "Wrong initial bounds that miss the answer",
              "Integer overflow in sum-based checks (use long long)",
              "Validating on the sample by hand"
            ]
          }
        ]
      },
      {
        "day": 26,
        "title": "Binary search on 2D matrices",
        "topics": [
          {
            "title": "Searching a matrix",
            "items": [
              "Row-sorted, first-of-row-sorted: treat as 1D with index math",
              "Search in a fully sorted matrix (staircase from a corner)",
              "Row with the maximum number of 1s",
              "Complexity comparison of each approach"
            ]
          },
          {
            "title": "Peak in 2D & row-wise problems",
            "items": [
              "Find a peak element in a 2D grid",
              "Binary search on columns with a max-in-column check",
              "Why the peak always exists in the chosen half",
              "Handling ties and borders"
            ]
          },
          {
            "title": "Median of a row-wise sorted matrix",
            "items": [
              "Binary search on the value range, counting elements <= mid",
              "Counting per row with upper_bound",
              "Total O(n log n log range)",
              "Connecting back to answer-search"
            ]
          }
        ]
      },
      {
        "day": 27,
        "title": "The two-sorted-arrays finale",
        "topics": [
          {
            "title": "Kth element of two sorted arrays",
            "items": [
              "Merge-count approach O(m+n) as a baseline",
              "Partition approach in O(log(min(m,n)))",
              "Setting the partition and the four boundary values",
              "Correctness of the left-max <= right-min condition"
            ]
          },
          {
            "title": "Median of two sorted arrays",
            "items": [
              "Reduce the median to a kth-element / partition problem",
              "Handling even and odd total length",
              "Edge partitions (empty left/right) with infinity sentinels",
              "Why this is the hardest common binary-search interview problem"
            ]
          },
          {
            "title": "Review & template card",
            "items": [
              "A checklist: sorted? monotonic predicate? bounds?",
              "Choosing array search versus answer search",
              "The reusable first-true template",
              "Debugging: print lo/hi/mid to watch the shrink"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 6,
    "title": "Arrays: Easy to Medium to Hard",
    "subtitle": "A deep bag of array techniques: prefix sums, two pointers, Kadane, intervals, matrix moves",
    "goal": "Build the bread-and-butter array toolkit every contest and interview leans on.",
    "icon": "📊",
    "color": "emerald",
    "days": [
      {
        "day": 28,
        "title": "Easy array patterns",
        "topics": [
          {
            "title": "Scanning basics",
            "items": [
              "Largest and second largest in one pass",
              "Check if an array is sorted (and rotated-sorted)",
              "Remove duplicates from a sorted array in place",
              "Linear search and when it is unavoidable"
            ]
          },
          {
            "title": "In-place rearrangement",
            "items": [
              "Left rotate by one and by D (the reversal trick)",
              "Move all zeros to the end preserving order",
              "The two-pointer write-index pattern",
              "Why in-place beats making a new array"
            ]
          },
          {
            "title": "Set-like array ops",
            "items": [
              "Union and intersection of two sorted arrays",
              "Find the missing number (sum and XOR tricks)",
              "Maximum consecutive ones",
              "Single number via XOR"
            ]
          }
        ]
      },
      {
        "day": 29,
        "title": "Prefix sums & subarray sums",
        "topics": [
          {
            "title": "Prefix sum arrays",
            "items": [
              "Build a prefix-sum array for O(1) range-sum queries",
              "Off-by-one and the prefix[0]=0 convention",
              "2D prefix sums for submatrix sums",
              "Difference arrays for range updates"
            ]
          },
          {
            "title": "Subarray sum equals K",
            "items": [
              "Prefix sum plus a hash map of seen sums",
              "Why the count of (prefix - k) gives the answer",
              "Handling negatives (where sliding window fails)",
              "Longest subarray with sum K (positives versus pos+neg)"
            ]
          },
          {
            "title": "XOR subarrays & zero-sum",
            "items": [
              "Largest subarray with 0 sum via the first-seen prefix",
              "Count subarrays with XOR = K using a prefix-XOR map",
              "The prefix + hashmap meta-pattern",
              "Recognizing the family across problems"
            ]
          }
        ]
      },
      {
        "day": 30,
        "title": "Kadane & the sign / rearrange family",
        "topics": [
          {
            "title": "Maximum subarray (Kadane)",
            "items": [
              "The running-sum reset intuition (drop a negative prefix)",
              "Why resetting to 0 is optimal",
              "Printing the actual subarray (track start and end)",
              "Handling an all-negative array"
            ]
          },
          {
            "title": "Max product subarray",
            "items": [
              "Why product breaks Kadane (negatives flip sign)",
              "Tracking both the max and min running products",
              "Zeros as resets",
              "The prefix/suffix product alternative"
            ]
          },
          {
            "title": "Rearrange by sign & stock",
            "items": [
              "Rearrange elements by sign (alternating, equal counts)",
              "Best time to buy and sell stock (single transaction)",
              "Tracking min-so-far and best profit",
              "The linear-scan greedy shape"
            ]
          }
        ]
      },
      {
        "day": 31,
        "title": "Medium array classics",
        "topics": [
          {
            "title": "Majority elements",
            "items": [
              "Majority > n/2 via Boyer-Moore voting",
              "Why the cancellation argument works",
              "Majority > n/3 (at most two candidates)",
              "A verification pass to confirm the candidates"
            ]
          },
          {
            "title": "Dutch national flag",
            "items": [
              "Sort 0s, 1s, 2s in one pass with three pointers",
              "The low / mid / high invariant",
              "Why mid does not always advance",
              "Generalizing to three-way partitioning"
            ]
          },
          {
            "title": "Next permutation & leaders",
            "items": [
              "Next permutation: find the pivot, swap, reverse the suffix",
              "Why this yields the next lexicographic order",
              "Leaders in an array (scan from the right)",
              "Longest consecutive sequence with a hash set"
            ]
          }
        ]
      },
      {
        "day": 32,
        "title": "Intervals & matrix moves",
        "topics": [
          {
            "title": "Merge intervals family",
            "items": [
              "Sort by start, then merge overlapping intervals",
              "Insert an interval into a sorted set",
              "Non-overlapping intervals (greedy removal preview)",
              "The sweep intuition"
            ]
          },
          {
            "title": "Matrix transformations",
            "items": [
              "Set matrix zeros in place (using row 0 and col 0 as markers)",
              "Rotate a matrix 90 degrees (transpose then reverse)",
              "Why the naive extra-matrix approach wastes space",
              "The index mapping for rotation"
            ]
          },
          {
            "title": "Spiral & traversal",
            "items": [
              "Spiral order traversal with four boundaries",
              "Shrinking boundaries correctly to avoid double-visits",
              "Pascal's triangle (three query types)",
              "Generating a row in O(n)"
            ]
          }
        ]
      },
      {
        "day": 33,
        "title": "Hard array problems — part 1",
        "topics": [
          {
            "title": "k-sum problems",
            "items": [
              "3Sum: sort plus two pointers, skipping duplicates",
              "4Sum: one more loop plus two pointers, with overflow care",
              "Why sorting enables the two-pointer sweep",
              "Deduplication without a set"
            ]
          },
          {
            "title": "Two-pointer sweeps",
            "items": [
              "The sorted meet-in-the-middle pattern",
              "Container-with-most-water style moves",
              "Deciding which pointer to move and why",
              "Proving no valid pair is skipped"
            ]
          },
          {
            "title": "Merge without extra space",
            "items": [
              "Merge two sorted arrays in place (the gap method)",
              "The insertion-shift approach and its cost",
              "Why the gap approach is O((n+m) log(n+m))",
              "Trace on small inputs"
            ]
          }
        ]
      },
      {
        "day": 34,
        "title": "Hard array problems — part 2",
        "topics": [
          {
            "title": "Find repeating & missing",
            "items": [
              "Using the sum and sum-of-squares equations",
              "The XOR-partition method",
              "The marking-by-index (in-place) method",
              "Trade-offs of each"
            ]
          },
          {
            "title": "Count inversions & reverse pairs (revisit)",
            "items": [
              "Framing via merge sort from Phase 4",
              "Reverse pairs (a[i] > 2*a[j]) counting",
              "Overflow-safe comparison",
              "A different structure will let us do this another way in the advanced phase"
            ]
          },
          {
            "title": "Grid & consistency drills",
            "items": [
              "Rotate / spiral / zeros recap under time pressure",
              "Choosing prefix versus two-pointer versus sort per problem",
              "Building a decision tree for array problems",
              "Speed practice mindset"
            ]
          }
        ]
      },
      {
        "day": 35,
        "title": "Array capstone & mixed set",
        "topics": [
          {
            "title": "Choosing the right technique",
            "items": [
              "A flowchart: sorted? sum? subarray? interval? matrix?",
              "Prefix versus sliding window versus two pointers",
              "When hashing beats sorting and vice versa",
              "Complexity budgeting from the constraints"
            ]
          },
          {
            "title": "Mixed hard problems",
            "items": [
              "Longest consecutive sequence (revisit, O(n))",
              "Maximum product subarray under pressure",
              "Merge-intervals variants",
              "Time-boxed solving"
            ]
          },
          {
            "title": "Reflection & pattern log",
            "items": [
              "Keeping a personal pattern catalog",
              "Re-deriving one technique from scratch",
              "Spotting the reusable core across today's problems",
              "Preparing for the strings phase"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 7,
    "title": "Strings: Basic & Medium",
    "subtitle": "Comfortable string manipulation and the medium classics (heavy algorithms come later)",
    "goal": "Handle strings fluently and solve the standard medium problems before advanced string algorithms.",
    "icon": "🔤",
    "color": "rose",
    "days": [
      {
        "day": 36,
        "title": "String fundamentals & easy problems",
        "topics": [
          {
            "title": "Manipulating strings",
            "items": [
              "Reverse words in a string (trim extra spaces)",
              "Remove the outermost parentheses",
              "Largest odd number in a string (rightmost odd digit)",
              "In-place versus new-string trade-offs"
            ]
          },
          {
            "title": "Character counting",
            "items": [
              "Anagram check with a 26-length frequency array",
              "Isomorphic strings with two maps",
              "Rotate-string check (the concatenation trick)",
              "Sort characters by frequency"
            ]
          },
          {
            "title": "Prefix / format problems",
            "items": [
              "Longest common prefix across strings",
              "Max nesting depth of parentheses",
              "Careful input reading (getline versus >>)",
              "Exact output formatting"
            ]
          }
        ]
      },
      {
        "day": 37,
        "title": "Parsing & number strings",
        "topics": [
          {
            "title": "String to number",
            "items": [
              "myAtoi: sign, whitespace, overflow clamping",
              "Roman numeral to integer (the subtractive rule)",
              "Integer to Roman (greedy)",
              "Robust parsing habits"
            ]
          },
          {
            "title": "Palindrome basics",
            "items": [
              "Longest palindromic substring by center expansion O(n^2)",
              "Odd versus even centers",
              "Counting palindromic substrings",
              "Why we defer the O(n) Manacher to advanced strings"
            ]
          },
          {
            "title": "Aggregate / beauty problems",
            "items": [
              "Sum of beauty of all substrings",
              "Frequency-based scanning",
              "Sliding character counts",
              "Recognizing counting-per-substring shapes"
            ]
          }
        ]
      },
      {
        "day": 38,
        "title": "Two-pointer on strings",
        "topics": [
          {
            "title": "In-place two pointers",
            "items": [
              "Reverse a string or its vowels with two pointers",
              "Valid palindrome ignoring non-alphanumerics",
              "Case-insensitive comparisons",
              "Skipping invalid characters"
            ]
          },
          {
            "title": "Substring scanning",
            "items": [
              "Longest substring without repeating characters",
              "Character index maps",
              "Shrinking the window on a repeat",
              "A bridge to the sliding-window phase"
            ]
          },
          {
            "title": "String building & efficiency",
            "items": [
              "Avoiding O(n^2) concatenation in a loop",
              "reserve and append patterns",
              "stringstream for tokenizing",
              "Common causes of TLE in string problems"
            ]
          }
        ]
      },
      {
        "day": 39,
        "title": "Strings mixed set & recap",
        "topics": [
          {
            "title": "Medium mix",
            "items": [
              "Reverse words II (in place)",
              "Sort characters by frequency (heap or count)",
              "Group anagrams (hash by a signature)",
              "Encode and decode strings (length prefixing)"
            ]
          },
          {
            "title": "Hashing strings (intro)",
            "items": [
              "Turning a string into a comparable signature",
              "Sorted-char signature versus count signature",
              "Collisions and when to worry",
              "A preview of polynomial hashing (advanced phase)"
            ]
          },
          {
            "title": "Decision & reflection",
            "items": [
              "Choosing frequency array versus map versus two pointers",
              "Format and edge cases (empty, single char)",
              "Pattern log update",
              "Prep for linked lists"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 8,
    "title": "Two Pointers & Sliding Window",
    "subtitle": "The window / two-pointer engine that solves a huge class of subarray and substring problems in O(n)",
    "goal": "Master the grow-shrink window and know exactly when it applies versus prefix sums.",
    "icon": "🪟",
    "color": "amber",
    "days": [
      {
        "day": 40,
        "title": "Two pointers — the technique",
        "topics": [
          {
            "title": "Opposite-direction pointers",
            "items": [
              "Pair with a target sum in a sorted array",
              "Container with most water",
              "Trapping rain water (two-pointer view; the stack view comes later)",
              "Deciding which pointer to move"
            ]
          },
          {
            "title": "Same-direction pointers",
            "items": [
              "Slow/fast write-index compaction (remove or move)",
              "Merging and partitioning with two indices",
              "Invariants that guarantee correctness",
              "Avoiding rescans"
            ]
          },
          {
            "title": "When two pointers apply",
            "items": [
              "The monotonic-structure requirement (sorted or additive)",
              "Why it fails on unsorted, non-monotone data",
              "Complexity: O(n) after an O(n log n) sort",
              "Recognizing the shape"
            ]
          }
        ]
      },
      {
        "day": 41,
        "title": "Fixed-size sliding window",
        "topics": [
          {
            "title": "The window sum",
            "items": [
              "Maximum sum of a size-k subarray",
              "Slide by adding the new element and removing the old",
              "Max points from cards (window on the complement)",
              "Why recomputing is O(nk) and sliding is O(n)"
            ]
          },
          {
            "title": "Averages & counts",
            "items": [
              "First negative in every window",
              "Count anagrams of a pattern (fixed window plus frequency compare)",
              "Maintaining a frequency array as the window moves",
              "Comparing frequency arrays in O(26)"
            ]
          },
          {
            "title": "Fixed-window pitfalls",
            "items": [
              "Off-by-one on window boundaries",
              "Forgetting to remove the leaving element",
              "Initializing the first window",
              "Edge case k > n"
            ]
          }
        ]
      },
      {
        "day": 42,
        "title": "Variable-size sliding window",
        "topics": [
          {
            "title": "The longest-window template",
            "items": [
              "Grow the right, shrink the left while the window is invalid",
              "Longest substring without repeating characters",
              "Longest repeating character replacement",
              "The while-shrink pattern"
            ]
          },
          {
            "title": "At-most / exactly K",
            "items": [
              "Max consecutive ones III (at most k zeros)",
              "Binary subarray with sum = goal via atMost(goal) - atMost(goal-1)",
              "Count nice subarrays (exactly k odds)",
              "Number of substrings containing all three characters"
            ]
          },
          {
            "title": "Fruits into baskets & K distinct",
            "items": [
              "Longest subarray with at most K distinct (a map of counts)",
              "Fruits into baskets as the K=2 case",
              "Subarrays with exactly K distinct integers",
              "When a map is needed versus a fixed array"
            ]
          }
        ]
      },
      {
        "day": 43,
        "title": "Hard window problems",
        "topics": [
          {
            "title": "Minimum window",
            "items": [
              "Minimum window substring covering all chars of t",
              "The have / need counter technique",
              "Shrinking to the smallest valid window",
              "The minimum window subsequence variant"
            ]
          },
          {
            "title": "Window + deque (preview)",
            "items": [
              "Sliding window maximum with a monotonic deque",
              "Why a deque gives O(n) instead of O(nk)",
              "The full deque treatment comes in the stacks/queues phase",
              "Recognizing when a monotonic structure is needed"
            ]
          },
          {
            "title": "Choosing window versus prefix versus two pointer",
            "items": [
              "Positives-only points to a window; negatives point to prefix+hash",
              "Fixed versus variable window cues",
              "Building a decision checklist",
              "Complexity sanity checks"
            ]
          }
        ]
      },
      {
        "day": 44,
        "title": "Hashing deep dive & problem set",
        "topics": [
          {
            "title": "Designing hash keys",
            "items": [
              "Hashing pairs, tuples, and vectors as map keys",
              "Custom hash functions and anti-hash defense",
              "Frequency signatures for grouping",
              "When to use ordered versus unordered"
            ]
          },
          {
            "title": "Hashing-powered problems",
            "items": [
              "Longest consecutive sequence (revisit, O(n))",
              "Subarray sum = k and XOR = k (revisit with mastery)",
              "Group anagrams and isomorphic patterns",
              "The two-sum family"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "Prefix+hash versus window decision recap",
              "Common hashing TLEs and their fixes",
              "Pattern log update",
              "Prep for linked lists"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 9,
    "title": "Linked List",
    "subtitle": "Full command of singly and doubly lists and the pointer-manipulation classics",
    "goal": "Own the node-and-pointer model: slow/fast, reversal, cycle detection, and list arithmetic.",
    "icon": "🔗",
    "color": "violet",
    "days": [
      {
        "day": 45,
        "title": "Singly linked list foundations",
        "topics": [
          {
            "title": "The node-and-pointer model",
            "items": [
              "Why a linked list: O(1) insert/delete versus array shifting",
              "A node struct: data plus a next pointer",
              "The head pointer and the null terminator",
              "Traversal and printing without losing the head"
            ]
          },
          {
            "title": "Build & basic ops",
            "items": [
              "Insert at head, tail, or a position",
              "Delete by value or position",
              "Length and search",
              "The dummy-head trick to simplify edge cases"
            ]
          },
          {
            "title": "Discovering the list (attempt-first)",
            "items": [
              "Attempt: store items of unknown count with cheap front-insert, feel arrays hurt",
              "Arrive at pointers as the answer to that pain",
              "Memory layout: non-contiguous nodes",
              "Dangling pointers and memory leaks (delete)"
            ]
          }
        ]
      },
      {
        "day": 46,
        "title": "Doubly & circular lists",
        "topics": [
          {
            "title": "Doubly linked list",
            "items": [
              "prev plus next pointers; two-way traversal",
              "Insert and delete with prev fix-ups",
              "Reverse a doubly linked list",
              "Where a DLL shines (LRU cache preview)"
            ]
          },
          {
            "title": "Circular lists",
            "items": [
              "Circular singly and doubly lists",
              "Detecting the wrap-around",
              "Use cases (round-robin, queues)",
              "Careful loop termination"
            ]
          },
          {
            "title": "Pointer-manipulation discipline",
            "items": [
              "Draw the pointers before coding",
              "The classic lost-node bug (order your assignments)",
              "Using a dummy node to unify cases",
              "Testing on length 0, 1, and 2 lists"
            ]
          }
        ]
      },
      {
        "day": 47,
        "title": "Slow / fast pointer patterns",
        "topics": [
          {
            "title": "Middle & cycle detection",
            "items": [
              "Middle of the list (tortoise and hare)",
              "Detect a cycle (Floyd's)",
              "Why the pointers must meet inside a cycle",
              "Start of the cycle (the reset argument)"
            ]
          },
          {
            "title": "Cycle length & related",
            "items": [
              "Length of the loop",
              "Remove the Nth node from the end (gap pointers)",
              "Delete the middle node",
              "One-pass techniques"
            ]
          },
          {
            "title": "Palindrome & reorder",
            "items": [
              "Palindrome linked list (reverse the second half)",
              "Reverse second half, compare, restore",
              "Odd / even segregation",
              "Reorder patterns"
            ]
          }
        ]
      },
      {
        "day": 48,
        "title": "Reversal family",
        "topics": [
          {
            "title": "Reverse a linked list",
            "items": [
              "Iterative three-pointer reversal",
              "Recursive reversal and its stack cost",
              "Drawing each pointer move",
              "The head and tail after reversal"
            ]
          },
          {
            "title": "Reverse in groups",
            "items": [
              "Reverse nodes in k-group",
              "Handling the remaining tail (fewer than k)",
              "Connecting reversed blocks",
              "Correct boundary linking"
            ]
          },
          {
            "title": "Rotate & shift",
            "items": [
              "Rotate a list by k (find length, relink)",
              "k mod length",
              "Rebuilding the circular link then breaking it",
              "Edge cases (empty, k >= length)"
            ]
          }
        ]
      },
      {
        "day": 49,
        "title": "Arithmetic & sorting on lists",
        "topics": [
          {
            "title": "Numbers as lists",
            "items": [
              "Add two numbers (digits in reverse)",
              "Add one to a number",
              "Carry propagation",
              "Different-length handling"
            ]
          },
          {
            "title": "Sorting a list",
            "items": [
              "Sort a linked list with merge sort (why not quick)",
              "Split via slow/fast, then merge two sorted lists",
              "O(n log n), O(1) extra beyond recursion",
              "Sort 0s/1s/2s by counting or pointers"
            ]
          },
          {
            "title": "Intersection",
            "items": [
              "Intersection point of two lists (length-difference method)",
              "The two-pointer switch trick",
              "Why the pointers align",
              "Handling no intersection"
            ]
          }
        ]
      },
      {
        "day": 50,
        "title": "Hard list problems & recap",
        "topics": [
          {
            "title": "Complex pointers",
            "items": [
              "Clone a list with random pointers (the interleave method)",
              "Why interleaving avoids a hash map",
              "Flatten a multilevel / child list",
              "Merge k sorted lists (heap preview)"
            ]
          },
          {
            "title": "Design mindset",
            "items": [
              "When a linked list is the right model (LRU/LFU later)",
              "Trade-offs versus arrays and deques",
              "The cache-unfriendliness of pointer chasing",
              "Choosing singly versus doubly"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "A checklist for pointer bugs",
              "Re-derive reversal and cycle-start from scratch",
              "Pattern log update",
              "Prep for backtracking"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 10,
    "title": "Recursion Patterns & Backtracking",
    "subtitle": "Turn recursion into a problem-solving engine: subsets, permutations, combinations, grid puzzles",
    "goal": "Wield the choose / explore / un-choose template on every enumeration and constraint problem.",
    "icon": "👑",
    "color": "purple",
    "days": [
      {
        "day": 51,
        "title": "Subsets & subsequences at scale",
        "topics": [
          {
            "title": "Power set",
            "items": [
              "Generate all subsets (pick/not-pick and bitmask views)",
              "Subsets II with duplicates (sort then skip)",
              "The choice tree revisited",
              "Counting versus generating"
            ]
          },
          {
            "title": "Subset-sum family",
            "items": [
              "All subset sums, then sorting them",
              "Subsets with a target sum",
              "Pruning with sorted input",
              "Handling duplicates cleanly"
            ]
          },
          {
            "title": "The backtracking template",
            "items": [
              "The choose / explore / un-choose skeleton",
              "State, choices, and the base case",
              "Why we undo the choice",
              "Complexity of enumeration problems"
            ]
          }
        ]
      },
      {
        "day": 52,
        "title": "Combinations",
        "topics": [
          {
            "title": "Combination sum I",
            "items": [
              "Unlimited reuse of an element",
              "Index control to avoid permuted duplicates",
              "Pruning when the remainder goes negative",
              "Enumerating all valid multisets"
            ]
          },
          {
            "title": "Combination sum II",
            "items": [
              "Each element used once, with duplicates in the input",
              "Sort then skip duplicates at the same depth",
              "Avoiding duplicate combinations",
              "Boundary reasoning"
            ]
          },
          {
            "title": "Combination sum III & phone letters",
            "items": [
              "k numbers summing to n from 1..9",
              "Letter combinations of a phone number",
              "Mapping digits to letters",
              "Cartesian-product recursion"
            ]
          }
        ]
      },
      {
        "day": 53,
        "title": "Permutations",
        "topics": [
          {
            "title": "Permutations I",
            "items": [
              "Swap-based generation",
              "used-array based generation",
              "Why both are O(n! times n)",
              "Lexicographic-order considerations"
            ]
          },
          {
            "title": "Permutations II (duplicates)",
            "items": [
              "Sort then skip used duplicates",
              "The skip-if-same-as-previous-and-previous-unused rule",
              "Generating unique permutations",
              "The common off-by-one in the skip"
            ]
          },
          {
            "title": "String permutations & next-perm link",
            "items": [
              "Permutations of a string",
              "Connecting to next_permutation",
              "Ordered generation without recursion",
              "When iterative beats recursive"
            ]
          }
        ]
      },
      {
        "day": 54,
        "title": "Grid backtracking",
        "topics": [
          {
            "title": "Rat in a maze",
            "items": [
              "Enumerate all paths with a fixed direction order",
              "Visited marking and un-marking",
              "Lexicographic path strings",
              "Blocked-cell handling"
            ]
          },
          {
            "title": "Word search",
            "items": [
              "DFS from each cell with backtracking",
              "Marking cells during the current path",
              "Pruning on a mismatch",
              "The complexity bound"
            ]
          },
          {
            "title": "Flood-style recursion",
            "items": [
              "Number of islands via grid DFS",
              "Distinct islands (a shape signature)",
              "Why grids are graphs in disguise (light preview)",
              "Recursion depth on big grids"
            ]
          }
        ]
      },
      {
        "day": 55,
        "title": "Constraint puzzles — part 1",
        "topics": [
          {
            "title": "N-Queens",
            "items": [
              "Place one queen per row, check columns and diagonals",
              "O(1) attack checks with arrays or sets",
              "Counting versus printing all solutions",
              "The diagonal-index trick"
            ]
          },
          {
            "title": "Sudoku solver",
            "items": [
              "Try digits 1..9 in the first empty cell",
              "Validity check for row, column, and box",
              "Backtrack on a dead end",
              "Light ordering heuristics"
            ]
          },
          {
            "title": "M-coloring",
            "items": [
              "Assign colors under adjacency constraints",
              "The safe-color check",
              "Pruning symmetric colorings",
              "Graph-coloring framing (light)"
            ]
          }
        ]
      },
      {
        "day": 56,
        "title": "Constraint puzzles — part 2 & partitioning",
        "topics": [
          {
            "title": "Palindrome partitioning",
            "items": [
              "Cut positions and recurse on the suffix",
              "isPalindrome checks (optionally precomputed)",
              "Collecting all partitions",
              "The complexity"
            ]
          },
          {
            "title": "Expression add operators",
            "items": [
              "Insert +, -, * between digits to reach a target",
              "Handling multiplication precedence with a running last-operand",
              "Leading-zero pruning",
              "Careful long long use"
            ]
          },
          {
            "title": "Kth permutation sequence",
            "items": [
              "The factorial number system",
              "Building the answer digit by digit",
              "Avoiding full enumeration",
              "The index math"
            ]
          }
        ]
      },
      {
        "day": 57,
        "title": "Backtracking mastery & pruning",
        "topics": [
          {
            "title": "Pruning strategies",
            "items": [
              "Bounding, ordering, and constraint propagation",
              "Feasibility checks before recursing",
              "The memo-versus-backtrack boundary",
              "Recognizing when a problem is DP, not backtracking"
            ]
          },
          {
            "title": "Mixed set",
            "items": [
              "Combinations / permutations / partitions under time pressure",
              "Choosing index-control versus a used-array",
              "Generating versus counting",
              "Output formatting"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The universal backtracking template card",
              "Re-derive N-Queens from scratch",
              "Pattern log update",
              "Prep for bit manipulation"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 11,
    "title": "Bit Manipulation",
    "subtitle": "Think in bits: masks, tricks, and the subset / XOR problems that appear constantly",
    "goal": "Get comfortable enough with bits that masks and XOR tricks become a first instinct.",
    "icon": "🧮",
    "color": "zinc",
    "days": [
      {
        "day": 58,
        "title": "Bits fundamentals",
        "topics": [
          {
            "title": "Binary & operators",
            "items": [
              "Binary representation and two's complement for negatives",
              "AND, OR, XOR, NOT, and shift semantics",
              "Arithmetic versus logical shift, and shifting signed values",
              "A bit as a boolean switch (mental model)"
            ]
          },
          {
            "title": "Single-bit operations",
            "items": [
              "Check the ith bit: (n >> i) & 1",
              "Set, clear, and toggle the ith bit",
              "Remove the lowest set bit: n & (n-1)",
              "Isolate the lowest set bit: n & -n"
            ]
          },
          {
            "title": "Counting & powers",
            "items": [
              "Count set bits (Kernighan and __builtin_popcount)",
              "Check a power of two",
              "Swap two numbers with XOR",
              "Why XOR is its own inverse"
            ]
          }
        ]
      },
      {
        "day": 59,
        "title": "XOR problems",
        "topics": [
          {
            "title": "Single number family",
            "items": [
              "Single number I (XOR all)",
              "Single number II (every other appears three times)",
              "Single number III (two uniques; partition by a set bit)",
              "The bit-count-mod-k idea"
            ]
          },
          {
            "title": "XOR ranges & basics",
            "items": [
              "XOR of 1..n by the pattern",
              "XOR of a range [L, R]",
              "The prefix-XOR framing",
              "Minimum bit flips to convert A to B"
            ]
          },
          {
            "title": "Divide & multiply with bits",
            "items": [
              "Divide two integers without / or *",
              "Multiply via shifts and adds",
              "Overflow edge cases (INT_MIN)",
              "Fast exponentiation via bits (revisit)"
            ]
          }
        ]
      },
      {
        "day": 60,
        "title": "Subsets via bitmask",
        "topics": [
          {
            "title": "Enumerating subsets",
            "items": [
              "Iterate masks 0..2^n-1; bit i means include element i",
              "Print the power set with bitmasks",
              "Why this is sometimes cleaner than recursion",
              "Complexity O(2^n times n)"
            ]
          },
          {
            "title": "A bitmask as a set",
            "items": [
              "Union, intersection, difference as OR, AND, AND-NOT",
              "Adding and removing elements",
              "Iterating the set bits of a mask",
              "popcount to size the set"
            ]
          },
          {
            "title": "Submask enumeration (preview)",
            "items": [
              "Iterate all submasks of a mask in O(3^n) total",
              "Where it appears (SOS DP, later)",
              "The for (s = m; s; s = (s-1) & m) trick",
              "Deferring full SOS to advanced DP"
            ]
          }
        ]
      },
      {
        "day": 61,
        "title": "Bit tricks & the math bridge",
        "topics": [
          {
            "title": "Practical tricks",
            "items": [
              "Lowest and highest set bit; __builtin_clz and ctz",
              "Next power of two and rounding",
              "Gray code generation",
              "Bit reversal"
            ]
          },
          {
            "title": "Bitmask problem set",
            "items": [
              "Count numbers with a bit property",
              "Maximum XOR pair (a trie preview)",
              "Bitmask over small n in problems",
              "When n <= 20 screams bitmask"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "A bit-trick cheat card",
              "Re-derive single-number-III from scratch",
              "Pattern log update",
              "Prep for stacks and queues"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 12,
    "title": "Stacks & Queues",
    "subtitle": "Implement them, master expression evaluation, and the monotonic-stack pattern",
    "goal": "Discover the stack from a bracket problem, then wield monotonic stacks on the next-greater family.",
    "icon": "🥞",
    "color": "orange",
    "days": [
      {
        "day": 62,
        "title": "Stacks & queues from scratch",
        "topics": [
          {
            "title": "Stack",
            "items": [
              "The LIFO model; push, pop, top, empty",
              "Implement a stack with an array and with a linked list",
              "std::stack and its underlying container",
              "Overflow and underflow guards"
            ]
          },
          {
            "title": "Queue & deque",
            "items": [
              "The FIFO model; enqueue, dequeue, front",
              "Implement a queue with a circular array and with a list",
              "std::queue and std::deque",
              "When a deque replaces both"
            ]
          },
          {
            "title": "Cross-implementations",
            "items": [
              "Stack using two queues; queue using two stacks",
              "Amortized analysis of the two-stack queue",
              "Min stack (an auxiliary min)",
              "Design trade-offs"
            ]
          }
        ]
      },
      {
        "day": 63,
        "title": "Discovering the stack (attempt-first) & validity",
        "topics": [
          {
            "title": "Attempt-first bracket matching",
            "items": [
              "Attempt: check balanced parentheses naively, feel the need for LIFO",
              "Arrive at the stack as the tool",
              "Valid parentheses (multiple bracket types)",
              "Minimum additions to make it valid"
            ]
          },
          {
            "title": "Stack-driven parsing",
            "items": [
              "Remove outermost / redundant parentheses",
              "Decode a string (nested repeats)",
              "Basic calculator (signs and parentheses)",
              "The push-context / pop-context pattern"
            ]
          },
          {
            "title": "When to reach for a stack",
            "items": [
              "Nested structure and match-the-most-recent cues",
              "Undo / backtrack via a stack",
              "Simulation with pending items",
              "Recognizing the shape"
            ]
          }
        ]
      },
      {
        "day": 64,
        "title": "Expression notation",
        "topics": [
          {
            "title": "Infix / prefix / postfix",
            "items": [
              "What each notation means and why postfix is machine-friendly",
              "Evaluate postfix and prefix",
              "Operator precedence and associativity",
              "The stack evaluation loop"
            ]
          },
          {
            "title": "Conversions",
            "items": [
              "Infix to postfix (the shunting-yard idea)",
              "Infix to prefix",
              "Postfix and prefix back to infix",
              "Handling parentheses and precedence"
            ]
          },
          {
            "title": "Robust evaluation",
            "items": [
              "Multi-digit numbers and spaces",
              "Unary-minus handling",
              "Error cases",
              "Testing tricky expressions"
            ]
          }
        ]
      },
      {
        "day": 65,
        "title": "Monotonic stack — part 1",
        "topics": [
          {
            "title": "Next greater / smaller",
            "items": [
              "Next greater element I and II (circular)",
              "Next and previous smaller element",
              "The monotonic-stack invariant",
              "Why each element is pushed and popped once (O(n))"
            ]
          },
          {
            "title": "Spans & counts",
            "items": [
              "The stock span problem",
              "Number of next-greater elements to the right",
              "Sum of subarray minimums (the contribution technique)",
              "Sum of subarray ranges"
            ]
          },
          {
            "title": "The contribution technique",
            "items": [
              "Counting how many subarrays each element dominates",
              "Handling duplicates (strict versus non-strict)",
              "Left and right boundary computation",
              "Avoiding double counting"
            ]
          }
        ]
      },
      {
        "day": 66,
        "title": "Monotonic stack — part 2",
        "topics": [
          {
            "title": "Histogram problems",
            "items": [
              "Largest rectangle in a histogram",
              "Left and right smaller boundaries",
              "The one-pass variant",
              "Maximal rectangle in a binary matrix (row histograms)"
            ]
          },
          {
            "title": "Water & collisions",
            "items": [
              "Trapping rain water (stack and two-pointer views)",
              "Asteroid collision",
              "Remove k digits (a monotonic increasing stack)",
              "Largest number after removals"
            ]
          },
          {
            "title": "Deque-based windows",
            "items": [
              "Sliding window maximum with a monotonic deque",
              "Why the deque stays sorted",
              "First negative in a window (revisit)",
              "The deque as both stack and queue"
            ]
          }
        ]
      },
      {
        "day": 67,
        "title": "Design with stacks/queues & recap",
        "topics": [
          {
            "title": "LRU cache",
            "items": [
              "A doubly linked list plus a hash map",
              "O(1) get and put",
              "Eviction of the least-recently-used entry",
              "Why a plain map is not enough"
            ]
          },
          {
            "title": "LFU & celebrity",
            "items": [
              "LFU cache (frequency buckets)",
              "The celebrity problem (stack elimination)",
              "Online stock span (revisit)",
              "Design reasoning"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The monotonic-stack decision card",
              "Re-derive largest-rectangle from scratch",
              "Pattern log update",
              "Prep for heaps"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 13,
    "title": "Heaps / Priority Queues",
    "subtitle": "The binary heap and priority_queue for top-K, scheduling and streaming-median problems",
    "goal": "Understand the heap well enough to reach for it instantly on top-K and streaming problems.",
    "icon": "⛰️",
    "color": "red",
    "days": [
      {
        "day": 68,
        "title": "The binary heap",
        "topics": [
          {
            "title": "Heap structure",
            "items": [
              "A complete binary tree in an array; parent/child index math",
              "The heap property (min-heap versus max-heap)",
              "Why an array, not nodes",
              "O(1) top, O(log n) push and pop"
            ]
          },
          {
            "title": "Heap operations",
            "items": [
              "sift-up (insert) and sift-down (extract)",
              "Build-heap in O(n) (the bottom-up argument)",
              "Check if an array is a heap",
              "Convert a min-heap to a max-heap"
            ]
          },
          {
            "title": "std::priority_queue",
            "items": [
              "Default max-heap; min-heap with greater<>",
              "Custom comparators for structs",
              "Common API pitfalls (top before an empty check)",
              "Heap versus a sorted structure"
            ]
          }
        ]
      },
      {
        "day": 69,
        "title": "Top-K & the kth element",
        "topics": [
          {
            "title": "Kth largest / smallest",
            "items": [
              "Kth largest with a size-k min-heap",
              "Kth smallest with a size-k max-heap",
              "Why size-k heaps beat full sorting for streaming",
              "The quickselect alternative (revisit)"
            ]
          },
          {
            "title": "Top-K frequent",
            "items": [
              "Count then heap by frequency",
              "The bucket-sort alternative O(n)",
              "K closest points",
              "Comparator design"
            ]
          },
          {
            "title": "Streaming",
            "items": [
              "Kth largest in a stream (a running heap)",
              "Replace elements by rank",
              "When the data does not fit in memory",
              "Heap-size discipline"
            ]
          }
        ]
      },
      {
        "day": 70,
        "title": "Two-heap & scheduling",
        "topics": [
          {
            "title": "Median from a data stream",
            "items": [
              "Max-heap (low half) plus min-heap (high half)",
              "The rebalancing rule",
              "Odd / even median",
              "Sliding-window median (light)"
            ]
          },
          {
            "title": "Scheduling with heaps",
            "items": [
              "Task scheduler (greedy with counts)",
              "Hands of straights",
              "Connect ropes with minimum cost",
              "Minimum-cost / max-profit patterns"
            ]
          },
          {
            "title": "Merge & combine",
            "items": [
              "Merge k sorted lists or arrays with a heap",
              "Smallest range covering k lists",
              "Maximum sum combinations",
              "A heap of (value, source) tuples"
            ]
          }
        ]
      },
      {
        "day": 71,
        "title": "Heap problem set & recap",
        "topics": [
          {
            "title": "Design",
            "items": [
              "Design Twitter (merge recent tweets)",
              "Ugly / super-ugly numbers with a heap",
              "Reorganize a string",
              "A heap as a scheduler"
            ]
          },
          {
            "title": "Mixed",
            "items": [
              "Top-K versus kth versus median decision",
              "Heap versus multiset versus sort",
              "Complexity budgeting",
              "Comparator bugs"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The heap decision card",
              "Re-derive median-of-stream",
              "Pattern log update",
              "Prep for greedy"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 14,
    "title": "Greedy Algorithms",
    "subtitle": "Recognize when local choices are globally optimal, and prove it",
    "goal": "Build the instinct to spot a greedy structure and back it with an exchange argument.",
    "icon": "🪙",
    "color": "lime",
    "days": [
      {
        "day": 72,
        "title": "Greedy foundations",
        "topics": [
          {
            "title": "What makes greedy work",
            "items": [
              "The greedy-choice property and optimal substructure",
              "The exchange argument (why a swap cannot improve)",
              "When greedy fails (and DP is needed)",
              "Proving versus guessing"
            ]
          },
          {
            "title": "Easy greedy",
            "items": [
              "Assign cookies",
              "Lemonade change",
              "Valid parenthesis string (greedy ranges)",
              "Minimum coins (canonical coin systems)"
            ]
          },
          {
            "title": "Sorting-enabled greedy",
            "items": [
              "Why sorting is the usual first step",
              "Sorting by the right key",
              "Fractional knapsack (value/weight ratio)",
              "A correctness sketch"
            ]
          }
        ]
      },
      {
        "day": 73,
        "title": "Interval scheduling",
        "topics": [
          {
            "title": "Activity selection",
            "items": [
              "N meetings in one room (sort by end time)",
              "Why earliest-finish-first is optimal",
              "Maximum non-overlapping intervals",
              "Minimum removals to make intervals non-overlapping"
            ]
          },
          {
            "title": "Interval variants",
            "items": [
              "Insert interval and merge intervals (greedy revisit)",
              "Minimum platforms (an event sweep)",
              "Meeting rooms II (a heap of end times)",
              "The sweep-line intuition"
            ]
          },
          {
            "title": "Proof practice",
            "items": [
              "Stating the greedy choice precisely",
              "An exchange argument on intervals",
              "Counterexample hunting",
              "Recognizing non-greedy traps"
            ]
          }
        ]
      },
      {
        "day": 74,
        "title": "Scheduling & sequencing",
        "topics": [
          {
            "title": "Job sequencing",
            "items": [
              "Deadline plus profit: sort by profit, take the latest free slot",
              "Use the already taught direct slot scan; DSU acceleration is revisited after DSU is introduced",
              "Why the latest slot is optimal",
              "The complexity"
            ]
          },
          {
            "title": "Jump games",
            "items": [
              "Jump game I (reachability)",
              "Jump game II (minimum jumps, a BFS-like greedy)",
              "The farthest-reach frontier",
              "Why greedy beats DP here"
            ]
          },
          {
            "title": "Candy & gas",
            "items": [
              "Candy distribution (two passes)",
              "Gas station (a running deficit)",
              "Shortest-job-first basics",
              "Two-direction greedy"
            ]
          }
        ]
      },
      {
        "day": 75,
        "title": "Greedy problem set & recap",
        "topics": [
          {
            "title": "Mixed hard greedy",
            "items": [
              "Non-overlapping intervals under pressure",
              "Partition labels",
              "Rearrange with constraints",
              "Choosing the sort key"
            ]
          },
          {
            "title": "Greedy versus DP boundary",
            "items": [
              "Signs a problem is DP, not greedy",
              "Local versus global optimum tests",
              "When to switch approaches mid-solve",
              "Building intuition"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The greedy decision card and proof checklist",
              "Re-derive activity selection",
              "Pattern log update",
              "Prep for binary trees"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 15,
    "title": "Binary Trees",
    "subtitle": "Total command of tree traversals and the medium/hard tree problems",
    "goal": "Make tree recursion automatic, the foundation for BST, tries, and tree DP.",
    "icon": "🌳",
    "color": "green",
    "days": [
      {
        "day": 76,
        "title": "Trees & traversals",
        "topics": [
          {
            "title": "Tree basics",
            "items": [
              "A node with left and right; root, leaf, height, depth",
              "The recursive structure (a tree is subtrees)",
              "Building and representing a tree",
              "Why recursion is natural on trees"
            ]
          },
          {
            "title": "DFS traversals",
            "items": [
              "Preorder, inorder, postorder (recursive)",
              "What each order means and when to use it",
              "The single-recursion mental model",
              "Tracing on a 7-node tree"
            ]
          },
          {
            "title": "BFS traversal",
            "items": [
              "Level order with a queue",
              "Level-by-level grouping",
              "Reverse level order",
              "The queue-size snapshot trick"
            ]
          }
        ]
      },
      {
        "day": 77,
        "title": "Iterative traversals",
        "topics": [
          {
            "title": "Iterative DFS",
            "items": [
              "Preorder with an explicit stack",
              "Inorder with a stack (the leftmost dive)",
              "Postorder with one or two stacks",
              "Why iterative avoids recursion-depth limits"
            ]
          },
          {
            "title": "All-in-one",
            "items": [
              "Pre / in / post in a single traversal (a state machine)",
              "Comparing recursive versus iterative cost",
              "Space analysis",
              "When iterative is required"
            ]
          },
          {
            "title": "Views",
            "items": [
              "Right and left side view",
              "Top and bottom view (vertical plus first/last)",
              "Vertical order traversal (a map of columns)",
              "Coordinate bookkeeping"
            ]
          }
        ]
      },
      {
        "day": 78,
        "title": "Tree properties",
        "topics": [
          {
            "title": "Height & balance",
            "items": [
              "Height / max depth",
              "Check height-balanced (bottom-up)",
              "Diameter (the longest path)",
              "The return-two-things pattern"
            ]
          },
          {
            "title": "Sums & paths",
            "items": [
              "Maximum path sum (any node to any node)",
              "Path sum and root-to-leaf sums",
              "Children-sum property",
              "Global versus returned value"
            ]
          },
          {
            "title": "Symmetry & identity",
            "items": [
              "Same tree / identical",
              "Symmetric tree (mirror)",
              "Invert a binary tree",
              "Structural comparison"
            ]
          }
        ]
      },
      {
        "day": 79,
        "title": "Path & ancestor problems",
        "topics": [
          {
            "title": "Root-to-node path",
            "items": [
              "Print the path to a node",
              "All root-to-leaf paths",
              "Path existence",
              "Backtracking on trees"
            ]
          },
          {
            "title": "Lowest common ancestor",
            "items": [
              "LCA of a binary tree (return-where-found)",
              "Why the split point is the LCA",
              "LCA with parent pointers",
              "Distance between two nodes"
            ]
          },
          {
            "title": "Distance-K problems",
            "items": [
              "Nodes at distance K from a target",
              "Build a parent map, then BFS",
              "Minimum time to burn the tree",
              "Treating the tree as a graph"
            ]
          }
        ]
      },
      {
        "day": 80,
        "title": "Width, counting & special structure",
        "topics": [
          {
            "title": "Width & counting",
            "items": [
              "Maximum width of a binary tree (index numbering)",
              "Overflow-safe indexing",
              "Count nodes in a complete tree (O(log^2 n))",
              "The left/right-height shortcut"
            ]
          },
          {
            "title": "Boundary & zigzag",
            "items": [
              "Boundary traversal (left edge, leaves, right edge)",
              "Zigzag / spiral level order",
              "Careful de-duplication of the corners",
              "The direction flag"
            ]
          },
          {
            "title": "Requirements for traversal",
            "items": [
              "Which traversal pairs uniquely define a tree",
              "Why inorder + pre/post works but pre+post does not (in general)",
              "Full versus general trees",
              "Reconstruction intuition"
            ]
          }
        ]
      },
      {
        "day": 81,
        "title": "Construction & serialization",
        "topics": [
          {
            "title": "Build from traversals",
            "items": [
              "Construct from preorder + inorder",
              "Construct from postorder + inorder",
              "Using a value-to-index map for O(n)",
              "Recursive range building"
            ]
          },
          {
            "title": "Serialize / deserialize",
            "items": [
              "Encode a tree to a string and back (BFS or DFS)",
              "Null markers",
              "Round-trip correctness",
              "Handling large trees"
            ]
          },
          {
            "title": "Special constructions",
            "items": [
              "Construct a BST from preorder (BST preview)",
              "Flatten a tree to a linked list",
              "Populate next-right pointers",
              "In-place relinking"
            ]
          }
        ]
      },
      {
        "day": 82,
        "title": "Morris traversal & O(1) space",
        "topics": [
          {
            "title": "Threaded traversal",
            "items": [
              "Morris inorder (temporary threads)",
              "Why it is O(1) extra space",
              "Restoring the tree during traversal",
              "The predecessor-linking step"
            ]
          },
          {
            "title": "Morris preorder & uses",
            "items": [
              "The Morris preorder variant",
              "Trade-offs versus a stack traversal",
              "When O(1) space matters",
              "The correctness argument"
            ]
          },
          {
            "title": "Tree DP preview",
            "items": [
              "Return info from children as DP on a tree",
              "Diameter and max-path as tree DP",
              "Foreshadowing the advanced tree-DP phase",
              "The reusable pattern"
            ]
          }
        ]
      },
      {
        "day": 83,
        "title": "Tree capstone & recap",
        "topics": [
          {
            "title": "Mixed hard",
            "items": [
              "Max path sum / diameter / LCA under pressure",
              "Views and boundary",
              "Construction problems",
              "Time-boxed solving"
            ]
          },
          {
            "title": "Decision-making",
            "items": [
              "Choosing the traversal per problem",
              "Return-value versus global-variable design",
              "Recursion versus iteration",
              "Complexity budgeting"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The tree pattern card",
              "Re-derive LCA and diameter",
              "Pattern log update",
              "Prep for BST"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 16,
    "title": "Binary Search Trees",
    "subtitle": "Use the BST ordering property for fast search/insert/delete and the classic problems",
    "goal": "Exploit the left<node<right invariant, and know when to just use std::set/map.",
    "icon": "🌲",
    "color": "teal",
    "days": [
      {
        "day": 84,
        "title": "BST fundamentals",
        "topics": [
          {
            "title": "The BST property",
            "items": [
              "left < node < right, recursively",
              "Search in O(h) and why h matters",
              "Inorder of a BST is sorted (the key fact)",
              "Balanced versus skewed trees"
            ]
          },
          {
            "title": "Insert & basic queries",
            "items": [
              "Insert into a BST",
              "Min, max, floor, and ceil",
              "Search and validate a value",
              "Iterative versus recursive"
            ]
          },
          {
            "title": "Validate a BST",
            "items": [
              "The min/max range technique",
              "Why checking only children is wrong",
              "The inorder-increasing check",
              "The common validation bug"
            ]
          }
        ]
      },
      {
        "day": 85,
        "title": "Deletion & order statistics",
        "topics": [
          {
            "title": "Delete a node",
            "items": [
              "The three cases (leaf, one child, two children)",
              "Inorder-successor replacement",
              "Relinking correctly",
              "Testing all cases"
            ]
          },
          {
            "title": "Kth smallest / largest",
            "items": [
              "Inorder with a counter",
              "The augmented subtree-size approach",
              "Kth largest via reverse inorder",
              "Complexity"
            ]
          },
          {
            "title": "Successor / predecessor",
            "items": [
              "Inorder successor and predecessor",
              "Using parent pointers or the search path",
              "BST iterator (controlled inorder with a stack)",
              "An O(h) space iterator"
            ]
          }
        ]
      },
      {
        "day": 86,
        "title": "BST problems",
        "topics": [
          {
            "title": "LCA & construction",
            "items": [
              "LCA in a BST (use the ordering)",
              "Construct a BST from preorder (the bounds method)",
              "Construct from a sorted array (balanced)",
              "Why ordering simplifies LCA"
            ]
          },
          {
            "title": "Two-sum & pairs",
            "items": [
              "Two-sum in a BST (BST iterator from both ends)",
              "Pairs with a target",
              "Merge two BSTs",
              "Using inorder streams"
            ]
          },
          {
            "title": "Recover & repair",
            "items": [
              "Recover a BST with two swapped nodes",
              "Finding the two violators in inorder",
              "Morris-based O(1) space recovery",
              "Correctness"
            ]
          }
        ]
      },
      {
        "day": 87,
        "title": "BST capstone & recap",
        "topics": [
          {
            "title": "Largest BST & mixed",
            "items": [
              "Largest BST subtree in a binary tree (bottom-up)",
              "Returning (isBST, min, max, size)",
              "Ceil / floor / successor under pressure",
              "Time-boxed solving"
            ]
          },
          {
            "title": "Balancing intuition",
            "items": [
              "Why a skewed BST degrades to O(n)",
              "Self-balancing trees exist (AVL / red-black) — conceptual only",
              "std::set and std::map are balanced BSTs (revisit)",
              "When to just use std::set"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The BST decision card",
              "Re-derive delete and validate",
              "Pattern log update",
              "Prep for tries"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 17,
    "title": "Tries",
    "subtitle": "The prefix-tree structure for fast string-prefix queries and bitwise-XOR problems",
    "goal": "See how sharing prefixes in a tree turns repeated prefix work into O(length) queries.",
    "icon": "🌴",
    "color": "emerald",
    "days": [
      {
        "day": 88,
        "title": "Trie fundamentals",
        "topics": [
          {
            "title": "The prefix tree",
            "items": [
              "Nodes with child links (array[26] or a map) plus an end flag",
              "Insert and search a word",
              "startsWith (prefix search)",
              "Space/time trade-offs versus a hash set"
            ]
          },
          {
            "title": "Trie II (counts)",
            "items": [
              "Count words equal to and starting with a prefix",
              "Erase a word (decrement counts)",
              "Reference counting per node",
              "Memory management"
            ]
          },
          {
            "title": "Discovering the trie (attempt-first)",
            "items": [
              "Attempt: many prefix queries with a set, feel the rescan cost",
              "Arrive at sharing prefixes in a tree",
              "Why O(length) per query beats O(n times length)",
              "The shared-prefix insight"
            ]
          }
        ]
      },
      {
        "day": 89,
        "title": "Trie string problems",
        "topics": [
          {
            "title": "Prefix problems",
            "items": [
              "Longest word with all prefixes present",
              "Autocomplete / complete a dictionary word",
              "Word break with a trie (light)",
              "Prefix counting"
            ]
          },
          {
            "title": "Distinct substrings",
            "items": [
              "Count distinct substrings via a trie of suffixes",
              "Why each new node is a new substring",
              "O(n^2) build complexity",
              "Comparison with suffix structures (later)"
            ]
          },
          {
            "title": "Word search II",
            "items": [
              "Trie plus grid DFS for many words at once",
              "Pruning finished branches",
              "Why a trie beats searching each word",
              "Backtracking with a trie"
            ]
          }
        ]
      },
      {
        "day": 90,
        "title": "Bitwise tries (XOR)",
        "topics": [
          {
            "title": "Binary trie",
            "items": [
              "Insert numbers as 32-bit paths",
              "Maximum XOR of two numbers",
              "The greedy bit choice (go opposite when possible)",
              "Why MSB-first is optimal"
            ]
          },
          {
            "title": "XOR with constraints",
            "items": [
              "Maximum XOR with an element <= limit (offline queries)",
              "Sorting queries and inserting incrementally",
              "Erasing from a binary trie",
              "Query design"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The trie decision card (strings versus bits)",
              "Re-derive max-XOR",
              "Pattern log update",
              "Prep for graphs"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 18,
    "title": "Graphs",
    "subtitle": "Representations, BFS/DFS, toposort, shortest paths, MST and DSU, in a clean dependency order",
    "goal": "The biggest phase: build every core graph algorithm on top of the traversals, ending with DSU.",
    "icon": "🕸️",
    "color": "sky",
    "days": [
      {
        "day": 91,
        "title": "Graph representations & traversal",
        "topics": [
          {
            "title": "Modeling graphs",
            "items": [
              "Vertices and edges; directed versus undirected; weighted",
              "Adjacency matrix versus list (space/time)",
              "Building from an edge list",
              "Degree, self-loops, multi-edges"
            ]
          },
          {
            "title": "BFS",
            "items": [
              "Queue-based level exploration",
              "The visited array and why it is essential",
              "The BFS tree and shortest path in unweighted graphs",
              "Connected components via BFS"
            ]
          },
          {
            "title": "DFS",
            "items": [
              "Recursive and iterative DFS",
              "The DFS tree and discovery/finish times (light)",
              "Connected components via DFS",
              "Recursion depth on big graphs"
            ]
          }
        ]
      },
      {
        "day": 92,
        "title": "Grid & component problems",
        "topics": [
          {
            "title": "Grids as graphs",
            "items": [
              "4- and 8-directional movement",
              "Number of provinces (components)",
              "Number of islands",
              "Flood fill"
            ]
          },
          {
            "title": "Multi-source BFS",
            "items": [
              "Rotten oranges (simultaneous spread)",
              "0/1 matrix (nearest-zero distance)",
              "Why multi-source starts all sources at once",
              "Distance layering"
            ]
          },
          {
            "title": "Boundary problems",
            "items": [
              "Surrounded regions (start from the borders)",
              "Number of enclaves",
              "Distinct islands (normalized shapes)",
              "Marking visited in place"
            ]
          }
        ]
      },
      {
        "day": 93,
        "title": "Cycle detection & bipartite",
        "topics": [
          {
            "title": "Cycle in an undirected graph",
            "items": [
              "Cycle detection with BFS (parent tracking)",
              "Cycle detection with DFS",
              "Why the parent check matters",
              "Handling a forest"
            ]
          },
          {
            "title": "Bipartite",
            "items": [
              "2-coloring with BFS/DFS",
              "An odd cycle means not bipartite",
              "Applications (matching preview)",
              "Component-wise coloring"
            ]
          },
          {
            "title": "Cycle in a directed graph",
            "items": [
              "DFS with a recursion-stack (path colors)",
              "White / gray / black states",
              "Why the undirected trick fails here",
              "Back edges"
            ]
          }
        ]
      },
      {
        "day": 94,
        "title": "Topological sort",
        "topics": [
          {
            "title": "Toposort basics",
            "items": [
              "DAGs and a valid ordering",
              "DFS-based toposort (finish order)",
              "Kahn's algorithm (indegree plus a queue)",
              "Detecting a cycle via Kahn"
            ]
          },
          {
            "title": "Toposort applications",
            "items": [
              "Course schedule I and II",
              "Eventual safe states",
              "Ordering with constraints",
              "Multiple valid orders"
            ]
          },
          {
            "title": "Alien dictionary",
            "items": [
              "Deriving edges from adjacent words",
              "Building and toposorting the graph",
              "Invalid-order detection (the prefix case)",
              "Edge cases"
            ]
          }
        ]
      },
      {
        "day": 95,
        "title": "Shortest paths — unweighted & DAG",
        "topics": [
          {
            "title": "Unweighted shortest path",
            "items": [
              "BFS gives the shortest path when weights are equal",
              "Shortest path in a binary maze",
              "Path reconstruction (a parent array)",
              "Why BFS layers equal distances"
            ]
          },
          {
            "title": "Shortest path in a DAG",
            "items": [
              "Toposort then relax edges in order",
              "Why a DAG allows a single pass",
              "Longest path in a DAG",
              "Comparison with Dijkstra"
            ]
          },
          {
            "title": "0-1 BFS",
            "items": [
              "Deque-based 0-1 BFS",
              "When edge weights are only 0 or 1",
              "push-front versus push-back",
              "Complexity O(V+E)"
            ]
          }
        ]
      },
      {
        "day": 96,
        "title": "Dijkstra",
        "topics": [
          {
            "title": "Dijkstra with a priority queue",
            "items": [
              "Greedy: settle the nearest unsettled node",
              "Why non-negative weights are required",
              "PQ versus set implementation",
              "Path reconstruction"
            ]
          },
          {
            "title": "Dijkstra variants",
            "items": [
              "Shortest path in a weighted grid",
              "Path with minimum effort",
              "Swim in rising water",
              "Modified relaxation conditions"
            ]
          },
          {
            "title": "Constrained shortest paths",
            "items": [
              "Cheapest flights within k stops",
              "Number of ways to reach with the shortest distance",
              "Minimum multiplications to reach the end",
              "State = (node, extra dimension)"
            ]
          }
        ]
      },
      {
        "day": 97,
        "title": "Bellman-Ford & Floyd-Warshall",
        "topics": [
          {
            "title": "Bellman-Ford",
            "items": [
              "Relax all edges V-1 times",
              "Negative edges and negative-cycle detection",
              "Why V-1 iterations suffice",
              "When to use it over Dijkstra"
            ]
          },
          {
            "title": "Floyd-Warshall",
            "items": [
              "All-pairs shortest paths via DP over intermediates",
              "O(V^3) and when it is acceptable",
              "Detecting a negative cycle (the diagonal)",
              "Transitive closure"
            ]
          },
          {
            "title": "Applications",
            "items": [
              "City with the smallest number of reachable neighbors",
              "Choosing the right shortest-path algorithm",
              "A complexity comparison table",
              "The negative-weights decision"
            ]
          }
        ]
      },
      {
        "day": 98,
        "title": "Minimum spanning tree — Prim's",
        "topics": [
          {
            "title": "MST concept",
            "items": [
              "A spanning tree with minimum total weight",
              "The cut property (why greedy works)",
              "Prim's algorithm (grow a tree with a PQ)",
              "Complexity"
            ]
          },
          {
            "title": "Implementing Prim's",
            "items": [
              "The (weight, node) priority queue",
              "Marking nodes in the tree",
              "Reconstructing the MST edges",
              "Dense-graph variant"
            ]
          },
          {
            "title": "MST applications (Prim-only)",
            "items": [
              "Connecting cities with minimum cost",
              "Minimum cost to connect points",
              "When Prim's fits better than Kruskal's",
              "Real-world framing"
            ]
          }
        ]
      },
      {
        "day": 99,
        "title": "Disjoint Set Union & Kruskal's",
        "topics": [
          {
            "title": "The DSU idea (attempt-first)",
            "items": [
              "Attempt: answer are-these-connected repeatedly, feel the union-find need",
              "find with path compression",
              "union by rank / size",
              "Near-O(1) amortized (inverse Ackermann)"
            ]
          },
          {
            "title": "DSU correctness & basics",
            "items": [
              "The representative / root model",
              "Why path compression plus rank gives the bound",
              "Counting components",
              "The common uninitialized-parent bug"
            ]
          },
          {
            "title": "Kruskal's MST",
            "items": [
              "Sort edges, then add if it joins two components",
              "Why the greedy edge is safe (cut property)",
              "Prim versus Kruskal decision",
              "Complexity"
            ]
          }
        ]
      },
      {
        "day": 100,
        "title": "DSU applications",
        "topics": [
          {
            "title": "Connectivity problems",
            "items": [
              "Number of provinces via DSU",
              "Number of operations to make a network connected",
              "Accounts merge",
              "Grouping by union"
            ]
          },
          {
            "title": "Grid DSU",
            "items": [
              "Number of islands II (online)",
              "Making a large island",
              "Most stones removed",
              "Coordinate-to-id mapping"
            ]
          },
          {
            "title": "Advanced DSU patterns",
            "items": [
              "Union carrying extra info (weighted DSU preview)",
              "Offline queries with DSU",
              "When DSU beats BFS/DFS",
              "Recognizing the shape"
            ]
          }
        ]
      },
      {
        "day": 101,
        "title": "Advanced graph topics (intro) & recap",
        "topics": [
          {
            "title": "Bridges & articulation (intro)",
            "items": [
              "What bridges and articulation points are",
              "Why they matter (network reliability)",
              "A teaser of the low-link idea (deep dive later)",
              "Framing"
            ]
          },
          {
            "title": "SCC (intro)",
            "items": [
              "Strongly connected components (concept)",
              "The condensation graph",
              "Deferring Kosaraju/Tarjan to advanced graphs",
              "When SCC is needed"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The graph-algorithm decision card",
              "Re-derive Dijkstra and DSU",
              "Pattern log update",
              "Prep for DP"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 19,
    "title": "Dynamic Programming",
    "subtitle": "From recursion + memo to tabulation to space optimization across every major DP pattern",
    "goal": "The crown jewel: learn to define state, transition and base case for each DP family fast.",
    "icon": "🧠",
    "color": "fuchsia",
    "days": [
      {
        "day": 102,
        "title": "DP foundations",
        "topics": [
          {
            "title": "From recursion to DP",
            "items": [
              "Overlapping subproblems plus optimal substructure",
              "Memoization (top-down) on the recursion tree",
              "Tabulation (bottom-up)",
              "Space optimization (rolling arrays)"
            ]
          },
          {
            "title": "The DP recipe",
            "items": [
              "Define the state, the transition, the base case, the answer",
              "Identifying the state variables",
              "1D DP: climbing stairs, frog jump, frog jump k",
              "Converting memo to a table"
            ]
          },
          {
            "title": "House robber family",
            "items": [
              "Maximum sum of non-adjacent elements",
              "House robber II (circular)",
              "The pick/not-pick DP shape",
              "Space optimization"
            ]
          }
        ]
      },
      {
        "day": 103,
        "title": "2D & grid DP",
        "topics": [
          {
            "title": "Grid paths",
            "items": [
              "Unique paths and unique paths with obstacles",
              "Minimum path sum",
              "The (i, j) state and the move directions",
              "Space optimization to one row"
            ]
          },
          {
            "title": "Triangle & falling path",
            "items": [
              "Triangle minimum path",
              "Minimum / maximum falling path sum",
              "Variable start and end handling",
              "The bottom-up direction"
            ]
          },
          {
            "title": "3D DP",
            "items": [
              "Ninja's training (day, last-activity state)",
              "Cherry pickup (two agents, 3D)",
              "State-explosion awareness",
              "When memo is cleaner than a table"
            ]
          }
        ]
      },
      {
        "day": 104,
        "title": "Subsequence DP — knapsack core",
        "topics": [
          {
            "title": "Subset sum",
            "items": [
              "Subset sum equal to a target (boolean DP)",
              "Partition into two equal-sum subsets",
              "The (index, target) state",
              "Space optimization"
            ]
          },
          {
            "title": "Partitions & counts",
            "items": [
              "Minimum subset-sum difference",
              "Count subsets with sum K",
              "Count partitions with a given difference",
              "Handling zeros"
            ]
          },
          {
            "title": "0/1 knapsack",
            "items": [
              "The canonical (index, capacity) DP",
              "Why 0/1 differs from unbounded",
              "Space-optimized knapsack",
              "Reconstructing the chosen items"
            ]
          }
        ]
      },
      {
        "day": 105,
        "title": "Unbounded knapsack family",
        "topics": [
          {
            "title": "Coin change",
            "items": [
              "Minimum coins (unbounded)",
              "Coin change II (count the ways)",
              "Order-independent counting",
              "Base-case subtleties"
            ]
          },
          {
            "title": "More unbounded",
            "items": [
              "Unbounded knapsack",
              "Rod cutting",
              "Ways-to-make patterns",
              "Reuse-allowed transitions"
            ]
          },
          {
            "title": "Target sum & assignment",
            "items": [
              "Target sum (assign + / -)",
              "Reduce to subset-count",
              "The partition framing",
              "Common sign bugs"
            ]
          }
        ]
      },
      {
        "day": 106,
        "title": "String DP — part 1",
        "topics": [
          {
            "title": "LCS core",
            "items": [
              "Longest common subsequence (2D DP)",
              "Print the LCS (backtrack the table)",
              "Longest common substring (reset on a mismatch)",
              "Space optimization"
            ]
          },
          {
            "title": "Palindromic subsequences",
            "items": [
              "Longest palindromic subsequence (LCS with the reverse)",
              "Minimum insertions to make a palindrome",
              "Minimum insert/delete to convert one string to another",
              "Framing via LCS"
            ]
          },
          {
            "title": "Supersequence & distinct",
            "items": [
              "Shortest common supersequence (print it)",
              "Distinct subsequences (count)",
              "Subsequence-counting transitions",
              "Edge cases"
            ]
          }
        ]
      },
      {
        "day": 107,
        "title": "String DP — part 2",
        "topics": [
          {
            "title": "Edit distance",
            "items": [
              "Insert / delete / replace DP",
              "The three-way transition",
              "Reconstructing the edit script",
              "Space optimization"
            ]
          },
          {
            "title": "Wildcard & regex",
            "items": [
              "Wildcard matching (? and *)",
              "The * two-branch transition",
              "Regex matching (light)",
              "The base-case grid"
            ]
          },
          {
            "title": "Practice & unification",
            "items": [
              "The string-DP template (i, j on two strings)",
              "Choosing LCS-like versus edit-like",
              "Print versus count versus length",
              "Time-boxed solving"
            ]
          }
        ]
      },
      {
        "day": 108,
        "title": "DP on stocks",
        "topics": [
          {
            "title": "Basic transactions",
            "items": [
              "Buy/sell I (one transaction)",
              "Buy/sell II (unlimited)",
              "The state machine (holding versus not)",
              "Greedy versus DP views"
            ]
          },
          {
            "title": "Limited transactions",
            "items": [
              "Buy/sell III (at most 2)",
              "Buy/sell IV (at most k)",
              "The (day, transactions, holding) state",
              "Space optimization"
            ]
          },
          {
            "title": "Constraints",
            "items": [
              "With a cooldown",
              "With a transaction fee",
              "The unified state-machine template",
              "Reconstruction"
            ]
          }
        ]
      },
      {
        "day": 109,
        "title": "DP on subsequences — LIS",
        "topics": [
          {
            "title": "LIS core",
            "items": [
              "Longest increasing subsequence (O(n^2) DP)",
              "Print the LIS (a parent array)",
              "The (index, prev) intuition",
              "Counting the number of LIS"
            ]
          },
          {
            "title": "LIS in O(n log n)",
            "items": [
              "Patience sorting / the lower_bound method",
              "Why the tails array works",
              "Reconstructing with care",
              "When O(n log n) is needed"
            ]
          },
          {
            "title": "LIS variants",
            "items": [
              "Largest divisible subset",
              "Longest string chain",
              "Longest bitonic subsequence",
              "Number of LIS (counts)"
            ]
          }
        ]
      },
      {
        "day": 110,
        "title": "Partition DP (the MCM pattern)",
        "topics": [
          {
            "title": "Matrix chain multiplication",
            "items": [
              "The (i, j) interval with a partition point k",
              "Why we try every split",
              "Memo versus tabulation for intervals",
              "Complexity O(n^3)"
            ]
          },
          {
            "title": "Cutting problems",
            "items": [
              "Minimum cost to cut a stick",
              "Burst balloons (think last, not first)",
              "Coordinate padding",
              "Transition design"
            ]
          },
          {
            "title": "Boolean & palindrome partition",
            "items": [
              "Evaluate a boolean expression to true (count)",
              "Palindrome partitioning II (min cuts, front partition)",
              "Partition an array for the maximum sum",
              "Front versus interval partition"
            ]
          }
        ]
      },
      {
        "day": 111,
        "title": "DP on squares & grids",
        "topics": [
          {
            "title": "Square / rectangle DP",
            "items": [
              "Maximal square of 1s",
              "Count square submatrices with all ones",
              "The min-of-three-neighbors transition",
              "Maximal rectangle (row histograms, revisit)"
            ]
          },
          {
            "title": "Grid counting DP",
            "items": [
              "Count paths with constraints",
              "Dungeon game (backward DP)",
              "Minimum / maximum with obstacles",
              "The direction of filling"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Choosing the state for grid problems",
              "Forward versus backward DP",
              "Space optimization on grids",
              "Time-boxed solving"
            ]
          }
        ]
      },
      {
        "day": 112,
        "title": "DP on trees (intro)",
        "topics": [
          {
            "title": "Tree DP basics",
            "items": [
              "Return info from children, combine at the node",
              "House robber III (rob or skip a node)",
              "Diameter as tree DP (revisit)",
              "A rerooting preview"
            ]
          },
          {
            "title": "More tree DP",
            "items": [
              "Maximum path sum (tree-DP framing)",
              "Maximum independent set on a tree",
              "Counting subtrees with a property",
              "Post-order combination"
            ]
          },
          {
            "title": "Handoff",
            "items": [
              "Why tree DP is DP with a tree order",
              "Deferring rerooting / advanced to advanced DP",
              "The reusable child-combine template",
              "Recognizing the shape"
            ]
          }
        ]
      },
      {
        "day": 113,
        "title": "DP mastery & recap",
        "topics": [
          {
            "title": "DP pattern taxonomy",
            "items": [
              "1D / 2D / subsequence / string / interval / tree / stocks / LIS",
              "Identifying the pattern from the statement",
              "A state-design checklist",
              "Memo versus tab versus space-opt decision"
            ]
          },
          {
            "title": "Mixed hard set",
            "items": [
              "One problem from each family under time pressure",
              "Deriving state, transition, base case fast",
              "Debugging a wrong DP (base cases, order)",
              "Reconstruction practice"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The universal DP template card",
              "Re-derive knapsack and LCS from scratch",
              "Pattern log update",
              "Prep for advanced strings"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 20,
    "title": "Advanced Strings",
    "subtitle": "Linear-time string matching and structure: KMP, Z, hashing, Manacher",
    "goal": "Cross from O(nm) brute matching into O(n) algorithms and the problems built on them.",
    "icon": "🧵",
    "color": "rose",
    "days": [
      {
        "day": 114,
        "title": "String hashing",
        "topics": [
          {
            "title": "Polynomial hashing",
            "items": [
              "Treat a string as a base-B number modulo M",
              "Prefix hashes for O(1) substring hashes",
              "Choosing the base and modulus (double hashing)",
              "Collision probability"
            ]
          },
          {
            "title": "Applications",
            "items": [
              "Substring search (Rabin-Karp)",
              "Compare two substrings in O(1)",
              "Count distinct substrings via hashing",
              "Longest common substring with hashing plus binary search"
            ]
          },
          {
            "title": "Pitfalls",
            "items": [
              "Anti-hash tests and randomization",
              "Overflow and modular multiplication",
              "Single versus double hashing",
              "When hashing beats KMP/Z"
            ]
          }
        ]
      },
      {
        "day": 115,
        "title": "KMP",
        "topics": [
          {
            "title": "The failure function",
            "items": [
              "Longest proper prefix that is also a suffix (the LPS / pi array)",
              "Building pi in O(n)",
              "The reuse-of-previous-border idea",
              "Why it avoids re-scanning"
            ]
          },
          {
            "title": "KMP matching",
            "items": [
              "Pattern search in O(n+m)",
              "Count and locate all occurrences",
              "Shortest palindrome (the prefix trick)",
              "Longest happy prefix"
            ]
          },
          {
            "title": "KMP problems",
            "items": [
              "Repeated string pattern",
              "Period of a string",
              "Minimum chars to add for a palindrome",
              "Border structure"
            ]
          }
        ]
      },
      {
        "day": 116,
        "title": "Z-function & Manacher",
        "topics": [
          {
            "title": "Z-function",
            "items": [
              "Z[i]: longest substring from i matching the prefix",
              "Building Z in O(n) (the Z-box)",
              "Pattern matching with Z",
              "Z versus KMP choice"
            ]
          },
          {
            "title": "Manacher's algorithm",
            "items": [
              "Longest palindromic substring in O(n)",
              "Transform to handle even/odd uniformly",
              "The mirror plus rightmost-palindrome trick",
              "Counting palindromic substrings"
            ]
          },
          {
            "title": "Comparisons",
            "items": [
              "Hashing versus KMP versus Z versus Manacher",
              "Which to reach for per problem",
              "Implementation footguns",
              "A complexity table"
            ]
          }
        ]
      },
      {
        "day": 117,
        "title": "Advanced string structures (intro) & recap",
        "topics": [
          {
            "title": "Suffix structures (concept)",
            "items": [
              "The suffix array idea and what it enables",
              "Suffix automaton / suffix tree (conceptual)",
              "LCP array usage",
              "When you actually need these"
            ]
          },
          {
            "title": "Aho-Corasick (concept)",
            "items": [
              "Multi-pattern matching (a trie plus failure links)",
              "Where it beats running KMP many times",
              "Building the automaton (overview)",
              "Applications"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The advanced-string decision card",
              "Re-derive the KMP pi array from scratch",
              "Pattern log update",
              "Prep for number theory"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 21,
    "title": "Number Theory & Combinatorics",
    "subtitle": "The math toolkit for CP: sieve, modular arithmetic, inverses, combinatorics, matrix exponentiation",
    "goal": "Acquire the arithmetic that gates a huge fraction of Codeforces problems above 1400.",
    "icon": "🔢",
    "color": "indigo",
    "days": [
      {
        "day": 118,
        "title": "Primes & factorization",
        "topics": [
          {
            "title": "Sieve of Eratosthenes",
            "items": [
              "Mark multiples to list primes up to N",
              "The O(N log log N) analysis",
              "Smallest-prime-factor sieve",
              "Segmented sieve (concept)"
            ]
          },
          {
            "title": "Factorization",
            "items": [
              "Trial division in O(sqrt n)",
              "Fast factorization via the SPF sieve",
              "Number and sum of divisors from the factorization",
              "Euler's totient (phi) and its sieve"
            ]
          },
          {
            "title": "GCD theory",
            "items": [
              "The extended Euclidean algorithm",
              "Bezout coefficients",
              "Linear Diophantine equations",
              "GCD / LCM identities"
            ]
          }
        ]
      },
      {
        "day": 119,
        "title": "Modular arithmetic",
        "topics": [
          {
            "title": "Modular basics",
            "items": [
              "Add / sub / mul under a modulus, and the negative fix",
              "Why we mod (avoid overflow, big answers)",
              "Modular exponentiation (revisit)",
              "Overflow-safe multiplication"
            ]
          },
          {
            "title": "Modular inverse",
            "items": [
              "Fermat's little theorem inverse (prime modulus)",
              "Extended-Euclid inverse (general)",
              "When each applies",
              "Division under a modulus"
            ]
          },
          {
            "title": "CRT & applications",
            "items": [
              "The Chinese remainder theorem (concept plus two congruences)",
              "Combining moduli",
              "Applications in counting",
              "Pitfalls"
            ]
          }
        ]
      },
      {
        "day": 120,
        "title": "Combinatorics",
        "topics": [
          {
            "title": "Counting basics",
            "items": [
              "Permutations and combinations",
              "nCr, nPr, and Pascal's rule",
              "Stars and bars",
              "Inclusion-exclusion (intro)"
            ]
          },
          {
            "title": "nCr under a modulus",
            "items": [
              "Precompute factorials plus inverse factorials",
              "O(1) nCr queries mod p",
              "Lucas theorem (concept)",
              "Catalan numbers"
            ]
          },
          {
            "title": "Counting problems",
            "items": [
              "Path counting on grids",
              "Derangements",
              "Binomial identities in problems",
              "Recognizing combinatorial structure"
            ]
          }
        ]
      },
      {
        "day": 121,
        "title": "Matrix exponentiation & sequences",
        "topics": [
          {
            "title": "Matrix exponentiation",
            "items": [
              "Linear recurrences as matrix powers",
              "Fibonacci in O(log n)",
              "Building the transition matrix",
              "Fast power on matrices"
            ]
          },
          {
            "title": "Applications",
            "items": [
              "Counting paths of length k (adjacency-matrix power)",
              "Recurrence acceleration",
              "Modular matrix multiplication",
              "When n is up to 1e18"
            ]
          },
          {
            "title": "Probability & expectation (intro)",
            "items": [
              "Basic expected value in problems",
              "Linearity of expectation",
              "Simple probability DP",
              "Framing"
            ]
          }
        ]
      },
      {
        "day": 122,
        "title": "Number theory problem set & recap",
        "topics": [
          {
            "title": "Mixed",
            "items": [
              "Sieve plus factorization problems",
              "Modular-combinatorics problems",
              "GCD and segmented problems",
              "Time-boxed solving"
            ]
          },
          {
            "title": "Game theory (intro)",
            "items": [
              "Nim and Grundy numbers (concept)",
              "Winning and losing states",
              "XOR of pile sizes",
              "Deferring deep game theory to CP craft"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The number-theory decision card",
              "Re-derive modular nCr",
              "Pattern log update",
              "Prep for advanced data structures"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 22,
    "title": "Advanced Data Structures",
    "subtitle": "Range-query power tools: Fenwick, segment trees (+ lazy), sparse tables, Mo's",
    "goal": "Add the structures that answer range queries and updates in log time, plus when to use each.",
    "icon": "🏗️",
    "color": "amber",
    "days": [
      {
        "day": 123,
        "title": "Sparse table & prefix structures",
        "topics": [
          {
            "title": "Sparse table",
            "items": [
              "Idempotent range queries (min / max / gcd) in O(1)",
              "Precompute in O(n log n)",
              "Why it fails for sum with updates",
              "The binary-lifting table layout"
            ]
          },
          {
            "title": "Prefix / difference recap",
            "items": [
              "Prefix sums versus Fenwick versus segment tree",
              "Difference arrays for range updates",
              "2D prefix sums",
              "Choosing the lightest tool"
            ]
          },
          {
            "title": "Coordinate compression",
            "items": [
              "Mapping large values to ranks",
              "When the queries are offline",
              "Combining with a BIT or segtree",
              "Implementation"
            ]
          }
        ]
      },
      {
        "day": 124,
        "title": "Fenwick tree (BIT)",
        "topics": [
          {
            "title": "The BIT idea",
            "items": [
              "Point update, prefix-sum query in O(log n)",
              "The lowbit (n & -n) decomposition",
              "Why the tree structure works",
              "1-indexing"
            ]
          },
          {
            "title": "BIT operations",
            "items": [
              "update and query",
              "Range-sum via two prefix queries",
              "Range update plus point query (a difference BIT)",
              "Range update plus range query (two BITs)"
            ]
          },
          {
            "title": "BIT problems",
            "items": [
              "Count inversions with a BIT (revisit)",
              "Count smaller elements to the right",
              "Order statistics with a BIT",
              "2D BIT (concept)"
            ]
          }
        ]
      },
      {
        "day": 125,
        "title": "Segment tree — basics",
        "topics": [
          {
            "title": "Structure",
            "items": [
              "A recursive segment tree over an array",
              "Build in O(n), query and update in O(log n)",
              "Range sum / min / max",
              "Array-based node indexing"
            ]
          },
          {
            "title": "Point update, range query",
            "items": [
              "Implementing build, query, update",
              "The merge-function design",
              "Handling any associative operation",
              "Debugging with a small tree"
            ]
          },
          {
            "title": "Segment tree problems",
            "items": [
              "Range min / max / sum queries",
              "Range GCD",
              "Finding the first element >= x (descend)",
              "Assignment nuances"
            ]
          }
        ]
      },
      {
        "day": 126,
        "title": "Segment tree — lazy propagation",
        "topics": [
          {
            "title": "Range updates",
            "items": [
              "Why a naive range update is O(n log n) per op",
              "Lazy tags: defer updates to children",
              "push-down and push-up",
              "Range add plus range sum"
            ]
          },
          {
            "title": "Lazy variants",
            "items": [
              "Range assign plus range max",
              "Multiple lazy tags (order of application)",
              "Correct tag composition",
              "Common lazy bugs"
            ]
          },
          {
            "title": "Advanced segment trees (intro)",
            "items": [
              "Segment tree on indices versus on values",
              "Merge-sort tree / persistent (concept)",
              "Iterative segment tree (concept)",
              "When to reach for each"
            ]
          }
        ]
      },
      {
        "day": 127,
        "title": "Segment tree applications & Mo's",
        "topics": [
          {
            "title": "Counting queries",
            "items": [
              "Kth-order queries with a segment tree on values",
              "Count of elements in a range",
              "Range distinct / frequency (offline)",
              "Descend-on-tree queries"
            ]
          },
          {
            "title": "Problem set",
            "items": [
              "Range assignment plus query problems",
              "Interval scheduling with a segtree",
              "2D queries (concept)",
              "Choosing BIT versus segtree"
            ]
          },
          {
            "title": "Mo's algorithm (intro)",
            "items": [
              "Offline range queries by sqrt decomposition",
              "add / remove pointer movement",
              "When Mo's beats a segment tree",
              "Complexity O((n+q) sqrt n)"
            ]
          }
        ]
      },
      {
        "day": 128,
        "title": "Advanced DS recap",
        "topics": [
          {
            "title": "Decision-making",
            "items": [
              "Prefix versus BIT versus segtree versus sparse table versus Mo's",
              "Update pattern versus query pattern matrix",
              "Memory / time budgeting",
              "Implementation speed"
            ]
          },
          {
            "title": "Mixed set",
            "items": [
              "Range problems under time pressure",
              "Choosing the structure fast",
              "Coordinate-compression combos",
              "Time-boxed solving"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The advanced-DS decision card",
              "Re-derive a segment tree from scratch",
              "Pattern log update",
              "Prep for advanced graphs"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 23,
    "title": "Advanced Graphs",
    "subtitle": "The graph theory that separates strong CP: SCC, bridges, LCA, flows, matching",
    "goal": "Build the high-end graph algorithms on top of the DFS tree and low-link machinery.",
    "icon": "🌐",
    "color": "violet",
    "days": [
      {
        "day": 129,
        "title": "DFS tree, bridges & articulation points",
        "topics": [
          {
            "title": "The DFS tree structure",
            "items": [
              "Tree edges versus back edges",
              "Discovery time and low-link values",
              "Why low-link detects cut structure",
              "Building the DFS tree"
            ]
          },
          {
            "title": "Bridges",
            "items": [
              "Finding all bridges (Tarjan)",
              "The low[v] > disc[u] condition",
              "Edge cases (parallel edges)",
              "Applications (critical connections)"
            ]
          },
          {
            "title": "Articulation points",
            "items": [
              "Cut vertices via low-link",
              "The root special case",
              "Biconnected components (concept)",
              "Applications"
            ]
          }
        ]
      },
      {
        "day": 130,
        "title": "Strongly connected components",
        "topics": [
          {
            "title": "SCC concept",
            "items": [
              "Definition and the condensation DAG",
              "Why SCCs form a DAG",
              "Uses (2-SAT, dependency cycles)",
              "Kosaraju versus Tarjan"
            ]
          },
          {
            "title": "Kosaraju's algorithm",
            "items": [
              "Two passes plus the transpose graph",
              "The finish-order stack",
              "Extracting components",
              "A correctness sketch"
            ]
          },
          {
            "title": "Tarjan's SCC & 2-SAT (intro)",
            "items": [
              "Single-pass SCC with low-link",
              "2-SAT via an implication graph plus SCC",
              "Assigning truth values",
              "Applications"
            ]
          }
        ]
      },
      {
        "day": 131,
        "title": "LCA & binary lifting",
        "topics": [
          {
            "title": "LCA foundations",
            "items": [
              "LCA on trees (revisit) with preprocessing",
              "Euler tour plus sparse table (RMQ) approach",
              "The binary-lifting table (2^k ancestors)",
              "O(log n) queries"
            ]
          },
          {
            "title": "Binary-lifting uses",
            "items": [
              "Kth ancestor",
              "Distance between nodes",
              "LCA-based path queries",
              "Preprocessing cost"
            ]
          },
          {
            "title": "Tree path techniques",
            "items": [
              "Path sum / max via LCA",
              "Small-to-large merging (concept)",
              "Euler tour for subtree queries",
              "Handoff to HLD"
            ]
          }
        ]
      },
      {
        "day": 132,
        "title": "Heavy-light decomposition (intro) & tree queries",
        "topics": [
          {
            "title": "HLD concept",
            "items": [
              "Decompose a tree into heavy chains",
              "Path queries via a segment tree on chains",
              "O(log^2 n) path queries",
              "When HLD is needed"
            ]
          },
          {
            "title": "Euler tour plus segtree",
            "items": [
              "Subtree updates and queries via tour indices",
              "Flatten a tree to an array",
              "Combining with a lazy segtree",
              "Subtree versus path queries"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Choosing HLD versus Euler tour versus binary lifting",
              "An implementation overview",
              "Complexity",
              "Recognizing tree-query problems"
            ]
          }
        ]
      },
      {
        "day": 133,
        "title": "Network flow",
        "topics": [
          {
            "title": "Max flow basics",
            "items": [
              "Flow networks, capacities, source and sink",
              "Ford-Fulkerson / Edmonds-Karp",
              "The residual graph and augmenting paths",
              "The max-flow min-cut theorem"
            ]
          },
          {
            "title": "Dinic's algorithm (intro)",
            "items": [
              "Level graph plus blocking flow",
              "Why Dinic's is faster",
              "Complexity bounds",
              "When to use it"
            ]
          },
          {
            "title": "Min-cut applications",
            "items": [
              "Modeling a problem as flow",
              "Project selection / image segmentation (concept)",
              "Vertex- and edge-disjoint paths",
              "Reduction patterns"
            ]
          }
        ]
      },
      {
        "day": 134,
        "title": "Bipartite matching & recap",
        "topics": [
          {
            "title": "Bipartite matching",
            "items": [
              "Maximum bipartite matching (Kuhn's)",
              "Konig's theorem (min vertex cover)",
              "Hall's theorem (concept)",
              "Flow-based matching"
            ]
          },
          {
            "title": "Assignment & applications",
            "items": [
              "The job-assignment framing",
              "Minimum path cover on a DAG",
              "The Hungarian algorithm (concept)",
              "Modeling"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The advanced-graph decision card",
              "Re-derive SCC (Kosaraju)",
              "Pattern log update",
              "Prep for advanced DP"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 24,
    "title": "Advanced Dynamic Programming",
    "subtitle": "The DP that wins contests: bitmask, digit, tree rerooting, SOS, and optimizations",
    "goal": "Layer the advanced DP families on top of the core, and recognize each from its constraints.",
    "icon": "🧠",
    "color": "fuchsia",
    "days": [
      {
        "day": 135,
        "title": "Bitmask DP",
        "topics": [
          {
            "title": "DP over subsets",
            "items": [
              "State = a bitmask of used elements",
              "Traveling salesman (Held-Karp) O(2^n n^2)",
              "Assignment problems",
              "Iterating masks"
            ]
          },
          {
            "title": "Bitmask patterns",
            "items": [
              "Minimum cost to cover / partition into groups",
              "Counting perfect matchings on small graphs",
              "Profile / broken-profile DP (intro)",
              "When n <= 20"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Recognizing bitmask DP from the constraints",
              "Transition design over submasks",
              "Complexity budgeting",
              "Common bugs"
            ]
          }
        ]
      },
      {
        "day": 136,
        "title": "SOS DP & subset-sum-over-subsets",
        "topics": [
          {
            "title": "Sum over subsets",
            "items": [
              "For each mask, aggregate over all submasks in O(2^n n)",
              "The dimension-by-dimension update",
              "Why it beats O(3^n)",
              "The superset variant"
            ]
          },
          {
            "title": "Applications",
            "items": [
              "Counting pairs with bitwise conditions",
              "Inclusion-exclusion via SOS",
              "AND / OR / XOR convolutions (concept)",
              "Problem framing"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Recognizing SOS structure",
              "Implementation care",
              "Complexity",
              "Debugging"
            ]
          }
        ]
      },
      {
        "day": 137,
        "title": "Digit DP",
        "topics": [
          {
            "title": "Counting numbers with a property",
            "items": [
              "State = (position, tight, started, extra)",
              "Counting up to N with a digit constraint",
              "The tight-bound technique",
              "Leading zeros"
            ]
          },
          {
            "title": "Digit DP problems",
            "items": [
              "Count numbers with a digit-sum property",
              "Count numbers without a forbidden digit",
              "Bounded adjacent-digit rules",
              "Range [L, R] via f(R) - f(L-1)"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Designing the state",
              "The memo dimensions",
              "Common off-by-one",
              "Time-boxed solving"
            ]
          }
        ]
      },
      {
        "day": 138,
        "title": "DP on trees — rerooting",
        "topics": [
          {
            "title": "The rerooting technique",
            "items": [
              "Compute an answer for every root efficiently",
              "Down pass (subtree) plus up pass (rest of the tree)",
              "Combining child contributions",
              "O(n) for all roots"
            ]
          },
          {
            "title": "Tree DP problems",
            "items": [
              "Sum of distances in a tree",
              "Maximum path / independent set (advanced revisit)",
              "Counting with tree DP",
              "Rerooting variants"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Recognizing rerooting",
              "Combine / exclude a child cleanly",
              "Complexity",
              "Debugging"
            ]
          }
        ]
      },
      {
        "day": 139,
        "title": "DP optimizations",
        "topics": [
          {
            "title": "Classic optimizations",
            "items": [
              "Prefix-sum / sliding-window DP speedups",
              "Convex hull trick: separate session deriving line queries, validity conditions, a trace and implementation",
              "Divide-and-conquer DP: separate session proving the required monotonicity and testing a violating counterexample",
              "Knuth optimization: separate session deriving its assumptions, recurrence bounds and a case where it cannot be used"
            ]
          },
          {
            "title": "Monotonic-queue DP",
            "items": [
              "Windowed transitions in O(n)",
              "Bounded knapsack with a monotonic queue",
              "Recognizing the optimization",
              "Trade-offs"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "When O(n^2) DP must become O(n log n)",
              "Matching the optimization to the transition shape",
              "Complexity",
              "Time-boxed solving"
            ]
          }
        ]
      },
      {
        "day": 140,
        "title": "Advanced DP recap",
        "topics": [
          {
            "title": "Taxonomy",
            "items": [
              "Bitmask / SOS / digit / tree / optimization",
              "Recognizing from the constraints",
              "State design under pressure",
              "The decision card"
            ]
          },
          {
            "title": "Mixed hard set",
            "items": [
              "One problem per advanced family",
              "Fast state derivation",
              "Debugging",
              "Reconstruction"
            ]
          },
          {
            "title": "Reflection",
            "items": [
              "The advanced-DP card",
              "Re-derive bitmask TSP",
              "Pattern log update",
              "Prep for CP craft"
            ]
          }
        ]
      }
    ]
  },
  {
    "number": 25,
    "title": "Competitive Programming Craft & Contest Mastery",
    "subtitle": "Turn technique into rating: constructive, game theory, interactive, and a real contest routine",
    "goal": "Build a sustainable contest and upsolving routine; distinguish CodeChef stars from Codeforces titles and measure progress without promising a rating.",
    "icon": "🏆",
    "color": "yellow",
    "days": [
      {
        "day": 141,
        "title": "Game theory",
        "topics": [
          {
            "title": "Impartial games",
            "items": [
              "Winning and losing (P/N) positions",
              "Nim and the XOR theorem",
              "Sprague-Grundy and mex",
              "Combining games (XOR of Grundy values)"
            ]
          },
          {
            "title": "Game DP",
            "items": [
              "Grundy numbers by DP",
              "Subtraction and coin games",
              "Grundy for graph games",
              "Recognizing game structure"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Deriving P/N positions",
              "Proving with small cases",
              "Common patterns",
              "Time-boxed solving"
            ]
          }
        ]
      },
      {
        "day": 142,
        "title": "Constructive algorithms",
        "topics": [
          {
            "title": "The construction mindset",
            "items": [
              "Build any valid answer, not the optimum",
              "Small-case exploration to spot a pattern",
              "Invariants and parity arguments",
              "Proving a construction works"
            ]
          },
          {
            "title": "Common tricks",
            "items": [
              "Parity and coloring constructions",
              "Greedy constructions with a proof",
              "Symmetry and pairing",
              "When no answer exists"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "The guess-and-verify workflow",
              "Stress-testing a construction",
              "Pattern spotting",
              "Contest examples"
            ]
          }
        ]
      },
      {
        "day": 143,
        "title": "Interactive & randomized problems",
        "topics": [
          {
            "title": "Interactive problems",
            "items": [
              "The query / response protocol and flushing output",
              "Binary search via queries",
              "Adaptive versus non-adaptive judges",
              "Query-count limits"
            ]
          },
          {
            "title": "Randomized techniques",
            "items": [
              "Randomization to dodge anti-tests",
              "Random pivots and shuffles",
              "Hashing with random seeds (revisit)",
              "Probability of failure"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Writing an interactive solution",
              "Local judge simulation",
              "Debugging interaction",
              "Contest examples"
            ]
          }
        ]
      },
      {
        "day": 144,
        "title": "Ad-hoc, math & observation problems",
        "topics": [
          {
            "title": "Observation-first problems",
            "items": [
              "The Div2 A/B mindset: find the trick, code fast",
              "Reformulating the statement",
              "Small-to-general reasoning",
              "Editorial-free solving"
            ]
          },
          {
            "title": "Speed & accuracy",
            "items": [
              "Fast, correct implementation habits",
              "A templates and snippets library",
              "Reading constraints for the intended complexity",
              "Avoiding silly wrong answers"
            ]
          },
          {
            "title": "Practice",
            "items": [
              "Timed A-B-C solving",
              "Stress testing",
              "Reflection on misses",
              "The upsolving routine"
            ]
          }
        ]
      },
      {
        "day": 145,
        "title": "Contest strategy & a sustainable rating practice",
        "topics": [
          {
            "title": "In-contest strategy",
            "items": [
              "Problem order and time allocation",
              "When to skip versus persist",
              "Penalty management (Codeforces / CodeChef)",
              "Reading multiple problems first"
            ]
          },
          {
            "title": "The rating loop",
            "items": [
              "Virtual contests plus upsolving every unsolved problem",
              "Tracking weak tags and drilling them",
              "Rating-targeted problem selection by tag and rating",
              "Consistency over cramming"
            ]
          },
          {
            "title": "Debugging under pressure",
            "items": [
              "Reproducing a failing test",
              "Stress-testing against a brute force",
              "Common wrong-answer / TLE / runtime-error causes",
              "Keeping calm"
            ]
          }
        ]
      },
      {
        "day": 146,
        "title": "Capstone — a self-run contest simulation",
        "topics": [
          {
            "title": "Simulate a full contest",
            "items": [
              "Pick a past Div2 / CodeChef round and time-box it",
              "Solve, submit, then study the editorials",
              "Score yourself and log weak areas",
              "Set the next drilling plan"
            ]
          },
          {
            "title": "Build your permanent toolkit",
            "items": [
              "A tested template and snippet library (I/O, DSU, segtree, sieve, ...)",
              "A personal pattern catalog (every technique in this course)",
              "A stress-test harness you trust",
              "A study cadence you can sustain"
            ]
          },
          {
            "title": "The path forward",
            "items": [
              "A concrete weekly routine with mixed review, contests, upsolving and recovery; rating growth is an outcome to measure, not a guarantee",
              "Which tags to prioritize by your current rating",
              "How to keep re-deriving the fundamentals",
              "Graduation: you now learn new topics by attempting first"
            ]
          }
        ],
        "project": {
          "title": "Contest Simulation & Permanent CP Toolkit",
          "description": "Run a full timed virtual contest (a past Codeforces Div2 or CodeChef round), solve under contest rules, then upsolve every unsolved problem against editorials. Assemble a tested, reusable C++ template + snippet library covering every structure and algorithm in this course, plus a stress-testing harness and a personal pattern catalog.",
          "type": "capstone",
          "features": [
            "A completed, self-scored virtual contest with a written post-mortem",
            "Every unsolved problem upsolved with a clean, commented solution",
            "A tested snippet library: fast I/O, DSU, Fenwick, segtree (+lazy), sieve, modpow/nCr, graph algos",
            "A brute-force stress-testing harness that has caught at least one real bug",
            "A weak-tag drilling plan targeted at the next rating band"
          ],
          "hints": [
            "Pick a round rated near your current level, not far above it",
            "Time-box strictly; the value is in the contest conditions, not just the problems",
            "Every snippet must be tested against a known problem before it enters the library",
            "Upsolving is where the rating comes from -- never skip it"
          ]
        }
      }
    ]
  }
];

export const dsaPhases: Phase[] = specs.map(phase);
