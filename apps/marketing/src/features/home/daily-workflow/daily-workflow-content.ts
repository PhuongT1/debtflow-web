import { featurePath } from '@/features/product/catalog/product-features';

export const dailyWorkflowSteps = [
  {
    id: 'review',
    label: 'Rà soát đầu ngày',
    title: 'Biết khoản nào cần xử lý trước',
    description:
      'Mở danh sách phải thu và lọc những khoản đã quá hạn. Kiểm tra số dư theo từng khách hàng để biết cần liên hệ với ai trong ngày.',
    steps: ['Lọc khoản quá hạn', 'Mở hồ sơ khách hàng', 'Kiểm tra số dư cần thu'],
    image: '/images/shared/product/finance-team.webp',
    imageAlt: 'Nhân viên kiểm tra công nợ tại văn phòng kho hàng',
    href: '#xem-demo',
    action: 'Thử lọc trên sổ mẫu',
  },
  {
    id: 'contact',
    label: 'Trao đổi với đối tác',
    title: 'Có đủ thông tin trước khi liên hệ',
    description:
      'Khi khách hỏi về một khoản nợ, mở hồ sơ để xem thông tin liên hệ, ngày đến hạn và các khoản còn dư. Cả hai bên có thể đối chiếu theo cùng một khoản.',
    steps: [
      'Tìm tên khách hàng hoặc nhà cung cấp',
      'Kiểm tra thông tin liên hệ',
      'Mở khoản đang cần đối chiếu',
    ],
    image: '/images/shared/product/business-partners.webp',
    imageAlt: 'Đại diện cửa hàng và nhà cung cấp trao đổi chứng từ',
    href: `${featurePath}/quan-ly-doi-tac`,
    action: 'Xem cách quản lý đối tác',
  },
  {
    id: 'reconcile',
    label: 'Đối chiếu cuối ngày',
    title: 'Nắm số dư sau khi ghi nhận tiền về',
    description:
      'Gắn khoản tiền vừa nhận với khoản nợ tương ứng. Khi trả hoặc thu từng phần, số còn lại và lịch sử thanh toán giúp bạn đối chiếu vào cuối ngày.',
    steps: [
      'Ghi nhận số tiền đã thu hoặc trả',
      'Đối chiếu khoản tiền với công nợ',
      'Kiểm tra số dư còn lại',
    ],
    image: '/images/shared/product/payment-reconciliation.webp',
    imageAlt: 'Chứng từ và máy tính trên bàn đối chiếu thanh toán',
    href: `${featurePath}/thanh-toan`,
    action: 'Xem cách theo dõi thanh toán',
  },
] as const;
