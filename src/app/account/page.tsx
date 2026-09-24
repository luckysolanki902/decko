import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { getSession } from '@/lib/auth';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { SignOutButton } from '@/components/auth/SignOutButton';

export const metadata: Metadata = {
  title: 'Your account',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getSession();
  // Middleware already gates /account; this is the defence-in-depth copy that
  // also gives the page a typed, non-null session to render from.
  if (!session) {
    redirect('/login?next=/account');
  }

  return (
    <main className="min-h-screen px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Your account</h1>
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">
          Your progress, streaks, trackers and revision history are tied to this username.
        </p>

        <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Profile</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-[var(--text-secondary)]">Username</dt>
              <dd className="font-mono text-sm text-[var(--text-primary)]">{session.username}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-[var(--text-secondary)]">Display name</dt>
              <dd className="text-sm text-[var(--text-primary)]">{session.displayName}</dd>
            </div>
          </dl>
        </section>

        <section id="password" className="mt-6 scroll-mt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Change password
          </h2>
          <p className="mt-2 mb-5 text-sm text-[var(--text-secondary)]">
            There is no email on file, so there is no password reset link. Keep this password somewhere safe.
          </p>
          <ChangePasswordForm />
        </section>

        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Session</h2>
          <p className="mt-2 mb-5 text-sm text-[var(--text-secondary)]">
            Signing out clears the session cookie on this device only.
          </p>
          <SignOutButton />
        </section>
      </div>
    </main>
  );
}
