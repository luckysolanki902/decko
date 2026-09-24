# Phase 8: Next.js App Router Mastery (Days 93–107)

**⏱ Duration:** 15 days · ~64 hours
**🎯 Goal:** Build a production Next.js app using the App Router fully — server components, server actions, streaming, caching, route handlers, a **deliberate rendering strategy**, and an E2E test suite — without fighting the framework.

> Throughout: TypeScript, Tailwind, shadcn/ui, Auth.js v5, Drizzle/Postgres or Mongoose (your pick), Zod, Playwright.

---

## Day 93 — App Router mental model
- Server Components by default (no JS shipped); async components
- File conventions (`page`/`layout`/`loading`/`error`/`not-found`), route groups, parallel/intercepting routes
- Nested layouts (preserve state on nav); Metadata API

## Day 94 — Server vs Client components
- When you need `"use client"`; push the boundary deep
- Composition (server renders client; pass server children into client)
- Props serialization; TanStack Query with `HydrationBoundary`

## Day 95 — Data fetching on the server
- `fetch` in async server components (caching opt-in in Next 15+); `Promise.all` to avoid waterfalls
- Calling Drizzle/Mongo directly (singleton client, secrets stay server-side)
- Streaming with Suspense + `loading.tsx`; `error.tsx` + `notFound()`

## Day 96 — Caching & revalidation
- The caching layers (request memo, data cache, full-route, router)
- Opting in: `force-cache` vs `no-store`, `revalidate`, `tags`
- `revalidatePath` / `revalidateTag`; static vs dynamic rendering

## Day 97 — Rendering strategies — the decision framework
- CSR / SSR / SSG / ISR / streaming — the **decision table** (freshness, TTFB, SEO, cost, personalization)
- PPR & Cache Components (`use cache`, `cacheLife`, `cacheTag`) — the 2026 direction
- Choosing per route (`generateStaticParams`; the "one dynamic call opts out the route" trap)
- The interview answer: tie each choice to a metric

## Day 98 — Server Actions
- `"use server"` functions; form `action=` + imperative calls
- `useActionState` / `useFormStatus`; validate + authorize inside the action
- `revalidatePath/Tag` after mutation; actions vs route handlers; progressive enhancement

## Day 99 — Route handlers + middleware
- `route.ts` (Web Request/Response); webhook handlers (verify signatures, idempotency)
- `middleware.ts` (auth gate, redirects, rewrites, matcher)
- Runtime choice — Node by default; edge only with a reason (Fluid Compute makes Node cheap)

## Day 100 — Auth in Next.js
- `auth()` in server components, `useSession` in client, middleware protection
- JWT vs DB session (Drizzle/Mongo adapter)
- Protected-resource patterns; **multi-tenant basics** (every query filtered by `workspaceId`)

## Day 101 — Forms, actions, optimistic
- RHF + server actions (uniform client + server errors)
- `useOptimistic`; `useTransition` for non-blocking UI
- Error pattern: return `{ ok: false, error }` instead of throwing

## Day 102 — Images, fonts, SEO
- `next/image` (AVIF/WebP, `remotePatterns`, `sizes`); `next/font`
- SEO (`metadata`, `sitemap.ts`, `robots.ts`, JSON-LD)
- Analytics + monitoring (Vercel Analytics, Web Vitals, Sentry)

## Days 103–107 — Project: Conservation Permit Review Workspace (build → test → ship)
**Spec:** regional workspaces, reviewers, habitat-impact applications, evidence attachments, annotations, revision requests, review states, and read-only decision packets; Auth.js plus a durable database.
- Day 103: scaffold + auth + workspace creation/switching
- Day 104: notes CRUD + tags (server components, streaming, Tiptap editor, autosave via server action)
- Day 105: members, invites (Resend), public share links
- Day 106: **performance + testing** — Lighthouse, deliberate rendering per route, Vitest for action logic, **Playwright E2E** including a multi-tenant isolation test, a11y
- Day 107: deploy to Vercel, observability (Sentry, Analytics), docs + launch

---

## ✅ Phase 8 Capstone
**Conservation Permit Review Workspace — deployed and tested.** Tenant isolation, review workflow, evidence handling, deliberate rendering/cache strategy, Playwright critical path, and observability are live and documented.

> _Next: payments — take money correctly, with webhooks as the source of truth._
