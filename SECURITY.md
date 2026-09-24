# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue.

Use GitHub's [private vulnerability reporting](https://github.com/luckysolanki902/decko/security/advisories/new)
on this repository. Include:

- What the issue is and where in the code it lives.
- Steps to reproduce, or a proof of concept.
- What an attacker could actually obtain or change.

You can expect an acknowledgement within a few days. Please give a reasonable window
for a fix before disclosing publicly.

Because every learner's progress, revision history and trackers are stored per account,
**anything that lets one account read or modify another account's data is the highest
severity class here.** Report those first.

## What is in scope

- Authentication and session handling (`src/lib/auth.ts`, `src/lib/session.ts`, `src/lib/password.ts`).
- Any route that returns or writes data belonging to a specific user.
- Cross-user data access — being able to read, alter or delete another account's progress, trackers, revision attempts, quiz results or votes.
- Vote manipulation beyond one vote per account per request.
- Injection into MongoDB queries.

## What is out of scope

- Missing rate limits beyond what is already implemented. The limiter in `src/lib/rateLimit.ts` is in-process and resets on cold start; this is documented, not a finding. Put a WAF or edge rate limit in front of a real deployment.
- Content correctness in lectures. Those are bugs, not vulnerabilities — open a normal issue.
- Self-inflicted problems from running with a weak or shared `JWT_SECRET`.
- Denial of service through ordinary heavy usage.

## How the security-relevant parts work

Useful context for anyone auditing this:

**Passwords.** Hashed with scrypt (N=32768, r=8, p=1, 64-byte key) and a 16-byte random
salt per account. Hashes are stored self-describing —
`scrypt$N$r$p$salt$hash` — so cost parameters can be raised later without invalidating
existing accounts. Verification is constant time via `timingSafeEqual`.

**Username enumeration — a deliberate trade-off.** Signing in and signing up share one
entry point, so a sign-in attempt for an unregistered username replies `needsSignup`
and offers to create the account. That discloses whether a username exists. It is an
accepted cost of the single-button flow, not an oversight, and it is not treated as a
vulnerability.

The alternative was worse for this application: auto-creating an account for any
unrecognised username would turn a typo into an empty second account, and a learner
would see it as their progress having vanished.

What is still defended: an attempt on an unknown username runs a full scrypt derivation
(`fakeVerify`) before replying, so the endpoint is not a *fast* oracle for testing
username lists in bulk, and per-address and per-account rate limits apply to sign-in
attempts either way. A wrong password on an existing account is reported as
`Incorrect password.` and never offers signup, so the response does not help an attacker
distinguish anything beyond existence.

**Sessions.** A signed JWT (HS256) in an `httpOnly`, `sameSite=lax` cookie, `secure` in
production, expiring after 30 days. `JWT_SECRET` is required at startup and must be at
least 32 characters.

**Per-user data.** Every personal record carries a `userId`, and that id is part of the
query filter rather than a check performed after the read. Attempts are fetched as
`{ _id, userId }` together, so guessing an object id is not enough to touch someone
else's data. Unique compound indexes on `(userId, …)` back this at the database level.

**Authorisation.** Mutating API routes call `requireSession()` directly. This is
deliberate: the check sits beside the data it protects rather than in a central list
that can silently drift out of date as routes are added.

**No AI provider calls.** The application makes no requests to any model API and holds
no provider credentials, so there is no prompt-injection or key-exfiltration surface.

## Deploying safely

- Set a unique, random `JWT_SECRET` per deployment. Never reuse one across environments.
- Use a dedicated database user with access limited to the application's database.
- Keep `.env` files out of version control — `.gitignore` already excludes them, with an explicit exception only for `.env.example`.
- Rotating `JWT_SECRET` invalidates every active session, which is the intended lever if you suspect one was leaked.
