# Production Deployment & Hosting Guide

This document outlines the independent deployment strategy for all micro frontend applications and shared assets within the **Debt Flow Web** workspace.

---

## 1. Deployment Topology

Each application in `apps/` is independently buildable, deployable, and scalable:

- **Host App (`apps/shell`):** Next.js 15 App Router running in Node.js/Serverless environment.
- **Partner Operations (`apps/partner-ops`):** Next.js 15 App Router running in Node.js/Serverless environment.
- **Payments (`apps/payments`):** Angular 19 compiled to static assets (`dist/payments/browser/`). Can be hosted on any Static Web Hosting / CDN (AWS S3, Cloudflare Pages, Vercel Static, Nginx).

---

## 2. Vercel Multi-Project Deployment (Native Monorepo Standard)

Vercel natively supports NPM/Turborepo monorepos via `turbo.json`. **No complex CLI commands or override scripts are required.**

In Vercel, create three separate projects pointing to the same repository with the following standard settings:

### Project 1: `@debtflow/shell` (Host)
- **Root Directory:** `apps/shell`
- **Include files outside root directory:** ✅ **YES / Enabled** (Default in Vercel Monorepo)
- **Install Command:** *(Leave default / disabled)*
- **Build Command:** *(Leave default / disabled)*
- **Environment Variables:**
  ```env
  AUTH_SECRET=your_32_byte_secret
  API_URL=https://api.yourdomain.com/api
  PARTNER_OPS_ENABLED=true
  PARTNER_OPS_ORIGIN=https://partner-ops.yourdomain.com
  PAYMENTS_ENABLED=true
  PAYMENTS_ORIGIN=https://payments.yourdomain.com
  ```

### Project 2: `@debtflow/partner-ops` (Remote)
- **Root Directory:** `apps/partner-ops`
- **Include files outside root directory:** ✅ **YES / Enabled**
- **Install Command:** *(Leave default / disabled)*
- **Build Command:** *(Leave default / disabled)*
- **Environment Variables:**
  ```env
  PLATFORM_INTERNAL_ORIGIN=https://app.yourdomain.com
  PARTNER_OPS_ASSET_PREFIX=https://partner-ops.yourdomain.com
  ```

### Project 3: `@debtflow/payments` (Remote)
- **Root Directory:** `apps/payments`
- **Include files outside root directory:** ✅ **YES / Enabled**
- **Framework Preset:** `Angular` (or Other)
- **Output Directory:** `dist/payments/browser`
- **Important:** Ensure CORS headers (`Access-Control-Allow-Origin: *`) are enabled for static assets via `apps/payments/vercel.json`.

---

## 3. Custom Server / Nginx / Docker Deployment

When deploying to private cloud or VPS environments (Docker / Kubernetes):

1. **Build Step:**
   ```bash
   npm ci
   npm run build
   ```
2. **Reverse Proxy (Nginx / Ingress):**
   - Route `https://app.yourdomain.com/` to `apps/shell` container (Port 3000).
   - Route `https://app.yourdomain.com/__mfe/partner-ops/` and `/__embed/` to `apps/partner-ops` container (Port 3001).
   - Serve `apps/payments/dist/payments/browser` directly from Nginx static path with CORS allowed.
   - Route `https://app.yourdomain.com/api/` to `debtflow-api` NestJS backend (Port 4000).

---

## 4. Zero-Downtime Rollback Strategy

Because micro frontends are decoupled:
1. **Remote Rollback:** Roll back a problematic remote app instantly by changing its deployment version or pointing `PARTNER_OPS_ORIGIN` / `PAYMENTS_ORIGIN` back to the previous stable release.
2. **Feature Toggle:** If a remote app fails critically in production, set `PARTNER_OPS_ENABLED=false` or `PAYMENTS_ENABLED=false` in the Shell environment variables to gracefully degrade that specific section without taking down the entire website.

