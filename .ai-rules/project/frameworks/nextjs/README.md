# Debtflow Next.js Extension

**Activate:** Next.js routing, layering, aliases or locale integration in Shell/Partner Ops.

- Resolve Next.js from the affected app before using upstream guides or tools. Use version-matched official docs when bundled docs are unavailable. Runtime MCP and newer canary skills have their own prerequisites; do not assume they exist on this project or upgrade dependencies merely to use them.
- Both apps use App Router. Preserve the current no-locale-route-segments model unless the task explicitly changes it.
- `@/` resolves to the owning app's `src/`, never another app or the workspace root. Cross-feature consumers use deliberate feature public surfaces.
- Routes in `src/app/` own framework composition; domain workflows live in `src/features/`. Reusable presentation is in app components or public `@debtflow/react-ui` exports. Existing Shell endpoint adapters remain in `services/`; do not add a duplicate transport layer.
- Preserve standalone and embedded composition, SDK navigation/session contracts and the actual feature dependency direction.
- Use the relevant app's root build/check scripts. Do not write a production build into an active Next dev server's `.next`.

The reusable [Next.js rules](../../../core/frameworks/nextjs/README.md) own framework requirements. Local owner details remain in the affected app's `AGENTS.md` and architecture rules.
