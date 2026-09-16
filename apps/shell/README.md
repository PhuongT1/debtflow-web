# @debtflow/shell (Host Application)

The Host Container and Root Orchestrator for the Debt Flow Micro Frontend system. It owns authentication, session management, BFF proxy, global AppShell (Header/Sidebar), language switching, and runtime remote composition.

```bash
npm install
cp apps/shell/.env.example apps/shell/.env.local
npm run dev:shell
npm run check:shell
npm run build:shell
npm run start:shell
```

## Environment Configuration

| Variable                                | Description                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `AUTH_URL`                              | Public origin of the Shell host app.                                                                |
| `AUTH_ALLOWED_RETURN_ORIGINS`           | Whitelist of allowed redirect return origins after authentication.                                  |
| `PARTNER_OPS_ORIGIN`, `PAYMENTS_ORIGIN` | Runtime base URLs for remotes (`http://localhost:3001` and `http://localhost:3002` in development). |
