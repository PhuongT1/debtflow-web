'use client';

import { useTranslations } from 'next-intl';
import { FilterToolbar, type FilterToolbarProps } from '@packages/ui-react';

type DataTableToolbarProps = Omit<FilterToolbarProps, 'showLabel' | 'hideLabel'>;

export function DataTableToolbar(props: DataTableToolbarProps) {
  const t = useTranslations('Filters');
  return <FilterToolbar {...props} showLabel={t('show')} hideLabel={t('hide')} />;
}
