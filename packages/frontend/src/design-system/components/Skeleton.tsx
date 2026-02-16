import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-bg-tertiary', className)}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
    />
  );
}
