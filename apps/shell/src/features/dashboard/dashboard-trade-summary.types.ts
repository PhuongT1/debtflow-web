import type { formatMoney } from '@/lib/presentation/formatters';

export type TradeMetricProps = {
  amount: Parameters<typeof formatMoney>[0];
  count: number;
  label: string;
  tone: 'amber' | 'blue' | 'green' | 'red';
  unit: string;
};
