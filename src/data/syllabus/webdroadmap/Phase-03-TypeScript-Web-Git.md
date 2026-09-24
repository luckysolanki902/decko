# Phase 3: TypeScript, Web Internals & Git (Days 27–32)

**⏱ Duration:** 6 days · ~25 hours
**🎯 Goal:** Read TypeScript fluently, understand what actually happens when you visit a URL, and use git like a teammate would expect.

---

## Day 27 — TypeScript fundamentals
- Why TS exists: compile-time safety, refactor superpower, IDE autocomplete
- Setup: `tsc --init`, `strict: true`
- Primitive types, arrays, tuples, `any` vs `unknown` vs `never`
- Type inference — let TS do the work
- Functions: parameter & return types, optional / default params

## Day 28 — Interfaces, types & generics
- `interface` vs `type` (and the one rule for choosing)
- Union & intersection types
- Literal types & narrowing with type guards
- Generics: `function identity<T>(x: T): T`
- The handful of utility types you'll use forever: `Partial`, `Pick`, `Omit`, `Record`, `Awaited`, `ReturnType`
- **Mini build:** Type-safe fetch wrapper `apiGet<T>(url): Promise<T>`

## Day 29 — How the web actually works
- DNS → TCP → TLS → HTTP — the 30-second story
- HTTP: methods, status codes (memorize the 8 that matter), headers
- REST conventions; what JSON over HTTP really is
- Browser internals: render pipeline, paint, reflow, what blocks
- Cookies vs localStorage vs sessionStorage — security implications
- Same-origin policy & CORS in plain words

## Day 30 — Git & GitHub like a senior
- `init`, `clone`, `add`, `commit`, `push`, `pull`
- Branching strategy: `main` + short-lived feature branches
- Merging vs rebasing — when each is right
- Resolving conflicts without panic
- `.gitignore`, `git stash`, `git restore`, `git switch`
- Writing commit messages that future-you can read

## Day 31 — Pull requests, reviews, collaboration
- Forking, opening a PR, conventional commit format
- Code review etiquette (giving + receiving)
- GitHub Issues, project boards, milestones
- Squash-merge vs merge commit
- A first taste of GitHub Actions (run tests on push)

## Day 32 — Mini project: typed air-quality advisory
**Spec:**
- Normalize an uncertain public air-quality response in strict TypeScript with Vite
- Strongly type the API response (use the actual API schema)
- Strict mode on; zero `any`
- Open it as a PR against your own repo, write a real PR description, self-review, merge

---

## ✅ Phase 3 Checkpoint
You can read any TypeScript codebase, explain what happens when a user hits Enter on a URL, and contribute to a real git workflow without breaking history.

> _Next: React. The library that defines modern frontend._
