import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { RequestsBoard } from '@/components/suggestions/RequestsBoard';

export const metadata: Metadata = {
  title: 'Requests',
  description:
    'Vote on what gets written next for decko — lectures, revision sets, whole courses, and corrections to existing material.',
};

export default function RequestsPage() {
  return (
    <main className="min-h-screen px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          What should be written next?
        </h1>

        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Every lecture here is written against a detailed set of teaching rules built from learning-science
          research, then reviewed and committed before anyone studies from it. The rules are public, in the
          repo, so you can check the standard rather than take my word for it.
        </p>

        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
          What there isn&rsquo;t is a &ldquo;generate&rdquo; button. Material produced while you wait is
          material nobody has checked before you — which is exactly where the vague, skip-a-step explanations
          come from. Everything here ships reviewed, so every learner gets the same vetted text.
        </p>

        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
          So instead: this board. Vote for what you want, add what is missing, and flag anything that reads as
          wrong or under-explained. The most-wanted items get written first.
        </p>

        <div className="mt-10">
          <RequestsBoard />
        </div>
      </div>
    </main>
  );
}
