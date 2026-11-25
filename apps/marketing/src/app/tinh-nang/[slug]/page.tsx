import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  featurePath,
  findProductFeature,
  productFeatures,
} from '@/features/product/catalog/product-features';
import { pageMetadata } from '@/lib/config/metadata';

import styles from './feature-detail.module.css';

type FeaturePageProps = Readonly<{ params: Promise<{ slug: string }> }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return productFeatures.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: FeaturePageProps) {
  const feature = findProductFeature((await params).slug);
  if (!feature) notFound();

  return pageMetadata(feature.title, feature.description, `${featurePath}/${feature.slug}`);
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const feature = findProductFeature((await params).slug);
  if (!feature) notFound();

  return (
    <article className="site-width content-section">
      <Link className="text-link" href={featurePath}>
        ← Tất cả tính năng
      </Link>
      <div className={styles.detail}>
        <div className="page-intro">
          <h1>{feature.title}</h1>
          <p>{feature.description}</p>
          <ul className={styles.list}>
            {feature.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
        <div className={styles.photo}>
          <Image
            src={feature.image}
            alt={feature.imageAlt}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 45vw"
          />
        </div>
      </div>
    </article>
  );
}
