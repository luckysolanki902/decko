import { Phase } from '@/types';

export const phase13: Phase = {
  id: 'phase13',
  number: 13,
  title: 'Redis & BullMQ',
  subtitle: 'Caching, rate limiting, pub/sub, and background jobs — the production toolbelt',
  duration: '6 Days | ~26 Hours',
  days: 'Days 130-135',
  goal: 'Use Redis correctly and know when NOT to: caching that cuts latency, rate limiting that protects your API, pub/sub that glues real-time servers together, and BullMQ background jobs with retries and dead-letter handling.',
  icon: '🧰',
  color: 'rose',
  sections: [
    {
      id: 'day130',
      title: 'Day 130: Redis Fundamentals',
      duration: '4 hours',
      topics: [
        {
          id: 'mental-model',
          title: 'What Redis is (and is not)',
          duration: '40 mins',
          items: [
            'In-memory data store: microsecond reads, not a primary database',
            'Single-threaded event loop — why commands are atomic',
            'Persistence options (RDB/AOF) and what "durable" means here',
            'When Redis is the wrong tool (source of truth for critical data)',
          ],
        },
        {
          id: 'data-types',
          title: 'Core data types & their uses',
          duration: '60 mins',
          items: [
            'Strings & counters (INCR) — views, quotas',
            'Hashes — objects/sessions',
            'Lists — simple queues, recent-items',
            'Sets & sorted sets — uniqueness, leaderboards, ranked feeds',
            'Choosing the type that matches the access pattern',
          ],
        },
        {
          id: 'ttl',
          title: 'Keys, TTL & expiry',
          duration: '40 mins',
          items: [
            'Key naming conventions (namespace:entity:id)',
            'EXPIRE / SET EX — TTL as a first-class idea',
            'Eviction policies (allkeys-lru etc.) when memory fills',
          ],
        },
        {
          id: 'connect',
          title: 'Redis from Node + the CLI',
          duration: '55 mins',
          items: [
            'Run Redis locally (Docker) and via a managed provider (Upstash)',
            'redis-cli basics: SET/GET/DEL/KEYS/TTL',
            'Connect with ioredis; connection pooling & error handling',
            'Reading Redis in your app without blocking the event loop',
          ],
        },
      ],
    },
    {
      id: 'day131',
      title: 'Day 131: Caching Patterns',
      duration: '5 hours',
      topics: [
        {
          id: 'why-cache',
          title: 'Why and where to cache',
          duration: '35 mins',
          items: [
            'Latency and DB-load problems caching solves',
            'What is safe to cache (idempotent reads) vs dangerous (money, auth state)',
            'Measuring first: find the slow, hot query before caching it',
          ],
        },
        {
          id: 'cache-aside',
          title: 'Cache-aside (the default pattern)',
          duration: '55 mins',
          items: [
            'Read: check cache → miss → DB → set cache',
            'Serialization (JSON) and choosing a TTL',
            'Wrapping a repository function with a cache layer',
          ],
        },
        {
          id: 'write-strategies',
          title: 'Write-through & invalidation',
          duration: '55 mins',
          items: [
            'Write-through vs write-around vs write-back',
            'Invalidate on write — the two hard problems in CS, live',
            'Key-versioning and tag-based invalidation strategies',
          ],
        },
        {
          id: 'pitfalls',
          title: 'Stampedes, staleness & correctness',
          duration: '55 mins',
          items: [
            'Cache stampede / thundering herd and how to prevent it (locks, jitter)',
            'Stale reads and acceptable-staleness windows',
            'Cache penetration (caching "not found") and negative caching',
          ],
        },
        {
          id: 'build-118',
          title: 'Build: cache a hot endpoint',
          duration: '45 mins',
          items: [
            'Add cache-aside to a real read endpoint',
            'Measure p95 before/after with a quick benchmark',
            'Verify invalidation on the corresponding write',
          ],
        },
      ],
    },
    {
      id: 'day132',
      title: 'Day 132: Rate Limiting & Sessions',
      duration: '4 hours',
      topics: [
        {
          id: 'why-rate-limit',
          title: 'Why rate limit',
          duration: '35 mins',
          items: [
            'Abuse, brute-force, cost control, fairness',
            'Per-IP vs per-user vs per-API-key limits',
            'Where to enforce (edge, gateway, app) — trade-offs',
          ],
        },
        {
          id: 'algorithms',
          title: 'Rate-limit algorithms with Redis',
          duration: '60 mins',
          items: [
            'Fixed window (simple, bursty at edges)',
            'Sliding window (smoother, more accurate)',
            'Token bucket / leaky bucket (allow controlled bursts)',
            'Atomicity with INCR/EXPIRE or a Lua script',
          ],
        },
        {
          id: 'headers',
          title: 'Responses & UX of limits',
          duration: '35 mins',
          items: [
            '429 Too Many Requests + Retry-After',
            'X-RateLimit-* headers so clients can back off',
            'Graceful client handling',
          ],
        },
        {
          id: 'sessions-locks',
          title: 'Sessions & distributed locks',
          duration: '50 mins',
          items: [
            'Storing sessions/refresh tokens in Redis (fast, revocable)',
            'A basic distributed lock (SET NX PX) and its limits',
            'Why locks are subtle (fencing tokens, clock drift) — named honestly',
          ],
        },
      ],
    },
    {
      id: 'day133',
      title: 'Day 133: Pub/Sub & Real-Time Glue',
      duration: '4 hours',
      topics: [
        {
          id: 'pubsub',
          title: 'Redis pub/sub',
          duration: '50 mins',
          items: [
            'PUBLISH / SUBSCRIBE — fire-and-forget fan-out',
            'No persistence: subscribers offline miss messages',
            'Channels vs pattern subscriptions',
          ],
        },
        {
          id: 'socketio-adapter',
          title: 'Scaling Socket.io with the Redis adapter',
          duration: '55 mins',
          items: [
            'Callback to Phase 11: emits crossing multiple Node instances',
            '@socket.io/redis-adapter under the hood (pub/sub bus)',
            'What still needs shared storage (presence, session)',
          ],
        },
        {
          id: 'streams',
          title: 'When pub/sub is not enough → Streams',
          duration: '40 mins',
          items: [
            'Redis Streams: durable, replayable, consumer groups',
            'Pub/sub vs Streams vs a real queue (BullMQ)',
            'Choosing the right delivery guarantee',
          ],
        },
        {
          id: 'build-120',
          title: 'Build: cross-instance broadcast',
          duration: '35 mins',
          items: [
            'Run two app instances, publish from one, receive on both',
            'Wire the Socket.io Redis adapter locally',
            'Confirm a message reaches a client on the other node',
          ],
        },
      ],
    },
    {
      id: 'day134',
      title: 'Day 134: Background Jobs with BullMQ',
      duration: '5 hours',
      topics: [
        {
          id: 'why-jobs',
          title: 'Why a job queue',
          duration: '40 mins',
          items: [
            'Keep HTTP responses fast (< ~200ms) — offload heavy work',
            'Email, image/video processing, exports, webhooks fan-out',
            'Retries, scheduling, rate limits — for free',
          ],
        },
        {
          id: 'bullmq-core',
          title: 'BullMQ: Queue, Worker, Job',
          duration: '60 mins',
          items: [
            'Redis-backed Queue to add jobs from the API',
            'Worker process consumes jobs (run separately from the web server)',
            'Job data, progress, and return values',
            'Concurrency and per-worker rate limiting',
          ],
        },
        {
          id: 'reliability',
          title: 'Retries, backoff & dead-letter',
          duration: '55 mins',
          items: [
            'attempts + exponential backoff',
            'Failed jobs and inspecting the failed set',
            'Dead-letter handling for poison jobs',
            'Idempotency: assume a job can run twice',
          ],
        },
        {
          id: 'scheduling',
          title: 'Repeatable & delayed jobs',
          duration: '40 mins',
          items: [
            'Cron-style repeatable jobs (digests, cleanups)',
            'Delayed jobs (send in 24h, reminders)',
            'Flow/parent-child jobs for pipelines',
          ],
        },
        {
          id: 'monitoring',
          title: 'Monitoring & operations',
          duration: '35 mins',
          items: [
            'bull-board dashboard for queues',
            'Per-job logging and alerting on failure spikes',
            'Graceful shutdown so in-flight jobs finish',
          ],
        },
      ],
    },
    {
      id: 'day135',
      title: 'Day 135: Project — Batch Geocoding Dispatch Service',
      duration: '4 hours',
      topics: [
        {
          id: 'spec',
          title: 'Spec & baseline',
          duration: '30 mins',
          items: [
            'Pick an existing app with a slow endpoint and heavy work',
            'Measure baseline latency and request time',
          ],
        },
        {
          id: 'cache-layer',
          title: 'Add caching + rate limiting',
          duration: '75 mins',
          items: [
            'Cache-aside on the hottest read, with correct invalidation',
            'Rate-limit the public/auth endpoints',
            'Re-measure and record the improvement',
          ],
        },
        {
          id: 'offload',
          title: 'Offload heavy work to BullMQ',
          duration: '75 mins',
          items: [
            'Move a slow operation (report/export/email) to a worker',
            'Return immediately; notify on completion (socket or poll)',
            'Retries + dead-letter + a bull-board dashboard',
          ],
          project: {
            title: 'Batch Geocoding Dispatch Service — DEPLOYED',
            description: 'Accept address batches from outreach teams, cache normalized lookups, rate-limit tenant imports, queue provider calls and map-bundle generation, retry transient failures safely, and report per-row progress. Use Redis, BullMQ, managed Redis, observability, and before/after latency and provider-call measurements.',
            type: 'capstone',
            features: ['Cache-aside reads with invalidation and a documented cache key strategy.', 'Rate limits that return a useful retry response instead of silently failing.', 'Background report job with retries, dead-letter handling, progress state, and measured latency improvement.'],
            hints: ['Make jobs idempotent before adding retries.', 'Measure one baseline endpoint before claiming a performance win.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Redis data types, TTL, eviction, and ioredis usage',
      'Caching patterns (cache-aside, write-through) + invalidation & stampede control',
      'Rate limiting (fixed/sliding/token-bucket) and Redis sessions',
      'Pub/sub, the Socket.io Redis adapter, and when to use Streams',
      'BullMQ queues/workers with retries, backoff, cron, and dead-letter',
      'Monitoring queues and running workers in production',
    ],
    milestone: 'You can make an app fast and resilient under load — caching hot paths, protecting endpoints, and moving heavy work off the request cycle.',
  },
};
