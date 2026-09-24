import { Phase } from '@/types';

export const phase10: Phase = {
  id: 'phase10',
  number: 10,
  title: 'Image / File Storage at Scale',
  subtitle: 'Cloudinary, S3 + CloudFront, signed URLs, direct-to-storage uploads',
  duration: '5 Days | ~22 Hours',
  days: 'Days 113-117',
  goal: 'Move beyond "save a file path in Mongo" — handle uploads, transformations, signed URLs, and CDN delivery the way real apps do.',
  icon: '🖼️',
  color: 'rose',
  sections: [
    {
      id: 'day113',
      title: 'Day 113: The Storage Landscape',
      duration: '4 hours',
      topics: [
        {
          id: 'options',
          title: 'Cloudinary vs S3 vs Uploadcare vs Bunny',
          duration: '60 mins',
          items: [
            'Cloudinary: dev experience king, transformations free, costlier at scale',
            'S3 + CloudFront: cheapest at scale, you build everything',
            'Uploadcare / Bunny: middle ground',
            'Default for new projects: Cloudinary; switch later if needed',
          ],
        },
        {
          id: 'cdn',
          title: 'Why a CDN',
          duration: '40 mins',
          items: [
            'Geographic latency (Mumbai user, US server = slow)',
            'Edge caches static assets near users',
            'Reduces origin bandwidth bill',
          ],
        },
        {
          id: 'flow',
          title: 'Upload flow patterns',
          duration: '60 mins',
          items: [
            'Server-routed: client → your server → storage',
            'Direct upload: client → storage (with signed URL)',
            'Direct is mandatory at scale (saves your server bandwidth)',
          ],
        },
        {
          id: 'security',
          title: 'Security baseline',
          duration: '40 mins',
          items: [
            'Whitelist MIME + size on server',
            'Magic-byte sniff for image type (file-type pkg)',
            'Strip EXIF (privacy)',
            'Antivirus scan for arbitrary files (ClamAV or Cloudflare R2 features)',
          ],
        },
      ],
    },
    {
      id: 'day114',
      title: 'Day 114: Cloudinary Done Right',
      duration: '4 hours',
      topics: [
        {
          id: 'transformations',
          title: 'Transformations as URL params',
          duration: '60 mins',
          items: [
            '/w_400,h_400,c_fill,g_face/profile.jpg',
            'f_auto, q_auto for format/quality magic',
            'Versioned URLs to bust caches on re-upload',
          ],
        },
        {
          id: 'direct-upload',
          title: 'Direct unsigned + signed uploads',
          duration: '60 mins',
          items: [
            'Unsigned preset for low-risk public uploads',
            'Signed: server returns a signature, client uploads directly',
            'Folder + tag conventions',
          ],
        },
        {
          id: 'webhooks',
          title: 'Notification webhooks',
          duration: '40 mins',
          items: [
            'Cloudinary calls your webhook on upload/transform',
            'Update DB record with the secure_url',
            'Verify the signature in the webhook',
          ],
        },
        {
          id: 'gotchas',
          title: 'Gotchas at scale',
          duration: '40 mins',
          items: [
            'Free tier credits are limited',
            'Be careful with on-the-fly transforms (each unique URL = 1 credit)',
            'Use named transformations to standardize',
          ],
        },
      ],
    },
    {
      id: 'day115',
      title: 'Day 115: AWS S3 + CloudFront',
      duration: '5 hours',
      topics: [
        {
          id: 's3-basics',
          title: 'S3 bucket basics',
          duration: '60 mins',
          items: [
            'Create bucket, region, blocking public access (recommended)',
            'IAM user with least-privilege policy',
            'Bucket policies vs ACLs (use bucket policy)',
            'Versioning + lifecycle rules',
          ],
        },
        {
          id: 'sdk-upload',
          title: 'AWS SDK v3 uploads',
          duration: '60 mins',
          items: [
            '@aws-sdk/client-s3 + @aws-sdk/s3-request-presigner',
            'PutObjectCommand for server uploads',
            'Stream from Multer buffer',
          ],
        },
        {
          id: 'presigned',
          title: 'Pre-signed URLs',
          duration: '60 mins',
          items: [
            'Server signs a PUT URL valid for 5 minutes',
            'Client PUTs the file directly to S3',
            'Frontend uploads progress via xhr.upload',
            'Server records the eventual key in DB',
          ],
        },
        {
          id: 'cloudfront',
          title: 'CloudFront in front of S3',
          duration: '60 mins',
          items: [
            'Distribution with S3 origin + OAC (Origin Access Control)',
            'Block direct S3 access; only CloudFront serves',
            'Custom domain + ACM cert',
            'Cache TTLs for assets',
          ],
        },
        {
          id: 'signed-urls',
          title: 'CloudFront signed URLs / cookies',
          duration: '60 mins',
          items: [
            'For private content (e.g., paid courses)',
            'CloudFront key pair + signing',
            'Time-limited access',
          ],
        },
      ],
    },
    {
      id: 'day116',
      title: 'Day 116: Image Pipeline & Optimization',
      duration: '4 hours',
      topics: [
        {
          id: 'sharp',
          title: 'sharp for server-side processing',
          duration: '60 mins',
          items: [
            'Native (libvips) — fast',
            'Resize, format convert, strip EXIF',
            'Useful for profile pic squaring before storage',
          ],
        },
        {
          id: 'responsive',
          title: 'Responsive images on the web',
          duration: '50 mins',
          items: [
            '<img srcset> + sizes for browser to pick',
            'next/image does this for you (in Next apps)',
            'Avoid loading 4K image on mobile',
          ],
        },
        {
          id: 'placeholders',
          title: 'Placeholders & LQIP',
          duration: '40 mins',
          items: [
            'Blur placeholder for perceived perf',
            'Plaiceholder package generates base64 blurDataURL',
            'next/image accepts blurDataURL prop',
          ],
        },
        {
          id: 'file-types',
          title: 'PDFs, videos, audio',
          duration: '50 mins',
          items: [
            'PDFs: store + serve via signed URL',
            'Video: HLS streaming via Mux or Cloudflare Stream',
            'Audio: same approach as video for podcasts',
          ],
        },
      ],
    },
    {
      id: 'day117',
      title: 'Day 117: Project — Oral-History Archive Ingest',
      duration: '5 hours',
      topics: [
        {
          id: 'spec',
          title: 'Spec: a recipe gallery',
          duration: '20 mins',
          items: [
            'Multi-image recipes (gallery)',
            'Direct-to-S3 upload with progress bar',
            'CloudFront delivery',
            'Signed URLs for "private draft" recipes',
          ],
        },
        {
          id: 'backend',
          title: 'Backend: pre-signed URL endpoint',
          duration: '90 mins',
          items: [
            'POST /uploads/sign returns presigned PUT URL + key',
            'POST /recipes/:id/images saves the key after upload',
            'GET signed CloudFront URL for private images',
          ],
        },
        {
          id: 'frontend',
          title: 'Frontend: drag-drop + multi-upload',
          duration: '120 mins',
          items: [
            'react-dropzone for drag-drop',
            'Parallel upload of multiple files',
            'Per-file progress bar, retry on error',
            'Reorder via drag (dnd-kit)',
          ],
        },
        {
          id: 'capstone',
          title: 'Polish + ship',
          duration: '70 mins',
          items: [
            'CloudFront distribution live',
            'Bucket policy verified (no public access)',
            'README explains the upload flow with diagram',
          ],
          project: {
            title: 'Oral-History Archive Ingest — DEPLOYED',
            description: 'Build archive intake for interview audio, consent forms, portraits, and transcripts: direct browser uploads, private masters, signed cataloguer links, public-safe derivatives, checksum metadata, and withdrawal rules. Use S3-compatible storage, presigned URLs, appropriate CDN delivery, and document the threat model.',
            type: 'capstone',
            features: ['Direct-to-storage upload with server-issued signed policy/URL and MIME/size validation.', 'Private originals, expiring reviewer links, and public-safe thumbnail derivatives.', 'Upload progress, failure recovery, and a concise storage-security README.'],
            hints: ['The browser uploads bytes; your server should authorize and record metadata.', 'Never expose a permanent public URL for private evidence.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'Choose Cloudinary vs S3+CloudFront consciously',
      'Implement direct-to-storage uploads with signed URLs',
      'CloudFront fronting S3 with OAC',
      'Image pipeline: resize, format, blur placeholder',
    ],
    milestone: 'Your apps can handle uploads at production scale without melting the server.',
  },
};
