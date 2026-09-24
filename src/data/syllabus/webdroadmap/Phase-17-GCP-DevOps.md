# Phase 17 — GCP, Portability, and Reliability (Days 157–162)

**Capability:** transfer durable cloud concepts to GCP, deploy a container serverlessly, connect managed data safely, and operate against explicit reliability and cost signals.

## Day 157 — GCP mental model and setup
- Organization/folder/project/resource hierarchy, billing boundaries, IAM inheritance, service accounts, `gcloud` configurations, APIs, regions, labels, and budgets.
- First visible win: create an isolated project/configuration and prove the active identity, project, region, and budget guardrail.

## Day 158 — Cloud Storage and Cloud DNS
- Bucket permissions, signed URLs, lifecycle, CORS, custom domains, DNS records, TTL, and AWS-to-GCP concept mapping.

## Day 159 — Compute Engine and networking
- Instances, machine families, disks, VPCs, firewall rules, service accounts, startup scripts, health checks, and operational access.

## Day 160 — Cloud Run
- Artifact Registry, container contract, revisions, traffic, concurrency, min/max instances, environment/secrets, custom domains, logs, and rollback.

## Day 161 — Cloud SQL and DevOps practice
- Private connection choices, pooling, migrations, backups, Secret Manager, workload identity federation, monitoring, logs, uptime checks, SLO signals, alerts, and cost review.

## Day 162 — Water-Quality Telemetry Reliability on GCP
- Deploy telemetry intake and public status to Cloud Run with Cloud SQL/Storage, Secret Manager, custom HTTPS, and keyless GitHub Actions deployment.
- **Evidence:** freshness/availability objectives, stale-sensor and database-failure drills, actionable alerts, dashboard, cost note, rollback proof, and cleanup.
- **Transfer:** absorb a bursty second sensor network and justify concurrency, scaling, and database-pool changes.
- **Out of scope:** claiming reliability from deployment alone or copying AWS names without mapping the mechanism.
