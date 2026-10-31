'use client';
import { ApplicationError } from '@/components/ui/application-error';

import type { RootErrorProps } from './error.types';
export default function RootError(props: RootErrorProps) {
  return <ApplicationError {...props} fullPage />;
}
