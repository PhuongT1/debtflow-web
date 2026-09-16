export type DashboardPeriod = { dateFrom: string; dateTo: string };

function businessDate(value = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
  }).format(value);
}

function isDate(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export function getDashboardPeriod(query: Record<string, string | undefined>): DashboardPeriod {
  const today = businessDate();
  const dateFrom = isDate(query.dateFrom) ? query.dateFrom : today;
  const dateTo = isDate(query.dateTo) ? query.dateTo : today;

  return dateFrom <= dateTo ? { dateFrom, dateTo } : { dateFrom: today, dateTo: today };
}
