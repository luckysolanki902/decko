import { Phase } from '@/types';

export const phase16: Phase = {
  id: 'phase16',
  number: 16,
  title: 'AWS from Scratch',
  subtitle: 'IAM, domains & DNS, S3 + presigned URLs, CloudFront, EC2/VPS, HTTPS — console and CLI',
  duration: '9 Days | ~40 Hours',
  days: 'Days 148-156',
  goal: 'Own your infrastructure. Go from an empty AWS account to a real Node app running on a server you configured — IAM, domains/DNS, S3 with presigned uploads, a CloudFront CDN, an EC2/VPS with Nginx + HTTPS — using both the console and the AWS CLI.',
  icon: '☁️',
  color: 'amber',
  sections: [
    {
      id: 'day148',
      title: 'Day 148: AWS & Cloud Mental Model',
      duration: '4 hours',
      topics: [
        {
          id: 'cloud-model',
          title: 'How to think about AWS',
          duration: '45 mins',
          items: [
            'Regions and Availability Zones — what they are, how to pick',
            'The shared responsibility model (AWS secures OF the cloud, you secure IN it)',
            'Compute vs storage vs networking vs managed services map',
            'The console vs the API/CLI — same actions, two doors',
          ],
        },
        {
          id: 'account-setup',
          title: 'Account setup & safety',
          duration: '50 mins',
          items: [
            'Free tier: what is free, what silently is not',
            'Billing alarms + budgets (avoid the surprise bill)',
            'Enable MFA on the root account immediately',
            'Cost Explorer basics',
          ],
        },
        {
          id: 'cli-setup',
          title: 'AWS CLI from zero',
          duration: '55 mins',
          items: [
            'Install the AWS CLI v2',
            'aws configure: access key, secret, region, output',
            'Named profiles for multiple accounts',
            'First read-only command to confirm access',
          ],
        },
        {
          id: 'console-tour',
          title: 'Console tour',
          duration: '30 mins',
          items: [
            'Finding services, switching regions',
            'Reading the resource pages you will use this phase',
            'Tags and why you tag everything',
          ],
        },
      ],
    },
    {
      id: 'day149',
      title: 'Day 149: IAM from Scratch',
      duration: '5 hours',
      topics: [
        {
          id: 'iam-model',
          title: 'The IAM model',
          duration: '55 mins',
          items: [
            'Root vs IAM users — never use root day-to-day',
            'Users, groups, roles — what each is for',
            'Policies: identity-based vs resource-based',
            'Principle of least privilege',
          ],
        },
        {
          id: 'policies',
          title: 'Reading & writing policies',
          duration: '60 mins',
          items: [
            'Policy JSON: Effect, Action, Resource, Condition',
            'Managed vs inline policies',
            'How Allow/Deny evaluation works (explicit deny wins)',
            'Scoping a policy to one bucket/resource',
          ],
        },
        {
          id: 'roles',
          title: 'Roles & temporary credentials',
          duration: '55 mins',
          items: [
            'Why roles beat long-lived keys (EC2 instance roles)',
            'AssumeRole and the STS concept',
            'Service roles (an EC2 that can read S3 without keys)',
          ],
        },
        {
          id: 'access-keys',
          title: 'Access keys, MFA & CLI profiles',
          duration: '45 mins',
          items: [
            'Create a least-privilege IAM user for the CLI',
            'Rotate/disable keys; never commit them',
            'Enforce MFA; map keys to a named CLI profile',
          ],
        },
      ],
    },
    {
      id: 'day150',
      title: 'Day 150: Domains & DNS from Scratch',
      duration: '5 hours',
      topics: [
        {
          id: 'what-is-domain',
          title: 'What a domain actually is',
          duration: '45 mins',
          items: [
            'Registrar vs DNS host vs hosting — three separate things',
            'Nameservers and delegation',
            'The DNS resolution path (resolver → root → TLD → authoritative)',
            'TTL and why propagation takes time',
          ],
        },
        {
          id: 'record-types',
          title: 'DNS record types in depth',
          duration: '60 mins',
          items: [
            'A / AAAA — point a name at an IP',
            'CNAME — alias one name to another',
            'MX — where mail goes; NS — delegation; SOA — zone metadata',
            'TXT — verification, SPF, DKIM, DMARC (callback to Phase 14)',
            'When to use ALIAS/A-alias at the zone apex',
          ],
        },
        {
          id: 'route53',
          title: 'Route 53 hosted zones',
          duration: '60 mins',
          items: [
            'Create a hosted zone; point your registrar at its nameservers',
            'Add A/CNAME/TXT records via console and CLI',
            'Alias records to AWS resources (CloudFront/ELB)',
            'Health checks and simple routing policies (overview)',
          ],
        },
        {
          id: 'verify-domain',
          title: 'Practical: verify a domain',
          duration: '35 mins',
          items: [
            'Add a TXT record to prove ownership',
            'Add SPF/DKIM/DMARC for a sending subdomain',
            'Query with dig/nslookup and confirm propagation',
          ],
        },
      ],
    },
    {
      id: 'day151',
      title: 'Day 151: S3 Deep Dive',
      duration: '5 hours',
      topics: [
        {
          id: 's3-basics',
          title: 'Buckets, objects & storage classes',
          duration: '50 mins',
          items: [
            'Buckets, keys, and the flat namespace (no real folders)',
            'Storage classes (Standard, IA, Glacier) and cost',
            'Versioning and lifecycle rules',
            'Block Public Access — on by default, and why',
          ],
        },
        {
          id: 'permissions',
          title: 'Bucket permissions done right',
          duration: '55 mins',
          items: [
            'Bucket policies vs IAM vs ACLs (prefer policies)',
            'Least-privilege access for an app user/role',
            'The classic "accidentally public bucket" mistake',
          ],
        },
        {
          id: 'presigned',
          title: 'Presigned URLs (from scratch)',
          duration: '65 mins',
          items: [
            'Why presigned URLs exist: upload/download without proxying bytes',
            'Presigned PUT for direct-to-S3 uploads',
            'Presigned GET for private downloads with expiry',
            'Generating them with the SDK; constraining content-type/size',
            'Direct browser → S3 upload flow end to end',
          ],
        },
        {
          id: 'static-hosting',
          title: 'Static hosting & CLI',
          duration: '40 mins',
          items: [
            'Host a static site from S3',
            'aws s3 cp / sync from the CLI',
            'When to serve via CloudFront instead (next day)',
          ],
        },
      ],
    },
    {
      id: 'day152',
      title: 'Day 152: CloudFront CDN & HTTPS',
      duration: '4 hours',
      topics: [
        {
          id: 'cdn-why',
          title: 'Why a CDN',
          duration: '40 mins',
          items: [
            'Edge caching: latency and origin-load wins',
            'CloudFront distributions and edge locations',
            'Origins: S3 (with OAC) vs a custom origin (your EC2)',
          ],
        },
        {
          id: 'caching',
          title: 'Caching behavior',
          duration: '50 mins',
          items: [
            'Cache behaviors, TTLs, and cache keys',
            'Invalidations (and why to version asset URLs instead)',
            'Compression and forwarding headers/cookies/query',
          ],
        },
        {
          id: 'https',
          title: 'HTTPS with ACM',
          duration: '50 mins',
          items: [
            'Request a certificate in ACM (DNS validation via Route 53)',
            'Attach the cert; serve your custom domain over HTTPS',
            'Redirect HTTP → HTTPS',
          ],
        },
        {
          id: 'signed',
          title: 'Private content: signed URLs/cookies',
          duration: '30 mins',
          items: [
            'Signed URLs vs signed cookies for gated assets',
            'Pairing CloudFront with private S3 (OAC)',
            'When presigned S3 vs CloudFront signing is right',
          ],
        },
      ],
    },
    {
      id: 'day153',
      title: 'Day 153: EC2 & Linux Server Basics',
      duration: '5 hours',
      topics: [
        {
          id: 'launch',
          title: 'Launch an instance',
          duration: '55 mins',
          items: [
            'AMIs, instance types, and the free-tier instance',
            'Key pairs and SSH access',
            'Elastic IPs vs ephemeral public IPs',
            'User data for first-boot provisioning',
          ],
        },
        {
          id: 'security-groups',
          title: 'Security groups & networking',
          duration: '50 mins',
          items: [
            'Security groups as stateful firewalls (open only 22/80/443)',
            'VPC/subnet basics you actually need',
            'The difference between SGs and NACLs (overview)',
          ],
        },
        {
          id: 'linux-admin',
          title: 'Linux server basics',
          duration: '60 mins',
          items: [
            'SSH in; users, sudo, file permissions',
            'Package manager, installing Node',
            'Reading logs (journalctl), disk/memory (df/free/top)',
            'EBS volumes and why data lives there',
          ],
        },
        {
          id: 'build-145',
          title: 'Build: a reachable server',
          duration: '35 mins',
          items: [
            'Launch, SSH in, install Node',
            'Run a hello server on a port and hit it via the public IP',
            'Lock the security group down to what you need',
          ],
        },
      ],
    },
    {
      id: 'day154',
      title: 'Day 154: Deploy a Node App on a VPS from Scratch',
      duration: '5 hours',
      topics: [
        {
          id: 'get-code',
          title: 'Get the app onto the server',
          duration: '45 mins',
          items: [
            'Clone from Git (deploy keys) or pull a Docker image',
            'Install prod dependencies / build',
            'Environment/secrets on the server (not in the repo)',
          ],
        },
        {
          id: 'process-manager',
          title: 'Keep it running: PM2 / systemd',
          duration: '55 mins',
          items: [
            'PM2: start, restart-on-crash, startup on boot, logs',
            'Or a systemd service unit for the app',
            'Cluster mode / multiple workers',
          ],
        },
        {
          id: 'nginx',
          title: 'Nginx reverse proxy',
          duration: '60 mins',
          items: [
            'Why put Nginx in front of Node (TLS, buffering, static)',
            'proxy_pass to your app port; WebSocket upgrade headers',
            'Serving static assets and gzip',
          ],
        },
        {
          id: 'build-146',
          title: 'Build: app live on the VPS',
          duration: '40 mins',
          items: [
            'App behind Nginx, managed by PM2/systemd',
            'Survives a reboot',
            'Logs are accessible for debugging',
          ],
        },
      ],
    },
    {
      id: 'day155',
      title: 'Day 155: Custom Domain + HTTPS + Hardening',
      duration: '4 hours',
      topics: [
        {
          id: 'point-domain',
          title: 'Point your domain at the server',
          duration: '40 mins',
          items: [
            'A record (or Route 53 alias) → the Elastic IP',
            'www vs apex; redirect one to the other',
            'Confirm DNS resolves to your box',
          ],
        },
        {
          id: 'letsencrypt',
          title: 'Free HTTPS with Certbot',
          duration: '50 mins',
          items: [
            'Let\'s Encrypt via Certbot for Nginx',
            'Auto-renewal (systemd timer/cron)',
            'HTTP → HTTPS redirect and HSTS',
          ],
        },
        {
          id: 'hardening',
          title: 'Hardening the server',
          duration: '50 mins',
          items: [
            'Firewall (ufw) + tight security groups',
            'Disable password SSH; keys only; non-root deploy user',
            'Automatic security updates; fail2ban basics',
          ],
        },
        {
          id: 'ops',
          title: 'Backups & zero-downtime restarts',
          duration: '30 mins',
          items: [
            'Backing up data/EBS snapshots',
            'Reloading Nginx / PM2 without dropping requests',
            'A minimal runbook for the box',
          ],
        },
      ],
    },
    {
      id: 'day156',
      title: 'Day 156: Project — Satellite Tile Delivery on AWS',
      duration: '5 hours',
      topics: [
        {
          id: 'plan',
          title: 'Architecture & IAM',
          duration: '40 mins',
          items: [
            'Draw the pieces: EC2 + S3 + CloudFront + Route 53 + a DB',
            'Least-privilege IAM user/role for the app',
            'Region and cost sanity check',
          ],
        },
        {
          id: 'storage-cdn',
          title: 'Storage + CDN + DNS',
          duration: '70 mins',
          items: [
            'S3 bucket with presigned uploads wired into the app',
            'CloudFront in front of assets with HTTPS',
            'Route 53 records for app + assets',
          ],
        },
        {
          id: 'server',
          title: 'Server + HTTPS + deploy',
          duration: '80 mins',
          items: [
            'App on EC2 behind Nginx, PM2/systemd, Certbot HTTPS',
            'Managed DB (RDS) or a container DB with backups',
            'A push-button (or CI) deploy from Phase 15',
          ],
          project: {
            title: 'Satellite Tile Delivery on AWS — DEPLOYED',
            description: 'Deploy a secure service for research teams to upload imagery batches and retrieve generated map tiles: least-privilege IAM, an EC2 API behind Nginx and HTTPS, S3 presigned upload, CloudFront delivery, Route 53, lifecycle policies, backup/restore evidence, budgets, and an operational runbook.',
            type: 'capstone',
            features: ['Scoped IAM roles, budget alert, tagged resources, and a written teardown checklist.', 'EC2/Nginx/HTTPS API issues presigned S3 uploads; CloudFront serves cacheable assets.', 'Route 53 domain, backup/restore test, health checks, and an operations runbook.'],
            hints: ['Start with a diagram that separates request, upload, storage, and delivery paths.', 'Budget alarms and resource tags are part of production engineering, not optional polish.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'AWS mental model, CLI setup, billing safety',
      'IAM: users/groups/roles, least-privilege policies, MFA, CLI profiles',
      'Domains & DNS from scratch: record types, Route 53, verification (TXT/SPF/DKIM/DMARC)',
      'S3: buckets, policies, presigned upload/download, static hosting',
      'CloudFront CDN + ACM HTTPS + signed content',
      'EC2/VPS: launch, security groups, Linux admin, Nginx, PM2/systemd',
      'Custom domain + Let\'s Encrypt HTTPS + server hardening',
    ],
    milestone: 'You can stand up and operate real infrastructure on AWS without hand-holding — the cloud/DevOps skill set that unlocks backend and platform roles.',
  },
};
