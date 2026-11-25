import Image from 'next/image';
import Link from 'next/link';

import { loginUrl, siteName } from '@/lib/config/site';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-width header-inner">
        <Link className="brand" href="/">
          <Image
            src="/images/shared/brand/debtflow-mark.svg"
            width={36}
            height={36}
            alt=""
            priority
          />
          {siteName}
        </Link>
        <nav aria-label="Điều hướng chính">
          <Link href="/tinh-nang">Tính năng</Link>
          <Link href="/#xem-demo">Demo</Link>
          {loginUrl && (
            <a className="button button-outline" href={loginUrl}>
              Đăng nhập
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
