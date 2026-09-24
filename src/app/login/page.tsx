import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to decko, or pick a username to create an account, and keep your progress, streaks and revision history.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <Link
        href="/"
        className="mb-8 text-lg font-semibold tracking-tight text-[var(--text-primary)]"
      >
        decko
      </Link>
      <AuthForm next={next} />
    </main>
  );
}
