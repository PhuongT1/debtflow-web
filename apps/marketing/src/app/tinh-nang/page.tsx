import { FeatureList } from '@/features/product/catalog/feature-list';
import { featurePath } from '@/features/product/catalog/product-features';
import { pageMetadata } from '@/lib/config/metadata';

const title = 'Tính năng DebtFlow';
const description = 'Khám phá cách DebtFlow quản lý công nợ, hồ sơ đối tác và thanh toán.';

export const metadata = pageMetadata(title, description, featurePath);

export default function FeaturesPage() {
  return (
    <section className="site-width content-section">
      <div className="page-intro">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <FeatureList />
    </section>
  );
}
