# Phase 12 — Testing as Risk Control (Days 125–129)

**Capability:** turn a named product risk into the cheapest reliable automated evidence, from pure logic through API, component, and one critical browser path.

## Day 125 — Why test + Vitest fundamentals
- Arrange/act/assert, deterministic fixtures, boundary cases, false confidence, and watch mode.
- First visible win: protect a real normalization utility, then deliberately break it and watch the test fail.

## Day 126 — Mocks, spies, and test doubles
- Choose fakes, stubs, spies, and mocks by boundary; control time, randomness, network, and modules.
- Diagnose brittle interaction tests and prefer observable behavior when implementation details do not matter.

## Day 127 — Backend/API testing
- Supertest against the real Express app, isolated test data, authentication helpers, status/body/header contracts, and cleanup.
- Transfer gate: test malformed input, forbidden access, missing records, and one conflict—not just the happy path.

## Day 128 — Integration testing real flows
- React Testing Library queries and user events, database-backed integration, contract seams, and a narrow Playwright critical path.
- Decide which layer should catch each failure before writing the test.

## Day 129 — Permit Appeal Regression Lab
- Reproduce a deadline/time-zone bug and an authorization leak before fixing either.
- Protect the corrected flow with unit, API, component, and browser evidence; add honest CI thresholds.
- **Transfer:** change the appeal deadline rule and add a delegated reviewer without being told which tests to update.
- **Out of scope:** snapshot-heavy testing, exhaustive browser coverage, and coverage-percentage theater.

## Gate evidence
The learner explains the risk each test owns, demonstrates red → green on both regressions, identifies a test that belongs at a cheaper layer, and reconstructs the critical path after a delay.
