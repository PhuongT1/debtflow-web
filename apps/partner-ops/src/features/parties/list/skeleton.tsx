import { useTranslations } from 'next-intl';
import { partnerListLayout } from '@packages/platform-registry';
import { ListPageSkeleton } from '@packages/ui-react';

export function PartyListSkeleton() {
  const t = useTranslations('Parties');
  return <ListPageSkeleton layout={partnerListLayout} label={t('title')} />;
}
