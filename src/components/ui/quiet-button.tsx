'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface QuietButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'default' | 'lg';
  asChild?: boolean;
}

export const QuietButton = React.forwardRef<HTMLButtonElement, QuietButtonProps>(
  (
    {
      className,
      children,
      variant = 'light',
      size = 'default',
      ...props
    },
    ref
  ) => {
    const isLight = variant === 'light';

    const sizeClasses = {
      sm: 'text-xs py-2 px-3 min-h-[44px] inline-flex items-center',
      default: 'text-sm py-2.5 px-4 min-h-[44px] inline-flex items-center',
      lg: 'text-base py-3 px-6 min-h-[48px] inline-flex items-center',
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex items-center gap-2 font-heading font-light tracking-apple-wide transition-colors duration-200 outline-none select-none disabled:opacity-40 disabled:pointer-events-none',
          isLight ? 'text-ink hover:text-black' : 'text-chalk hover:text-white',
          sizeClasses,
          className
        )}
        {...props}
      >
        <span>{children}</span>

        {/* Quiet wipe-in underline on hover */}
        <span
          className={cn(
            'absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 transition-transform duration-380 ease-apple-out group-hover:scale-x-100',
            isLight ? 'bg-ink' : 'bg-chalk'
          )}
        />
      </button>
    );
  }
);

QuietButton.displayName = 'QuietButton';
