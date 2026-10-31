import type { AppLocale } from '@packages/platform-contracts';

export type ShellIntlProviderProps = {
  children: React.ReactNode;
  initialLocale: AppLocale;
};
