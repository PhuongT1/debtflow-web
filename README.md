# Debt Flow Web — Multi-Framework Micro Frontend Workspace

A production-grade **Micro Frontend Monorepo** combining **Next.js 15 (React 19)** and **Angular 19** with independent CI/CD, autonomous build lifecycles, and zero-runtime framework collision.

---

## 📖 Architecture & Documentation Index

For in-depth architectural decisions, diagrams, and operational guides, please refer to the dedicated documentation in the [docs](docs) directory:

- 🏛️ **[System Architecture & Topology](docs/architecture.md)** — Comprehensive architecture overview with full Mermaid diagrams, integration mechanisms, data flow, and boundary rules.
- � **[Authentication & SSO Flow](docs/authentication-flow.md)** — Complete step-by-step login flow, token storage model, silent token refresh, and multi-domain session sharing.
- �🚀 **[Production Deployment & Hosting](docs/deployment.md)** — Independent deployment guidelines for Vercel, Docker, Nginx reverse proxy, and zero-downtime rollback strategies.
- ➕ **[How to Add a New Micro Frontend](docs/how-to-add-micro-app.md)** — 5-step standardized workflow to introduce a new micro app (Angular, Vue, React, Next.js).
- 🧰 **[Development Standards](docs/development-standards.md)** — Shared ESLint, Prettier, import-boundary, and CI quality workflow.

---

## 1. Applications Map

| Application      | Directory          | Technology       | Port | Public Route                | Composition Strategy                         | Primary Responsibility                                        |
| :--------------- | :----------------- | :--------------- | ---: | :-------------------------- | :------------------------------------------- | :------------------------------------------------------------ |
| **Shell (Host)** | `apps/shell`       | Next.js 15 (RSC) | 3000 | `/`, `/debts`, `/users`,... | Root Container & BFF                         | AppShell (Header/Sidebar), Session Auth, Catch-all MFE Router |
| **Partner Ops**  | `apps/partner-ops` | Next.js 15 (SSR) | 3001 | `/parties/**`               | Same-Origin Isolated Frame                   | Partner & Supplier management domain                          |
| **Payments**     | `apps/payments`    | Angular 19       | 3002 | `/payments`                 | Custom Web Component (`<debtflow-payments>`) | Payment transactions and settlement history (~45 kB bundle)   |

---

## 2. Shared Packages Foundation (`packages/*`)

All packages in `packages/` follow strict **Domain-Driven Design (DDD)** and are **Framework-Agnostic** (pure TypeScript/CSS), enabling seamless consumption by both React and Angular:

| Package                       | Directory                                        | Description                                                                                              |
| :---------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **`@debtflow/contracts`**     | [packages/contracts](packages/contracts)         | Pure TypeScript data models (`AuthUser`, `PaymentRecord`), API Response envelopes, and i18n locale types |
| **`@debtflow/design-tokens`** | [packages/design-tokens](packages/design-tokens) | Shared design tokens & CSS variables (Header 56px, Sidebar 264px/84px, unified palette)                  |
| **`@debtflow/navigation`**    | [packages/navigation](packages/navigation)       | Centralized route ownership, RBAC permissions (`ADMIN`), and bilingual navigation labels (EN / VI)       |
| **`@debtflow/platform-sdk`**  | [packages/platform-sdk](packages/platform-sdk)   | Runtime Event Bus (`CustomEvent`), cookie/storage synchronization for cross-app messaging                |
| **`@debtflow/mfe-registry`**  | [packages/mfe-registry](packages/mfe-registry)   | Manifest registry (`manifest.json`) containing remote origins, health checks, and metadata               |
| **`@debtflow/react-ui`**      | [packages/react-ui](packages/react-ui)           | React component library containing `<AppShell />`, `<AppIcon />`, `<ToastProvider />`, and providers     |

---

## Demo accounts

Test accounts, organizations, roles, and safe local-use guidance are documented in [Demo accounts](docs/demo-accounts.md). The credentials are seed-only and must never be used outside local development.

## 3. Local Development Setup

### Prerequisites

- **Node.js 20+** and **npm 10+**
- Backend API running on **port 4000** (`debtflow-api`)

### Installation

```bash
# 1. Install all monorepo dependencies
npm install

# 2. Setup local environment files
cp apps/shell/.env.example apps/shell/.env.local
cp apps/partner-ops/.env.example apps/partner-ops/.env.local
```

### Development Commands

| Target                            | Command                      | Access URL                     |
| :-------------------------------- | :--------------------------- | :----------------------------- |
| **Start Entire Stack (All Apps)** | `npm run dev:all`            | http://localhost:3000          |
| **Shell Host Only (Core)**        | `npm run dev:shell`          | http://localhost:3000          |
| **Shell + Partner Ops**           | `npm run dev:partner-stack`  | http://localhost:3000/parties  |
| **Shell + Payments**              | `npm run dev:payments-stack` | http://localhost:3000/payments |
| **Partner Ops Standalone**        | `npm run dev:partner-ops`    | http://localhost:3001/parties  |
| **Payments Standalone**           | `npm run dev:payments`       | http://localhost:3002/         |

---

## 4. Quality Checks & Verification

DebtFlow uses one repository-wide Prettier configuration and framework-specific ESLint configurations. Read the [Development Standards](docs/development-standards.md) before changing quality tooling or adding a micro frontend.

```bash
# Apply the repository formatting standard
npm run format

# Verify formatting without changing files
npm run format:check

# Lint every app and shared package
npm run lint

# Full local verification: boundaries, manifests, lint, types, and production builds
npm run check

# Verify one application
npm run check:shell
npm run check:partner-ops
npm run check:payments
```
