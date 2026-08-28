# Debt Flow Platform

Public composition root sở hữu auth, BFF, Header/Sidebar, global feedback và generic main-layout composer.

```bash
npm ci
cp apps/platform/.env.example apps/platform/.env.local
npm run dev
npm run dev:partner-stack
npm run dev:payments-stack
npm run dev:all
npm run check:platform
npm run build:platform
npm run start:platform
```

Apps layout main được catch-all composer mount. Platform import registry/neutral contracts, không import remote source/framework. Runtime origins đến từ *_ORIGIN env.
