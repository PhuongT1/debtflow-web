import styles from './debt-story.module.css';
import { DebtStoryPlayer } from './debt-story-player';

export function DebtStory() {
  return (
    <section className={styles.section} id="hanh-trinh-cong-no" aria-labelledby="debt-story-title">
      <div className={`site-width ${styles.inner}`}>
        <div className={styles.intro}>
          <h2 className="section-title" id="debt-story-title">
            Từ khoản phải thu đến số dư còn lại
          </h2>
          <p>
            Đi theo khoản công nợ của Nội thất An Phú. Chọn từng bước để xem hồ sơ, trạng thái quá
            hạn và số dư sau khi thu tiền.
          </p>
        </div>
        <DebtStoryPlayer />
      </div>
    </section>
  );
}
