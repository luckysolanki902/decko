# Phase 7: Authentication Deep Dive (Days 80–92)

**⏱ Duration:** 13 days · ~54 hours
**🎯 Goal:** Understand cryptography from first principles, then build authentication you'd trust in production — passwords, sessions, JWT, passwordless/magic links, OAuth, NextAuth, RBAC, and the security failure modes behind each.

> Auth bugs cost real money. This phase trains you to ship auth that doesn't.

---

## Day 80 — Cryptography from scratch: encoding, hashing & encryption
- Bits and bytes, and what a number like `256` actually means (256-bit = 32 bytes = 64 hex characters); hex vs base64 as spellings, not security
- **Encoding vs hashing vs encryption** — the distinction interviews are built on, and the one question that picks the right one
- What a hash function is: deterministic, fast, one-way, collision resistant; the avalanche effect; why collisions must exist; the birthday bound (256-bit output → ~128-bit collision security)
- **SHA-256 decoded**: SHA = Secure Hash Algorithm, the number = output bits; the SHA-0/1/2/3 family; 512-bit blocks, 64 rounds, Merkle–Damgård; nothing-up-my-sleeve constants; the length-extension flaw and why **HMAC** exists
- What hashes are for: integrity, git object ids, cache keys, signature building block, HMAC webhook verification — and why a plain SHA-256 of a password is a bug
- **Symmetric encryption**: AES, block ciphers, why ECB leaks (the penguin), CBC + IV, **GCM/AEAD** and auth tags, the never-reuse-a-nonce rule, and why a password is not a key
- Hands-on: AES-256-GCM encrypt/decrypt in Node, then corrupt a byte and watch authentication catch it

## Day 81 — Public keys, signatures, TLS & end-to-end encryption
- The key-distribution problem; public/private key pairs; encrypt-with-public vs sign-with-private; trapdoor functions behind RSA and elliptic curves; RSA-2048 vs 256-bit ECC
- **Hybrid encryption** — random symmetric key for the data, public key to deliver the key. This is what TLS, PGP, and every messenger actually do
- **Signatures & certificates**: sign the hash not the document; what a signature proves; certificates, Certificate Authorities, the chain of trust, and what the padlock does *not* mean; HS256 vs RS256/ES256 for JWTs
- **Diffie-Hellman** (paint analogy → the real thing), ephemeral DH and **forward secrecy**, and the **TLS 1.3 handshake** step by step
- **E2EE threat model**: transport encryption vs end-to-end; what it protects against (breached server, insider, subpoena) and what it does not (compromised device, metadata); the features you give up
- **The full Signal-style flow**: identity keys, signed prekeys, one-time prekeys, **X3DH** for offline start, the **Double Ratchet**, forward secrecy + post-compromise security, safety-number verification, multi-device and groups, and the unsolved backup problem
- Building it in the browser: WebCrypto, PBKDF2-derived keys, non-extractable keys in IndexedDB, the server-ships-the-JavaScript limitation, and never rolling your own protocol

## Day 82 — Password hashing & storage
- Never store plain passwords; hash one-way; why salting matters
- `bcrypt` vs `argon2id`; cost/memory tuning (~250ms); re-hash on login
- Register + login endpoints; generic "invalid credentials" (no enumeration); aggressive rate limiting
- NIST-style policy: length > complexity, breached-password check

## Day 83 — Sessions vs JWT
- Server sessions (`express-session` + connect-mongo/Redis); easy revocation
- JWT (`header.payload.signature`, stateless); pros/cons; HS256 vs RS256
- Access + refresh token pattern (short access, rotated refresh, hashed in DB)
- How to choose (sessions for monoliths, JWT for mobile/multi-service)

## Day 84 — Cookies done right
- Flags that matter: `httpOnly`, `secure`, `sameSite`, `maxAge`, scoping
- CORS + credentials (`credentials: "include"`, no `*` origin)
- CSRF (what it is, `sameSite: lax`, double-submit token)
- Why NOT localStorage for tokens (XSS = stolen token)

## Day 85 — Email verification & password reset
- Single-use, expiring tokens (store the hash, send the raw)
- Sending email with Resend (SPF/DKIM, react-email, background jobs)
- Verify flow (block sensitive actions until verified)
- Reset flow (always 200, invalidate all sessions on reset)

## Day 86 — Magic links & passwordless
- Why passwordless is a 2026 default; trade-offs (deliverability, latency)
- Magic-link flow built right (single-use, short expiry, hash stored, rate-limited)
- Email/SMS OTP codes (hash, cap attempts, expire fast)
- Passkeys / WebAuthn landscape (phishing-resistant; SimpleWebAuthn; NextAuth support)

## Day 87 — OAuth 2.0 mental model
- Why OAuth exists; OIDC is the auth layer on top
- Authorization Code flow with PKCE; verify `state`
- Scopes & ID tokens (least privilege)
- Common pitfalls (skipping state, client-side tokens, trusting unverified email)

## Day 88 — Wire Google + GitHub OAuth (raw)
- Register OAuth apps; redirect URIs; client id/secret in `.env`
- A small library (`arctic` / `openid-client`) for correct URLs + code exchange
- Callback handler: verify state → exchange → fetch user → upsert → your own session
- Account linking (same email across providers)

## Day 89 — NextAuth (Auth.js v5)
- Why NextAuth (OAuth + credentials + magic links + passkeys)
- Setup: `auth.ts` (providers, Drizzle **or** MongoDB adapter, callbacks), route handler, middleware, `auth()`/`useSession`
- Callbacks (`session`, `jwt`, `signIn`)
- Roles + protected pages

## Day 90 — Authorization (RBAC)
- RBAC vs ABAC; designing permissions (verb + resource)
- Centralize `can(role, action, resource)`
- **IDOR** — the #1 bug missed in review; `authorize()` in every mutation
- Audit logging (append-only, never edited)

## Days 91–92 — Project: Consent-Based Records Release Console
**Spec:** Next.js + NextAuth (Google + GitHub + magic link), Drizzle/Postgres **or** Mongo adapter, roles (user/admin), gated dashboard + admin, verification + reset + magic-link flows.
- Day 91: scaffold + NextAuth wired + marketing/dashboard pages
- Day 92: RBAC + admin page, audit log, security pass, deploy to Vercel, README with auth-flow diagram

---

## ✅ Phase 7 Capstone
**Consent-Based Records Release Console — deployed.** Time-bounded patient consent, scoped staff requests, supervisor approval, revocation, immutable access/export audit, correct cookie flags, and one deployed OAuth or magic-link path.

> _Next: the Next.js App Router — server components, server actions, caching, and a deliberate rendering strategy._
