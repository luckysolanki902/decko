# Phase 16 — AWS Infrastructure and Operations (Days 148–156)

**Capability:** operate a secure Node service and asset path using least privilege, explicit networking, HTTPS, cost controls, recovery evidence, and a usable runbook.

## Days 148–150 — Cloud, IAM, and DNS mental models
- Regions/AZs, shared responsibility, account safety, budgets/tags, console/CLI, users vs roles, policies, least privilege, Route 53, and TLS.
- First visible win: create a budget alarm and a scoped role, then prove a denied action is denied for the intended reason.

## Days 151–152 — S3 and CloudFront
- Buckets/objects, block public access, presigned upload, metadata, lifecycle, encryption, CORS, origins, cache keys, invalidation, compression, and HTTPS.

## Days 153–155 — EC2, Linux, deployment, and hardening
- Security groups, SSH hygiene, processes/logs, systemd or PM2, Nginx reverse proxy, environment secrets, Certbot, patching, health checks, backup/restore, and incident steps.

## Day 156 — Satellite Tile Delivery on AWS
- Researchers upload imagery batches through presigned URLs; an EC2 API records jobs; private S3 stores sources; CloudFront serves generated tiles.
- **Evidence:** IAM policy, request/upload/delivery diagram, custom HTTPS domain, lifecycle policy, budget alert, restore test, health check, teardown checklist, and operator runbook.
- **Transfer:** add a second research team and prevent cross-team object access without duplicating infrastructure.
- **Out of scope:** multi-region active/active and unmanaged long-lived credentials.
