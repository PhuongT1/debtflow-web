import Image from 'next/image';
import Link from 'next/link';

import styles from './feature-list.module.css';
import { featurePath, productFeatures } from './product-features';

export function FeatureList() {
  return (
    <ul className={styles.list}>
      {productFeatures.map((feature) => (
        <li key={feature.slug}>
          <Link className={styles.card} href={`${featurePath}/${feature.slug}`}>
            <span className={styles.image}>
              <Image
                src={feature.image}
                alt={feature.imageAlt}
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
            </span>
            <span className={styles.content}>
              <strong>{feature.title}</strong>
              <span>{feature.description}</span>
              <span className={styles.link}>
                Xem chi tiết <span aria-hidden="true">↗</span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
