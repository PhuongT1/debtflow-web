import type { AppIconName } from '@/components/ui/app-icon';

export type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: 'blue' | 'green' | 'amber' | 'red';
  icon?: AppIconName;
};
