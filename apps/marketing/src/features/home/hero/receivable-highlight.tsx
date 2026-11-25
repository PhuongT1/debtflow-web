import {
  demoPartialPayment,
  demoReceivable,
  demoRemainingReceivable,
  formatDemoCurrency,
} from '@/features/product/debt-demo/debt-demo-data';

import styles from './receivable-highlight.module.css';

export function ReceivableHighlight() {
  const paidPercentage = (demoPartialPayment / demoReceivable.amount) * 100;

  return (
    <a href="#xem-demo" className={styles.card}>
      <span className={styles.header}>
        <strong>Thu tiền từng phần</strong>
        <span>Dữ liệu mẫu</span>
      </span>
      <span className={styles.partner}>{demoReceivable.partner}</span>
      <span className={styles.amount}>{formatDemoCurrency(demoRemainingReceivable)}</span>
      <span className={styles.remaining}>Còn phải thu</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.fill} style={{ width: `${paidPercentage}%` }} />
      </span>
      <span className={styles.footer}>
        <span className={styles.payment}>+{formatDemoCurrency(demoPartialPayment)} đã thu</span>
        <span className={styles.action}>
          Thử lọc khoản quá hạn <span aria-hidden="true">↗</span>
        </span>
      </span>
    </a>
  );
}
