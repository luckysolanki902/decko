import { Phase, Section, Topic } from '@/types';

type DaySpec = { day: number; title: string; areas: [string, string, string, string]; project?: Topic['project'] };
type PhaseSpec = { number: number; title: string; subtitle: string; goal: string; days: DaySpec[]; icon: string; color: string };

function topic(day: number, index: number, area: string): Topic {
  return {
    id: `day${day}-topic${index + 1}`,
    title: area,
    duration: index === 3 ? '60 mins' : '55 mins',
    items: [
      `Define ${area} in plain language and explain the problem it solves`,
      `Trace what the Go compiler or runtime does when ${area} is used`,
      `Write a tiny example, then apply it to a realistic backend task`,
      `Diagnose the beginner failure mode for ${area} and fix it deliberately`,
    ],
  };
}

function section(spec: DaySpec): Section {
  const topics = spec.areas.map((area, index) => topic(spec.day, index, area));
  if (spec.project) {
    topics[3] = { ...topics[3], title: 'Project requirements, constraints & review', project: spec.project };
  }
  return { id: `day${spec.day}`, title: `Day ${spec.day}: ${spec.title}`, duration: spec.project ? '5 hours' : '4 hours', topics };
}

function phase(spec: PhaseSpec): Phase {
  const first = spec.days[0].day;
  const last = spec.days.at(-1)!.day;
  return {
    id: `phase${spec.number}`,
    number: spec.number,
    title: spec.title,
    subtitle: spec.subtitle,
    duration: `${spec.days.length} Days | ~${spec.days.reduce((sum, day) => sum + (day.project ? 5 : 4), 0)} Hours`,
    days: `Days ${first}-${last}`,
    goal: spec.goal,
    icon: spec.icon,
    color: spec.color,
    sections: spec.days.map(section),
    checkpoint: {
      skills: spec.days.flatMap(day => day.areas).slice(0, 8),
      milestone: `You can apply Phase ${spec.number} skills in a finished, explainable Go project.`,
    },
  };
}

const project = (title: string, description: string, features: string[], hints: string[]): NonNullable<Topic['project']> => ({
  title, description, type: 'capstone', features, hints,
});

const specs: PhaseSpec[] = [
  { number: 1, title: 'Go Foundations & Toolchain', subtitle: 'Go 1.26, values, control flow, functions, and the compiler mental model', goal: 'Install Go 1.26 and reason confidently about small programs before abstractions appear.', icon: '🐹', color: 'cyan', days: [
    { day: 1, title: 'Why Go, Go 1.26 & Your First Program', areas: ['Go’s design goals and compiled-program mental model', 'Install, go version, go env, and workspace setup', 'package main, imports, func main, and fmt', 'go run, go build, gofmt, and compiler errors'] },
    { day: 2, title: 'Variables, Constants & Primitive Types', areas: ['var, short declarations, zero values, and assignment', 'Integers, floats, booleans, strings, bytes, and runes', 'Constants, iota, numeric conversion, and overflow', 'Formatting values with fmt without memorising verbs'] },
    { day: 3, title: 'Control Flow Without Hidden Magic', areas: ['if statements with initialization and lexical scope', 'for as Go’s only loop and its three common forms', 'switch, expressionless switch, and fallthrough rules', 'Early returns, guard clauses, and readable branching'] },
    { day: 4, title: 'Functions, Multiple Returns & defer', areas: ['Parameters, return values, and function signatures', 'Multiple returns and the value-error convention preview', 'Variadic functions and first-class function values', 'defer order, resource cleanup, and named-return traps'] },
    { day: 5, title: 'Mini Project — Trail Ration Planner CLI', areas: ['Command-line input and validation', 'Unit-safe integer arithmetic and allocation policy', 'Pure planning functions and formatted output', 'Project requirements, edge cases, tests, and README'], project: project('Trail Ration Planner CLI', 'Build a CLI for volunteer trek leaders that converts group size, route days, reserve percentage, and package sizes into a packable ration plan.', ['Integer-only gram and package calculations', 'Impossible-plan warnings and useful exit messages', 'Table-driven tests for boundary and invalid inputs'], ['Normalize every quantity to grams', 'State how partial packages and reserve food are handled']) },
  ]},
  { number: 2, title: 'Collections, Memory & Functional Building Blocks', subtitle: 'Arrays, slices, maps, pointers, strings, closures, and recursion', goal: 'Model and transform real data while understanding what is copied, shared, or allocated.', icon: '🧱', color: 'teal', days: [
    { day: 6, title: 'Arrays & Slices — Backing Arrays', areas: ['Arrays as fixed-size values', 'Slice header: pointer, length, and capacity', 'append growth, aliasing, and copy', 'Nil versus empty slices and API semantics'] },
    { day: 7, title: 'Maps, Sets & Deterministic Output', areas: ['Map creation, lookup, comma-ok, and deletion', 'Zero values, nil maps, and mutation rules', 'Set patterns with map[T]struct{}', 'Random iteration order and sorted output'] },
    { day: 8, title: 'Strings, Bytes, Runes & Unicode', areas: ['UTF-8 strings and byte length versus character count', 'range decoding and rune indexes', 'strings.Builder and efficient assembly', 'Unicode-safe slicing, normalization awareness, and traps'] },
    { day: 9, title: 'Pointers, Values & Escape Intuition', areas: ['Address, dereference, and nil pointers', 'Value versus pointer receivers preview', 'Passing slices, maps, structs, and pointers', 'Stack/heap intuition without manual memory management'] },
    { day: 10, title: 'Mini Project — Field Sensor Stream Summarizer', areas: ['Parse valid and malformed sensor observations', 'Aggregate station statistics with maps and slices', 'Stable anomaly ranking and Unicode-safe station labels', 'Project requirements, benchmarks, and rejection report'], project: project('Field Sensor Stream Summarizer', 'Read a large newline-delimited field-sensor export and produce deterministic station coverage, range, dropout, and malformed-record reports for a conservation team.', ['Bounded-memory streaming', 'Stable anomaly and dropout ranking', 'Rejected-record report with tests and benchmarks'], ['Set an explicit maximum record size', 'Separate decoding, validation, aggregation, and reporting']) },
  ]},
  { number: 3, title: 'Structs, Methods, Interfaces & Generics', subtitle: 'Go’s composition-first type system and explicit error design', goal: 'Design small, testable APIs using composition, narrow interfaces, errors, and restrained generics.', icon: '🧩', color: 'blue', days: [
    { day: 11, title: 'Structs, Composition & Invariants', areas: ['Struct literals, field visibility, and zero-value design', 'Embedding versus inheritance', 'Constructors as ordinary functions', 'Validation boundaries and invariant ownership'] },
    { day: 12, title: 'Methods & Receiver Decisions', areas: ['Method sets and receiver syntax', 'Value versus pointer receiver decision rules', 'Mutation, copying, and consistency', 'Fluent APIs and why hidden mutation surprises'] },
    { day: 13, title: 'Interfaces & Dependency Inversion', areas: ['Implicit interface satisfaction', 'Consumer-owned narrow interfaces', 'Interface values, dynamic types, and nil-interface traps', 'Type assertions, type switches, and capability design'] },
    { day: 14, title: 'Errors, Wrapping, Panic & Recovery', areas: ['Errors as values and explicit control flow', 'fmt.Errorf with %w, errors.Is, and errors.As', 'Sentinel versus typed errors', 'When panic is justified and recovery boundaries'] },
    { day: 15, title: 'Mini Project — Multi-Source Habitat Importer', areas: ['Interface-driven observation-source registry', 'Typed validation and import errors', 'Generic collection helpers used only where justified', 'Project requirements, tests, and extension guide'], project: project('Multi-Source Habitat Importer', 'Build a CLI that imports ranger CSV, JSON sensor dumps, and hand-entered text observations through a narrow source interface into one validated habitat record model.', ['Consumer-owned source interface', 'Wrapped errors that preserve file and row context', 'A new source format added without changing orchestration'], ['Keep parsing concerns out of the domain record', 'Return an explicit partial-import report when some rows fail']) },
  ]},
  { number: 4, title: 'Packages, Modules, I/O & CLI Engineering', subtitle: 'Official module layout, files, JSON, configuration, and maintainable commands', goal: 'Organize a real Go module and build reliable file- and network-facing command-line tools.', icon: '📦', color: 'indigo', days: [
    { day: 16, title: 'Packages, Modules & internal', areas: ['Package boundaries and exported identifiers', 'go mod init, go.mod, go.sum, and MVS', 'cmd and internal layout from official guidance', 'go list, go doc, dependencies, and avoiding package cycles'] },
    { day: 17, title: 'Files, Readers, Writers & bufio', areas: ['io.Reader and io.Writer as composable contracts', 'os.File lifecycle and defer Close', 'Buffered I/O and scanner limits', 'Paths, permissions, atomic writes, and cleanup'] },
    { day: 18, title: 'JSON, Tags & Validation Boundaries', areas: ['encoding/json marshal and unmarshal', 'Struct tags, omitempty, unknown fields, and optional values', 'Streaming JSON with Encoder and Decoder', 'Separating transport structs from domain structs'] },
    { day: 19, title: 'CLI Flags, Config & Graceful UX', areas: ['flag package, subcommands, usage, and exit codes', 'Configuration precedence: flags, environment, file, defaults', 'Signals and context-aware cancellation preview', 'Actionable errors, stdout versus stderr, and scripting contracts'] },
    { day: 20, title: 'Mini Project — Research Archive Catalog CLI', areas: ['Walk an archive and stream file metadata and hashes', 'Versioned JSON catalog and deterministic output', 'Report duplicates, drift, missing metadata, and unreadable files', 'Project requirements, atomic output, and install docs'], project: project('Research Archive Catalog CLI', 'Create and audit a deterministic catalog for a field-research archive, recording paths, sizes, media types, checksums, and required sidecar metadata.', ['Streaming inspection without loading files into memory', 'Atomic versioned catalog writes', 'Distinct exit codes for drift, invalid metadata, and I/O failure'], ['Sort normalized relative paths before encoding', 'Write and sync a temporary catalog before rename']) },
  ]},
  { number: 5, title: 'Concurrency, Channels & Context', subtitle: 'Goroutines, synchronization, cancellation, ownership, and race-free design', goal: 'Build concurrent programs whose lifetime, ownership, and failure behavior are explicit.', icon: '⚡', color: 'violet', days: [
    { day: 21, title: 'Goroutines & Lifecycle Ownership', areas: ['Concurrency versus parallelism', 'Starting goroutines and scheduler intuition', 'Goroutine lifetime, leaks, and ownership', 'WaitGroup and the add-before-go rule'] },
    { day: 22, title: 'Channels & Communication Protocols', areas: ['Unbuffered channel synchronization', 'Buffered channels and backpressure', 'Closing, ranging, direction types, and ownership', 'Deadlocks, blocked sends, and protocol diagrams'] },
    { day: 23, title: 'select, Timeouts & Cancellation', areas: ['select readiness and nondeterministic choice', 'Timers, tickers, cleanup, and time.After trade-offs', 'context cancellation, deadlines, values, and propagation', 'Cancellation-aware loops and partial results'] },
    { day: 24, title: 'Mutexes, Atomics & Race-Free State', areas: ['Data races versus logical races', 'sync.Mutex, RWMutex, and lock scope', 'Atomics for narrow counters, not general state', 'go test -race and reproducible race tests'] },
    { day: 25, title: 'Mini Project — Parallel Archive Verifier', areas: ['Bounded worker pool for file verification', 'Per-file and whole-run cancellation', 'Ordered aggregation without shared-map races', 'Project requirements, leak tests, and throughput metrics'], project: project('Parallel Archive Verifier', 'Verify thousands of research-archive files against a catalog with bounded parallel hashing, cancellation, progress events, and deterministic mismatch output.', ['Worker pool with measurable backpressure', 'Prompt cancellation with partial-result accounting', 'Race-detector-clean and goroutine-leak tests'], ['One goroutine should own report ordering', 'Prove the open-file limit is bounded as well as worker count']) },
  ]},
  { number: 6, title: 'Testing, Debugging, Performance & Security', subtitle: 'Table tests, fuzzing, race detection, benchmarks, pprof, and govulncheck', goal: 'Prove correctness and improve performance using evidence from Go’s standard toolchain.', icon: '🧪', color: 'rose', days: [
    { day: 26, title: 'Table-Driven Tests & Testable Design', areas: ['testing.T, subtests, helpers, and failure messages', 'Table-driven tests and boundary selection', 'Fakes, stubs, and interface seams', 'httptest and filesystem test isolation'] },
    { day: 27, title: 'Fuzzing & Property Thinking', areas: ['Seed corpus and FuzzXxx structure', 'Properties, invariants, and deterministic targets', 'Reproducing and promoting failures to regression tests', 'Where fuzzing helps and where it wastes time'] },
    { day: 28, title: 'Benchmarks, Allocations & pprof', areas: ['Benchmark loops and avoiding benchmark lies', 'b.ReportAllocs and allocation reasoning', 'CPU and heap profiles with pprof', 'Optimize measured hot paths, then re-measure'] },
    { day: 29, title: 'Debugging, Race Detector & Security', areas: ['Compiler, logs, delve awareness, and minimal reproductions', 'go test -race coverage and overhead', 'govulncheck call-graph-aware findings', 'Input limits, timeouts, secrets, and secure defaults'] },
    { day: 30, title: 'Mini Project — Untrusted Telemetry Decoder Lab', areas: ['Decode a deliberately inconsistent telemetry envelope', 'Table tests plus structural and semantic fuzz properties', 'Benchmark and profile before optimization', 'Project requirements, govulncheck, and threat notes'], project: project('Untrusted Telemetry Decoder Lab', 'Harden a binary-and-text telemetry decoder against truncation, corrupt lengths, duplicate fields, oversized payloads, and pathological nesting.', ['Minimized fuzz failures promoted to regression tests', 'Before/after CPU and allocation evidence', 'Documented resource ceilings and vulnerability scan'], ['Make malformed input return errors instead of panicking', 'Reject claimed sizes before allocating from them']) },
  ]},
  { number: 7, title: 'HTTP APIs with the Standard Library', subtitle: 'net/http, middleware, JSON contracts, validation, shutdown, and observability', goal: 'Build production-shaped APIs using net/http before adopting frameworks.', icon: '🌐', color: 'sky', days: [
    { day: 31, title: 'HTTP Mental Model & net/http', areas: ['Request-response lifecycle and HTTP semantics', 'ServeMux patterns and method-aware routes', 'Handlers, ResponseWriter commit behavior, and headers', 'Server timeouts and explicit configuration'] },
    { day: 32, title: 'JSON APIs, Validation & Errors', areas: ['Decode limits and unknown-field rejection', 'Transport/domain separation and validation', 'Consistent problem response envelopes', 'Status-code decisions and idempotent semantics'] },
    { day: 33, title: 'Middleware, Logging & Request IDs', areas: ['Middleware as handler composition', 'Panic recovery boundaries', 'Structured logging, request IDs, and redaction', 'CORS, rate-limit placement, and trust proxies'] },
    { day: 34, title: 'Clients, Context & Graceful Shutdown', areas: ['Configured http.Client and connection reuse', 'Context propagation through outbound calls', 'Signals, Server.Shutdown, and draining work', 'Health, readiness, and dependency checks'] },
    { day: 35, title: 'Mini Project — Community Tool Library API', areas: ['Tool, member, loan, and maintenance state contracts', 'Validated JSON, middleware, logs, and request IDs', 'Graceful shutdown and httptest coverage', 'Project requirements, OpenAPI, and operator README'], project: project('Community Tool Library API', 'Build an in-memory standard-library API for librarians to register tools, issue and return loans, quarantine damaged equipment, and expose a privacy-safe public catalog.', ['net/http only with explicit server limits', 'Illegal loan and maintenance transitions rejected', 'httptest coverage, request tracing, and graceful shutdown'], ['Separate public catalog fields from staff notes', 'Keep state-transition rules outside handlers']) },
  ]},
  { number: 8, title: 'PostgreSQL, Transactions & Authentication', subtitle: 'database/sql, migrations, SQL-first repositories, sessions, and authorization', goal: 'Persist real application state safely and enforce authentication and authorization server-side.', icon: '🐘', color: 'blue', days: [
    { day: 36, title: 'PostgreSQL & database/sql', areas: ['sql.DB as a concurrent connection pool', 'Drivers, PingContext, and pool configuration', 'QueryRowContext, QueryContext, Scan, and rows.Close', 'Prepared statements and parameterized SQL'] },
    { day: 37, title: 'Schema Design, Migrations & Repositories', areas: ['Keys, constraints, indexes, and timestamps', 'Forward migrations and reproducible environments', 'Repository boundaries without hiding SQL', 'sqlc awareness and compile-time query shapes'] },
    { day: 38, title: 'Transactions, Isolation & Allocation Conflicts', areas: ['sql.Tx lifecycle and rollback safety', 'Isolation levels and concurrent anomalies', 'Row locks, unique constraints, and atomic updates', 'Idempotency keys and retryable transaction failures'] },
    { day: 39, title: 'Sessions, Passwords & Authorization', areas: ['Password hashing and credential storage', 'Opaque sessions versus JWT trade-offs', 'Secure cookie flags, CSRF, and rotation', 'RBAC plus resource-level authorization'] },
    { day: 40, title: 'Mini Project — Laboratory Sample Custody API', areas: ['Users, samples, custody transfers, and disposal schema', 'Atomic handoff and chain-of-custody invariants', 'Session authentication and technician/supervisor policies', 'Project requirements, integration tests, and migrations'], project: project('Laboratory Sample Custody API', 'Track biological samples from intake through technician handoffs, storage, analysis, and disposal while preserving an append-only custody history.', ['Concurrent handoffs cannot assign one sample to two custodians', 'Session auth plus sample- and role-level authorization', 'Reversible migrations and real-PostgreSQL integration tests'], ['Let constraints defend current-custodian uniqueness', 'Race two technicians accepting the same transfer']) },
  ]},
  { number: 9, title: 'Production Go Services', subtitle: 'Architecture, Redis, background work, gRPC, observability, and reliability', goal: 'Design services that remain understandable under load, failure, and team growth.', icon: '🏗️', color: 'orange', days: [
    { day: 41, title: 'Service Architecture & Dependency Wiring', areas: ['cmd/internal server layout', 'Transport, service, repository, and domain boundaries', 'Explicit constructor injection', 'Configuration validation and startup failure'] },
    { day: 42, title: 'Redis, Caching & Distributed Coordination', areas: ['Cache-aside, TTL, invalidation, and stampedes', 'Rate limiting and atomic Redis operations', 'Distributed locks and when not to use them', 'Failure policy when Redis is unavailable'] },
    { day: 43, title: 'Background Jobs & Reliable Events', areas: ['Queue ownership, retries, backoff, and dead letters', 'Idempotent consumers and outbox pattern', 'At-least-once delivery consequences', 'Graceful worker shutdown and observability'] },
    { day: 44, title: 'gRPC, Metrics, Traces & SLOs', areas: ['Protobuf contracts and gRPC boundaries', 'Unary interceptors, deadlines, and status errors', 'Metrics cardinality, structured logs, and traces', 'SLIs, SLOs, alerts, and operational runbooks'] },
    { day: 45, title: 'Mini Project — Watershed Telemetry Pipeline', areas: ['Burst-heavy station ingestion and validation service', 'PostgreSQL source of truth plus Redis latest-reading cache', 'Background alert evaluation and idempotent events', 'Project requirements, load test, metrics, and runbook'], project: project('Watershed Telemetry Pipeline', 'Ingest field-station readings, deduplicate retransmissions, update latest-value views, and emit threshold alerts that survive worker restarts and Redis outages.', ['Sustained ingest target with bounded queue growth', 'Duplicate readings never create duplicate alerts', 'SLO dashboard and dependency-failure runbook'], ['PostgreSQL owns accepted observations; Redis serves projections', 'Key idempotency by station and device sequence']) },
  ]},
  { number: 10, title: 'Docker, Compose & Deployment', subtitle: 'Containers from scratch at the right moment—after the service is worth packaging', goal: 'Containerize, run, secure, and deploy a Go service with PostgreSQL and Redis.', icon: '🐳', color: 'cyan', days: [
    { day: 46, title: 'Containers, Images & Docker from Scratch', areas: ['Process isolation mental model', 'Images, layers, registries, and containers', 'Dockerfile instructions and build context', 'Ports, filesystems, environment, and lifecycle commands'] },
    { day: 47, title: 'Production Go Dockerfiles', areas: ['Multi-stage build with official Go image', 'go mod download cache ordering', 'CGO decisions and minimal runtime images', 'Non-root user, healthcheck, signals, and image inspection'] },
    { day: 48, title: 'Docker Compose Development Stack', areas: ['Compose services, networks, volumes, and dependencies', 'Go API plus PostgreSQL and Redis', 'Health-based readiness versus startup order', 'Migrations, secrets, logs, and cleanup'] },
    { day: 49, title: 'CI, Registry & Deployment', areas: ['go test, race, vuln, and image gates', 'Tagging and pushing immutable images', 'Environment configuration and secret injection', 'Deploy, smoke test, rollback, and resource limits'] },
    { day: 50, title: 'Mini Project — Deployed Watershed Operations Stack', areas: ['Package the telemetry API and alert worker', 'Compose production-like PostgreSQL and Redis dependencies', 'CI-built images and registry promotion', 'Project requirements, deployment, rollback, recovery drill, and runbook'], project: project('Deployed Watershed Operations Stack', 'Package and deploy the telemetry API and worker as separate non-root containers with migrations, health contracts, CI gates, immutable digests, backup restoration, and rollback evidence.', ['Small inspected images with explicit runtime identities', 'Healthy stack through cold start and dependency restart', 'Recorded deploy, restore, and rollback drills'], ['Build once and promote the same digests', 'Readiness must reflect required dependencies without creating restart loops']) },
  ]},
  { number: 11, title: 'Final Capstone — Disaster Relief Supply Network', subtitle: 'The resume project: needs, depots, inventory, allocation, dispatch, field delivery, and production operations', goal: 'Integrate the entire course into a production-shaped relief-logistics backend that proves allocation correctness, security, reliability, and system design.', icon: '🚚', color: 'red', days: [
    { day: 51, title: 'Capstone Architecture & Relief Domain', areas: ['Requirements, responders, coordinators, auditors, boundaries, and non-goals', 'Depots, supply lots, needs, allocations, dispatches, deliveries, and adjustments', 'API contracts and lifecycle state machines', 'Threat model, inventory invariants, and architecture decision records'] },
    { day: 52, title: 'Needs, Depots & Inventory Ledger', areas: ['Regional need intake and indexed priority queries', 'Depot, supply-lot, expiry, and inventory-ledger management', 'Read projections versus authoritative ledger entries', 'Coordinator authorization and append-only audit events'] },
    { day: 53, title: 'Allocation, Dispatch & Reliable Workflow', areas: ['Atomic multi-lot allocation without negative stock', 'Idempotent dispatch and delivery commands', 'Carrier boundary and delayed field-update reconciliation', 'Outbox events and notification workflow'] },
    { day: 54, title: 'Reliability, Security & Operations', areas: ['Rate limits, sessions, input boundaries, and abuse cases', 'Unit, integration, race, fuzz, and load tests', 'Metrics, traces, logs, SLOs, and alerts', 'Docker Compose, CI, migrations, backup, and rollback'] },
    { day: 55, title: 'Final Project — Ship the Relief Supply Network', areas: ['End-to-end need-to-delivery demonstration', 'Concurrent allocation proof and dependency failure injection', 'Deployment, recovery runbook, architecture diagram, and API docs', 'Resume bullets, demo video, trade-off narrative, and retrospective'], project: project('Disaster Relief Supply Network — DEPLOYED', 'Build and deploy a production-shaped Go backend that accepts verified needs, manages depot ledgers, allocates expiring supply lots, dispatches shipments, reconciles delayed field updates, and supports audited corrections.', ['Concurrent allocation never drives any lot below zero', 'PostgreSQL ledger + Redis projections + workers + idempotent carrier updates', 'Security tests, load evidence, observability, backup restore, Docker, CI, and runbook'], ['Start as a modular monolith and extract only a measured boundary', 'Prove two regions racing for the final units with an integration test', 'Use an outbox before claiming reliable dispatch notifications']) },
  ]},
];

export const goPhases = specs.map(phase);
export const [phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8, phase9, phase10, phase11] = goPhases;
