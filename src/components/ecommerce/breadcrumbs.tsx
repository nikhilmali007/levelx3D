'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  theme?: 'light' | 'dark';
}

export function Breadcrumbs({ items, theme = 'light' }: BreadcrumbsProps) {
  const isLight = theme === 'light';
  const textColor = isLight ? 'text-slate' : 'text-slate';
  const activeColor = isLight ? 'text-ink' : 'text-chalk';

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-[11px] font-mono tracking-wider">
      <Link href="/" className={`${textColor} hover:${activeColor} transition-colors uppercase`}>
        Home
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center space-x-1.5">
            <ChevronRight className="w-3 h-3 text-slate/50 stroke-[1.5]" />
            {isLast || !item.href ? (
              <span className={`${activeColor} font-medium uppercase truncate max-w-[200px]`}>
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className={`${textColor} hover:${activeColor} transition-colors uppercase truncate max-w-[200px]`}>
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
