# DebtFlow Marketing

Website công khai giới thiệu DebtFlow và các trang đích quảng cáo. App dùng Next.js App Router và có thể triển khai độc lập với Shell.

## Chạy local

Từ thư mục gốc `debtflow-web`, chạy `npm ci` khi cần cài dependency, sau đó chạy:

```sh
npm run dev:marketing
```

Mở [Marketing trên cổng 3003](http://localhost:3003). Khách có thể xem nội dung ngay. Nếu cần thử nút **Đăng nhập**, chạy thêm `npm run dev:shell` trên cổng 3000.

| Thư mục                                               | Vai trò                                             |
| ----------------------------------------------------- | --------------------------------------------------- |
| `src/app/`                                            | Route, layout, metadata và CSS riêng của route      |
| `src/features/home/{hero,shortcuts,use-cases}/`       | Banner, lối tắt và tình huống sử dụng của trang chủ |
| `src/features/product/catalog/`                       | Dữ liệu và giao diện danh mục tính năng             |
| `src/features/product/debt-demo/{debt-story,ledger}/` | Minh họa chuyển động và sổ công nợ mẫu              |
| `src/features/product/{faq,workflow}/`                | Hỏi đáp và quy trình dùng chung                     |
| `src/components/layout/`                              | Header và footer dùng chung                         |
| `src/lib/config/`                                     | Cấu hình URL và metadata                            |

Ảnh dùng nhiều trang nằm ở `public/images/shared/brand/` hoặc `public/images/shared/product/`. Ảnh banner riêng của trang chủ nằm ở `public/images/home/hero/`. Khi có ảnh dành riêng cho chiến dịch, đặt ở `public/images/campaigns/<slug>/`. TSX và CSS module nằm cùng thư mục chức năng.

Khai báo tính năng trong `src/features/product/catalog/product-features.ts` để bổ sung thẻ, trang chi tiết và mục sitemap. Các chiến dịch có route riêng dưới `src/app/lp/`.

## Kiểm tra và triển khai

```sh
npm run check:marketing
npm run start:marketing
```

`check:marketing` kiểm tra kiến trúc, lint, TypeScript và build. `start:marketing` chạy bản đã build. Đặt các biến bên dưới trước bước build vì nội dung được dựng tĩnh.

- Tạo Vercel Project cho workspace với Root Directory là `apps/marketing` và preset Next.js. Cho phép truy cập workspace files bên ngoài Root Directory để build đọc lockfile và package token dùng chung.
- Đặt `MARKETING_SITE_URL` thành origin công khai của website ở Production để sinh canonical URL và sitemap. Preview gửi `noindex`.
- Đặt `MARKETING_SHELL_URL` thành origin Shell tương ứng để hiển thị nút đăng nhập. Khi chạy `dev:marketing`, mặc định là `http://localhost:3000`.
- Cả hai biến nhận origin HTTP(S), ví dụ `https://app.example.com`. Dùng [mẫu cấu hình](.env.example) cho môi trường local cần tùy chỉnh.
