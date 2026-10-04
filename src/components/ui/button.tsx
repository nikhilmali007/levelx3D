import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] hover:brightness-110',
        neon:
          'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(255,0,127,0.35)] hover:shadow-[0_0_30px_rgba(255,0,127,0.6)] hover:brightness-110',
        secondary:
          'bg-slate-900/80 text-white border border-white/10 hover:bg-slate-800/80 hover:border-white/20 backdrop-blur-md',
        outline:
          'border border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan shadow-[0_0_15px_rgba(0,242,254,0.15)]',
        ghost:
          'text-slate-300 hover:text-white hover:bg-white/10',
        destructive:
          'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3.5 text-xs',
        lg: 'h-13 rounded-2xl px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
