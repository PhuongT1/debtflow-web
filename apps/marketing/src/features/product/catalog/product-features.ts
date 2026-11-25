export const featurePath = '/tinh-nang';

export const productFeatures = [
  {
    slug: 'quan-ly-cong-no',
    title: 'Quản lý công nợ',
    image: '/images/shared/product/finance-team.webp',
    imageAlt: 'Nhân viên kiểm tra công nợ tại văn phòng kho hàng',
    description: 'Theo dõi khoản phải thu, phải trả và số dư còn lại theo từng đối tác.',
    details: [
      'Ghi nhận số tiền, ngày phát sinh và hạn thanh toán của từng khoản.',
      'Lọc danh sách theo đối tác, trạng thái và ngày đến hạn.',
      'Theo dõi khoản quá hạn và xuất danh sách công nợ ra Excel.',
    ],
  },
  {
    slug: 'quan-ly-doi-tac',
    title: 'Quản lý đối tác',
    image: '/images/shared/product/business-partners.webp',
    imageAlt: 'Đại diện cửa hàng và nhà cung cấp trao đổi chứng từ',
    description: 'Quản lý hồ sơ khách hàng và nhà cung cấp ở cùng một nơi.',
    details: [
      'Lưu thông tin liên hệ, mã số thuế và địa chỉ của đối tác.',
      'Tìm kiếm và lọc khách hàng hoặc nhà cung cấp.',
      'Theo dõi số dư công nợ theo từng hồ sơ.',
    ],
  },
  {
    slug: 'thanh-toan',
    title: 'Theo dõi thanh toán',
    image: '/images/shared/product/payment-reconciliation.webp',
    imageAlt: 'Chứng từ và máy tính cầm tay trên bàn đối chiếu thanh toán',
    description: 'Ghi nhận khoản đã thu, đã trả và theo dõi tiền được phân bổ vào từng khoản nợ.',
    details: [
      'Ghi nhận thanh toán cho một khoản nợ hoặc phân bổ cho nhiều khoản.',
      'Tra cứu lịch sử thanh toán và các khoản nợ đã được cấn trừ.',
      'Đối chiếu số tiền đã thanh toán với số dư còn lại.',
    ],
  },
];

export function findProductFeature(slug: string) {
  return productFeatures.find((feature) => feature.slug === slug);
}
