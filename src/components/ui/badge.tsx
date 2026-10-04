import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-cyan/15 text-cyan border-cyan/30 shadow-[0_0_12px_rgba(0,242,254,0.2)]',
        secondary:
          'border border-white/10 bg-slate-900/60 text-slate-300',
        destructive:
          'border border-transparent bg-destructive text-destructive-foreground',
        outline:
          'text-foreground border border-white/20',
        neon:
          'border border-pink-500/30 bg-pink-500/15 text-pink-300 shadow-[0_0_12px_rgba(255,0,127,0.25)]',
        purple:
          'border border-purple-500/30 bg-purple-500/15 text-purple-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
