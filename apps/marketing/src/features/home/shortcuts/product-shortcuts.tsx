import Link from 'next/link';

import { featurePath } from '@/features/product/catalog/product-features';

import styles from './product-shortcuts.module.css';

const shortcuts = [
  {
    title: 'Công nợ',
    detail: 'Khoản phải thu, phải trả',
    href: featurePath + '/quan-ly-cong-no',
    symbol: '₫',
    tone: 'blue',
  },
  {
    title: 'Đối tác',
    detail: 'Khách hàng, nhà cung cấp',
    href: featurePath + '/quan-ly-doi-tac',
    symbol: '◎',
    tone: 'violet',
  },
  {
    title: 'Thanh toán',
    detail: 'Tra cứu lịch sử thu và trả',
    href: featurePath + '/thanh-toan',
    symbol: '✓',
    tone: 'green',
  },
  {
    title: 'Demo công nợ',
    detail: 'Thử bằng dữ liệu mẫu',
    href: '#hanh-trinh-cong-no',
    symbol: '▶',
    tone: 'amber',
  },
];

export function ProductShortcuts() {
  return (
    <nav className={`site-width ${styles.shortcuts}`} aria-label="Lối tắt tính năng">
      <ul>
        {shortcuts.map(({ title, detail, href, symbol, tone }) => (
          <li key={title}>
            <Link href={href} data-tone={tone}>
              <span className={styles.symbol} aria-hidden="true">
                {symbol}
              </span>
              <span className={styles.copy}>
                <strong>{title}</strong>
                <span>{detail}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
