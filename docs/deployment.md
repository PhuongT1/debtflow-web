# Deployment

Deploy độc lập: apps/platform (Next), apps/partner-ops (Next), apps/payments (Angular static dist/payments/browser). Public product URL là Platform.

Internal runtime proxy:

- /__mfe/partner-ops/** -> Partner origin.
- /partner-ops-static/** -> Partner assets.

Payments is a standalone static remote. Platform reads its runtime manifest and assets directly from `PAYMENTS_ORIGIN`; enable CORS for static assets. This prevents the Platform proxy namespace from becoming a public Payments URL.

User vẫn dùng /parties và /payments nên Header/Sidebar không rời Platform.

## Vercel

Mỗi app là một Vercel Project/Root Directory. Install: npm ci --prefix=../... Build: npm run build. Angular output: dist/payments/browser.

Deploy remotes trước rồi cấu hình Platform:

```env
PARTNER_OPS_ENABLED=true
PARTNER_OPS_ORIGIN=https://<partner-project>
PAYMENTS_ENABLED=true
PAYMENTS_ORIGIN=https://<payments-project>
```

Deploy Platform cuối và smoke-test health/runtime manifest/direct artifact/composed route.

## Provider khác và rollback

Nginx/Ingress/Cloudflare tái tạo internal prefixes, giữ forwarded cookies/host/protocol. Release app độc lập, kiểm tra contract/health, đổi *_ORIGIN/flag rồi smoke test. Rollback origin/deployment; không phục hồi duplicate UI trong Platform. Database migration thuộc API pipeline.
