import { FeatureList } from './feature-list';
import styles from './featured-products.module.css';

export function FeaturedProducts() {
  return (
    <section className={`site-width ${styles.section}`} aria-labelledby="features">
      <h2 className="section-title" id="features">
        Tính năng nổi bật
      </h2>
      <p>
        Mỗi khoản công nợ gắn với đối tác, hạn thanh toán và lịch sử thu chi để bạn tra cứu khi cần
        đối chiếu.
      </p>
      <FeatureList />
    </section>
  );
}
