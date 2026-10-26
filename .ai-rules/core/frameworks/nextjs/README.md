# Next.js Rules

**Activate:** changing Next.js routes, rendering boundaries, configuration or deployment behavior. **Read boundary:** the affected route, installed version, router configuration and project owner instructions.

- Resolve framework APIs and optional tool prerequisites with the [version-aware evidence policy](../../execution/context.md#use-evidence-for-the-installed-version). A canary checkout is a reference, not the installed application version.
- Determine whether the target uses App Router, Pages Router or both. Preserve that model; adopting these rules does not authorize a router migration.
- For App Router, prefer server rendering where appropriate and introduce a client boundary only for browser interaction/state. Do not expose server-only code or private environment values to client bundles.
- Use routing/navigation APIs supported by the installed router/version. Preserve deep-link query state and validated return targets.
- Keep route files responsible for framework lifecycle and composition. Put reusable presentation/domain logic in the existing feature/application layers rather than adopting another project's directory tree.
- Preserve framework special filenames and route conventions appropriate to the installed router. Ordinary component/module naming follows the project profile and [React structure](../react/structure/README.md).
- Resolve aliases from the owning project's TypeScript/bundler configuration; do not assume an `@/` alias or monorepo layout.
- Keep browser-only integrations and server data/session access separated. Locale routing and authentication ownership come from the project profile.
- Validate changes with the owner's configured commands. Do not write production build output into an active dev server's output directory; isolate the build when they share paths.

**Accept when:** the original route and relevant direct navigation work; server/client boundaries remain valid; the appropriate build/configuration checks pass or their limits are explicit. Apply only affected [React topics](../react/README.md).
