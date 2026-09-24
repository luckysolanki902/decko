import { Phase } from '@/types';

export const phase12: Phase = {
  id: 'phase12',
  number: 12,
  title: 'Testing: Vitest & Backend Testing',
  subtitle: 'Unit, integration, and component tests that actually catch bugs — with CI coverage',
  duration: '5 Days | ~22 Hours',
  days: 'Days 125-129',
  goal: 'Write tests a team would respect: fast unit tests with Vitest, real API/integration tests against a test database, and component tests with React Testing Library — wired into CI. (Browser E2E/Playwright is deliberately out of scope.)',
  icon: '🧪',
  color: 'emerald',
  sections: [
    {
      id: 'day125',
      title: 'Day 125: Why Test + Vitest Fundamentals',
      duration: '4 hours',
      topics: [
        {
          id: 'why-test',
          title: 'Why we test (and what "good" tests do)',
          duration: '35 mins',
          items: [
            'Tests are a safety net for change, not a chore',
            'The testing pyramid: many unit, some integration, few E2E',
            'Why we skip browser E2E (Playwright) in this phase — cost vs value here',
            'What a test proves vs what it cannot prove',
          ],
        },
        {
          id: 'vitest-setup',
          title: 'Vitest setup',
          duration: '45 mins',
          items: [
            'Install vitest; why Vitest over Jest for modern TS/ESM projects',
            'vitest.config + scripts (test, test:watch, coverage)',
            'File conventions: *.test.ts / __tests__',
            'Watch mode and the instant feedback loop',
          ],
        },
        {
          id: 'anatomy',
          title: 'Anatomy of a test',
          duration: '50 mins',
          items: [
            'describe / it (test) / expect — structure and naming',
            'Arrange–Act–Assert',
            'Matchers: toBe, toEqual, toThrow, toContain, toMatchObject',
            'beforeEach / afterEach / beforeAll — setup & teardown',
          ],
        },
        {
          id: 'pure-functions',
          title: 'Testing pure functions well',
          duration: '55 mins',
          items: [
            'Happy path + edge cases + error cases (the three you always write)',
            'Table-driven tests with it.each',
            'Boundary values, empty inputs, and the off-by-one trap',
            'Testing thrown errors and rejected promises',
          ],
        },
        {
          id: 'build-112',
          title: 'Build: test a real utility module',
          duration: '35 mins',
          items: [
            'Take a pricing/validation/date helper and cover it fully',
            'Make one test fail on purpose, read the diff output',
            'Refactor under green tests',
          ],
        },
      ],
    },
    {
      id: 'day126',
      title: 'Day 126: Mocking, Spies & Test Doubles',
      duration: '4 hours',
      topics: [
        {
          id: 'doubles',
          title: 'The vocabulary of test doubles',
          duration: '40 mins',
          items: [
            'Stub vs mock vs spy vs fake — what each means',
            'When to isolate a unit vs let it touch real collaborators',
            'The over-mocking trap: tests that pass but prove nothing',
          ],
        },
        {
          id: 'vi-fn',
          title: 'Spies with vi.fn / vi.spyOn',
          duration: '50 mins',
          items: [
            'vi.fn() and asserting calls (toHaveBeenCalledWith, times)',
            'vi.spyOn to observe/replace a method',
            'mockReturnValue / mockResolvedValue / mockRejectedValue',
            'Restoring spies to avoid cross-test leakage',
          ],
        },
        {
          id: 'vi-mock',
          title: 'Module mocking with vi.mock',
          duration: '50 mins',
          items: [
            'Mocking an entire module (e.g. an email or payment client)',
            'Partial mocks with importActual',
            'Hoisting gotchas with vi.mock',
            'Mocking network calls instead of hitting real APIs',
          ],
        },
        {
          id: 'time',
          title: 'Faking time & randomness',
          duration: '35 mins',
          items: [
            'vi.useFakeTimers, advanceTimersByTime',
            'Testing debounce/throttle/setTimeout logic deterministically',
            'Freezing Date.now and Math.random for repeatable tests',
          ],
        },
        {
          id: 'coverage',
          title: 'Coverage & what it really tells you',
          duration: '25 mins',
          items: [
            'Enable coverage (v8 provider); read the report',
            'Line vs branch coverage — why 100% is a lie detector, not a goal',
            'Finding untested branches that matter',
          ],
        },
      ],
    },
    {
      id: 'day127',
      title: 'Day 127: Backend / API Testing',
      duration: '5 hours',
      topics: [
        {
          id: 'why-api',
          title: 'What API tests cover',
          duration: '35 mins',
          items: [
            'Route → controller → service → DB, tested as a unit of behavior',
            'Status codes, response bodies, and headers as the contract',
            'Testing the error paths, not just 200s',
          ],
        },
        {
          id: 'supertest',
          title: 'Supertest against Express',
          duration: '60 mins',
          items: [
            'Export the app separately from server.listen (so tests import it)',
            'request(app).get/post + expect(status)',
            'Asserting JSON bodies and validation errors',
            'Sending auth headers/cookies in tests',
          ],
        },
        {
          id: 'test-db',
          title: 'A real test database',
          duration: '60 mins',
          items: [
            'mongodb-memory-server for isolated, fast Mongo tests',
            'Connect/disconnect in global setup/teardown',
            'Reset collections between tests for isolation',
            'Why you never run tests against the dev/prod DB',
          ],
        },
        {
          id: 'fixtures',
          title: 'Fixtures, factories & seeding',
          duration: '45 mins',
          items: [
            'Factory functions for users/orders (sane defaults + overrides)',
            'Seeding just enough data per test',
            'Avoiding shared mutable state across tests',
          ],
        },
        {
          id: 'build-114',
          title: 'Build: test a CRUD resource end-to-end',
          duration: '40 mins',
          items: [
            'Create/read/update/delete + validation + not-found paths',
            'Assert DB state after a write, not just the response',
            'Cover a 401 and a 403',
          ],
        },
      ],
    },
    {
      id: 'day128',
      title: 'Day 128: Integration Testing Real Flows',
      duration: '5 hours',
      topics: [
        {
          id: 'auth-flow',
          title: 'Testing an auth flow',
          duration: '55 mins',
          items: [
            'Register → login → access a protected route',
            'Asserting token/cookie issuance and rejection of bad creds',
            'Testing middleware (auth, rate-limit) in the request path',
          ],
        },
        {
          id: 'async',
          title: 'Testing async & side effects',
          duration: '50 mins',
          items: [
            'Awaiting DB writes and background side effects',
            'Mocking outbound calls (email/payment) at the boundary',
            'Verifying a job was enqueued (spy on the queue) without running a worker',
          ],
        },
        {
          id: 'isolation',
          title: 'Isolation & determinism',
          duration: '45 mins',
          items: [
            'Each test owns its data; no ordering dependencies',
            'Parallel test files vs shared resources',
            'Cleaning timers, mocks, and connections',
          ],
        },
        {
          id: 'flaky',
          title: 'Why tests go flaky (and the fixes)',
          duration: '45 mins',
          items: [
            'Time, ordering, network, and shared-state as flake sources',
            'Awaiting properly instead of arbitrary sleeps',
            'Making a flaky test reproducible, then killing the cause',
          ],
        },
        {
          id: 'ci-hook',
          title: 'Preparing tests for CI',
          duration: '25 mins',
          items: [
            'A single npm test that runs everything headless',
            'Deterministic env (test .env, seeded config)',
            'Fast: parallelism and the memory DB (deep CI wiring in Phase 15)',
          ],
        },
      ],
    },
    {
      id: 'day129',
      title: 'Day 129: Project — Permit Appeal Regression Lab',
      duration: '4 hours',
      topics: [
        {
          id: 'rtl-model',
          title: 'React Testing Library mindset',
          duration: '45 mins',
          items: [
            'Test behavior users see, not implementation details',
            'Queries by role/label/text (accessible-first)',
            'render, screen, and the "what would a user do?" lens',
            'jsdom environment config in Vitest',
          ],
        },
        {
          id: 'interactions',
          title: 'Simulating user interactions',
          duration: '50 mins',
          items: [
            'user-event: type, click, select',
            'Asserting rendered output after state changes',
            'findBy/waitFor for async UI (loading → loaded)',
          ],
        },
        {
          id: 'component-mocks',
          title: 'Mocking data & hooks in components',
          duration: '40 mins',
          items: [
            'Mocking fetch/API modules a component depends on',
            'Testing loading, empty, and error states',
            'Testing a custom hook in isolation',
          ],
        },
        {
          id: 'project',
          title: 'Build and prove the regression lab',
          duration: '85 mins',
          items: [
            'Unit tests for utils, integration tests for the API, component tests for key UI',
            'Set a coverage threshold that is honest',
            'One npm test entrypoint, green, ready for CI',
          ],
          project: {
            title: 'Permit Appeal Regression Lab — TESTED',
            description: 'Build a deliberately small permit-appeal flow with a deadline/time-zone bug and an authorization leak. Define its contract, reproduce both failures, and protect the corrected workflow with unit, API integration, component, and end-to-end tests plus honest CI coverage thresholds.',
            type: 'capstone',
            features: ['A written failure scenario and expected behavior before the first test.', 'Vitest unit tests, Supertest integration tests, RTL behavior tests, and one Playwright critical path.', 'CI reports coverage honestly and blocks the known regression.'],
            hints: ['Test user-observable behavior, not internal implementation details.', 'A coverage percentage is not a test strategy; name the failure each test prevents.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Vitest: structure, matchers, setup/teardown, coverage',
      'Test doubles: spies, module mocks, fake timers — without over-mocking',
      'API/integration tests with Supertest + an isolated memory database',
      'Fixtures/factories and deterministic, non-flaky tests',
      'Component tests with React Testing Library and user-event',
      'A single CI-ready test command with a coverage threshold',
    ],
    milestone: 'You can add a trustworthy test suite to any codebase — the difference between "it works on my machine" and code a team will merge.',
  },
};
