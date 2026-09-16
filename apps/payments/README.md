# @debtflow/payments (Payments Micro Frontend)

Angular Micro Frontend running independently at root (local: `http://localhost:3002/`) and compiled as a W3C Custom Web Component (`<debtflow-payments>`).

- **Standalone Mode** (`http://localhost:3002/`): Payments renders its own workspace header, locale selector, authenticated identity (via the existing session proxy), Platform link, and responsive content container.
- **Composed Mode** (`http://localhost:3000/payments`): The Shell host fetches the runtime manifest directly from `PAYMENTS_ORIGIN`, validates compatibility, lazy-loads `main.js`, and mounts `<debtflow-payments>` within `AppShell`. Payments renders domain content only, so global navigation/account controls are never duplicated.

## Composition contract

The Shell sets `data-host-version="1"` on `<debtflow-payments>`. That explicit host marker selects composed mode; its absence selects standalone mode. Do not infer embedding from the browser window: a Web Component runs in the same window as the Shell.

`shellOrigin` is deployment configuration. It is set to `http://localhost:3000` in development. Configure it to the approved Platform origin for a standalone production deployment; otherwise the app intentionally does not render Platform/login links that would navigate to an incorrect origin.

```bash
npm install
npm run dev:payments-stack
# open http://localhost:3000/payments

npm run dev:payments
# isolation: http://localhost:3002/

npm run check:payments
npm run build:payments
```
