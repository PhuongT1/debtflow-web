import type { Translate, UserOption } from './page-header';

export type DebtsPageHeaderProps = {
  filters: Record<string, string | undefined>;
  t: Translate;
  users: UserOption[];
};
