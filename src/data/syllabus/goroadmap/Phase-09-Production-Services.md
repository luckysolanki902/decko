# Phase 9 — Production Go Services

**Days 41–45 · Outcome:** design services that remain understandable under load, partial failure, and team growth.

- Day 41: modular-monolith boundaries, `cmd`/`internal`, transport-service-repository-domain layers, constructor injection, and fail-fast configuration.
- Day 42: Redis cache-aside, TTLs, invalidation, stampedes, rate limiting, atomic operations, distributed-lock limits, and outage policy.
- Day 43: queues, retries, backoff, dead letters, idempotent consumers, outbox delivery, at-least-once consequences, and worker shutdown.
- Day 44: protobuf contracts, gRPC boundaries, interceptors, deadlines, status errors, metrics, traces, cardinality, SLOs, alerts, and runbooks.
- Day 45: build a Watershed Telemetry Pipeline with burst-bounded ingestion, PostgreSQL observation truth, Redis latest-reading projections, deduplication by device sequence, restart-safe threshold-alert workers, gRPC boundaries, load targets, SLO telemetry, and a Redis-outage runbook.
