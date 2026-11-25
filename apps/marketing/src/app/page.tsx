import { DailyWorkflow } from '@/features/home/daily-workflow/daily-workflow';
import { ProductHero } from '@/features/home/hero/product-hero';
import { ProductShortcuts } from '@/features/home/shortcuts/product-shortcuts';
import { ProductUseCases } from '@/features/home/use-cases/product-use-cases';
import { FeaturedProducts } from '@/features/product/catalog/featured-products';
import { DebtStory } from '@/features/product/debt-demo/debt-story/debt-story';
import { DebtDemoSection } from '@/features/product/debt-demo/ledger/debt-demo-section';
import { ProductQuestions } from '@/features/product/faq/product-questions';
import { pageMetadata } from '@/lib/config/metadata';

export const metadata = pageMetadata(
  'Quản lý công nợ cho doanh nghiệp',
  'Theo dõi khoản phải thu, phải trả, hồ sơ đối tác và lịch sử thanh toán cùng DebtFlow.',
  '/',
);

export default function HomePage() {
  return (
    <>
      <ProductHero />
      <ProductShortcuts />
      <FeaturedProducts />
      <DailyWorkflow />
      <DebtStory />
      <DebtDemoSection />
      <ProductUseCases />
      <ProductQuestions />
    </>
  );
}
