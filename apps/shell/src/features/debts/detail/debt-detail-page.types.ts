import type { Params } from './debt-detail-page';

export type DebtDetailPageProps = Params & {
  searchParams: Promise<Record<string, string | undefined>>;
};
