import styles from './debt-demo-section.module.css';
import { DebtPreview } from './debt-preview';

export function DebtDemoSection() {
  return (
    <section className={styles.section} id="xem-demo" aria-labelledby="demo-title">
      <div className={`site-width ${styles.inner}`}>
        <div>
          <h2 className="section-title" id="demo-title">
            Thử lọc các khoản quá hạn
          </h2>
          <p>
            Chọn <strong>Quá hạn</strong> trong sổ mẫu để xem những đối tác cần liên hệ và số tiền
            còn phải thu.
          </p>
        </div>
        <DebtPreview />
      </div>
    </section>
  );
}
