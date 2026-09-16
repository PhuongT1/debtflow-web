import type { AppLocale } from '@debtflow/contracts';

const messages = {
  vi: {
    'workspace.name': 'Debt Flow · Thanh toán', 'workspace.subtitle': 'Không gian quản lý lịch sử thanh toán', 'workspace.language': 'Ngôn ngữ', 'workspace.signOut': 'Đăng xuất', 'workspace.signIn': 'Đăng nhập', 'workspace.navigation': 'Điều hướng thanh toán', 'workspace.overview': 'Tổng quan', 'workspace.payments': 'Thanh toán',
    'history.title': 'Lịch sử thanh toán', 'history.description': 'Theo dõi các khoản thanh toán một phần hoặc tất toán.', 'history.help': '? Hướng dẫn', 'history.partnerFilter': 'Đang hiển thị thanh toán của đối tác đã chọn.', 'history.loading': 'Đang tải...', 'history.emptyTitle': 'Chưa có lịch sử thanh toán', 'history.emptyDescription': 'Các khoản thu sẽ xuất hiện tại đây.', 'history.date': 'Ngày', 'history.debtCode': 'Chứng từ cấn trừ', 'history.partner': 'Đối tác', 'history.amount': 'Số tiền', 'history.method': 'Phương thức', 'history.recordedBy': 'Người ghi nhận', 'history.actions': 'Thao tác', 'history.delete': 'Xóa', 'history.summary': 'Hiển thị {{shown}} / {{total}} dòng', 'history.rows': 'Số dòng', 'history.page': 'Trang {{page}}/{{totalPages}}', 'history.deleteConfirm': 'Bạn chắc chắn muốn xóa thanh toán này? Số dư công nợ sẽ được tính lại.', 'history.deleteError': 'Không thể xóa thanh toán. Vui lòng thử lại.', 'history.loadError': 'Không thể tải lịch sử thanh toán.',
    'method.cash': 'Tiền mặt', 'method.bankTransfer': 'Chuyển khoản', 'method.other': 'Khác',
  },
  en: {
    'workspace.name': 'Debt Flow · Payments', 'workspace.subtitle': 'Payment operations workspace', 'workspace.language': 'Language', 'workspace.signOut': 'Sign out', 'workspace.signIn': 'Sign in', 'workspace.navigation': 'Payments navigation', 'workspace.overview': 'Overview', 'workspace.payments': 'Payments',
    'history.title': 'Payment history', 'history.description': 'Track partial and full settlement payments.', 'history.help': '? Help', 'history.partnerFilter': 'Filtered by the selected partner.', 'history.loading': 'Loading...', 'history.emptyTitle': 'No payment history yet', 'history.emptyDescription': 'Recorded payments will appear here.', 'history.date': 'Date', 'history.debtCode': 'Debt code', 'history.partner': 'Partner', 'history.amount': 'Amount', 'history.method': 'Method', 'history.recordedBy': 'Recorded by', 'history.actions': 'Actions', 'history.delete': 'Delete', 'history.summary': 'Showing {{shown}} / {{total}} rows', 'history.rows': 'Rows', 'history.page': 'Page {{page}}/{{totalPages}}', 'history.deleteConfirm': 'Are you sure you want to delete this payment? The debt balance will be recalculated.', 'history.deleteError': 'Failed to delete payment. Please try again.', 'history.loadError': 'Could not load payment history.',
    'method.cash': 'Cash', 'method.bankTransfer': 'Bank transfer', 'method.other': 'Other',
  },
} as const;

export type PaymentMessageKey = keyof typeof messages.vi;

export function paymentMessage(locale: AppLocale, key: PaymentMessageKey, values: Record<string, string | number> = {}): string {
  let message: string = messages[locale][key];
  Object.entries(values).forEach(([name, value]) => {
    message = message.replaceAll(`{{${name}}}`, String(value));
  });
  return message;
}
