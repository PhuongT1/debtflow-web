export const demoReceivable = {
  code: 'CN-1042',
  partner: 'Nội thất An Phú',
  dueDate: '2026-11-18',
  amount: 24500000,
  overdue: true,
};

export const demoPartialPayment = 10000000;
export const demoRemainingReceivable = demoReceivable.amount - demoPartialPayment;

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export function formatDemoCurrency(amount: number) {
  return currency.format(amount);
}

const dueDate = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
});

export function formatDemoDueDate(date: string) {
  return dueDate.format(new Date(date));
}
