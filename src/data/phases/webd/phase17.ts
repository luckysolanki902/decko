import { Phase } from '@/types';

export const phase17: Phase = {
  id: 'phase17',
  number: 17,
  title: 'Google Cloud & DevOps',
  subtitle: 'GCP projects/IAM, Cloud Storage & DNS, Compute Engine, Cloud Run, Cloud SQL, and DevOps practices',
  duration: '6 Days | ~28 Hours',
  days: 'Days 157-162',
  goal: 'Become cloud-portable: apply the mental models from AWS to Google Cloud, deploy containers serverlessly on Cloud Run, and adopt the DevOps practices (monitoring, secrets, IaC) that keep production healthy.',
  icon: '🌐',
  color: 'blue',
  sections: [
    {
      id: 'day157',
      title: 'Day 157: GCP Mental Model & Setup',
      duration: '4 hours',
      topics: [
        {
          id: 'gcp-model',
          title: 'How GCP is organized',
          duration: '50 mins',
          items: [
            'Organization → Folder → Project → Resources hierarchy',
            'Projects as the unit of billing/isolation',
            'GCP ↔ AWS map (Cloud Storage≈S3, Compute Engine≈EC2, Cloud Run≈Fargate/App Runner)',
            'Regions and zones',
          ],
        },
        {
          id: 'gcp-iam',
          title: 'IAM on GCP',
          duration: '50 mins',
          items: [
            'Members, roles (primitive/predefined/custom), and bindings',
            'Service accounts (the GCP way to give apps identity)',
            'Least privilege and the difference from AWS IAM',
          ],
        },
        {
          id: 'gcloud',
          title: 'gcloud CLI & console',
          duration: '50 mins',
          items: [
            'Install and gcloud init (auth, project, region)',
            'Configurations for multiple projects',
            'Enabling APIs before you can use a service',
          ],
        },
        {
          id: 'billing',
          title: 'Billing & safety',
          duration: '30 mins',
          items: [
            'Free tier/credits and budgets/alerts',
            'Quotas and how they bite',
            'Cleaning up to avoid charges',
          ],
        },
      ],
    },
    {
      id: 'day158',
      title: 'Day 158: Cloud Storage & Cloud DNS',
      duration: '4 hours',
      topics: [
        {
          id: 'gcs',
          title: 'Cloud Storage (buckets)',
          duration: '55 mins',
          items: [
            'Buckets, objects, storage classes',
            'IAM vs signed URLs for access',
            'Signed URLs for direct upload/download (parallels S3 presigned)',
            'Static website hosting',
          ],
        },
        {
          id: 'cloud-dns',
          title: 'Cloud DNS',
          duration: '55 mins',
          items: [
            'Managed zones (parallels Route 53)',
            'A/CNAME/TXT/MX records via console and gcloud',
            'Delegating a domain to Cloud DNS nameservers',
          ],
        },
        {
          id: 'cdn',
          title: 'Cloud CDN & load balancing (overview)',
          duration: '40 mins',
          items: [
            'Serving bucket/content through Cloud CDN',
            'The global HTTPS load balancer concept',
            'Managed SSL certificates',
          ],
        },
        {
          id: 'build-150',
          title: 'Build: storage + domain',
          duration: '30 mins',
          items: [
            'Upload assets to a bucket with a signed URL',
            'Point a subdomain via Cloud DNS',
            'Serve over HTTPS',
          ],
        },
      ],
    },
    {
      id: 'day159',
      title: 'Day 159: Compute Engine & Networking',
      duration: '4 hours',
      topics: [
        {
          id: 'gce',
          title: 'Compute Engine VMs',
          duration: '55 mins',
          items: [
            'Create a VM, machine types, images',
            'SSH via gcloud/browser',
            'Startup scripts and metadata',
          ],
        },
        {
          id: 'vpc',
          title: 'VPC & firewall rules',
          duration: '50 mins',
          items: [
            'VPC networks and subnets',
            'Firewall rules (parallels security groups)',
            'External vs internal IPs',
          ],
        },
        {
          id: 'deploy-vm',
          title: 'Deploy a Node app on a VM',
          duration: '45 mins',
          items: [
            'Install runtime, run under a process manager',
            'Open the right firewall ports',
            'When a VM is the wrong choice vs Cloud Run',
          ],
        },
        {
          id: 'lb-basics',
          title: 'Load balancing basics',
          duration: '30 mins',
          items: [
            'Instance groups and health checks',
            'Fronting VMs with a load balancer',
            'Autoscaling concept',
          ],
        },
      ],
    },
    {
      id: 'day160',
      title: 'Day 160: Cloud Run — Deploy Containers Serverlessly',
      duration: '5 hours',
      topics: [
        {
          id: 'why-cloud-run',
          title: 'Why Cloud Run',
          duration: '45 mins',
          items: [
            'Run a container without managing servers',
            'Scale to zero; pay per request',
            'The bridge from Phase 15 Docker to production',
          ],
        },
        {
          id: 'artifact-registry',
          title: 'Artifact Registry + build',
          duration: '55 mins',
          items: [
            'Push your image to Artifact Registry',
            'Cloud Build (or build locally and push)',
            'Image tagging and versions',
          ],
        },
        {
          id: 'deploy-run',
          title: 'Deploy & configure',
          duration: '60 mins',
          items: [
            'gcloud run deploy: region, memory/CPU, concurrency',
            'Env vars and Secret Manager integration',
            'Min/max instances and cold starts',
            'Custom domain mapping + managed TLS',
          ],
        },
        {
          id: 'build-152',
          title: 'Build: container live on Cloud Run',
          duration: '55 mins',
          items: [
            'Deploy your Phase 15 image',
            'Wire secrets and env',
            'Map a custom domain over HTTPS',
          ],
        },
      ],
    },
    {
      id: 'day161',
      title: 'Day 161: Cloud SQL & DevOps Practices',
      duration: '5 hours',
      topics: [
        {
          id: 'cloud-sql',
          title: 'Cloud SQL (managed database)',
          duration: '55 mins',
          items: [
            'Provision Postgres/MySQL managed instance',
            'Connecting securely from Cloud Run (connector/proxy)',
            'Backups, high availability, and read replicas (overview)',
          ],
        },
        {
          id: 'secrets',
          title: 'Secrets & config management',
          duration: '45 mins',
          items: [
            'Secret Manager for API keys/DB creds',
            'Injecting secrets into Cloud Run',
            'Rotating secrets; never in the image',
          ],
        },
        {
          id: 'observability',
          title: 'Monitoring, logging & alerting',
          duration: '55 mins',
          items: [
            'Cloud Logging: structured logs from your app',
            'Cloud Monitoring: metrics, dashboards, uptime checks',
            'Alerting policies (error rate, latency, budget)',
            'The four golden signals (latency, traffic, errors, saturation)',
          ],
        },
        {
          id: 'iac',
          title: 'Infrastructure as Code (intro)',
          duration: '40 mins',
          items: [
            'Why IaC: reproducible, reviewable infra',
            'Terraform basics: providers, resources, state, plan/apply',
            'Defining a bucket/Cloud Run service in Terraform',
          ],
        },
      ],
    },
    {
      id: 'day162',
      title: 'Day 162: Project — Water-Quality Telemetry Reliability on GCP',
      duration: '5 hours',
      topics: [
        {
          id: 'spec',
          title: 'Spec & architecture',
          duration: '35 mins',
          items: [
            'Containerized app → Cloud Run + Cloud SQL + Cloud Storage',
            'Domain via Cloud DNS, secrets via Secret Manager',
            'Draw it and list the IAM/service accounts needed',
          ],
        },
        {
          id: 'deploy',
          title: 'Deploy the stack',
          duration: '90 mins',
          items: [
            'Build & push image; deploy to Cloud Run',
            'Connect Cloud SQL + storage; wire secrets',
            'Custom domain + managed HTTPS',
          ],
        },
        {
          id: 'ci',
          title: 'CI/CD to Cloud Run',
          duration: '60 mins',
          items: [
            'GitHub Actions → build → push → deploy (callback to Phase 15)',
            'Workload Identity Federation (no long-lived keys)',
            'Staging → production with approval',
          ],
        },
        {
          id: 'playbook',
          title: 'DevOps playbook',
          duration: '55 mins',
          items: [
            'Monitoring dashboards + alerts wired up',
            'Rollback plan and an incident runbook',
            'Cost review and cleanup',
          ],
          project: {
            title: 'Water-Quality Telemetry Reliability on GCP — DEPLOYED',
            description: 'Deploy a telemetry intake and public-status service to Cloud Run with Cloud SQL and Cloud Storage dependencies, Secret Manager, a custom domain, and CI/CD through workload identity. Define freshness and availability objectives, test stale-sensor and database failures, wire actionable alerts, record costs, and prove rollback.',
            type: 'capstone',
            features: ['Cloud Run service with Secret Manager, Cloud SQL/Storage integration, and a custom HTTPS domain.', 'GitHub Actions deployment through workload identity—no long-lived cloud keys.', 'A dashboard or README scorecard covering health, latency, errors, alerts, cost, and rollback.'],
            hints: ['Define the failure signals before deploying: availability, latency, error rate, and dependency health.', 'Your reliability scorecard should name the action to take for every alert.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'GCP hierarchy, IAM/service accounts, gcloud CLI',
      'Cloud Storage (signed URLs) and Cloud DNS',
      'Compute Engine VMs, VPC, firewall rules, load balancing',
      'Cloud Run: container deploys, scaling, secrets, custom domains',
      'Cloud SQL, Secret Manager, and Cloud Logging/Monitoring',
      'DevOps: observability, alerting, IaC (Terraform), CI/CD to Cloud Run',
    ],
    milestone: 'You are cloud-portable and DevOps-literate: you can deploy and operate containerized apps on a second major cloud with monitoring and IaC — exactly what cloud/DevOps interviews probe.',
  },
};
