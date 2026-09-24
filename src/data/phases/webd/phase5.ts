import { Phase } from '@/types';

export const phase5: Phase = {
  id: 'phase5',
  number: 5,
  title: 'Node + Express + REST APIs',
  subtitle: 'Build production-shaped backends',
  duration: '12 Days | ~52 Hours',
  days: 'Days 52-63',
  goal: 'Build a production-shaped REST API with validation, file uploads, caching, rate limiting, structured logging, proper error handling — and both manual (Postman) and automated (Vitest + Supertest) tests.',
  icon: '🟢',
  color: 'green',
  sections: [
    {
      id: 'day52',
      title: 'Day 52: Node, Modules, Package Managers',
      duration: '4 hours',
      topics: [
        {
          id: 'runtime',
          title: 'Node runtime',
          duration: '40 mins',
          items: [
            'V8 + libuv + event loop (backend lens)',
            'Single-threaded JS, multi-threaded I/O',
            'process, globals, the standard library',
          ],
        },
        {
          id: 'esm-vs-cjs',
          title: 'ESM vs CommonJS',
          duration: '40 mins',
          items: [
            'package.json "type": "module" for ESM',
            'import / export, top-level await',
            'When you\'ll still see require',
          ],
        },
        {
          id: 'package-json',
          title: 'package.json deep dive',
          duration: '40 mins',
          items: [
            'name, version (semver), type, exports',
            'dependencies vs devDependencies vs peerDependencies',
            'engines field',
            'scripts (npm run, predefined names)',
          ],
        },
        {
          id: 'npm',
          title: 'npm vs yarn',
          duration: '40 mins',
          items: [
            'npm ships with Node and is the course standard',
            'Yarn is fine on other teams; use one manager and commit its lockfile',
            'npm install / uninstall',
            'lockfiles never go in .gitignore',
          ],
        },
        {
          id: 'stdlib',
          title: 'Standard library tour',
          duration: '40 mins',
          items: [
            'fs/promises (readFile, writeFile, readdir)',
            'path (join, resolve, basename, extname)',
            'url, os, crypto basics',
          ],
        },
      ],
    },
    {
      id: 'day53',
      title: 'Day 53: Env, CLI, Dev Loops',
      duration: '4 hours',
      topics: [
        {
          id: 'env',
          title: 'Environment variables',
          duration: '50 mins',
          items: [
            'process.env',
            'dotenv for local .env files',
            '.env, .env.local, .env.example',
            'Never commit secrets — .gitignore .env',
            'Validate env at boot with Zod',
          ],
        },
        {
          id: 'cli',
          title: 'A tiny CLI',
          duration: '50 mins',
          items: [
            'Read process.argv',
            'commander.js for ergonomic CLIs',
            'Build a "wc-clone" that counts lines/words/chars',
          ],
        },
        {
          id: 'devtools',
          title: 'Dev loops',
          duration: '40 mins',
          items: [
            'tsx for running TS directly',
            'tsx watch for restart-on-save',
            'nodemon (the older alternative)',
          ],
        },
        {
          id: 'project-shape',
          title: 'Project scaffold',
          duration: '40 mins',
          items: [
            'src/, dist/, tsconfig for Node + ESM',
            'tsconfig: target ES2022, module NodeNext, moduleResolution NodeNext',
            'Build script + start script',
          ],
        },
      ],
    },
    {
      id: 'day54',
      title: 'Day 54: Express Basics',
      duration: '4 hours',
      topics: [
        {
          id: 'raw-http',
          title: 'HTTP without a framework (10 lines)',
          duration: '30 mins',
          items: [
            'node:http createServer',
            'See req.method, req.url, req.headers',
            'res.writeHead, res.end',
            'Just enough to appreciate Express',
          ],
        },
        {
          id: 'express',
          title: 'Express app',
          duration: '50 mins',
          items: [
            'npm install express @types/express',
            'app.get / post / put / patch / delete',
            'Route params: /users/:id',
            'Query strings: req.query',
            'app.listen(port)',
          ],
        },
        {
          id: 'req-res',
          title: 'req & res essentials',
          duration: '40 mins',
          items: [
            'req.params, req.query, req.body, req.headers',
            'res.json, res.status, res.send, res.redirect',
            'Chain status: res.status(201).json(data)',
          ],
        },
        {
          id: 'static-json',
          title: 'JSON & static files',
          duration: '40 mins',
          items: [
            'app.use(express.json()) for JSON bodies',
            'express.static for serving files',
            'A first /health endpoint',
          ],
        },
        {
          id: 'status-codes',
          title: 'Pick the right status code',
          duration: '20 mins',
          items: [
            '200 OK, 201 Created, 204 No Content',
            '400 Bad Request, 401/403, 404 Not Found',
            '409 Conflict, 422 Unprocessable, 429 Too Many',
            '500 Internal — memorize ~10, look up the rest',
          ],
        },
      ],
    },
    {
      id: 'day55',
      title: 'Day 55: Middleware & Error Handling',
      duration: '4 hours',
      topics: [
        {
          id: 'mw',
          title: 'The middleware contract',
          duration: '40 mins',
          items: [
            '(req, res, next) signature',
            'Call next() to continue, send response to short-circuit',
            'Order of app.use matters',
          ],
        },
        {
          id: 'builtin-mw',
          title: 'Built-in / standard middleware',
          duration: '40 mins',
          items: [
            'express.json, express.urlencoded',
            'cors',
            'morgan or pino-http for request logs',
          ],
        },
        {
          id: 'async-errors',
          title: 'Async error handling',
          duration: '50 mins',
          items: [
            'Express 5 catches async errors automatically',
            'In Express 4 use express-async-errors or wrap handlers',
            'Centralized error middleware: (err, req, res, next)',
            'Consistent error JSON shape',
          ],
        },
        {
          id: 'custom-mw',
          title: 'Writing your own middleware',
          duration: '50 mins',
          items: [
            'requestId middleware (uuid)',
            'requireAuth stub middleware (real one Phase 7)',
            'logger middleware',
          ],
        },
      ],
    },
    {
      id: 'day56',
      title: 'Day 56: REST API Design',
      duration: '4 hours',
      topics: [
        {
          id: 'resources',
          title: 'Resource modeling',
          duration: '45 mins',
          items: [
            'Nouns, plural: /users, /notes',
            'Hierarchy: /users/:id/notes',
            'Avoid verbs in URLs (use HTTP methods)',
          ],
        },
        {
          id: 'verbs-status',
          title: 'Verbs to status code matrix',
          duration: '40 mins',
          items: [
            'POST → 201 + Location header',
            'GET → 200 or 404',
            'PUT/PATCH → 200 or 204',
            'DELETE → 204',
            'Idempotency: which verbs are safe to retry',
          ],
        },
        {
          id: 'pagination',
          title: 'Pagination, filtering, sorting',
          duration: '45 mins',
          items: [
            'Page + limit OR cursor-based',
            'Filtering: /notes?tag=urgent',
            'Sorting: /notes?sort=-createdAt',
            'Always return total count + next page hint',
          ],
        },
        {
          id: 'caching',
          title: 'HTTP caching & conditional requests',
          duration: '35 mins',
          items: [
            'Cache-Control: max-age, no-store, private vs public',
            'ETag + If-None-Match → 304 Not Modified (save bandwidth)',
            'Last-Modified + If-Modified-Since',
            'Where a CDN/edge cache fits vs app cache (Redis later, Phase 13)',
          ],
        },
        {
          id: 'versioning',
          title: 'API versioning',
          duration: '35 mins',
          items: [
            'URL: /v1/notes (most common)',
            'Header: Accept-Version',
            'Pick one and document it',
          ],
        },
      ],
    },
    {
      id: 'day57',
      title: 'Day 57: Validation with Zod',
      duration: '4 hours',
      topics: [
        {
          id: 'why-runtime',
          title: 'Why runtime validation',
          duration: '30 mins',
          items: [
            'TS only protects compile-time',
            'Network input is always untrusted',
            'Validate body, params, query, headers',
          ],
        },
        {
          id: 'schemas',
          title: 'Zod schemas',
          duration: '50 mins',
          items: [
            'z.object, z.string, z.number, z.array',
            'Refinements: .min, .max, .email, .uuid',
            '.transform for parsing query strings',
            '.coerce for "string-to-number" body fields',
          ],
        },
        {
          id: 'middleware',
          title: 'validate(schema) middleware',
          duration: '50 mins',
          items: [
            'Reusable middleware: validate({ body?, params?, query? })',
            'Returns 422 with field errors',
            'Stores parsed result on req.validated',
          ],
        },
        {
          id: 'typed-handlers',
          title: 'Type-safe handlers',
          duration: '50 mins',
          items: [
            'z.infer<typeof schema>',
            'Single source of truth for shape + validation',
            'Share schemas with the frontend later',
          ],
        },
      ],
    },
    {
      id: 'day58',
      title: 'Day 58: File Uploads',
      duration: '4 hours',
      topics: [
        {
          id: 'multipart',
          title: 'multipart/form-data',
          duration: '40 mins',
          items: [
            'Why JSON can\'t carry files',
            'Boundary-encoded body',
            'Browser sends via <form enctype> or FormData',
          ],
        },
        {
          id: 'multer',
          title: 'Multer',
          duration: '50 mins',
          items: [
            'npm install multer',
            'Memory storage vs disk storage',
            'upload.single / array / fields',
            'File limits: size, count',
          ],
        },
        {
          id: 'cloudinary-server',
          title: 'Server-side Cloudinary upload',
          duration: '50 mins',
          items: [
            'cloudinary.v2.uploader.upload_stream',
            'Pipe Multer buffer → Cloudinary',
            'Store the secure_url in DB only',
            'Folder + public_id naming convention',
          ],
        },
        {
          id: 'validation',
          title: 'Validation & limits',
          duration: '40 mins',
          items: [
            'Whitelist MIME types (don\'t trust extension)',
            'Magic-byte sniff for real safety (file-type)',
            'Max size; reject early',
          ],
        },
      ],
    },
    {
      id: 'day59',
      title: 'Day 59: Security Baseline',
      duration: '4 hours',
      topics: [
        {
          id: 'helmet-cors',
          title: 'helmet + CORS configured properly',
          duration: '40 mins',
          items: [
            'helmet() sets sensible default headers',
            'cors({ origin: ["https://app.x.com"], credentials: true })',
            'Never origin: "*" with credentials',
          ],
        },
        {
          id: 'rate-limit',
          title: 'Rate limiting',
          duration: '50 mins',
          items: [
            'express-rate-limit middleware',
            'Per IP for anonymous, per user for authed',
            'Strict limits on auth routes (brute force)',
            'Store in memory now, Redis in Phase 13',
          ],
        },
        {
          id: 'injection',
          title: 'Injection prevention',
          duration: '40 mins',
          items: [
            'Never string-concat queries',
            'NoSQL injection in Mongo (preview)',
            'SQL injection & why parameterized queries / ORMs prevent it (Phase 6 Postgres)',
            'Sanitize inputs that hit your DB',
          ],
        },
        {
          id: 'env-discipline',
          title: '.env discipline + secrets rotation',
          duration: '30 mins',
          items: [
            '.env never in git',
            '.env.example committed (with placeholders)',
            'Rotate secrets if leaked',
          ],
        },
        {
          id: 'owasp',
          title: 'OWASP top 10 quick map',
          duration: '40 mins',
          items: [
            'Broken access control (IDOR)',
            'Crypto failures',
            'Injection',
            'Just enough to know what to look up',
          ],
        },
      ],
    },
    {
      id: 'day60',
      title: 'Day 60: Structured Logging — Pino',
      duration: '4 hours',
      topics: [
        {
          id: 'why-structured',
          title: 'Why structured logs',
          duration: '40 mins',
          items: [
            'console.log is for tutorials',
            'JSON logs are searchable, aggregatable',
            'Levels: trace/debug/info/warn/error/fatal',
          ],
        },
        {
          id: 'pino',
          title: 'Pino setup',
          duration: '50 mins',
          items: [
            'npm install pino pino-http pino-pretty',
            'Single shared logger module',
            'pino-pretty in dev only',
          ],
        },
        {
          id: 'request-logs',
          title: 'Request logging + correlation IDs',
          duration: '50 mins',
          items: [
            'pino-http middleware',
            'requestId via header X-Request-Id (or generate)',
            'Attach to req.log for child loggers',
          ],
        },
        {
          id: 'where-logs',
          title: 'Where logs go in production',
          duration: '40 mins',
          items: [
            'Hosting: Railway, Render, Fly stream stdout',
            'Log shippers: Better Stack (Logtail), Datadog, Axiom',
            'Wire these into your next production project',
          ],
        },
      ],
    },
    {
      id: 'day61',
      title: 'Day 61: API Testing — Manual + Automated',
      duration: '4 hours',
      topics: [
        {
          id: 'tools',
          title: 'Manual: Postman / Thunder / httpie',
          duration: '35 mins',
          items: [
            'Postman: full-featured, share-friendly',
            'Thunder Client: lives in VS Code',
            'httpie: terminal-native, scriptable',
            'One collection per project, folder per resource, commit the JSON',
          ],
        },
        {
          id: 'postman-tests',
          title: 'Test scripts + collection runs',
          duration: '35 mins',
          items: [
            'pm.test("status is 200", ...)',
            'Chain requests via env vars (login → save token)',
            'Run the whole collection headless (Newman CLI)',
            'baseUrl/token variables per environment',
          ],
        },
        {
          id: 'vitest-supertest',
          title: 'Automated: Vitest + Supertest',
          duration: '70 mins',
          items: [
            'Export the Express app (don\'t listen) so tests can import it',
            'supertest: await request(app).post("/notes").send({...}).expect(201)',
            'Assert status, body shape, and headers',
            'Test the unhappy paths: 422 on bad input, 404 on missing, 401 unauthorized',
            'Group with describe/it; run with npm run test',
          ],
        },
        {
          id: 'test-db',
          title: 'Isolating tests from real services',
          duration: '40 mins',
          items: [
            'In-memory / ephemeral store or a throwaway test DB',
            'beforeEach reset so tests don\'t leak state',
            'Mock Cloudinary/email so tests are hermetic',
            'What belongs in CI vs local (Phase 15 wires the pipeline)',
          ],
        },
      ],
    },
    {
      id: 'day62',
      title: 'Day 62: Production API Design Review',
      duration: '5 hours',
      topics: [
        {
          id: 'spec',
          title: 'Spec',
          duration: '20 mins',
          items: [
            'POST /notes, GET /notes (paginated + search), GET /:id, PATCH /:id, DELETE /:id',
            'POST /notes/:id/attachment (Cloudinary)',
            'Zod validation, helmet, CORS, rate limit on writes',
            'ETag on GET /:id, Pino logs, request IDs',
            'In-memory store for now (Mongo & Postgres land Phase 6)',
          ],
        },
        {
          id: 'scaffold',
          title: 'Scaffold + base middleware',
          duration: '90 mins',
          items: [
            'Project structure: src/routes, src/middleware, src/services',
            'helmet, cors, json, pino-http wired',
            'Error handler middleware ready',
          ],
        },
        {
          id: 'crud',
          title: 'CRUD endpoints',
          duration: '110 mins',
          items: [
            'In-memory Map<string, Note>',
            'Each endpoint with Zod validation',
            'Pagination + simple title search',
          ],
          project: {
            title: 'Museum Collection API (rehearsal)',
            description: 'Production-shaped Express rehearsal build. Zod-validated, rate-limited, cached, logged, and structured for attachment uploads. Day 63 transfers the architecture to the different users, resources, states, and disclosure rules of food-safety inspections.',
            type: 'project',
          },
        },
      ],
    },
    {
      id: 'day63',
      title: 'Day 63: Project — Food-Safety Inspection API',
      duration: '5 hours',
      topics: [
        {
          id: 'attachments',
          title: 'Attachment endpoint',
          duration: '75 mins',
          items: [
            'Multer + Cloudinary',
            'Size limit 5MB, image MIME whitelist',
            'Update incident record with attachment URL',
          ],
        },
        {
          id: 'errors',
          title: 'Centralized errors + consistent shape',
          duration: '55 mins',
          items: [
            'AppError class with statusCode + code',
            'Error middleware emits { error: { code, message, details } }',
            'Map Zod errors → 422 with field list',
          ],
        },
        {
          id: 'test-suite',
          title: 'Automated test suite',
          duration: '75 mins',
          items: [
            'Vitest + Supertest across every endpoint',
            'Happy path + 422 + 404 + rate-limit (429)',
            'Green suite before you deploy — your regression net',
          ],
        },
        {
          id: 'deploy',
          title: 'Docs + deploy to Render/Railway',
          duration: '75 mins',
          items: [
            'README with cURL examples; Postman collection under /docs',
            'Set env vars in dashboard',
            'Smoke test from Postman against production',
          ],
          project: {
            title: 'Food-Safety Inspection API — DEPLOYED & TESTED',
            description: 'Build an API for registering establishments, recording checklist findings and evidence, and moving inspections through explicit review states. Use Node, Express, TypeScript, Zod, Pino, and Vitest/Supertest; expose separate public/internal views, structured audit events, rate limits, and OpenAPI-backed documentation.',
            type: 'capstone',
            features: ['Public incident feed with severity, affected service, timeline entries, and clear status transitions.', 'Internal authenticated update endpoint with Zod validation, request IDs, structured logs, and rate limits.', 'OpenAPI documentation, integration tests, and a deployed health endpoint.'],
            hints: ['Model status transitions explicitly: investigating → identified → monitoring → resolved.', 'Keep public and internal response shapes separate; never expose internal notes in the public feed.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Express + TypeScript with proper middleware patterns',
      'REST API design: status codes, pagination, caching (ETag/Cache-Control), versioning',
      'Zod validation everywhere',
      'File uploads via Multer + Cloudinary',
      'Helmet, CORS, rate limiting, OWASP awareness',
      'Pino structured logs with request IDs',
      'Manual (Postman/Newman) AND automated (Vitest + Supertest) API tests',
    ],
    milestone: 'You can ship a real, tested API to production. Time to give it a database — two of them.',
  },
};
