# @debtflow/payments (Payments Micro Frontend)

Angular 19 Micro Frontend running independently at root (local: `http://localhost:3002/`) and compiled as a W3C Custom Web Component (`<debtflow-payments>`).

- **Standalone Mode** (`http://localhost:3002/`): Standalone test harness for rapid feature development.
- **Composed Mode** (`http://localhost:3000/payments`): The Shell host fetches the runtime manifest directly from `PAYMENTS_ORIGIN`, validates compatibility, lazy-loads `main.js`, and mounts the `<debtflow-payments>` element within `AppShell`.

```bash
npm install
npm run dev:payments-stack
# open http://localhost:3000/payments

npm run dev:payments
# isolation: http://localhost:3002/

npm run check:payments
npm run build:payments
```

