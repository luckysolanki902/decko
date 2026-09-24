# Phase 10: Image / File Storage at Scale (Days 113–117)

**⏱ Duration:** 5 days · ~22 hours
**🎯 Goal:** Understand every realistic way to store user uploads in production — and pick the right one per project.

---

## Day 113 — Storage strategies & trade-offs
- The three real options: Cloudinary (managed), S3 (raw object store), self-hosted (don't)
- Why you never serve uploads through your Node server in production
- CDN: what & why
- Cost models compared
- Image vs video vs document — different defaults

## Day 114 — Cloudinary deep dive
- Account setup, upload presets
- Server-side uploads (signed) vs unsigned client uploads
- Transformations on the URL (`w_400,h_400,c_fill,f_auto,q_auto`)
- Responsive images via `srcset`
- Folder structure & naming for sanity
- Webhooks: post-upload triggers

## Day 115 — AWS S3 from scratch
- IAM users, policies, never-use-root account
- Bucket creation, public vs private buckets
- Object keys, prefixes, "folders" (there are none)
- Lifecycle rules, versioning
- Bucket policies vs IAM policies vs ACLs (the sane modern stack)
- Server-side upload with the AWS SDK v3

## Day 116 — CloudFront + signed URLs
- Why a CDN in front of S3 (cost, latency, security)
- Origin Access Control (OAC) — the modern replacement for OAI
- Cache behaviors, invalidations
- Pre-signed S3 URLs for direct browser → S3 uploads (the pattern)
- Pre-signed CloudFront URLs for time-limited downloads
- The full trip: client asks server for upload URL → uploads directly → tells server when done

## Day 117 — Project: Oral-History Archive Ingest
**Spec:**
- Express + TypeScript microservice
- `POST /uploads/sign` → returns S3 pre-signed PUT URL + final CloudFront URL
- `POST /uploads/confirm` → server-side validation (size, MIME), persist URL
- Image variant generation via S3 trigger → Lambda → resized images (or Cloudinary fork)
- Frontend demo page that uploads a 50MB file directly to S3 with a progress bar
- README explains when to use S3 vs Cloudinary vs both

---

## ✅ Phase 10 Checkpoint
You can confidently architect file storage for any product, and never again need to push a 100MB upload through your own server.

> _Next: real-time. WebSockets, Socket.io, the patterns that make apps feel alive._
