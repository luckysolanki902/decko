'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

import { AccountMenu } from '@/components/auth/AccountMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GITHUB_REPO_URL, SITE_NAME } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="text-[17px] font-semibold tracking-tight text-[var(--text-primary)]"
        >
          {SITE_NAME}
        </Link>

        <nav className="ml-4 hidden items-center gap-1 sm:flex">
          <Link
            href="/#courses"
            className="rounded-full px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Courses
          </Link>
          <Link
            href="/requests"
            className="rounded-full px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Requests
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Source on GitHub"
            className="hidden rounded-full p-2 text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)] sm:block"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
