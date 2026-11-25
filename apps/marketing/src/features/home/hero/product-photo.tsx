import Image from 'next/image';

import styles from './product-hero.module.css';

export function ProductPhoto() {
  return (
    <div className={styles.photo}>
      <Image
        src="/images/home/hero/operations-hero.webp"
        alt="Nhóm vận hành kiểm tra chứng từ tại kho"
        fill
        priority
        sizes="(max-width: 760px) 100vw, 48vw"
      />
    </div>
  );
}
