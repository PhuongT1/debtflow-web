# Guide: How to Add a New Micro Frontend

This step-by-step guide explains how to add a new Micro Frontend to the **Debt Flow Web** monorepo while maintaining strict architectural boundaries and optimal performance.

---

### Step 1: Create the Application in `apps/<your-app-name>`

- Initialize an independent project using your framework of choice (React, Angular, Vue, Svelte, Next.js, etc.).
- Create its own `package.json`, `tsconfig.json`, linter configuration, and build scripts.
- **Architectural Boundary:** You may only import from framework-neutral shared packages (`@debtflow/contracts`, `@debtflow/design-tokens`, `@debtflow/platform-sdk`). **Never import source files across different apps**.

---

### Step 2: Choose the Integration Mechanism

- **Option A — Lightweight SPA / Widget (Angular, Vue, React, Svelte):**
  - Package your app as a **Custom Web Component** (e.g., `<debtflow-analytics>`).
  - Output a `remote-manifest.json` describing entry scripts and stylesheets.
- **Option B — Full-Stack / SSR Portal (Next.js, Remix):**
  - Integrate via a **Same-Origin Isolated Frame (Iframe)** with a dedicated content-only embed route (e.g., `/__embed/<feature>`).
  - Use the versioned two-way `postMessage` contract for host-remote communication.

---

### Step 3: Register in the Manifest (`packages/mfe-registry/src/manifest.json`)

Declare the new application metadata in the central registry:

```json
{
  "name": "analytics",
  "package": "@debtflow/analytics",
  "version": "0.1.0",
  "framework": "angular",
  "enabledEnv": "ANALYTICS_ENABLED",
  "originEnv": "ANALYTICS_ORIGIN",
  "healthPath": "/health.json",
  "contracts": {
    "api": 1,
    "events": 1
  },
  "composition": {
    "integration": "web-component",
    "layout": "main",
    "publicPath": "/analytics",
    "proxyPath": "/__mfe/analytics",
    "remoteBasePath": "",
    "entryPath": "/remote-manifest.json",
    "elementName": "debtflow-analytics"
  },
  "assetRoutes": []
}
```

---

### Step 4: Add Navigation Menu Item (`packages/navigation/src/index.ts`)

Add the route and menu entry with bilingual labels and role permissions:

```ts
{
  href: "/analytics",
  label: { en: "Analytics", vi: "Phân tích số liệu" },
  icon: "aging",
  group: "workspace",
  owner: "analytics",
}
```

---

### Step 5: Verify & Build

Run automated architecture checks and validation tests before submitting changes:

```bash
npm run check:boundaries  # Verifies that no forbidden cross-app imports exist
npm run check:manifest    # Validates manifest structure against JSON Schema
npm run check             # Runs complete linting, typechecking, and production builds across all workspaces
```
