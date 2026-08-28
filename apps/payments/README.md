# @debtflow/payments

Angular Payments MFE chạy độc lập tại domain root (local: http://localhost:3002/) và xuất custom element <debtflow-payments>.

Composed mode: Platform tải runtime manifest trực tiếp từ PAYMENTS_ORIGIN, kiểm tra name/version/element, lazy-load main.js và mount dưới MainLayout. Standalone mode dùng cùng business UI tại root; không copy Header/Sidebar. API đi qua /api: ở local proxy chuyển đến Platform BFF, còn production cấu hình API gateway/Auth domain theo deployment.

```bash
npm ci
npm run dev:payments-stack
# open http://localhost:3000/payments

npm run dev:payments
# isolation: http://localhost:3002/

npm run check:payments
npm run test -w @debtflow/payments -- --watch=false
npm run build:payments
```

Artifact dist/payments/browser chứa main.js, styles.css, remote-manifest.json và health file. Platform từ chối mount nếu version/element không tương thích.
