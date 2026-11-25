import Image from 'next/image';
import Link from 'next/link';

import { featurePath } from '@/features/product/catalog/product-features';

import styles from './product-use-cases.module.css';

const useCases = [
  {
    title: 'Khi bán hàng trả chậm',
    description:
      'Trước khi gọi khách hàng, xem khoản nào đã đến hạn và khách còn nợ bao nhiêu. Sau khi nhận tiền, kiểm tra số dư để thống nhất lại con số với khách.',
    details: ['Tìm công nợ theo tên khách hàng', 'Xem khoản quá hạn và lịch sử đã thu'],
    image: '/images/shared/product/finance-team.webp',
    imageAlt: 'Nhân viên kiểm tra chứng từ tại văn phòng kho hàng',
    link: '/quan-ly-cong-no',
    linkText: 'Xem quản lý công nợ',
  },
  {
    title: 'Khi mua hàng trả sau',
    description:
      'Lưu thông tin nhà cung cấp và theo dõi từng khoản cần trả. Khi đối chiếu cuối kỳ, mở lại lịch sử để biết khoản nào đã thanh toán và khoản nào còn dư.',
    details: ['Tra cứu hồ sơ nhà cung cấp', 'Đối chiếu từng khoản đã trả'],
    image: '/images/shared/product/business-partners.webp',
    imageAlt: 'Chủ cửa hàng và nhà cung cấp cùng xem chứng từ',
    link: '/thanh-toan',
    linkText: 'Xem theo dõi thanh toán',
  },
];

export function ProductUseCases() {
  return (
    <section className="site-width content-section" aria-labelledby="product-use-cases">
      <h2 className="section-title" id="product-use-cases">
        Hai tình huống dùng DebtFlow hằng ngày
      </h2>
      <div className={styles.list}>
        {useCases.map((useCase) => (
          <article className={styles.case} key={useCase.title}>
            <div className={styles.image}>
              <Image
                src={useCase.image}
                alt={useCase.imageAlt}
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
              />
            </div>
            <div className={styles.copy}>
              <h3>{useCase.title}</h3>
              <p>{useCase.description}</p>
              <ul>
                {useCase.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <Link className="text-link" href={featurePath + useCase.link}>
                {useCase.linkText} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
