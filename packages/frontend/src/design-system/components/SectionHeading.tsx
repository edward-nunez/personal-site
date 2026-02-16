import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'left',
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-12', align === 'center' && 'text-center', className)}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg mb-3">{title}</h2>
      {subtitle && <p className="text-lg text-fg-secondary max-w-2xl mx-auto">{subtitle}</p>}
      {children}
    </div>
  );
}
