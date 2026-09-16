'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Box, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppDatePicker } from '@/components/ui/app-date-picker';
import { Button } from '@/components/ui/button';
import { AppSelect } from '@/components/ui/select';

type DashboardPeriodFilterProps = {
  dateFrom: string;
  dateTo: string;
};

type Preset = 'today' | 'last7Days' | 'thisMonth' | 'lastMonth' | 'custom';

function datesForPreset(preset: Exclude<Preset, 'custom'>) {
  const today = dayjs();
  if (preset === 'today') return { dateFrom: today.format('YYYY-MM-DD'), dateTo: today.format('YYYY-MM-DD') };
  if (preset === 'last7Days') return { dateFrom: today.subtract(6, 'day').format('YYYY-MM-DD'), dateTo: today.format('YYYY-MM-DD') };
  if (preset === 'thisMonth') return { dateFrom: today.startOf('month').format('YYYY-MM-DD'), dateTo: today.endOf('month').format('YYYY-MM-DD') };
  const previousMonth = today.subtract(1, 'month');
  return { dateFrom: previousMonth.startOf('month').format('YYYY-MM-DD'), dateTo: previousMonth.endOf('month').format('YYYY-MM-DD') };
}

export function DashboardPeriodFilter({ dateFrom, dateTo }: DashboardPeriodFilterProps) {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [from, setFrom] = useState(dateFrom);
  const [to, setTo] = useState(dateTo);
  const [error, setError] = useState('');
  const [preset, setPreset] = useState<Preset>('custom');

  useEffect(() => {
    setFrom(dateFrom);
    setTo(dateTo);
    setPreset('custom');
  }, [dateFrom, dateTo]);

  function selectPreset(nextPreset: Preset) {
    setPreset(nextPreset);
    if (nextPreset === 'custom') return;
    const range = datesForPreset(nextPreset);
    setFrom(range.dateFrom);
    setTo(range.dateTo);
    setError('');
  }

  function applyPeriod() {
    if (!from || !to) {
      setError(t('periodRequired'));
      return;
    }
    if (from > to) {
      setError(t('periodInvalid'));
      return;
    }
    setError('');
    router.replace('/?dateFrom=' + encodeURIComponent(from) + '&dateTo=' + encodeURIComponent(to));
  }

  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'grid',
        gap: 1.25,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'minmax(180px, 1.15fr) repeat(2, minmax(180px, 1fr)) auto' },
        width: '100%',
      }}
    >
      <AppSelect label={t('period')} onChange={(event) => selectPreset(event.target.value as Preset)} value={preset}>
        <MenuItem value="custom">{t('customRange')}</MenuItem>
        <MenuItem value="today">{t('today')}</MenuItem>
        <MenuItem value="last7Days">{t('last7Days')}</MenuItem>
        <MenuItem value="thisMonth">{t('thisMonth')}</MenuItem>
        <MenuItem value="lastMonth">{t('lastMonth')}</MenuItem>
      </AppSelect>
      <AppDatePicker label={t('fromDate')} onChange={(value) => { setFrom(value); setError(''); }} value={from} />
      <AppDatePicker label={t('toDate')} onChange={(value) => { setTo(value); setError(''); }} value={to} />
      <Button onClick={applyPeriod} sx={{ alignSelf: 'center', height: 40, mt: { xs: 0, lg: 1 } }} type="button" variant="secondary">
        {t('applyPeriod')}
      </Button>
      {error ? <Typography color="error" sx={{ fontSize: 12, gridColumn: '1 / -1' }}>{error}</Typography> : null}
    </Box>
  );
}
