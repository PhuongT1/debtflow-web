import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-width footer-inner">
        <Link className="brand" href="/">
          DebtFlow
        </Link>
        <Link href="/tinh-nang">Khám phá tính năng</Link>
      </div>
    </footer>
  );
}
