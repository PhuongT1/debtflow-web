'use client';

import { Tab, Tabs } from '@mui/material';
import { useTranslations } from 'next-intl';

import type { DocumentTabsProps } from './tabs.types';

export function DocumentTabs({ value, onChange }: DocumentTabsProps) {
  const t = useTranslations('Debts');
  return (
    <Tabs value={value} onChange={(_, nextValue) => onChange(nextValue)} sx={{ minHeight: 40 }}>
      <Tab label={t('all')} value="" />
      <Tab label={t('receivable')} value="RECEIVABLE" />
      <Tab label={t('payable')} value="PAYABLE" />
    </Tabs>
  );
}
