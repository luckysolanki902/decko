# Phase 6: Databases — MongoDB + Postgres (Days 64–79)

**⏱ Duration:** 16 days · ~68 hours
**🎯 Goal:** Model and query real data in MongoDB, then put Postgres behind your Node API with Drizzle — schema as TypeScript, migrations, relations, transactions — and know exactly when to reach for each.

> You already know SQL (SELECT/JOIN/GROUP BY, schema design, normalization) from the data track. Here you learn Drizzle from zero and spend that SQL knowledge inside a real backend — no SQL syntax re-taught, just the integration.

---

## Day 64 — Mongo concepts & Atlas
- Document vs relational — when each fits (Postgres arrives Day 75)
- Atlas free cluster: create, network access, DB user, connection string
- `mongosh` basics; BSON types & ObjectIds; Compass GUI tour

## Day 65 — Mongoose schemas & models
- Why Mongoose (validation, hooks, query builder, population)
- Schema design: types, `required`, `default`, `enum`, subdocuments, `timestamps`
- `model()`, singleton connection, connection events
- Schema-level indexes; typing models with TypeScript

## Day 66 — CRUD with Mongoose
- create / find / findOne / findById; projections
- update / delete; atomic operators (`$set`, `$inc`, `$push`, `$pull`)
- `.lean()` — when and why (perf)
- Common query operators (`$gt`, `$in`, `$or`, `$regex`, `$exists`)

## Day 67 — Relationships & population
- Embed vs reference (the deciding questions); 16MB limit
- `populate()` + nested populate + field selection
- The N+1 problem (in Mongoose and any ORM)
- Denormalizing on purpose

## Day 68 — Indexes from scratch: how a database finds a row
- Life without an index: heaps, pages, sequential scans, and why page reads (not rows) are the unit of cost
- The B-tree built up from a sorted array → branching → B+tree leaves and sibling links; fanout, height, splits
- What an index entry physically is (key + row pointer), the two-step index-then-fetch read, index-only/covered reads, clustered vs secondary across Postgres / InnoDB / Mongo
- Cardinality vs selectivity; the ~5-10% threshold where a scan wins; random vs sequential I/O; how statistics drive the estimate
- What an index costs: write amplification, update = delete + insert, HOT updates, dead entries and bloat, cache pressure
- Measure it: `EXPLAIN ANALYZE` and `explain("executionStats")` before and after, examined-vs-returned ratio, and reproducing "the planner ignored my index" on purpose

## Day 69 — Index types & index design (Postgres + MongoDB)
- Composite column order: left-prefix rule, Mongo's **ESR** (Equality → Sort → Range) and its Postgres phrasing, why a range before the sort column forces a sort, index intersection
- Covering indexes: Postgres index-only scans + `INCLUDE` + the visibility map; Mongo covered queries and the `_id` projection trap
- Postgres index types: B-tree, hash, **GIN** (jsonb/arrays/tsvector), **GiST** (geo, ranges, exclusion), **BRIN** (huge ordered tables), SP-GiST, expression indexes, partial indexes, unique indexes
- MongoDB index types: single/compound, **multikey** (and the two-array-fields rule), text, wildcard, hashed, 2dsphere, partial vs sparse, unique (+ partial), **TTL**, collation
- The same problem in both engines side by side: tag search, full-text, expiry, uniqueness-with-exceptions, case-insensitive lookup
- Designing an index set from the query log; redundancy (`(a)` under `(a, b)`); budgeting indexes like code

## Day 70 — Query plans, diagnosis & index maintenance
- Postgres plans: `EXPLAIN (ANALYZE, BUFFERS)`, reading bottom-up, Seq/Index/Index-Only/Bitmap scans, joins, Sort, estimated-vs-actual rows, external merge spills
- Mongo plans: verbosity levels, COLLSCAN/IXSCAN/FETCH/SORT/PROJECTION_COVERED, winningPlan + plan cache, `nReturned` vs keys vs docs examined, the 32 MB in-memory sort limit, `hint()`, the profiler
- Anti-patterns that silently kill an index: functions on the column, type mismatch, leading wildcards, negations, OR across columns, mismatched sort, large OFFSET/skip, low selectivity
- Maintenance: `ANALYZE`, autovacuum, bloat, `REINDEX CONCURRENTLY`, `CREATE INDEX CONCURRENTLY`, Mongo live index builds, finding unused indexes (`pg_stat_user_indexes`, `$indexStats`), index size vs cache
- Advanced: MVCC and the visibility map, page splits + fill factor, UUIDv4 vs v7/ULID fragmentation, B-tree vs LSM-tree, shard keys and targeted vs scatter-gather, when the answer is partitioning or caching instead, `random_page_cost` literacy, DDL locking
- Interview drill (answer aloud) + fix three of your own slow queries with three different tools

## Day 71 — Aggregation pipeline
- Pipeline mental model; `$match` early for indexes
- `$group` / `$project` / `$sort` / `$limit`; `$lookup` + `$unwind`
- `$facet` for dashboards; practical patterns (top N, daily counts, averages)

## Day 72 — Mongo transactions & data integrity
- Single-doc writes are atomic; multi-doc invariants need a transaction
- `session.withTransaction()`; pass `{ session }` everywhere; commit/abort + retry (needs a replica set — Atlas has one)
- Integrity without foreign keys: optimistic concurrency, idempotency keys, soft vs hard delete
- Preview: how Postgres does FKs + ACID at the engine

## Days 73–74 — Project: Blog backend on Mongo
**Spec:** User, Post, Comment, Tag; posts CRUD, `$text` search, tag filter, threaded comments, `GET /stats` aggregation.
- Day 73: models + indexes + endpoints
- Day 74: stats aggregation + **one real transaction**, wire Phase 5's Notes API to Mongo, re-run the Supertest suite, docs

## Day 75 — Postgres behind your API — Drizzle from zero
- Driver vs typed query builder vs heavy ORM; what Drizzle is (typed SQL + drizzle-kit + Studio) and what it deliberately is not
- Provision hosted Postgres (Neon / Supabase / Railway); connection-string anatomy, Zod-validated `DATABASE_URL`, direct vs pooled URLs
- `npm i drizzle-orm pg` + `drizzle-kit`; the `db` singleton; stable line vs the v1 release candidate the docs now show
- First table in `schema.ts` (`pgTable`, column builders, TS-name ↔ column-name), `drizzle.config.ts`, `drizzle-kit push`
- First queries: `insert().values().returning()`, `select().from().where(eq(...))`, `.toSQL()`, and wiring them into the Phase 5 Express app
- Drizzle Studio and the edit → push → query loop

## Day 76 — Modeling a real schema — types, constraints & indexes
- Column builders for the Postgres types you know: identity/serial/uuid, text/varchar, timezone-aware timestamps, `numeric` for money, `jsonb` with `$type<>()`
- Constraints in TypeScript: `notNull`, `default` vs `$defaultFn`, unique, composite primary keys, `check` — validate in Zod, constrain in Postgres
- `pgEnum` vs a check constraint vs a lookup table, and the migration cost of each
- Foreign keys and referential actions; one-to-many, one-to-one, explicit many-to-many join tables, self-references
- Indexes declared beside the table: `index` / `uniqueIndex`, composite left-prefix rule, partial indexes
- `$inferSelect` / `$inferInsert` and **drizzle-zod** so validation can't drift from the schema

## Day 77 — Querying with Drizzle — builder & relational queries
- Partial select, the operator functions (`eq`/`inArray`/`ilike`/…), `and`/`or`/`not`, conditional filter arrays, `orderBy`/`limit`/`offset`
- Joins and the per-table result shape; nullable sides on `leftJoin`; reshaping at the edge
- `groupBy`/`having`, `count`/`sum`/`avg`, the `sql` template (still parameterized), `db.execute` as the raw escape hatch
- `relations()` + `db.query.<table>.findMany({ with, columns, where })` — nested reads in one round trip, the N+1 fix from Day 67
- Builder vs `db.query`: the decision rule — plus the **version trap** (`defineRelations`, object `where`, `through()` in v1 RC)
- Offset vs keyset pagination; prepared statements with `sql.placeholder`; `EXPLAIN ANALYZE` on what Drizzle compiled

## Day 78 — Migrations, seeding & transactions
- `push` (solo prototyping) vs `generate` → `migrate` (teams and production); what lives in `./drizzle` and why you commit it
- Reading the generated SQL, the rename prompt (and the data loss behind the wrong answer), `drizzle-kit check` after a merge
- Applying in a real deploy: CI release step vs runtime `migrate()`; one migrator, direct connection, a rollback plan decided in advance
- Zero-downtime schema change: expand → backfill → contract; nullable-then-tighten; concurrent index creation
- Idempotent seed scripts (`onConflictDoNothing`), demo vs fixture vs reference data, `drizzle-seed`
- `db.transaction(async (tx) => …)`, the "must use `tx`" bug, `tx.rollback()`, savepoints, isolation levels, `onConflictDoUpdate`, row locks, and mapping `23505` to a 409

## Day 79 — Project: Mutual-Aid Inventory Lineage API + choosing your DB
- Relational model with explicit join tables, enums, checks, and indexes chosen from the real query list
- CRUD + a relation-heavy read + full-text search (tsvector + GIN) + faceted filters + keyset pagination, behind a repository layer
- One transactional ingest that is provably all-or-nothing; upsert by URL; constraint violations mapped to correct status codes
- **Vitest + Supertest** against a real throwaway Postgres with migrations applied in setup
- Deploy with a pooled `DATABASE_URL`, `drizzle-kit migrate` on release, smoke test
- **Mongo vs Postgres decision framework**; polyglot persistence; the Drizzle trade-off in one sentence

---

## ✅ Phase 6 Capstone
**Two deployed data layers** — a Mongo-backed API (Mongoose, indexes, aggregation, transactions) and a Postgres-backed API (Drizzle schema, versioned migrations, relations, ACID transactions). You can model, wire, test, and choose between document and relational databases — and defend the choice.

> _Next: authentication — make your APIs know who's asking._
