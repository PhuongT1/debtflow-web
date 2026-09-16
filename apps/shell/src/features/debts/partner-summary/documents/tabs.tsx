'use client';

import { Tab, Tabs } from '@mui/material';
import { useTranslations } from 'next-intl';

export function DocumentTabs({
  value,
  onChange,
}: {
  value: '' | 'RECEIVABLE' | 'PAYABLE';
  onChange: (value: '' | 'RECEIVABLE' | 'PAYABLE') => void;
}) {
  const t = useTranslations('Debts');
  return (
    <Tabs value={value} onChange={(_, nextValue) => onChange(nextValue)} sx={{ minHeight: 40 }}>
      <Tab label={t('all')} value="" />
      <Tab label={t('receivable')} value="RECEIVABLE" />
      <Tab label={t('payable')} value="PAYABLE" />
    </Tabs>
  );
}
