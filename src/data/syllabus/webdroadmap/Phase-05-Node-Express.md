# Phase 5: Node + Express + REST APIs (Days 52–63)

**⏱ Duration:** 12 days · ~52 hours
**🎯 Goal:** Build a production-shaped REST API with validation, file uploads, caching, rate limiting, structured logging, proper error handling — and both manual (Postman) and automated (Vitest + Supertest) tests.

> Stack: Node.js (latest LTS), Express 5, TypeScript, Zod, Pino, Multer + Cloudinary, Vitest + Supertest.

---

## Day 52 — Node.js, modules, package managers
- The Node runtime: V8 + libuv + event loop (backend lens)
- CommonJS vs ESM — pick ESM for new projects
- `package.json` deep dive: `type`, `exports`, `engines`, scripts
- `npm` (course standard), lockfiles never in `.gitignore`
- Standard lib: `fs/promises`, `path`, `url`, `os`, `crypto`

## Day 53 — Env, CLI, dev loops
- `process.env`, `dotenv`, `.env` / `.env.example`; validate env with Zod at boot
- A tiny CLI (`process.argv`, commander)
- `tsx watch` / `nodemon`; Node + ESM `tsconfig` scaffold

## Day 54 — Express basics
- HTTP without a framework (10 lines, to feel it)
- Express app, route params, query strings; `req`/`res` essentials
- JSON middleware, static files, `/health`
- Status codes that matter (200/201/204/400/401/403/404/409/422/429/500)

## Day 55 — Middleware & error handling
- The `(req, res, next)` contract; order matters
- Built-in + standard middleware (`json`, `cors`, `pino-http`)
- Async error handling (Express 5 auto-catch); central error middleware
- Writing your own (requestId, logger, requireAuth stub)

## Day 56 — REST API design
- Resource modeling (nouns, plural, hierarchy)
- Verb→status matrix; idempotency
- Pagination (page/limit + cursor), filtering, sorting
- **HTTP caching & conditional requests** (`Cache-Control`, ETag/`If-None-Match` → 304)
- API versioning

## Day 57 — Validation with Zod
- Why runtime validation (TS is compile-time only)
- Schemas for body/params/query/headers; `.coerce`, `.transform`
- A reusable `validate(schema)` middleware → 422 with field errors
- Type-safe handlers via `z.infer`

## Day 58 — File uploads
- `multipart/form-data`; Multer (memory vs disk); limits
- Stream buffer → Cloudinary; store only the `secure_url`
- MIME whitelist + magic-byte sniffing (don't trust the extension)

## Day 59 — Security baseline
- `helmet`, correct CORS (never `*` with credentials)
- Rate limiting (per-IP / per-user, strict on auth routes)
- Injection prevention (NoSQL + SQL/parameterized queries preview)
- `.env` discipline; OWASP Top-10 quick map

## Day 60 — Structured logging with Pino
- Why structured logs; levels
- Pino + `pino-http` + `pino-pretty` (dev only)
- Request logging + correlation IDs (`X-Request-Id`, `req.log`)
- Where logs go in production (shippers)

## Day 61 — API testing: manual + automated
- Postman/Thunder/httpie; collections committed; Newman CLI runs
- **Automated: Vitest + Supertest** — export the app, assert status/body/headers
- Test the unhappy paths (422 / 404 / 401 / 429)
- Isolating tests: throwaway store/DB, reset per test, mock Cloudinary/email

## Day 62 — Production API design review: Notes API
**Integration spec:** CRUD `/notes` (paginated + search), attachment-ready structure, ETag on GET, Zod validation, helmet/CORS, rate-limited writes, Pino + request IDs; in-memory store because databases land in Phase 6.
- Scaffold the production-shaped layers and middleware order
- Implement and review the complete CRUD contract
- Use the Notes API as the rehearsal architecture for the capstone

## Day 63 — Capstone: Food-Safety Inspection API
**Capstone spec:** Establishment registry, structured inspection checklist, evidence attachments, explicit review states, separate public/internal views, audit events, Zod validation, Pino/request IDs, rate limits, OpenAPI documentation, Vitest/Supertest coverage, and deployment.
- Transfer the rehearsal architecture into a different user, workflow, resource model, and authorization boundary.
- Test happy paths plus 422, 404, unauthorized, invalid transition, upload, and 429 paths
- Commit API docs and a Postman collection, deploy, then smoke-test production

---

## ✅ Phase 5 Capstone
**Food-Safety Inspection API — deployed and tested.** A public establishment view and protected inspection workflow, validated, logged, rate-limited, documented, evidence-capable, and covered by automated tests. Production shape—before the durable database and identity layers arrive.

> _Next: databases — give your API real persistence in both MongoDB and Postgres._
