export function formatMoney(value: number | string | { toString(): string }, currency = 'VND') {
  const numericValue = Number(value.toString());
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;

  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 0,
    }).format(safeValue) + ' đồng';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(safeValue);
}

export function toDateInputValue(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}
