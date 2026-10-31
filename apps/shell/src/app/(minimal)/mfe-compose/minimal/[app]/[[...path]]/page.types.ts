import type { SearchValues } from '@/components/microfrontends/composed-application';

export type MinimalLayoutMicrofrontendPageProps = {
  params: Promise<{ app: string; path?: string[] }>;
  searchParams: Promise<SearchValues>;
};
