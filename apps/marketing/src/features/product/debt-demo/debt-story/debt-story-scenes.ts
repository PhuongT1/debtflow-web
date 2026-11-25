import { demoPartialPayment } from '../debt-demo-data';

export const debtStoryScenes = [
  {
    id: 'recorded',
    action: 'Ghi nhận khoản phải thu',
    status: 'Chờ thanh toán',
    event: 'Đã tạo khoản công nợ',
    detail: 'Mã công nợ, đối tác và ngày đến hạn nằm trong cùng một hồ sơ.',
    paid: 0,
  },
  {
    id: 'overdue',
    action: 'Phát hiện khoản quá hạn',
    status: 'Quá hạn',
    event: 'Khoản này cần được rà soát',
    detail: 'Lọc theo trạng thái để ưu tiên các khoản đã qua hạn thanh toán.',
    paid: 0,
  },
  {
    id: 'partially-paid',
    action: 'Ghi nhận thu một phần',
    status: 'Đã thu một phần',
    event: 'Đã ghi nhận một khoản thu',
    detail: 'Tiền đã thu được ghi vào lịch sử. Sổ hiển thị số dư còn phải thu.',
    paid: demoPartialPayment,
  },
] as const;

export type DebtStoryScene = (typeof debtStoryScenes)[number];
