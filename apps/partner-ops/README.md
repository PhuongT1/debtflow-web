# @debtflow/partner-ops (Partner Operations Remote)

Next.js 15 Micro Frontend owning the Partner & Supplier management domain: public landing page at `/` and workspace management at `/parties/**`.

The Shell host composes this workspace via a private embed entrypoint `/__embed/parties`. The user-facing URL is `/parties`.

- **Standalone Mode** (`http://localhost:3001`): Runs independently with its own local layout and domain navigation.
- **Embedded Mode** (`http://localhost:3000/parties`): Rendered seamlessly within the Shell's `AppShell` container via a Same-Origin Isolated Frame.

```bash
npm install
cp apps/partner-ops/.env.example apps/partner-ops/.env.local
npm run dev:partner-stack
# open http://localhost:3000/parties

npm run dev:partner-ops
# standalone public: http://localhost:3001/
# standalone workspace: http://localhost:3001/parties

npm run check:partner-ops
npm run build:partner-ops
npm run start:partner-ops
```

