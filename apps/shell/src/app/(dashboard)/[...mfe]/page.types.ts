import type { SearchValues } from '@/components/microfrontends/composed-application';

export type MainLayoutMicrofrontendPageProps = {
  params: Promise<{ mfe: string[] }>;
  searchParams: Promise<SearchValues>;
};
