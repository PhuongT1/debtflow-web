import {
  MONEY_DECIMAL_PATTERN,
  normalizePositiveDecimal,
  QUANTITY_DECIMAL_PATTERN,
} from '@/lib/forms/decimal';

type DebtLineAmountInput = { quantity?: string; unitPrice?: string };

function scaledInteger(value: string, scale: number): bigint {
  const [whole, fraction = ''] = value.split('.');
  return BigInt(whole + fraction.padEnd(scale, '0'));
}

function lineAmountCents({ quantity, unitPrice }: DebtLineAmountInput): bigint {
  const validQuantity = normalizePositiveDecimal(quantity ?? '', QUANTITY_DECIMAL_PATTERN);
  const validPrice = normalizePositiveDecimal(unitPrice ?? '', MONEY_DECIMAL_PATTERN);
  if (!validQuantity || !validPrice) return BigInt(0);

  // The API rounds each line half-up to cents before adding document totals.
  return (
    (scaledInteger(validQuantity, 3) * scaledInteger(validPrice, 2) + BigInt(500)) / BigInt(1000)
  );
}

export function sumDebtLineAmounts(items: readonly DebtLineAmountInput[]): `${number}` {
  const cents = items.reduce((total, item) => total + lineAmountCents(item), BigInt(0));
  const digits = cents.toString().padStart(3, '0');
  return `${digits.slice(0, -2)}.${digits.slice(-2)}` as `${number}`;
}
