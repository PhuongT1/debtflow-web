# Workspace Map

```text
debtflow-web/
  apps/
    shell/          Next.js platform host, port 3000
    partner-ops/    Next.js parties domain, port 3001
    payments/       Angular payments app, port 3002
  packages/
    platform/       Framework-neutral platform capabilities
      contracts/    Shared types, constants and validators
      navigation/   Project routes and menu data
      registry/     Manifest and per-app registrations
      sdk/          Cross-window/browser integration
    ui/
      react/        React/MUI UI; Next adapters at adapters/next
      tokens/       Framework-neutral TypeScript/CSS visual values
  tooling/          Workspace tooling and documentation viewer
  .ai-rules/        Canonical technical and agent rules
  docs/             Onboarding, architecture, human AI guide
```

## Runtime ownership

Shell owns platform composition. Partner Ops and Payments remain independently deployable applications. A shared workspace does not permit imports from one app's private source into another.

Use [application ownership](apps.md) to locate domain code, [package boundaries](packages.md) for cross-app changes, and [owner instructions](../../apps/shell/AGENTS.md) before implementation.

## Framework versus project conventions

Next.js route files belong to the framework's routing layer. Debtflow's placement of domain code in `features/`, presentation in `components/`, and public integration in packages is a project convention. See [Next.js and React standards](../engineering/frameworks/nextjs/code-placement.md) before changing those boundaries.
