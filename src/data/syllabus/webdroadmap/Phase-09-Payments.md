# Phase 9: Payments — Stripe & Razorpay (Days 108–112)

**⏱ Duration:** 5 days · ~24 hours
**🎯 Goal:** Charge money correctly and safely with two providers — Stripe (global) and Razorpay (India). Checkout, subscriptions, webhook-driven billing state, refunds, and the security rules that keep payments trustworthy.

> The first phase of Production Web Engineering: nothing here needs queues, caching, or a real-time layer — it needs correctness, verified webhooks, and billing state you can trust.

---

## Day 108 — Stripe foundations & one-time payments
- The Stripe object model: customers, products, prices, payment intents, charges
- Checkout Sessions — the hosted path, and why it is the right default
- Payment Intents for custom flows, and when the extra control is worth it
- **Verifying payment: never trust the redirect** — the single most important rule in this phase
- Build: a working one-time checkout end to end

## Day 109 — Stripe subscriptions & webhooks
- Subscriptions, pricing models, trials, proration
- **Webhooks as the source of truth**: signature verification, idempotent handlers, retries and replay
- Modeling billing state in your own database instead of asking the provider on every request
- Customer portal and the full lifecycle (upgrade, downgrade, cancel, dunning)
- Build: a subscription with real feature gating

## Day 110 — Razorpay foundations & payments
- The Razorpay model and the India context (UPI, netbanking, cards, wallets)
- The Orders API + Checkout flow
- **Signature verification** — the equivalent rule, spelled differently
- Refunds and the edge cases that actually happen
- Build: a Razorpay one-time payment

## Day 111 — Razorpay subscriptions & payouts
- Plans and subscriptions
- Subscription webhooks and keeping billing state consistent
- RazorpayX and payouts (overview level)
- Reconciliation and reporting — proving the money matches

## Day 112 — Project: Workshop Seat and Sponsorship Billing
- A provider-agnostic payments layer so the app does not care which processor is behind it
- Subscriptions driving access control
- Security and correctness: idempotency, replay protection, amount verification server-side
- Ship it

---

## ✅ Phase 9 Capstone
**Workshop Seat and Sponsorship Billing — deployed.** Two providers sit behind one interface; signed, idempotent webhooks drive an auditable reservation/allocation ledger with refunds and failure recovery.

> _Next: image and file storage at scale — Cloudinary, S3, CloudFront, signed URLs._
