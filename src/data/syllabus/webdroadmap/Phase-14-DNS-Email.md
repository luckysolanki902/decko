# Phase 14 — DNS and Transactional Email (Days 136–139)

**Capability:** connect a real domain, authenticate a sending identity, diagnose delivery, and operate one privacy-aware transactional flow.

## Day 136 — Domains and DNS from first principles
- Registrar vs registry vs authoritative DNS, resolution, TTL, A/AAAA/CNAME/TXT/MX records, propagation, and debugging with `dig`.
- First visible win: trace one real hostname from resolver question to authoritative answer.

## Day 137 — Hostinger domain to Vercel
- Required records, apex vs `www`, canonical redirects, HTTPS issuance, verification, safe TTL changes, and rollback.

## Day 138 — Transactional email and domain authentication
- Provider API boundary, server-only secrets, templates, text fallback, SPF, DKIM, DMARC, bounces, complaints, suppression, rate limits, and delivery logs.

## Day 139 — Multilingual Clinic Appointment Confirmation
- A patient requests an appointment and receives a language-appropriate confirmation plus a short-lived reschedule link.
- **Evidence:** DNS record table, authenticated From domain, provider logs, validation/rate-limit proof, expiry test, privacy review, and rollback plan.
- **Transfer:** introduce a clinic subdomain and decide which records and links must change.
- **Out of scope:** marketing campaigns, bulk lists, and medical-record content in email.
