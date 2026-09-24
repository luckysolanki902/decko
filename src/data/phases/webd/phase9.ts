import { Phase } from '@/types';

export const phase9: Phase = {
  id: 'phase9',
  number: 9,
  title: 'Payments: Stripe & Razorpay',
  subtitle: 'One-time payments, subscriptions, webhooks, and billing state — global and India',
  duration: '5 Days | ~24 Hours',
  days: 'Days 108-112',
  goal: 'Charge money correctly and safely with two providers: Stripe (global) and Razorpay (India). Master Checkout, subscriptions, webhook-driven billing state, refunds, and the security rules that keep payments trustworthy.',
  icon: '💳',
  color: 'blue',
  sections: [
    {
      id: 'day108',
      title: 'Day 108: Stripe Foundations & One-Time Payments',
      duration: '5 hours',
      topics: [
        {
          id: 'concepts',
          title: 'Stripe object model',
          duration: '50 mins',
          items: [
            'Customer, Product, Price, PaymentIntent, Charge',
            'Test mode vs live mode (separate keys and data)',
            'Publishable vs secret keys — what lives where',
            'The golden rule: the client never sets the amount',
          ],
        },
        {
          id: 'checkout',
          title: 'Checkout Sessions (the easy path)',
          duration: '60 mins',
          items: [
            'Server creates a Checkout Session → returns URL',
            'Client redirects to Stripe-hosted checkout',
            'success_url / cancel_url and metadata',
            'Works for one-time and subscriptions',
          ],
        },
        {
          id: 'payment-intents',
          title: 'Payment Intents & custom flows',
          duration: '55 mins',
          items: [
            'When you need Elements + PaymentIntent instead of Checkout',
            'Client secret, confirmCardPayment, 3D Secure/SCA',
            'Idempotency keys on create to avoid double charges',
          ],
        },
        {
          id: 'verify',
          title: 'Verifying payment (never trust the redirect)',
          duration: '45 mins',
          items: [
            'Do NOT grant access on the success_url alone',
            'Confirm via retrieved session/PaymentIntent or webhook',
            'Fulfillment = a server-verified state change',
          ],
        },
        {
          id: 'build-123',
          title: 'Build: one-time checkout',
          duration: '40 mins',
          items: [
            'Sell a single product via Checkout',
            'Handle success and cancel',
            'Record the paid order server-side',
          ],
        },
      ],
    },
    {
      id: 'day109',
      title: 'Day 109: Stripe Subscriptions & Webhooks',
      duration: '5 hours',
      topics: [
        {
          id: 'subscriptions',
          title: 'Subscriptions & pricing',
          duration: '55 mins',
          items: [
            'Recurring Prices, trials, proration',
            'Subscription lifecycle: active, past_due, canceled',
            'Metered vs licensed (seat) billing basics',
          ],
        },
        {
          id: 'webhooks',
          title: 'Webhooks — the source of truth',
          duration: '65 mins',
          items: [
            'Verify the signature with the webhook secret (raw body!)',
            'Key events: checkout.session.completed, invoice.paid, customer.subscription.updated/deleted',
            'Idempotent handlers — Stripe retries',
            'Local testing with the Stripe CLI (listen --forward-to)',
          ],
        },
        {
          id: 'billing-state',
          title: 'Modeling billing state in your DB',
          duration: '55 mins',
          items: [
            'Subscription model: stripeCustomerId, stripeSubId, status, plan, currentPeriodEnd',
            'Update ONLY from webhooks (single source of truth)',
            'Gate features by plan/status in your authz layer',
          ],
        },
        {
          id: 'portal',
          title: 'Customer portal & lifecycle',
          duration: '40 mins',
          items: [
            'One API call → hosted portal (cancel, swap plan, update card)',
            'Dunning: failed payments and retries',
            'Handling cancellations and grace periods',
          ],
        },
        {
          id: 'build-124',
          title: 'Build: subscription with feature gating',
          duration: '45 mins',
          items: [
            'Two plans (free/pro), upgrade via Checkout',
            'Webhook updates DB; middleware gates a pro feature',
            'Portal link for self-service management',
          ],
        },
      ],
    },
    {
      id: 'day110',
      title: 'Day 110: Razorpay Foundations & Payments',
      duration: '5 hours',
      topics: [
        {
          id: 'razorpay-model',
          title: 'Razorpay model & India context',
          duration: '50 mins',
          items: [
            'Why Razorpay for India (UPI, cards, netbanking, wallets)',
            'Orders vs Payments vs Settlements',
            'Test vs live keys; the Dashboard',
            'KYC/activation realities for live mode',
          ],
        },
        {
          id: 'orders',
          title: 'The Orders API + Checkout',
          duration: '60 mins',
          items: [
            'Server creates an Order (amount in paise) → order_id',
            'Razorpay Checkout on the client with the order_id',
            'Capturing payment (auto vs manual capture)',
            'Handling UPI collect/intent flows',
          ],
        },
        {
          id: 'verify-razorpay',
          title: 'Signature verification (critical)',
          duration: '55 mins',
          items: [
            'Verify razorpay_signature = HMAC(order_id|payment_id, key_secret)',
            'Never mark paid without server-side verification',
            'Webhooks: payment.captured, payment.failed, order.paid',
            'Webhook signature verification with the webhook secret',
          ],
        },
        {
          id: 'refunds',
          title: 'Refunds & edge cases',
          duration: '40 mins',
          items: [
            'Full and partial refunds via API',
            'Failed/pending payment states and reconciliation',
            'Currency, fees, and amount-in-paise gotchas',
          ],
        },
        {
          id: 'build-125',
          title: 'Build: Razorpay one-time payment',
          duration: '35 mins',
          items: [
            'Create order → checkout → verify signature → fulfill',
            'Handle a failed payment gracefully',
            'Store the verified payment record',
          ],
        },
      ],
    },
    {
      id: 'day111',
      title: 'Day 111: Razorpay Subscriptions & Payouts',
      duration: '4 hours',
      topics: [
        {
          id: 'plans-subs',
          title: 'Plans & Subscriptions',
          duration: '55 mins',
          items: [
            'Create Plans and Subscriptions (recurring)',
            'Subscription states and the authorization step',
            'Mandates/e-mandate basics for recurring in India',
          ],
        },
        {
          id: 'sub-webhooks',
          title: 'Subscription webhooks & billing state',
          duration: '50 mins',
          items: [
            'subscription.activated / charged / halted / cancelled',
            'Mirror state into your DB (same pattern as Stripe)',
            'Idempotency and retries',
          ],
        },
        {
          id: 'payouts',
          title: 'RazorpayX & payouts (overview)',
          duration: '40 mins',
          items: [
            'When you need to PAY people (marketplaces, refunds at scale)',
            'Payouts, contacts, fund accounts — the concept map',
            'Route/transfers for split payments (marketplace model)',
          ],
        },
        {
          id: 'reconciliation',
          title: 'Reconciliation & reporting',
          duration: '35 mins',
          items: [
            'Settlements vs captured payments — the timing gap',
            'Reconciling your DB against provider reports',
            'Fees, taxes (GST), and what to store for accounting',
          ],
        },
      ],
    },
    {
      id: 'day112',
      title: 'Day 112: Project — Workshop Seat and Sponsorship Billing',
      duration: '5 hours',
      topics: [
        {
          id: 'abstraction',
          title: 'A provider-agnostic payments layer',
          duration: '55 mins',
          items: [
            'A PaymentProvider interface: createCheckout, verify, handleWebhook',
            'Stripe and Razorpay implementations behind it',
            'Region → provider selection (India vs global)',
          ],
        },
        {
          id: 'gating',
          title: 'Subscriptions → access control',
          duration: '60 mins',
          items: [
            'Plans/entitlements model in your DB',
            'Webhook-driven state for both providers',
            'Middleware that gates features by entitlement',
          ],
        },
        {
          id: 'harden',
          title: 'Security & correctness',
          duration: '55 mins',
          items: [
            'Signature verification on every webhook',
            'Idempotency keys and duplicate-event guards',
            'Never trust client amounts; reconcile before fulfillment',
          ],
        },
        {
          id: 'ship',
          title: 'Ship it',
          duration: '70 mins',
          items: [
            'Deploy with real (test-mode) keys and public webhook URLs',
            'Demo an upgrade with each provider',
            'A billing page with self-service management',
          ],
          project: {
            title: 'Workshop Seat and Sponsorship Billing — DEPLOYED',
            description: 'Build billing for a training cooperative: learners reserve paid seats, sponsors fund seat pools, organizers issue partial refunds, and webhooks reconcile every state change. Support Stripe and Razorpay behind one provider interface, verify signatures, prevent duplicate reservations, and expose an auditable payment and allocation ledger.',
            type: 'capstone',
            features: ['Provider abstraction for Stripe and Razorpay, verified webhook signatures, and idempotent event handling.', 'Atomic credit consumption with a ledger that explains every balance change.', 'Feature gating, failed-payment handling, and a test-mode demo with real webhook events.'],
            hints: ['The payment provider is not your source of truth; your ledger is.', 'A webhook can arrive twice or before the browser returns—design for both.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Stripe Checkout, Payment Intents, and safe payment verification',
      'Stripe subscriptions, customer portal, and webhook-driven billing state',
      'Razorpay Orders, Checkout, and signature verification (India stack)',
      'Razorpay subscriptions, payouts/route, and reconciliation',
      'A provider-agnostic payments abstraction with region selection',
      'Webhook security: signatures, idempotency, single source of truth',
    ],
    milestone: 'You can take money in production — globally and in India — with the security and billing-state discipline real SaaS requires.',
  },
};
