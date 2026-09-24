'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-[#ADADA9] dark:text-[#4A4846] mb-8">
      <Link href="/" className="hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors p-1 -ml-1 rounded-lg hover:bg-[#F2F1EE] dark:hover:bg-[#232321]">
        <Home className="w-4 h-4" />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-[#D0CEC8] dark:text-[#3A3936]">/</span>
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors px-1.5 py-0.5 rounded-lg hover:bg-[#F2F1EE] dark:hover:bg-[#232321]">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#52524E] dark:text-[#9E9C98] px-1.5 py-0.5">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
