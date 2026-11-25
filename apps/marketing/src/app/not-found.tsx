import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="site-width content-section page-intro">
      <h1>Không tìm thấy trang</h1>
      <p>Đường dẫn có thể đã thay đổi.</p>
      <Link className="text-link" href="/">
        Về trang chủ
      </Link>
    </section>
  );
}
