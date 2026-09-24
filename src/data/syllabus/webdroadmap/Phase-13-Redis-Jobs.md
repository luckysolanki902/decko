# Phase 13 — Redis, Coordination, and Background Jobs (Days 130–135)

**Capability:** reduce repeated work, enforce shared limits, coordinate live instances, and move retryable work out of request latency without losing correctness.

## Day 130 — Redis fundamentals
- Data types, TTL, atomic commands, persistence tradeoffs, managed Redis, key naming, and inspection.
- First visible win: store an expiring service-status value and verify expiry from two clients.

## Day 131 — Cache-aside patterns
- Miss/hit flow, invalidation, stampedes, stale data, cache keys, measurement, and when a cache adds risk.
- Measure a hot endpoint before and after caching; no performance claim without numbers.

## Day 132 — Rate limiting and sessions
- Fixed/sliding/token approaches, distributed counters, useful `Retry-After`, trusted identity, and session tradeoffs.

## Day 133 — Pub/sub and real-time glue
- Ephemeral delivery, channel design, Socket.io Redis adapter, instance failure, and why durable events need another tool.

## Day 134 — BullMQ jobs
- Producer/worker boundary, idempotency, retries/backoff, progress, scheduling, deduplication, dead-letter handling, and operator visibility.

## Day 135 — Batch Geocoding Dispatch Service
- Accept address batches, cache normalized lookups, enforce tenant limits, queue provider calls and map-bundle generation, and expose row-level progress.
- **Evidence:** baseline/provider-call counts, idempotent retry proof, dead-letter recovery, and managed-Redis deployment.
- **Transfer:** add a second provider with a different quota and choose where fallback belongs.
- **Out of scope:** building a general workflow engine or claiming exactly-once delivery.
