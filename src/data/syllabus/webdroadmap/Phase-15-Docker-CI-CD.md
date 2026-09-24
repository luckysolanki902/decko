# Phase 15 — Docker and Safe Delivery (Days 140–147)

**Capability:** build one reproducible artifact, run its dependencies locally, verify it in CI, and promote the same image through a reversible release.

## Days 140–144 — Containers in depth
- Container/process mental model, images, layers, registries, ports, filesystems, signals, health checks, and debugging.
- Dockerfiles, cache order, `.dockerignore`, non-root users, multi-stage builds, small runtime images, Compose networks, volumes, environment separation, and resource limits.
- Early win: run a known service in a container, inspect it, stop it cleanly, then containerize an API with a database and worker.

## Days 145–146 — GitHub Actions and CI
- Events, jobs, steps, caches, matrices, artifacts, least-privilege tokens, secrets, lint/type/test/build gates, image scanning, and immutable tags.
- Diagnose a failing pipeline from logs rather than repeatedly editing YAML at random.

## Day 147 — Flood-Alert Canary Delivery Pipeline
- Build one multi-stage image and promote the same digest through staging, fixture-gauge smoke tests, manual production approval, health verification, and rollback.
- **Evidence:** reproducible Compose stack, gated workflow, dependency/security checks, canary result, production approval, and a rollback run by another person.
- **Transfer:** add a schema migration and decide how compatibility changes the release order.
- **Out of scope:** Kubernetes and pretending a green build proves production health.
