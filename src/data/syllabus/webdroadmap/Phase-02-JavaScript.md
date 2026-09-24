# Phase 2: JavaScript Essentials (Days 13–28)

**⏱ Duration:** 16 days · ~68 hours
**🎯 Goal:** Read, write, and reason about modern JavaScript — including classes & OOP. End the phase with two interactive apps shipped to the web.

> Today we install Node.js — that's the only install ceremony in this phase.

---

## Day 13 — JS in the browser, Node.js, the mental model
- Install Node.js via `nvm` (long-term, no `sudo`)
- `node`, `npm`, the REPL
- Three places JS runs: `<script>`, browser console, Node
- `let` / `const` / (avoid `var`); primitive vs reference types
- Strings, numbers, booleans, `null`, `undefined`
- Template literals, string methods, number gotchas (`0.1 + 0.2`)

## Day 14 — Functions & scope
- Function declarations vs expressions vs arrow functions
- Parameters, defaults, rest/spread
- Block scope, closures (the one mental model behind 80% of bugs)
- Pure vs impure functions — why "pure" matters later in React
- Higher-order functions intro

## Day 15 — Control flow
- `if` / `else` / ternary / `switch` (and when to avoid switch)
- `for`, `for...of`, `while`, `for...in` (and why `for...in` is rarely what you want)
- Truthy / falsy table — memorize the falsy 6
- `==` vs `===` — always `===`

## Day 16 — Arrays & their key methods
- Creating, indexing, mutating vs non-mutating methods
- The big four: `map`, `filter`, `reduce`, `find`
- `some` / `every` / `flatMap` / `sort` (with the comparator trap)
- Iterating with `forEach` vs `for...of` — when each fits
- **Mini build:** Transform a JSON array of products into HTML cards

## Day 17 — Objects, destructuring, spread
- Object literals, dot vs bracket access
- Shorthand property syntax, computed keys
- Destructuring (objects + arrays + defaults + renames)
- Spread / rest with objects
- `Object.keys`, `values`, `entries`, `Object.assign`, structured clone
- JSON: parse / stringify / pitfalls

## Day 18 — Classes & OOP in JS
- Why classes exist (and why JS resisted them) — sugar over prototypes
- `class` syntax: constructor, methods, instance fields, getters/setters
- `this` — set by HOW the function is called; classic loss-of-binding bugs
- Fixes: arrow-function class fields vs `.bind(this)` in constructor
- `extends` + `super` — single-parent inheritance, override pattern
- Composition usually beats inheritance — when to reach for plain objects + functions
- `static` members and `#privateFields` (true privacy since 2022)
- Where classes earn their keep in 2026: custom errors, domain models, service clients, stateful utilities
- Where they don't: React components, small data bags, single-call helpers
- 5-minute peek at prototypes — enough to read DevTools, not enough to write spaghetti
- **Mini build:** A `Cart` class with private `#items`, `add` / `remove` / `total` methods, a static `empty()` factory, and a custom `CartError extends Error`

## Day 19 — DOM manipulation (the right way)
- `document.querySelector` / `querySelectorAll`
- Reading & changing text, attributes, classes
- Creating + inserting elements
- `data-*` attributes — the right way to pass state to JS
- Event delegation — one listener, many children
- **Mini build:** Add a "delete" button to each card from Day 16

## Day 20 — Events
- The event object, `preventDefault`, `stopPropagation`
- Event bubbling vs capturing
- Form events (`submit`, `input`, `change`)
- Keyboard events; debounce + throttle (write them yourself once)
- Custom events with `CustomEvent`
- **Mini build:** Live search filter over the cards

## Day 21 — Async JavaScript — the event loop
- Synchronous vs async — what "blocking" means
- The event loop: call stack, task queue, microtask queue (visualized)
- `setTimeout`, `setInterval`, `queueMicrotask`
- Callbacks → callback hell → why Promises exist

## Day 22 — Promises & `fetch`
- Promise states, `.then` / `.catch` / `.finally`
- `Promise.all` / `Promise.allSettled` / `Promise.race`
- `fetch` API: GET, POST, headers, JSON
- Reading errors from network responses (status vs thrown)
- **Mini build:** Hit a public API (e.g., dog.ceo) and render results

## Day 23 — `async` / `await` & error handling
- Rewriting yesterday's code with `async/await`
- `try/catch/finally`; the "result, error" pattern
- Cancelling fetches with `AbortController`
- Loading + error + empty UI states (the three you always forget)

## Day 24 — Storage, dates, numbers, the rest
- `localStorage`, `sessionStorage`, `JSON.stringify` round-tripping
- The `Date` object pain & why we use `date-fns` / `Temporal`
- Intl APIs: `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`
- A first taste of regex (just enough to be dangerous)

## Day 25 — Modern JS modules & tooling
- ES modules: `import` / `export` / `export default`
- Why bundlers exist; Vite from zero
- `package.json` essentials, `npm scripts`
- Linting & formatting: ESLint + Prettier setup
- `.gitignore`, `node_modules` discipline

## Day 26 — Practice: Build 10 Tiny Products
**A build marathon, one product per slide — each with a detailed spec, a live demo to match, hidden hints, and a full HTML/CSS/JS solution that unlocks only after a real attempt:**
1. Living clock — `Date`, `setInterval`, `padStart`, `Intl` date line, 12/24h toggle
2. Stopwatch — `Date.now()` deltas (no tick counting), pause/resume, laps with fastest/slowest
3. Pomodoro — focus/break state machine, progress bar, session count in `localStorage`
4. Quiz game — questions as data, render-from-state, one delegated listener, play again
5. Password generator — charset guarantees, shuffle, strength meter, clipboard copy
6. Signup form — live validation with "touched" UX, strength bar, `FormData` + toast
7. Expense tracker — state array, delegated delete, `Intl` INR total, safe `localStorage`
8. Sticky notes board — debounced autosave, delegated input editing, "Saved ✓" indicator
9. GitHub lookup — `fetch`, 404 vs network error, retry, disabled-while-loading
10. Team directory — fetch-on-load, skeleton shimmer, debounced in-memory search, empty state

## Day 27 — Project: Community Pantry Dispatch Board
**Spec + live demo of the target (reference solution locked behind a typed confirmation):**
- Add / edit / delete / mark complete
- Filter by status (all / active / done)
- Persist to localStorage
- Keyboard shortcuts (`Enter` to add, `Esc` to cancel edit)
- Smooth animations on add/remove
- Mobile-first, dark mode

## Day 28 — Project: Public Art Walk Planner + ship both
**Spec + live demo of the target (reference solution locked behind a typed confirmation):**
- Search Open Library by title, author, or subject
- Render accessible artwork and location cards with image fallbacks and safe text insertion
- Paginate results and preserve the current query in the URL
- Loading / error / empty states explicit
- Save an ordered walking shortlist in localStorage
- Deploy both apps to Vercel; add evidence screenshots and decision notes to their READMEs

---

## ✅ Phase 2 Capstone
The Pantry Dispatch Board and Public Art Walk Planner are deployed with keyboard flows, persisted state, race-safe requests, explicit failure states, and a short transfer reflection.

> _Next: TypeScript, the web itself, and git like a senior._
