# Debt Flow Partner Operations

Next.js MFE sở hữu /parties/**.

Platform compose app qua private entry `/__embed/parties`. URL sản phẩm vẫn là `/parties`; chỉ query filter/pagination nghiệp vụ được gửi đến NestJS API.

Composed mode: Platform sở hữu Header/Sidebar; Partner render content-only trong same-origin isolated frame. Standalone mode: direct domain render React AppShell để isolation test. Business UI chỉ có một bản; navigation dùng versioned postMessage và auth dùng HttpOnly session.

```bash
npm ci
cp apps/partner-ops/.env.example apps/partner-ops/.env.local
npm run dev:partner-stack
# open http://localhost:3000/parties

npm run dev:partner-ops
# isolation: http://localhost:3001/parties

npm run check:partner-ops
npm run build:partner-ops
npm run start:partner-ops
```

Platform port 3000 vẫn cần cho session/API khi chạy isolation. App aliases/packages là local và không import Platform source.
