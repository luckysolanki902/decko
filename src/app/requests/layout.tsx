import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a course or lecture',
  description: 'Vote for the next free decko course, phase, or lecture to be written and reviewed.',
  alternates: { canonical: '/requests' },
  openGraph: {
    title: 'Request a course or lecture',
    description: 'Vote for the next free decko course, phase, or lecture to be written and reviewed.',
    url: '/requests',
    images: ['/og/site/course/requests'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request a course or lecture',
    description: 'Vote for the next free decko course, phase, or lecture to be written and reviewed.',
    images: ['/og/site/course/requests'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
