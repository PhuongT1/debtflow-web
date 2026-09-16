import { Skeleton, type SkeletonProps } from '@mui/material';

export function AppSkeleton({ animation = 'wave', variant = 'rounded', ...props }: SkeletonProps) {
  return <Skeleton animation={animation} variant={variant} {...props} />;
}
