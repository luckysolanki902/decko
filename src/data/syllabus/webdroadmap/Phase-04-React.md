# Phase 4 — React (Modern)

**Days 33–51 · 19 days · about 68 hours**

**Outcome:** build complete React products with state, routing, validated input, remote data, performance work, tests, and deployment.

## Three projects after Day 37

Days 38–51 contain three distinct products. Each has a live deployment, README, screenshots, accessible states, and a short architecture note.

```text
Days 38–40 → Aquarium Care Console
Days 41–44 → StepFree Transit Explorer
Days 45–51 → Shelter Readiness Dashboard
```

---

## Day 33 — React from the Browser Up

- Declarative UI compared with manual DOM steps.
- Render, compare, commit, and browser layout/paint.
- React elements, components, DOM nodes, re-render, and remount.
- Vite + React + TypeScript using npm.
- JSX rules, basic props, children, typed static lists, and stable keys.

## Day 34 — Props, Conditional UI, and List Identity

- Precise required and optional prop contracts.
- Read-only inputs, derived values, children, and named content slots.
- Native prop forwarding through deliberate wrapper boundaries.
- Early returns, ternaries, show-or-nothing, and the zero trap.
- Immutable list transformations and stable sibling identity.

## Day 35 — useState & Event Handling

- Why a normal `let` variable neither survives rendering nor requests a UI update.
- Per-component state, setter scheduling, snapshots, and batching.
- Event handlers and typed event objects.
- Functional updates and immutable object/array replacement.
- Controlled inputs, lifted ownership, values down, callbacks up.

## Day 36 — React Practice Set 1: Components, Props, and State *(1.5 hours)*

Exactly three problem screens, each capped at 30 minutes:

1. Two-Player Score Keeper.
2. Tip and Bill Splitter.
3. Packing List.

## Day 37 — useEffect, useRef & Error Boundaries

- Effects as synchronization with external systems.
- Dependency honesty, cleanup symmetry, and stale closures.
- State versus refs; DOM focus and non-visual infrastructure.
- When not to use an Effect.
- Render-error containment and recovery boundaries.

## Day 38 — Custom Hooks

- Custom Hooks reuse stateful behavior, not shared state instances.
- Rules of Hooks, contracts, inputs, and return shapes.
- Lazy and validated local-storage state.
- Cleanup-safe debounce and composed Hooks.
- Hook versus component versus pure utility.

## Day 39 — Context & Reducer

- Context as scoped dependency access.
- Validating consumer Hooks and Provider boundaries.
- Pure reducers with discriminated events and immutable transitions.
- Reducer + Context for scoped shared workflows.
- State decision tree: local, Context, Query, or Redux.

## Day 40 — Project 1: Aquarium Care Console *(4 hours)*

Build a complete local-first productivity dashboard with task rules, a cleanup-safe focus timer, persistent preferences, and Context introduced only after real prop drilling.

## Day 41 — React Router: URL-Driven Apps

- Current Data Router setup with `createBrowserRouter` and `RouterProvider`.
- Nested layouts, `Outlet`, not-found, and error surfaces.
- `Link`, `NavLink`, and programmatic navigation.
- Validated path and search parameters as shareable state.
- Loaders, actions, and deliberate protection/redirect flow.

## Day 42 — Forms with React Hook Form & Zod

- Browser form semantics and RHF field ownership.
- Zod 4 runtime validation and inferred input/output types.
- Coercion at DOM boundaries and cross-field rules.
- Resolver-driven valid submission and server error mapping.
- Accessible labels, messages, invalid state, and focus behavior.

## Day 43 — Server State with TanStack Query

- Server state as a remotely owned, possibly stale snapshot.
- Query functions, stable key addresses, and HTTP failure handling.
- Pending versus background fetching.
- `staleTime`, `gcTime`, refetch triggers, and retries.
- Mutations, targeted invalidation, optimistic rollback, and Devtools.

## Day 44 — Project 2: StepFree Transit Explorer *(4 hours)*

Build a routed, validated, query-powered transit-accessibility product with public station/outage data, URL-owned mobility filters, shareable stop pages, and a persisted local journey shortlist.

## Day 45 — Styling React Without the Confusion

- Global CSS, conditional classes, and runtime inline values.
- CSS Modules for local names.
- Semantic tokens and theme changes.
- Tailwind v4, complete utility tokens, `clsx`, and conflict merging.
- Typed component variants, native semantics, focus, and reduced motion.
- Copied component-source and headless primitive ownership.

## Day 46 — React Performance: Measure First, Concurrency Basics

- Render, commit, remount, layout, and paint costs.
- React Profiler and browser Performance evidence.
- Structure before `memo`, `useMemo`, and `useCallback`.
- React Compiler boundaries.
- Keep direct input urgent; use `useTransition` only for a measured slow render.
- Concurrency is prioritization, not parallel JavaScript; defer advanced APIs until the product needs them.
- Lazy/Suspense code splitting and large-list virtualization.

## Day 47 — Redux Toolkit for Shared Client State

- One-way actions, reducers, slices, store, and selectors.
- When Redux is justified and when it is not.
- `createSlice`, Immer drafts, `configureStore`, and Provider.
- Typed dispatch/selector Hooks and narrow subscriptions.
- Derived selectors, DevTools, middleware, and validated persistence.
- Keep TanStack Query server snapshots out of Redux.

## Day 48 — Project 3: Shelter Readiness Dashboard Foundation *(4 hours)*

Begin the capstone with responsive accessible UI, public shelter/readiness data, deliberate state ownership, and evidence-based performance work. Days 49–51 test, design, deploy, and document this same product.

## Day 49 — Testing Basics for a React Product *(1.5 hours)*

- Test one user-visible story with arrange, act, and assert.
- Find controls by role and accessible name; interact with `userEvent`.
- Use `findBy` for UI that appears later, never a fixed sleep.
- Add focused tests for the Shelter Readiness Dashboard's region search, capacity, and failure states.
- Leave advanced mocking, provider helpers, and test architecture for later project work.

## Day 50 — Frontend System Design from Requirements to Tradeoffs

- Clarify requirements and prioritize critical flows.
- Draw component boundaries and one-owner state tables.
- Normalize external API contracts and data arrows.
- Choose CSR, server rendering, static generation, or streaming from constraints.
- Separate browser, edge, server, and client caches.
- Design failures, performance, accessibility, security, and evolution.

## Day 51 — React Capstone: Shelter Readiness Dashboard *(6 hours)*

Build, test, and deploy a complete emergency-shelter readiness product:

- Shareable coordinate routes and accessible city search.
- Normalized Open-Meteo current, hourly, and five-day data.
- TanStack Query for remote snapshots.
- Validated Redux persistence for units, theme, and saved cities.
- Deterministic factual briefing summary with a documented future protected AI boundary.
- Initial loading, refresh, empty, invalid, error, offline, and not-found surfaces.
- Vitest/Testing Library/MSW coverage, keyboard acceptance, production build, deployment, README, and architecture diagram.

No secret key is placed in the browser, and API cache is never duplicated into Redux.
