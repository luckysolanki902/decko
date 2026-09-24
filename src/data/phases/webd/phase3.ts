import { Phase } from '@/types';

export const phase3: Phase = {
  id: 'phase3',
  number: 3,
  title: 'TypeScript, Web Internals & Git',
  subtitle: 'Type safety, how the web works, git like a teammate',
  duration: '6 Days | ~25 Hours',
  days: 'Days 27-32',
  goal: 'Read TypeScript fluently, understand what actually happens when you visit a URL, and use git like a senior would expect.',
  icon: '🔷',
  color: 'cyan',
  sections: [
    {
      id: 'day27',
      title: 'Day 27: TypeScript Fundamentals',
      duration: '4 hours',
      topics: [
        {
          id: 'why-ts',
          title: 'Why TypeScript',
          duration: '20 mins',
          items: [
            'Compile-time safety, refactor superpower, IDE autocomplete',
            'Cost: a small upfront friction, huge long-term ROI',
            'Setup: npm install -D typescript && npx tsc --init',
            'Always strict: true',
          ],
        },
        {
          id: 'primitives-arrays',
          title: 'Primitives, arrays, tuples',
          duration: '50 mins',
          items: [
            'string, number, boolean, null, undefined, bigint, symbol',
            'Arrays: number[] vs Array<number>',
            'Tuples: [string, number] for fixed shapes',
            'any (avoid), unknown (preferred for unknown), never (impossible)',
          ],
        },
        {
          id: 'inference',
          title: 'Type inference',
          duration: '40 mins',
          items: [
            'Let TS infer; annotate at boundaries',
            'Hover in VS Code to see inferred types',
            'When to annotate explicitly (function params, public APIs)',
          ],
        },
        {
          id: 'functions-ts',
          title: 'Function types',
          duration: '50 mins',
          items: [
            'Parameter types + return type',
            'Optional params (name?: string)',
            'Default params + inference',
            'Function signatures: type Add = (a: number, b: number) => number',
          ],
        },
        {
          id: 'practice',
          title: 'Practice',
          duration: '40 mins',
          items: [
            'Convert a Day 24 module to TS',
            'Fix the errors strict mode gives you',
            'No anys allowed',
          ],
        },
      ],
    },
    {
      id: 'day28',
      title: 'Day 28: Interfaces, Types, Generics',
      duration: '4 hours',
      topics: [
        {
          id: 'interface-vs-type',
          title: 'interface vs type',
          duration: '30 mins',
          items: [
            'Both describe object shapes',
            'interface for objects you might extend',
            'type for unions, primitives, computed types',
            'When in doubt, type',
          ],
        },
        {
          id: 'unions-narrowing',
          title: 'Unions, intersections, narrowing',
          duration: '50 mins',
          items: [
            'Union: string | number',
            'Intersection: A & B',
            'Literal types: "GET" | "POST"',
            'Narrowing with typeof, in, instanceof, discriminated unions',
          ],
        },
        {
          id: 'generics',
          title: 'Generics',
          duration: '60 mins',
          items: [
            'function identity<T>(x: T): T { return x }',
            'Constraints: <T extends { id: string }>',
            'Multiple type params',
            'Default type params',
          ],
        },
        {
          id: 'utility-types',
          title: 'Utility types you\'ll use forever',
          duration: '40 mins',
          items: [
            'Partial<T>, Required<T>, Readonly<T>',
            'Pick<T, K>, Omit<T, K>',
            'Record<K, V>',
            'ReturnType<typeof fn>, Awaited<T>',
          ],
        },
        {
          id: 'mini-fetch',
          title: 'Mini build: typed fetch',
          duration: '20 mins',
          items: [
            'apiGet<T>(url: string): Promise<T>',
            'Use it for a public earthquake-feed endpoint',
            'Define the response type',
          ],
          project: {
            title: 'Typed Earthquake Feed Boundary',
            description: 'Build a reusable apiGet<T>(url) boundary, define the uncertain earthquake-feed response separately from the normalized event model, and render typed magnitude/location results without assertions leaking into the UI.',
            type: 'mini',
          },
        },
      ],
    },
    {
      id: 'day29',
      title: 'Day 29: How the Web Actually Works',
      duration: '4 hours',
      topics: [
        {
          id: 'dns-tcp-tls',
          title: 'From URL to bytes',
          duration: '50 mins',
          items: [
            'DNS: domain → IP',
            'TCP: connection setup (3-way handshake)',
            'TLS: encrypted channel (handshake basics)',
            'HTTP: the request/response cycle',
          ],
        },
        {
          id: 'http',
          title: 'HTTP essentials',
          duration: '50 mins',
          items: [
            'Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
            'Status codes: 200/201/204/301/302/400/401/403/404/409/422/500/503',
            'Headers: Content-Type, Authorization, Cookie, CORS headers',
            'REST conventions: nouns, plurals, hierarchy',
          ],
        },
        {
          id: 'render-pipeline',
          title: 'Browser internals',
          duration: '40 mins',
          items: [
            'Parse HTML → DOM, CSS → CSSOM',
            'Render tree → layout → paint → composite',
            'What blocks: synchronous JS, render-blocking CSS',
            'defer vs async on <script>',
          ],
        },
        {
          id: 'cookies-storage',
          title: 'Cookies vs localStorage vs sessionStorage',
          duration: '40 mins',
          items: [
            'Cookies: sent with every request to that domain',
            'httpOnly cookies inaccessible to JS (key for auth)',
            'localStorage: 5–10MB, no auto-send',
            'sessionStorage: per-tab, cleared on close',
          ],
        },
        {
          id: 'cors',
          title: 'Same-origin & CORS',
          duration: '20 mins',
          items: [
            'Origin = scheme + host + port',
            'Browser blocks cross-origin requests by default',
            'Server opts in via Access-Control-Allow-Origin',
            'Preflight OPTIONS for non-simple requests',
          ],
        },
      ],
    },
    {
      id: 'day30',
      title: 'Day 30: Git Like a Senior',
      duration: '4 hours',
      topics: [
        {
          id: 'basics',
          title: 'Git basics (recap if needed)',
          duration: '30 mins',
          items: [
            'init, clone, status, add, commit, push, pull',
            'Working tree → staging → repo mental model',
            'Inspecting history: log, log --oneline --graph',
          ],
        },
        {
          id: 'branching',
          title: 'Branching strategy',
          duration: '40 mins',
          items: [
            'main = always deployable',
            'feature/* short-lived branches',
            'switch -c feature/x; later: switch main && merge feature/x',
            'Delete merged branches (clean repo)',
          ],
        },
        {
          id: 'merge-rebase',
          title: 'Merge vs rebase',
          duration: '50 mins',
          items: [
            'Merge: preserves history, makes a merge commit',
            'Rebase: rewrites your branch on top of latest main',
            'Rebase before pushing; never rebase shared branches',
            'Interactive rebase: rebase -i HEAD~5 for cleanup',
          ],
        },
        {
          id: 'conflicts',
          title: 'Resolving conflicts without panic',
          duration: '40 mins',
          items: [
            'Read the markers <<<<<<<, =======, >>>>>>>',
            'Open both versions side-by-side in VS Code',
            'After fix: git add → git rebase --continue (or commit if merging)',
            'When stuck: git rebase --abort and try again',
          ],
        },
        {
          id: 'utilities',
          title: 'Daily utilities',
          duration: '40 mins',
          items: [
            '.gitignore + gitignore.io',
            'git stash / stash pop',
            'git restore <file> to undo unstaged changes',
            'git switch / git switch -c (modern alternatives to checkout)',
          ],
        },
        {
          id: 'commits',
          title: 'Writing commit messages future-you can read',
          duration: '20 mins',
          items: [
            'Imperative subject ≤ 50 chars: "Add login form"',
            'Optional body explaining why, not what',
            'Conventional commits format (feat:, fix:, chore:)',
          ],
        },
      ],
    },
    {
      id: 'day31',
      title: 'Day 31: PRs, Reviews, GitHub',
      duration: '4 hours',
      topics: [
        {
          id: 'fork-pr',
          title: 'Forking & opening a PR',
          duration: '40 mins',
          items: [
            'Fork → clone → branch → push → open PR',
            'PR title + description template',
            'Linking issues with "Closes #123"',
            'Self-review before requesting review',
          ],
        },
        {
          id: 'review',
          title: 'Code review etiquette',
          duration: '40 mins',
          items: [
            'Review: critique code, not the person',
            'Author: don\'t take feedback personally',
            'Use suggestion blocks for tiny fixes',
            'Approve, request changes, or comment',
          ],
        },
        {
          id: 'gh-tools',
          title: 'GitHub Issues, projects, milestones',
          duration: '40 mins',
          items: [
            'Issue templates',
            'Labels: bug / enhancement / docs / good first issue',
            'Project boards (kanban)',
            'Milestones for shipping a version',
          ],
        },
        {
          id: 'merge-strategies',
          title: 'Merge strategies',
          duration: '30 mins',
          items: [
            'Squash and merge (most common for feature branches)',
            'Rebase and merge (clean linear history)',
            'Merge commit (preserves topology)',
            'Pick one and document it for the team',
          ],
        },
        {
          id: 'gh-actions-intro',
          title: 'GitHub Actions intro',
          duration: '50 mins',
          items: [
            'Workflows live in .github/workflows/',
            'Triggers: push, pull_request',
            'A simple CI: install + lint + test on every PR',
            'Status checks blocking merge',
          ],
        },
      ],
    },
    {
      id: 'day32',
      title: 'Day 32: Mini Project — Typed Air-Quality Advisory',
      duration: '5 hours',
      topics: [
        {
          id: 'spec',
          title: 'Spec',
          duration: '20 mins',
          items: [
            'Start from a deliberately untyped air-quality response fixture',
            'Rewrite in TypeScript with Vite',
            'Type the open-meteo response (use the actual schema)',
            'Strict mode on; zero any',
          ],
        },
        {
          id: 'build',
          title: 'Build',
          duration: '3 hours',
          items: [
            'npm create vite@latest air-quality-advisory -- --template vanilla-ts',
            'Move state and helpers to typed modules',
            'Fix every TS error properly (don\'t suppress)',
          ],
          project: {
            title: 'Typed Air-Quality Advisory',
            description: 'A strict TypeScript advisory that normalizes station readings, represents missing measurements honestly, and explains health bands without any unchecked API assumptions or `any`.',
            type: 'project',
          },
        },
        {
          id: 'pr-flow',
          title: 'Real PR workflow',
          duration: '90 mins',
          items: [
            'Open it as a PR against your own repo',
            'Write a real PR description with screenshots',
            'Self-review the diff line by line',
            'Squash-merge to main',
            'Tag a release v1.0.0',
          ],
          project: {
            title: 'Phase 3 Checkpoint',
            description: 'The Typed Air-Quality Advisory ships through a real issue, branch, review, squash, and release workflow. You can defend its types, trace its network request, and contribute without rewriting history.',
            type: 'capstone',
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Read & write modern TypeScript with strict mode',
      'Explain DNS → TCP → TLS → HTTP → render',
      'Confident git branching, merging, rebasing, conflict resolution',
      'Real PR + code review workflow',
      'Basic GitHub Actions CI',
    ],
    milestone: 'You can join an open-source project or a real team without git/TS friction.',
  },
};
