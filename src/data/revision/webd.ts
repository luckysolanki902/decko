import type { ConceptDef } from './types';

export const webdConcepts: ConceptDef[] = [
  { id: 'html-css-foundations', title: 'HTML & CSS Foundations', summary: 'Semantic structure, accessible content, CSS layout, responsive constraints, Tailwind, and a resilient public-facing interface.', sources: [{ phaseId: 'phase1' }] },
  { id: 'javascript-essentials', title: 'JavaScript Essentials', summary: 'Values, control flow, functions, collections, DOM interactions, asynchronous work, browser storage, and interactive applications.', sources: [{ phaseId: 'phase2' }] },
  { id: 'typescript-web-git', title: 'TypeScript, Web Internals & Git', summary: 'Type-safe programs, browser and network fundamentals, HTTP reasoning, collaborative Git workflows, and recoverable change.', sources: [{ phaseId: 'phase3' }] },
  { id: 'modern-react', title: 'Modern React', summary: 'Components, state snapshots, effects, routing, server data, state architecture, testing, and complete product flows.', sources: [{ phaseId: 'phase4' }] },
  { id: 'node-express-apis', title: 'Node, Express & REST APIs', summary: 'Server runtime fundamentals, API contracts, validation, uploads, errors, rate limits, logging, and backend tests.', sources: [{ phaseId: 'phase5' }] },
  { id: 'mongo-postgres', title: 'MongoDB & Postgres', summary: 'Document and relational modeling, queries, indexes, migrations, relations, transactions, and deliberate database selection.', sources: [{ phaseId: 'phase6' }] },
  { id: 'authentication', title: 'Authentication & Identity', summary: 'Cryptographic foundations, password storage, sessions, JWTs, passwordless flows, OAuth, authorization, and auditability.', sources: [{ phaseId: 'phase7' }] },
  { id: 'nextjs-app-router', title: 'Next.js App Router', summary: 'Server and client boundaries, routing, data mutations, streaming, caching, metadata, route handlers, and rendering strategy.', sources: [{ phaseId: 'phase8' }] },
  { id: 'payments', title: 'Payments with Stripe & Razorpay', summary: 'Checkout, payment intents, subscriptions, webhooks, billing state, refunds, idempotency, and verified fulfillment.', sources: [{ phaseId: 'phase9' }] },
  { id: 'file-storage', title: 'File Storage at Scale', summary: 'Upload boundaries, object storage, transformations, signed URLs, direct uploads, CDN delivery, and file security.', sources: [{ phaseId: 'phase10' }] },
  { id: 'realtime-systems', title: 'Real-Time Systems', summary: 'WebSocket mental models, Socket.io events, acknowledgements, rooms, presence, reconnection, collaboration, and horizontal scale.', sources: [{ phaseId: 'phase11' }] },
  { id: 'testing', title: 'Application Testing', summary: 'Unit, integration, API, and component tests; useful test boundaries; controlled dependencies; coverage; and CI feedback.', sources: [{ phaseId: 'phase12' }] },
  { id: 'redis-jobs', title: 'Redis & Background Jobs', summary: 'Redis data structures, caching, invalidation, rate limiting, pub/sub, durable queues, retries, and failed-job handling.', sources: [{ phaseId: 'phase13' }] },
  { id: 'dns-email', title: 'Domains, DNS & Transactional Email', summary: 'Name resolution, practical DNS records, domain setup, authenticated sending, transactional email flows, and deliverability.', sources: [{ phaseId: 'phase14' }] },
  { id: 'docker-cicd', title: 'Docker & CI/CD', summary: 'Images, layers, containers, Compose, networking, volumes, multi-stage builds, automated checks, and safe deployment pipelines.', sources: [{ phaseId: 'phase15' }] },
  { id: 'aws-infrastructure', title: 'AWS Infrastructure', summary: 'IAM, DNS, object storage, CDNs, virtual servers, Nginx, HTTPS, command-line operations, and production deployment.', sources: [{ phaseId: 'phase16' }] },
  { id: 'gcp-devops', title: 'Google Cloud & DevOps', summary: 'Cloud-portable infrastructure, Cloud Storage, Compute Engine, Cloud Run, Cloud SQL, monitoring, secrets, and infrastructure as code.', sources: [{ phaseId: 'phase17' }] },
];
