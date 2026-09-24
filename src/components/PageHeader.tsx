'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { RoadmapVariant } from '@/types';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  description?: string;
  variant?: RoadmapVariant;
}

export function PageHeader({ breadcrumbs, title, subtitle, description, variant = 'rose' }: PageHeaderProps) {
  const accentColor = {
    rose: '#9A6452',
    emerald: '#4F7F64',
    blue: '#507290',
  }[variant];
  
  return (
    <div className="mb-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-[#ADADA9] dark:text-[#4A4846] mb-6">
        <Link href="/" className="hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors p-1 -ml-1 rounded-lg hover:bg-[#F2F1EE] dark:hover:bg-[#232321]">
          <Home className="w-4 h-4" />
        </Link>
        {breadcrumbs.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-[#D0CEC8] dark:text-[#3A3936]">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors px-1.5 py-0.5 rounded-lg hover:bg-[#F2F1EE] dark:hover:bg-[#232321]">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#52524E] dark:text-[#9E9C98] px-1.5 py-0.5">{item.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Title Block */}
      <div>
        {subtitle && (
          <p className="text-xs font-medium mb-2 tracking-wide" style={{ color: accentColor }}>
            {subtitle}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-3 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[#52524E] dark:text-[#9E9C98] text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
