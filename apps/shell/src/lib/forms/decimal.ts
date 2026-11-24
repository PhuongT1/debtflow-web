export const MONEY_DECIMAL_PATTERN = /^\d{1,16}(\.\d{1,2})?$/;
export const QUANTITY_DECIMAL_PATTERN = /^\d{1,11}(\.\d{1,3})?$/;

export function normalizePositiveDecimal(value: string, pattern: RegExp): string | null {
  const normalized = value
    .trim()
    .replace(/^\+/, '')
    .replace(/^0+(?=\d)/, '')
    .replace(/^\./, '0.');
  return pattern.test(normalized) && /[1-9]/.test(normalized) ? normalized : null;
}
