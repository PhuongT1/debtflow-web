import Link from 'next/link';

import styles from './product-hero.module.css';
import { ProductPhoto } from './product-photo';
import { ReceivableHighlight } from './receivable-highlight';

export function ProductHero() {
  return (
    <section className={`site-width ${styles.hero}`} aria-labelledby="marketing-hero-title">
      <div className={styles.banner}>
        <ProductPhoto />
        <div className={styles.copy}>
          <h1 id="marketing-hero-title">
            Quản lý công nợ <span>từ thu đến trả</span>
          </h1>
          <p>Biết ai còn nợ, khoản nào sắp đến hạn và đã thu hoặc trả bao nhiêu.</p>
          <a className={`button ${styles.cta}`} href="#hanh-trinh-cong-no">
            <span aria-hidden="true">▶</span> Xem luồng công nợ
          </a>
        </div>
      </div>
      <div className={styles.highlights}>
        <ReceivableHighlight />
        <Link href="/lp/quan-ly-cong-no" className={`${styles.highlight} ${styles.workflow}`}>
          <span className={styles.highlightLabel}>Quy trình thu nợ</span>
          <strong>Chuẩn bị danh sách cần thu</strong>
          <span>Rà soát khoản đến hạn, rồi theo dõi số dư sau khi thu.</span>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}
