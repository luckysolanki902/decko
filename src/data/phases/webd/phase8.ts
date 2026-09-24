import { Phase } from '@/types';

export const phase8: Phase = {
  id: 'phase8',
  number: 8,
  title: 'Next.js App Router Mastery',
  subtitle: 'The way Next.js wants to be used in 2026',
  duration: '15 Days | ~64 Hours',
  days: 'Days 93-107',
  goal: 'Build a production Next.js app using the App Router fully: server components, server actions, streaming, caching, route handlers, a deliberate rendering strategy, and an E2E test suite — without fighting the framework.',
  icon: '▲',
  color: 'neutral',
  sections: [
    {
      id: 'day93',
      title: 'Day 93: App Router Mental Model',
      duration: '4 hours',
      topics: [
        {
          id: 'rsc',
          title: 'Server Components by default',
          duration: '60 mins',
          items: [
            'Components run on server unless marked "use client"',
            'No JS shipped for server components',
            'Async components: fetch in the component body',
            'Cannot use hooks or onClick in server components',
          ],
        },
        {
          id: 'file-conv',
          title: 'File conventions',
          duration: '60 mins',
          items: [
            'page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx',
            'Route groups (folder): for organization without URL impact',
            'Parallel routes (@slot) and intercepting routes (advanced)',
          ],
        },
        {
          id: 'layouts',
          title: 'Nested layouts',
          duration: '40 mins',
          items: [
            'Layouts wrap children and preserve state on nav',
            'Per-section layouts (e.g., dashboard layout with sidebar)',
            'Templates re-mount on nav (rare use)',
          ],
        },
        {
          id: 'metadata',
          title: 'Metadata API',
          duration: '40 mins',
          items: [
            'export const metadata: Metadata = { ... }',
            'generateMetadata for dynamic',
            'Open Graph + Twitter cards from one config',
          ],
        },
      ],
    },
    {
      id: 'day94',
      title: 'Day 94: Server vs Client Components',
      duration: '4 hours',
      topics: [
        {
          id: 'when-client',
          title: 'When you need "use client"',
          duration: '50 mins',
          items: [
            'useState, useEffect, onClick, onChange',
            'Browser APIs (window, localStorage)',
            'Third-party client libs',
            'Push the boundary as deep as possible',
          ],
        },
        {
          id: 'composition',
          title: 'Composition pattern',
          duration: '60 mins',
          items: [
            'Pass server components as children to client components',
            'Server fetches data, client adds interactivity',
            'Avoid bundling server-only code into client',
          ],
        },
        {
          id: 'serialization',
          title: 'Props serialization',
          duration: '40 mins',
          items: [
            'Props from server → client must be serializable',
            'No functions, classes, dates auto-serialize as ISO',
            'Error messages tell you when you cross the line',
          ],
        },
        {
          id: 'data-libs',
          title: 'TanStack Query in App Router',
          duration: '50 mins',
          items: [
            'Provider must be in client component',
            'Hydrate from server-fetched data with HydrationBoundary',
            'Mostly: prefetch on server, useQuery on client',
          ],
        },
      ],
    },
    {
      id: 'day95',
      title: 'Day 95: Data Fetching on the Server',
      duration: '4 hours',
      topics: [
        {
          id: 'fetch-rsc',
          title: 'fetch in async server components',
          duration: '50 mins',
          items: [
            'Just call await fetch() in a server component',
            'Caching is opt-in in Next 15+ (more on Day 96)',
            'Parallel fetches via Promise.all to avoid waterfalls',
          ],
        },
        {
          id: 'db-direct',
          title: 'Calling DB directly (Drizzle or Mongo)',
          duration: '50 mins',
          items: [
            'Server components can talk to Drizzle/Mongoose directly',
            'No /api round-trip needed',
            'Keep secrets on server (don\'t import DB client in "use client")',
            'A singleton db/Mongo client to survive hot reload',
          ],
        },
        {
          id: 'streaming',
          title: 'Streaming with Suspense',
          duration: '60 mins',
          items: [
            '<Suspense fallback={<Skeleton/>}> wraps slow fetches',
            'loading.tsx is a built-in route-level Suspense',
            'Stream data in chunks; user sees shell instantly',
          ],
        },
        {
          id: 'errors',
          title: 'error.tsx + not-found',
          duration: '40 mins',
          items: [
            'error.tsx must be a client component, takes reset() prop',
            'notFound() throws and renders not-found.tsx',
            'Per-segment error boundaries',
          ],
        },
      ],
    },
    {
      id: 'day96',
      title: 'Day 96: Caching & Revalidation',
      duration: '4 hours',
      topics: [
        {
          id: 'four-caches',
          title: 'The caching layers in Next.js',
          duration: '60 mins',
          items: [
            'Request memoization (per-request dedupe)',
            'Data cache (persisted fetch/results)',
            'Full route cache (static rendering)',
            'Router cache (client navigation)',
          ],
        },
        {
          id: 'fetch-options',
          title: 'Opting into caching',
          duration: '50 mins',
          items: [
            'Next 15+: fetch is uncached by default — opt in explicitly',
            'cache: "force-cache" vs "no-store"',
            'next: { revalidate: 60 } for time-based ISR',
            'next: { tags: ["posts"] } for tag-based invalidation',
          ],
        },
        {
          id: 'revalidate',
          title: 'revalidatePath / revalidateTag',
          duration: '40 mins',
          items: [
            'Call from server actions or route handlers',
            'Bust the data cache without a redeploy',
            'Tags scale better than paths',
          ],
        },
        {
          id: 'dynamic',
          title: 'Static vs dynamic rendering',
          duration: '50 mins',
          items: [
            'cookies(), headers(), searchParams → dynamic',
            'Otherwise statically rendered at build',
            'export const dynamic = "force-dynamic" if you need it',
            'export const revalidate = 60 for ISR pages',
          ],
        },
      ],
    },
    {
      id: 'day97',
      title: 'Day 97: Rendering Strategies — The Decision Framework',
      duration: '4 hours',
      topics: [
        {
          id: 'the-table',
          title: 'CSR / SSR / SSG / ISR / Streaming — side by side',
          duration: '60 mins',
          items: [
            'The decision table: freshness, TTFB, SEO, server cost, personalization',
            'CSR: SPA islands, dashboards behind auth',
            'SSG: docs, marketing, blogs (build once, serve from CDN)',
            'ISR: mostly-static that changes occasionally (product pages)',
            'SSR/dynamic: per-request personalized or always-fresh',
            'Streaming: fast shell + progressively filled slow data',
          ],
        },
        {
          id: 'ppr-cache-components',
          title: 'PPR & Cache Components (the 2026 direction)',
          duration: '50 mins',
          items: [
            'Partial Prerendering: static shell + dynamic holes in one response',
            '"use cache", cacheLife, cacheTag — the newer explicit caching model',
            'updateTag/revalidateTag to invalidate',
            'Why this replaces older implicit-caching mental models',
          ],
        },
        {
          id: 'choose-per-route',
          title: 'Choosing per route in a real app',
          duration: '40 mins',
          items: [
            'Marketing pages → SSG/ISR; app pages → dynamic/streaming',
            'generateStaticParams for known dynamic segments',
            'The trap: one dynamic API call opting a whole route out of static',
          ],
        },
        {
          id: 'interview-frame',
          title: 'The interview answer',
          duration: '30 mins',
          items: [
            '"When would you SSG vs ISR vs stream?" — answer with the table, not vibes',
            'Tie each choice to a metric (LCP, freshness, cost)',
            'Reuse this alongside the Phase 4 frontend-system-design framing',
          ],
        },
      ],
    },
    {
      id: 'day98',
      title: 'Day 98: Server Actions',
      duration: '4 hours',
      topics: [
        {
          id: 'what',
          title: 'What server actions are',
          duration: '40 mins',
          items: [
            '"use server" functions callable from client',
            'No need for /api endpoints for many mutations',
            'Form action= or imperative call from event handler',
          ],
        },
        {
          id: 'forms',
          title: 'Forms with server actions',
          duration: '50 mins',
          items: [
            '<form action={createPost}> works without JS',
            'useActionState for response/error state',
            'useFormStatus for pending UI',
          ],
        },
        {
          id: 'validate',
          title: 'Validation + auth in actions',
          duration: '50 mins',
          items: [
            'Validate input with Zod inside the action',
            'Check auth + authorization (don\'t trust the client)',
            'revalidatePath/Tag after mutation',
          ],
        },
        {
          id: 'when-action',
          title: 'When to use actions vs route handlers',
          duration: '40 mins',
          items: [
            'Actions: form-y mutations, internal use',
            'Route handlers (/app/api/*/route.ts): public APIs, mobile clients, webhooks',
            'You\'ll often have both',
          ],
        },
        {
          id: 'progressive',
          title: 'Progressive enhancement',
          duration: '40 mins',
          items: [
            'Forms work without JavaScript',
            'Add useTransition for client-side spinners',
            'A pleasingly old-school feel that works',
          ],
        },
      ],
    },
    {
      id: 'day99',
      title: 'Day 99: Route Handlers + Middleware',
      duration: '4 hours',
      topics: [
        {
          id: 'route-handlers',
          title: 'Route handlers',
          duration: '60 mins',
          items: [
            'app/api/x/route.ts exports GET, POST, ...',
            'Same Request/Response Web APIs',
            'JSON body, headers, cookies, searchParams',
          ],
        },
        {
          id: 'webhooks',
          title: 'Webhook handlers',
          duration: '50 mins',
          items: [
            'Verify signatures (Stripe, GitHub)',
            'Idempotency keys',
            'Always 200 quickly, do work in background',
          ],
        },
        {
          id: 'middleware',
          title: 'middleware.ts',
          duration: '50 mins',
          items: [
            'Runs before the request is handled',
            'Auth gate, redirects, rewrites, A/B',
            'matcher config to scope routes',
          ],
        },
        {
          id: 'edge-vs-node',
          title: 'Runtime choice',
          duration: '40 mins',
          items: [
            'Node runtime: full API access — the default you should usually pick',
            'Edge: fast cold start but limited APIs (no fs, no native deps)',
            'Modern Vercel (Fluid Compute) runs Node with low cold starts — reach for edge only with a reason',
          ],
        },
      ],
    },
    {
      id: 'day100',
      title: 'Day 100: Auth in Next.js',
      duration: '4 hours',
      topics: [
        {
          id: 'nextauth-recap',
          title: 'NextAuth recap',
          duration: '40 mins',
          items: [
            'auth() in server components',
            'useSession in client',
            'Middleware for route protection',
          ],
        },
        {
          id: 'session-strategies',
          title: 'JWT vs DB session',
          duration: '40 mins',
          items: [
            'JWT: stateless, easy edge, harder revocation',
            'DB: revocation easy, every request hits DB',
            'For most apps: DB sessions with a Drizzle/Mongo adapter',
          ],
        },
        {
          id: 'protect-everything',
          title: 'Patterns for protected resources',
          duration: '60 mins',
          items: [
            'getCurrentUser() helper in server components',
            'In server actions: assert auth at top',
            'In route handlers: 401 if no session',
          ],
        },
        {
          id: 'multi-tenant',
          title: 'Multi-tenant basics',
          duration: '60 mins',
          items: [
            'Workspace/team model',
            'Every query filtered by workspaceId (the tenant-isolation invariant)',
            'Invite flow with token email',
          ],
        },
      ],
    },
    {
      id: 'day101',
      title: 'Day 101: Forms, Actions, Optimistic',
      duration: '4 hours',
      topics: [
        {
          id: 'rhf-actions',
          title: 'RHF + server actions',
          duration: '60 mins',
          items: [
            'RHF for client validation + UX',
            'Submit handler calls the server action',
            'Show RHF errors + server errors uniformly',
          ],
        },
        {
          id: 'optimistic',
          title: 'useOptimistic',
          duration: '60 mins',
          items: [
            'Built-in optimistic UI primitive',
            'Apply local update immediately, server reconciles',
            'Pair with server action + revalidation',
          ],
        },
        {
          id: 'transitions',
          title: 'useTransition for non-blocking UI',
          duration: '40 mins',
          items: [
            'Wrap action call in startTransition',
            'isPending for spinners',
            'Smooth across slow networks',
          ],
        },
        {
          id: 'errors',
          title: 'Error handling pattern',
          duration: '40 mins',
          items: [
            'Action returns { ok: false, error: { ... } } not throws',
            'Client renders inline',
            'Toast for unexpected errors only',
          ],
        },
      ],
    },
    {
      id: 'day102',
      title: 'Day 102: Images, Fonts, SEO',
      duration: '4 hours',
      topics: [
        {
          id: 'next-image',
          title: 'next/image',
          duration: '50 mins',
          items: [
            'Auto WebP/AVIF, lazy loading, responsive',
            'remotePatterns config for external images (Cloudinary)',
            'Sizes attribute for layout shift prevention',
          ],
        },
        {
          id: 'next-font',
          title: 'next/font',
          duration: '40 mins',
          items: [
            'Self-hosted Google fonts (no FOIT)',
            'Variable fonts',
            'Subsetting for performance',
          ],
        },
        {
          id: 'seo',
          title: 'SEO essentials',
          duration: '50 mins',
          items: [
            'metadata API for title/description/OG/Twitter',
            'sitemap.ts and robots.ts file conventions',
            'Structured data (JSON-LD) for rich results',
          ],
        },
        {
          id: 'analytics',
          title: 'Analytics + monitoring',
          duration: '40 mins',
          items: [
            'Vercel Analytics or Plausible (privacy-friendly)',
            'Web Vitals tracked automatically',
            'Sentry for errors',
          ],
        },
      ],
    },
    {
      id: 'day103',
      title: 'Day 103: Next.js Architecture & Data-boundary Review',
      duration: '5 hours',
      topics: [
        {
          id: 'spec',
          title: 'Spec: a regional grant-review rehearsal',
          duration: '30 mins',
          items: [
            'Workspaces + members + invites',
            'Notes (rich text), tags, attachments (Cloudinary)',
            'Public share links (read-only)',
            'NextAuth (email magic link + Google), Drizzle/Postgres or Mongo',
          ],
        },
        {
          id: 'scaffold',
          title: 'Scaffold + auth',
          duration: '120 mins',
          items: [
            'Next.js + shadcn + Tailwind',
            'NextAuth with your DB adapter',
            'Models for User, Workspace, Membership, Note, Tag',
            'Layouts: marketing, app',
          ],
        },
        {
          id: 'workspace',
          title: 'Workspace creation + switching',
          duration: '150 mins',
          items: [
            'Onboarding: create first workspace on signup',
            'Workspace switcher in header',
            'Server actions for create/rename',
          ],
          project: {
            title: 'Regional Grant Review Shell (rehearsal)',
            description: 'A rehearsal shell with regional workspaces, reviewers, applications, evidence attachments, and shareable decisions. Days 104–107 transfer the framework mechanics into the distinct conservation-permit capstone.',
            type: 'project',
          },
        },
      ],
    },
    {
      id: 'day104',
      title: 'Day 104: Server Actions & Mutation Reliability Lab',
      duration: '5 hours',
      topics: [
        {
          id: 'list',
          title: 'Notes list page',
          duration: '120 mins',
          items: [
            'Server component fetches notes for current workspace',
            'Filter by tag, search by title (debounced)',
            'Streaming with Suspense for the list',
          ],
        },
        {
          id: 'detail',
          title: 'Note detail + editor',
          duration: '120 mins',
          items: [
            'Tiptap-based rich text editor (client component)',
            'Autosave via server action with debouncing',
            'Optimistic title updates',
          ],
        },
        {
          id: 'tags',
          title: 'Tags',
          duration: '60 mins',
          items: [
            'Tag CRUD per workspace',
            'Tag picker in note editor',
            'Tag color choice',
          ],
        },
      ],
    },
    {
      id: 'day105',
      title: 'Day 105: Multi-tenant Authorization Lab',
      duration: '5 hours',
      topics: [
        {
          id: 'members',
          title: 'Members page',
          duration: '90 mins',
          items: [
            'List members of current workspace',
            'Roles: owner, admin, member',
            'Remove member (owner only)',
          ],
        },
        {
          id: 'invites',
          title: 'Invite by email',
          duration: '120 mins',
          items: [
            'Generate invite token',
            'Send via Resend',
            'Accept page checks token, creates membership',
          ],
        },
        {
          id: 'share',
          title: 'Public share links',
          duration: '90 mins',
          items: [
            'Toggle public on a note → returns share URL',
            'Public route (no auth) renders read-only',
            'Revoke regenerates the slug',
          ],
        },
      ],
    },
    {
      id: 'day106',
      title: 'Day 106: Rendering, Cache & E2E Review',
      duration: '5 hours',
      topics: [
        {
          id: 'perf',
          title: 'Performance audit',
          duration: '90 mins',
          items: [
            'Lighthouse run, fix top 5',
            'Replace any bundle-heavy clients with server components',
            'Tag-based revalidation everywhere; deliberate rendering per route (Day 97)',
          ],
        },
        {
          id: 'testing',
          title: 'Testing — Vitest + Playwright',
          duration: '120 mins',
          items: [
            'Unit-test server-action logic + Zod schemas (Vitest)',
            'Playwright E2E: sign in → create workspace → create note → share → open share link',
            'Multi-tenant isolation test: user A cannot read user B\'s workspace',
            'Green suite is your regression net + interview talking point',
          ],
        },
        {
          id: 'errors',
          title: 'Error + empty states + a11y',
          duration: '60 mins',
          items: [
            'error.tsx per major segment; empty states with CTAs',
            'Keyboard nav, focus rings, aria labels; dark mode all the way through',
            'Toast notifications consistent',
          ],
        },
      ],
    },
    {
      id: 'day107',
      title: 'Day 107: Project — Conservation Permit Review Workspace',
      duration: '5 hours',
      topics: [
        {
          id: 'deploy',
          title: 'Vercel deploy',
          duration: '90 mins',
          items: [
            'Production env vars',
            'Atlas/Neon + Cloudinary + Resend wired; migrate deploy if Postgres',
            'Domain optional',
          ],
        },
        {
          id: 'observability',
          title: 'Observability',
          duration: '90 mins',
          items: [
            'Sentry for errors',
            'Vercel Analytics',
            'Custom event for "note created" etc.',
          ],
        },
        {
          id: 'docs',
          title: 'Docs + launch',
          duration: '60 mins',
          items: [
            'README with screenshots, architecture, rendering-strategy notes',
            'Public roadmap (next features you\'d add)',
          ],
        },
        {
          id: 'capstone',
          title: 'Capstone',
          duration: '60 mins',
          items: [
            'A real, multi-tenant Next.js SaaS, deployed',
            'Auth, sharing, uploads, dark mode, fast, tested',
            'You can demo this in any interview',
          ],
          project: {
            title: 'Conservation Permit Review Workspace — DEPLOYED & TESTED',
            description: 'Build a multi-tenant permit workspace in Next.js: regional teams receive habitat-impact applications, annotate evidence attachments, assign review states, request revisions, and publish read-only decision packets. Use App Router, server components/actions, tenant boundaries, deliberate cache rules, Playwright, and observability.',
            type: 'capstone',
            features: ['Workspace-scoped sources, annotations, review states, and read-only share links.', 'Server Components for reads, Server Actions for mutations, and explicit cache invalidation.', 'Tenant-isolation tests, a Playwright critical path, error monitoring, and live deployment.'],
            hints: ['Treat workspaceId as a mandatory server-side boundary on every read and write.', 'Write down which screens must be dynamic before adding caching.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'App Router fluently: RSC, layouts, streaming, caching, revalidation',
      'Choose rendering strategy deliberately (CSR/SSR/SSG/ISR/streaming/PPR)',
      'Server actions for mutations',
      'Route handlers + middleware + runtime choice',
      'NextAuth in production with multi-tenant isolation',
      'next/image, fonts, SEO, sitemap, analytics',
      'Test a Next.js app with Vitest + Playwright',
    ],
    milestone: 'Next.js is a tool you reach for, not fight. Now scale up assets and real-time.',
  },
};
