import { Phase } from '@/types';

export const phase15: Phase = {
  id: 'phase15',
  number: 15,
  title: 'Docker & CI/CD (GitHub Actions)',
  subtitle: 'Containerize confidently, then automate test → build → deploy on every push',
  duration: '8 Days | ~36 Hours',
  days: 'Days 140-147',
  goal: 'Understand containers deeply — images, layers, multi-stage builds, Compose, networking, volumes — then build GitHub Actions pipelines that lint, test, build images, and deploy automatically and safely.',
  icon: '🐳',
  color: 'blue',
  sections: [
    {
      id: 'day140',
      title: 'Day 140: Docker Mental Model & Fundamentals',
      duration: '4 hours',
      topics: [
        {
          id: 'why-docker',
          title: 'The problem Docker solves',
          duration: '40 mins',
          items: [
            '"Works on my machine" and dependency/OS drift',
            'Containers vs virtual machines (shared kernel, not a full OS)',
            'Images (blueprint) vs containers (running instance)',
            'The container lifecycle: create, start, stop, remove',
          ],
        },
        {
          id: 'images-layers',
          title: 'Images, layers & registries',
          duration: '50 mins',
          items: [
            'Layers and the copy-on-write filesystem',
            'Image tags and digests (why :latest is dangerous)',
            'Registries: Docker Hub, GHCR — pull/push model',
            'Inspecting an image (docker image inspect / history)',
          ],
        },
        {
          id: 'running',
          title: 'Running containers',
          duration: '55 mins',
          items: [
            'docker run: -p ports, -e env, -v volumes, --name',
            'Detached vs interactive; docker ps / logs / exec',
            'Cleaning up: stop, rm, prune',
            'Port mapping mental model (host:container)',
          ],
        },
        {
          id: 'build-132',
          title: 'Build: run real services in containers',
          duration: '35 mins',
          items: [
            'Run Mongo and Redis as containers (no local install)',
            'Connect to them from your host app',
            'Persist data with a named volume',
          ],
        },
      ],
    },
    {
      id: 'day141',
      title: 'Day 141: Writing Dockerfiles for Node',
      duration: '4 hours',
      topics: [
        {
          id: 'dockerfile-basics',
          title: 'Dockerfile instructions',
          duration: '55 mins',
          items: [
            'FROM, WORKDIR, COPY, RUN, ENV, EXPOSE, CMD vs ENTRYPOINT',
            'Choosing a base image (node:20-slim vs alpine trade-offs)',
            'Building and tagging: docker build -t app:dev .',
          ],
        },
        {
          id: 'layer-caching',
          title: 'Layer caching & build speed',
          duration: '50 mins',
          items: [
            'Copy package.json + install BEFORE copying source',
            'Why order determines cache hits',
            'npm ci vs npm install in images',
            '.dockerignore (node_modules, .git, .env) — smaller, safer builds',
          ],
        },
        {
          id: 'run-app',
          title: 'Running your app in a container',
          duration: '40 mins',
          items: [
            'Env vars and config at runtime (not baked in)',
            'Handling SIGTERM for graceful shutdown',
            'Reading container logs and exit codes',
          ],
        },
        {
          id: 'build-133',
          title: 'Build: containerize your API',
          duration: '35 mins',
          items: [
            'Write a Dockerfile for your Express/Node app',
            'Build, run, hit an endpoint',
            'Confirm cache reuse on a code-only change',
          ],
        },
      ],
    },
    {
      id: 'day142',
      title: 'Day 142: Multi-Stage Builds & Image Optimization',
      duration: '4 hours',
      topics: [
        {
          id: 'multistage',
          title: 'Multi-stage builds',
          duration: '55 mins',
          items: [
            'Build stage (dev deps, compile TS) vs runtime stage (prod only)',
            'COPY --from=build to ship only artifacts',
            'Dramatically smaller final images',
          ],
        },
        {
          id: 'security',
          title: 'Production-grade image hygiene',
          duration: '55 mins',
          items: [
            'Run as a non-root USER',
            'Pin base image versions; keep them patched',
            'Minimize installed packages (attack surface)',
            'Scanning images (docker scout / trivy)',
          ],
        },
        {
          id: 'healthcheck',
          title: 'Healthchecks & metadata',
          duration: '35 mins',
          items: [
            'HEALTHCHECK so orchestrators know if the app is alive',
            'LABELs and image metadata',
            'A liveness/readiness endpoint in the app',
          ],
        },
        {
          id: 'build-134',
          title: 'Build: optimize your image',
          duration: '35 mins',
          items: [
            'Convert your Dockerfile to multi-stage',
            'Add a non-root user and healthcheck',
            'Compare image sizes before/after',
          ],
        },
      ],
    },
    {
      id: 'day143',
      title: 'Day 143: Docker Compose for Multi-Service Dev',
      duration: '5 hours',
      topics: [
        {
          id: 'why-compose',
          title: 'Why Compose',
          duration: '40 mins',
          items: [
            'One command to run app + db + cache together',
            'compose.yaml: services, image/build, ports, environment',
            'up / down / logs / ps',
          ],
        },
        {
          id: 'networks-volumes',
          title: 'Networks & volumes',
          duration: '55 mins',
          items: [
            'Service discovery by name (app talks to "mongo")',
            'Named volumes for persistence across restarts',
            'Bind mounts for live source in dev',
          ],
        },
        {
          id: 'depends-env',
          title: 'depends_on, env & config',
          duration: '55 mins',
          items: [
            'depends_on + healthchecks (readiness ordering)',
            'env_file and per-service environment',
            'Overriding config for dev vs test',
          ],
        },
        {
          id: 'dev-workflow',
          title: 'A great local dev workflow',
          duration: '50 mins',
          items: [
            'Hot reload inside the container (bind mount + nodemon)',
            'Seeding the database on startup',
            'Running one-off commands (migrations, tests) via compose run',
          ],
        },
        {
          id: 'build-135',
          title: 'Build: full local stack',
          duration: '40 mins',
          items: [
            'Compose your app + Mongo + Redis',
            'One command boots everything',
            'Data persists across down/up',
          ],
        },
      ],
    },
    {
      id: 'day144',
      title: 'Day 144: Docker in Depth',
      duration: '4 hours',
      topics: [
        {
          id: 'networking-deep',
          title: 'Networking deep dive',
          duration: '50 mins',
          items: [
            'Bridge vs host vs none; user-defined networks',
            'Container-to-container DNS; published vs internal ports',
            'Debugging connectivity between services',
          ],
        },
        {
          id: 'volumes-deep',
          title: 'Volumes & data persistence',
          duration: '40 mins',
          items: [
            'Named volumes vs bind mounts vs tmpfs',
            'Backing up and restoring a volume',
            'Where database data actually lives',
          ],
        },
        {
          id: 'secrets-debug',
          title: 'Secrets, resources & debugging',
          duration: '45 mins',
          items: [
            'Passing secrets safely (not baked into images)',
            'CPU/memory limits',
            'docker exec, logs, and inspecting a misbehaving container',
          ],
        },
        {
          id: 'registries',
          title: 'Registries & shipping images',
          duration: '45 mins',
          items: [
            'Tagging for a registry (ghcr.io/user/app:sha)',
            'docker login + push to Docker Hub / GHCR',
            'Pulling and running your image on another machine',
          ],
        },
      ],
    },
    {
      id: 'day145',
      title: 'Day 145: GitHub Actions Fundamentals',
      duration: '4 hours',
      topics: [
        {
          id: 'ci-why',
          title: 'What CI/CD is and why it matters',
          duration: '35 mins',
          items: [
            'Continuous Integration vs Continuous Delivery/Deployment',
            'The value: catch breakage before merge, ship repeatably',
            'The pipeline mental model: trigger → jobs → steps',
          ],
        },
        {
          id: 'workflow-anatomy',
          title: 'Workflow anatomy',
          duration: '55 mins',
          items: [
            'on: (push, pull_request, workflow_dispatch, schedule)',
            'jobs, steps, runs-on, and the runner',
            'Marketplace actions (checkout, setup-node) with uses/with',
            'Reading logs and re-running failed jobs',
          ],
        },
        {
          id: 'matrix-cache',
          title: 'Matrix, caching & artifacts',
          duration: '50 mins',
          items: [
            'Matrix builds (multiple Node versions/OS)',
            'Caching dependencies for fast runs',
            'Uploading/downloading build artifacts',
          ],
        },
        {
          id: 'secrets-actions',
          title: 'Secrets & environments',
          duration: '40 mins',
          items: [
            'Repository/environment secrets (never hardcode)',
            'GITHUB_TOKEN and permissions',
            'Protected environments with required reviewers',
          ],
        },
      ],
    },
    {
      id: 'day146',
      title: 'Day 146: CI Pipeline — Lint, Test, Build',
      duration: '5 hours',
      topics: [
        {
          id: 'lint-test',
          title: 'Lint & test in CI',
          duration: '55 mins',
          items: [
            'Run ESLint and the Vitest suite (callback to Phase 12) headless',
            'Spin up service containers (Mongo/Redis) for integration tests',
            'Fail fast; surface test output',
          ],
        },
        {
          id: 'build-image-ci',
          title: 'Building the Docker image in CI',
          duration: '55 mins',
          items: [
            'docker/build-push-action with Buildx',
            'Layer caching in CI (gha cache)',
            'Tagging by commit SHA and branch',
          ],
        },
        {
          id: 'gates',
          title: 'Status checks & branch protection',
          duration: '45 mins',
          items: [
            'Required checks before merge',
            'PR gates: no merge on red',
            'Coverage/quality gates',
          ],
        },
        {
          id: 'build-138',
          title: 'Build: a real CI workflow',
          duration: '55 mins',
          items: [
            'Workflow: install → lint → test → build image',
            'Cache deps and layers',
            'Make it required on the main branch',
          ],
        },
      ],
    },
    {
      id: 'day147',
      title: 'Day 147: Project — Flood-Alert Canary Delivery Pipeline',
      duration: '6 hours',
      topics: [
        {
          id: 'push-registry',
          title: 'Push to a registry',
          duration: '50 mins',
          items: [
            'Authenticate to GHCR from Actions',
            'Push the built image with SHA + latest tags',
            'Image provenance and immutable tags',
          ],
        },
        {
          id: 'deploy',
          title: 'Deploy strategies',
          duration: '60 mins',
          items: [
            'Pull-and-restart on a VPS (SSH action)',
            'Deploy to a container platform (preview of Cloud Run in Phase 17)',
            'Environments: staging vs production',
            'Zero-downtime restarts and rollbacks',
          ],
        },
        {
          id: 'release-safety',
          title: 'Release safety',
          duration: '50 mins',
          items: [
            'Manual approval for production',
            'Rollback to a previous image tag',
            'Basic post-deploy smoke check',
            'Feature flags as a safer alternative to risky deploys',
          ],
        },
        {
          id: 'project',
          title: 'Build, verify, and roll back the release pipeline',
          duration: '80 mins',
          items: [
            'On push: lint → test → build → push image → deploy staging',
            'Manual approval → deploy production',
            'Secrets in GitHub, rollback documented',
          ],
          project: {
            title: 'Flood-Alert Canary Delivery Pipeline — DEPLOYED',
            description: 'Containerize a flood-alert subscription service and build a safe release system around it: multi-stage image, Compose development stack, GitHub Actions gates, staging, a canary smoke test against fixture gauges, manual production approval, health verification, and a tested rollback.',
            type: 'capstone',
            features: ['Reproducible multi-stage image and Compose stack with environment separation.', 'CI runs lint, type checks, tests, image build, and dependency security checks.', 'Staging verification, production approval, health check, and a tested rollback procedure.'],
            hints: ['Build once and promote the same image digest; do not rebuild a different production artifact.', 'Rollback instructions must be runnable by someone other than you.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Docker mental model: images, layers, registries, container lifecycle',
      'Production Dockerfiles: multi-stage, non-root, healthchecks, small images',
      'Docker Compose multi-service local dev with networks & volumes',
      'Docker networking, volumes, secrets, and debugging in depth',
      'GitHub Actions: workflows, matrix, caching, secrets, environments',
      'CI that lints/tests/builds and CD that pushes images & deploys safely',
    ],
    milestone: 'You can containerize any app and ship it through an automated pipeline — the baseline expectation for a modern backend/DevOps role.',
  },
};
