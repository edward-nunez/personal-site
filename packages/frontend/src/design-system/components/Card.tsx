import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const variantStyles = {
  default: 'bg-bg-secondary border border-border',
  elevated: 'bg-bg-elevated border border-border shadow-md',
  outlined: 'bg-transparent border border-border',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', padding = 'md', hoverable = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-normal',
          variantStyles[variant],
          paddingStyles[padding],
          hoverable && 'hover:border-border-hover hover:shadow-lg cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
