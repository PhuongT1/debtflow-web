# Debt Flow Web

Micro Frontend đa framework: Next.js Platform, Next.js Partner Operations và Angular Payments. Mỗi app có package, alias, env, CI, build artifact và release riêng; không app nào import source của app khác.

## Kiến trúc

Platform sở hữu duy nhất Header, Sidebar, session và global feedback. Remote chỉ render domain content khi chạy trong Platform.

| App                   | Framework | Port | Route         | Composition            | Layout       |
| --------------------- | --------- | ---: | ------------- | ---------------------- | ------------ |
| @debtflow/platform       | Next.js   | 3000 | core/auth/API | root composer          | main/minimal |
| @debtflow/partner-ops | Next.js   | 3001 | /parties/**   | isolated content frame | main         |
| @debtflow/payments    | Angular   | 3002 | / standalone; /payments composed | Web Component          | main         |

main, minimal, none là layout policy; web-component, iframe, route là integration policy. Hai policy độc lập nên app Angular/React/Vue không bị ép dùng chung runtime.

## Bản đồ runtime local

Mỗi app chạy bằng process và port riêng; đây là điều bình thường của Micro Frontend. Không có app nào cần import source của app khác.

| App | Chạy riêng | Khi chạy qua Platform | Chủ sở hữu |
| --- | --- | --- | --- |
| Platform | http://localhost:3000 | http://localhost:3000 | auth, BFF, Header, Sidebar, điều phối route |
| Partner Ops | http://localhost:3001/parties | http://localhost:3000/parties | nghiệp vụ đối tác (khách hàng/NCC) |
| Payments | http://localhost:3002/ | http://localhost:3000/payments | nghiệp vụ thanh toán |

Trong lúc phát triển một domain, chỉ chạy app đó. Chỉ dùng `dev:partner-stack`, `dev:payments-stack` hoặc `dev:all` khi cần kiểm tra việc tích hợp. Nếu báo `EADDRINUSE`, process cũ đang giữ port: dừng terminal cũ bằng `Ctrl+C` rồi chạy lại, không đổi port ngẫu nhiên.

## Cài đặt

Yêu cầu Node 20+, npm 10+, debtflow-api port 4000.

```bash
npm ci
cp apps/platform/.env.example apps/platform/.env.local
cp apps/partner-ops/.env.example apps/partner-ops/.env.local
openssl rand -base64 32
```

Đặt kết quả vào AUTH_SECRET. Không commit .env.local và không đưa secret vào browser env.

## Chạy local

| Mục tiêu            | Command                         | URL                            |
| ------------------- | ------------------------------- | ------------------------------ |
| Chỉ Platform/core      | npm run dev                     | http://localhost:3000          |
| Platform + Partner     | npm run dev:partner-stack       | http://localhost:3000/parties  |
| Platform + Payments    | npm run dev:payments-stack      | http://localhost:3000/payments |
| Tất cả              | npm run dev:all                 | http://localhost:3000          |
| Partner standalone  | npm run dev:partner-ops         | http://localhost:3001/parties  |
| Payments standalone | npm run dev:payments | http://localhost:3002/ |

Sau khi đổi env/rewrite, stop và chạy lại. Plain npm run dev cố ý tắt remote routes. Khi compose, Platform tải manifest/assets trực tiếp từ PAYMENTS_ORIGIN. Namespace nội bộ /__mfe chỉ dành cho adapter iframe tương thích; không phải URL public của Payments.

## Dependency, alias và state

Cài package đúng owner:

```bash
npm install <package> -w @debtflow/platform
npm install <package> -w @debtflow/partner-ops
npm install <package> -w @debtflow/payments
```

Mỗi app khai báo version/alias riêng. npm có thể hoist package tương thích để tiết kiệm disk nhưng không thay ownership. Architecture checker chặn undeclared hoisted import, alias thoát app, app-to-app import và framework dependency trong neutral package.

Shared packages: mfe-registry (topology contract), contracts (wire types), navigation, design-tokens, platform-sdk và React-only adapters. State ưu tiên URL -> NestJS API -> session/HttpOnly cookie -> versioned invalidation event. Không share Redux/Angular service/query cache/access token giữa app.

## Check/build

```bash
npm run check
npm run check:platform
npm run check:partner-ops
npm run check:payments
npm run build:platform
npm run build:partner-ops
npm run build:payments
```

Xem [architecture](docs/architecture.md), [layout composition](docs/layout-composition.md), [deployment](docs/deployment.md), [add app](docs/adding-a-frontend-zone.md) và [alias policy](docs/standards/aliases.md).
