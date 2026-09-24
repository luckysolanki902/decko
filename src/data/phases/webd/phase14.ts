import { Phase } from '@/types';

export const phase14: Phase = {
  id: 'phase14',
  number: 14,
  title: 'Custom Domains & Transactional Email',
  subtitle: 'DNS from scratch, Hostinger → Vercel, and email that reaches inboxes',
  duration: '4 Days | ~18 Hours',
  days: 'Days 136-139',
  goal: 'Understand what a domain and DNS records actually do, connect a Hostinger domain to Vercel with confidence, and send authenticated transactional email from a real domain.',
  icon: '✉️',
  color: 'amber',
  sections: [
    {
      id: 'day136',
      title: 'Day 136: Domains & DNS — From First Principles',
      duration: '4 hours',
      topics: [
        {
          id: 'domain-map',
          title: 'The internet’s address book',
          duration: '55 mins',
          items: [
            'Domain name vs URL vs IP address: three different jobs',
            'Registrar, DNS host, web host, and email provider: who controls what',
            'How a browser resolves example.com before it can request your app',
            'Why buying a domain from Hostinger does not automatically host a website there',
          ],
        },
        {
          id: 'record-types',
          title: 'DNS records you will actually use',
          duration: '65 mins',
          items: [
            'A and AAAA records: point a name at an IPv4 or IPv6 address',
            'CNAME records: make one hostname alias another hostname',
            'TXT records: publish ownership proofs and email policies',
            'MX records: tell senders which servers accept mail for a domain',
          ],
        },
        {
          id: 'root-www-subdomain',
          title: 'Root, www, and subdomains',
          duration: '40 mins',
          items: [
            'Apex/root domain: yourdomain.com; www is a separate hostname',
            'Subdomains such as app., api., mail., and staging. are independent names',
            'Choose one canonical public URL and redirect the alternatives',
            'Why a CNAME works naturally for www but can be limited at the apex',
          ],
        },
        {
          id: 'ttl-debug',
          title: 'TTL, propagation, and safe debugging',
          duration: '40 mins',
          items: [
            'TTL is a cache lifetime, not a timer that makes records instantly change',
            'Why resolver caches make different networks appear to disagree',
            'Use dig/nslookup and provider verification screens to inspect records',
            'Never delete an unfamiliar MX or TXT record before understanding its owner',
          ],
        },
      ],
    },
    {
      id: 'day137',
      title: 'Day 137: Custom Domain on Vercel — Hostinger Walkthrough',
      duration: '5 hours',
      topics: [
        {
          id: 'before-dns',
          title: 'Prepare the app and domain',
          duration: '45 mins',
          items: [
            'Deploy the project to Vercel first and confirm its generated vercel.app URL works',
            'Pick the production hostname before touching DNS: root domain or www',
            'Keep access to the Hostinger domain/DNS dashboard and Vercel project settings',
            'Record existing DNS entries so a mistake is reversible',
          ],
        },
        {
          id: 'vercel-domain',
          title: 'Add the domain in Vercel',
          duration: '60 mins',
          items: [
            'Project Settings → Domains: add yourdomain.com and inspect Vercel’s required records',
            'Understand Vercel’s verification status and why it refuses conflicting records',
            'Set the preferred domain and configure a redirect for the other hostname',
            'Use Vercel’s current record values instead of copying stale values from a tutorial',
          ],
        },
        {
          id: 'hostinger-dns',
          title: 'Tutorial: enter the records in Hostinger',
          duration: '90 mins',
          items: [
            'Open Hostinger hPanel → Domains → DNS Zone Editor for the purchased domain',
            'Create the A record for @ and CNAME for www exactly as Vercel currently requests',
            'Remove only records that conflict with those exact hostnames; leave mail records alone',
            'Return to Vercel to verify, then wait and recheck rather than repeatedly changing records',
          ],
        },
        {
          id: 'ssl-launch',
          title: 'HTTPS and launch checks',
          duration: '45 mins',
          items: [
            'Vercel provisions TLS after DNS points correctly; do not buy a separate SSL certificate',
            'Test root, www, HTTPS, a deep route, and a mobile device after verification',
            'Check canonical redirects so search engines and users see one URL',
            'Know the common failure modes: wrong host field, duplicate records, stale nameservers, and cache delay',
          ],
        },
      ],
    },
    {
      id: 'day138',
      title: 'Day 138: Transactional Email & Domain Authentication',
      duration: '4 hours',
      topics: [
        {
          id: 'email-why',
          title: 'What transactional email is for',
          duration: '40 mins',
          items: [
            'User-triggered messages: receipts, password resets, verification, and account notices',
            'Why app code should call a provider API instead of running its own mail server',
            'Choose a provider such as Resend, Postmark, or SES based on delivery needs and cost',
            'Keep provider keys server-side and never expose them in browser JavaScript',
          ],
        },
        {
          id: 'sender-domain',
          title: 'Use a real From domain',
          duration: '55 mins',
          items: [
            'From address, reply-to address, and return path: what each communicates',
            'Why hello@yourdomain.com earns more trust than a random shared sender',
            'Separate website and email concerns with deliberate hostnames such as mail.yourdomain.com',
            'Create a verified sending domain in the provider before attempting production sends',
          ],
        },
        {
          id: 'email-dns',
          title: 'SPF, DKIM, and DMARC without magic',
          duration: '75 mins',
          items: [
            'SPF TXT record: which services are allowed to send for your domain',
            'DKIM CNAME/TXT record: how receivers verify an email signature',
            'DMARC TXT record: require alignment and choose a cautious p=none rollout first',
            'Add the provider-generated records in Hostinger without replacing unrelated DNS entries',
          ],
        },
        {
          id: 'first-email',
          title: 'First trustworthy send',
          duration: '50 mins',
          items: [
            'Send a server-side welcome email with a provider SDK and environment variable',
            'Include a plain-text alternative, meaningful subject, and working reply-to address',
            'Use provider logs to distinguish accepted, delivered, bounced, and failed messages',
            'Test a real inbox and spam folder before declaring email finished',
          ],
        },
      ],
    },
    {
      id: 'day139',
      title: 'Day 139: Project — Multilingual Clinic Appointment Confirmation',
      duration: '5 hours',
      topics: [
        {
          id: 'template',
          title: 'Email content that works everywhere',
          duration: '60 mins',
          items: [
            'Use a simple HTML email or react-email components for maintainable templates',
            'Prefer a narrow layout, inline-safe styling, descriptive links, and image alt text',
            'Pass only trusted, validated data into the template',
            'Build one reusable layout and a welcome or contact-confirmation message',
          ],
        },
        {
          id: 'safe-send',
          title: 'A safe send endpoint',
          duration: '60 mins',
          items: [
            'Validate recipient input on the server, even if the form validates in the browser',
            'Rate-limit public contact forms and never turn them into an open relay',
            'Handle provider failures with a useful UI state and server logs',
            'Do not send email before the primary user action is safely stored',
          ],
        },
        {
          id: 'project',
          title: 'Build and verify the application update flow',
          duration: '90 mins',
          items: [
            'Deploy a small clinic-request app to Vercel and connect a Hostinger domain',
            'Choose and enforce the canonical root/www URL with HTTPS working',
            'Authenticate the domain with your email provider using SPF, DKIM, and starter DMARC',
            'Ship one transactional flow: welcome, contact confirmation, or password-reset request',
          ],
          project: {
            title: 'Multilingual Clinic Appointment Confirmation — DEPLOYED',
            description: 'Launch a clinic confirmation flow on a Hostinger domain connected to Vercel: a patient requests an appointment, receives an authenticated language-appropriate confirmation from the custom domain, and follows a short-lived reschedule link. Document DNS, SPF, DKIM, DMARC, delivery diagnostics, privacy boundaries, and rollback.',
            type: 'capstone',
            features: ['Hostinger → Vercel canonical HTTPS domain with a documented DNS record table.', 'Verified From domain with SPF, DKIM, starter DMARC, and provider delivery logs.', 'One safe server-side email flow with validated input, rate limits, and a secure status link.'],
            hints: ['DNS records are infrastructure: document record owner, hostname, purpose, and rollback.', 'Never put a provider key or an unbounded AI/email endpoint in client code.'],
          },
        },
        {
          id: 'handoff',
          title: 'Document the setup for future you',
          duration: '45 mins',
          items: [
            'Write a README table: record purpose, hostname, value source, and owning provider',
            'Store secrets in Vercel environment variables, never in source control',
            'Capture screenshots of Vercel verification and provider domain verification',
            'State the rollback plan: which record to restore and how to return to the vercel.app URL',
          ],
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Explain domains, DNS, A/AAAA, CNAME, TXT, MX, TTL, and propagation from first principles',
      'Connect a Hostinger-managed domain to Vercel and configure a canonical HTTPS URL',
      'Authenticate transactional email with provider-managed SPF, DKIM, and starter DMARC records',
      'Ship one safe server-side email flow from a real From domain',
    ],
    milestone: 'You can put a real product on its own domain and make its essential email arrive credibly — without treating DNS as copy-paste magic.',
  },
};
