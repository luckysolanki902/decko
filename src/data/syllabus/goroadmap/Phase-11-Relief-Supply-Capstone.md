# Phase 11 — Final Capstone: Disaster Relief Supply Network

**Days 51–55 · Outcome:** deliver a production-shaped relief-logistics backend whose inventory, authorization, concurrency, and recovery claims are proven.

- Day 51: define responder, coordinator, and auditor needs; system boundaries and non-goals; depot, lot, need, allocation, dispatch, delivery, and adjustment state machines; invariants; threats; API contracts; and architecture decisions.
- Day 52: implement verified need intake, indexed priority queries, depot and expiring-lot management, an append-only inventory ledger, rebuildable read projections, coordinator authorization, and audit events.
- Day 53: implement atomic multi-lot allocation, idempotent dispatch and delivery commands, a carrier integration boundary, delayed and duplicated field-update reconciliation, outbox delivery, and notifications.
- Day 54: add rate limits, session controls, input ceilings, privilege and abuse tests, unit/integration/race/fuzz/load suites, structured telemetry, SLOs, alerts, Docker Compose, CI, migrations, backup restoration, and rollback.
- Day 55: deploy and demonstrate the need-to-delivery path; prove two regions racing for the final units never create negative stock; inject PostgreSQL, Redis, worker, and carrier failures; and deliver an architecture diagram, API reference, recovery runbook, demo video, resume bullets, trade-off narrative, and retrospective.

The final project begins as a modular monolith. A service split is optional and requires measured pressure, an independently owned lifecycle, or a failure-isolation need; a diagram alone is not evidence.
