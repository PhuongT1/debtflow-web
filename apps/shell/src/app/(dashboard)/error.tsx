'use client';
import { ApplicationError } from '@/components/ui/application-error';

import type { DashboardErrorProps } from './error.types';
export default function DashboardError(props: DashboardErrorProps) {
  return <ApplicationError {...props} />;
}
