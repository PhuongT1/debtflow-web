export type MoneyValue = number | string | { toString(): string };

export function formatMoney(value: MoneyValue, locale: string, currency = 'VND') {
  const numericValue = Number(value.toString());
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

export function toDateInputValue(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}
