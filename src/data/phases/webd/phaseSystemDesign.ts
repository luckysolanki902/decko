import { Phase } from '@/types';

export const phaseSystemDesign: Phase = {
  id: 'phase-system-design',
  number: 18,
  title: 'System Design (Optional)',
  subtitle: 'Think in trade-offs. Talk in trade-offs. Survive senior interviews.',
  duration: '10 Days | ~40 Hours',
  days: 'Days 148-157',
  goal: 'Develop the senior reflex of choosing trade-offs consciously: scaling, consistency, caching, queues, partitioning. Walk into a system design interview ready.',
  icon: '🏛️',
  color: 'purple',
  sections: [
    {
      id: 'day148',
      title: 'Day 148: Scalability Mental Models',
      duration: '4 hours',
      topics: [
        {
          id: 'vertical-horizontal',
          title: 'Vertical vs horizontal scaling',
          duration: '40 mins',
          items: [
            'Vertical: bigger box (limit hits hard)',
            'Horizontal: more boxes (needs stateless or sharding)',
            'Most apps: vertical first, horizontal when forced',
          ],
        },
        {
          id: 'stateless',
          title: 'Stateless services',
          duration: '40 mins',
          items: [
            'No session in process memory → in Redis',
            'No file uploads to local disk → S3',
            'Enables auto-scaling + zero-downtime deploys',
          ],
        },
        {
          id: 'load-balancing',
          title: 'Load balancers',
          duration: '50 mins',
          items: [
            'L4 (TCP) vs L7 (HTTP)',
            'Round-robin, least-connections, hash-based',
            'Health checks remove sick instances',
          ],
        },
        {
          id: 'cap',
          title: 'CAP theorem',
          duration: '50 mins',
          items: [
            'Consistency, Availability, Partition tolerance — pick 2',
            'In real systems: CP (Mongo default) or AP (DynamoDB, Cassandra)',
            'PACELC adds latency dimension',
          ],
        },
      ],
    },
    {
      id: 'day149',
      title: 'Day 149: DB Scaling Strategies',
      duration: '4 hours',
      topics: [
        {
          id: 'replication',
          title: 'Replication',
          duration: '50 mins',
          items: [
            'Primary handles writes; replicas serve reads',
            'Sync vs async replication',
            'Replication lag: stale reads',
          ],
        },
        {
          id: 'sharding',
          title: 'Sharding',
          duration: '60 mins',
          items: [
            'Horizontal partitioning by key (user_id, region)',
            'Choose shard key carefully (rebalancing is painful)',
            'Cross-shard queries are hard',
          ],
        },
        {
          id: 'caching',
          title: 'Caching layers',
          duration: '50 mins',
          items: [
            'CDN → app cache → DB',
            'Redis in front of slow queries',
            'Write-through, write-back, cache-aside',
          ],
        },
        {
          id: 'partitioning',
          title: 'Partitioning data',
          duration: '40 mins',
          items: [
            'Time-based (logs, events)',
            'Tenant-based (multi-tenant SaaS)',
            'Cold/hot tiers (archive old data)',
          ],
        },
      ],
    },
    {
      id: 'day150',
      title: 'Day 150: Async Patterns',
      duration: '4 hours',
      topics: [
        {
          id: 'queues-recap',
          title: 'Message queues',
          duration: '50 mins',
          items: [
            'Decouple producer + consumer',
            'Smooths bursts (work piles up, drains)',
            'BullMQ, SQS, RabbitMQ, Kafka — trade-offs',
          ],
        },
        {
          id: 'pubsub',
          title: 'Pub/Sub & event-driven',
          duration: '50 mins',
          items: [
            'Multiple consumers per event',
            'Loose coupling between services',
            'Replay-ability with Kafka/Streams',
          ],
        },
        {
          id: 'idempotency',
          title: 'Idempotency keys',
          duration: '50 mins',
          items: [
            'Stripe-style: client sends key, server dedupes',
            'Critical for retries + at-least-once delivery',
          ],
        },
        {
          id: 'sagas',
          title: 'Sagas & compensation',
          duration: '50 mins',
          items: [
            'Multi-step distributed transactions without 2PC',
            'Each step has a compensating action',
            'Examples: order → reserve stock → charge → ship',
          ],
        },
      ],
    },
    {
      id: 'day151',
      title: 'Day 151: Consistency & Conflicts',
      duration: '4 hours',
      topics: [
        {
          id: 'strong-eventual',
          title: 'Strong vs eventual consistency',
          duration: '50 mins',
          items: [
            'Strong: read-after-write guarantee',
            'Eventual: convergence "eventually"',
            'Per-feature decision (don\'t pick one for the app)',
          ],
        },
        {
          id: 'concurrency',
          title: 'Concurrent updates',
          duration: '60 mins',
          items: [
            'Optimistic concurrency: version field',
            'Pessimistic: SELECT FOR UPDATE / Redis lock',
            'CRDTs for collaborative editing',
          ],
        },
        {
          id: 'distributed-locks',
          title: 'Distributed locks',
          duration: '50 mins',
          items: [
            'Redis SET NX with TTL',
            'Redlock controversy + when to use',
            'Better: avoid needing locks',
          ],
        },
        {
          id: 'event-order',
          title: 'Event ordering',
          duration: '40 mins',
          items: [
            'Single partition guarantees order (Kafka)',
            'Multiple partitions: only per-key order',
            'Logical clocks (Lamport) for ordering across services',
          ],
        },
      ],
    },
    {
      id: 'day152',
      title: 'Day 152: Microservices vs Monolith',
      duration: '4 hours',
      topics: [
        {
          id: 'majestic-monolith',
          title: '"Majestic monolith" first',
          duration: '50 mins',
          items: [
            'One repo, one deploy: less ops, faster iteration',
            'DHH-style: most companies should start here',
            'Modular monolith: clean boundaries within',
          ],
        },
        {
          id: 'when-split',
          title: 'When to split',
          duration: '50 mins',
          items: [
            'Team size forcing parallel ownership',
            'Independent scaling needs (one service is hot)',
            'Different runtimes (ML in Python, web in Node)',
            'Not because "microservices = senior"',
          ],
        },
        {
          id: 'comms',
          title: 'Service-to-service',
          duration: '50 mins',
          items: [
            'HTTP/JSON: simple, ubiquitous',
            'gRPC: typed, fast, streaming',
            'Async: events on a queue (preferred for decoupling)',
          ],
        },
        {
          id: 'pain',
          title: 'The pain you sign up for',
          duration: '40 mins',
          items: [
            'Distributed tracing required',
            'Network failures everywhere',
            'Eventual consistency by default',
            'Deployment + on-call complexity',
          ],
        },
      ],
    },
    {
      id: 'day153',
      title: 'Day 153: Designing APIs at Scale',
      duration: '4 hours',
      topics: [
        {
          id: 'pagination',
          title: 'Pagination at scale',
          duration: '50 mins',
          items: [
            'Cursor-based > offset-based (no SKIP cost)',
            'Stable cursors (sort by id + tiebreaker)',
            'Bidirectional cursors',
          ],
        },
        {
          id: 'graphql-rest',
          title: 'GraphQL vs REST vs tRPC',
          duration: '60 mins',
          items: [
            'REST: ubiquitous, simple, HTTP caching free',
            'GraphQL: single endpoint, client-driven shape',
            'tRPC: typed end-to-end (TS-first stacks)',
            'Default: REST + tRPC for internal, GraphQL when needed',
          ],
        },
        {
          id: 'versioning',
          title: 'API versioning + deprecation',
          duration: '40 mins',
          items: [
            'Additive changes only when possible',
            'Deprecation headers + sunset dates',
            'Communicate to consumers proactively',
          ],
        },
        {
          id: 'rate-limit-fair',
          title: 'Multi-tenant rate limiting',
          duration: '50 mins',
          items: [
            'Per-tenant + per-endpoint',
            'Plan-based quotas (free vs pro)',
            'Soft limits + hard limits',
          ],
        },
      ],
    },
    {
      id: 'day154',
      title: 'Day 154: Case Study — Design Twitter',
      duration: '4 hours',
      topics: [
        {
          id: 'requirements',
          title: 'Clarify requirements',
          duration: '40 mins',
          items: [
            'Tweets, follow, timeline, search, notifications',
            'Scale: 100M DAU, write 5K/s, read 500K/s',
            'Read-heavy → optimize reads',
          ],
        },
        {
          id: 'data-model',
          title: 'Data model',
          duration: '50 mins',
          items: [
            'Tweets, users, follows tables',
            'Timeline storage decision',
          ],
        },
        {
          id: 'fanout',
          title: 'Fan-out on write vs read',
          duration: '60 mins',
          items: [
            'Push (write to all followers\' timelines): fast read, expensive write for celebrities',
            'Pull (compute timeline at read): expensive read',
            'Hybrid: pull for celebs, push for normal users',
          ],
        },
        {
          id: 'storage',
          title: 'Storage choices',
          duration: '50 mins',
          items: [
            'Tweets in Cassandra/DynamoDB (write-scale)',
            'Timelines in Redis (low-latency read)',
            'Search via Elasticsearch',
            'Media in S3 + CloudFront',
          ],
        },
      ],
    },
    {
      id: 'day155',
      title: 'Day 155: Case Study — Design URL Shortener',
      duration: '4 hours',
      topics: [
        {
          id: 'reqs',
          title: 'Requirements + scale',
          duration: '40 mins',
          items: [
            '100M shortens/day, 10B reads/day',
            'Custom alias optional',
            'Analytics on clicks',
          ],
        },
        {
          id: 'id-gen',
          title: 'ID generation',
          duration: '50 mins',
          items: [
            'Counter + base62 → short URL',
            'Snowflake (distributed unique IDs)',
            'Hash-based with collision retry',
          ],
        },
        {
          id: 'storage',
          title: 'Storage + read path',
          duration: '60 mins',
          items: [
            'Key-value store (DynamoDB / Redis)',
            'Cache hot URLs aggressively',
            'CDN for redirect responses',
          ],
        },
        {
          id: 'analytics',
          title: 'Click analytics',
          duration: '50 mins',
          items: [
            'Async: emit event to Kafka, batch-aggregate',
            'Don\'t block redirect on write',
            'OLAP store for queries (ClickHouse)',
          ],
        },
      ],
    },
    {
      id: 'day156',
      title: 'Day 156: Case Study — Design Notion',
      duration: '4 hours',
      topics: [
        {
          id: 'reqs',
          title: 'Requirements',
          duration: '30 mins',
          items: [
            'Workspaces, pages, blocks (nested)',
            'Real-time collaboration',
            'Search, permissions, sharing',
          ],
        },
        {
          id: 'block-model',
          title: 'Block model',
          duration: '60 mins',
          items: [
            'Each block is a row with parent + position',
            'Recursive structure',
            'Optimized for "hydrate page" reads',
          ],
        },
        {
          id: 'realtime',
          title: 'Real-time collab',
          duration: '60 mins',
          items: [
            'CRDT (Yjs) for conflict-free merging',
            'WebSocket per page',
            'Persist on debounce',
          ],
        },
        {
          id: 'search-perms',
          title: 'Search + permissions',
          duration: '50 mins',
          items: [
            'Elasticsearch with permission filter',
            'Permission cache invalidated on share',
            'Public pages cached on CDN',
          ],
        },
      ],
    },
    {
      id: 'day157',
      title: 'Day 157: System Design Interview Practice',
      duration: '4 hours',
      topics: [
        {
          id: 'framework',
          title: 'A 4-step framework',
          duration: '40 mins',
          items: [
            '1. Clarify scope + scale',
            '2. High-level design (boxes + arrows)',
            '3. Drill into 1-2 components',
            '4. Discuss trade-offs + bottlenecks',
          ],
        },
        {
          id: 'common-q',
          title: 'Common questions',
          duration: '40 mins',
          items: [
            'Design Instagram, WhatsApp, Uber, Dropbox',
            'Design rate limiter, ad serving, ride-matching',
            'You won\'t finish — that\'s expected',
          ],
        },
        {
          id: 'trade-offs',
          title: 'Phrases that signal seniority',
          duration: '40 mins',
          items: [
            '"For now I\'d X; if X then Y becomes the bottleneck"',
            '"It depends on …"',
            '"What\'s the read/write ratio?"',
            '"Is this user-facing or batch?"',
          ],
        },
        {
          id: 'practice',
          title: 'Mock — design your completed full-stack app at 10M users',
          duration: '90 mins',
          items: [
            'Where does it break first?',
            'What changes? (cache, replicas, queues, sharding)',
            'Cost estimate',
            'Write it up like a design doc',
          ],
        },
        {
          id: 'capstone',
          title: 'Capstone: Design Doc',
          duration: '50 mins',
          items: [
            'A real design doc for scaling your SaaS to 1M, 10M, 100M users',
            'Architecture diagram per scale tier',
            'Trade-offs explicit',
          ],
          project: {
            title: 'Design Doc — Your SaaS at Scale',
            description: 'Phase 18 capstone (optional). A senior-quality design document. Use it in interviews. Use it as a roadmap.',
            type: 'capstone',
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Reason about scaling: vertical, horizontal, sharding, replication',
      'Pick consistency models per feature',
      'Design for async + idempotency + sagas',
      'Walk through Twitter / URL shortener / Notion designs',
      'Write a senior-quality design doc',
    ],
    milestone: 'Senior interviews stop being scary. You think in trade-offs. End of bootcamp.',
  },
};
