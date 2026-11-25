import Image from 'next/image';
import Link from 'next/link';

import { DebtStory } from '@/features/product/debt-demo/debt-story/debt-story';
import { DebtPreview } from '@/features/product/debt-demo/ledger/debt-preview';
import { ProductQuestions } from '@/features/product/faq/product-questions';
import { ProductWorkflow } from '@/features/product/workflow/product-workflow';
import { loginUrl } from '@/lib/config/site';

import styles from './debt-campaign.module.css';

const title = 'Theo dõi công nợ đến hạn';
const description =
  'Xem ai còn nợ, khoản nào đã quá hạn và số tiền còn phải thu theo từng đối tác.';

export const metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  openGraph: { title, description, type: 'website' as const, locale: 'vi_VN' },
};

export default function DebtCampaignPage() {
  return (
    <>
      <section className={styles.campaign} aria-labelledby="campaign-title">
        <div className={`site-width ${styles.demo}`}>
          <div>
            <h1 id="campaign-title">{title}</h1>
            <p>
              {description} Thử bộ lọc <strong>Quá hạn</strong> với sổ công nợ mẫu.
            </p>
            {loginUrl ? (
              <a className="button button-primary" href={loginUrl}>
                Mở DebtFlow <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link className="button button-primary" href="/tinh-nang/quan-ly-cong-no">
                Tìm hiểu về công nợ <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
          <DebtPreview />
        </div>
      </section>
      <section
        className={`site-width content-section ${styles.story}`}
        aria-labelledby="campaign-story-title"
      >
        <div className={styles.photo}>
          <Image
            src="/images/shared/product/finance-team.webp"
            alt="Nhân viên đối chiếu các khoản công nợ trên máy tính"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
        <div>
          <h2 className="section-title" id="campaign-story-title">
            Chuẩn bị danh sách cần thu trước khi liên hệ
          </h2>
          <p>
            Lọc những khoản đã quá hạn, mở hồ sơ đối tác để tra cứu thông tin, rồi xuất danh sách ra
            Excel khi cần chia sẻ để đối chiếu.
          </p>
          <Link className="text-link" href="/tinh-nang/quan-ly-cong-no">
            Xem tính năng quản lý công nợ <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <DebtStory />
      <ProductWorkflow />
      <ProductQuestions />
    </>
  );
}
