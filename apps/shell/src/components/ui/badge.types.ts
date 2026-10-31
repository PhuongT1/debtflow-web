import type { toneClass } from './badge';

export type BadgeProps = {
  children: React.ReactNode;
  tone?: keyof typeof toneClass;
};
