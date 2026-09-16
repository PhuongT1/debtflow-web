import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FormDialog } from '@/components/ui/form-dialog';
import { HelpModal } from '@/components/ui/help-modal';
import { PageHeader } from '@/components/ui/page';
import { DebtForm } from '../forms/debt-form';
import { API_URL } from '@/lib/config/environment';

type Translate = (key: string) => string;
type UserOption = { id: string; name: string; email: string };

const HELP_STEPS = [
  'Chọn khách hàng, chọn loại Phải thu nếu khách nợ mình hoặc Phải trả nếu mình nợ nhà cung cấp.',
  'Nhập số tiền, ngày phát sinh, ngày đến hạn và mã hóa đơn/đơn hàng nếu có.',
  'Gán sale phụ trách và đặt ngày follow-up nếu cần gọi khách nhắc thanh toán.',
  'Sau khi khách trả một phần, vào chi tiết công nợ để ghi nhận thanh toán.',
];

const HELP_TIPS = [
  'Dùng bộ lọc để xem riêng công nợ của từng sale hoặc các khoản quá hạn lâu.',
  'Nếu khách đang tranh chấp, chuyển trạng thái thu tiền sang Tranh chấp để manager dễ thấy.',
];

function buildExportHref(filters: Record<string, string | undefined>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) search.set(key, value);
  }

  return `${API_URL}/exports/debts?${search}`;
}

export function DebtsPageHeader({
  filters,
  t,
  users,
}: {
  filters: Record<string, string | undefined>;
  t: Translate;
  users: UserOption[];
}) {
  return (
    <PageHeader
      title={t('title')}
      description={t('description')}
      actions={
        <>
          <FormDialog
            buttonLabel={t('create')}
            description={t('createDescription')}
            title={t('create')}
          >
            <DebtForm users={users} />
          </FormDialog>
          <HelpModal
            title="Cách quản lý công nợ"
            description="Mỗi khoản bán thiếu hoặc khoản mình cần trả nên là một công nợ riêng để theo dõi rõ ràng."
            steps={HELP_STEPS}
            tips={HELP_TIPS}
          />
          <Button component={Link} href={buildExportHref(filters)} variant="secondary">
            {t('export')}
          </Button>
        </>
      }
    />
  );
}
